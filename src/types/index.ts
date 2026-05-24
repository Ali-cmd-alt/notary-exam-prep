// src/types/index.ts

export interface Chapter {
  id: number;
  title: string;
  slug: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeCard {
  id: number;
  chapter_id: number;
  title: string;
  content: string;
  key_points: string[];
  sort_order: number;
  source_label: string;
  source_url: string;
  updated_at: string;
}

export interface Question {
  id: number;
  chapter_id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  source_ref: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  is_paid: boolean;
  created_at: string;
}

export interface UserProgress {
  id: number;
  user_id: string;
  chapter_id: number;
  completed_cards: number[];
  quiz_scores: QuizScore[];
  mastered: boolean;
}

export interface QuizScore {
  date: string;
  score: number;
  total: number;
}

export interface WrongAnswer {
  id: number;
  user_id: string;
  question_id: number;
  user_answer: number;
  review_count: number;
  last_reviewed_at: string;
  question?: Question;
}

export interface ExamRecord {
  id: number;
  user_id: string;
  score: number;
  total: number;
  time_used: number;
  weak_chapters: number[];
  taken_at: string;
}

export interface Subscription {
  id: number;
  user_id: string;
  paddle_order_id: string;
  paddle_transaction_id: string;
  status: string;
  purchased_at: string;
  expires_at: string | null;
}

export interface Review {
  id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { display_name: string };
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  author: string;
}

export interface ExamState {
  questions: Question[];
  currentIndex: number;
  answers: number[];
  timeRemaining: number;
  isFinished: boolean;
}
