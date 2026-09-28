'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../../src/context/UserContext';
import {
  Code2,
  Users,
  Sparkles,
  Flame,
  Clock,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Video,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();
  const [coursesCount, setCoursesCount] = useState<number>(3);
  const [coursesNote, setCoursesNote] = useState<string>('SAT Math + СОР/СОЧ');
  const [weeklyLessonsCount, setWeeklyLessonsCount] = useState<number>(3);
  const [weeklyLessonsNote, setWeeklyLessonsNote] = useState<string>('Ближайший: Четверг, 17:00');
  const [mentHours, setMentHours] = useState<string>('2.5 ч');
  const [mentNote, setMentNote] = useState<string>('+1.2 ч за 7 дней');
  const [attendance, setAttendance] = useState<string>('100%');
  const [nearestLesson, setNearestLesson] = useState<any>(null);

  useEffect(() => {
    try {
      const cData = localStorage.getItem('digitalMentor_activeCourses');
      if (cData) {
        const parsed = JSON.parse(cData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCoursesCount(parsed.length);
          const progs = [...new Set(parsed.map((c: any) => c.programName || c.program))].slice(0, 2).join(' + ');
          setCoursesNote(progs || 'Активная подготовка');
        }
      }
    } catch (e) {}

    try {
      const lData = localStorage.getItem('dm_cloud_lessons_cache');
      let lessons: any[] = [];
      if (lData) {
        const parsed = JSON.parse(lData);
        if (Array.isArray(parsed)) lessons = parsed;
      }

      const now = new Date();
      const upcoming = lessons
        .filter((l) => {
          if (l.status === 'completed') return false;
          if (!l.lesson_date) return false;
          const timeStr = l.start_time || '23:59';
          const dt = new Date(`${l.lesson_date}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`);
          return dt >= new Date(now.getTime() - 45 * 60 * 1000);
        })
        .sort((a, b) => new Date(`${a.lesson_date}T${a.start_time || '00:00'}`).getTime() - new Date(`${b.lesson_date}T${b.start_time || '00:00'}`).getTime());

      if (upcoming[0]) {
        setNearestLesson(upcoming[0]);
        setWeeklyLessonsNote(`Ближайший: ${upcoming[0].start_time || '17:00'}`);
      }
    } catch (e) {}

    try {
      const mData = localStorage.getItem('digitalMentor_mentMinutes');
      const mins = parseInt(mData || '120', 10);
      const hrs = (mins / 60).toFixed(1);
      setMentHours(`${hrs} ч`);
    } catch (e) {}
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Page Header (Strict Swiss Typography) */}
      <section className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-blue-500 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Digital Mentor Platform · 70/30 Hybrid</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Привет, {user.name}! 👋
        </h1>
        <p className="text-xs text-[var(--muted)] leading-relaxed max-w-2xl">
          Сводка учебного прогресса, интерактивная практика с Socratic AI и очередь волонтерских микро-тикетов.
        </p>
      </section>

      {/* 2. Hero Action Card: 70% AI / 30% Volunteers Practice Studio */}
      <section className="p-6 rounded-lg border border-blue-500/30 bg-[var(--surface)] hover:border-blue-500/50 transition-all shadow-subtle relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Интерактивная практика
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-emerald-400/20" />
                <span>+40 XP</span>
              </span>
            </div>

            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
              Поиск вершины параболы (Vertex Form) — SAT Math & СОР/СОЧ
            </h2>

            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Решите аналитическую задачу в терминале. 70% процесса курирует Socratic AI в реальном времени. Если вы допустите 3 ошибки, система автоматически предложит сформировать микро-тикет для ментора-волонтера (+15 мин в волонтерский сертификат).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/practice"
              className="py-2.5 px-5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-subtle"
            >
              <Code2 className="w-4 h-4" />
              <span>Открыть студию практики →</span>
            </Link>

            <Link
              href="/mentors/tickets"
              className="py-2.5 px-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--foreground)] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Очередь тикетов</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Quick Stats (Minimalist 1px Border Grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="text-xs text-[var(--muted)] font-medium">Активные курсы</div>
          <div className="text-2xl font-bold font-mono text-[var(--foreground)]">{coursesCount} курса</div>
          <div className="text-[11px] text-emerald-400 font-mono">{coursesNote}</div>
        </div>

        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="text-xs text-[var(--muted)] font-medium">Уроков на этой неделе</div>
          <div className="text-2xl font-bold font-mono text-[var(--foreground)]">{weeklyLessonsCount} занятия</div>
          <div className="text-[11px] text-[var(--muted)] font-mono">{weeklyLessonsNote}</div>
        </div>

        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="text-xs text-[var(--muted)] font-medium">Часы работы с Ment AI</div>
          <div className="text-2xl font-bold font-mono text-[var(--foreground)]">{mentHours}</div>
          <div className="text-[11px] text-emerald-400 font-mono">+1.2 ч за 7 дней</div>
        </div>

        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="text-xs text-[var(--muted)] font-medium">Посещаемость сессий</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{attendance}</div>
          <div className="text-[11px] text-[var(--muted)] font-mono">Без единого пропуска</div>
        </div>
      </section>

      {/* 4. Upcoming Online Lesson Banner */}
      <section className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Онлайн-сессия
              </span>
              <span className="text-xs text-[var(--muted)] font-mono">
                {nearestLesson ? `${nearestLesson.lesson_date}, ${nearestLesson.start_time || '17:00'}` : 'Онлайн-сессии завершены'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {nearestLesson ? `${nearestLesson.subject || 'Предмет'} · ${nearestLesson.title || 'Тематический урок'}` : 'Нет предстоящих уроков в расписании'}
            </h3>
            <div className="text-xs text-[var(--muted)]">
              {nearestLesson ? (
                <>Ментор-волонтёр: <strong className="text-[var(--foreground)]">{nearestLesson.mentor_name || 'Волонтёр'}</strong></>
              ) : (
                'Запланируйте новое занятие в разделе Расписание.'
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/schedule"
            className="py-2 px-3.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--foreground)] font-semibold hover:border-[var(--border-subtle)] transition-colors"
          >
            Всё расписание
          </Link>
          <a
            href={nearestLesson?.meet_url || 'https://meet.google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-subtle"
          >
            <span>Google Meet →</span>
          </a>
        </div>
      </section>

      {/* 5. Modules & Curricula Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
              Учебные направления платформы
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Специализированные треки подготовки для школьников Казахстана.
            </p>
          </div>
          <Link href="/courses" className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1">
            <span>Каталог курсов</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase">SAT Math</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--muted)] border border-[var(--border)]">1-на-1</span>
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">Квадратные функции & Параболы</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Теория вершины параболы, разложение многочленов, разбор задач Section 3 & 4.
            </p>
            <Link href="/practice" className="text-xs text-blue-400 font-semibold hover:underline block pt-1">
              Решать карточки →
            </Link>
          </div>

          <div className="p-5 rounded-lg border border-blue-500/40 bg-[var(--surface)] space-y-3 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">СОР / СОЧ</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Интенсив</span>
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">Подготовка к СОР/СОЧ: Алгебра</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Критерии оценивания, разбор типовых формативных и суммативных срезов за четверть.
            </p>
            <Link href="/practice" className="text-xs text-emerald-400 font-semibold hover:underline block pt-1">
              Практиковать СОР →
            </Link>
          </div>

          <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">Воркшопы</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--muted)] border border-[var(--border)]">Группы</span>
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">Практикумы и олимпиады</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Интерактивные групповые мастер-классы с менторами и совместный разбор сложных задач.
            </p>
            <Link href="/courses" className="text-xs text-purple-400 font-semibold hover:underline block pt-1">
              Расписание групп →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
