'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePracticeStore } from '../../src/lib/store/practiceStore';
import { useUser } from '../../src/context/UserContext';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import {
  Play,
  RotateCcw,
  Sparkles,
  Users,
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Code2,
  Flame,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';

export default function PracticePage() {
  const { user } = useUser();
  const {
    currentNode,
    userCode,
    attempts,
    canEscalateToMentor,
    terminalLogs,
    isEvaluating,
    evaluationResult,
    activeTicket,
    isTicketModalOpen,
    studentQuery,
    setUserCode,
    setStudentQuery,
    setTicketModalOpen,
    evaluateCode,
    escalateToMentor,
    clearTerminal,
    resetNode,
  } = usePracticeStore();

  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'theory'>('problem');
  const [tutorInput, setTutorInput] = useState('');
  const [tutorMessages, setTutorMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Привет! Я Socratic AI. Какая часть формулы или условия вызывает затруднения?',
    },
  ]);
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Ask Socratic AI Tutor
  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorInput.trim() || isTutorLoading) return;

    const userText = tutorInput.trim();
    setTutorInput('');
    setTutorMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsTutorLoading(true);

    try {
      const res = await fetch('/api/ai/tutor-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userText }],
          context: {
            nodeTitle: currentNode?.title,
            nodeType: currentNode?.node_type,
            userCode,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTutorMessages((prev) => [...prev, { role: 'assistant', text: data.content }]);
      } else {
        setTutorMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Попробуй проверить знаки: вершина параболы имеет координату h = -b / (2*a). Не забыл ли скобки?',
          },
        ]);
      }
    } catch {
      setTutorMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Обрати внимание на приоритет деления в Python: выражение `-b / 2 * a` выполняет сначала деление на 2, а потом умножение на a.',
        },
      ]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const handleEscalateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentQuery.trim()) return;
    await escalateToMentor(user.email || 'student-demo', studentQuery);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      {/* 1. Header: Strict Minimalist Navigation */}
      <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <span>Digital Mentor</span>
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-xs text-[var(--foreground)] font-mono font-medium">
            {currentNode?.title || 'Практика'}
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${
              currentNode?.node_type === 'capstone_boss'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}
          >
            {currentNode?.node_type === 'capstone_boss' ? 'Capstone Boss' : 'Interactive Step'}
          </span>
        </div>

        {/* Center: Hybrid architecture badge */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-raised)]">
            <span className="w-2 h-2 rounded-full bg-blue-500 status-dot-pulse" />
            <span className="text-[var(--muted)]">Гибрид:</span>
            <span className="font-semibold text-blue-400">70% AI</span>
            <span className="text-[var(--border-subtle)]">|</span>
            <span className="font-semibold text-emerald-400">30% Волонтеры</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
            <Flame className="w-4 h-4 fill-emerald-400/20" />
            <span>5 дней стрик</span>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/mentors/tickets"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--border-subtle)] rounded-md transition-colors"
            title="Перейти к очереди тикетов менторов"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Очередь волонтеров</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* 2. Main Workspace: Split Screen Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-3.5rem)]">
        {/* LEFT COLUMN: Problem, AI Tutor & Escalation (5 cols) */}
        <section className="lg:col-span-5 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col h-full">
          {/* Tabs bar */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 bg-[var(--surface-raised)]">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('problem')}
                className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'problem'
                    ? 'border-blue-500 text-[var(--foreground)] font-semibold'
                    : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                Задание
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hints')}
                className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'hints'
                    ? 'border-blue-500 text-[var(--foreground)] font-semibold'
                    : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Тьютор Socratic AI</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('theory')}
                className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'theory'
                    ? 'border-blue-500 text-[var(--foreground)] font-semibold'
                    : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                Формулы SAT
              </button>
            </div>

            {/* Attempts badge */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-[var(--muted)]">Попытки:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  attempts >= 3
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]'
                }`}
              >
                {attempts}/3
              </span>
            </div>
          </div>

          {/* Tab content area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'problem' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-[var(--foreground)] mb-1">
                    {currentNode?.title}
                  </h1>
                  <p className="text-xs font-mono text-[var(--muted)]">
                    SAT Math · Section 3 & 4 · Quadratic Functions
                  </p>
                </div>

                <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-sm leading-relaxed space-y-3">
                  <p>{currentNode?.problem_statement}</p>
                  <div className="p-3 rounded bg-[var(--background)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--muted)]">
                    <p className="text-[var(--foreground)] font-semibold mb-1">Математический инвариант:</p>
                    <p>h = -b / (2 * a)</p>
                    <p>k = c - (b ** 2) / (4 * a)</p>
                  </div>
                </div>

                {/* 70/30 Hybrid Escalation Banner if attempts >= 3 */}
                {canEscalateToMentor && (
                  <div className="p-4 rounded-md border border-emerald-500/40 bg-emerald-500/5 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          Активация 30% волонтерского звена
                        </h4>
                        <p className="text-xs text-[var(--muted)] leading-relaxed">
                          ИИ заметил затруднения после 3 попыток. Вы можете передать ваш код человеку-волонтеру. Волонтер проверит решение и получит 15 минут в официальный сертификат.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTicketModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-subtle"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Позвать ментора-волонтера (+15 мин волонтеру)</span>
                    </button>
                  </div>
                )}

                {/* Active ticket banner if one exists */}
                {activeTicket && (
                  <div className="p-3 rounded-md border border-blue-500/30 bg-blue-500/10 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                      <div>
                        <span className="font-semibold text-blue-300">Тикет #{activeTicket.id.slice(0, 8)}:</span>{' '}
                        <span className="text-[var(--muted)]">
                          {activeTicket.status === 'open' && 'В очереди волонтеров (ожидает ментора)'}
                          {activeTicket.status === 'in_progress' && 'Ментор взял тикет в работу'}
                          {activeTicket.status === 'resolved' && 'Ментор ответил!'}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/mentors/tickets"
                      className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      Смотреть <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Socratic AI Tutor (70% Интеллектуальный слой)</span>
                </div>
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {tutorMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-md text-xs leading-relaxed ${
                        msg.role === 'assistant'
                          ? 'bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)]'
                          : 'bg-blue-600/10 border border-blue-500/20 text-blue-300 ml-6'
                      }`}
                    >
                      <p className="font-semibold text-[10px] uppercase font-mono mb-1 text-[var(--muted)]">
                        {msg.role === 'assistant' ? 'Ment AI' : 'Вы'}
                      </p>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                  {isTutorLoading && (
                    <div className="p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-[var(--muted)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      <span>Socratic AI генерирует подсказку...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAskTutor} className="flex gap-2">
                  <input
                    type="text"
                    value={tutorInput}
                    onChange={(e) => setTutorInput(e.target.value)}
                    placeholder="Спросить у Socratic AI..."
                    className="flex-1 bg-[var(--background)] border border-[var(--border)] focus:border-blue-500 text-xs px-3 py-2 rounded-md outline-none text-[var(--foreground)] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isTutorLoading || !tutorInput.trim()}
                    className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'theory' && (
              <div className="space-y-4 text-xs text-[var(--muted)] leading-relaxed">
                <h3 className="font-bold text-sm text-[var(--foreground)]">Канонические формы параболы</h3>
                <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-raised)] font-mono space-y-2">
                  <p className="text-[var(--foreground)] font-semibold">1. Standard Form:</p>
                  <p>y = ax² + bx + c</p>
                  <p className="text-[var(--foreground)] font-semibold mt-2">2. Vertex Form:</p>
                  <p>y = a(x - h)² + k</p>
                  <p className="text-emerald-400">Вершина: (h, k) = (-b / (2a), c - b² / (4a))</p>
                </div>
                <p>
                  На экзамене SAT и в казахстанских СОР/СОЧ задачи на параболу проверяют способность быстро переходить между стандартной и вершинной формой.
                </p>
              </div>
            )}
          </div>

          {/* Footer of Left Column: Manual Mentor Escalation Button */}
          <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between">
            <span className="text-xs text-[var(--muted)] font-mono">
              70% AI / 30% Volunteers
            </span>
            <button
              type="button"
              onClick={() => setTicketModalOpen(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Создать микро-тикет ментору</span>
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: Code Editor & Terminal (7 cols) */}
        <section className="lg:col-span-7 flex flex-col h-full bg-[var(--background)]">
          {/* Editor Header */}
          <div className="h-10 border-b border-[var(--border)] bg-[var(--surface)] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="text-[var(--foreground)] font-medium">solution.py</span>
              <span className="text-[10px] text-[var(--border-subtle)]">|</span>
              <span>Python 3.11</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetNode}
                title="Сбросить код до исходного состояния"
                className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-raised)] border border-transparent hover:border-[var(--border)] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled={isEvaluating}
                onClick={evaluateCode}
                className="flex items-center gap-1.5 py-1 px-3.5 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-subtle"
              >
                {isEvaluating ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Проверка...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Проверить код</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Textarea Editor */}
          <div className="flex-1 relative flex">
            {/* Line numbers column */}
            <div className="w-10 py-3 select-none text-right pr-3 font-mono text-xs text-[var(--border-subtle)] bg-[var(--surface)] border-r border-[var(--border)]">
              {userCode.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code input */}
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-[var(--background)] text-[var(--foreground)] font-mono text-xs p-3 leading-relaxed resize-none outline-none focus:ring-0 border-0"
              placeholder="# Напишите ваш код здесь..."
            />
          </div>

          {/* Terminal Console Split */}
          <div className="h-64 border-t border-[var(--border)] bg-[var(--surface)] flex flex-col">
            <div className="h-8 border-b border-[var(--border)] px-4 flex items-center justify-between bg-[var(--surface-raised)] text-[11px] font-mono text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[var(--foreground)] font-semibold">TERMINAL & EVALUATION</span>
                {evaluationResult && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      evaluationResult.passed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {evaluationResult.passed ? 'PASSED 100%' : 'FAILED'}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={clearTerminal}
                className="text-[10px] hover:text-[var(--foreground)] transition-colors"
              >
                Очистить
              </button>
            </div>

            {/* Terminal output logs */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1.5 bg-[var(--background)]">
              {terminalLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-[var(--border-subtle)] select-none">[{log.timestamp}]</span>
                  <span
                    className={
                      log.type === 'stdout'
                        ? 'text-[var(--muted)]'
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
        </section>
      </main>

      {/* 3. Micro-Ticket Escalation Modal (30% Volunteers) */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  Создание микро-тикета для ментора-волонтера
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTicketModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Ваш тикет попадет в открытую очередь менторов. Волонтер разберет ваш код, ответит на вопрос и получит{' '}
              <strong className="text-emerald-400 font-semibold">15 минут подтвержденных часов</strong> в официальный сертификат.
            </p>

            <form onSubmit={handleEscalateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  В чем именно возникла сложность?
                </label>
                <textarea
                  rows={3}
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  placeholder="Например: Не понимаю, почему при расчете k парабола смещается вниз вместо того чтобы подняться..."
                  className="w-full p-2.5 rounded-md bg-[var(--background)] border border-[var(--border)] focus:border-emerald-500 text-xs text-[var(--foreground)] outline-none resize-none"
                  required
                />
              </div>

              <div className="p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] space-y-1">
                <p className="text-[11px] font-semibold text-[var(--muted)] uppercase font-mono">
                  Автоматически прикрепленный контекст:
                </p>
                <p className="text-xs text-[var(--foreground)] font-mono truncate">
                  Узел: {currentNode?.title} ({currentNode?.node_type})
                </p>
                <p className="text-xs text-[var(--muted)] font-mono">
                  Код решения: {userCode.split('\n').length} строк
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-subtle"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Отправить в очередь (+15 мин волонтеру)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
