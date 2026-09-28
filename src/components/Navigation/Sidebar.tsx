'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import {
  LayoutDashboard,
  Code2,
  Users,
  BookOpen,
  Calendar,
  Award,
  User,
  LogOut,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Дашборд',
    href: '/dashboard',
    icon: (active) => <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: 'Практика',
    href: '/practice',
    icon: (active) => <Code2 className="w-5 h-5 text-blue-400" />,
  },
  {
    name: 'Очередь волонтеров',
    href: '/mentors/tickets',
    icon: (active) => <Users className="w-5 h-5 text-emerald-400" />,
  },
  {
    name: 'Курсы',
    href: '/courses',
    icon: (active) => <BookOpen className="w-5 h-5" />,
  },
  {
    name: 'Расписание',
    href: '/schedule',
    icon: (active) => <Calendar className="w-5 h-5" />,
  },
  {
    name: 'Достижения',
    href: '/achievements',
    icon: (active) => <Award className="w-5 h-5" />,
  },
  {
    name: 'Профиль',
    href: '/profile',
    icon: (active) => <User className="w-5 h-5" />,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useUser();

  const isCurrentRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="w-16 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col items-center py-5 gap-4 sticky top-0 h-screen z-40 transition-colors"
      aria-label="Главная навигация"
    >
      {/* Brand Icon */}
      <Link
        href="/dashboard"
        className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center transition-all shadow-subtle mb-2"
        title="Digital Mentor"
      >
        DM
      </Link>

      {/* Nav List */}
      <nav className="flex flex-col gap-2 flex-1 w-full items-center">
        {NAV_ITEMS.map((item) => {
          const active = isCurrentRoute(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                active
                  ? 'bg-[var(--surface-raised)] text-[var(--foreground)] border border-[var(--border-subtle)] shadow-subtle'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-raised)] border border-transparent'
              }`}
            >
              {item.icon(active)}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        type="button"
        onClick={() => {
          if (confirm('Вы действительно хотите выйти из аккаунта?')) {
            logout();
          }
        }}
        title="Выйти из аккаунта"
        className="w-10 h-10 rounded-md flex items-center justify-center text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
};
