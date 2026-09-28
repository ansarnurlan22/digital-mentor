'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore, ViewRole, Ticket } from '../src/lib/store';
import { ThemeToggle } from '../src/components/ThemeToggle';
import {
  Code2,
  Users,
  ShieldCheck,
  Heart,
  Flame,
  Award,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  X,
  ExternalLink,
  ChevronRight,
  Terminal as TerminalIcon,
  Check,
  Clock,
  ArrowRight,
  FileText,
  QrCode,
} from 'lucide-react';

export default function RootHomePage() {
  const {
    activeView,
    setActiveView,
    hearts,
    xp,
    streak,
    activeLessonStep,
    currentCode,
    setCurrentCode,
    terminalLogs,
    addLog,
    clearLogs,
    loseHeart,
    resetHearts,
    tickets,
    createTicketFromLesson,
    claimTicket,
    resolveTicket,
    volunteerMinutes,
    resolvedTicketsCount,
    nextStep,
    resetSession,
  } = useAppStore();

  // Local UI state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [studentQuestion, setStudentQuestion] = useState(
    'Почему при расчете h = -b / 2 * a вершина смещается? В формуле же написано минус b делить на два а.'
  );
  const [activeResolvingTicket, setActiveResolvingTicket] = useState<Ticket | null>(null);
  const [mentorAnswerText, setMentorAnswerText] = useState('');
  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState(false);

  // 1. Student Code Evaluation Engine
  const handleRunCode = () => {
    addLog('stdout', '$ python3 -m test_runner --assert-math');

    // Mathematical evaluation of vertex form:
    // Expected logic: h = -b / (2*a), k = c - (b**2)/(4*a)
    const code = currentCode.replace(/\s+/g, '');
    const hasPriorityBug =
      currentCode.includes('-b / 2 * a') ||
      currentCode.includes('-b/2*a') ||
      currentCode.includes('h=-b/2*a');

    const hasCorrectDenominator =
      currentCode.includes('-b / (2 * a)') ||
      currentCode.includes('-b / (2*a)') ||
      currentCode.includes('-b/(2*a)') ||
      currentCode.includes('-(b) / (2 * a)');

    if (hasPriorityBug && !hasCorrectDenominator) {
      // Bug detected: division precedes multiplication in Python
      loseHeart();
      addLog(
        'stderr',
        '✗ Test Failed: find_vertex(a=2, b=4, c=5) => Вернул (-4.0, 3.0), Ожидалось (-1.0, 3.0)'
      );
      addLog(
        'ai',
        'Socratic AI (70%): Обратите внимание на порядок действий. В Python выражение `-b / 2 * a` вычисляется как `(-b / 2) * a`. Знаменатель 2*a необходимо взять в скобки: `(2 * a)`.'
      );

      if (hearts - 1 <= 0) {
        addLog(
          'system',
          '⚡ Внимание: Все сердца исчерпаны! Активировано 30% волонтерское звено. Рекомендуется отправить микро-тикет ментору.'
        );
        setIsTicketModalOpen(true);
      }
      setIsSuccessUnlocked(false);
    } else if (hasCorrectDenominator) {
      // Code is correct
      addLog('success', '✓ Test 1: find_vertex(a=1, b=-2, c=-3) => (1.0, -4.0) PASSED');
      addLog('success', '✓ Test 2: find_vertex(a=2, b=4, c=5) => (-1.0, 3.0) PASSED');
      addLog(
        'ai',
        'Socratic AI (70%): Идеально! Скобки вокруг (2*a) восстановили правильный приоритет операций. Решение аналитически верно.'
      );
      setIsSuccessUnlocked(true);
    } else {
      // General syntax or incomplete code
      loseHeart();
      addLog('stderr', '✗ Ошибка: Проверьте вычисление k = c - b²/(4a).');
      setIsSuccessUnlocked(false);
    }
  };

  // Submit Ticket from Student
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentQuestion.trim()) return;

    const newId = createTicketFromLesson(
      'Поиск вершины параболы (Vertex Form) — SAT Math',
      currentCode,
      studentQuestion.trim()
    );

    setIsTicketModalOpen(false);
    addLog(
      'system',
      `⚡ Микро-тикет #${newId} создан! Переключитесь во вкладку «Вид Ментора», чтобы увидеть его в очереди и разобрать.`
    );
  };

  // Resolve Ticket as Mentor
  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResolvingTicket || !mentorAnswerText.trim()) return;

    resolveTicket(activeResolvingTicket.id, mentorAnswerText.trim());
    setActiveResolvingTicket(null);
    setMentorAnswerText('');
    addLog(
      'success',
      `✓ Ментор разобрал тикет #${activeResolvingTicket.id}! Волонтеру начислено +15 минут в официальный сертификат.`
    );
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#FFFFFF] font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP DEV BAR / ROLE SWITCHER (Реактивное переключение режимов)           */}
      {/* ========================================================================= */}
      <nav className="h-13 bg-[#000000] border-b border-[#1F2430] px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center tracking-tight shadow-sm">
            DM
          </div>
          <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">
            Digital Mentor
          </span>
          <span className="text-xs text-[#64748B] font-mono hidden md:inline">
            · 70% AI / 30% Volunteers
          </span>
        </div>

        {/* The 3 Core Role Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#0E121B] p-1 rounded-lg border border-[#1F2430]">
          <button
            type="button"
            onClick={() => setActiveView('student')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'student'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#131825]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Ученик (Practice & AI)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('mentor')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'mentor'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#131825]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ментор (Queue & Review)</span>
            {tickets.filter((t) => t.status === 'open').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center ml-0.5">
                {tickets.filter((t) => t.status === 'open').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('verifier')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'verifier'
                ? 'bg-[#1F2430] text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#131825]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Верификация сертификата</span>
            <span className="sm:hidden">Сертификат</span>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetSession}
            title="Сбросить прогресс и жизни"
            className="text-[11px] font-mono text-[#64748B] hover:text-[#94A3B8] px-2 py-1 rounded border border-[#1F2430] hover:border-[#2A2F3D] transition-colors"
          >
            Сброс
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. РОЛЬ 1: ВИД УЧЕНИКА (PRACTICE STUDIO & SOCRATIC AI - 70/30 HYBRID)      */}
      {/* ========================================================================= */}
      {activeView === 'student' && (
        <div className="flex-1 flex flex-col">
          {/* Subheader with Game Stats */}
          <div className="h-11 bg-[#090A0F] border-b border-[#1F2430] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[#94A3B8]">
                Шаг {activeLessonStep} из 3 · SAT Math Section 3
              </span>
              <span className="text-[#1F2430]">|</span>
              <span className="font-semibold text-white">
                Поиск вершины параболы (Vertex Form)
              </span>
            </div>

            {/* Heart lives, XP, Streak */}
            <div className="flex items-center gap-5">
              {/* Hearts */}
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((heartIndex) => (
                  <Heart
                    key={heartIndex}
                    className={`w-4 h-4 transition-all ${
                      heartIndex <= hearts
                        ? 'text-rose-500 fill-rose-500 scale-100'
                        : 'text-[#2A2F3D] fill-transparent scale-90'
                    }`}
                  />
                ))}
                <span className="font-mono text-[11px] text-[#94A3B8] ml-1">
                  {hearts}/3 жизней
                </span>
              </div>

              {/* XP */}
              <div className="flex items-center gap-1 font-mono font-bold text-blue-400">
                <span>⚡</span>
                <span>{xp} XP</span>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1 font-mono font-semibold text-emerald-400">
                <Flame className="w-3.5 h-3.5 fill-emerald-400/20" />
                <span>{streak} дней</span>
              </div>
            </div>
          </div>

          {/* Split Screen Workspace */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-6.5rem)]">
            {/* LEFT PANE: Task, Socratic AI, Escalation (5 cols) */}
            <div className="lg:col-span-5 border-r border-[#1F2430] bg-[#0E121B] flex flex-col">
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Title and tags */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Step 01 · Interactive
                    </span>
                    <span className="text-xs text-[#64748B] font-mono">
                      SAT Math & СОР/СОЧ
                    </span>
                  </div>
                  <h1 className="text-lg font-bold text-white tracking-tight">
                    Вычисление вершины параболы $y = ax^2 + bx + c$
                  </h1>
                </div>

                {/* Problem statement */}
                <div className="p-4 rounded-lg border border-[#1F2430] bg-[#131825] text-xs text-[#CBD5E1] leading-relaxed space-y-3">
                  <p>
                    В стандартной форме квадратного уравнения вершина параболы $(h, k)$ выражается через коэффициенты:
                  </p>
                  <div className="p-3 rounded bg-[#090A0F] border border-[#1F2430] font-mono text-[11px] space-y-1 text-white">
                    <p className="text-[#38BDF8]">h = -b / (2 * a)</p>
                    <p className="text-[#34D399]">k = c - (b ** 2) / (4 * a)</p>
                  </div>
                  <p className="text-[#94A3B8]">
                    Исправьте ошибку приоритета математических операций в функции <code className="text-blue-400">find_vertex(a, b, c)</code> и запустите проверку.
                  </p>
                </div>

                {/* 70/30 Escalation Banner when Hearts <= 1 or Hearts == 0 */}
                {hearts <= 1 && (
                  <div className="p-4 rounded-lg border border-emerald-500/40 bg-emerald-500/5 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                          ⚡ Активация 30% волонтерского звена
                        </h4>
                        <p className="text-xs text-[#94A3B8] leading-relaxed">
                          Жизни почти на нуле. Вы можете позвать человека-волонтера. Ваш код и ошибка мгновенно попадут в очередь, а ментор получит 15 минут в официальный сертификат.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTicketModalOpen(true)}
                      className="w-full py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Позвать ментора-волонтера (+15 мин ментору)</span>
                    </button>
                  </div>
                )}

                {/* Socratic AI Insight Box */}
                <div className="p-4 rounded-lg border border-[#1F2430] bg-[#131825] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Socratic AI Tutor (70% Интеллектуальный слой)</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Подсказка: В языке Python деление <code className="text-white">/</code> и умножение <code className="text-white">*</code> имеют равный приоритет и выполняются слева направо. Что произойдет, если написать <code className="text-rose-400">-b / 2 * a</code>? Деление выполнится первым, а результат умножится на <code className="text-white">a</code>!
                  </p>
                </div>
              </div>

              {/* Bottom footer button */}
              <div className="p-4 border-t border-[#1F2430] bg-[#131825] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#64748B]">
                  Архитектура 70% ИИ / 30% Волонтеры
                </span>
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(true)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Создать тикет ментору</span>
                </button>
              </div>
            </div>

            {/* RIGHT PANE: Code Editor & Terminal (7 cols) */}
            <div className="lg:col-span-7 bg-[#090A0F] flex flex-col">
              {/* Editor Bar */}
              <div className="h-10 bg-[#0E121B] border-b border-[#1F2430] px-4 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">solution.py</span>
                  <span className="text-[#2A2F3D]">|</span>
                  <span>Python 3.11</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentCode(`def find_vertex(a, b, c):\n    h = -b / 2 * a\n    k = c - (b**2) / (4*a)\n    return (h, k)`);
                      resetHearts();
                      addLog('system', 'Код сброшен к начальному состоянию с ошибкой приоритета.');
                    }}
                    title="Сбросить код"
                    className="p-1.5 rounded text-[#64748B] hover:text-white hover:bg-[#1F2430] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleRunCode}
                    className="py-1 px-3.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Проверить решение (Run)</span>
                  </button>
                </div>
              </div>

              {/* Code input */}
              <div className="flex-1 flex relative font-mono text-xs">
                <div className="w-10 py-3 text-right pr-3 select-none text-[#2A2F3D] bg-[#0E121B] border-r border-[#1F2430]">
                  {currentCode.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 bg-[#090A0F] text-white p-3 leading-relaxed resize-none outline-none border-0 font-mono text-xs focus:ring-0"
                />
              </div>

              {/* Terminal Section */}
              <div className="h-60 border-t border-[#1F2430] bg-[#0E121B] flex flex-col">
                <div className="h-8 bg-[#131825] border-b border-[#1F2430] px-4 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-2 text-[#94A3B8]">
                    <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-semibold text-white">TERMINAL OUTPUT</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isSuccessUnlocked && (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="text-emerald-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>Следующий шаг (+40 XP)</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={clearLogs}
                      className="text-[#64748B] hover:text-[#94A3B8]"
                    >
                      Очистить
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1 bg-[#090A0F]">
                  {terminalLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2">
                      <span className="text-[#2A2F3D] select-none text-[10px]">[{log.time}]</span>
                      <span
                        className={
                          log.type === 'stdout'
                            ? 'text-[#94A3B8]'
                            : log.type === 'stderr'
                            ? 'text-rose-400 font-semibold'
                            : log.type === 'success'
                            ? 'text-emerald-400 font-semibold'
                            : log.type === 'ai'
                            ? 'text-blue-400'
                            : 'text-amber-400'
                        }
                      >
                        {log.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. РОЛЬ 2: ВИД МЕНТОРА (QUEUE & REVIEW - 30% ВОЛОНТЕРСКИЙ СЛОЙ)           */}
      {/* ========================================================================= */}
      {activeView === 'mentor' && (
        <div className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">
          {/* Volunteer Stats Bar */}
          <div className="p-6 rounded-lg border border-[#1F2430] bg-[#0E121B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 status-dot-pulse" />
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                  Волонтерское звено онлайн
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Очередь микро-тикетов Digital Mentor
              </h1>
              <p className="text-xs text-[#94A3B8] max-w-2xl leading-relaxed">
                Сюда попадают только те задачи, где 70% Socratic AI не смог помочь ученику за 3 попытки. За каждый закрытый тикет начисляется 15 минут в официальный реестр волонтерских часов.
              </p>
            </div>

            {/* Counter badges */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-md border border-[#1F2430] bg-[#131825] text-center min-w-[100px]">
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {(volunteerMinutes / 60).toFixed(1)} ч
                </div>
                <div className="text-[10px] font-mono uppercase text-[#64748B]">
                  Подтверждено
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-md border border-[#1F2430] bg-[#131825] text-center min-w-[100px]">
                <div className="text-xl font-bold font-mono text-blue-400">
                  {resolvedTicketsCount}
                </div>
                <div className="text-[10px] font-mono uppercase text-[#64748B]">
                  Решено тикетов
                </div>
              </div>
            </div>
          </div>

          {/* Tickets Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] border-b border-[#1F2430] pb-2">
              <span>Активные тикеты ({tickets.length})</span>
              <span>+15 минут за решение</span>
            </div>

            {tickets.map((ticket) => {
              const isOpen = ticket.status === 'open';
              const isClaimed = ticket.status === 'claimed';
              const isResolved = ticket.status === 'resolved';

              return (
                <div
                  key={ticket.id}
                  className="rounded-lg border border-[#1F2430] bg-[#0E121B] p-5 space-y-4 transition-all hover:border-[#2A2F3D]"
                >
                  {/* Header of Ticket */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F2430] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOpen
                            ? 'bg-amber-400'
                            : isClaimed
                            ? 'bg-blue-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span className="font-mono text-xs font-bold text-white">
                        #{ticket.id}
                      </span>
                      <span className="text-[#64748B]">·</span>
                      <span className="text-xs font-semibold text-white">
                        {ticket.studentName}
                      </span>
                      <span className="text-[#64748B]">·</span>
                      <span className="text-xs text-[#94A3B8] font-mono truncate max-w-xs">
                        {ticket.taskTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                          isOpen
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : isClaimed
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isOpen && 'Ожидает волонтера'}
                        {isClaimed && 'В работе'}
                        {isResolved && '✓ Решено'}
                      </span>

                      <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>+15 мин</span>
                      </span>
                    </div>
                  </div>

                  {/* Student Question */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-mono font-semibold uppercase text-[#64748B]">
                      Вопрос ученика:
                    </p>
                    <p className="text-sm font-medium text-white leading-relaxed">
                      «{ticket.question}»
                    </p>
                  </div>

                  {/* Socratic AI Diagnostic */}
                  <div className="p-3 rounded-md bg-[#131825] border border-[#1F2430] text-xs flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold text-blue-300 text-[11px] uppercase">
                        Диагностика Socratic AI:
                      </span>{' '}
                      <span className="text-[#94A3B8]">{ticket.aiHint}</span>
                    </div>
                  </div>

                  {/* Code snippet */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-mono font-semibold uppercase text-[#64748B]">
                      Код ученика:
                    </p>
                    <pre className="p-3 rounded-md bg-[#090A0F] border border-[#1F2430] text-xs font-mono text-[#CBD5E1] overflow-x-auto leading-relaxed">
                      {ticket.codeSnippet}
                    </pre>
                  </div>

                  {/* Mentor response if resolved */}
                  {isResolved && ticket.mentorResponse && (
                    <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                      <p className="font-bold text-emerald-400 font-mono text-[11px] uppercase">
                        Ответ ментора-волонтера (Ансар Нурлан):
                      </p>
                      <p className="text-white leading-relaxed">{ticket.mentorResponse}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {isOpen && (
                      <button
                        type="button"
                        onClick={() => claimTicket(ticket.id)}
                        className="py-1.5 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Взять тикет в работу</span>
                      </button>
                    )}

                    {isClaimed && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveResolvingTicket(ticket);
                          setMentorAnswerText('Привет! В выражении h = -b / 2 * a обязательно возьми знаменатель в скобки: -b / (2 * a). В Python деление и умножение равноправны, поэтому без скобок деление на 2 выполняется раньше, чем умножение на a!');
                        }}
                        className="py-1.5 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. РОЛЬ 3: ПУБЛИЧНАЯ ВЕРИФИКАЦИЯ СЕРТИФИКАТА (VERIFIER VIEW)              */}
      {/* ========================================================================= */}
      {activeView === 'verifier' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-xl border border-[#1F2430] bg-[#0E121B] p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F2430] pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-white tracking-tight">
                    Официальный сертификат академического волонтера
                  </h1>
                  <p className="text-xs text-[#94A3B8] font-mono">
                    Digital Mentor Volunteering Registry & Verification
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified 100%</span>
              </span>
            </div>

            {/* Certificate Details */}
            <div className="space-y-4">
              <div className="p-5 rounded-lg bg-[#131825] border border-[#1F2430] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B]">
                      Волонтер-наставник
                    </span>
                    <div className="text-lg font-bold text-white mt-0.5">
                      Ансар Нурлан
                    </div>
                    <div className="text-xs text-blue-400 font-mono mt-0.5">
                      Старший академический ментор (SAT Math & СОР/СОЧ)
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B]">
                      Подтвержденные часы
                    </span>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                      {(volunteerMinutes / 60).toFixed(1)} ч
                    </div>
                    <div className="text-[11px] text-[#94A3B8] font-mono">
                      {volunteerMinutes} минут ({resolvedTicketsCount} тикетов)
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#1F2430] pt-3 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#64748B] text-[10px] block uppercase">Идентификатор токена:</span>
                    <span className="font-semibold text-white">DM-8F3A29-2609</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block uppercase">Статус реестра:</span>
                    <span className="font-semibold text-emerald-400">Активен (SHA-256 Valid)</span>
                  </div>
                </div>
              </div>

              {/* Architecture info */}
              <div className="p-4 rounded-lg border border-[#1F2430] bg-[#090A0F] space-y-2 text-xs text-[#94A3B8] leading-relaxed">
                <div className="flex items-center gap-2 text-white font-semibold font-mono text-[11px] uppercase">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Методология верификации (70% ИИ / 30% Волонтеры)</span>
                </div>
                <p>
                  Каждый зарегистрированный час подтвержден разрешением сложных академических кейсов учеников платформы. Система отсекает 70% тривиальных запросов через Socratic AI, передавая волонтеру только нестандартные ошибки кода. Каждый закрытый микро-тикет равен 15 минутам волонтерского вклада.
                </p>
              </div>
            </div>

            {/* Footer seal */}
            <div className="border-t border-[#1F2430] pt-4 flex items-center justify-between text-xs text-[#94A3B8] font-mono">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-400" />
                <span>Электронный криптографический реестр</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('mentor')}
                className="text-blue-400 hover:underline font-semibold"
              >
                Вернуться к очереди тикетов →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. МОДАЛЬНОЕ ОКНО: СОЗДАНИЕ МИКРО-ТИКЕТА (УЧЕНИК -> ОЧЕРЕДЬ)              */}
      {/* ========================================================================= */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#1F2430] bg-[#0E121B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2430] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Создать микро-тикет ментору-волонтеру
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(false)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Тикет попадет в открытую очередь волонтеров. Ментор получит ваш код, объяснит ошибку и получит{' '}
              <strong className="text-emerald-400 font-semibold">+15 минут в официальный сертификат</strong>.
            </p>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1 font-mono">
                  Ваш вопрос ментору:
                </label>
                <textarea
                  rows={3}
                  value={studentQuestion}
                  onChange={(e) => setStudentQuestion(e.target.value)}
                  placeholder="В чем именно вы запутались?"
                  className="w-full p-2.5 rounded-md bg-[#090A0F] border border-[#1F2430] focus:border-emerald-500 text-xs text-white outline-none resize-none"
                  required
                />
              </div>

              <div className="p-3 rounded-md bg-[#131825] border border-[#1F2430] space-y-1">
                <p className="text-[10px] font-mono uppercase text-[#64748B] font-semibold">
                  Автоматически прикрепленный код:
                </p>
                <pre className="text-[11px] font-mono text-[#CBD5E1] truncate">
                  {currentCode.split('\n')[2] || currentCode}
                </pre>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-[#1F2430] text-xs text-[#94A3B8] hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Отправить волонтерам (+15 мин)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. МОДАЛЬНОЕ ОКНО: РАЗРЕШЕНИЕ ТИКЕТА МЕНТОРОМ                              */}
      {/* ========================================================================= */}
      {activeResolvingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#1F2430] bg-[#0E121B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2430] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Разбор тикета #{activeResolvingTicket.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveResolvingTicket(null)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Напишите пояснение ученику. После отправки тикет перейдет в статус «Решено», а вам автоматически будет начислено{' '}
              <strong className="text-emerald-400 font-semibold">+15 минут</strong>.
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1 font-mono">
                  Объяснение ошибки:
                </label>
                <textarea
                  rows={4}
                  value={mentorAnswerText}
                  onChange={(e) => setMentorAnswerText(e.target.value)}
                  className="w-full p-2.5 rounded-md bg-[#090A0F] border border-[#1F2430] focus:border-emerald-500 text-xs text-white outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveResolvingTicket(null)}
                  className="px-4 py-2 rounded-md border border-[#1F2430] text-xs text-[#94A3B8] hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Отправить ответ (+15 мин ментору)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
