'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAppStore, Ticket } from '../src/lib/store';
import {
  Settings,
  Check,
  CheckCircle2,
  X,
  AlertCircle,
  Terminal,
  Clock,
  Award,
  Flame,
  Code2,
  Target,
  FileText,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Monitor,
  Volume2,
  Bell,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function AppHomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // App Store State
  const {
    activeTab,
    setActiveTab,
    isSettingsOpen,
    setSettingsOpen,
    soundEnabled,
    setSoundEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    user,
    setUserRole,
    currentProblem,
    selectedOption,
    setSelectedOption,
    attemptsLeft,
    isSolved,
    lastAnswerWrong,
    aiConsoleHint,
    isTicketEscalated,
    escalatedTicketId,
    checkAnswer,
    requestMentorHelp,
    resetPractice,
    tickets,
    volunteerMinutes,
    claimTicket,
    generateAiDraftForTicket,
    updateTicketDraft,
    resolveTicket,
    achievements,
    isCertModalOpen,
    setCertModalOpen,
  } = useAppStore();

  // Local state
  const [ticketToast, setTicketToast] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'claimed' | 'resolved'>('all');
  const [resolvingDrafts, setResolvingDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format volunteer hours
  const formattedHours = (volunteerMinutes / 60).toFixed(1);

  // Handle Escalation from Practice
  const handleEscalate = () => {
    const ticketId = requestMentorHelp();
    setTicketToast(`Тикет ${ticketId} успешно отправлен в очередь наставников!`);
    setTimeout(() => setTicketToast(null), 4000);
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col selection:bg-blue-600/20">
      {/* ========================================================================= */}
      {/* 1. HEADER (48px Fixed, 1px Border)                                        */}
      {/* ========================================================================= */}
      <header className="h-[48px] border-b border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--background)] sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
        {/* Left: Clean Monochrome Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[var(--surface-raised)] border border-[#1F2430] dark:border-[#1F2430] border-slate-300 flex items-center justify-center font-mono font-bold text-xs tracking-wider text-[var(--foreground)]">
            DM
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--foreground)] hidden sm:inline">
            Digital Mentor
          </span>
        </div>

        {/* Center: 3 Flat Screen Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'practice'
                ? 'bg-[#1F2430] dark:bg-[#1F2430] bg-slate-200 text-[var(--foreground)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Практика
          </button>
          <button
            onClick={() => setActiveTab('mentor')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors relative ${
              activeTab === 'mentor'
                ? 'bg-[#1F2430] dark:bg-[#1F2430] bg-slate-200 text-[var(--foreground)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <span>Менторская</span>
            {tickets.some((t) => t.status === 'open') && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {tickets.filter((t) => t.status === 'open').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#1F2430] dark:bg-[#1F2430] bg-slate-200 text-[var(--foreground)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Профиль
          </button>
        </nav>

        {/* Right: Settings Gear Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-8 h-8 rounded-md border border-[#1F2430] dark:border-[#1F2430] border-slate-300 bg-[var(--surface-raised)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            title="Настройки"
            aria-label="Настройки"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {ticketToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121620] border border-blue-500/40 text-blue-400 px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{ticketToast}</span>
          <button
            onClick={() => setTicketToast(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT BY ACTIVE TAB                                             */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col justify-start">
        {/* ======================================================================= */}
        {/* SCREEN 1: «ПРАКТИКА» (Central container 680px, flat borders, no clutter)*/}
        {/* ======================================================================= */}
        {activeTab === 'practice' && (
          <section className="w-full max-w-[680px] mx-auto px-4 py-8 md:py-12 flex flex-col gap-6">
            {/* Header: Topic Banner & 3 Minimalist Dots */}
            <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  {currentProblem.category}
                </span>

                {/* 3 Minimalist Dots Indicator (Attempts) */}
                <div className="flex items-center gap-2" title={`Осталось попыток: ${attemptsLeft}`}>
                  <span className="text-[11px] font-mono text-[var(--muted)] mr-1">
                    Попытки:
                  </span>
                  {[0, 1, 2].map((i) => {
                    const isAvailable = i < attemptsLeft;
                    const isFailed = attemptsLeft === 0;

                    let dotClass = 'w-2.5 h-2.5 rounded-full transition-colors ';
                    if (isFailed) {
                      dotClass += 'bg-[#EF4444] border border-[#EF4444]/60';
                    } else if (isAvailable) {
                      dotClass += 'bg-[#2563EB] border border-[#2563EB]/60';
                    } else {
                      dotClass += 'bg-transparent border border-[#1F2430] dark:border-[#1F2430] border-slate-300';
                    }

                    return <span key={i} className={dotClass} />;
                  })}
                </div>
              </div>

              <h1 className="text-base md:text-lg font-semibold text-[var(--foreground)] leading-snug">
                {currentProblem.topic}
              </h1>
            </div>

            {/* Problem Statement & Options Container */}
            <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-6 space-y-6">
              {/* Problem text */}
              <div className="text-sm text-[var(--foreground)] leading-relaxed">
                {currentProblem.statement}
              </div>

              {/* Code snippet if any */}
              {currentProblem.codeSnippet && (
                <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[#06070B] dark:bg-[#06070B] bg-slate-900 rounded p-3 text-xs font-mono text-slate-300 overflow-x-auto">
                  <pre>{currentProblem.codeSnippet}</pre>
                </div>
              )}

              {/* Flat Option Cards */}
              <div className="space-y-2.5 pt-2">
                {currentProblem.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = isSolved && idx === currentProblem.correctOptionIndex;
                  const isWrongSelected = lastAnswerWrong && isSelected;

                  let cardBorder = 'border-[#1F2430] dark:border-[#1F2430] border-slate-200';
                  let cardBg = 'bg-[var(--surface-raised)] hover:border-slate-400 dark:hover:border-slate-600';

                  if (isCorrect) {
                    cardBorder = 'border-[#10B981]';
                    cardBg = 'bg-[#10B981]/10 text-emerald-400';
                  } else if (isWrongSelected) {
                    cardBorder = 'border-[#EF4444]';
                    cardBg = 'bg-[#EF4444]/10 text-red-400';
                  } else if (isSelected) {
                    cardBorder = 'border-[#2563EB]';
                    cardBg = 'bg-[#2563EB]/10 text-[var(--foreground)]';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSolved || attemptsLeft === 0}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3.5 rounded-md border ${cardBorder} ${cardBg} text-sm transition-all flex items-center justify-between cursor-pointer disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full border border-[#1F2430] dark:border-[#1F2430] border-slate-300 flex items-center justify-center text-[10px] font-mono text-[var(--muted)]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium text-[var(--foreground)]">{option}</span>
                      </div>

                      {isCorrect && <Check className="w-4 h-4 text-[#10B981]" />}
                      {isWrongSelected && <X className="w-4 h-4 text-[#EF4444]" />}
                    </button>
                  );
                })}
              </div>

              {/* Actions Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                {isSolved ? (
                  <div className="w-full flex items-center justify-between p-3 rounded-md bg-[#10B981]/10 border border-[#10B981]/30">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#10B981]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Отлично! Решение верное (+50 XP).</span>
                    </div>
                    <button
                      onClick={resetPractice}
                      className="text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Сбросить</span>
                    </button>
                  </div>
                ) : attemptsLeft > 0 ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={() => checkAnswer()}
                    className="w-full py-2.5 px-4 rounded-md bg-[#2563EB] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Проверить</span>
                  </button>
                ) : (
                  <div className="w-full space-y-3">
                    <div className="p-3 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>3 попытки исчерпаны. Для разбора обратитесь к наставнику.</span>
                    </div>

                    {!isTicketEscalated ? (
                      <button
                        onClick={handleEscalate}
                        className="w-full py-2.5 px-4 rounded-md border border-[#2563EB] bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-blue-400 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>Разобрать с ментором</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-md border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] flex items-center justify-between text-xs">
                        <span className="text-[var(--muted)]">
                          Тикет <span className="font-mono text-blue-400">{escalatedTicketId}</span> передан в Менторскую.
                        </span>
                        <button
                          onClick={() => setActiveTab('mentor')}
                          className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          <span>Смотреть очередь</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Socratic AI Console Hint (Appears ONLY on failure / error) */}
            {aiConsoleHint && !isSolved && (
              <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-300 bg-[#06070B] dark:bg-[#06070B] bg-slate-900 rounded-lg p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-slate-400 border-b border-[#1F2430] dark:border-[#1F2430] border-slate-700 pb-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] font-semibold text-slate-300">
                    Консоль подсказки ИИ
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed pt-1">
                  {aiConsoleHint}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ======================================================================= */}
        {/* SCREEN 2: «МЕНТОРСКАЯ» (Confirmed Hours Counter, Certificate, Tickets)  */}
        {/* ======================================================================= */}
        {activeTab === 'mentor' && (
          <section className="w-full max-w-[760px] mx-auto px-4 py-8 md:py-12 flex flex-col gap-6">
            {/* Top Banner: Confirmed Hours Counter & Certificate Button */}
            <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                    Волонтёрские часы
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    Подтверждено
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono tracking-tight text-[var(--foreground)]">
                  {formattedHours} ч.
                  <span className="text-xs font-normal text-[var(--muted)] ml-2">
                    ({volunteerMinutes} минут наставничества)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCertModalOpen(true)}
                className="py-2 px-4 rounded-md border border-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] text-xs font-medium transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Сгенерировать сертификат</span>
              </button>
            </div>

            {/* Tickets Header & Filter Tabs */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  Очередь академических тикетов
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  Каждый разобранный тикет начисляет +15 минут волонтёрской практики.
                </p>
              </div>

              <div className="flex items-center gap-1 border border-[#1F2430] dark:border-[#1F2430] border-slate-200 p-0.5 rounded-md bg-[var(--surface-raised)]">
                {(['all', 'open', 'claimed', 'resolved'] as const).map((filter) => {
                  const labels = {
                    all: 'Все',
                    open: 'Открытые',
                    claimed: 'В работе',
                    resolved: 'Решённые',
                  };
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-2.5 py-1 text-[11px] rounded transition-colors ${
                        activeFilter === filter
                          ? 'bg-[#1F2430] dark:bg-[#1F2430] bg-slate-300 text-[var(--foreground)] font-medium'
                          : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {labels[filter]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flat List of Tickets */}
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="p-8 border border-[#1F2430] dark:border-[#1F2430] border-slate-200 rounded-lg text-center text-xs text-[var(--muted)]">
                  Тикетов в выбранной категории не найдено.
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const isCurrentResolving = ticket.status === 'claimed';
                  const isResolved = ticket.status === 'resolved';

                  return (
                    <div
                      key={ticket.id}
                      className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-5 space-y-4"
                    >
                      {/* Ticket Meta */}
                      <div className="flex items-start justify-between gap-3 border-b border-[#1F2430] dark:border-[#1F2430] border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">
                              {ticket.id}
                            </span>
                            <span className="text-xs font-medium text-[var(--foreground)]">
                              {ticket.studentName} ({ticket.studentGrade})
                            </span>
                          </div>
                          <div className="text-xs text-[var(--muted)] mt-0.5">
                            {ticket.taskTitle}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[var(--muted)]">
                            {ticket.timestamp}
                          </span>
                          {ticket.status === 'open' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Открыт
                            </span>
                          )}
                          {ticket.status === 'claimed' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              В работе
                            </span>
                          )}
                          {ticket.status === 'resolved' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                              Решён (+15 мин)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question */}
                      <div className="text-xs text-[var(--foreground)] leading-relaxed">
                        <span className="font-semibold text-[var(--muted)] mr-1">Вопрос:</span>
                        {ticket.question}
                      </div>

                      {/* Code / Context box */}
                      {ticket.codeSnippet && (
                        <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[#06070B] dark:bg-[#06070B] bg-slate-900 rounded p-2.5 font-mono text-xs text-slate-300 overflow-x-auto">
                          <pre>{ticket.codeSnippet}</pre>
                        </div>
                      )}

                      {/* Resolved Response Display */}
                      {isResolved && ticket.mentorResponse && (
                        <div className="p-3 rounded-md bg-[#10B981]/5 border border-[#10B981]/20 text-xs space-y-1">
                          <div className="font-semibold text-[#10B981] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Ответ наставника:</span>
                          </div>
                          <p className="text-[var(--foreground)] leading-relaxed">
                            {ticket.mentorResponse}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons for Ticket */}
                      {ticket.status === 'open' && (
                        <div className="pt-1">
                          <button
                            onClick={() => claimTicket(ticket.id)}
                            className="w-full sm:w-auto py-2 px-4 rounded-md bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Взять вопрос (+15 мин)</span>
                          </button>
                        </div>
                      )}

                      {isCurrentResolving && (
                        <div className="pt-2 border-t border-[#1F2430] dark:border-[#1F2430] border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-[var(--muted)]">
                              Разбор тикета наставником:
                            </span>
                            <button
                              onClick={() => generateAiDraftForTicket(ticket.id)}
                              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Сгенерировать черновик ответа ИИ</span>
                            </button>
                          </div>

                          <textarea
                            rows={3}
                            value={resolvingDrafts[ticket.id] !== undefined ? resolvingDrafts[ticket.id] : ticket.aiDraft}
                            onChange={(e) => {
                              setResolvingDrafts({
                                ...resolvingDrafts,
                                [ticket.id]: e.target.value,
                              });
                              updateTicketDraft(ticket.id, e.target.value);
                            }}
                            placeholder="Введите пояснение для ученика..."
                            className="w-full p-2.5 rounded-md border border-[#1F2430] dark:border-[#1F2430] border-slate-300 bg-[var(--surface-raised)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[#2563EB] resize-none"
                          />

                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                const draftText =
                                  resolvingDrafts[ticket.id] !== undefined
                                    ? resolvingDrafts[ticket.id]
                                    : ticket.aiDraft;
                                resolveTicket(ticket.id, draftText);
                              }}
                              className="py-2 px-4 rounded-md bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Закрыть тикет (+15 мин)</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* SCREEN 3: «ПРОФИЛЬ» (Combined Profile & Achievements in One Clean Screen)*/}
        {/* ======================================================================= */}
        {activeTab === 'profile' && (
          <section className="w-full max-w-[760px] mx-auto px-4 py-8 md:py-12 flex flex-col gap-6">
            {/* User Info Header Card */}
            <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--surface-raised)] border border-[#1F2430] dark:border-[#1F2430] border-slate-300 flex items-center justify-center font-bold text-sm text-[var(--foreground)]">
                  {user.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[var(--foreground)]">
                      {user.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {user.role === 'mentor' ? 'Наставник' : 'Ученик'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[var(--muted)] mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Role switcher toggle */}
              <button
                onClick={() => setUserRole(user.role === 'mentor' ? 'student' : 'mentor')}
                className="text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] border border-[#1F2430] dark:border-[#1F2430] border-slate-200 px-3 py-1.5 rounded-md bg-[var(--surface-raised)] transition-colors cursor-pointer"
              >
                Сменить роль: {user.role === 'mentor' ? 'Ученик' : 'Ментор'}
              </button>
            </div>

            {/* 3 Metric Cards in a Row: XP, Streak, Volunteer Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: XP */}
              <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-4 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Академический XP
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                  {user.xp} XP
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  Ранг: Senior Mentor
                </div>
              </div>

              {/* Card 2: Streak Days */}
              <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-4 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Ударный режим
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--foreground)] flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>{user.streak} дней</span>
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  Ежедневная активность
                </div>
              </div>

              {/* Card 3: Volunteer Hours */}
              <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-4 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Волонтёрские часы
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                  {formattedHours} ч.
                </div>
                <div className="text-[11px] font-mono text-[#10B981] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Подтверждено</span>
                </div>
              </div>
            </div>

            {/* Achievements Grid: Flat Badges with Minimal Progress Bars */}
            <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Академические достижения
                </h3>
                <span className="text-xs font-mono text-[var(--muted)]">
                  {achievements.filter((a) => a.unlocked).length} из {achievements.length} открыто
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => {
                  const Icon =
                    ach.icon === 'target'
                      ? Target
                      : ach.icon === 'flame'
                      ? Flame
                      : ach.icon === 'award'
                      ? Award
                      : Code2;

                  return (
                    <div
                      key={ach.id}
                      className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] rounded-md p-3.5 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded border border-[#1F2430] dark:border-[#1F2430] border-slate-300 flex items-center justify-center text-[var(--foreground)]">
                            <Icon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[var(--foreground)]">
                              {ach.title}
                            </div>
                            <div className="text-[11px] text-[var(--muted)] leading-tight">
                              {ach.desc}
                            </div>
                          </div>
                        </div>

                        {ach.unlocked && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                            100%
                          </span>
                        )}
                      </div>

                      {/* Clean Flat Progress Bar */}
                      <div className="w-full space-y-1">
                        <div className="w-full h-1.5 bg-[#1F2430] dark:bg-[#1F2430] bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              ach.unlocked ? 'bg-[#10B981]' : 'bg-[#2563EB]'
                            }`}
                            style={{ width: `${ach.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-[var(--muted)]">
                          <span>{ach.current} / {ach.target}</span>
                          <span>{ach.progress}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. SETTINGS MODAL                                                         */}
      {/* ========================================================================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-[#1F2430] dark:border-[#1F2430] border-slate-300 bg-[var(--surface)] p-6 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1F2430] dark:border-[#1F2430] border-slate-200 pb-3">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Настройки аккаунта
              </h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Selector (Light / Dark / System via next-themes) */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[var(--muted)] block">
                Тема оформления
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`py-2 px-3 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    mounted && theme === 'light'
                      ? 'border-[#2563EB] bg-[#2563EB]/10 text-blue-400'
                      : 'border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Светлая</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`py-2 px-3 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    mounted && theme === 'dark'
                      ? 'border-[#2563EB] bg-[#2563EB]/10 text-blue-400'
                      : 'border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Тёмная</span>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`py-2 px-3 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    mounted && theme === 'system'
                      ? 'border-[#2563EB] bg-[#2563EB]/10 text-blue-400'
                      : 'border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Системная</span>
                </button>
              </div>
            </div>

            {/* Checkboxes: Sound & Notifications */}
            <div className="space-y-3 pt-1 border-t border-[#1F2430] dark:border-[#1F2430] border-slate-200">
              <label className="flex items-center justify-between text-xs text-[var(--foreground)] cursor-pointer">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[var(--muted)]" />
                  <span>Звуковые эффекты</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded border-[#1F2430] dark:border-[#1F2430] border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-[var(--foreground)] cursor-pointer">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[var(--muted)]" />
                  <span>Уведомления о новых тикетах</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="rounded border-[#1F2430] dark:border-[#1F2430] border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                />
              </label>
            </div>

            {/* User Account Info & Logout */}
            <div className="space-y-3 pt-2 border-t border-[#1F2430] dark:border-[#1F2430] border-slate-200">
              <div className="text-xs">
                <span className="text-[var(--muted)] block">Почта аккаунта:</span>
                <span className="font-mono text-[var(--foreground)] font-medium">
                  {user.email}
                </span>
              </div>

              {/* Red Logout Button */}
              <button
                onClick={() => {
                  setSettingsOpen(false);
                  window.location.reload();
                }}
                className="w-full py-2.5 px-4 rounded-md border border-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Выйти из аккаунта</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CERTIFICATE MODAL                                                      */}
      {/* ========================================================================= */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#1F2430] dark:border-[#1F2430] border-slate-300 bg-[var(--surface)] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2430] dark:border-[#1F2430] border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-[#10B981]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Волонтёрский сертификат верификации
                </h3>
              </div>
              <button
                onClick={() => setCertModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] rounded-md p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Наставник:</span>
                <span className="text-[var(--foreground)] font-bold">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Email:</span>
                <span className="text-[var(--foreground)]">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Подтверждённые часы:</span>
                <span className="text-[#10B981] font-bold">{formattedHours} ч.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Токен верификации:</span>
                <span className="text-blue-400">DM-MENTOR-2026-ANSAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Статус в реестре:</span>
                <span className="text-[#10B981]">Active Verified (100%)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.open('/verify/DM-MENTOR-2026-ANSAR', '_blank');
                  setCertModalOpen(false);
                }}
                className="py-2 px-4 rounded-md bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Открыть страницу реестра</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
