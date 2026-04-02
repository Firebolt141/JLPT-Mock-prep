'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '@/src/store/examStore';
import { useExamNavigation } from '@/src/hooks/useExamNavigation';
import { calculateScores } from '@/src/lib/scoring';
import { QuestionCard } from '@/src/components/exam/QuestionCard';
import { QuestionNavigator } from '@/src/components/exam/QuestionNavigator';
import { SectionTimer } from '@/src/components/exam/SectionTimer';
import { SectionTransition } from '@/src/components/exam/SectionTransition';
import { Button } from '@/src/components/ui/Button';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { cn } from '@/src/lib/utils';

type ExamPhase = 'section-intro' | 'question' | 'submitting';

export default function ExamPage() {
  const router = useRouter();
  const examStarted = useExamStore((s) => s.examStarted);
  const examCompleted = useExamStore((s) => s.examCompleted);
  const participantName = useExamStore((s) => s.participantName);
  const answers = useExamStore((s) => s.answers);
  const setAnswer = useExamStore((s) => s.setAnswer);
  const completeSection = useExamStore((s) => s.completeSection);
  const completeExam = useExamStore((s) => s.completeExam);
  const examSet = useExamStore((s) => s.examSet);

  const nav = useExamNavigation();
  const [phase, setPhase] = useState<ExamPhase>('section-intro');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Redirect if not registered / exam not started
  useEffect(() => {
    if (!examStarted || !participantName || !examSet) {
      router.replace('/');
    }
  }, [examStarted, participantName, examSet, router]);

  // Redirect if already completed
  useEffect(() => {
    if (examCompleted) {
      router.replace('/results');
    }
  }, [examCompleted, router]);

  if (!examStarted || !participantName || !examSet) {
    return null;
  }

  const currentSection = nav.currentSection;
  if (!currentSection) return null;

  const allQuestions = nav.allQuestionsInSection;
  const currentQuestion = nav.currentQuestion;
  const currentSubsection = currentQuestion
    ? currentSection.subsections.find((s) =>
        s.questions.some((q) => q.id === currentQuestion.id)
      ) ?? currentSection.subsections[0]
    : currentSection.subsections[0];

  const handleTimerExpire = () => {
    if (currentSection) {
      completeSection(currentSection.id);
      if (nav.isLastSection) {
        handleSubmitExam();
      } else {
        nav.goToSection(nav.currentSectionIndex + 1);
        setPhase('section-intro');
      }
    }
  };

  const handleSectionContinue = () => {
    setPhase('question');
  };

  const handleNextQuestion = () => {
    if (nav.isLastQuestion) {
      if (nav.isLastSection) {
        setShowSubmitConfirm(true);
      } else {
        completeSection(currentSection.id);
        nav.goToSection(nav.currentSectionIndex + 1);
        setPhase('section-intro');
      }
    } else {
      nav.nextQuestion();
    }
  };

  const handlePrevQuestion = () => {
    // Prev only navigates within the current section.
    // Use the section tabs to jump to a completed section.
    if (nav.isFirstQuestion) return;
    nav.prevQuestion();
  };

  const handleSubmitExam = () => {
    if (!examSet) return;
    setPhase('submitting');
    const scores = calculateScores(examSet, answers);
    completeExam(scores);
    router.push('/results');
  };

  const answeredCount = nav.getTotalAnswered();
  const totalCount = nav.getTotalQuestions();
  const progressPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  // Section intro screen
  if (phase === 'section-intro') {
    return (
      <AnimatePresence mode="wait">
        <SectionTransition
          key={currentSection.id}
          section={currentSection}
          sectionNumber={nav.currentSectionIndex + 1}
          totalSections={nav.totalSections}
          onContinue={handleSectionContinue}
          isLastSection={nav.isLastSection}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
          {/* Section title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Section {nav.currentSectionIndex + 1}/{nav.totalSections}
              </span>
              <span className="text-gray-200">·</span>
              <span className="text-sm font-medium text-[#1B2A4A] truncate">
                {currentSection.title}
              </span>
            </div>
            <div className="mt-1">
              <ProgressBar
                value={progressPercent}
                max={100}
                size="sm"
                color="primary"
              />
            </div>
          </div>

          {/* Timer */}
          <SectionTimer
            sectionId={currentSection.id}
            onExpire={handleTimerExpire}
            active={phase === 'question'}
          />

          {/* Question count */}
          <div className="text-sm text-[#6B7280] whitespace-nowrap">
            <span className="font-semibold text-[#1B2A4A]">
              {nav.currentQuestionIndex + 1}
            </span>
            <span> / {nav.totalQuestionsInSection}</span>
          </div>
        </div>

        {/* Section tabs */}
        <div className="max-w-7xl mx-auto px-6 pb-2 flex gap-1">
          {examSet.sections.map((section, index) => {
            const isCompleted = nav.completedSections.includes(section.id);
            const isCurrent = index === nav.currentSectionIndex;
            const isFuture = index > nav.currentSectionIndex && !isCompleted;
            return (
              <button
                key={section.id}
                onClick={() => {
                  if (isCurrent || isFuture) return;
                  nav.goToSection(index);
                  setPhase('question');
                }}
                disabled={isFuture}
                className={cn(
                  'px-3 py-1 text-xs rounded-full font-medium transition-colors',
                  isCurrent && 'bg-[#1B2A4A] text-white',
                  isCompleted && !isCurrent && 'bg-[#4A7C59]/15 text-[#4A7C59] hover:bg-[#4A7C59]/25 cursor-pointer',
                  isFuture && 'bg-gray-100 text-[#6B7280] cursor-default opacity-50'
                )}
              >
                {index + 1}. {section.title}
                {isCompleted && !isCurrent && ' ✓'}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex gap-6">
        {/* Question area */}
        <div className="flex-1 min-w-0">
          {allQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-[#6B7280] text-lg mb-2">No questions available</p>
              <p className="text-sm text-[#6B7280]">
                Exam content for this section is being prepared.
              </p>
            </div>
          ) : currentQuestion && currentSubsection ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <QuestionCard
                  question={currentQuestion}
                  subsection={currentSubsection}
                  questionNumber={nav.currentQuestionIndex + 1}
                  totalQuestions={nav.totalQuestionsInSection}
                  selectedOptionId={answers[currentQuestion.id]}
                  onSelect={(optionId) => setAnswer(currentQuestion.id, optionId)}
                />
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>

        {/* Right panel: Question navigator */}
        <QuestionNavigator
          questions={allQuestions}
          currentIndex={nav.currentQuestionIndex}
          answers={answers}
          onNavigate={nav.goToQuestion}
        />
      </div>

      {/* Bottom bar */}
      <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Progress info */}
          <div className="text-sm text-[#6B7280]">
            <span className="font-semibold text-[#1B2A4A]">{answeredCount}</span>
            <span> of {totalCount} answered</span>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrevQuestion}
              disabled={nav.isFirstQuestion}
            >
              ← Previous
            </Button>

            {nav.isLastQuestion ? (
              nav.isLastSection ? (
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => setShowSubmitConfirm(true)}
                >
                  Submit Exam
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNextQuestion}
                >
                  Next Section →
                </Button>
              )
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleNextQuestion}
              >
                Next →
              </Button>
            )}
          </div>
        </div>
      </footer>

      {/* Submit confirmation modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
            >
              <h2 className="text-xl font-bold text-[#1B2A4A] mb-2">
                Submit Exam?
              </h2>
              <p className="text-[#6B7280] mb-2">
                You have answered{' '}
                <span className="font-semibold text-[#1B2A4A]">{answeredCount}</span>{' '}
                of{' '}
                <span className="font-semibold text-[#1B2A4A]">{totalCount}</span>{' '}
                questions.
              </p>
              {answeredCount < totalCount && (
                <p className="text-sm text-[#D4A017] bg-[#D4A017]/10 rounded-lg px-3 py-2 mb-4">
                  Warning: {totalCount - answeredCount} question(s) are unanswered.
                </p>
              )}
              <p className="text-sm text-[#6B7280] mb-6">
                Once submitted, you cannot change your answers.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setShowSubmitConfirm(false)}
                >
                  Continue Exam
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  fullWidth
                  onClick={handleSubmitExam}
                >
                  Submit Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
