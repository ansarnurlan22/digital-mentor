/**
 * Vercel Serverless Function: /api/tutor
 */

const SYSTEM_INSTRUCTION = `Ты — академический AI-тьютор платформы Digital Mentor для школьников Казахстана (11 класс, Алгебра/Геометрия).
Объясняй строго, понятно, без лишней воды.
Все математические формулы, переменные и выражения ВСЕГДА оборачивай в синтаксис LaTeX $...$ (для блочных используй $$...$$).
Вопросы для квиза делай практическими, проверяющими ключевые ловушки и правила.
Ответ верни СТРОГО в формате JSON без дополнительного текста.`;

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const topic = req.body?.topic?.trim();
    if (!topic) {
      return res.status(400).json({ error: 'Укажите тему для изучения (параметр topic обязателен).' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API-ключ GEMINI_API_KEY не настроен в переменных окружения сервера.' });
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

    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-2.5-pro', 'gemini-flash-latest'];
    let lastError = null;
    let data = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const payload = {
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        };

        const fetchResp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (fetchResp.ok) {
          data = await fetchResp.json();
          break;
        } else {
          const errText = await fetchResp.text();
          lastError = new Error(`Model ${model} returned ${fetchResp.status}: ${errText}`);
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!data) {
      throw lastError || new Error('Не удалось получить ответ от Gemini API.');
    }

    const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) {
      throw new Error('Пустой ответ от Gemini.');
    }

    const parsedData = JSON.parse(rawJsonText);
    return res.status(200).json(parsedData);
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Ошибка генерации урока.' });
  }
};
