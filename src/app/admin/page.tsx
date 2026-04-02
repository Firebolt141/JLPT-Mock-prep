'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useExamStore } from '@/src/store/examStore';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

const ADMIN_PIN = '0000';

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const attempts = useExamStore((s) => s.attemptHistory);
  const clearAttemptHistory = useExamStore((s) => s.clearAttemptHistory);

  const [pin, setPin] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');

  const stats = useMemo(() => {
    const total = attempts.length;
    const passed = attempts.filter((a) => a.scores.passed).length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const avgTotal = total > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.scores.totalScore, 0) / total)
      : 0;
    const avgLkr = total > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.scores.lkrScore, 0) / total)
      : 0;
    const avgListening = total > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.scores.listeningScore, 0) / total)
      : 0;

    const sectionMap = new Map<string, { totalScaled: number; count: number }>();
    for (const attempt of attempts) {
      for (const section of attempt.scores.sectionScores) {
        const current = sectionMap.get(section.sectionTitle) ?? { totalScaled: 0, count: 0 };
        current.totalScaled += section.scaledScore;
        current.count += 1;
        sectionMap.set(section.sectionTitle, current);
      }
    }

    const sectionAverages = Array.from(sectionMap.entries()).map(([title, value]) => ({
      title,
      avgScaled: value.count > 0 ? Math.round(value.totalScaled / value.count) : 0,
    }));

    return { total, passed, passRate, avgTotal, avgLkr, avgListening, sectionAverages };
  }, [attempts]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthorized(true);
      setError('');
      return;
    }
    setError('Invalid PIN.');
  };

  const exportJson = () => {
    downloadFile(
      `exam-attempts-${new Date().toISOString()}.json`,
      JSON.stringify(attempts, null, 2),
      'application/json'
    );
  };

  const exportCsv = () => {
    const headers = [
      'completedAt',
      'participantName',
      'teamName',
      'examId',
      'examLevel',
      'totalScore',
      'lkrScore',
      'listeningScore',
      'passed',
    ];

    const rows = attempts.map((a) => {
      const teamName = (a as { teamName?: string }).teamName ?? '';
      return ([
      a.completedAt,
      a.participantName,
      teamName,
      a.examId,
      a.examLevel,
      String(a.scores.totalScore),
      String(a.scores.lkrScore),
      String(a.scores.listeningScore),
      a.scores.passed ? 'PASS' : 'FAIL',
      ]);
    });

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    downloadFile(
      `exam-attempts-${new Date().toISOString()}.csv`,
      csv,
      'text/csv;charset=utf-8'
    );
  };

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
        <Card className="w-full max-w-md" shadow="md" padding="lg">
          <h1 className="text-2xl font-bold text-[#1B2A4A] mb-2">Admin Access</h1>
          <p className="text-sm text-[#6B7280] mb-6">Enter 4-digit PIN to continue.</p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              inputMode="numeric"
              maxLength={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="0000"
            />
            {error && <p className="text-sm text-[#C53D43]">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" variant="primary" fullWidth>Unlock</Button>
              <Link href="/" className="w-full">
                <Button type="button" variant="secondary" fullWidth>Back</Button>
              </Link>
            </div>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1B2A4A]">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={exportJson}>Export JSON</Button>
            <Button variant="secondary" onClick={exportCsv}>Export CSV</Button>
            <Button variant="ghost" onClick={clearAttemptHistory}>Clear Data</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card><p className="text-sm text-[#6B7280]">Total Attempts</p><p className="text-3xl font-bold text-[#1B2A4A]">{stats.total}</p></Card>
          <Card><p className="text-sm text-[#6B7280]">Pass Rate</p><p className="text-3xl font-bold text-[#1B2A4A]">{stats.passRate}%</p></Card>
          <Card><p className="text-sm text-[#6B7280]">Average Total</p><p className="text-3xl font-bold text-[#1B2A4A]">{stats.avgTotal}/180</p></Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card><p className="text-sm text-[#6B7280]">Average Language Knowledge + Reading</p><p className="text-2xl font-bold text-[#1B2A4A]">{stats.avgLkr}/120</p></Card>
          <Card><p className="text-sm text-[#6B7280]">Average Listening</p><p className="text-2xl font-bold text-[#1B2A4A]">{stats.avgListening}/60</p></Card>
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-[#1B2A4A] mb-3">Section-wise Average Scores</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {stats.sectionAverages.length === 0 && (
              <p className="text-sm text-[#6B7280]">No section data yet.</p>
            )}
            {stats.sectionAverages.map((section) => (
              <div key={section.title} className="rounded-lg border border-gray-200 p-3 bg-white">
                <p className="text-sm text-[#6B7280]">{section.title}</p>
                <p className="text-xl font-bold text-[#1B2A4A]">{section.avgScaled}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-[#1B2A4A] mb-3">Recent Attempts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-2">Name</th>
                  <th className="py-2">Team</th>
                  <th className="py-2">Completed</th>
                  <th className="py-2">LKR</th>
                  <th className="py-2">Listening</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {attempts.length === 0 && (
                  <tr>
                    <td className="py-3 text-[#6B7280]" colSpan={7}>No attempts yet.</td>
                  </tr>
                )}
                {[...attempts].reverse().map((a, idx) => (
                  <tr key={`${a.completedAt}-${idx}`} className="border-b border-gray-100">
                    <td className="py-2">{a.participantName}</td>
                    <td className="py-2">{(a as { teamName?: string }).teamName ?? '-'}</td>
                    <td className="py-2">{new Date(a.completedAt).toLocaleString()}</td>
                    <td className="py-2">{a.scores.lkrScore}</td>
                    <td className="py-2">{a.scores.listeningScore}</td>
                    <td className="py-2 font-semibold">{a.scores.totalScore}</td>
                    <td className={`py-2 font-semibold ${a.scores.passed ? 'text-[#4A7C59]' : 'text-[#C53D43]'}`}>
                      {a.scores.passed ? 'PASS' : 'FAIL'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
