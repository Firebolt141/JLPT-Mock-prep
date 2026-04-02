'use client';

import { useExamStore } from '@/src/store/examStore';
import type { Question, Section } from '@/src/types/exam';

export function useExamNavigation() {
  const examSet = useExamStore((s) => s.examSet);
  const currentSectionIndex = useExamStore((s) => s.currentSectionIndex);
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex);
  const answers = useExamStore((s) => s.answers);
  const completedSections = useExamStore((s) => s.completedSections);
  const goToSection = useExamStore((s) => s.goToSection);
  const goToQuestion = useExamStore((s) => s.goToQuestion);
  const nextQuestion = useExamStore((s) => s.nextQuestion);
  const prevQuestion = useExamStore((s) => s.prevQuestion);

  const currentSection: Section | null = examSet?.sections[currentSectionIndex] ?? null;

  const allQuestionsInSection: Question[] =
    currentSection?.subsections.flatMap((s) => s.questions) ?? [];

  const currentQuestion: Question | null =
    allQuestionsInSection[currentQuestionIndex] ?? null;

  const totalSections = examSet?.sections.length ?? 0;
  const totalQuestionsInSection = allQuestionsInSection.length;

  // Scoped to the current section so Prev/Next stay within section bounds.
  const isFirstQuestion = currentQuestionIndex === 0;

  const isLastQuestion = currentQuestionIndex === totalQuestionsInSection - 1;

  const isLastSection = currentSectionIndex === totalSections - 1;

  const answeredInSection = allQuestionsInSection.filter(
    (q) => answers[q.id] !== undefined
  ).length;

  const getQuestionStatus = (questionId: string): 'answered' | 'current' | 'unanswered' => {
    if (currentQuestion?.id === questionId) return 'current';
    if (answers[questionId] !== undefined) return 'answered';
    return 'unanswered';
  };

  const getTotalAnswered = () => {
    if (!examSet) return 0;
    return examSet.sections
      .flatMap((s) => s.subsections)
      .flatMap((ss) => ss.questions)
      .filter((q) => answers[q.id] !== undefined).length;
  };

  const getTotalQuestions = () => {
    if (!examSet) return 0;
    return examSet.sections
      .flatMap((s) => s.subsections)
      .flatMap((ss) => ss.questions).length;
  };

  return {
    currentSection,
    currentQuestion,
    currentSectionIndex,
    currentQuestionIndex,
    allQuestionsInSection,
    totalSections,
    totalQuestionsInSection,
    isFirstQuestion,
    isLastQuestion,
    isLastSection,
    answeredInSection,
    completedSections,
    goToSection,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    getQuestionStatus,
    getTotalAnswered,
    getTotalQuestions,
  };
}
