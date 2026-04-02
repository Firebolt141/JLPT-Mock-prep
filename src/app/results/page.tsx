'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useExamStore } from '@/src/store/examStore';
import { ScoreCard } from '@/src/components/results/ScoreCard';
import { AnswerReview } from '@/src/components/results/AnswerReview';
import { Button } from '@/src/components/ui/Button';
import { Logo } from '@/src/components/ui/Logo';

export default function ResultsPage() {
  const router = useRouter();
  const examCompleted = useExamStore((s) => s.examCompleted);
  const examScores = useExamStore((s) => s.examScores);
  const participantName = useExamStore((s) => s.participantName);
  const examSet = useExamStore((s) => s.examSet);
  const answers = useExamStore((s) => s.answers);
  const resetExam = useExamStore((s) => s.resetExam);

  useEffect(() => {
    if (!examCompleted || !examScores || !participantName || !examSet) {
      router.replace('/');
    }
  }, [examCompleted, examScores, participantName, examSet, router]);

  if (!examCompleted || !examScores || !participantName || !examSet) {
    return null;
  }

  const handleRetake = () => {
    resetExam();
    router.push('/register');
  };

  const handleBackHome = () => {
    resetExam();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div className="leading-tight">
              <p className="text-xs font-semibold text-[#1B2A4A] leading-none">SAP Nihongo Community</p>
              <p className="text-xs text-[#6B7280]">JLPT Mock Exam</p>
            </div>
          </div>
          <span className="text-sm text-[#6B7280]">Exam Results</span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          {/* Score card */}
          <ScoreCard
            scores={examScores}
            participantName={participantName}
            examTitle={examSet.title}
          />

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBackHome}
            >
              ← Back to Home
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleRetake}
            >
              Retake Exam →
            </Button>
          </div>

          {/* Answer review */}
          <div className="border-t border-gray-200 pt-12">
            <AnswerReview examSet={examSet} answers={answers} />
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-center gap-4 pb-8">
            <Button
              variant="ghost"
              size="md"
              onClick={handleBackHome}
            >
              ← Home
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleRetake}
            >
              Retake Exam
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
