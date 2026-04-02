'use client';

import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';
import type { Section } from '@/src/types/exam';
import { formatTime } from '@/src/lib/utils';

interface SectionTransitionProps {
  section: Section;
  sectionNumber: number;
  totalSections: number;
  onContinue: () => void;
  isLastSection?: boolean;
}

const sectionTypeLabels: Record<string, string> = {
  vocabulary: '文字・語彙',
  grammar: '文法・読解',
  reading: '読解',
  listening: '聴解',
};

export function SectionTransition({
  section,
  sectionNumber,
  totalSections,
  onContinue,
  isLastSection = false,
}: SectionTransitionProps) {
  const totalQuestions = section.subsections
    .flatMap((s) => s.questions)
    .length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8"
    >
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Section badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B2A4A]/10 rounded-full">
          <span className="text-sm font-medium text-[#1B2A4A]">
            Section {sectionNumber} of {totalSections}
          </span>
        </div>

        {/* Section type */}
        <div>
          <p className="text-sm text-[#6B7280] mb-2">
            {sectionTypeLabels[section.type] ?? section.type}
          </p>
          <h2 className="text-3xl font-bold text-[#1B2A4A]">{section.title}</h2>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-2xl font-bold text-[#1B2A4A]">{totalQuestions}</p>
            <p className="text-sm text-[#6B7280] mt-1">Questions</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-2xl font-bold text-[#1B2A4A]">
              {formatTime(section.timeLimitSeconds)}
            </p>
            <p className="text-sm text-[#6B7280] mt-1">Time Limit</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#1B2A4A]/5 rounded-xl p-4 text-left">
          <p className="text-sm font-semibold text-[#1B2A4A] mb-2">Instructions</p>
          <ul className="space-y-1.5">
            {section.subsections.map((sub) => (
              <li key={sub.id} className="text-sm text-[#6B7280] flex gap-2">
                <span className="text-[#1B2A4A]">•</span>
                <span>{sub.instructions}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onContinue}
          fullWidth
        >
          {isLastSection ? 'Start Final Section' : 'Begin Section'}
        </Button>
      </div>
    </motion.div>
  );
}
