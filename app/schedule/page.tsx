'use client';

import React, { useState } from 'react';
import { useUser } from '../../src/context/UserContext';

interface Lesson {
  id: string;
  subject: string;
  topic: string;
  mentor: string;
  dayOfWeek: string;
  dateStr: string;
  timeSlot: string;
  meetLink: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const LESSONS: Lesson[] = [
  {
    id: 'les-1',
    subject: 'Алгебра (СОР/СОЧ Prep)',
    topic: 'Логарифмические уравнения и неравенства',
    mentor: 'Айбек С. (Старшеклассник-призёр)',
    dayOfWeek: 'Четверг',
    dateStr: '28 сентября 2026',
    timeSlot: '17:00 – 18:00',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming',
  },
  {
    id: 'les-2',
    subject: 'Алгебра (1-на-1 Наставничество)',
    topic: 'Показательные функции и свойства степеней',
    mentor: 'Айбек С. (Старшеклассник-призёр)',
    dayOfWeek: 'Суббота',
    dateStr: '30 сентября 2026',
    timeSlot: '15:30 – 16:30',
    meetLink: 'https://meet.google.com/klm-nopq-rst',
    status: 'upcoming',
  },
  {
    id: 'les-3',
    subject: 'Геометрия (СОР/СОЧ Prep)',
    topic: 'Аксиомы стереометрии и взаимное расположение прямых',
    mentor: 'Дана М. (Победитель олимпиады)',
    dayOfWeek: 'Вторник',
    dateStr: '26 сентября 2026',
    timeSlot: '18:00 – 19:00',
    meetLink: 'https://meet.google.com/uvw-xyza-bcd',
    status: 'completed',
  },
  {
    id: 'les-4',
    subject: 'Информатика & Python',
    topic: 'Динамическое программирование и задачи на рюкзак',
    mentor: 'Арман Т. (Разработчик & Ментор)',
    dayOfWeek: 'Понедельник',
    dateStr: '25 сентября 2026',
    timeSlot: '19:00 – 20:30',
    meetLink: 'https://meet.google.com/efg-hijk-lmn',
    status: 'completed',
  },
];

export default function SchedulePage() {
  const { user } = useUser();
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [activeWeek, setActiveWeek] = useState<'current' | 'next'>('current');

  const filtered = selectedDay === 'all'
    ? LESSONS
    : LESSONS.filter((l) => l.dayOfWeek === selectedDay);

  const days = [
    { label: 'Все дни', value: 'all' },
    { label: 'Пн', value: 'Понедельник' },
    { label: 'Вт', value: 'Вторник' },
    { label: 'Ср', value: 'Среда' },
    { label: 'Чт', value: 'Четверг' },
    { label: 'Пт', value: 'Пятница' },
    { label: 'Сб', value: 'Суббота' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Единообразный заголовок экрана */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8', marginBottom: '8px' }}>
            <span>●</span>
            <span>Календарь занятий</span>
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Расписание онлайн-уроков
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: 1.5 }}>
            Интерактивный календарь онлайн-созвонов, даты ближайших сессий и прямые ссылки на видеовстречи.
          </p>
        </div>

        {/* Переключатель недели */}
        <div style={{ display: 'flex', background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '14px', padding: '4px' }}>
          <button
            type="button"
            onClick={() => setActiveWeek('current')}
            style={{
              background: activeWeek === 'current' ? '#0284C7' : 'transparent',
              color: activeWeek === 'current' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Текущая неделя
          </button>
          <button
            type="button"
            onClick={() => setActiveWeek('next')}
            style={{
              background: activeWeek === 'next' ? '#0284C7' : 'transparent',
              color: activeWeek === 'next' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Следующая неделя
          </button>
        </div>
      </section>

      {/* 2. Фильтр дней недели */}
      <section style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {days.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => setSelectedDay(d.value)}
            style={{
              background: selectedDay === d.value ? 'rgba(56, 189, 248, 0.16)' : '#0F172A',
              border: selectedDay === d.value ? '1px solid #38BDF8' : '1px solid rgba(148, 163, 184, 0.12)',
              color: selectedDay === d.value ? '#38BDF8' : '#94A3B8',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {d.label}
          </button>
        ))}
      </section>

      {/* 3. Список уроков */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((lesson) => {
          const isUpcoming = lesson.status === 'upcoming';
          return (
            <article
              key={lesson.id}
              style={{
                background: '#0F172A',
                border: isUpcoming ? '1px solid rgba(56, 189, 248, 0.28)' : '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: '20px',
                padding: '24px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: isUpcoming ? 'rgba(56, 189, 248, 0.14)' : 'rgba(148, 163, 184, 0.08)',
                    color: isUpcoming ? '#38BDF8' : '#64748B',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}
                >
                  {isUpcoming ? '📅' : '✓'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: isUpcoming ? 'rgba(56, 189, 248, 0.15)' : 'rgba(148, 163, 184, 0.1)', color: isUpcoming ? '#38BDF8' : '#94A3B8' }}>
                      {lesson.dayOfWeek} · {lesson.timeSlot}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{lesson.dateStr}</span>
                  </div>

                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                    {lesson.subject}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                    Тема: <strong style={{ color: '#E2E8F0' }}>{lesson.topic}</strong> • Ментор: {lesson.mentor}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => alert(`Материалы к уроку «${lesson.topic}» скачиваются...`)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    color: '#94A3B8',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Материалы урока
                </button>

                {isUpcoming ? (
                  <a
                    href={lesson.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                      color: '#FFFFFF',
                      padding: '10px 22px',
                      borderRadius: '12px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 4px 18px rgba(56, 189, 248, 0.35)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Войти в звонок</span>
                    <span>→</span>
                  </a>
                ) : (
                  <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 600, padding: '8px 14px' }}>
                    Завершено ✓
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
