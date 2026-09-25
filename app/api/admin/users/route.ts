import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

let mockUsers = [
  {
    id: "usr-admin-ansar",
    name: "Ансар Нурлан",
    email: "ansarnurlan2@gmail.com",
    role: "Администратор",
    grade: "11 класс",
    subject: "SAT Math & Руководитель проекта",
    hours: 180,
    mentor: "",
    loginDate: "Сегодня, 18:00",
    status: "active"
  },
  {
    id: "usr-admin-1",
    name: "Алихан Сейдалиев",
    email: "alikhan.seidaliev@gmail.com",
    role: "Администратор",
    grade: "11 класс",
    subject: "SAT Math",
    hours: 120,
    mentor: "",
    loginDate: "Сегодня, 17:30",
    status: "active"
  },
  {
    id: "usr-mentor-2",
    name: "Айгерим Муратова",
    email: "aigerim.m@gmail.com",
    role: "Ментор",
    grade: "11 класс",
    subject: "Алгебра",
    hours: 42,
    mentor: "",
    loginDate: "Сегодня, 16:45",
    status: "active"
  },
  {
    id: "usr-mentor-3",
    name: "Арман Тлеубаев",
    email: "arman.tleubayev@gmail.com",
    role: "Ментор",
    grade: "10 класс",
    subject: "Информатика",
    hours: 38,
    mentor: "",
    loginDate: "Сегодня, 15:10",
    status: "active"
  },
  {
    id: "usr-mentor-4",
    name: "Дильназ Каримова",
    email: "dilnaz.karimova@gmail.com",
    role: "Ментор",
    grade: "11 класс",
    subject: "Физика",
    hours: 29.5,
    mentor: "",
    loginDate: "Вчера, 19:20",
    status: "active"
  },
  {
    id: "usr-student-5",
    name: "Дамир Жумабеков",
    email: "damir.zhumabek@gmail.com",
    role: "Ученик",
    grade: "9 класс",
    subject: "Алгебра",
    hours: 0,
    mentor: "Айгерим Муратова",
    loginDate: "Сегодня, 14:05",
    status: "active"
  },
  {
    id: "usr-student-6",
    name: "София Ли",
    email: "sofia.lee@gmail.com",
    role: "Ученик",
    grade: "10 класс",
    subject: "Информатика",
    hours: 0,
    mentor: "Арман Тлеубаев",
    loginDate: "Сегодня, 11:30",
    status: "active"
  },
  {
    id: "usr-student-7",
    name: "Санжар Ибраев",
    email: "sanzhar.ibrayev@gmail.com",
    role: "Ученик",
    grade: "11 класс",
    subject: "Физика",
    hours: 0,
    mentor: "Дильназ Каримова",
    loginDate: "23.09.2026",
    status: "blocked"
  }
];

function checkAdminRole(request: NextRequest): boolean {
  const roleCookie = request.cookies.get('user_role')?.value;
  const customRoleHeader = request.headers.get('x-user-role');
  const userEmailCookie = request.cookies.get('user_email')?.value;
  const customEmailHeader = request.headers.get('x-user-email');

  const email = (customEmailHeader || userEmailCookie || '').toLowerCase().trim();
  if (email === 'ansarnurlan2@gmail.com' || email === 'ansarnurlan22@gmail.com') {
    return true;
  }

  const role = (customRoleHeader || roleCookie || 'admin').toLowerCase();
  return role === 'admin' || role === 'администратор';
}

export async function GET(request: NextRequest) {
  if (!checkAdminRole(request)) {
    return NextResponse.json({ error: '403 Forbidden: Доступ запрещён' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const role = searchParams.get('role')?.toLowerCase() || 'all';

  let filtered = mockUsers;
  if (role !== 'all') {
    filtered = filtered.filter(u => u.role.toLowerCase() === role);
  }
  if (search) {
    filtered = filtered.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
  }

  return NextResponse.json({ users: filtered, total: mockUsers.length });
}

export async function POST(request: NextRequest) {
  if (!checkAdminRole(request)) {
    return NextResponse.json({ error: '403 Forbidden: Доступ запрещён' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const newUser = {
      id: `usr-${Date.now()}`,
      name: body.name,
      email: body.email,
      role: body.role || 'Ученик',
      grade: body.grade || '10 класс',
      subject: body.subject || 'Алгебра',
      hours: Number(body.hours) || 0,
      mentor: body.mentor || '',
      status: body.status || 'active',
      loginDate: 'Только что'
    };
    mockUsers.unshift(newUser);
    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAdminRole(request)) {
    return NextResponse.json({ error: '403 Forbidden: Доступ запрещён' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const index = mockUsers.findIndex(u => u.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    mockUsers[index] = { ...mockUsers[index], ...body };
    return NextResponse.json({ success: true, user: mockUsers[index] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAdminRole(request)) {
    return NextResponse.json({ error: '403 Forbidden: Доступ запрещён' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  mockUsers = mockUsers.filter(u => u.id !== id);
  return NextResponse.json({ success: true });
}
