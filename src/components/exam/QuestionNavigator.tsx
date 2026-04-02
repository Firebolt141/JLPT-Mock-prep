'use client';

import { cn } from '@/src/lib/utils';
import type { Question } from '@/src/types/exam';

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  onNavigate: (index: number) => void;
}

export function QuestionNavigator({
  questions,
  currentIndex,
  answers,
  onNavigate,
}: QuestionNavigatorProps) {
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;

  return (
    <div className="w-56 flex-shrink-0">
      <div className="sticky top-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-[#1B2A4A] mb-3">
            Questions
          </h3>

          {/* Progress summary */}
          <div className="text-xs text-[#6B7280] mb-3">
            {answeredCount} / {questions.length} answered
          </div>

          {/* Question grid */}
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {questions.map((question, index) => {
              const isAnswered = answers[question.id] !== undefined;
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={question.id}
                  onClick={() => onNavigate(index)}
                  className={cn(
                    'w-full aspect-square rounded-md text-xs font-medium transition-all duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A]',
                    isCurrent &&
                      'bg-[#1B2A4A] text-white ring-2 ring-[#1B2A4A] ring-offset-1',
                    !isCurrent && isAnswered &&
                      'bg-[#4A7C59]/20 text-[#4A7C59] border border-[#4A7C59]/40',
                    !isCurrent && !isAnswered &&
                      'bg-gray-50 text-[#6B7280] border border-gray-200 hover:border-[#1B2A4A]/40'
                  )}
                  aria-label={`Question ${index + 1}${isAnswered ? ' (answered)' : ''}`}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="space-y-1.5 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#1B2A4A]" />
              <span className="text-xs text-[#6B7280]">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#4A7C59]/20 border border-[#4A7C59]/40" />
              <span className="text-xs text-[#6B7280]">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200" />
              <span className="text-xs text-[#6B7280]">Unanswered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
