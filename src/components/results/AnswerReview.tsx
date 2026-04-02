'use client';

import { useState } from 'react';
import type { ExamSet } from '@/src/types/exam';
import { QuestionCard } from '@/src/components/exam/QuestionCard';
import { cn } from '@/src/lib/utils';

interface AnswerReviewProps {
  examSet: ExamSet;
  answers: Record<string, string>;
}

export function AnswerReview({ examSet, answers }: AnswerReviewProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    examSet.sections[0]?.id ?? null
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#1B2A4A]">Answer Review</h3>

      {examSet.sections.map((section) => {
        const allQuestions = section.subsections.flatMap((s) => s.questions);
        const correctCount = allQuestions.filter(
          (q) => answers[q.id] === q.correctOptionId
        ).length;
        const isExpanded = expandedSection === section.id;

        return (
          <div
            key={section.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Section header */}
            <button
              onClick={() =>
                setExpandedSection(isExpanded ? null : section.id)
              }
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <h4 className="font-semibold text-[#1B2A4A]">{section.title}</h4>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  {correctCount} / {allQuestions.length} correct
                </p>
              </div>
              <svg
                className={cn(
                  'w-5 h-5 text-[#6B7280] transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Questions */}
            {isExpanded && (
              <div className="border-t border-gray-100 p-5 space-y-8">
                {section.subsections.map((subsection) =>
                  subsection.questions.map((question) => {
                    // Calculate global question number within section
                    const sectionQuestions = section.subsections.flatMap(
                      (s) => s.questions
                    );
                    const globalIndex = sectionQuestions.findIndex(
                      (q) => q.id === question.id
                    );

                    return (
                      <div
                        key={question.id}
                        className={cn(
                          'pb-8 border-b border-gray-100 last:border-0 last:pb-0',
                          answers[question.id] === question.correctOptionId
                            ? 'opacity-100'
                            : 'opacity-100'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                              answers[question.id] === question.correctOptionId
                                ? 'bg-[#4A7C59]/15 text-[#4A7C59]'
                                : answers[question.id] !== undefined
                                ? 'bg-[#C53D43]/15 text-[#C53D43]'
                                : 'bg-gray-100 text-[#6B7280]'
                            )}
                          >
                            {answers[question.id] === question.correctOptionId
                              ? '✓ Correct'
                              : answers[question.id] !== undefined
                              ? '✗ Incorrect'
                              : '— Skipped'}
                          </span>
                        </div>
                        <QuestionCard
                          question={question}
                          subsection={subsection}
                          questionNumber={globalIndex + 1}
                          totalQuestions={sectionQuestions.length}
                          selectedOptionId={answers[question.id]}
                          onSelect={() => {}}
                          disabled
                          reviewMode
                        />
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
