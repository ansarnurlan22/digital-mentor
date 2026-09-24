import { NextRequest, NextResponse } from 'next/server';
import {
  TutorRequestSchema,
  checkRateLimit,
  getClientIp,
  verifySession,
  buildPromptInjectionGuard,
} from '@/lib/security';

/**
 * ============================================================================
 * Production Hardened API Route: POST /api/tutor
 * Security Layer: Session Auth -> Rate Limiting -> Zod Validation -> Prompt Defense -> Gemini
 * ============================================================================
 */

export interface TutorQuizItem {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface TutorLessonResponse {
  topic: string;
  theorySummary: string;
  quiz: TutorQuizItem[];
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    // ------------------------------------------------------------------------
    // 1. АВТОРИЗАЦИЯ И ПРОВЕРКА СЕССИИ (Access Control)
    // ------------------------------------------------------------------------
    const sessionAuth = verifySession(req.headers);
    if (!sessionAuth.authenticated) {
      return NextResponse.json(
        {
          error:
            sessionAuth.error ||
            'Неавторизованный запрос. Войдите в систему для использования AI-тьютора.',
        },
        { status: 401 }
      );
    }

    // ------------------------------------------------------------------------
    // 2. ЗАЩИТА ОТ СПАМА И DoS (Rate Limiting: 5 запросов / 60 секунд)
    // ------------------------------------------------------------------------
    const clientIp = getClientIp(req.headers);
    const rateLimitKey = `${clientIp}_${sessionAuth.userId || 'anon'}`;
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            'Слишком много запросов. Подождите 1 минуту перед следующим созданием теста.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetSeconds),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // ------------------------------------------------------------------------
    // 3. ВАЛИДАЦИЯ ВХОДНЫХ ДАННЫХ И САНИТАЙЗИНГ (Zod Schema)
    // ------------------------------------------------------------------------
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Некорректный JSON в теле запроса.' },
        { status: 400 }
      );
    }

    const validationResult = TutorRequestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map((e) => e.message);
      return NextResponse.json(
        {
          error: 'Ошибка валидации входных данных.',
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    const { topic, grade, subject } = validationResult.data;

    // ------------------------------------------------------------------------
    // 4. СЕРВЕРНАЯ ИЗОЛЯЦИЯ: ПРОВЕРКА API-КЛЮЧА
    // ------------------------------------------------------------------------
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[SECURITY ALERT] GEMINI_API_KEY is not defined in server environment');
      return NextResponse.json(
        {
          error:
            'Серверный AI-сервис временно недоступен (отсутствует ключ конфигурации). Обратитесь к администратору.',
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------------------
    // 5. ЗАЩИТА ОТ PROMPT INJECTION (Изоляция темы и защитный промпт)
    // ------------------------------------------------------------------------
    const { systemInstruction, userPrompt } = buildPromptInjectionGuard(topic, subject, grade);

    // Модели в порядке приоритета отказоустойчивости
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-3.5-flash',
      'gemini-2.5-pro',
      'gemini-flash-latest',
    ];

    let lastError: Error | null = null;
    let data: any = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const payload = {
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1, // Низкая вариативность для строгой детерминированности и безопасности
          },
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          data = await response.json();
          break;
        } else {
          const errText = await response.text();
          lastError = new Error(`Model ${model} returned ${response.status}: ${errText}`);
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!data) {
      throw lastError || new Error('Не удалось получить ответ от моделей Gemini.');
    }

    const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) {
      throw new Error('Пустой ответ от сервера AI.');
    }

    // Очистка ответа от Markdown code-fences, если модель их добавила
    const cleanedJsonText = rawJsonText
      .replace(/^```json\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsedData = JSON.parse(cleanedJsonText);

    // Если модель вернула ошибку фильтра безопасности
    if (parsedData.error) {
      return NextResponse.json(
        { error: parsedData.error },
        { status: 400 }
      );
    }

    // Финальная валидация структуры ответа модели
    if (!parsedData.topic || !parsedData.theorySummary || !Array.isArray(parsedData.quiz)) {
      throw new Error('Структура ответа AI-модели не соответствует спецификации JSON.');
    }

    return NextResponse.json(parsedData, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (error: any) {
    // Никогда не возвращаем сырые стеки ошибок или API-ключи клиенту
    console.error('[API ERROR /api/tutor]:', error.message || error);
    return NextResponse.json(
      {
        error: 'Внутренняя ошибка сервиса AI-тьютора. Пожалуйста, повторите попытку позже.',
      },
      { status: 500 }
    );
  }
}
