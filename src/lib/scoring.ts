import type { ExamSet, ExamScores, SectionScore } from '@/src/types/exam';

/**
 * JLPT N5 Scoring:
 * - LK+R Score = (correct in sections 1+2) / (total in sections 1+2) × 120
 * - Listening Score = (correct in section 3) / (total in section 3) × 60
 * - Total = LK+R + Listening (out of 180)
 * - Pass: Total ≥ 80 AND LK+R ≥ 38 AND Listening ≥ 19
 */
export function calculateScores(
  examSet: ExamSet,
  answers: Record<string, string>
): ExamScores {
  const sectionScores: SectionScore[] = [];

  for (const section of examSet.sections) {
    let correct = 0;
    let total = 0;

    for (const subsection of section.subsections) {
      for (const question of subsection.questions) {
        total++;
        if (answers[question.id] === question.correctOptionId) {
          correct++;
        }
      }
    }

    sectionScores.push({
      sectionId: section.id,
      sectionTitle: section.title,
      correct,
      total,
      rawScore: correct,
      scaledScore: 0, // will be set below
    });
  }

  // Sections 0 and 1 (index) = Language Knowledge + Reading
  // Section 2 (index) = Listening
  const lkrSections = sectionScores.slice(0, 2);
  const listeningSections = sectionScores.slice(2);

  const lkrCorrect = lkrSections.reduce((sum, s) => sum + s.correct, 0);
  const lkrTotal = lkrSections.reduce((sum, s) => sum + s.total, 0);

  const listeningCorrect = listeningSections.reduce((sum, s) => sum + s.correct, 0);
  const listeningTotal = listeningSections.reduce((sum, s) => sum + s.total, 0);

  const lkrScore = lkrTotal > 0
    ? Math.round((lkrCorrect / lkrTotal) * 120)
    : 0;

  const listeningScore = listeningTotal > 0
    ? Math.round((listeningCorrect / listeningTotal) * 60)
    : 0;

  const totalScore = lkrScore + listeningScore;
  const passed = totalScore >= 80 && lkrScore >= 38 && listeningScore >= 19;

  // Update scaled scores on section score records
  lkrSections.forEach((s) => {
    s.scaledScore = s.total > 0
      ? Math.round((s.correct / s.total) * (120 / lkrSections.length))
      : 0;
  });
  listeningSections.forEach((s) => {
    s.scaledScore = s.total > 0
      ? Math.round((s.correct / s.total) * (60 / listeningSections.length))
      : 0;
  });

  return {
    lkrScore,
    listeningScore,
    totalScore,
    passed,
    sectionScores,
  };
}

export function getPassThresholds() {
  return {
    total: 80,
    lkr: 38,
    listening: 19,
    maxTotal: 180,
    maxLkr: 120,
    maxListening: 60,
  };
}
