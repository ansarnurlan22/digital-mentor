'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  User,
  LogOut,
  Bell,
  MessageSquare,
  Sparkles,
  Check,
  X,
  Search,
  Bookmark,
  RefreshCw,
  Clock,
  ArrowRight,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  Shield,
  Users,
  BarChart3,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ============================================================================
// Constants
// ============================================================================

const SUPER_ADMIN_EMAIL = 'ansarnurlan2@gmail.com';

// ============================================================================
// Types
// ============================================================================

type UserRole = 'student' | 'mentor' | 'admin';

interface UserProfile {
  id: string;
  full_name: string;
  grade: string;
  role: UserRole;
  onboarding_completed: boolean;
  email?: string;
  avatar_url?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  mentor_id: string;
  mentor_name?: string;
  created_at: string;
  lessons_count?: number;
}

interface LessonModule {
  topic: string;
  category: string;
  tag: string;
  theoryPoints: string[];
  keyFormulaOrCode: { title: string; content: string; note: string };
  quiz: QuizQuestion[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ============================================================================
// Ment AI Knowledge Engine (on-demand)
// ============================================================================

function generateMentLesson(query: string): LessonModule {
  const clean = query.trim();
  return {
    topic: clean,
    category: 'Академический курс · Ment AI',
    tag: 'Индивидуальный модуль',
    theoryPoints: [
      `Тема «${clean}» является ключевым элементом школьной программы.`,
      `Фундаментальный принцип «${clean}» строится на последовательном анализе условий.`,
      `Для решения задач по теме «${clean}» важно структурировать входные данные.`,
      `Регулярная практика с Ment AI позволяет закрепить навык и сдать СОР/СОЧ на высший балл.`,
    ],
    keyFormulaOrCode: {
      title: `Опорная модель: ${clean}`,
      content: `1. Анализ условия задачи по теме «${clean}»\n2. Подстановка ключевых величин\n3. Верификация размерностей и граничных условий`,
      note: 'Ment AI подготовил конспект для повторения.',
    },
    quiz: [
      {
        id: 1,
        question: `Что является ключевой основой темы «${clean}»?`,
        options: [
          'Последовательное изучение базовых определений и формул',
          'Случайный перебор вариантов',
          'Игнорирование начальных условий',
          'Заучивание ответов без понимания',
        ],
        correctIndex: 0,
        explanation: 'Глубокое понимание формул гарантирует верное решение.',
      },
      {
        id: 2,
        question: `Как проверить результат по теме «${clean}»?`,
        options: [
          'Подставить результат обратно в условие',
          'Сразу закрыть тест',
          'Ориентироваться на интуицию',
          'Стереть черновик',
        ],
        correctIndex: 0,
        explanation: 'Обратная подстановка — самый надёжный способ.',
      },
    ],
  };
}

// ============================================================================
// Course Form Modal (для менторов/админов)
// ============================================================================

interface CourseFormProps {
  profile: UserProfile;
  existing?: Course;
  onSave: (course: Partial<Course>) => Promise<void>;
  onClose: () => void;
}

function CourseFormModal({ profile, existing, onSave, onClose }: CourseFormProps) {
  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState(existing?.category ?? 'Математика');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Математика', 'Физика', 'Информатика', 'История Казахстана', 'Английский язык', 'Биология', 'Химия', 'Другое'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Укажите название курса.'); return; }
    if (!description.trim()) { setError('Укажите описание курса.'); return; }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...(existing ? { id: existing.id } : {}),
        title: title.trim(),
        description: description.trim(),
        category,
        mentor_id: profile.id,
      });
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка сохранения.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {existing ? 'Редактировать курс' : 'Создать новый курс'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Название курса *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: SAT Math — Квадратные уравнения"
              className="w-full bg-[#070D1E] border border-slate-800 text-white rounded-lg p-3 focus:border-[#00A3FF] outline-none text-sm transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Категория / Предмет</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-800 text-white rounded-lg p-3 focus:border-[#00A3FF] outline-none text-sm cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0B132B]">{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Описание курса *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Что изучат студенты? Для кого этот курс? Какие темы будут охвачены?"
              className="w-full bg-[#070D1E] border border-slate-800 text-white rounded-lg p-3 focus:border-[#00A3FF] outline-none text-sm transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#00A3FF] hover:bg-[#0284c7] disabled:opacity-50 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Сохранение...</span></> : <span>{existing ? 'Сохранить изменения' : 'Создать курс'}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// Admin Panel Component
// ============================================================================

interface AdminPanelProps {
  profile: UserProfile;
}

function AdminPanel({ profile }: AdminPanelProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'users' | 'courses'>('users');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    const [{ data: profilesData }, { data: coursesData }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('courses').select('*, profiles(full_name)').order('created_at', { ascending: false }),
    ]);
    if (profilesData) setUsers(profilesData as UserProfile[]);
    if (coursesData) setCourses(coursesData.map((c: any) => ({ ...c, mentor_name: c.profiles?.full_name })));
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Административная панель</h1>
          <p className="text-xs text-slate-400">Полный контроль платформы Digital Mentor</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Всего пользователей', value: users.length, icon: Users, color: '#00A3FF' },
          { label: 'Студентов', value: users.filter(u => u.role === 'student').length, icon: GraduationCap, color: '#10b981' },
          { label: 'Менторов', value: users.filter(u => u.role === 'mentor').length, icon: Users, color: '#f59e0b' },
          { label: 'Курсов', value: courses.length, icon: BookOpen, color: '#a855f7' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 flex flex-col gap-1">
            <span className="text-xs text-slate-400">{label}</span>
            <span className="text-2xl font-extrabold" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['users', 'courses'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${tab === t ? 'bg-[#00A3FF] text-white' : 'bg-[#0F172A] border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            {t === 'users' ? `Пользователи (${users.length})` : `Курсы (${courses.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-[#00A3FF]" />
        </div>
      ) : tab === 'users' ? (
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="text-left p-4 font-semibold">Пользователь</th>
                  <th className="text-left p-4 font-semibold">Роль</th>
                  <th className="text-left p-4 font-semibold">Класс</th>
                  <th className="text-left p-4 font-semibold">Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-medium text-white">{u.full_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        u.role === 'admin' ? 'bg-amber-500/15 text-amber-400' :
                        u.role === 'mentor' ? 'bg-emerald-500/15 text-emerald-400' :
                        'bg-[#00A3FF]/15 text-[#00A3FF]'
                      }`}>
                        {u.role === 'admin' ? 'Админ' : u.role === 'mentor' ? 'Ментор' : 'Студент'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{u.grade || '—'}</td>
                    <td className="p-4 text-slate-500">{u.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="text-left p-4 font-semibold">Курс</th>
                  <th className="text-left p-4 font-semibold">Категория</th>
                  <th className="text-left p-4 font-semibold">Автор</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-medium text-white">{c.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-bold">{c.category}</span>
                    </td>
                    <td className="p-4 text-slate-400">{c.mentor_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Courses View (для студентов — просмотр, для менторов/админов — CRUD)
// ============================================================================

interface CoursesViewProps {
  profile: UserProfile;
}

function CoursesView({ profile }: CoursesViewProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();

  const canManageCourses = profile.role === 'mentor' || profile.role === 'admin';

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });

    if (data) {
      setCourses(data.map((c: any) => ({ ...c, mentor_name: c.profiles?.full_name })));
    }
    setLoading(false);
  };

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    if (courseData.id) {
      // UPDATE
      const { error } = await supabase
        .from('courses')
        .update({
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
        })
        .eq('id', courseData.id)
        .eq('mentor_id', profile.role === 'admin' ? courseData.mentor_id : profile.id); // admin может редактировать любой
      if (error) throw new Error(error.message);
    } else {
      // INSERT
      const { error } = await supabase.from('courses').insert({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        mentor_id: profile.id,
      });
      if (error) throw new Error(error.message);
    }
    await loadCourses();
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (!error) await loadCourses();
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Курсы и программы</h1>
          <p className="text-xs text-slate-400 mt-1">
            {canManageCourses ? 'Управляйте курсами и учебными материалами.' : 'Каталог учебных направлений.'}
          </p>
        </div>
        {canManageCourses && (
          <button
            onClick={() => { setEditingCourse(undefined); setShowForm(true); }}
            className="px-4 py-2.5 rounded-xl bg-[#00A3FF] hover:bg-[#0284c7] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Создать курс
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 animate-spin text-[#00A3FF]" />
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {canManageCourses ? 'Пока нет курсов' : 'Курсов пока нет'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {canManageCourses
                ? 'Создайте первый курс — ваши студенты смогут записаться и начать обучение.'
                : 'Курсы появятся здесь, когда менторы их создадут.'}
            </p>
          </div>
          {canManageCourses && (
            <button
              onClick={() => { setEditingCourse(undefined); setShowForm(true); }}
              className="px-5 py-2.5 rounded-xl bg-[#00A3FF] text-white text-xs font-bold hover:bg-[#0284c7] transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-1.5" />
              Создать первый курс
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const isOwner = course.mentor_id === profile.id || profile.role === 'admin';
            return (
              <div key={course.id} className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                      {course.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2">{course.title}</h3>
                  </div>
                  {canManageCourses && isOwner && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setEditingCourse(course); setShowForm(true); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#00A3FF] hover:bg-[#00A3FF]/10 transition-colors"
                        title="Редактировать"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{course.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Автор: {course.mentor_name || 'Ментор'}
                  </span>
                  <button className="text-[11px] font-bold text-[#00A3FF] hover:underline flex items-center gap-1">
                    Подробнее <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <CourseFormModal
          profile={profile}
          existing={editingCourse}
          onSave={handleSaveCourse}
          onClose={() => { setShowForm(false); setEditingCourse(undefined); }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Main Application Component
// ============================================================================

export default function DigitalMentorApp() {
  // Auth & Profile State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingSession, setLoadingSession] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Onboarding Form State
  const [onboardingFullName, setOnboardingFullName] = useState<string>('');
  const [onboardingGrade, setOnboardingGrade] = useState<string>('9 класс');
  const [onboardingRole, setOnboardingRole] = useState<'student' | 'mentor'>('student');
  const [submittingOnboarding, setSubmittingOnboarding] = useState<boolean>(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  // Navigation
  const [currentView, setCurrentView] = useState<'dashboard' | 'ment-ai' | 'courses' | 'schedule' | 'profile' | 'admin'>('dashboard');

  // Ment AI State
  const [mentTopicInput, setMentTopicInput] = useState<string>('Теорема Виета');
  const [currentLesson, setCurrentLesson] = useState<LessonModule | null>(null);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  // UI Toast
  const [notification, setNotification] = useState<string | null>(null);

  const GRADE_OPTIONS = ['7 класс', '8 класс', '9 класс', '10 класс', '11 класс', '12 класс', 'Студент'];

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // -----------------------------------------------------------------------
  // Session & Profile Initialization (race-condition safe)
  // -----------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    /**
     * Загружает профиль из Supabase.
     * Возвращает true если профиль готов (onboarding_completed=true).
     */
    async function loadProfile(userId: string, userEmail: string): Promise<boolean> {
      const isSuperAdmin = userEmail.toLowerCase().trim() === SUPER_ADMIN_EMAIL;

      // Для super admin — всегда пропускаем онбординг
      if (isSuperAdmin) {
        // Убеждаемся что профиль admin существует
        const { data: existing } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!existing || !existing.onboarding_completed) {
          await supabase.from('profiles').upsert({
            id: userId,
            full_name: existing?.full_name || 'Ansarnurlan Admin',
            grade: existing?.grade || 'Admin',
            role: 'admin',
            onboarding_completed: true,
          }, { onConflict: 'id' });
        }

        if (mounted) {
          setUserProfile({
            id: userId,
            full_name: existing?.full_name || 'Ansarnurlan Admin',
            grade: existing?.grade || 'Admin',
            role: 'admin',
            onboarding_completed: true,
            email: userEmail,
          });
          setShowOnboarding(false);
        }
        return true;
      }

      // Для обычных пользователей
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('[loadProfile] Error:', error);
      }

      if (profile && profile.onboarding_completed) {
        if (mounted) {
          setUserProfile({
            id: profile.id,
            full_name: profile.full_name,
            grade: profile.grade,
            role: profile.role,
            onboarding_completed: true,
            email: userEmail,
          });
          setShowOnboarding(false);
        }
        return true;
      }

      // Профиль не заполнен — показываем онбординг
      if (mounted) {
        setShowOnboarding(true);
      }
      return false;
    }

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          if (mounted) {
            setCurrentUser(null);
            setUserProfile(null);
            setShowOnboarding(false);
            setLoadingSession(false);
          }
          return;
        }

        if (mounted) setCurrentUser(session.user);

        // Устанавливаем имя из метаданных OAuth для формы онбординга
        setOnboardingFullName(
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split('@')[0] ||
          ''
        );

        await loadProfile(session.user.id, session.user.email ?? '');
      } catch (err) {
        console.error('[initAuth] Error:', err);
      } finally {
        if (mounted) setLoadingSession(false);
      }
    }

    initAuth();

    // Auth state listener (для SIGN_IN / SIGN_OUT событий)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        setCurrentUser(null);
        setUserProfile(null);
        setShowOnboarding(false);
        setLoadingSession(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setCurrentUser(session.user);
        setOnboardingFullName(
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split('@')[0] ||
          ''
        );
        await loadProfile(session.user.id, session.user.email ?? '');
        if (mounted) setLoadingSession(false);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // -----------------------------------------------------------------------
  // Google OAuth Sign In
  // -----------------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: any) {
      triggerToast('Ошибка авторизации: ' + (err.message || 'Проверьте соединение'));
    }
  };

  // -----------------------------------------------------------------------
  // Onboarding Submission
  // -----------------------------------------------------------------------
  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!onboardingFullName.trim()) {
      setOnboardingError('Пожалуйста, укажите имя и фамилию.');
      return;
    }

    setSubmittingOnboarding(true);
    setOnboardingError(null);

    const isSuperAdmin = (currentUser.email ?? '').toLowerCase().trim() === SUPER_ADMIN_EMAIL;

    const payload = {
      id: currentUser.id,
      full_name: onboardingFullName.trim(),
      grade: onboardingGrade,
      role: isSuperAdmin ? 'admin' : onboardingRole,
      onboarding_completed: true,
    };

    try {
      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('[onboarding] Upsert error:', error);
        setOnboardingError('Ошибка сохранения профиля: ' + error.message);
        return;
      }

      setUserProfile({ ...payload, email: currentUser.email });
      setShowOnboarding(false);
      triggerToast('Регистрация завершена! Добро пожаловать в Digital Mentor 🎉');
    } catch (err: any) {
      console.error('[onboarding] Unexpected error:', err);
      setOnboardingError('Неожиданная ошибка. Попробуйте ещё раз.');
    } finally {
      setSubmittingOnboarding(false);
    }
  };

  // -----------------------------------------------------------------------
  // Sign Out
  // -----------------------------------------------------------------------
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserProfile(null);
    setShowOnboarding(false);
    setCurrentView('dashboard');
    triggerToast('Вы вышли из аккаунта.');
  };

  // -----------------------------------------------------------------------
  // Ment AI
  // -----------------------------------------------------------------------
  const handleGenerateLesson = (topic: string) => {
    const trimmed = topic.trim();
    if (!trimmed) return;
    setIsGenerating(true);
    setUserQuizAnswers({});
    setTimeout(() => {
      setCurrentLesson(generateMentLesson(trimmed));
      setIsGenerating(false);
      setCurrentView('ment-ai');
      triggerToast(`Урок «${trimmed}» сгенерирован!`);
    }, 400);
  };

  const handleSaveNote = () => {
    if (!currentLesson) return;
    if (!savedNotes.includes(currentLesson.topic)) {
      setSavedNotes((prev) => [...prev, currentLesson.topic]);
      triggerToast(`Конспект «${currentLesson.topic}» сохранён!`);
    } else {
      triggerToast('Конспект уже сохранён.');
    }
  };

  // ==========================================================================
  // RENDER: Loading
  // ==========================================================================
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#00A3FF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">Синхронизация Digital Mentor...</span>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: Auth Screen
  // ==========================================================================
  if (!currentUser) {
    return (
      <div className="relative min-h-screen w-full bg-[#050811] flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00A3FF]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 bg-[#0B132B]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#00A3FF] flex items-center justify-center text-white font-extrabold text-2xl shadow-[0_0_25px_rgba(0,163,255,0.4)]">
            D
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-white">Digital Mentor</h1>
            <p className="text-sm text-slate-300">Академическое наставничество и Ment AI</p>
          </div>
          <div className="w-full space-y-3 pt-2">
            <button
              onClick={handleGoogleSignIn}
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3 px-4 rounded-xl w-full flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98]"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Войти через Google</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Входя в систему, вы соглашаетесь с правилами академической честности.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: Dashboard (after login)
  // ==========================================================================
  const isAdmin = userProfile?.role === 'admin';
  const isMentor = userProfile?.role === 'mentor';

  return (
    <div className="min-h-screen bg-[#080E1E] text-white flex flex-col font-sans relative">
      {/* Toast */}
      {notification && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1D3D] border border-[#00A3FF] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
          <span className="text-sm font-semibold text-[#e0f2fe]">{notification}</span>
        </div>
      )}

      {/* ONBOARDING MODAL — показывается только если профиль не заполнен */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 my-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#00A3FF] mx-auto flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(0,163,255,0.4)]">
                D
              </div>
              <h2 className="text-2xl font-bold text-white">Добро пожаловать!</h2>
              <p className="text-xs text-slate-400">Заполните данные для создания профиля.</p>
            </div>

            {onboardingError && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{onboardingError}</span>
              </div>
            )}

            <form onSubmit={handleCompleteOnboarding} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Имя и Фамилия</label>
                <input
                  type="text"
                  required
                  value={onboardingFullName}
                  onChange={(e) => setOnboardingFullName(e.target.value)}
                  placeholder="Например: Ансар Нурлан"
                  className="w-full bg-[#070D1E] border border-slate-800 text-white rounded-lg p-3 focus:border-[#00A3FF] outline-none text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Класс / Курс</label>
                <select
                  value={onboardingGrade}
                  onChange={(e) => setOnboardingGrade(e.target.value)}
                  className="w-full bg-[#070D1E] border border-slate-800 text-white rounded-lg p-3 focus:border-[#00A3FF] outline-none text-sm cursor-pointer"
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g} className="bg-[#0B132B]">{g}</option>
                  ))}
                </select>
              </div>

              {/* Роль — скрываем для super admin */}
              {(currentUser.email ?? '').toLowerCase().trim() !== SUPER_ADMIN_EMAIL && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Выберите роль</span>
                    <span className="text-[10px] text-amber-400 font-normal">Выбирается 1 раз</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setOnboardingRole('student')}
                      className={`p-4 rounded-xl border cursor-pointer flex flex-col gap-2 transition-all ${
                        onboardingRole === 'student'
                          ? 'bg-[#00A3FF]/15 border-[#00A3FF] shadow-[0_0_15px_rgba(0,163,255,0.3)]'
                          : 'bg-[#070D1E] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">🎓</span>
                        {onboardingRole === 'student' && (
                          <div className="w-5 h-5 rounded-full bg-[#00A3FF] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-sm text-white">Ученик</div>
                      <p className="text-[11px] text-slate-400">Хочу учиться и использовать Ment AI.</p>
                    </div>

                    <div
                      onClick={() => setOnboardingRole('mentor')}
                      className={`p-4 rounded-xl border cursor-pointer flex flex-col gap-2 transition-all ${
                        onboardingRole === 'mentor'
                          ? 'bg-[#10b981]/15 border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-[#070D1E] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">🤝</span>
                        {onboardingRole === 'mentor' && (
                          <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-sm text-white">Волонтер-ментор</div>
                      <p className="text-[11px] text-slate-400">Хочу обучать и создавать курсы.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Внимание:</strong> роль выбирается один раз и не может быть изменена.</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submittingOnboarding}
                className="bg-[#00A3FF] hover:bg-[#0284C7] disabled:opacity-50 text-white py-3 rounded-xl font-medium w-full shadow-lg flex items-center justify-center gap-2 mt-2 transition-colors"
              >
                {submittingOnboarding
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Сохранение...</span></>
                  : <span>Завершить регистрацию</span>
                }
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[76px] min-w-[76px] h-screen sticky top-0 bg-[#0B1226] border-r border-slate-800/80 flex flex-col items-center justify-between py-5 z-50">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#0284c7] to-[#00A3FF] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(0,163,255,0.4)] hover:scale-105 transition-transform"
            title="Digital Mentor"
          >
            D
          </button>

          <nav className="flex flex-col items-center gap-3.5 w-full">
            {[
              { view: 'dashboard' as const, icon: LayoutDashboard, title: 'Дашборд' },
              { view: 'ment-ai' as const, icon: Sparkles, title: 'Ment AI' },
              { view: 'courses' as const, icon: BookOpen, title: 'Курсы' },
              { view: 'schedule' as const, icon: Calendar, title: 'Расписание' },
              { view: 'profile' as const, icon: User, title: 'Профиль' },
              ...(isAdmin ? [{ view: 'admin' as const, icon: Shield, title: 'Админ' }] : []),
            ].map(({ view, icon: Icon, title }) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                  currentView === view
                    ? 'bg-gradient-to-br from-[#0284c7] to-[#00A3FF] text-white shadow-[0_0_20px_rgba(0,163,255,0.45)]'
                    : view === 'admin'
                    ? 'text-amber-400 hover:bg-amber-500/15'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={title}
              >
                <Icon className="w-5 h-5" />
                <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                  {title}
                </span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleSignOut}
            className="w-11 h-11 rounded-[14px] flex items-center justify-center text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
            title="Выйти"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#080E1E]">
          {/* Header */}
          <header className="h-[72px] sticky top-0 z-40 bg-[#080E1E]/90 backdrop-blur-md border-b border-slate-800/80 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#00A3FF] text-white font-extrabold text-base flex items-center justify-center shadow-[0_0_14px_rgba(0,163,255,0.3)]">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[17px] text-white leading-none">Digital Mentor</span>
                <span className="text-[11.5px] text-slate-400 mt-1">Академическое наставничество · {userProfile?.grade || 'Астана'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
                isAdmin
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : isMentor
                  ? 'bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]'
                  : 'bg-[#0F172A] border-slate-800 text-slate-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-400' : isMentor ? 'bg-[#10b981]' : 'bg-[#00A3FF]'}`} />
                <span>{isAdmin ? '⚡ Администратор' : isMentor ? 'Волонтер-ментор' : 'Ученик'}</span>
              </div>
              <button
                onClick={() => triggerToast('Уведомлений нет.')}
                className="w-10 h-10 rounded-xl bg-[#0F172A] border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-[#0F172A] border border-[#00A3FF]/40 text-[#00A3FF] font-bold text-xs flex items-center justify-center hover:border-[#00A3FF] transition-colors"
                title={userProfile?.full_name}
              >
                {userProfile?.full_name?.slice(0, 2).toUpperCase() || 'ДМ'}
              </button>
            </div>
          </header>

          {/* Views */}
          <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-8">
            {/* DASHBOARD */}
            {currentView === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF]">Личная панель</span>
                  <h1 className="text-3xl font-extrabold text-white">
                    Привет, {userProfile?.full_name || 'Пользователь'}! 👋
                  </h1>
                  <p className="text-sm text-slate-400">Добро пожаловать в ваш академический кабинет.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: 'Активные курсы', value: '0 курсов', sub: 'Перейдите в каталог' },
                    { label: 'Уроков на неделе', value: '0 уроков', sub: 'Расписание свободно' },
                    { label: isMentor || isAdmin ? 'Волонтёрских часов' : 'Практика с Ment', value: '0.0 ч', sub: 'Начните первую сессию' },
                    { label: 'Статус аккаунта', value: 'Активен', sub: 'Верифицирован', valueColor: '#10b981' },
                  ].map(({ label, value, sub, valueColor }) => (
                    <div key={label} className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 flex flex-col gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">{label}</span>
                      <span className="text-2xl font-extrabold" style={{ color: valueColor || '#00A3FF' }}>{value}</span>
                      <span className="text-[11.5px] text-slate-500">{sub}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00A3FF]/15 text-[#00A3FF] flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {isMentor || isAdmin ? 'Мои курсы' : 'Учебные программы'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isMentor || isAdmin
                        ? 'Создавайте и управляйте курсами для своих студентов.'
                        : 'Индивидуальное наставничество 1-на-1 и подготовка к экзаменам.'}
                    </p>
                    <button
                      onClick={() => setCurrentView('courses')}
                      className="text-xs font-bold text-[#00A3FF] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>{isMentor || isAdmin ? 'Управлять курсами' : 'Перейти в каталог'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">Генератор тем Ment AI</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Быстро разберите формулу или тему к СОР/СОЧ с помощью AI.
                    </p>
                    <button
                      onClick={() => setCurrentView('ment-ai')}
                      className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Открыть Ment AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MENT AI */}
            {currentView === 'ment-ai' && (
              <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#00A3FF]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MENT AI 24/7 · ON-DEMAND ENGINE</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-white">Генератор уроков и микро-тестов</h1>
                  <p className="text-sm text-slate-400">Введите любую школьную тему для получения теории и теста.</p>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-2xl">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleGenerateLesson(mentTopicInput); }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={mentTopicInput}
                        onChange={(e) => setMentTopicInput(e.target.value)}
                        placeholder="Теорема Виета, Закон Ома, Циклы for..."
                        className="w-full pl-11 pr-4 py-3 bg-[#080E1E] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isGenerating || !mentTopicInput.trim()}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#00A3FF] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {isGenerating
                        ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Синтез...</span></>
                        : <><Sparkles className="w-4 h-4" /><span>Сгенерировать урок</span></>
                      }
                    </button>
                  </form>
                </div>

                {currentLesson && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold text-[#00A3FF] px-3 py-1 rounded-full bg-[#00A3FF]/15 border border-[#00A3FF]/30">
                        {currentLesson.category}
                      </span>
                      <button
                        onClick={handleSaveNote}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#00A3FF]" />
                        <span>Сохранить конспект</span>
                      </button>
                    </div>

                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A3FF]">
                        <span className="w-5 h-5 rounded bg-[#00A3FF]/15 border border-[#00A3FF]/30 flex items-center justify-center text-[10px]">1</span>
                        <span>Выжимка теории</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{currentLesson.topic}</h3>
                      <ul className="space-y-2">
                        {currentLesson.theoryPoints.map((pt, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                            <span className="w-4 h-4 rounded bg-[#080E1E] border border-slate-700 text-[#00A3FF] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="p-3 bg-[#080E1E] border border-slate-800 rounded-xl font-mono text-xs text-slate-200 whitespace-pre-wrap">
                        {currentLesson.keyFormulaOrCode.content}
                      </div>
                    </div>

                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A3FF]">
                        <span className="w-5 h-5 rounded bg-[#00A3FF]/15 border border-[#00A3FF]/30 flex items-center justify-center text-[10px]">2</span>
                        <span>Интерактивный микро-тест</span>
                      </div>
                      <div className="space-y-4">
                        {currentLesson.quiz.map((q, qIndex) => {
                          const ans = userQuizAnswers[q.id];
                          const answered = ans !== undefined;
                          const isCorrect = answered && ans === q.correctIndex;

                          return (
                            <div key={q.id} className="bg-[#080E1E] border border-slate-800 rounded-xl p-4 space-y-3">
                              <div className="text-xs font-semibold text-white">{qIndex + 1}. {q.question}</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map((opt, optIndex) => {
                                  let style = 'bg-[#0F172A] border-slate-800 text-slate-300 hover:border-slate-700';
                                  if (answered) {
                                    if (optIndex === q.correctIndex) style = 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold';
                                    else if (ans === optIndex) style = 'bg-red-500/15 border-red-500 text-red-300';
                                  } else if (ans === optIndex) style = 'bg-[#00A3FF]/15 border-[#00A3FF] text-[#00A3FF]';

                                  return (
                                    <button
                                      key={optIndex}
                                      onClick={() => setUserQuizAnswers((prev) => ({ ...prev, [q.id]: optIndex }))}
                                      className={`p-2.5 rounded-lg border text-left text-xs cursor-pointer flex items-center justify-between ${style}`}
                                    >
                                      <span>{opt}</span>
                                      {answered && optIndex === q.correctIndex && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                    </button>
                                  );
                                })}
                              </div>
                              {answered && (
                                <div className="text-[11px] text-slate-400 p-2.5 bg-[#060A14] rounded-lg border border-slate-900">
                                  <strong>Разбор:</strong> {q.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* COURSES */}
            {currentView === 'courses' && userProfile && (
              <CoursesView profile={userProfile} />
            )}

            {/* SCHEDULE */}
            {currentView === 'schedule' && (
              <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                <div>
                  <h1 className="text-2xl font-bold text-white">Расписание онлайн-занятий</h1>
                  <p className="text-xs text-slate-400 mt-1">Календарь предстоящих онлайн-сессий.</p>
                </div>
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Расписание пусто</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      На этой неделе нет запланированных сессий. Новые занятия появятся после подтверждения ментором.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE */}
            {currentView === 'profile' && (
              <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
                <div>
                  <h1 className="text-2xl font-bold text-white">Профиль пользователя</h1>
                  <p className="text-xs text-slate-400 mt-1">Информация об аккаунте и сохранённые материалы.</p>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#00A3FF] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(0,163,255,0.4)]">
                      {userProfile?.full_name?.slice(0, 2).toUpperCase() || 'ДМ'}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-white">{userProfile?.full_name}</h2>
                      <p className="text-xs text-slate-400">{userProfile?.email}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isAdmin ? 'bg-amber-500/15 text-amber-400 border-amber-500/40' :
                          isMentor ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40' :
                          'bg-[#00A3FF]/15 text-[#00A3FF] border-[#00A3FF]/40'
                        }`}>
                          {isAdmin ? '⚡ Администратор' : isMentor ? 'Волонтер-ментор' : 'Ученик'}
                        </span>
                        <span className="text-[11px] text-slate-400">{userProfile?.grade}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/15 text-xs font-bold"
                  >
                    Выйти из аккаунта
                  </button>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-white">Сохранённые конспекты</h3>
                  {savedNotes.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Нет сохранённых конспектов. Воспользуйтесь Ment AI.</p>
                  ) : (
                    <div className="space-y-2">
                      {savedNotes.map((note, idx) => (
                        <div key={idx} className="p-3 bg-[#080E1E] rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{note}</span>
                          <button
                            onClick={() => { setMentTopicInput(note); handleGenerateLesson(note); }}
                            className="text-[#00A3FF] hover:underline"
                          >
                            Открыть в Ment AI →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADMIN PANEL */}
            {currentView === 'admin' && userProfile && isAdmin && (
              <AdminPanel profile={userProfile} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
