'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '../../src/context/UserContext';

export default function DashboardPage() {
  const { user } = useUser();

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
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8' }}>2 курса</div>
          <div style={{ fontSize: '11px', color: '#34D399', marginTop: '4px' }}>СОР/СОЧ Prep + 1-на-1</div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Уроков на неделе</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#60A5FA' }}>4 созвона</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Ближайший: Четверг, 17:00</div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Продуктивность с Ment</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8' }}>14.5 ч</div>
          <div style={{ fontSize: '11px', color: '#34D399', marginTop: '4px' }}>+3.2 ч за последние 7 дней</div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Посещаемость уроков</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#10B981' }}>100%</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Без единого пропуска</div>
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
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Четверг, 17:00 – 18:00</span>
            </div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
              Алгебра 11 класс · Разбор СОР №2 (Логарифмы)
            </h3>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              Ментор-волонтёр: <strong style={{ color: '#E2E8F0' }}>Айбек С.</strong> (Призёр олимпиад)
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
            href="https://meet.google.com"
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
