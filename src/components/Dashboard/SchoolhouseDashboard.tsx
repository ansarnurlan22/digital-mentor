'use client';

import React, { useState } from 'react';

export type ProgramType = 'sor-soch' | 'mentoring' | 'workshops';

export interface Course {
  id: string;
  name: string;
  grade: string;
  program: ProgramType;
  programName: string;
  mentor: string;
  description: string;
  topics: string[];
  durationWeeks: string;
  frequency: string;
  lessonDuration: string;
  maxStudents: number;
  startDate: string;
}

const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-sat-alg-11',
    name: 'Алгебра 11 класс (СОР/СОЧ Prep)',
    grade: '11',
    program: 'sor-soch',
    programName: 'СОР/СОЧ Prep',
    mentor: 'Айбек С. · Старшеклассник-призёр олимпиад',
    description: 'Интенсивный разбор типовых заданий четверти, сложных логарифмических и показательных неравенств, а также критериев оценивания СОР/СОЧ.',
    topics: ['Логарифмы', 'Показательные уравнения', 'Стереометрия', 'Критерии оценивания'],
    durationWeeks: '4 недели',
    frequency: '2 раза в неделю',
    lessonDuration: '60 минут',
    maxStudents: 4,
    startDate: '2026-10-01',
  },
  {
    id: 'course-sat-geom-10',
    name: 'Геометрия 10 класс (СОР/СОЧ Prep)',
    grade: '10',
    program: 'sor-soch',
    programName: 'СОР/СОЧ Prep',
    mentor: 'Дана М. · Победитель республиканской олимпиады',
    description: 'Аксиомы стереометрии, взаимное расположение прямых и плоскостей, вычисление расстояний и углов в пространстве к текущим четвертным срезам.',
    topics: ['Векторы', 'Перпендикулярность плоскостей', 'Многогранники', 'Разбор типовых задач'],
    durationWeeks: '3 недели',
    frequency: '2 раза в неделю',
    lessonDuration: '60 минут',
    maxStudents: 5,
    startDate: '2026-10-05',
  },
  {
    id: 'course-sat-phys-11',
    name: 'Физика 10–11 класс (1-на-1 Наставничество)',
    grade: '10-11',
    program: 'mentoring',
    programName: '1-на-1 Наставничество',
    mentor: 'Алихан К. · Студент НУ / Выпускник НИШ',
    description: 'Индивидуальные сессии в комфортном темпе: законы сохранения, термодинамика и электродинамика без зубрежки сложных формул.',
    topics: ['Механика', 'Электромагнетизм', 'Термодинамика', 'Практические расчеты'],
    durationWeeks: '8 недель',
    frequency: '1–2 раза в неделю',
    lessonDuration: '75 минут',
    maxStudents: 1,
    startDate: '2026-10-03',
  },
  {
    id: 'course-sat-cs-workshop',
    name: 'Информатика & Python (Практический Воркшоп)',
    grade: '9-11',
    program: 'workshops',
    programName: 'Воркшоп',
    mentor: 'Арман Т. · Разработчик & Ментор',
    description: 'Интерактивный командный воркшоп: разбор олимпиадных алгоритмов, динамического программирования и решение задач на скорость.',
    topics: ['Алгоритмы и структуры', 'Динамическое программирование', 'Графы', 'Live-coding'],
    durationWeeks: '2 недели',
    frequency: '3 раза в неделю',
    lessonDuration: '90 минут',
    maxStudents: 12,
    startDate: '2026-10-10',
  },
];

interface SchoolhouseDashboardProps {
  userRole?: 'Ученик' | 'Ментор';
  userName?: string;
  onOpenMentChat?: () => void;
  onViewSchedule?: () => void;
}

