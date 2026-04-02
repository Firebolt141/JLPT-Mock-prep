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
            <p
              className="text-base text-[#1A1A1A] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: question.questionText }}
            />
          </div>
        </div>

        <div className="text-xs text-[#6B7280] text-right mb-1">
          Question {questionNumber} of {totalQuestions}
        </div>
      </Card>

      {/* Listening audio */}
      {question.audioUrl && (
        <Card shadow="none" border className="bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#1B2A4A]/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#1B2A4A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5 6 9H3v6h3l5 4V5Zm6 3a6 6 0 0 1 0 8m-2.5-5.5a3 3 0 0 1 0 3"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#1B2A4A]">Listening Track</p>
          </div>
          <audio className="w-full" controls preload="metadata" src={question.audioUrl}>
            Your browser does not support audio playback.
          </audio>
        </Card>
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
