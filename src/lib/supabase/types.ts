export type UserRole = 'student' | 'mentor' | 'admin';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string | null;
  xp: number;
  streak_days: number;
  volunteer_minutes: number;
  mentor_rating: number;
  created_at: string;
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  order_index: number;
  created_at: string;
}

export interface SkillNode {
  id: string;
  module_id: string;
  title: string;
  node_type: 'interactive_step' | 'capstone_boss';
  order_index: number;
  problem_statement?: string;
  initial_code?: string;
  expected_solution?: string;
  ai_rubric?: Record<string, any>;
  created_at: string;
}

export interface MicroTicket {
  id: string;
  student_id: string;
  mentor_id?: string | null;
  node_id: string;
  status: TicketStatus;
  code_context?: string | null;
  student_query: string;
  mentor_answer?: string | null;
  ai_summary?: string | null;
  awarded_minutes: number;
  created_at: string;
  resolved_at?: string | null;
  student?: {
    full_name: string;
    avatar_url?: string | null;
  };
  mentor?: {
    full_name: string;
    avatar_url?: string | null;
  };
  node?: {
    title: string;
    node_type: string;
  };
}

export interface Certificate {
  id: string;
  mentor_id: string;
  verification_token: string;
  total_hours: number;
  issued_at: string;
  mentor?: {
    full_name: string;
    role: string;
  };
}
