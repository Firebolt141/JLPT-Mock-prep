'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExamSet, ExamScores } from '@/src/types/exam';

interface ExamState {
  // Participant info
  participantName: string;
  teamName: string;

  // Exam navigation
  currentSectionIndex: number;
  currentQuestionIndex: number;

  // Answers
  answers: Record<string, string>; // questionId → optionId

  // Timers
  sectionTimers: Record<string, number>; // sectionId → remaining seconds

  // Progress
  completedSections: string[];

  // Exam status
  examStarted: boolean;
  examCompleted: boolean;

  // Loaded exam data
  examSet: ExamSet | null;

  // Final scores
  examScores: ExamScores | null;
  hasHydrated: boolean;

  // Actions
  setParticipantInfo: (name: string, team: string) => void;
  setExamSet: (examSet: ExamSet) => void;
  startExam: () => void;
  setAnswer: (questionId: string, optionId: string) => void;
  goToSection: (sectionIndex: number) => void;
  goToQuestion: (questionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeSection: (sectionId: string) => void;
  updateSectionTimer: (sectionId: string, seconds: number) => void;
  initializeSectionTimers: () => void;
  completeExam: (scores: ExamScores) => void;
  resetExam: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

const initialState = {
  participantName: '',
  teamName: '',
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
      ...initialState,

      setParticipantInfo: (name, team) =>
        set({ participantName: name, teamName: team }),

      setExamSet: (examSet) => set({ examSet }),

      startExam: () => {
        const { examSet } = get();
        if (!examSet) return;
        const timers: Record<string, number> = {};
        for (const section of examSet.sections) {
          timers[section.id] = section.timeLimitSeconds;
        }
        set({
          examStarted: true,
          examCompleted: false,
          currentSectionIndex: 0,
          currentQuestionIndex: 0,
          answers: {},
          completedSections: [],
          sectionTimers: timers,
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
        } else if (currentSectionIndex < examSet.sections.length - 1) {
          set({
            currentSectionIndex: currentSectionIndex + 1,
            currentQuestionIndex: 0,
          });
        }
      },

      prevQuestion: () => {
        const { examSet, currentSectionIndex, currentQuestionIndex } = get();
        if (!examSet) return;

        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        } else if (currentSectionIndex > 0) {
          const prevSection = examSet.sections[currentSectionIndex - 1];
          const prevQuestions = prevSection.subsections.flatMap((s) => s.questions);
          set({
            currentSectionIndex: currentSectionIndex - 1,
            currentQuestionIndex: Math.max(0, prevQuestions.length - 1),
          });
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

      initializeSectionTimers: () => {
        const { examSet } = get();
        if (!examSet) return;
        const timers: Record<string, number> = {};
        for (const section of examSet.sections) {
          timers[section.id] = section.timeLimitSeconds;
        }
        set({ sectionTimers: timers });
      },

      completeExam: (scores) =>
        set({ examCompleted: true, examScores: scores }),

      resetExam: () => set(initialState),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: 'jlpt-exam-store',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        participantName: state.participantName,
        teamName: state.teamName,
        examSet: state.examSet,
        answers: state.answers,
        sectionTimers: state.sectionTimers,
        completedSections: state.completedSections,
        examStarted: state.examStarted,
        examCompleted: state.examCompleted,
        examScores: state.examScores,
        currentSectionIndex: state.currentSectionIndex,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    }
  )
);
