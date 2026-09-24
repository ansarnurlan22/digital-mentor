export type TutorMode = 'tutor' | 'quiz' | 'theory';

export interface UserProfile {
  name: string;
  role: 'Ученик' | 'Ментор';
  grade: string;
  subject: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  quickReplies?: string[];
  suggestedAction?: {
    label: string;
    actionType: 'open_theory' | 'start_quiz' | 'ask_hint';
    payload?: string;
  };
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  formulaLatex?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  socraticHint: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedOption: number | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  score: number;
  totalQuestions: number;
}

export interface TheoryFormula {
  title: string;
  latex: string;
  description: string;
  exampleLatex?: string;
}

export interface TheoryCategory {
  id: string;
  name: string;
  icon: string;
  formulas: TheoryFormula[];
}

export interface TutorQuizItem {
  id: number;
  question: string;
  options: [string, string, string, string] | string[];
  correctIndex: number;
  explanation: string;
}

export interface TutorLessonResponse {
  topic: string;
  theorySummary: string;
  quiz: TutorQuizItem[];
}

