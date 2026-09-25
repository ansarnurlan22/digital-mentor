'use client';

import React from 'react';
import { useUser } from '../../src/context/UserContext';

export default function AchievementsPage() {
  const { user } = useUser();

  const badges = [
    { title: 'Мастер Сократа', desc: 'Успешно решил 20 задач через наводящие вопросы с Ment AI', icon: '🧠', unlocked: true },
    { title: '100% Посещаемость', desc: 'Ни одного пропущенного урока за весь учебный семестр', icon: '🎯', unlocked: true },
    { title: 'СОР на максимум', desc: 'Сдал промежуточный срез по Алгебре на наивысший балл', icon: '⭐', unlocked: true },
    { title: 'Олимпиадный спринт', desc: 'Решил 15 нестандартных олимпиадных задач на воркшопе', icon: '⚡', unlocked: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Единообразный заголовок экрана */}
      <section>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8', marginBottom: '8px' }}>
          <span>●</span>
          <span>Признание и прогресс</span>
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Достижения и академический рейтинг
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: 1.5 }}>
          Фиксация академических побед, прогресс волонтёрских часов и признание лучших участников сообщества.
        </p>
      </section>

      {/* 2. Статистика волонтёрских часов и рейтинга */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>Подтверждённые часы</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#38BDF8' }}>{user.volunteerHours || 24} ч</div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(148, 163, 184, 0.15)', borderRadius: '999px', margin: '12px 0 8px', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #0284C7, #38BDF8)', borderRadius: '999px' }} />
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>Цель: 40 часов для волонтёрского сертификата</div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>Академический рейтинг</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FBBF24' }}>★ 4.95</div>
          <div style={{ fontSize: '12px', color: '#34D399', marginTop: '12px' }}>Топ 5% среди учеников старших классов</div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>Знаков отличия</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#C084FC' }}>3 из 4</div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '12px' }}>Следующий бейдж: «Олимпиадный спринт»</div>
        </div>
      </section>

      {/* 3. Знаки отличия (Бейджи) */}
      <section>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
          Знаки отличия
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {badges.map((b, i) => (
            <div
              key={i}
              style={{
                background: '#0F172A',
                border: b.unlocked ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                gap: '16px',
                opacity: b.unlocked ? 1 : 0.5,
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: b.unlocked ? 'rgba(56, 189, 248, 0.15)' : 'rgba(148, 163, 184, 0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '24px',
                  flexShrink: 0,
                }}
              >
                {b.icon}
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                  {b.title}
                </h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.45 }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Плоскость признания: Ментор и Ученик месяца */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Лучший ментор месяца */}
        <div style={{ background: '#0F172A', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
              Лучший ментор месяца
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Сентябрь 2026</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #B45309)', color: '#FFFFFF', fontWeight: 800, fontSize: '20px', display: 'grid', placeItems: 'center' }}>
              АС
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                Айбек Сейткали
              </h3>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>Ментор по Алгебре · 11 класс НИШ</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(8, 14, 30, 0.6)', padding: '10px', borderRadius: '12px' }}>
              <div style={{ fontWeight: 800, color: '#FFFFFF' }}>48</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>уроков</div>
            </div>
            <div style={{ background: 'rgba(8, 14, 30, 0.6)', padding: '10px', borderRadius: '12px' }}>
              <div style={{ fontWeight: 800, color: '#FBBF24' }}>4.98</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>рейтинг</div>
            </div>
            <div style={{ background: 'rgba(8, 14, 30, 0.6)', padding: '10px', borderRadius: '12px' }}>
              <div style={{ fontWeight: 800, color: '#38BDF8' }}>14</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>учеников</div>
            </div>
          </div>
        </div>

        {/* Лучший ученик месяца */}
        <div style={{ background: '#0F172A', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
              Лучший ученик месяца
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Сентябрь 2026</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', fontWeight: 800, fontSize: '20px', display: 'grid', placeItems: 'center' }}>
              МК
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                {user.name}
              </h3>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>Ученик {user.grade} · {user.subject}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(8, 14, 30, 0.6)', padding: '10px', borderRadius: '12px' }}>
              <div style={{ fontWeight: 800, color: '#FFFFFF' }}>18</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>тем закрыто</div>
            </div>
            <div style={{ background: 'rgba(8, 14, 30, 0.6)', padding: '10px', borderRadius: '12px' }}>
              <div style={{ fontWeight: 800, color: '#34D399' }}>+24</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>к баллам</div>
            </div>
            <div style={{ background: 'rgba(8, 14, 30, 0.6)', padding: '10px', borderRadius: '12px' }}>
              <div style={{ fontWeight: 800, color: '#38BDF8' }}>100%</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>посещаемость</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
