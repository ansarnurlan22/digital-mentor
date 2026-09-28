'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMentorTicketStore } from '../../../src/lib/store/mentorTicketStore';
import { useUser } from '../../../src/context/UserContext';
import { ThemeToggle } from '../../../src/components/ThemeToggle';
import { MicroTicket, TicketStatus } from '../../../src/lib/supabase/types';
import {
  Users,
  CheckCircle2,
  Clock,
  Code2,
  Sparkles,
  ArrowRight,
  Award,
  ChevronLeft,
  Filter,
  Check,
  X,
  Send,
  ExternalLink,
} from 'lucide-react';

export default function MentorTicketsPage() {
  const { user } = useUser();
  const {
    tickets,
    isLoading,
    filterStatus,
    activeResolvingTicket,
    mentorAnswerText,
    setFilterStatus,
    setActiveResolvingTicket,
    setMentorAnswerText,
    fetchTickets,
    subscribeToRealtimeTickets,
    claimTicket,
    resolveTicket,
  } = useMentorTicketStore();

  useEffect(() => {
    fetchTickets();
    const unsubscribe = subscribeToRealtimeTickets();
    return () => unsubscribe();
  }, [fetchTickets, subscribeToRealtimeTickets]);

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;
  const resolvedTicketsCount = tickets.filter((t) => t.status === 'resolved').length;
  const totalVolunteerHours = (resolvedTicketsCount * 15) / 60;

  const handleClaim = async (ticket: MicroTicket) => {
    await claimTicket(ticket.id, user.email || 'mentor-user', user.name || 'Волонтер');
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResolvingTicket || !mentorAnswerText.trim()) return;
    await resolveTicket(activeResolvingTicket.id, mentorAnswerText.trim(), 15);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col">
      {/* 1. Header */}
      <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Вернуться в студию</span>
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-xs font-semibold text-[var(--foreground)]">
            Очередь микро-тикетов (30% Волонтерский слой)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-raised)]">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[var(--muted)]">Начислено часов:</span>
            <span className="font-mono font-bold text-emerald-400">{totalVolunteerHours.toFixed(1)} ч.</span>
          </div>

          <Link
            href={`/verify/DM-MENTOR-2026`}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
            title="Проверить сертификат верификации"
          >
            <span>Сертификат</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <ThemeToggle />
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Top Summary Banner */}
        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              Realtime-очередь запросов на академическую помощь
            </h1>
            <p className="text-xs text-[var(--muted)] max-w-2xl leading-relaxed">
              Архитектура платформы передает волонтерам только сложные кейсы, когда ученик не смог решить задачу с помощью 70% ИИ. Каждый разобранный микро-тикет подтверждает{' '}
              <strong className="text-emerald-400 font-semibold">15 минут волонтерского стажа</strong> с записью в реестр верификации.
            </p>
          </div>

          {/* Metric cards */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-center min-w-[90px]">
              <div className="text-lg font-bold font-mono text-amber-400">{openTicketsCount}</div>
              <div className="text-[10px] uppercase font-mono text-[var(--muted)]">Ждут помощи</div>
            </div>

            <div className="px-4 py-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-center min-w-[90px]">
              <div className="text-lg font-bold font-mono text-emerald-400">{resolvedTicketsCount}</div>
              <div className="text-[10px] uppercase font-mono text-[var(--muted)]">Решено</div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-1">
            {(['all', 'open', 'in_progress', 'resolved'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-[var(--surface-raised)] text-[var(--foreground)] border border-[var(--border)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                {status === 'all' && 'Все тикеты'}
                {status === 'open' && 'Открытые'}
                {status === 'in_progress' && 'В работе'}
                {status === 'resolved' && 'Решённые'}
              </button>
            ))}
          </div>

          <div className="text-xs text-[var(--muted)] font-mono">
            Найдено: {filteredTickets.length}
          </div>
        </div>

        {/* Tickets Feed */}
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--muted)] text-xs">
            Нет тикетов в данной категории.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const isOpen = ticket.status === 'open';
              const isInProgress = ticket.status === 'in_progress';
              const isResolved = ticket.status === 'resolved';

              return (
                <div
                  key={ticket.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-subtle)] transition-all p-5 space-y-4 shadow-subtle"
                >
                  {/* Ticket Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOpen
                            ? 'bg-amber-400 status-dot-pulse'
                            : isInProgress
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span className="font-mono text-xs font-bold text-[var(--foreground)]">
                        #{ticket.id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-[var(--muted)] font-medium">·</span>
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        {ticket.student?.full_name || 'Ученик'}
                      </span>
                      <span className="text-xs text-[var(--muted)]">·</span>
                      <span className="text-xs text-[var(--muted)] font-mono">
                        {ticket.node?.title || 'Практический узел'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
                          isOpen
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : isInProgress
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isOpen && 'Ожидает волонтера'}
                        {isInProgress && 'В процессе'}
                        {isResolved && '✓ Решено'}
                      </span>

                      <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>+{ticket.awarded_minutes || 15} мин</span>
                      </span>
                    </div>
                  </div>

                  {/* Student Query */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[var(--muted)] uppercase font-mono">
                      Вопрос ученика:
                    </p>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed font-medium">
                      «{ticket.student_query}»
                    </p>
                  </div>

                  {/* AI Summary Diagnostic */}
                  {ticket.ai_summary && (
                    <div className="p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-xs flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-blue-300 font-mono text-[11px] uppercase">
                          Диагностика Socratic AI:
                        </span>{' '}
                        <span className="text-[var(--muted)]">{ticket.ai_summary}</span>
                      </div>
                    </div>
                  )}

                  {/* Code Context */}
                  {ticket.code_context && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-[var(--muted)] uppercase font-mono flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Код ученика на момент остановки:</span>
                      </p>
                      <pre className="p-3 rounded-md bg-[var(--background)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--foreground)] overflow-x-auto leading-relaxed">
                        {ticket.code_context}
                      </pre>
                    </div>
                  )}

                  {/* Mentor Answer if resolved */}
                  {isResolved && ticket.mentor_answer && (
                    <div className="p-3.5 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1">
                      <p className="font-bold text-emerald-400 font-mono text-[11px] uppercase">
                        Ответ ментора-волонтера ({ticket.mentor?.full_name || 'Волонтер'}):
                      </p>
                      <p className="text-[var(--foreground)] leading-relaxed">{ticket.mentor_answer}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {isOpen && (
                      <button
                        type="button"
                        onClick={() => handleClaim(ticket)}
                        className="py-1.5 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-subtle"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Взять тикет в работу</span>
                      </button>
                    )}

                    {isInProgress && (
                      <button
                        type="button"
                        onClick={() => setActiveResolvingTicket(ticket)}
                        className="py-1.5 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-subtle"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ответить и начислить 15 мин</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. Mentor Resolution Modal */}
      {activeResolvingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  Разрешение микро-тикета #{activeResolvingTicket.id.slice(0, 8)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveResolvingTicket(null)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Напишите понятное объяснение ошибки для ученика. После отправки ваш ответ появится в его терминале практики, а вам будет автоматически начислено{' '}
              <strong className="text-emerald-400 font-semibold">15 минут</strong> в волонтерский сертификат.
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Ваш ответ и объяснение:
                </label>
                <textarea
                  rows={4}
                  value={mentorAnswerText}
                  onChange={(e) => setMentorAnswerText(e.target.value)}
                  placeholder="Привет! Проблема в том, что ты не поставил скобки вокруг 2*a в знаменателе..."
                  className="w-full p-2.5 rounded-md bg-[var(--background)] border border-[var(--border)] focus:border-emerald-500 text-xs text-[var(--foreground)] outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveResolvingTicket(null)}
                  className="px-4 py-2 rounded-md border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-subtle"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Отправить и подтвердить 15 мин</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
