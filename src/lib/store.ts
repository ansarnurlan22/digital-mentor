import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Ticket {
  id: string;
  studentName: string;
  taskTitle: string;
  codeSnippet: string;
  question: string;
  aiHint: string;
  status: 'open' | 'claimed' | 'resolved';
  mentorResponse?: string;
  timestamp: string;
}

export type ViewRole = 'student' | 'mentor' | 'verifier';

export interface AppState {
  // Текущий режим просмотра (Dev Bar)
  activeView: ViewRole;
  setActiveView: (view: ViewRole) => void;

  // Ученик
  hearts: number; // 3 жизни
  xp: number;
  streak: number;
  activeLessonStep: number;
  currentCode: string;
  terminalLogs: Array<{ id: string; type: 'stdout' | 'stderr' | 'system' | 'success' | 'ai'; text: string; time: string }>;
  isEvaluating: boolean;
  
  // Связующее звено 70/30 (Тикеты)
  tickets: Ticket[];

  // Ментор
  volunteerMinutes: number; // +15 минут за каждый тикет
  resolvedTicketsCount: number;

  // Actions
  setCurrentCode: (code: string) => void;
  addLog: (type: 'stdout' | 'stderr' | 'system' | 'success' | 'ai', text: string) => void;
  clearLogs: () => void;
  loseHeart: () => void;
  resetHearts: () => void;
  createTicketFromLesson: (task: string, code: string, question: string, aiHint?: string) => string;
  claimTicket: (ticketId: string) => void;
  resolveTicket: (ticketId: string, response: string) => void;
  nextStep: () => void;
  resetSession: () => void;
}

const INITIAL_CODE = `def find_vertex(a, b, c):
    # Задача: найти координаты вершины (h, k)
    # Формулы: h = -b / (2*a), k = c - b^2 / (4*a)
    h = -b / 2 * a    # Внимание: здесь скрыта ошибка приоритета!
    k = c - (b**2) / (4*a)
    return (h, k)`;

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TK-842',
    studentName: 'Алихан Сейткали (10 класс)',
    taskTitle: 'Поиск вершины параболы (Vertex Form) — SAT Math',
    codeSnippet: `def find_vertex(a, b, c):\n    h = -b / 2 * a\n    k = c - (b**2) / (4*a)\n    return (h, k)`,
    question: 'Почему при a=1, b=-2 тесты возвращают (-4.0, 1.0) вместо правильного h=1.0? Формулу списал из учебника.',
    aiHint: 'Socratic AI: Приоритет операций в Python. Оператор `/` и `*` имеют одинаковый приоритет слева направо. Скобки вокруг знаменателя обязательны.',
    status: 'open',
    timestamp: '5 минут назад',
  },
  {
    id: 'TK-841',
    studentName: 'Дана Кенес (11 класс)',
    taskTitle: 'Оптимизация траектории (Capstone Boss)',
    codeSnippet: `import math\ndef trajectory(v0, deg):\n    return (v0**2 * math.sin(deg)) / 9.8`,
    question: 'Функция math.sin ожидает радианы, а я передаю градусы. Как в Python перевести угол без погрешностей?',
    aiHint: 'Socratic AI: Используйте встроенную функцию math.radians(deg) перед вычислением синуса.',
    status: 'claimed',
    mentorResponse: undefined,
    timestamp: '18 минут назад',
  },
  {
    id: 'TK-840',
    studentName: 'Тимур Ибраев (9 класс)',
    taskTitle: 'Разложение на множители СОР/СОЧ',
    codeSnippet: `def factorize(a, b, c):\n    d = b**2 - 4*a*c\n    return (-b + d**0.5)/(2*a), (-b - d**0.5)/(2*a)`,
    question: 'Как красиво обработать случай, когда дискриминант меньше нуля?',
    aiHint: 'Socratic AI: Добавьте проверку `if d < 0: return None` перед извлечением квадратного корня.',
    status: 'resolved',
    mentorResponse: 'Отличный вопрос! Добавь условие `if d < 0:` и возвращай пустой кортеж `()` или `None`, чтобы избежать ошибки комплексных чисел в float.',
    timestamp: '42 минуты назад',
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeView: 'student',
      setActiveView: (view) => set({ activeView: view }),

      hearts: 3,
      xp: 120,
      streak: 5,
      activeLessonStep: 1,
      currentCode: INITIAL_CODE,
      terminalLogs: [
        {
          id: 'log-init',
          type: 'system',
          text: 'Digital Mentor Runtime v2.4 initialized. Socratic AI Engine (70%) online.',
          time: 'now',
        },
      ],
      isEvaluating: false,

      tickets: INITIAL_TICKETS,
      volunteerMinutes: 75,
      resolvedTicketsCount: 5,

      setCurrentCode: (code) => set({ currentCode: code }),

      addLog: (type, text) => {
        set((state) => ({
          terminalLogs: [
            ...state.terminalLogs,
            {
              id: `log-${Date.now()}-${Math.random()}`,
              type,
              text,
              time: new Date().toLocaleTimeString('ru-RU', { minute: '2-digit', second: '2-digit' }),
            },
          ],
        }));
      },

      clearLogs: () => set({ terminalLogs: [] }),

      loseHeart: () => {
        set((state) => {
          const nextHearts = Math.max(0, state.hearts - 1);
          return { hearts: nextHearts };
        });
      },

      resetHearts: () => set({ hearts: 3 }),

      createTicketFromLesson: (task, code, question, aiHint) => {
        const newId = `TK-${Math.floor(100 + Math.random() * 900)}`;
        const newTicket: Ticket = {
          id: newId,
          studentName: 'Вы (Ученик)',
          taskTitle: task,
          codeSnippet: code,
          question,
          aiHint: aiHint || 'Socratic AI: Ученик исчерпал 3 попытки. Требуется подсказка наставника по приоритету скобок.',
          status: 'open',
          timestamp: 'только что',
        };

        set((state) => ({
          tickets: [newTicket, ...state.tickets],
        }));

        get().addLog('ai', `✓ Микро-тикет #${newId} отправлен в Realtime-очередь! Волонтер подключится в течение 2 минут (+15 мин в сертификат).`);
        return newId;
      },

      claimTicket: (ticketId) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId ? { ...t, status: 'claimed' as const } : t
          ),
        }));
      },

      resolveTicket: (ticketId, response) => {
        set((state) => {
          const updated = state.tickets.map((t) =>
            t.id === ticketId
              ? { ...t, status: 'resolved' as const, mentorResponse: response }
              : t
          );
          return {
            tickets: updated,
            volunteerMinutes: state.volunteerMinutes + 15,
            resolvedTicketsCount: state.resolvedTicketsCount + 1,
          };
        });
      },

      nextStep: () => {
        set((state) => ({
          activeLessonStep: state.activeLessonStep + 1,
          xp: state.xp + 40,
          hearts: 3,
        }));
      },

      resetSession: () => {
        set({
          hearts: 3,
          currentCode: INITIAL_CODE,
          activeLessonStep: 1,
        });
        get().clearLogs();
        get().addLog('system', 'Сессия сброшена. 3 сердца восстановлены. Код возвращен в исходное состояние.');
      },
    }),
    {
      name: 'digital_mentor_shared_state_v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
