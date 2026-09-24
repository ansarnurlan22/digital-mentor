import { NextRequest, NextResponse } from 'next/server';

/**
 * Server API Endpoint for Digital Mentor AI Tutor
 * Uses Google Gemini API to generate structured theory summary + interactive quiz
 */

// Системный промпт согласно спецификации Digital Mentor
const SYSTEM_INSTRUCTION = `Ты — академический AI-тьютор платформы Digital Mentor для школьников Казахстана (11 класс, Алгебра/Геометрия).
Объясняй строго, понятно, без лишней воды.
Все математические формулы, переменные и выражения ВСЕГДА оборачивай в синтаксис LaTeX $...$ (для блочных используй $$...$$).
Вопросы для квиза делай практическими, проверяющими ключевые ловушки и правила.
Ответ верни СТРОГО в формате JSON без дополнительного текста.`;

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
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = body?.topic?.trim();

    if (!topic) {
      return NextResponse.json(
        { error: 'Укажите тему для изучения (параметр topic обязателен).' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API-ключ GEMINI_API_KEY не настроен в переменных окружения сервера.' },
        { status: 500 }
      );
    }

    const userPrompt = `Составь компактную академическую выжимку теории и интерактивный мини-тест из 3–4 практических вопросов по теме: «${topic}».

Требования к JSON:
{
  "topic": "${topic}",
  "theorySummary": "Краткая суть, строгий алгоритм решения и ключевые формулы в синтаксисе LaTeX $...$. Разбивай на абзацы и списки.",
  "quiz": [
    {
      "id": 1,
      "question": "Текст вопроса с формулами в $...$",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctIndex": 0,
      "explanation": "Краткое и строгое математическое пояснение, почему этот ответ верный."
    }
  ]
}`;

    // Модели в порядке приоритета (gemini-2.5-flash -> gemini-3.5-flash -> gemini-2.5-pro)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-2.5-pro', 'gemini-flash-latest'];
    let lastError: any = null;
    let data: any = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const payload = {
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
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
      } catch (err) {
        lastError = err;
      }
    }

    if (!data) {
      throw lastError || new Error('Не удалось получить ответ от моделей Gemini.');
    }

    const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) {
      throw new Error('Пустой ответ от Gemini API.');
    }

    // Парсим и валидируем JSON
    const parsedData: TutorLessonResponse = JSON.parse(rawJsonText);

    if (!parsedData.topic || !parsedData.theorySummary || !Array.isArray(parsedData.quiz)) {
      throw new Error('Структура ответа модели не соответствует ожидаемой схеме JSON.');
    }

    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: any) {
    console.error('Ошибка в API /api/tutor:', error);
    return NextResponse.json(
      {
        error: error.message || 'Внутренняя ошибка генерации урока Gemini AI.',
      },
      { status: 500 }
    );
  }
}
