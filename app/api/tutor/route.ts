import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface TutorQuizItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TutorLessonResponse {
  topic: string;
  theory: {
    keyPoints: string[];
    summarySteps: string[];
  };
  quiz: TutorQuizItem[];
}

// In-memory rate limiter: 5 requests per 60 seconds per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_COUNT) {
    return false;
  }

  record.count += 1;
  return true;
}

const SYSTEM_INSTRUCTION = `You are an expert academic tutor for Kazakhstani school curriculum (grades 7-12). Generate a structured lesson module. Return ONLY valid JSON matching the exact schema below. No markdown fences, no text outside JSON.

SCHEMA:
{
  "topic": "exact topic name",
  "theory": {
    "keyPoints": [
      "Point 1: Real factual explanation with specific details, formulas, rules",
      "Point 2: Core formula or law with mathematical notation if applicable",  
      "Point 3: Worked example with specific numbers/values",
      "Point 4: Common mistakes and how to avoid them"
    ],
    "summarySteps": [
      "Step 1: specific action",
      "Step 2: specific action",
      "Step 3: specific action"
    ]
  },
  "quiz": [
    {
      "id": 1,
      "question": "Actual problem requiring calculation or knowledge recall",
      "options": ["Correct answer (specific)", "Wrong option 1", "Wrong option 2", "Wrong option 3"],
      "correctIndex": 0,
      "explanation": "Why option 0 is correct with brief proof"
    }
  ]
}

RULES:
- ALL content in Russian language
- For math topics: use actual formulas like D = b²-4ac, actual numbers in examples
- For physics: include SI units, actual laws (F=ma, etc)
- For language: real grammar rules with examples
- correctIndex is ALWAYS 0 (correct answer is always first option)
- Generate exactly 4 quiz questions
- keyPoints must have exactly 4 items with REAL substance, not placeholders
- NEVER write abstract phrases like 'последовательный анализ' or 'структурировать данные'`;

async function callGeminiAPI(model: string, userPrompt: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: [{
        parts: [{ text: userPrompt }],
      }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${model}): ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error(`Invalid response format from Gemini API (${model})`);
  }

  return text;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { topic, grade, subject } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (topic.length > 200) {
      return NextResponse.json({ error: 'Topic is too long (max 200 characters)' }, { status: 400 });
    }

    const userPrompt = `Тема: ${topic}. Предмет: ${subject || 'Общеобразовательный'}. Класс: ${grade || '9 класс'}. Язык ответа: русский.`;

    const models = ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let rawResponse = '';
    let lastError: Error | null = null;

    for (const model of models) {
      try {
        rawResponse = await callGeminiAPI(model, userPrompt, apiKey);
        break; // Success
      } catch (e: any) {
        console.error(`Model ${model} failed:`, e.message);
        lastError = e;
      }
    }

    if (!rawResponse) {
      console.error('All models failed. Last error:', lastError);
      return NextResponse.json({ error: 'Failed to generate response from AI' }, { status: 500 });
    }

    // Clean markdown fences
    let jsonStr = rawResponse.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(json)?\n/i, '');
      jsonStr = jsonStr.replace(/\n```$/i, '');
    }

    let parsedResponse: TutorLessonResponse;
    try {
      parsedResponse = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', jsonStr);
      return NextResponse.json({ error: 'AI returned invalid JSON format' }, { status: 500 });
    }

    // Validate structure
    if (
      !parsedResponse.topic ||
      !parsedResponse.theory ||
      !Array.isArray(parsedResponse.theory.keyPoints) ||
      !Array.isArray(parsedResponse.theory.summarySteps) ||
      !Array.isArray(parsedResponse.quiz)
    ) {
      console.error('AI response failed validation:', parsedResponse);
      return NextResponse.json({ error: 'AI response missing required fields' }, { status: 500 });
    }

    return NextResponse.json(parsedResponse, { status: 200 });

  } catch (error: any) {
    console.error('Unexpected error in tutor API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
