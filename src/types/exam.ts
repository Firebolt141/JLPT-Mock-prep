export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type SectionType = 'vocabulary' | 'grammar' | 'reading' | 'listening';

export type QuestionType =
  | 'multiple-choice'
  | 'sentence-composition'
  | 'reading-comprehension'
  | 'listening-comprehension';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options: Option[];
  correctOptionId: string;
  explanation?: string;
  audioUrl?: string;
  passageRef?: string;
}

export interface ReadingPassage {
  id: string;
  title?: string;
  text: string;
}

export interface Subsection {
  id: string;
  title: string;
  instructions: string;
  questions: Question[];
  passages?: ReadingPassage[];
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  timeLimitSeconds: number;
  subsections: Subsection[];
}

export interface ExamSet {
  id: string;
  level: JLPTLevel;
  title: string;
  description?: string;
  sections: Section[];
}

export interface ResultsHistoryEntry {
  id: string;
  participantName: string;
  email: string;
  examId: string;
  examLevel: JLPTLevel;
  scores: ExamScores;
  completedAt: string;
}

export interface ExamResult {
  participantName: string;
  email: string;
  examId: string;
  examLevel: JLPTLevel;
  answers: Record<string, string>;
  completedAt: string;
  scores: ExamScores;
}

export interface SectionScore {
  sectionId: string;
  sectionTitle: string;
  correct: number;
  total: number;
  rawScore: number;
  scaledScore: number;
}

export interface ExamScores {
  lkrScore: number;
  listeningScore: number;
  totalScore: number;
  passed: boolean;
  sectionScores: SectionScore[];
}

export interface ExamAvailability {
  id: string;
  level: JLPTLevel;
  title: string;
  available: boolean;
  comingSoon?: boolean;
}

