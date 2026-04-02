'use client';

import type { ReadingPassage as ReadingPassageType } from '@/src/types/exam';
import { Card } from '@/src/components/ui/Card';

interface ReadingPassageProps {
  passage: ReadingPassageType;
}

export function ReadingPassage({ passage }: ReadingPassageProps) {
  return (
    <Card className="mb-6" shadow="sm">
      {passage.title && (
        <h3 className="text-sm font-semibold text-[#1B2A4A] mb-3 pb-2 border-b border-gray-100">
          {passage.title}
        </h3>
      )}
      <div className="prose prose-sm max-w-none">
        <p className="text-[#1A1A1A] leading-loose text-base whitespace-pre-line">
          {passage.text}
        </p>
      </div>
    </Card>
  );
}
