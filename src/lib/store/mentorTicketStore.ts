import { create } from 'zustand';
import { MicroTicket, TicketStatus } from '../supabase/types';
import { supabase } from '../supabase/client';

interface MentorTicketState {
  tickets: MicroTicket[];
  isLoading: boolean;
  filterStatus: TicketStatus | 'all';
  activeResolvingTicket: MicroTicket | null;
  mentorAnswerText: string;

  // Actions
  setFilterStatus: (status: TicketStatus | 'all') => void;
  setActiveResolvingTicket: (ticket: MicroTicket | null) => void;
  setMentorAnswerText: (text: string) => void;
  fetchTickets: () => Promise<void>;
  subscribeToRealtimeTickets: () => () => void;
  claimTicket: (ticketId: string, mentorId: string, mentorName?: string) => Promise<boolean>;
  resolveTicket: (ticketId: string, answer: string, awardedMinutes?: number) => Promise<boolean>;
}

const INITIAL_DEMO_TICKETS: MicroTicket[] = [
  {
    id: 't-101',
    student_id: 's-1',
    node_id: 'a1111111-1111-1111-1111-111111111111',
    status: 'open',
    code_context: 'def find_vertex(a, b, c):\n    h = -b / 2 * a  # Ошибка: нужно 2*a в скобках\n    k = c - b**2 / 4*a\n    return (h, k)',
    student_query: 'Почему тесты выдают ( -4.0, 16.0 ) вместо ( -1.0, 1.0 )? Вроде формулу списал правильно.',
    ai_summary: 'Приоритет операций в Python: выражение `-b / 2 * a` вычисляется как `(-b / 2) * a`. Нужно `(-b) / (2 * a)`.',
    awarded_minutes: 15,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    student: {
      full_name: 'Алихан Сейткали',
      avatar_url: null,
    },
    node: {
      title: 'Поиск вершины параболы (Vertex Form)',
      node_type: 'interactive_step',
    },
  },
  {
    id: 't-102',
    student_id: 's-2',
    node_id: 'a2222222-2222-2222-2222-222222222222',
    status: 'open',
    code_context: 'import math\ndef projectile_optimization(v0, angle_deg, g=9.8):\n    # Забыл перевести градусы в радианы\n    h_max = (v0**2 * math.sin(angle_deg)**2) / (2*g)\n    return h_max',
    student_query: 'Функция math.sin ожидает радианы, а я передаю угол в градусах. Как правильно конвертировать?',
    ai_summary: 'Необходим вызов math.radians(angle_deg) перед вычислением тригонометрических функций траектории.',
    awarded_minutes: 15,
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    student: {
      full_name: 'Дана Кенес',
      avatar_url: null,
    },
    node: {
      title: 'Финал модуля: Оптимизация траектории (Capstone Boss)',
      node_type: 'capstone_boss',
    },
  },
  {
    id: 't-103',
    student_id: 's-3',
    mentor_id: 'm-1',
    node_id: 'a1111111-1111-1111-1111-111111111111',
    status: 'resolved',
    code_context: 'def find_vertex(a, b, c):\n    h = -b / (2 * a)\n    k = c - (b**2)/(4*a)\n    return (h, k)',
    student_query: 'Спасибо ментору, помогли разобраться со скобками!',
    mentor_answer: 'Отлично! Всегда следи за приоритетом деления и умножения в Python. Скобки вокруг знаменателя решают проблему.',
    ai_summary: 'Вопрос успешно решен волонтером.',
    awarded_minutes: 15,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    resolved_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    student: {
      full_name: 'Тимур Ибраев',
      avatar_url: null,
    },
    mentor: {
      full_name: 'Ансар Нурлан (Ментор)',
      avatar_url: null,
    },
    node: {
      title: 'Поиск вершины параболы (Vertex Form)',
      node_type: 'interactive_step',
    },
  },
];

export const useMentorTicketStore = create<MentorTicketState>((set, get) => ({
  tickets: INITIAL_DEMO_TICKETS,
  isLoading: false,
  filterStatus: 'all',
  activeResolvingTicket: null,
  mentorAnswerText: '',

  setFilterStatus: (status) => set({ filterStatus: status }),
  setActiveResolvingTicket: (ticket) => set({ activeResolvingTicket: ticket, mentorAnswerText: '' }),
  setMentorAnswerText: (text) => set({ mentorAnswerText: text }),

  fetchTickets: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('micro_tickets')
        .select(`
          *,
          student:profiles!micro_tickets_student_id_fkey(full_name, avatar_url),
          mentor:profiles!micro_tickets_mentor_id_fkey(full_name, avatar_url),
          node:skill_nodes(title, node_type)
        `)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        set({ tickets: data, isLoading: false });
        return;
      }
    } catch (e) {}

    // Fallback to local storage or demo tickets
    try {
      const local = localStorage.getItem('digitalMentor_microTickets');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ tickets: parsed, isLoading: false });
          return;
        }
      }
    } catch (e) {}

    set({ tickets: INITIAL_DEMO_TICKETS, isLoading: false });
  },

  subscribeToRealtimeTickets: () => {
    try {
      const channel = supabase
        .channel('public:micro_tickets')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'micro_tickets' },
          (payload) => {
            get().fetchTickets();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      return () => {};
    }
  },

  claimTicket: async (ticketId: string, mentorId: string, mentorName?: string) => {
    try {
      await supabase
        .from('micro_tickets')
        .update({
          mentor_id: mentorId,
          status: 'in_progress',
        })
        .eq('id', ticketId);
    } catch (e) {}

    // Update local state
    set((state) => {
      const updated = state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              mentor_id: mentorId,
              status: 'in_progress' as TicketStatus,
              mentor: { full_name: mentorName || 'Вы (Волонтер)', avatar_url: null },
            }
          : t
      );
      try {
        localStorage.setItem('digitalMentor_microTickets', JSON.stringify(updated));
      } catch (e) {}
      return { tickets: updated };
    });

    return true;
  },

  resolveTicket: async (ticketId: string, answer: string, awardedMinutes = 15) => {
    const resolvedAt = new Date().toISOString();
    try {
      await supabase
        .from('micro_tickets')
        .update({
          mentor_answer: answer,
          status: 'resolved',
          resolved_at: resolvedAt,
          awarded_minutes: awardedMinutes,
        })
        .eq('id', ticketId);
    } catch (e) {}

    set((state) => {
      const updated = state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              mentor_answer: answer,
              status: 'resolved' as TicketStatus,
              resolved_at: resolvedAt,
              awarded_minutes: awardedMinutes,
            }
          : t
      );
      try {
        localStorage.setItem('digitalMentor_microTickets', JSON.stringify(updated));
      } catch (e) {}
      return { tickets: updated, activeResolvingTicket: null, mentorAnswerText: '' };
    });

    return true;
  },
}));
