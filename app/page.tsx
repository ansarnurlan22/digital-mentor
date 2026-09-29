'use client';

import React, { useState, useEffect } from 'react';
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
  Video,
  Zap,
  GraduationCap,
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  HelpCircle,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ============================================================================
// Types
// ============================================================================

type UserRole = 'student' | 'mentor';

interface UserProfile {
  id: string;
  full_name: string;
  grade: string;
  role: UserRole;
  onboarding_completed: boolean;
  email?: string;
  avatar_url?: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonModule {
  topic: string;
  category: string;
  tag: string;
  theoryPoints: string[];
  keyFormulaOrCode: {
    title: string;
    content: string;
    note: string;
  };
  quiz: QuizQuestion[];
  mentFeedback: {
    title: string;
    summary: string;
    masteryTip: string;
    bonusTask: string;
  };
}

// ============================================================================
// On-Demand Ment AI Knowledge Engine
// ============================================================================

function generateMentLesson(query: string): LessonModule {
  const clean = query.trim();
  return {
    topic: clean,
    category: 'Академический курс · Ment AI',
    tag: 'Индивидуальный модуль',
    theoryPoints: [
      `Тема «${clean}» является ключевым элементом школьной программы для развития академического мышления.`,
      `Фундаментальный принцип «${clean}» строится на последовательном анализе условий и причинно-следственных связей.`,
      `Для решения задач по теме «${clean}» важно структурировать входные данные и применять проверенные формулы.`,
      `Регулярная микро-практика с Ment AI позволяет закрепить навык и сдать СОР/СОЧ на высший балл.`
    ],
    keyFormulaOrCode: {
      title: `Опорная модель: ${clean}`,
      content: `1. Входные параметры: Анализ условия задачи по теме «${clean}»\n2. Опорная формула: Подстановка ключевых величин\n3. Обратная проверка: Верификация размерностей и граничных условий`,
      note: 'Ment AI подготовил конспект для оперативного повторения перед контрольной.'
    },
    quiz: [
      {
        id: 1,
        question: `Что является ключевой основой для понимания темы «${clean}»?`,
        options: [
          'Последовательное изучение базовых определений и формул',
          'Случайный перебор вариантов ответа',
          'Игнорирование начальных условий задачи',
          'Заучивание ответов без понимания принципа'
        ],
        correctIndex: 0,
        explanation: 'Глубокое понимание сути и формул гарантирует верное решение даже при изменении исходных чисел.'
      },
      {
        id: 2,
        question: `Как Ment AI рекомендует проверять результат по теме «${clean}»?`,
        options: [
          'Подставить полученный результат обратно в исходное условие задачи',
          'Сразу закрыть тест не проверяя',
          'Ориентироваться только на интуицию',
          'Стереть черновик'
        ],
        correctIndex: 0,
        explanation: 'Обратная подстановка — самый надежный способ выявить неточность за 10 секунд.'
      },
      {
        id: 3,
        question: `Какой подход обеспечивает максимальный результат при обучении теме «${clean}»?`,
        options: [
          'Интерактивная практика в Ment AI + онлайн-сессии с наставником',
          'Пассивное чтение учебника раз в месяц',
          'Подготовка только в ночь перед экзаменом',
          'Отказ от решения практических тестов'
        ],
        correctIndex: 0,
        explanation: 'Регулярная микро-практика с мгновенным фидбеком дает долговременное закрепление материала.'
      }
    ],
    mentFeedback: {
      title: `Персональный разбор по теме «${clean}»`,
      summary: `Ты успешно сгенерировал и прошел модуль по теме «${clean}»! Основные термины усвоены.`,
      masteryTip: 'Сохрани этот конспект в свой профиль, чтобы повторить перед ближайшим уроком.',
      bonusTask: `Сформулируй задачу по теме «${clean}» и попробуй решить ее за 2 минуты.`
    }
  };
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
  const [onboardingRole, setOnboardingRole] = useState<UserRole>('student');
  const [submittingOnboarding, setSubmittingOnboarding] = useState<boolean>(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  // App Navigation State
  const [currentView, setCurrentView] = useState<'dashboard' | 'ment-ai' | 'courses' | 'schedule' | 'profile'>('dashboard');

  // Ment AI State
  const [mentTopicInput, setMentTopicInput] = useState<string>('Теорема Виета');
  const [currentLesson, setCurrentLesson] = useState<LessonModule | null>(null);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  // UI Toast State
  const [notification, setNotification] = useState<string | null>(null);

  // Grade Options
  const GRADE_OPTIONS = [
    '7 класс',
    '8 класс',
    '9 класс',
    '10 класс',
    '11 класс',
    '12 класс',
    'Студент'
  ];

  // Helper: Trigger Notification Toast
  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // --------------------------------------------------------------------------
  // 1. Session & Profile Initialization
  // --------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function checkAuthAndProfile() {
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

        if (mounted) {
          setCurrentUser(session.user);
        }

        // Fetch user profile from Supabase
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (mounted) {
          if (error && error.code !== 'PGRST116') {
            console.error('Profile fetch error:', error);
          }

          if (profile && profile.onboarding_completed) {
            setUserProfile({
              id: profile.id,
              full_name: profile.full_name,
              grade: profile.grade,
              role: profile.role,
              onboarding_completed: profile.onboarding_completed,
              email: session.user.email
            });
            setShowOnboarding(false);
          } else {
            // Need onboarding
            setOnboardingFullName(
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split('@')[0] ||
              ''
            );
            setShowOnboarding(true);
          }
          setLoadingSession(false);
        }
      } catch (err) {
        console.error('Error during session load:', err);
        if (mounted) setLoadingSession(false);
      }
    }

    checkAuthAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile && profile.onboarding_completed) {
          setUserProfile({
            id: profile.id,
            full_name: profile.full_name,
            grade: profile.grade,
            role: profile.role,
            onboarding_completed: profile.onboarding_completed,
            email: session.user.email
          });
          setShowOnboarding(false);
        } else {
          setOnboardingFullName(
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split('@')[0] ||
            ''
          );
          setShowOnboarding(true);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setShowOnboarding(false);
      }
      setLoadingSession(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // --------------------------------------------------------------------------
  // 2. Google OAuth Sign In
  // --------------------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      triggerToast('Ошибка авторизации через Google: ' + (err.message || 'Проверьте соединение'));
    }
  };

  // Demo Sign In (fallback for localhost without OAuth setup)
  const handleDemoSignIn = (role: UserRole = 'student') => {
    const demoUser = {
      id: 'demo-user-123',
      email: 'ansarnurlan2@gmail.com',
      user_metadata: { full_name: 'Ансар Нурлан' }
    };
    setCurrentUser(demoUser);
    setOnboardingFullName('Ансар Нурлан');
    setOnboardingRole(role);
    setShowOnboarding(true);
  };

  // --------------------------------------------------------------------------
  // 3. Onboarding Submission (Insert Profile into Supabase)
  // --------------------------------------------------------------------------
  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!onboardingFullName.trim()) {
      setOnboardingError('Пожалуйста, укажите имя и фамилию.');
      return;
    }

    setSubmittingOnboarding(true);
    setOnboardingError(null);

    try {
      const payload = {
        id: currentUser.id,
        full_name: onboardingFullName.trim(),
        grade: onboardingGrade,
        role: onboardingRole,
        onboarding_completed: true
      };

      const { error } = await supabase.from('profiles').upsert(payload);

      if (error) {
        console.error('Onboarding upsert error:', error);
        // If table doesn't exist yet in Supabase, fall back locally gracefully
        triggerToast('Профиль сохранен в локальном сеансе.');
      } else {
        triggerToast('Регистрация успешно завершена! Добро пожаловать.');
      }

      setUserProfile({
        ...payload,
        email: currentUser.email
      });
      setShowOnboarding(false);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      // Fallback local save
      setUserProfile({
        id: currentUser.id,
        full_name: onboardingFullName.trim(),
        grade: onboardingGrade,
        role: onboardingRole,
        onboarding_completed: true,
        email: currentUser.email
      });
      setShowOnboarding(false);
    } finally {
      setSubmittingOnboarding(false);
    }
  };

  // --------------------------------------------------------------------------
  // 4. Logout Handler
  // --------------------------------------------------------------------------
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setCurrentUser(null);
    setUserProfile(null);
    setShowOnboarding(false);
    setCurrentView('dashboard');
    triggerToast('Вы успешно вышли из аккаунта.');
  };

  // --------------------------------------------------------------------------
  // 5. Ment AI Generation Handler
  // --------------------------------------------------------------------------
  const handleGenerateLesson = (topic: string) => {
    const trimmed = topic.trim();
    if (!trimmed) return;

    setIsGenerating(true);
    setUserQuizAnswers({});

    setTimeout(() => {
      setCurrentLesson(generateMentLesson(trimmed));
      setIsGenerating(false);
      setCurrentView('ment-ai');
      triggerToast(`Урок по теме «${trimmed}» сгенерирован!`);
    }, 400);
  };

  const handleSaveNote = () => {
    if (!currentLesson) return;
    if (!savedNotes.includes(currentLesson.topic)) {
      setSavedNotes((prev) => [...prev, currentLesson.topic]);
      triggerToast(`Конспект «${currentLesson.topic}» сохранен в профиль!`);
    } else {
      triggerToast('Конспект уже сохранен в профиле.');
    }
  };

  // ==========================================================================
  // RENDER: Loading Spinner
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
  // RENDER: SCREEN 2 — AUTHENTICATION (GLASSMORPHISM & CENTERED BUTTON)
  // ==========================================================================
  if (!currentUser) {
    return (
      <div className="relative min-h-screen w-full bg-[#050811] flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Soft Radial Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00A3FF]/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Central Glassmorphism Card */}
        <div className="relative z-10 bg-[#0B132B]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-6">
          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#00A3FF] flex items-center justify-center text-white font-extrabold text-2xl shadow-[0_0_25px_rgba(0,163,255,0.4)]">
            D
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Digital Mentor
            </h1>
            <p className="text-sm text-slate-300">
              Академическое наставничество и Ment AI
            </p>
          </div>

          {/* Centered Google Button */}
          <div className="w-full space-y-3 pt-2">
            <button
              onClick={handleGoogleSignIn}
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3 px-4 rounded-xl w-full flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
            >
              {/* Official Google Colored Icon */}
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Войти через Google</span>
            </button>

            {/* Quick Demo Login Option */}
            <div className="pt-2 text-center">
              <button
                onClick={() => handleDemoSignIn('student')}
                className="text-xs text-[#00A3FF] hover:underline cursor-pointer"
              >
                Локальный вход без OAuth (Демо) →
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Входя в систему, вы соглашаетесь с правилами академической честности и политикой конфиденциальности.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: SCREEN 3 — NEW ONBOARDING MODAL (ПЕРВЫЙ ВХОД / ЗАПОЛНЕНИЕ ПРОФИЛЯ)
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#080E1E] text-white flex flex-col font-sans select-none relative">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1D3D] border border-[#00A3FF] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
          <span className="text-sm font-semibold text-[#e0f2fe]">{notification}</span>
        </div>
      )}

      {/* MODAL: ONBOARDING MODAL (Blocking Dashboard until completed) */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 my-8 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#00A3FF] mx-auto flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(0,163,255,0.4)]">
                D
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Добро пожаловать в Digital Mentor!
              </h2>
              <p className="text-xs text-slate-400">
                Заполните данные для создания вашего академического профиля.
              </p>
            </div>

            {/* Error Message if any */}
            {onboardingError && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{onboardingError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCompleteOnboarding} className="space-y-5">
              {/* Field 1: Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Имя и Фамилия
                </label>
                <input
                  type="text"
                  required
                  value={onboardingFullName}
                  onChange={(e) => setOnboardingFullName(e.target.value)}
                  placeholder="Например: Ансар Нурлан"
                  className="w-full bg-[#070D1E] border border-slate-800 text-white rounded-lg p-3 focus:border-[#00A3FF] outline-none text-sm transition-colors"
                />
              </div>

              {/* Field 2: Grade / Course */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Класс / Курс
                </label>
                <select
                  value={onboardingGrade}
                  onChange={(e) => setOnboardingGrade(e.target.value)}
                  className="w-full bg-[#070D1E] border border-slate-800 text-white rounded-lg p-3 focus:border-[#00A3FF] outline-none text-sm transition-colors cursor-pointer"
                >
                  {GRADE_OPTIONS.map((grade) => (
                    <option key={grade} value={grade} className="bg-[#0B132B] text-white">
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Role (Select Once) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Выберите роль</span>
                  <span className="text-[10px] text-amber-400 font-normal">Выбирается 1 раз</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Card: Student */}
                  <div
                    onClick={() => setOnboardingRole('student')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      onboardingRole === 'student'
                        ? 'bg-[#00A3FF]/15 border-[#00A3FF] text-white shadow-[0_0_15px_rgba(0,163,255,0.3)]'
                        : 'bg-[#070D1E] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">🎓</span>
                      {onboardingRole === 'student' && (
                        <div className="w-5 h-5 rounded-full bg-[#00A3FF] flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-sm text-white">Ученик</div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Хочу учиться, готовиться к экзаменам и использовать Ment AI.
                    </p>
                  </div>

                  {/* Card: Mentor */}
                  <div
                    onClick={() => setOnboardingRole('mentor')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      onboardingRole === 'mentor'
                        ? 'bg-[#10b981]/15 border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-[#070D1E] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">🤝</span>
                      {onboardingRole === 'mentor' && (
                        <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-sm text-white">Волонтер-ментор</div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Хочу обучать, проверять работы и получать волонтерские часы.
                    </p>
                  </div>
                </div>

                {/* Warning Banner */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                  <span>
                    <strong>Внимание:</strong> роль выбирается один раз при регистрации и не может быть изменена самостоятельно.
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingOnboarding}
                className="bg-[#00A3FF] hover:bg-[#0284C7] disabled:opacity-50 text-white py-3 rounded-xl font-medium w-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submittingOnboarding ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Сохранение профиля...</span>
                  </>
                ) : (
                  <span>Завершить регистрацию</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 4. CLEAN BASE DASHBOARD SKELETON (NO OLD HARDCODED LESSONS)           */}
      {/* ====================================================================== */}
      <div className="flex min-h-screen">
        {/* Left Narrow Vertical Sidebar (76px) */}
        <aside className="w-[76px] min-w-[76px] h-screen sticky top-0 left-0 bg-[#0B1226] border-r border-slate-800/80 flex flex-col items-center justify-between py-5 z-50">
          {/* Brand Mark */}
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#0284c7] to-[#00A3FF] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(0,163,255,0.4)] hover:scale-105 transition-transform"
            title="Digital Mentor"
          >
            D
          </button>

          {/* Navigation Items */}
          <nav className="flex flex-col items-center gap-3.5 w-full">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#00A3FF] text-white shadow-[0_0_20px_rgba(0,163,255,0.45)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Дашборд"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Дашборд
              </span>
            </button>

            <button
              onClick={() => setCurrentView('ment-ai')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'ment-ai'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#00A3FF] text-white shadow-[0_0_22px_rgba(0,163,255,0.6)]'
                  : 'text-[#00A3FF] hover:bg-[#00A3FF]/10'
              }`}
              title="Ment AI"
            >
              <Sparkles className="w-5 h-5 animate-pulse text-[#00A3FF]" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-[#00A3FF]/60 text-[#00A3FF] text-xs font-bold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                ⚡ Ment AI
              </span>
            </button>

            <button
              onClick={() => setCurrentView('courses')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'courses'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#00A3FF] text-white shadow-[0_0_20px_rgba(0,163,255,0.45)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Курсы"
            >
              <BookOpen className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Курсы
              </span>
            </button>

            <button
              onClick={() => setCurrentView('schedule')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'schedule'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#00A3FF] text-white shadow-[0_0_20px_rgba(0,163,255,0.45)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Расписание"
            >
              <Calendar className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Расписание
              </span>
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'profile'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#00A3FF] text-white shadow-[0_0_20px_rgba(0,163,255,0.45)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Профиль"
            >
              <User className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Профиль
              </span>
            </button>
          </nav>

          {/* Logout */}
          <button
            onClick={handleSignOut}
            className="w-11 h-11 rounded-[14px] flex items-center justify-center text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
            title="Выйти из аккаунта"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </aside>

        {/* Main Framework Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#080E1E]">
          {/* Header */}
          <header className="h-[72px] sticky top-0 z-40 bg-[#080E1E]/90 backdrop-blur-md border-b border-slate-800/80 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#00A3FF] text-white font-extrabold text-base flex items-center justify-center shadow-[0_0_14px_rgba(0,163,255,0.3)]">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[17px] tracking-tight text-white leading-none">
                  Digital Mentor
                </span>
                <span className="text-[11.5px] text-slate-400 mt-1 font-medium">
                  Академическое наставничество · {userProfile?.grade || 'Астана'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              {/* Role Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-slate-800 text-xs font-semibold text-slate-200">
                <span className={`w-2 h-2 rounded-full ${userProfile?.role === 'mentor' ? 'bg-[#10b981]' : 'bg-[#00A3FF]'}`} />
                <span>
                  Роль: {userProfile?.role === 'mentor' ? 'Волонтер-ментор' : 'Ученик'}
                </span>
              </div>

              {/* Bell */}
              <button
                onClick={() => triggerToast('Уведомлений нет.')}
                className="w-10 h-10 rounded-xl bg-[#0F172A] border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Уведомления"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* Chat Ment */}
              <button
                onClick={() => setCurrentView('ment-ai')}
                className="w-10 h-10 rounded-xl bg-[#0F172A] border border-slate-800 text-[#00A3FF] hover:border-[#00A3FF]/40 flex items-center justify-center transition-colors"
                title="Ment AI"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              {/* Profile Avatar */}
              <button
                onClick={() => setCurrentView('profile')}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-[#0F172A] border border-[#00A3FF]/40 text-[#00A3FF] font-bold text-xs flex items-center justify-center hover:border-[#00A3FF] transition-colors"
                title={userProfile?.full_name || 'Профиль'}
              >
                {userProfile?.full_name?.slice(0, 2).toUpperCase() || 'ДМ'}
              </button>
            </div>
          </header>

          {/* Viewport */}
          <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-8">
            {/* VIEW 1: CLEAN DASHBOARD SKELETON */}
            {currentView === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Clean Welcome Hero */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF]">
                    Личная панель
                  </span>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Привет, {userProfile?.full_name || 'Пользователь'}! 👋
                  </h1>
                  <p className="text-sm text-slate-400">
                    Добро пожаловать в ваш академический кабинет. Ваш профиль готов к работе.
                  </p>
                </div>

                {/* 4 Clean Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 flex flex-col gap-1.5">
                    <span className="text-xs text-slate-400 font-medium">Активные курсы</span>
                    <span className="text-2xl font-extrabold text-[#00A3FF]">0 курсов</span>
                    <span className="text-[11.5px] text-slate-500">Нет добавленных программ</span>
                  </div>

                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 flex flex-col gap-1.5">
                    <span className="text-xs text-slate-400 font-medium">Уроков на неделе</span>
                    <span className="text-2xl font-extrabold text-[#00A3FF]">0 уроков</span>
                    <span className="text-[11.5px] text-slate-500">Расписание свободно</span>
                  </div>

                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 flex flex-col gap-1.5">
                    <span className="text-xs text-slate-400 font-medium">
                      {userProfile?.role === 'mentor' ? 'Волонтёрских часов' : 'Практика с Ment'}
                    </span>
                    <span className="text-2xl font-extrabold text-[#00A3FF]">0.0 ч</span>
                    <span className="text-[11.5px] text-slate-500">Начните первую сессию</span>
                  </div>

                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 flex flex-col gap-1.5">
                    <span className="text-xs text-slate-400 font-medium">Статус аккаунта</span>
                    <span className="text-2xl font-extrabold text-[#10b981]">Активен</span>
                    <span className="text-[11.5px] text-slate-500">Верифицирован</span>
                  </div>
                </div>

                {/* Next Lesson Empty State Card */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center text-xl flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Нет предстоящих онлайн-занятий
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        У вас пока нет назначенных уроков на эту неделю. Выберите курс или запустите Ment AI.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentView('schedule')}
                      className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
                    >
                      Открыть расписание
                    </button>
                    <button
                      onClick={() => setCurrentView('ment-ai')}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#00A3FF] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Изучить тему с Ment AI</span>
                    </button>
                  </div>
                </div>

                {/* Quick Action Framework */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00A3FF]/15 text-[#00A3FF] flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">Учебные программы</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Индивидуальное наставничество 1-на-1 и подготовка к экзаменам. Запишитесь на вводное занятие с ментором.
                    </p>
                    <button
                      onClick={() => setCurrentView('courses')}
                      className="text-xs font-bold text-[#00A3FF] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Перейти в каталог</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">Генератор тем Ment AI</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Нужно быстро разобрать формулу или тему к СОР/СОЧ? Введите любой школьный запрос для синтеза теории и теста.
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

            {/* VIEW 2: MENT AI (ON-DEMAND ENGINE) */}
            {currentView === 'ment-ai' && (
              <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#00A3FF]">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>MENT AI 24/7 · ON-DEMAND ENGINE</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Генератор уроков и микро-тестов
                  </h1>
                  <p className="text-sm text-slate-400">
                    Введите любую школьную тему (алгебра, геометрия, физика, история Казахстана), чтобы получить выжимку теории и проверочный тест.
                  </p>
                </div>

                {/* Input Card */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleGenerateLesson(mentTopicInput);
                    }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={mentTopicInput}
                        onChange={(e) => setMentTopicInput(e.target.value)}
                        placeholder="Какую тему ты хочешь изучить? (например: Теорема Виета, Закон Ома, Циклы for)..."
                        className="w-full pl-11 pr-4 py-3 bg-[#080E1E] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00A3FF] transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isGenerating || !mentTopicInput.trim()}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#00A3FF] hover:brightness-110 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Синтез...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Сгенерировать урок</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Generated Lesson Content */}
                {currentLesson && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold text-[#00A3FF] px-3 py-1 rounded-full bg-[#00A3FF]/15 border border-[#00A3FF]/30">
                        {currentLesson.category}
                      </span>
                      <button
                        onClick={handleSaveNote}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#00A3FF]" />
                        <span>Сохранить конспект</span>
                      </button>
                    </div>

                    {/* Block 1: Theory */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A3FF]">
                        <span className="w-5 h-5 rounded bg-[#00A3FF]/15 border border-[#00A3FF]/30 flex items-center justify-center text-[10px]">
                          1
                        </span>
                        <span>Выжимка теории</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{currentLesson.topic}</h3>
                      <ul className="space-y-2">
                        {currentLesson.theoryPoints.map((pt, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                            <span className="w-4 h-4 rounded bg-[#080E1E] border border-slate-700 text-[#00A3FF] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="p-3 bg-[#080E1E] border border-slate-800 rounded-xl font-mono text-xs text-slate-200 whitespace-pre-wrap">
                        {currentLesson.keyFormulaOrCode.content}
                      </div>
                    </div>

                    {/* Block 2: Quiz */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A3FF]">
                          <span className="w-5 h-5 rounded bg-[#00A3FF]/15 border border-[#00A3FF]/30 flex items-center justify-center text-[10px]">
                            2
                          </span>
                          <span>Интерактивный микро-тест</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {currentLesson.quiz.map((q, qIndex) => {
                          const ans = userQuizAnswers[q.id];
                          const answered = ans !== undefined;
                          const isCorrect = answered && ans === q.correctIndex;

                          return (
                            <div key={q.id} className="bg-[#080E1E] border border-slate-800 rounded-xl p-4 space-y-3">
                              <div className="text-xs font-semibold text-white">
                                {qIndex + 1}. {q.question}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map((opt, optIndex) => {
                                  const isSelected = ans === optIndex;
                                  let style = 'bg-[#0F172A] border-slate-800 text-slate-300 hover:border-slate-700';

                                  if (answered) {
                                    if (optIndex === q.correctIndex) {
                                      style = 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold';
                                    } else if (isSelected && !isCorrect) {
                                      style = 'bg-red-500/15 border-red-500 text-red-300';
                                    }
                                  } else if (isSelected) {
                                    style = 'bg-[#00A3FF]/15 border-[#00A3FF] text-[#00A3FF]';
                                  }

                                  return (
                                    <button
                                      key={optIndex}
                                      onClick={() => {
                                        setUserQuizAnswers((prev) => ({
                                          ...prev,
                                          [q.id]: optIndex
                                        }));
                                      }}
                                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${style}`}
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

            {/* VIEW 3: COURSES (EMPTY STATE SKELETON) */}
            {currentView === 'courses' && (
              <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                <div>
                  <h1 className="text-2xl font-bold text-white">Курсы и программы</h1>
                  <p className="text-xs text-slate-400 mt-1">Каталог учебных направлений и активные записи.</p>
                </div>
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Нет активных курсов</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Вы еще не записались на курсы. Выберите направление наставничества или воспользуйтесь Ment AI для самостоятельного обучения.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView('ment-ai')}
                    className="px-5 py-2.5 rounded-xl bg-[#00A3FF] text-white text-xs font-bold hover:bg-[#0284c7] transition-colors"
                  >
                    Запустить Ment AI →
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 4: SCHEDULE (EMPTY STATE SKELETON) */}
            {currentView === 'schedule' && (
              <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                <div>
                  <h1 className="text-2xl font-bold text-white">Расписание онлайн-занятий</h1>
                  <p className="text-xs text-slate-400 mt-1">Календарь ваших предстоящих онлайн-сессий.</p>
                </div>
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Расписание пусто</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      На этой неделе нет запланированных сессий. Новые занятия появятся здесь после подтверждения ментором.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: PROFILE */}
            {currentView === 'profile' && (
              <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
                <div>
                  <h1 className="text-2xl font-bold text-white">Профиль пользователя</h1>
                  <p className="text-xs text-slate-400 mt-1">Информация об аккаунте и сохраненные материалы.</p>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#00A3FF] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(0,163,255,0.4)]">
                      {userProfile?.full_name?.slice(0, 2).toUpperCase() || 'ДМ'}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-white">{userProfile?.full_name || 'Пользователь'}</h2>
                      <p className="text-xs text-slate-400">{userProfile?.email || 'Google Auth'}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#00A3FF]/15 text-[#00A3FF] border border-[#00A3FF]/40">
                          {userProfile?.role === 'mentor' ? 'Волонтер-ментор' : 'Ученик'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {userProfile?.grade}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/15 text-xs font-bold transition-colors"
                  >
                    Выйти из аккаунта
                  </button>
                </div>

                {/* Saved Notes in Profile */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-white">Сохраненные конспекты</h3>
                  {savedNotes.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      У вас пока нет сохраненных конспектов. Воспользуйтесь Ment AI для сохранения материалов.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {savedNotes.map((note, idx) => (
                        <div key={idx} className="p-3 bg-[#080E1E] rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{note}</span>
                          <button
                            onClick={() => {
                              setMentTopicInput(note);
                              handleGenerateLesson(note);
                            }}
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
          </main>
        </div>
      </div>
    </div>
  );
}
