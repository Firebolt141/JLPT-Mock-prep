'use client';

import { useTimer } from '@/src/hooks/useTimer';
import { formatTime } from '@/src/lib/utils';
import { cn } from '@/src/lib/utils';

interface SectionTimerProps {
  sectionId: string;
  onExpire?: () => void;
  active?: boolean;
  compact?: boolean;
}

export function SectionTimer({
  sectionId,
  onExpire,
  active = true,
  compact = false,
}: SectionTimerProps) {
  const { remaining } = useTimer({ sectionId, onExpire, active });

  const isWarning = remaining <= 300 && remaining > 60; // last 5 minutes
  const isDanger = remaining <= 60; // last 1 minute

  if (compact) {
    return (
      <span
        className={cn(
          'font-mono font-semibold tabular-nums',
          isDanger && 'text-[#C53D43] animate-pulse',
          isWarning && !isDanger && 'text-[#D4A017]',
          !isWarning && !isDanger && 'text-[#1B2A4A]'
        )}
      >
        {formatTime(remaining)}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg border',
        isDanger && 'bg-[#C53D43]/10 border-[#C53D43]/30 text-[#C53D43]',
        isWarning && !isDanger && 'bg-[#D4A017]/10 border-[#D4A017]/30 text-[#D4A017]',
        !isWarning && !isDanger && 'bg-[#1B2A4A]/5 border-[#1B2A4A]/20 text-[#1B2A4A]'
      )}
    >
      <svg
        className={cn('w-4 h-4', isDanger && 'animate-pulse')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="font-mono font-semibold tabular-nums text-sm">
        {formatTime(remaining)}
      </span>
    </div>
  );
}