export const SchoolhouseDashboard: React.FC<SchoolhouseDashboardProps> = ({
  userRole = 'Ученик',
  userName = 'Матвей',
  onOpenMentChat,
  onViewSchedule,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramType | 'all'>('sor-soch');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isMentor = userRole === 'Ментор';

  const filteredCourses = selectedProgram === 'all'
    ? DEFAULT_COURSES
    : DEFAULT_COURSES.filter((c) => c.program === selectedProgram);

  const handleAction = (courseId: string) => {
    if (isMentor) {
      if (onViewSchedule) onViewSchedule();
      return;
    }
    if (enrolledCourseIds.includes(courseId)) {
      setToastMessage('Вы уже записаны на этот курс');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setEnrolledCourseIds((prev) => [...prev, courseId]);
    setToastMessage('Вы успешно зарегистрировались на курс!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080E1E', color: '#FFFFFF', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* 1. Узкая вертикальная боковая панель (76px) */}
      <aside
        style={{
          width: '76px',
          background: '#0F172A',
          borderRight: '1px solid rgba(148, 163, 184, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0',
          gap: '20px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 800,
            fontSize: '20px',
            boxShadow: '0 0 18px rgba(56, 189, 248, 0.4)',
            marginBottom: '16px',
          }}
        >
          D
        </div>

        {/* Навигация */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, width: '100%', alignItems: 'center' }}>
          <button
            title="Дашборд"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#0284C7',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.45)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
            </svg>
          </button>

          <button
            title="Курсы"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'transparent',
              color: '#94A3B8',
              border: 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </button>

          <button
            title="Расписание"
            onClick={onViewSchedule}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'transparent',
              color: '#94A3B8',
              border: 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        </nav>

        {/* Выход */}
        <button
          title="Выход"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'transparent',
            color: '#64748B',
            border: 'none',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </aside>

      {/* 2. Основная рабочая область */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Шапка (Header) */}
        <header
          style={{
            height: '76px',
            background: 'rgba(8, 14, 30, 0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38BDF8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
              }}
            >
              DM
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em' }}>Digital Mentor</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Академическое наставничество</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Роль */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '999px',
                background: isMentor ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                border: isMentor ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '12px',
                fontWeight: 700,
                color: isMentor ? '#93C5FD' : '#6EE7B7',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isMentor ? '#3B82F6' : '#10B981',
                }}
              />
              Роль: {userRole}
            </div>

            {/* Чат с AI-тьютором Ment */}
            <button
              onClick={onOpenMentChat}
              title="Академический напарник Ment (24/7)"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                color: '#38BDF8',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            {/* Аватар */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {userName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Контентная часть дашборда */}
        <main style={{ padding: '36px', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {/* Hero */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Академические программы и курсы
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8' }}>
              Выберите направление подготовки к СОР/СОЧ или индивидуальное наставничество со старшеклассниками-волонтёрами.
            </p>
          </div>

          {/* Двухколоночный макет (Schoolhouse/SAT) */}
          <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px', alignItems: 'start' }}>
            {/* Левая колонка: 3 вертикальные карточки программ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8' }}>
                Направления
              </div>

              {/* 1. Наставничество 1-на-1 */}
              <div
                onClick={() => setSelectedProgram('mentoring')}
                style={{
                  background: selectedProgram === 'mentoring' ? '#0E1D3D' : '#0F172A',
                  border: selectedProgram === 'mentoring' ? '2px solid #38BDF8' : '1px solid rgba(148, 163, 184, 0.12)',
                  borderRadius: '20px',
                  padding: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedProgram === 'mentoring' ? '0 0 25px rgba(56, 189, 248, 0.22)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60A5FA',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    👤
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(148, 163, 184, 0.12)', color: '#CBD5E1' }}>
                    1-на-1
                  </span>
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700 }}>Наставничество</h3>
                <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                  Индивидуальные онлайн-сессии со школьником-волонтёром для комфортного закрытия пробелов.
                </p>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Индивидуальный темп • 1–2 раза в нед.</div>
              </div>

              {/* 2. Подготовка к СОР/СОЧ (Активна по умолчанию) */}
              <div
                onClick={() => setSelectedProgram('sor-soch')}
                style={{
                  background: selectedProgram === 'sor-soch' ? '#0E1D3D' : '#0F172A',
                  border: selectedProgram === 'sor-soch' ? '2px solid #38BDF8' : '1px solid rgba(148, 163, 184, 0.12)',
                  borderRadius: '20px',
                  padding: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedProgram === 'sor-soch' ? '0 0 25px rgba(56, 189, 248, 0.22)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(56, 189, 248, 0.16)',
                      color: '#38BDF8',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    🎯
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                    СОР / СОЧ
                  </span>
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700 }}>Подготовка к СОР/СОЧ</h3>
                <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                  Интенсивный разбор типовых задач четверти, математических алгоритмов и критериев оценивания.
                </p>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Формулы и срезы • 2 раза в нед.</div>
              </div>

              {/* 3. Воркшопы */}
              <div
                onClick={() => setSelectedProgram('workshops')}
                style={{
                  background: selectedProgram === 'workshops' ? '#0E1D3D' : '#0F172A',
                  border: selectedProgram === 'workshops' ? '2px solid #38BDF8' : '1px solid rgba(148, 163, 184, 0.12)',
                  borderRadius: '20px',
                  padding: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedProgram === 'workshops' ? '0 0 25px rgba(56, 189, 248, 0.22)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: '#C084FC',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    ⚡
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(148, 163, 184, 0.12)', color: '#CBD5E1' }}>
                    Группы
                  </span>
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700 }}>Воркшопы</h3>
                <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                  Интерактивные групповые мастер-классы, разборы олимпиадных задач и экспресс-практикумы.
                </p>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Практикумы • Командный разбор</div>
              </div>
            </div>

            {/* Правая колонка: Детализированный список курсов */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8', marginBottom: '4px' }}>
                    {selectedProgram === 'sor-soch'
                      ? 'Фильтр: Подготовка к СОР/СОЧ'
                      : selectedProgram === 'mentoring'
                      ? 'Фильтр: Наставничество 1-на-1'
                      : selectedProgram === 'workshops'
                      ? 'Фильтр: Воркшопы'
                      : 'Фильтр: Все курсы'}
                  </div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Список доступных курсов</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setSelectedProgram('all')}
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      color: selectedProgram === 'all' ? '#38BDF8' : '#94A3B8',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Все курсы
                  </button>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: '999px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38BDF8',
                    }}
                  >
                    {filteredCourses.length} {filteredCourses.length === 1 ? 'курс' : 'курса'}
                  </span>
                </div>
              </div>

              {/* Карточки курсов */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredCourses.map((course) => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);
                  return (
                    <article
                      key={course.id}
                      style={{
                        background: '#0F172A',
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        borderRadius: '20px',
                        padding: '26px 30px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {/* Шапка карточки */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '14px',
                              background: 'rgba(2, 132, 199, 0.15)',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                              color: '#38BDF8',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '20px',
                              flexShrink: 0,
                            }}
                          >
                            📐
                          </div>
                          <div>
                            <h3 style={{ margin: '0 0 6px 0', fontSize: '19px', fontWeight: 700, color: '#FFFFFF' }}>
                              {course.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                              <span>{course.mentor}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '999px',
                              background: 'rgba(2, 132, 199, 0.2)',
                              color: '#38BDF8',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                            }}
                          >
                            {course.grade} класс
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '999px',
                              background: 'rgba(148, 163, 184, 0.1)',
                              color: '#94A3B8',
                              border: '1px solid rgba(148, 163, 184, 0.2)',
                            }}
                          >
                            {course.programName}
                          </span>
                        </div>
                      </div>

                      {/* Описание */}
                      <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                        {course.description}
                      </p>

                      {/* Ключевые темы */}
                      <div>
                        <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', marginBottom: '8px' }}>
                          Ключевые темы
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {course.topics.map((topic, i) => (
                            <span
                              key={i}
                              style={{
                                background: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(148, 163, 184, 0.18)',
                                padding: '5px 12px',
                                borderRadius: '10px',
                                fontSize: '12px',
                                color: '#CBD5E1',
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Строка метаданных: Срок, Частота, Длительность */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '28px',
                          padding: '14px 0',
                          borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
                          fontSize: '13px',
                        }}
                      >
                        <div>
                          <span style={{ color: '#94A3B8', marginRight: '6px' }}>⌚ Срок:</span>
                          <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{course.durationWeeks}</span>
                        </div>
                        <div>
                          <span style={{ color: '#94A3B8', marginRight: '6px' }}>🔄 Частота:</span>
                          <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{course.frequency}</span>
                        </div>
                        <div>
                          <span style={{ color: '#94A3B8', marginRight: '6px' }}>⏳ Длительность:</span>
                          <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{course.lessonDuration}</span>
                        </div>
                      </div>

                      {/* Футер карточки с кнопкой действия */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                          <span>{isEnrolled ? 'Вы записаны на курс' : 'Идёт набор учеников'}</span>
                        </div>

                        <button
                          onClick={() => handleAction(course.id)}
                          style={{
                            background: isEnrolled
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                            border: isEnrolled ? '1px solid #10B981' : 'none',
                            color: isEnrolled ? '#34D399' : '#FFFFFF',
                            borderRadius: '12px',
                            padding: '11px 24px',
                            fontSize: '13.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: isEnrolled ? 'none' : '0 4px 18px rgba(56, 189, 248, 0.35)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isMentor ? 'Посмотреть расписание' : isEnrolled ? 'Вы записаны ✓' : 'Зарегистрироваться'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Всплывающее уведомление (Toast) */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#059669',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
