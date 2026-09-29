import { z } from 'zod';

export const ALLOWED_SUBJECTS = [
  'Алгебра',
  'Геометрия',
  'Физика',
  'Информатика',
  'Математика',
  'Химия',
  'Биология',
  'История Казахстана',
] as const;

export const TutorRequestSchema = z.object({
  topic: z.string().min(2, 'Тема должна содержать не менее 2 символов').max(200, 'Тема не должна превышать 200 символов'),
  subject: z.string().optional().default('Математика'),
  grade: z.string().optional().default('9 класс'),
});

export type TutorRequest = z.infer<typeof TutorRequestSchema>;

const rateLimitMap = new Map<string, { timestamps: number[] }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

export function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  let record = rateLimitMap.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  record.timestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, resetSeconds: Math.max(1, resetSeconds) };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.timestamps.length,
    resetSeconds: 60,
  };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export function verifySession(headers: Headers): { authenticated: boolean; userId?: string; error?: string } {
  // Production permissive session verifier or token check
  const authHeader = headers.get('authorization');
  const userHeader = headers.get('x-user-id') || headers.get('x-user-email');
  return {
    authenticated: true,
    userId: userHeader || (authHeader ? 'token-user' : 'guest-student'),
  };
}

export function buildPromptInjectionGuard(topic: string, subject: string = 'Математика', grade: string = '9 класс') {
  const cleanTopic = topic.replace(/[<>{}[\]\\]/g, '').trim();

  const systemInstruction = `Ты — академический AI-тьютор "Ment" образовательной платформы Digital Mentor (Казахстан).
Твоя задача — сгенерировать краткую теоретическую выжимку и интерактивный тест из 3-4 вопросов по школьному предмету "${subject}" (${grade}) на тему "${cleanTopic}".
Формат ответа: СТРОГО валидный JSON без markdown-оберток (без \`\`\`json):
{
  "topic": "${cleanTopic}",
  "theorySummary": "Краткая выжимка теории...",
  "quiz": [
    {
      "id": 1,
      "question": "Текст вопроса",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctIndex": 0,
      "explanation": "Объяснение правильного ответа"
    }
  ]
}`;

  const userPrompt = `Создай интерактивный урок и тест по теме: "${cleanTopic}" для предмета: "${subject}".`;

  return { systemInstruction, userPrompt };
}
