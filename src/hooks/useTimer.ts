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

  // Keep onExpire in a ref so the interval callback always calls the latest
  // version without needing to be in the effect dependency array.
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const remaining = sectionTimers[sectionId] ?? 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Stop the timer if inactive or already expired.
    if (!active) {
      clearTimer();
      return;
    }

    // If already at 0 when the effect runs, fire expire immediately.
    const initial = useExamStore.getState().sectionTimers[sectionId] ?? 0;
    if (initial <= 0) {
      onExpireRef.current?.();
      return;
    }

    // Don't create a second interval if one is already running for this section.
    if (intervalRef.current !== null) return;

    intervalRef.current = setInterval(() => {
      const current = useExamStore.getState().sectionTimers[sectionId] ?? 0;
      if (current <= 1) {
        updateSectionTimer(sectionId, 0);
        clearTimer();
        onExpireRef.current?.();
      } else {
        updateSectionTimer(sectionId, current - 1);
      }
    }, 1000);

    return clearTimer;
    // Only restart the interval when active/sectionId change — not on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, sectionId, clearTimer, updateSectionTimer]);

  return { remaining };
}
