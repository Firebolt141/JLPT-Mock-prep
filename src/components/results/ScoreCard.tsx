'use client';

import { motion } from 'framer-motion';
import type { ExamScores } from '@/src/types/exam';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { getPassThresholds } from '@/src/lib/scoring';
import { cn } from '@/src/lib/utils';

interface ScoreCardProps {
  scores: ExamScores;
  participantName: string;
  examTitle: string;
}

export function ScoreCard({ scores, participantName, examTitle }: ScoreCardProps) {
  const thresholds = getPassThresholds();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-[#6B7280]">Results for</p>
        <h2 className="text-2xl font-bold text-[#1B2A4A]">{participantName}</h2>
        <p className="text-sm text-[#6B7280]">{examTitle}</p>
      </div>

      {/* Pass/Fail badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="flex justify-center"
      >
        <div
          className={cn(
            'inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-xl font-bold',
            scores.passed
              ? 'bg-[#4A7C59]/15 text-[#4A7C59] border-2 border-[#4A7C59]/40'
              : 'bg-[#C53D43]/15 text-[#C53D43] border-2 border-[#C53D43]/40'
          )}
        >
          {scores.passed ? (
            <>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              合格 / PASS
            </>
          ) : (
            <>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              不合格 / FAIL
            </>
          )}
        </div>
      </motion.div>

      {/* Total score */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 text-center">
        <p className="text-sm text-[#6B7280] mb-1">Total Score</p>
        <div className="flex items-end justify-center gap-2">
          <span className="text-6xl font-bold text-[#1B2A4A]">
            {scores.totalScore}
          </span>
          <span className="text-2xl text-[#6B7280] mb-2">/ {thresholds.maxTotal}</span>
        </div>
        <p className="text-xs text-[#6B7280] mt-2">
          Passing score: {thresholds.total} points
        </p>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {/* LK+R */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">
                Language Knowledge + Reading
              </p>
              <p className="text-xs text-[#6B7280]">言語知識・読解</p>
            </div>
            <span
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded-full',
                scores.lkrScore >= thresholds.lkr
                  ? 'bg-[#4A7C59]/15 text-[#4A7C59]'
                  : 'bg-[#C53D43]/15 text-[#C53D43]'
              )}
            >
              {scores.lkrScore >= thresholds.lkr ? 'PASS' : 'FAIL'}
            </span>
          </div>
          <div className="flex items-end gap-1 mb-3">
            <span className="text-3xl font-bold text-[#1B2A4A]">
              {scores.lkrScore}
            </span>
            <span className="text-[#6B7280] mb-1">/ {thresholds.maxLkr}</span>
          </div>
          <ProgressBar
            value={scores.lkrScore}
            max={thresholds.maxLkr}
            color={scores.lkrScore >= thresholds.lkr ? 'success' : 'accent'}
            size="sm"
          />
          <p className="text-xs text-[#6B7280] mt-1">Min: {thresholds.lkr}</p>
        </div>

        {/* Listening */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">
                Listening
              </p>
              <p className="text-xs text-[#6B7280]">聴解</p>
            </div>
            <span
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded-full',
                scores.listeningScore >= thresholds.listening
                  ? 'bg-[#4A7C59]/15 text-[#4A7C59]'
                  : 'bg-[#C53D43]/15 text-[#C53D43]'
              )}
            >
              {scores.listeningScore >= thresholds.listening ? 'PASS' : 'FAIL'}
            </span>
          </div>
          <div className="flex items-end gap-1 mb-3">
            <span className="text-3xl font-bold text-[#1B2A4A]">
              {scores.listeningScore}
            </span>
            <span className="text-[#6B7280] mb-1">/ {thresholds.maxListening}</span>
          </div>
          <ProgressBar
            value={scores.listeningScore}
            max={thresholds.maxListening}
            color={scores.listeningScore >= thresholds.listening ? 'success' : 'accent'}
            size="sm"
          />
          <p className="text-xs text-[#6B7280] mt-1">Min: {thresholds.listening}</p>
        </div>
      </div>

      {/* Per-section breakdown */}
      {scores.sectionScores.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#1B2A4A] mb-4">
            Section Breakdown
          </h3>
          <div className="space-y-4">
            {scores.sectionScores.map((section) => (
              <div key={section.sectionId}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-[#1A1A1A]">{section.sectionTitle}</span>
                  <span className="text-sm font-medium text-[#1B2A4A]">
                    {section.correct} / {section.total}
                  </span>
                </div>
                <ProgressBar
                  value={section.correct}
                  max={section.total || 1}
                  size="sm"
                  color="primary"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
