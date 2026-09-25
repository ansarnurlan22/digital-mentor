'use client';

import React, { useState } from 'react';
import { useUser } from '../../src/context/UserContext';

type ProgramFilter = 'all' | 'sor-soch' | 'mentoring' | 'workshops';

interface CourseItem {
  id: string;
  name: string;
  grade: string;
  program: 'sor-soch' | 'mentoring' | 'workshops';
  programName: string;
  mentor: string;
  description: string;
  topics: string[];
  durationWeeks: string;
  frequency: string;
  lessonDuration: string;
  maxStudents: number;
}

const COURSES: CourseItem[] = [
  {
    id: 'course-alg-11',
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
  },
  {
    id: 'course-geom-10',
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
  },
  {
    id: 'course-phys-11',
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
  },
  {
    id: 'course-cs-workshop',
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
  },
];

export default function CoursesPage() {
  const { user } = useUser();
  const [selectedProgram, setSelectedProgram] = useState<ProgramFilter>('sor-soch');
  const [coursesList, setCoursesList] = useState<CourseItem[]>(COURSES);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [toastText, setToastText] = useState<string | null>(null);

  const isMentor = user.role === 'Ментор';

  React.useEffect(() => {
    try {
      const data = localStorage.getItem('digitalMentor_activeCourses');
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setCoursesList(parsed);
          return;
        }
      }
      localStorage.setItem('digitalMentor_activeCourses', JSON.stringify(COURSES));
    } catch (e) {}
  }, []);

  const filtered = selectedProgram === 'all'
    ? coursesList
    : coursesList.filter((c) => c.program === selectedProgram);

  const handleDeleteCourse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = coursesList.filter((c) => String(c.id) !== String(id));
    setCoursesList(updated);
    try {
      localStorage.setItem('digitalMentor_activeCourses', JSON.stringify(updated));
      localStorage.removeItem(`digitalMentor_enrolled_${id}`);
    } catch (e) {}
    setToastText('Курс успешно удалён');
    setTimeout(() => setToastText(null), 2500);
  };

  const handleEnroll = (id: string) => {
    if (isMentor) {
      window.location.href = '/schedule';
      return;
    }
    if (enrolledIds.includes(id)) {
      setEnrolledIds((prev) => prev.filter((item) => item !== id));
      try {
        localStorage.removeItem(`digitalMentor_enrolled_${id}`);
      } catch (e) {}
      setToastText('Вы отменили запись на данный курс');
      setTimeout(() => setToastText(null), 3000);
      return;
    }
    setEnrolledIds((prev) => [...prev, id]);
    try {
      localStorage.setItem(`digitalMentor_enrolled_${id}`, 'true');
    } catch (e) {}
    setToastText('Вы успешно зарегистрировались на курс! Ментор свяжется с вами.');
    setTimeout(() => setToastText(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Единообразный заголовок экрана */}
      <section>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8', marginBottom: '8px' }}>
          <span>●</span>
          <span>Каталог дисциплин</span>
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Академические программы и курсы
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: 1.5 }}>
          Выберите направление подготовки к СОР/СОЧ или индивидуальное наставничество со старшеклассниками-волонтёрами.
        </p>
      </section>

      {/* 2. Двухколоночный макет Schoolhouse/SAT */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Левая колонка: Программы */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8' }}>
            Программы обучения
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
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', display: 'grid', placeItems: 'center' }}>
                👤
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(148, 163, 184, 0.12)', color: '#CBD5E1' }}>1-на-1</span>
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>Наставничество</h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
              Индивидуальные регулярные сессии со школьником-волонтёром для углублённого разбора тем.
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
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.16)', color: '#38BDF8', display: 'grid', placeItems: 'center' }}>
                🎯
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                СОР / СОЧ
              </span>
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>Подготовка к СОР/СОЧ</h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
              Интенсивный разбор типовых заданий четверти, сложных математических формул и критериев оценивания.
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
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', display: 'grid', placeItems: 'center' }}>
                ⚡
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: 'rgba(148, 163, 184, 0.12)', color: '#CBD5E1' }}>Группы</span>
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>Воркшопы</h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
              Интерактивные групповые мастер-классы, разборы олимпиадных задач и экспресс-практикумы.
            </p>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Практикумы • Командный разбор</div>
          </div>
        </aside>

        {/* Правая колонка: Детализированный список курсов */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8', marginBottom: '4px' }}>
                {selectedProgram === 'sor-soch'
                  ? 'Фильтр: Подготовка к СОР/СОЧ'
                  : selectedProgram === 'mentoring'
                  ? 'Фильтр: Наставничество 1-на-1'
                  : selectedProgram === 'workshops'
                  ? 'Фильтр: Воркшопы'
                  : 'Фильтр: Все программы'}
              </div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                Список доступных курсов
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
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
                  transition: 'all 0.2s ease',
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
                {filtered.length} {filtered.length === 1 ? 'курс' : 'курса'}
              </span>
            </div>
          </div>

          {/* Список карточек */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {filtered.map((course) => {
              const isEnrolled = enrolledIds.includes(course.id);
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
                    transition: 'all 0.2s ease',
                  }}
                >
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

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: 'rgba(2, 132, 199, 0.2)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        {course.grade} класс
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: 'rgba(148, 163, 184, 0.1)', color: '#94A3B8', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                        {course.programName}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCourse(course.id, e)}
                        title="Удалить курс"
                        aria-label="Удалить курс"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#F87171',
                          display: 'grid',
                          placeItems: 'center',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '14px',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                    {course.description}
                  </p>

                  <div>
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', marginBottom: '8px' }}>
                      Ключевые темы
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {course.topics.map((t, i) => (
                        <span key={i} style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(148, 163, 184, 0.18)', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', color: '#CBD5E1' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '28px', padding: '14px 0', borderTop: '1px solid rgba(148, 163, 184, 0.12)', borderBottom: '1px solid rgba(148, 163, 184, 0.12)', fontSize: '13px' }}>
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                      <span>{isEnrolled ? 'Вы записаны на курс' : 'Идёт набор учеников'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEnroll(course.id)}
                      style={{
                        background: isEnrolled ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
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
        </section>
      </div>

      {toastText && (
        <div style={{ position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)', background: '#059669', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)', zIndex: 9999, fontWeight: 600, fontSize: '14px' }}>
          ✓ {toastText}
        </div>
      )}
    </div>
  );
}
