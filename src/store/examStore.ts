'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExamSet, ExamScores, ResultsHistoryEntry } from '@/src/types/exam';

interface ExamState {
  // Participant info
  participantName: string;
  email: string;

  // Exam navigation
  currentSectionIndex: number;
  currentQuestionIndex: number;

  // Answers
  answers: Record<string, string>;

  // Timers
  sectionTimers: Record<string, number>;

  // Progress
  completedSections: string[];

  // Exam status
  examStarted: boolean;
  examCompleted: boolean;

  // Loaded exam data
  examSet: ExamSet | null;

  // Final scores for current exam
  examScores: ExamScores | null;
  hasHydrated: boolean;

  // All-time results history (persisted in localStorage)
  resultsHistory: ResultsHistoryEntry[];

  // Actions
  setParticipantInfo: (name: string, email: string) => void;
  setExamSet: (examSet: ExamSet) => void;
  startExam: () => void;
  setAnswer: (questionId: string, optionId: string) => void;
  goToSection: (sectionIndex: number) => void;
  goToQuestion: (questionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeSection: (sectionId: string) => void;
  updateSectionTimer: (sectionId: string, seconds: number) => void;
  completeExam: (scores: ExamScores) => void;
  resetExam: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

const initialExamState = {
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  answers: {},
  sectionTimers: {},
  completedSections: [],
  examStarted: false,
  examCompleted: false,
  examSet: null,
  examScores: null,
  hasHydrated: false,
};

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      participantName: '',
      email: '',
      resultsHistory: [],
      ...initialExamState,

      setParticipantInfo: (name, email) =>
        set({ participantName: name, email }),

      setExamSet: (examSet) => set({ examSet }),

      startExam: () => {
        const { examSet } = get();
        if (!examSet) return;
        const timers: Record<string, number> = {};
        for (const section of examSet.sections) {
          timers[section.id] = section.timeLimitSeconds;
        }
        set({
          ...initialExamState,
          examStarted: true,
          sectionTimers: timers,
          examSet, // must re-apply — initialExamState resets examSet to null
        });
      },

      setAnswer: (questionId, optionId) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: optionId },
        })),

      goToSection: (sectionIndex) =>
        set({ currentSectionIndex: sectionIndex, currentQuestionIndex: 0 }),

      goToQuestion: (questionIndex) =>
        set({ currentQuestionIndex: questionIndex }),

      nextQuestion: () => {
        const { examSet, currentSectionIndex, currentQuestionIndex } = get();
        if (!examSet) return;
        const section = examSet.sections[currentSectionIndex];
        if (!section) return;
        const allQuestions = section.subsections.flatMap((s) => s.questions);
        if (currentQuestionIndex < allQuestions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      prevQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      completeSection: (sectionId) =>
        set((state) => ({
          completedSections: state.completedSections.includes(sectionId)
            ? state.completedSections
            : [...state.completedSections, sectionId],
        })),

      updateSectionTimer: (sectionId, seconds) =>
        set((state) => ({
          sectionTimers: { ...state.sectionTimers, [sectionId]: seconds },
        })),

      completeExam: (scores) => {
        const { participantName, email, examSet, resultsHistory } = get();
        const entry: ResultsHistoryEntry = {
          id: `${email}-${Date.now()}`,
          participantName,
          email,
          examId: examSet?.id ?? 'unknown',
          examLevel: examSet?.level ?? 'N5',
          scores,
          completedAt: new Date().toISOString(),
        };
        set({
          examCompleted: true,
          examScores: scores,
          resultsHistory: [entry, ...resultsHistory],
        });
      },

      resetExam: () =>
        set((state) => ({
          ...initialExamState,
          participantName: state.participantName,
          email: state.email,
          examSet: state.examSet,
          resultsHistory: state.resultsHistory,
          hasHydrated: state.hasHydrated,
        })),

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: 'jlpt-exam-store',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        participantName: state.participantName,
        email: state.email,
        examSet: state.examSet,
        answers: state.answers,
        sectionTimers: state.sectionTimers,
        completedSections: state.completedSections,
        examStarted: state.examStarted,
        examCompleted: state.examCompleted,
        examScores: state.examScores,
        currentSectionIndex: state.currentSectionIndex,
        currentQuestionIndex: state.currentQuestionIndex,
        resultsHistory: state.resultsHistory,
      }),
    }
  )
);
