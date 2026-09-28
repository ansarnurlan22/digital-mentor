import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        content: 'Привет! Я академический напарник Digital Mentor. Задавай вопросы по текущей задаче, и мы разберем логику шаг за шагом.',
      });
    }

    const systemPrompt = `Ты — Socrates AI, встроенный напарник платформы Digital Mentor (70% ИИ / 30% Волонтеры).
Твоя цель — направлять ученика через наводящие вопросы и строгие математические интуиции.
Правила:
1. Никаких длинных лекций. Ответы плотные, лаконичные, в стиле Linear/Vercel (до 3-4 предложений).
2. Никогда не пиши готовый финальный код за ученика.
3. Если ученик застрял 3+ раза, напомни ему, что он может вызвать ментора-волонтера (кнопка "Позвать ментора", которая передаст контекст человеку).
Контекст задачи: ${context?.nodeTitle || 'Практика'} (${context?.nodeType || 'step'})
Код ученика:
${context?.userCode || 'Нет кода'}`;

    const formattedContents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...(messages || []).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }],
      })),
    ];

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Давай разберем текущий шаг. Какая часть формулы вызывает сомнение?';

    return NextResponse.json({ content: answer });
  } catch (error: unknown) {
    console.error('Tutor stream error:', error);
    return NextResponse.json(
      { content: 'Кажется, возникла задержка связи с ИИ-тьютором. Проверь свой код на соответствие приоритету математических операций.' },
      { status: 200 }
    );
  }
}
