'use client';

import type { Question } from '@/src/types/exam';
import { OptionButton } from './OptionButton';

interface SentenceCompositionProps {
  question: Question;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
}

export function SentenceComposition({
  question,
  selectedOptionId,
  onSelect,
  disabled = false,
}: SentenceCompositionProps) {
  return (
    <div className="space-y-3">
      <p className="text-base text-[#6B7280] mb-4">
        Rearrange the words to form a correct sentence.
      </p>
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <OptionButton
            key={option.id}
            optionId={option.id}
            text={option.text}
            label={String(index + 1)}
            selected={selectedOptionId === option.id}
            disabled={disabled}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
