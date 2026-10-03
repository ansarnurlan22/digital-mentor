import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        content: 'Привет! Я Academic Mentor AI. К сожалению, ключ API не настроен. Пожалуйста, обратитесь к администратору.',
      });
    }

    const studentName = context?.studentName || 'ученик';
    const subject = context?.subject || 'школьный предмет';
    const grade = context?.studentGrade || '9 класс';

    const systemPrompt = `Ты — «Digital Mentor AI», академический напарник ученика на образовательной платформе Digital Mentor (Казахстан).

КОНТЕКСТ УЧЕНИКА:
- Имя: ${studentName}
- Предмет: ${subject}
- Класс: ${grade}

ТВОЯ ГЛАВНАЯ ЦЕЛЬ:
Помогать ${studentName} глубоко понять материал по предмету «${subject}», используя Сократовский метод — направляя к пониманию через точные объяснения и вопросы, НЕ давая готовые ответы к задачам.

ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА:
1. ВСЕГДА отвечай конкретно на вопрос ученика — объясняй суть темы, что это такое, как работает.
2. НИКОГДА не давай финальный готовый числовой ответ к задаче — веди пошагово.
3. Структура ответа на каждый вопрос:
   a) Кратко объясни принцип/формулу/правило (2-4 предложения с реальным содержанием)
   b) Задай ОДИН направляющий вопрос к следующему шагу
4. Математические формулы: инлайн $x^2 - 4 = 0$, блочные $$D = b^2 - 4ac$$
5. Тон: дружелюбный, поддерживающий, краткий
6. Язык: ТОЛЬКО русский
7. Если ученик пишет «не понимаю» — начни объяснение с самых основ с простым примером
8. Отвечай РАЗНООБРАЗНО — каждый ответ должен быть уникальным под конкретный вопрос

ЗАПРЕЩЕНО:
- Отвечать одним и тем же шаблоном на разные вопросы
- Игнорировать конкретику вопроса ученика
- Писать только общие слова без реального объяснения темы`;

    // Формируем историю чата: системный промпт + история + текущий вопрос
    const chatHistory = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      {
        role: 'model',
        parts: [{ text: `Понял! Готов помогать ${studentName} по предмету «${subject}» (${grade}) в стиле Сократовского диалога. Буду объяснять темы и задавать направляющие вопросы.` }],
      },
    ];

    // Добавляем историю диалога (кроме последнего сообщения)
    const msgList = messages || [];
    const historyMessages = msgList.slice(0, -1);
    for (const m of historyMessages) {
      if (m.content && m.content.trim()) {
        chatHistory.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        });
      }
    }

    // Текущий вопрос ученика
    const lastMsg = msgList[msgList.length - 1];
    const userQuestion = lastMsg?.content || context?.userCode || '';
    if (userQuestion.trim()) {
      chatHistory.push({
        role: 'user',
        parts: [{ text: userQuestion }],
      });
    }

    const models = ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let lastError: string = '';

    for (const model of models) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: chatHistory,
            generationConfig: {
              temperature: 0.75,
              maxOutputTokens: 900,
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          lastError = `${model}: ${res.status} ${errText}`;
          continue;
        }

        const data = await res.json();
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (answer) {
          return NextResponse.json({ content: answer });
        }
        lastError = `${model}: пустой ответ`;
      } catch (e: unknown) {
        lastError = `${model}: ${e instanceof Error ? e.message : String(e)}`;
      }
    }

    console.error('[tutor-stream] All models failed:', lastError);
    return NextResponse.json({
      content: 'Сервис AI временно недоступен. Попробуй задать вопрос ещё раз через несколько секунд.',
    });
  } catch (error: unknown) {
    console.error('[tutor-stream] Unexpected error:', error);
    return NextResponse.json(
      { content: 'Кажется, возникла задержка связи с AI. Попробуй отправить вопрос ещё раз.' },
      { status: 200 }
    );
  }
}
