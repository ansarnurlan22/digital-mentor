'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '../../context/UserContext';
import { ThemeToggle } from '../ThemeToggle';
import { Sparkles, Bell, ExternalLink, Code2 } from 'lucide-react';

interface HeaderProps {
  onToggleMentTutor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMentTutor }) => {
  const { user } = useUser();
  const isMentor = user.role === 'Ментор';

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Brand logo & tagline */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-[var(--foreground)]">
          <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            DM
          </div>
          <div>
            <div className="font-bold text-sm leading-none tracking-tight">
              Digital Mentor
            </div>
            <div className="text-[10px] text-[var(--muted)] font-mono leading-none mt-1">
              70% AI · 30% Volunteers · SAT Prep
            </div>
          </div>
        </Link>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick link to practice */}
        <Link
          href="/practice"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border)] hover:border-[var(--border-subtle)] bg-[var(--surface-raised)] text-xs font-medium text-[var(--foreground)] transition-colors"
        >
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Практика</span>
        </Link>

        {/* User Role Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${
            isMentor
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isMentor ? 'bg-blue-500' : 'bg-emerald-500'
            }`}
          />
          <span>{user.role}</span>
        </div>

        {/* AI Tutor Chat Trigger (Ment) */}
        {onToggleMentTutor && (
          <button
            type="button"
            onClick={onToggleMentTutor}
            title="Академический напарник Ment (24/7)"
            className="w-8 h-8 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-blue-400 hover:text-blue-300 hover:border-[var(--border-subtle)] flex items-center justify-center transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* User avatar linking to Profile */}
        <Link
          href="/profile"
          title="Личный профиль"
          className="w-8 h-8 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] font-mono font-bold text-xs flex items-center justify-center hover:border-[var(--border-subtle)] transition-colors"
        >
          {user.avatarText || 'МК'}
        </Link>
      </div>
    </header>
  );
};
