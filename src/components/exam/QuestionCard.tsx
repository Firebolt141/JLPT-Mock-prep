'use client';

import type { Question, Subsection } from '@/src/types/exam';
import { OptionButton } from './OptionButton';
import { SentenceComposition } from './SentenceComposition';
import { ReadingPassage } from './ReadingPassage';
import { Card } from '@/src/components/ui/Card';

interface QuestionCardProps {
  question: Question;
  subsection: Subsection;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
  reviewMode?: boolean;
}

export function QuestionCard({
  question,
  subsection,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelect,
  disabled = false,
  reviewMode = false,
}: QuestionCardProps) {
  // Find the passage if this question references one
  const passage = question.passageRef
    ? subsection.passages?.find((p) => p.id === question.passageRef)
    : null;

  const isSentenceComposition = question.type === 'sentence-composition';

  return (
    <div className="space-y-4">
      {/* Subsection instructions */}
      <div className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">
        {subsection.title}
      </div>

      {/* Passage (for reading comprehension) */}
      {passage && <ReadingPassage passage={passage} />}

      {/* Question */}
      <Card shadow="none" border className="bg-[#FAF8F5]">
        <div className="flex items-start gap-3 mb-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-sm font-bold">
            {questionNumber}
          </span>
          <div className="flex-1">
            <p className="text-base text-[#1A1A1A] leading-relaxed">
              {question.questionText}
            </p>
          </div>
        </div>

        <div className="text-xs text-[#6B7280] text-right mb-1">
          Question {questionNumber} of {totalQuestions}
        </div>
      </Card>

      {/* Listening placeholder */}
      {question.type === 'listening-comprehension' && (
        <div className="flex items-center gap-3 p-4 bg-[#1B2A4A]/5 rounded-xl border border-[#1B2A4A]/20">
          <svg
            className="w-8 h-8 text-[#1B2A4A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.536 8.464a5 5 0 010 7.072M12 18.364A9 9 0 003.636 10m.707-.707a8 8 0 0111.314 0M12 12v.01"
            />
          </svg>
          <p className="text-sm text-[#6B7280]">
            Audio playback will be available when listening content is loaded.
          </p>
        </div>
      )}

      {/* Options */}
      {isSentenceComposition ? (
        <SentenceComposition
          question={question}
          selectedOptionId={selectedOptionId}
          onSelect={onSelect}
          disabled={disabled}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => {
            const isCorrect = reviewMode && option.id === question.correctOptionId;
            const isIncorrect =
              reviewMode &&
              selectedOptionId === option.id &&
              option.id !== question.correctOptionId;

            return (
              <OptionButton
                key={option.id}
                optionId={option.id}
                text={option.text}
                label={String(index + 1)}
                selected={selectedOptionId === option.id}
                correct={reviewMode ? isCorrect : undefined}
                incorrect={reviewMode ? isIncorrect : undefined}
                disabled={disabled || reviewMode}
                onClick={onSelect}
              />
            );
          })}
        </div>
      )}

      {/* Explanation (review mode only) */}
      {reviewMode && question.explanation && (
        <div className="p-4 bg-[#4A7C59]/10 rounded-xl border border-[#4A7C59]/30">
          <p className="text-sm font-semibold text-[#4A7C59] mb-1">Explanation</p>
          <p className="text-sm text-[#1A1A1A]">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
