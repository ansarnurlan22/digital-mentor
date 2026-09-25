'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../../src/context/UserContext';

export default function DashboardPage() {
  const { user } = useUser();
  const [coursesCount, setCoursesCount] = useState<number>(2);
  const [coursesNote, setCoursesNote] = useState<string>('СОР/СОЧ Prep + 1-на-1');
  const [weeklyLessonsCount, setWeeklyLessonsCount] = useState<number>(3);
  const [weeklyLessonsNote, setWeeklyLessonsNote] = useState<string>('Ближайший: Четверг, 17:00');
  const [mentHours, setMentHours] = useState<string>('2.5 ч');
  const [mentNote, setMentNote] = useState<string>('+1.2 ч за 7 дней');
  const [attendance, setAttendance] = useState<string>('100%');
  const [attendanceNote, setAttendanceNote] = useState<string>('Без единого пропуска');
  const [nearestLesson, setNearestLesson] = useState<any>(null);

  useEffect(() => {
    try {
      const cData = localStorage.getItem('digitalMentor_activeCourses');
      if (cData) {
        const parsed = JSON.parse(cData);
        if (Array.isArray(parsed)) {
          setCoursesCount(parsed.length);
          if (parsed.length === 0) {
            setCoursesNote('Нет активных курсов');
          } else {
            const progs = [...new Set(parsed.map((c: any) => c.programName || c.program))].slice(0, 2).join(' + ');
            setCoursesNote(progs || 'Активная подготовка');
          }
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
      let curDay = now.getDay();
      if (curDay === 0) curDay = 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - curDay + 1);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const weekly = lessons.filter((l) => {
        if (!l.lesson_date) return false;
        const d = new Date(l.lesson_date + 'T00:00:00');
        return d >= monday && d <= sunday;
      });
      setWeeklyLessonsCount(weekly.length);

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
      } else if (weekly.length > 0) {
        setWeeklyLessonsNote('Все уроки недели завершены');
      } else {
        setWeeklyLessonsNote('Нет уроков на этой неделе');
      }

      const isPast = (l: any) => {
        if (!l.lesson_date) return false;
        const timeStr = l.end_time || l.start_time || '23:59';
        const dt = new Date(`${l.lesson_date}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`);
        return !isNaN(dt.getTime()) && dt < now;
      };
      const ended = lessons.filter((l) => l.status === 'completed' || isPast(l));
      const completed = lessons.filter((l) => l.status === 'completed');

      if (ended.length > 0) {
        const rate = Math.round((completed.length / ended.length) * 100);
        setAttendance(`${Math.min(100, rate)}%`);
        setAttendanceNote(rate === 100 ? `Завершено ${completed.length} из ${ended.length} уроков` : `Посещено ${completed.length} из ${ended.length} завершённых`);
      } else {
        setAttendance('100%');
        setAttendanceNote('Все уроки впереди · Без пропусков');
      }
    } catch (e) {}

    try {
      const mData = localStorage.getItem('digitalMentor_mentMinutes');
      const mins = parseInt(mData || '120', 10);
      const hrs = (mins / 60).toFixed(1);
      setMentHours(`${hrs} ч`);
      setMentNote(`+${Math.min((mins / 60) * 0.4, 4.8).toFixed(1)} ч за 7 дней`);
    } catch (e) {}
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Единообразный заголовок экрана */}
      <section>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8', marginBottom: '8px' }}>
          <span>●</span>
          <span>Обзорная панель</span>
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Привет, {user.name}! 👋
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: 1.5 }}>
          Сводка твоего учебного процесса по дисциплине «{user.subject}», активные программы и ближайшие онлайн-занятия.
        </p>
      </section>

      {/* 2. Сводные метрики (Quick Stats) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Активные курсы</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8' }}>{coursesCount} {coursesCount === 1 ? 'курс' : coursesCount >= 2 && coursesCount <= 4 ? 'курса' : 'курсов'}</div>
          <div style={{ fontSize: '11px', color: '#34D399', marginTop: '4px' }}>{coursesNote}</div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Уроков на неделе</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#60A5FA' }}>{weeklyLessonsCount} {weeklyLessonsCount === 1 ? 'урок' : weeklyLessonsCount >= 2 && weeklyLessonsCount <= 4 ? 'урока' : 'уроков'}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{weeklyLessonsNote}</div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Продуктивность с Ment</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8' }}>{mentHours}</div>
          <div style={{ fontSize: '11px', color: '#34D399', marginTop: '4px' }}>{mentNote}</div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Посещаемость уроков</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#10B981' }}>{attendance}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{attendanceNote}</div>
        </div>
      </section>

      {/* 3. Ближайший онлайн-урок */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(14, 29, 61, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 8px 32px rgba(0, 8, 30, 0.4)',
        }}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38BDF8',
              display: 'grid',
              placeItems: 'center',
              fontSize: '24px',
              flexShrink: 0,
            }}
          >
            📹
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8' }}>
                Ближайшая онлайн-встреча
              </span>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>{nearestLesson ? `${nearestLesson.lesson_date}, ${nearestLesson.start_time || '17:00'}` : 'Онлайн-сессии завершены'}</span>
            </div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
              {nearestLesson ? `${nearestLesson.subject || 'Предмет'} · ${nearestLesson.title || 'Тематический урок'}` : 'Нет предстоящих уроков в расписании'}
            </h3>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              {nearestLesson ? (
                <>Ментор-волонтёр: <strong style={{ color: '#E2E8F0' }}>{nearestLesson.mentor_name || 'Волонтёр'}</strong></>
              ) : (
                'Запланируйте новое занятие в разделе Расписание.'
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link
            href="/schedule"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#CBD5E1',
              padding: '11px 20px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Всё расписание
          </Link>
          <a
            href={nearestLesson?.meet_url || "https://meet.google.com"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
              color: '#FFFFFF',
              padding: '11px 24px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(56, 189, 248, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            Подключиться (Google Meet) →
          </a>
        </div>
      </section>

      {/* 4. Направления программ с быстрым переходом в /courses */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
              Учебные направления платформы
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
              Выберите подходящий формат обучения для достижения максимального результата.
            </p>
          </div>
          <Link
            href="/courses"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#38BDF8',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Каталог курсов →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', display: 'grid', placeItems: 'center' }}>
                👤
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(148, 163, 184, 0.12)', color: '#CBD5E1' }}>1-на-1</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Наставничество</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', lineHeight: 1.5, flex: 1 }}>
              Индивидуальные регулярные сессии со школьником-волонтёром для углублённого разбора тем.
            </p>
            <Link href="/courses" style={{ color: '#38BDF8', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
              Перейти к курсам →
            </Link>
          </div>

          <div style={{ background: '#0E1D3D', border: '2px solid #38BDF8', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 0 25px rgba(56, 189, 248, 0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.16)', color: '#38BDF8', display: 'grid', placeItems: 'center' }}>
                🎯
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8' }}>СОР / СОЧ</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Подготовка к СОР/СОЧ</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', lineHeight: 1.5, flex: 1 }}>
              Интенсивный разбор типовых заданий четверти, сложных математических формул и критериев оценивания.
            </p>
            <Link href="/courses" style={{ color: '#38BDF8', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
              Перейти к курсам →
            </Link>
          </div>

          <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', display: 'grid', placeItems: 'center' }}>
                ⚡
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(148, 163, 184, 0.12)', color: '#CBD5E1' }}>Группы</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Воркшопы</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', lineHeight: 1.5, flex: 1 }}>
              Интерактивные групповые мастер-классы, разборы олимпиадных задач и экспресс-практикумы.
            </p>
            <Link href="/courses" style={{ color: '#38BDF8', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
              Перейти к курсам →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
