'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '../../context/UserContext';

interface HeaderProps {
  onToggleMentTutor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMentTutor }) => {
  const { user } = useUser();
  const isMentor = user.role === 'Ментор';

  return (
    <header
      style={{
        height: '76px',
        backgroundColor: 'rgba(8, 14, 30, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 36px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxSizing: 'border-box',
      }}
    >
      {/* Brand logo & tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'rgba(56, 189, 248, 0.14)',
            color: '#38BDF8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 800,
            fontSize: '15px',
          }}
        >
          DM
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '16px', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Digital Mentor
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            Академическое наставничество · Астана
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* User Role Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '999px',
            backgroundColor: isMentor ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.12)',
            border: isMentor ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '12px',
            fontWeight: 700,
            color: isMentor ? '#93C5FD' : '#6EE7B7',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isMentor ? '#3B82F6' : '#10B981',
            }}
          />
          Роль: {user.role}
        </div>

        {/* Notifications button */}
        <button
          type="button"
          title="Уведомления"
          onClick={() => alert('У вас нет новых уведомлений. Все системы в норме!')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            color: '#94A3B8',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>

        {/* AI Tutor Chat Trigger (Ment) */}
        <button
          type="button"
          onClick={onToggleMentTutor}
          title="Академический напарник Ment (24/7)"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38BDF8',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            transition: 'all 0.2s ease',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 18px rgba(56, 189, 248, 0.4)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        {/* User avatar linking to Profile */}
        <Link
          href="/profile"
          title="Перейти в личный профиль"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '13px',
            display: 'grid',
            placeItems: 'center',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {user.avatarText || 'МК'}
        </Link>
      </div>
    </header>
  );
};
