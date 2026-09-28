'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PracticeProblem {
  id: string;
  topic: string;
  category: string;
  statement: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  aiExplanation: string;
  detailedSolution: string;
}

export interface Ticket {
  id: string;
  studentName: string;
  studentGrade: string;
  taskTitle: string;
  question: string;
  codeSnippet: string;
  aiDraft: string;
  mentorResponse?: string;
  status: 'open' | 'claimed' | 'resolved';
  timestamp: string;
  claimedBy?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  progress: number;
  target: number;
  current: number;
  unlocked: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'mentor';
  xp: number;
  streak: number;
}

export interface AppStoreState {
  // Navigation
  activeTab: 'practice' | 'mentor' | 'profile';
  setActiveTab: (tab: 'practice' | 'mentor' | 'profile') => void;

  // Settings Modal & Preferences
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;

  // User Profile
  user: UserProfile;
  setUserRole: (role: 'student' | 'mentor') => void;

  // Practice State
  currentProblem: PracticeProblem;
  selectedOption: number | null;
  setSelectedOption: (index: number | null) => void;
  attemptsLeft: number; // 3, 2, 1, 0
  isSolved: boolean;
  lastAnswerWrong: boolean;
  aiConsoleHint: string | null;
  isTicketEscalated: boolean;
  escalatedTicketId: string | null;

  // Actions for Practice
  checkAnswer: () => boolean;
  requestMentorHelp: () => string;
  resetPractice: () => void;

  // Mentor Screen State
  tickets: Ticket[];
  volunteerMinutes: number; // e.g. 870 = 14.5 hours
  certificateGenerated: boolean;
  isCertModalOpen: boolean;
  setCertModalOpen: (open: boolean) => void;

  // Actions for Mentor
  claimTicket: (ticketId: string) => void;
  generateAiDraftForTicket: (ticketId: string) => void;
  updateTicketDraft: (ticketId: string, draft: string) => void;
  resolveTicket: (ticketId: string, responseText?: string) => void;

  // Achievements
  achievements: AchievementItem[];

  // Global reset
  resetAll: () => void;
}

