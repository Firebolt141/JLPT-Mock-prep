'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useExamStore } from '@/src/store/examStore';

interface UseTimerOptions {
  sectionId: string;
  onExpire?: () => void;
  active?: boolean;
}

export function useTimer({ sectionId, onExpire, active = true }: UseTimerOptions) {
  const sectionTimers = useExamStore((s) => s.sectionTimers);
  const updateSectionTimer = useExamStore((s) => s.updateSectionTimer);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const remaining = sectionTimers[sectionId] ?? 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!active || remaining <= 0) {
      clearTimer();
      if (remaining <= 0 && active) {
        onExpire?.();
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const current = useExamStore.getState().sectionTimers[sectionId] ?? 0;
      if (current <= 1) {
        updateSectionTimer(sectionId, 0);
        clearTimer();
        onExpire?.();
      } else {
        updateSectionTimer(sectionId, current - 1);
      }
    }, 1000);

    return clearTimer;
  }, [active, sectionId, onExpire, clearTimer, updateSectionTimer, remaining]);

  return { remaining };
}
