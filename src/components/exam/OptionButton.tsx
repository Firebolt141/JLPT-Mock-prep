'use client';

import { cn } from '@/src/lib/utils';

interface OptionButtonProps {
  optionId: string;
  text: string;
  label: string; // e.g. "1", "2", "3", "4"
  selected: boolean;
  correct?: boolean; // shown during review
  incorrect?: boolean; // shown during review
  disabled?: boolean;
  onClick: (optionId: string) => void;
}

export function OptionButton({
  optionId,
  text,
  label,
  selected,
  correct,
  incorrect,
  disabled = false,
  onClick,
}: OptionButtonProps) {
  const isReviewMode = correct !== undefined || incorrect !== undefined;

  return (
    <button
      onClick={() => !disabled && onClick(optionId)}
      disabled={disabled}
      className={cn(
        'w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-2',
        !isReviewMode && !selected && !disabled &&
          'border-gray-200 bg-white hover:border-[#1B2A4A]/40 hover:bg-[#1B2A4A]/5',
        !isReviewMode && selected &&
          'border-[#1B2A4A] bg-[#1B2A4A]/5',
        isReviewMode && correct &&
          'border-[#4A7C59] bg-[#4A7C59]/10',
        isReviewMode && incorrect && selected &&
          'border-[#C53D43] bg-[#C53D43]/10',
        isReviewMode && !correct && !incorrect &&
          'border-gray-200 bg-white opacity-60',
        disabled && 'cursor-default',
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 mt-0.5',
          !isReviewMode && !selected &&
            'border-gray-300 text-[#6B7280]',
          !isReviewMode && selected &&
            'border-[#1B2A4A] bg-[#1B2A4A] text-white',
          isReviewMode && correct &&
            'border-[#4A7C59] bg-[#4A7C59] text-white',
          isReviewMode && incorrect && selected &&
            'border-[#C53D43] bg-[#C53D43] text-white',
          isReviewMode && !correct && !incorrect &&
            'border-gray-300 text-[#6B7280]',
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'text-base leading-relaxed',
          selected && !isReviewMode && 'text-[#1B2A4A] font-medium',
          isReviewMode && correct && 'text-[#4A7C59] font-medium',
          isReviewMode && incorrect && selected && 'text-[#C53D43] font-medium',
          (!selected || (isReviewMode && !correct && !incorrect)) && 'text-[#1A1A1A]',
        )}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </button>
  );
}