const DEFAULT_PROBLEM: PracticeProblem = {
  id: 'sat-quad-101',
  topic: 'Квадратные уравнения и вершина параболы (Vertex Form) — SAT Math',
  category: 'Алгебра & SAT Prep',
  statement:
    'Дана квадратичная функция f(x) = 2x² - 8x + 11. Определите координаты вершины параболы (h, k), записав её в каноническом виде f(x) = a(x - h)² + k.',
  codeSnippet: `def find_vertex(a, b, c):\n    # Вычисление вершины параболы\n    h = -b / (2 * a)\n    k = c - (b**2) / (4 * a)\n    return (h, k)`,
  options: [
    '(2, 3)',
    '(-2, 3)',
    '(2, -5)',
    '(4, 11)',
  ],
  correctOptionIndex: 0,
  aiExplanation:
    'Анализ ошибки: формула абсциссы вершины h = -b / (2a). При a = 2, b = -8 получаем h = -(-8) / (2 * 2) = 8 / 4 = 2. Затем подставляем h в функцию: k = 2(2)² - 8(2) + 11 = 8 - 16 + 11 = 3.',
  detailedSolution:
    'Шаг 1: h = -(-8) / (2 * 2) = 2. Шаг 2: k = 2*(4) - 8*(2) + 11 = 8 - 16 + 11 = 3. Координаты вершины: (2, 3).',
};

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TK-904',
    studentName: 'Алихан Сейткали',
    studentGrade: '10 класс',
    taskTitle: 'Поиск вершины параболы (Vertex Form) — SAT Math',
    question: 'Почему при расчёте h = -b / 2 * a вершина смещается? В формуле же написано минус b делить на два а.',
    codeSnippet: 'h = -b / 2 * a    # Ошибка приоритета операций\nk = c - (b**2) / (4*a)',
    aiDraft:
      'Привет, Алихан! Проблема в порядке операций: в Python выражение `-b / 2 * a` выполняется слева направо: сначала `-b / 2`, затем умножается на `a`. Чтобы разделить на всё произведение `2*a`, знаменатель обязательно нужно взять в скобки: `h = -b / (2 * a)`.',
    status: 'open',
    timestamp: '5 мин назад',
  },
  {
    id: 'TK-898',
    studentName: 'Дана Кенес',
    studentGrade: '11 класс',
    taskTitle: 'Радианная мера угла и тригонометрия СОР',
    question: 'Функция math.sin ожидает радианы, а в условии задачи угол дан в градусах. Как перевести без потери точности?',
    codeSnippet: 'import math\ndef get_sine(deg):\n    return math.sin(deg)',
    aiDraft:
      'Используйте встроенную функцию `math.radians(deg)`: `math.sin(math.radians(deg))`, либо умножьте градусы на `math.pi / 180`.',
    status: 'claimed',
    mentorResponse: undefined,
    timestamp: '18 мин назад',
    claimedBy: 'Ансар Нурлан',
  },
  {
    id: 'TK-885',
    studentName: 'Тимур Ибраев',
    studentGrade: '9 класс',
    taskTitle: 'Разложение квадратного трехчлена на множители',
    question: 'Как красиво обработать случай, когда дискриминант отрицательный, чтобы не было ошибки complex float?',
    codeSnippet: 'd = b**2 - 4*a*c\nx1 = (-b + d**0.5) / (2*a)',
    aiDraft: 'Добавьте проверку: if d < 0: return None',
    mentorResponse:
      'Отличный вопрос! Добавь условие `if d < 0:` и возвращай `None` или пустой кортеж `()`, чтобы предотвратить ошибку комплексных чисел.',
    status: 'resolved',
    timestamp: '45 мин назад',
    claimedBy: 'Ансар Нурлан',
  },
];

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first-step',
    title: 'Первый шаг',
    desc: 'Решена первая академическая задача на платформе',
    icon: 'target',
    progress: 100,
    target: 1,
    current: 1,
    unlocked: true,
  },
  {
    id: 'streak-fire',
    title: 'В огне',
    desc: '5 дней непрерывного ударного режима в решении тестов',
    icon: 'flame',
    progress: 100,
    target: 5,
    current: 5,
    unlocked: true,
  },
  {
    id: 'mentor-pro',
    title: 'Наставник',
    desc: 'Разобрать 10 академических тикетов учеников (+15 мин каждый)',
    icon: 'award',
    progress: 60,
    target: 10,
    current: 6,
    unlocked: false,
  },
  {
    id: 'clean-code',
    title: 'Чистый код',
    desc: 'Решение 5 задач подряд с первой попытки без подсказок',
    icon: 'code',
    progress: 80,
    target: 5,
    current: 4,
    unlocked: false,
  },
];

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      // Navigation
      activeTab: 'practice',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Settings Modal & Preferences
      isSettingsOpen: false,
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      soundEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      // User Profile
      user: {
        name: 'Ансар Нурлан',
        email: 'ansarnurlan2@gmail.com',
        avatar: 'АН',
        role: 'mentor',
        xp: 1420,
        streak: 7,
      },
      setUserRole: (role) =>
        set((state) => ({
          user: { ...state.user, role },
        })),

      // Practice State
      currentProblem: DEFAULT_PROBLEM,
      selectedOption: null,
      setSelectedOption: (index) => set({ selectedOption: index }),
      attemptsLeft: 3,
      isSolved: false,
      lastAnswerWrong: false,
      aiConsoleHint: null,
      isTicketEscalated: false,
      escalatedTicketId: null,

      // Check Answer
      checkAnswer: () => {
        const { currentProblem, selectedOption, attemptsLeft, isSolved } = get();
        if (selectedOption === null || isSolved || attemptsLeft <= 0) return false;

        if (selectedOption === currentProblem.correctOptionIndex) {
          // Correct!
          set((state) => ({
            isSolved: true,
            lastAnswerWrong: false,
            aiConsoleHint: null,
            user: { ...state.user, xp: state.user.xp + 50 },
          }));
          return true;
        } else {
          // Wrong!
          const nextAttempts = Math.max(0, attemptsLeft - 1);
          set({
            attemptsLeft: nextAttempts,
            lastAnswerWrong: true,
            aiConsoleHint: currentProblem.aiExplanation,
          });
          return false;
        }
      },

      // Request Mentor Help (Escalate)
      requestMentorHelp: () => {
        const { currentProblem, user } = get();
        const ticketId = `TK-${Math.floor(100 + Math.random() * 900)}`;

        const newTicket: Ticket = {
          id: ticketId,
          studentName: user.name,
          studentGrade: '10 класс',
          taskTitle: currentProblem.topic,
          question: `Исчерпаны 3 попытки при решении задачи "${currentProblem.statement}". Нужна помощь наставника в разборе логики.`,
          codeSnippet: currentProblem.codeSnippet || '',
          aiDraft: `Привет! Давай разберем эту задачу вместе. Вспомни формулу вершины: h = -b / (2*a). Попробуй проверить знаки коэффициентов: a = 2, b = -8.`,
          status: 'open',
          timestamp: 'Только что',
        };

        set((state) => ({
          isTicketEscalated: true,
          escalatedTicketId: ticketId,
          tickets: [newTicket, ...state.tickets],
        }));

        return ticketId;
      },

      // Reset practice
      resetPractice: () => {
        set({
          attemptsLeft: 3,
          isSolved: false,
          lastAnswerWrong: false,
          aiConsoleHint: null,
          selectedOption: null,
          isTicketEscalated: false,
          escalatedTicketId: null,
        });
      },

      // Mentor Screen State
      tickets: INITIAL_TICKETS,
      volunteerMinutes: 870, // 14.5 hours
      certificateGenerated: false,
      isCertModalOpen: false,
      setCertModalOpen: (open) => set({ isCertModalOpen: open }),

      // Claim Ticket
      claimTicket: (ticketId: string) => {
        const { user } = get();
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? { ...t, status: 'claimed' as const, claimedBy: user.name }
              : t
          ),
        }));
      },

      // Generate AI Draft
      generateAiDraftForTicket: (ticketId: string) => {
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id === ticketId) {
              const draft =
                t.aiDraft ||
                `Привет, ${t.studentName}! Я внимательно изучил твой вопрос по теме "${t.taskTitle}". Обрати внимание на приоритет математических операций и знаки перед коэффициентами.`;
              return { ...t, aiDraft: draft };
            }
            return t;
          }),
        }));
      },

      // Update Draft
      updateTicketDraft: (ticketId: string, draft: string) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId ? { ...t, aiDraft: draft } : t
          ),
        }));
      },

      // Resolve Ticket (+15 minutes credited, unlocks student practice)
      resolveTicket: (ticketId: string, responseText?: string) => {
        const state = get();
        const target = state.tickets.find((t) => t.id === ticketId);
        const finalResponse = responseText || target?.aiDraft || 'Вопрос разобран ментором.';

        set((s) => {
          const updatedTickets = s.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  status: 'resolved' as const,
                  mentorResponse: finalResponse,
                }
              : t
          );

          // Update achievements if mentor count reaches target
          const updatedAchievements = s.achievements.map((ach) => {
            if (ach.id === 'mentor-pro') {
              const newCount = ach.current + 1;
              const newProgress = Math.min(100, Math.round((newCount / ach.target) * 100));
              return {
                ...ach,
                current: newCount,
                progress: newProgress,
                unlocked: newCount >= ach.target,
              };
            }
            return ach;
          });

          return {
            tickets: updatedTickets,
            volunteerMinutes: s.volunteerMinutes + 15,
            achievements: updatedAchievements,
            // Restore student practice if this was the escalated ticket
            ...(s.escalatedTicketId === ticketId
              ? {
                  attemptsLeft: 3,
                  isTicketEscalated: false,
                  lastAnswerWrong: false,
                  aiConsoleHint: `Наставник ${s.user.name} разобрал ваш тикет! Попытки восстановлены. Рекомендация: ${finalResponse}`,
                }
              : {}),
          };
        });
      },

      // Achievements
      achievements: INITIAL_ACHIEVEMENTS,

      // Global Reset
      resetAll: () => {
        set({
          attemptsLeft: 3,
          isSolved: false,
          lastAnswerWrong: false,
          aiConsoleHint: null,
          selectedOption: null,
          isTicketEscalated: false,
          escalatedTicketId: null,
          volunteerMinutes: 870,
          tickets: INITIAL_TICKETS,
          achievements: INITIAL_ACHIEVEMENTS,
        });
      },
    }),
    {
      name: 'dm_unified_store_v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
