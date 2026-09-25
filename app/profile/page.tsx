'use client';

import React, { useState } from 'react';
import { useUser } from '../../src/context/UserContext';

export default function ProfilePage() {
  const { user, updateUser, logout } = useUser();
  const [name, setName] = useState(user.name);
  const [grade, setGrade] = useState(user.grade);
  const [subject, setSubject] = useState(user.subject);
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, grade, subject });
    setToast('Профиль успешно обновлён!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '960px' }}>
      {/* 1. Единообразный заголовок экрана */}
      <section>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8', marginBottom: '8px' }}>
          <span>●</span>
          <span>Настройки аккаунта</span>
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Личный профиль пользователя
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: 1.5 }}>
          Управление персональной академической информацией, классом обучения и активными сессиями.
        </p>
      </section>

      {/* 2. Карточка пользователя */}
      <section
        style={{
          background: '#0F172A',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '24px',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 0 24px rgba(56, 189, 248, 0.35)',
          }}
        >
          {user.avatarText || 'МК'}
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>{user.name}</h2>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: user.role === 'Ментор' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: user.role === 'Ментор' ? '#93C5FD' : '#34D399', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              Роль: {user.role} (зафиксирована)
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>{user.email} • {user.grade} • Дисциплина: {user.subject}</div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Вы действительно хотите выйти из аккаунта?')) logout();
          }}
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#F87171',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Выйти из аккаунта
        </button>
      </section>

      {/* 3. Форма академических настроек */}
      <section
        style={{
          background: '#0F172A',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: '24px',
          padding: '32px',
        }}
      >
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
          Академические параметры
        </h3>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
              Имя и фамилия
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(8, 14, 30, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                Класс обучения
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(8, 14, 30, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="9 класс">9 класс</option>
                <option value="10 класс">10 класс</option>
                <option value="11 класс">11 класс</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                Основная дисциплина
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(8, 14, 30, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Алгебра">Алгебра</option>
                <option value="Геометрия">Геометрия</option>
                <option value="Физика">Физика</option>
                <option value="Информатика">Информатика & Python</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(56, 189, 248, 0.35)',
              }}
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </section>

      {/* 4. Активные сессии и безопасность */}
      <section
        style={{
          background: '#0F172A',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: '24px',
          padding: '32px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
          Безопасность и активные сессии
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(8, 14, 30, 0.6)', padding: '16px 20px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '20px' }}>💻</span>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>Текущая сессия (Google Auth)</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Астана, Казахстан • Chrome / Windows</div>
            </div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            Активна сейчас
          </span>
        </div>
      </section>

      {toast && (
        <div style={{ position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)', background: '#059669', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)', zIndex: 9999, fontWeight: 600, fontSize: '14px' }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
