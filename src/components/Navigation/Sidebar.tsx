'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../../context/UserContext';

interface NavItem {
  name: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Дашборд',
    href: '/dashboard',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
        <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
      </svg>
    ),
  },
  {
    name: 'Курсы',
    href: '/courses',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
  },
  {
    name: 'Расписание',
    href: '/schedule',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
  },
  {
    name: 'Достижения',
    href: '/achievements',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"></circle>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"></path>
      </svg>
    ),
  },
  {
    name: 'Профиль',
    href: '/profile',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
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
      style={{
        width: '76px',
        backgroundColor: '#0F172A',
        borderRight: '1px solid rgba(148, 163, 184, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 0',
        gap: '20px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        zIndex: 50,
      }}
      aria-label="Главная навигация"
    >
      {/* Brand Icon */}
      <Link
        href="/dashboard"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '13px',
          background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 800,
          fontSize: '20px',
          color: '#FFFFFF',
          textDecoration: 'none',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
          marginBottom: '16px',
        }}
        title="Digital Mentor"
      >
        D
      </Link>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, width: '100%', alignItems: 'center' }}>
        {NAV_ITEMS.map((item) => {
          const active = isCurrentRoute(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: active ? '#0284C7' : 'transparent',
                color: active ? '#FFFFFF' : '#94A3B8',
                boxShadow: active ? '0 0 18px rgba(56, 189, 248, 0.45)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                textDecoration: 'none',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
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
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'transparent',
          border: 'none',
          color: '#64748B',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#EF4444';
          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#64748B';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </aside>
  );
};
