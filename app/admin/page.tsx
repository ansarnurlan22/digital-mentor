'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  grade: string;
  subject: string;
  hours: number;
  mentor: string;
  loginDate: string;
  status: 'active' | 'blocked';
}

interface HourRequest {
  id: string;
  mentorName: string;
  mentorEmail: string;
  subject: string;
  audience: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'verified';
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'hours' | 'courses'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [hourRequests, setHourRequests] = useState<HourRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [testRole, setTestRole] = useState<'admin' | 'mentor' | 'student'>('admin');

  useEffect(() => {
    // Загрузка данных пользователей
    const initialUsers: User[] = [
      {
        id: 'usr-admin-ansar',
        name: 'Ансар Нурлан',
        email: 'ansarnurlan2@gmail.com',
        role: 'Администратор',
        grade: '11 класс',
        subject: 'SAT Math & Руководитель проекта',
        hours: 180,
        mentor: '',
        loginDate: 'Сегодня, 18:00',
        status: 'active',
      },
      {
        id: 'usr-1',
        name: 'Алихан Сейдалиев',
        email: 'alikhan.seidaliev@gmail.com',
        role: 'Администратор',
        grade: '11 класс',
        subject: 'SAT Math',
        hours: 120,
        mentor: '',
        loginDate: 'Сегодня, 17:30',
        status: 'active',
      },
      {
        id: 'usr-2',
        name: 'Айгерим Муратова',
        email: 'aigerim.m@gmail.com',
        role: 'Ментор',
        grade: '11 класс',
        subject: 'Алгебра',
        hours: 42,
        mentor: '',
        loginDate: 'Сегодня, 16:45',
        status: 'active',
      },
      {
        id: 'usr-3',
        name: 'Арман Тлеубаев',
        email: 'arman.tleubayev@gmail.com',
        role: 'Ментор',
        grade: '10 класс',
        subject: 'Информатика',
        hours: 38,
        mentor: '',
        loginDate: 'Сегодня, 15:10',
        status: 'active',
      },
      {
        id: 'usr-4',
        name: 'Дильназ Каримова',
        email: 'dilnaz.karimova@gmail.com',
        role: 'Ментор',
        grade: '11 класс',
        subject: 'Физика',
        hours: 29.5,
        mentor: '',
        loginDate: 'Вчера, 19:20',
        status: 'active',
      },
      {
        id: 'usr-5',
        name: 'Дамир Жумабеков',
        email: 'damir.zhumabek@gmail.com',
        role: 'Ученик',
        grade: '9 класс',
        subject: 'Алгебра',
        hours: 0,
        mentor: 'Айгерим Муратова',
        loginDate: 'Сегодня, 14:05',
        status: 'active',
      },
      {
        id: 'usr-6',
        name: 'София Ли',
        email: 'sofia.lee@gmail.com',
        role: 'Ученик',
        grade: '10 класс',
        subject: 'Информатика',
        hours: 0,
        mentor: 'Арман Тлеубаев',
        loginDate: 'Сегодня, 11:30',
        status: 'active',
      },
      {
        id: 'usr-7',
        name: 'Санжар Ибраев',
        email: 'sanzhar.ibrayev@gmail.com',
        role: 'Ученик',
        grade: '11 класс',
        subject: 'Физика',
        hours: 0,
        mentor: 'Дильназ Каримова',
        loginDate: '23.09.2026',
        status: 'blocked',
      },
    ];

    const initialHours: HourRequest[] = [
      {
        id: 'req-1',
        mentorName: 'Айгерим Муратова',
        mentorEmail: 'aigerim.m@gmail.com',
        subject: 'Алгебра & Анализ: Тригонометрические формулы',
        audience: 'Дамир Жумабеков (9 класс)',
        date: '2026-09-25',
        time: '16:00 - 17:00',
        duration: 1.0,
        status: 'pending',
      },
      {
        id: 'req-2',
        mentorName: 'Арман Тлеубаев',
        mentorEmail: 'arman.tleubayev@gmail.com',
        subject: 'Python: Динамическое программирование и графы',
        audience: 'Группа 10-11 кл. (София Ли + 3)',
        date: '2026-09-25',
        time: '15:00 - 16:30',
        duration: 1.5,
        status: 'pending',
      },
      {
        id: 'req-3',
        mentorName: 'Дильназ Каримова',
        mentorEmail: 'dilnaz.karimova@gmail.com',
        subject: 'Физика: Законы Ньютона и динамика точки',
        audience: 'Санжар Ибраев (11 класс)',
        date: '2026-09-24',
        time: '18:00 - 19:00',
        duration: 1.0,
        status: 'verified',
      },
    ];

    setUsers(initialUsers);
    setHourRequests(initialHours);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVerifyHour = (reqId: string) => {
    setHourRequests((prev) =>
      prev.map((req) => {
        if (req.id === reqId) {
          // Начисляем часы ментору
          setUsers((uList) =>
            uList.map((u) =>
              u.name === req.mentorName ? { ...u, hours: u.hours + req.duration } : u
            )
          );
          showToast(`✓ Волонтёрские часы (+${req.duration} ч.) начислены ментору ${req.mentorName}`);
          return { ...req, status: 'verified' as const };
        }
        return req;
      })
    );
  };

  const handleToggleBlock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'blocked' ? ('active' as const) : ('blocked' as const);
          showToast(`Статус пользователя ${u.name}: ${nextStatus === 'active' ? 'Активен' : 'Заблокирован'}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Удалить пользователя из базы платформы?')) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('Пользователь успешно удалён');
    }
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    if (editingUser.id) {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
      showToast(`✓ Данные пользователя «${editingUser.name}» обновлены`);
    } else {
      const created = {
        ...editingUser,
        id: `usr-${Date.now()}`,
        loginDate: 'Только что',
      };
      setUsers((prev) => [created, ...prev]);
      showToast(`✓ Новый пользователь «${created.name}» добавлен`);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  const pendingHoursCount = hourRequests.filter((h) => h.status === 'pending').length;
  const totalHoursSum = users.reduce((acc, u) => acc + (u.hours || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-fade-in border border-slate-700">
          <span className="text-emerald-400">●</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & RBAC Hero */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md border border-purple-200">
              Роль: Root Administrator
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Система онлайн
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Панель администратора Digital Mentor</h1>
          <p className="text-slate-500 text-sm mt-1">
            Контроль пользователей, верификация волонтёрских часов и управление учебными группами.
          </p>
        </div>

        {/* Тестовый переключатель роли (RBAC Middleware Simulator) */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold px-2">Тестовая роль:</span>
          <button
            onClick={() => {
              setTestRole('admin');
              showToast('Режим Администратора активен');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              testRole === 'admin' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            🛡️ Админ
          </button>
          <button
            onClick={() => {
              setTestRole('mentor');
              showToast('403 Forbidden: Доступ к /admin отклонён для роли Ментор');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              testRole === 'mentor' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            🎓 Ментор
          </button>
          <button
            onClick={() => {
              setTestRole('student');
              showToast('403 Forbidden: Доступ к /admin отклонён для роли Ученик');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              testRole === 'student' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            🎒 Ученик
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          Обзор (Overview)
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          <span>Пользователи (Users)</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 text-slate-700">
            {users.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('hours')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'hours'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          <span>Волонтёрские часы (Hours & Badges)</span>
          {pendingHoursCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white animate-pulse">
              {pendingHoursCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'courses'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          Курсы и группы (Courses)
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Всего пользователей</span>
              <div className="text-3xl font-extrabold text-blue-600 mt-2">{users.length}</div>
              <span className="text-xs text-slate-400 mt-1 block">+14 за 7 дней</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Активных менторов</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-2">
                {users.filter((u) => u.role === 'Ментор').length}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">100% верифицированы</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Подтверждённых часов</span>
              <div className="text-3xl font-extrabold text-sky-600 mt-2">{totalHoursSum.toFixed(1)} ч.</div>
              <span className="text-xs text-slate-400 mt-1 block">Начислено волонтёрам</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Проведённых уроков</span>
              <div className="text-3xl font-extrabold text-indigo-600 mt-2">512</div>
              <span className="text-xs text-slate-400 mt-1 block">Без срывов и отмен</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Журнал системных событий (Audit Log)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">✓</div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-800">Верифицировано занятие ментора Айгерим Муратовой (+1.0 ч.)</p>
                    <span className="text-[11px] text-slate-400">15 минут назад</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">👤</div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-800">Назначен наставник для Дамира Жумабекова (Алгебра 9 кл.)</p>
                    <span className="text-[11px] text-slate-400">35 минут назад</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">🛡️</div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-800">Система безопасности Middleware: аудит ролей активен</p>
                    <span className="text-[11px] text-slate-400">Сегодня, 10:00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Безопасность и Middleware</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5"></span>
                  <div>
                    <strong className="text-xs text-slate-900 block font-semibold">API Route Guard</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Доступ к /admin и /api/admin/* только при role: admin</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5"></span>
                  <div>
                    <strong className="text-xs text-slate-900 block font-semibold">Supabase RLS & Sessions</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Защищённая аутентификация и изоляция данных</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5"></span>
                  <div>
                    <strong className="text-xs text-slate-900 block font-semibold">1-Click Verification</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Аудит начисления волонтёрских часов в один клик</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="all">Все роли</option>
                <option value="Ученик">Ученики</option>
                <option value="Ментор">Менторы</option>
                <option value="Администратор">Администраторы</option>
              </select>
            </div>
            <button
              onClick={() => {
                setEditingUser({
                  id: '',
                  name: '',
                  email: '',
                  role: 'Ученик',
                  grade: '10 класс',
                  subject: 'Алгебра',
                  hours: 0,
                  mentor: '',
                  loginDate: '',
                  status: 'active',
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              + Добавить пользователя
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">Пользователь</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Роль</th>
                  <th className="py-3 px-4">Класс / Предмет</th>
                  <th className="py-3 px-4">Дата входа</th>
                  <th className="py-3 px-4">Статус</th>
                  <th className="py-3 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-200">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span>{u.name}</span>
                        {u.hours > 0 && (
                          <span className="block text-[11px] text-sky-600 font-normal">{u.hours} ч. волонтёрства</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          u.role === 'Администратор'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : u.role === 'Ментор'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span>{u.grade}</span>
                      <span className="block text-xs text-slate-400">{u.subject}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{u.loginDate}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {u.status === 'active' ? 'Активен' : 'Заблокирован'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleToggleBlock(u.id)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title={u.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
                        >
                          {u.status === 'blocked' ? '🔓' : '🔒'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Volunteer Hours */}
      {activeTab === 'hours' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Заявки на подтверждение волонтёрских часов</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Проверяйте онлайн-уроки и начисляйте волонтёрские часы менторам в 1 клик.
              </p>
            </div>
            <button
              onClick={() => showToast('Баланс часов успешно пересчитан!')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              🔄 Пересчитать баланс
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">Ментор</th>
                  <th className="py-3 px-4">Предмет / Тема</th>
                  <th className="py-3 px-4">Ученик / Аудитория</th>
                  <th className="py-3 px-4">Дата и время</th>
                  <th className="py-3 px-4">Часы</th>
                  <th className="py-3 px-4">Статус</th>
                  <th className="py-3 px-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {hourRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <span>{req.mentorName}</span>
                      <span className="block text-xs font-normal text-slate-400">{req.mentorEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{req.subject}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{req.audience}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <span>{req.date}</span>
                      <span className="block text-slate-400">{req.time}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sky-600">+{req.duration} ч.</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          req.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {req.status === 'pending' ? 'Ожидает проверки' : 'Подтверждено'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'pending' ? (
                        <button
                          onClick={() => handleVerifyHour(req.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                        >
                          ✓ Подтвердить (+{req.duration} ч.)
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                          ✓ Верифицировано
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Courses */}
      {activeTab === 'courses' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Академические дисциплины и группы</h3>
              <p className="text-xs text-slate-500 mt-0.5">Управление активными курсами и мониторинг наполняемости групп.</p>
            </div>
            <button
              onClick={() => showToast('Открыто модальное окно создания курса')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              + Создать новый курс
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">Курс</th>
                  <th className="py-3 px-4">Формат</th>
                  <th className="py-3 px-4">Класс</th>
                  <th className="py-3 px-4">Назначенный ментор</th>
                  <th className="py-3 px-4">Учеников</th>
                  <th className="py-3 px-4">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Digital SAT Math Prep</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">1-на-1</span></td>
                  <td className="py-3.5 px-4 text-slate-600">10-11 класс</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">Ернар Н.</td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">3 / 5 мест</td>
                  <td className="py-3.5 px-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold">Идёт набор</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Информатика & Python (Воркшоп)</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">Воркшоп</span></td>
                  <td className="py-3.5 px-4 text-slate-600">9-11 класс</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">Арман Т.</td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">8 / 12 мест</td>
                  <td className="py-3.5 px-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold">Идёт набор</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD User Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {editingUser.id ? 'Редактирование профиля' : 'Добавить пользователя'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Имя и фамилия</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Email</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Роль</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Ученик">Ученик</option>
                    <option value="Ментор">Ментор</option>
                    <option value="Администратор">Администратор</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Класс</label>
                  <select
                    value={editingUser.grade}
                    onChange={(e) => setEditingUser({ ...editingUser, grade: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="8 класс">8 класс</option>
                    <option value="9 класс">9 класс</option>
                    <option value="10 класс">10 класс</option>
                    <option value="11 класс">11 класс</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Предмет</label>
                  <select
                    value={editingUser.subject}
                    onChange={(e) => setEditingUser({ ...editingUser, subject: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Алгебра">Алгебра</option>
                    <option value="Геометрия">Геометрия</option>
                    <option value="Физика">Физика</option>
                    <option value="Информатика">Информатика</option>
                    <option value="SAT Math">Digital SAT Math</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Волонтёрские часы (ч.)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={editingUser.hours}
                    onChange={(e) => setEditingUser({ ...editingUser, hours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
