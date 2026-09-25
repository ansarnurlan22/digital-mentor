import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

let mockHours = [
  {
    id: "req-1",
    mentorName: "Айгерим Муратова",
    mentorEmail: "aigerim.m@gmail.com",
    subject: "Алгебра & Анализ: Тригонометрические формулы",
    audience: "Дамир Жумабеков (9 класс)",
    date: "2026-09-25",
    time: "16:00 - 17:00",
    duration: 1.0,
    status: "pending"
  },
  {
    id: "req-2",
    mentorName: "Арман Тлеубаев",
    mentorEmail: "arman.tleubayev@gmail.com",
    subject: "Python: Динамическое программирование и графы",
    audience: "Группа 10-11 кл. (София Ли + 3)",
    date: "2026-09-25",
    time: "15:00 - 16:30",
    duration: 1.5,
    status: "pending"
  },
  {
    id: "req-3",
    mentorName: "Дильназ Каримова",
    mentorEmail: "dilnaz.karimova@gmail.com",
    subject: "Физика: Законы Ньютона и динамика точки",
    audience: "Санжар Ибраев (11 класс)",
    date: "2026-09-24",
    time: "18:00 - 19:00",
    duration: 1.0,
    status: "verified"
  }
];

function checkAdminRole(request: NextRequest): boolean {
  const roleCookie = request.cookies.get('user_role')?.value;
  const customRoleHeader = request.headers.get('x-user-role');
  const role = (customRoleHeader || roleCookie || 'admin').toLowerCase();
  return role === 'admin' || role === 'администратор';
}

export async function GET(request: NextRequest) {
  if (!checkAdminRole(request)) {
    return NextResponse.json({ error: '403 Forbidden: Доступ запрещён' }, { status: 403 });
  }

  return NextResponse.json({
    hours: mockHours,
    pendingCount: mockHours.filter(h => h.status === 'pending').length
  });
}

export async function POST(request: NextRequest) {
  if (!checkAdminRole(request)) {
    return NextResponse.json({ error: '403 Forbidden: Доступ запрещён' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id } = body;
    const reqItem = mockHours.find(h => h.id === id);
    if (!reqItem) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    reqItem.status = 'verified';
    return NextResponse.json({
      success: true,
      message: `Волонтёрские часы (+${reqItem.duration} ч.) начислены ментору ${reqItem.mentorName}`,
      req: reqItem
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
