'use client';

import { cn } from '@/src/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'accent' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const colorStyles = {
  primary: 'bg-[#1B2A4A]',
  accent: 'bg-[#C53D43]',
  success: 'bg-[#4A7C59]',
  warning: 'bg-[#D4A017]',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  color = 'primary',
  size = 'md',
  className,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-[#1A1A1A]">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-[#6B7280]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-gray-100 rounded-full overflow-hidden',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full rounded-full',
            colorStyles[color],
            animated && 'transition-all duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
