'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '@/src/store/examStore';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Logo } from '@/src/components/ui/Logo';
import examData from '@/src/data/exams/n5/mock-001.json';
import type { ExamSet } from '@/src/types/exam';

const typedExamData = examData as ExamSet;

export default function RegisterPage() {
  const router = useRouter();
  const setParticipantInfo = useExamStore((s) => s.setParticipantInfo);
  const setExamSet = useExamStore((s) => s.setExamSet);
  const startExam = useExamStore((s) => s.startExam);

  const storedName = useExamStore((s) => s.participantName);
  const storedEmail = useExamStore((s) => s.email);
  const examStarted = useExamStore((s) => s.examStarted);
  const examCompleted = useExamStore((s) => s.examCompleted);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  const hasResumableExam =
    examStarted &&
    !examCompleted &&
    storedEmail !== '' &&
    storedName.toLowerCase() === name.trim().toLowerCase() &&
    storedEmail.toLowerCase() === email.trim().toLowerCase();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    else if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = 'Please enter a valid email address.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    if (hasResumableExam) { setShowResumePrompt(true); return; }
    await beginFresh();
  };

  const beginFresh = async () => {
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 350));
    setParticipantInfo(name.trim(), email.trim().toLowerCase());
    setExamSet(typedExamData);
    startExam();
    router.push('/exam');
  };

  const resumeExam = () => router.push('/exam');

  return (
    <main className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo size={36} />
            <div className="leading-tight">
              <p className="text-xs font-semibold text-[#1B2A4A] leading-none">SAP Nihongo Community</p>
              <p className="text-xs text-[#6B7280]">JLPT Mock Exam</p>
            </div>
          </Link>
          <span className="text-gray-300 ml-1">·</span>
          <span className="text-sm text-[#6B7280]">Registration</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1B2A4A] mb-2">受験者登録</h1>
            <p className="text-[#6B7280]">Participant Registration</p>
          </div>

          <Card shadow="md" padding="lg">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#1B2A4A] mb-2">
                  Full Name <span className="text-[#C53D43]" aria-hidden>*</span>
                </label>
                <input id="name" type="text" value={name}
                  onChange={(e) => { setName(e.target.value); setShowResumePrompt(false); if (errors.name) setErrors((p) => ({ ...p, name: '' })); }}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-lg border text-base text-[#1A1A1A] bg-white placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent ${errors.name ? 'border-[#C53D43]' : 'border-gray-200 hover:border-gray-300'}`}
                  aria-required="true" />
                {errors.name && <p className="mt-1.5 text-sm text-[#C53D43]" role="alert">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1B2A4A] mb-2">
                  Email Address <span className="text-[#C53D43]" aria-hidden>*</span>
                </label>
                <input id="email" type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setShowResumePrompt(false); if (errors.email) setErrors((p) => ({ ...p, email: '' })); }}
                  placeholder="your.name@sap.com"
                  className={`w-full px-4 py-3 rounded-lg border text-base text-[#1A1A1A] bg-white placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent ${errors.email ? 'border-[#C53D43]' : 'border-gray-200 hover:border-gray-300'}`}
                  aria-required="true" />
                {errors.email && <p className="mt-1.5 text-sm text-[#C53D43]" role="alert">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B2A4A] mb-2">Select Exam</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-[#1B2A4A] bg-[#1B2A4A]/5">
                    <div className="w-5 h-5 rounded-full border-2 border-[#1B2A4A] flex items-center justify-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1B2A4A]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1B2A4A]">N5 Mock Exam 001</span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-[#4A7C59]/15 text-[#4A7C59] rounded-full">Available</span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-0.5">3 sections · Vocabulary, Grammar & Reading, Listening · ~65 min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 opacity-40 cursor-not-allowed select-none">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-400">N4 Mock Exam</span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full">Coming Soon</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showResumePrompt && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="p-4 bg-[#D4A017]/10 border border-[#D4A017]/40 rounded-xl space-y-3">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#D4A017] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-[#1B2A4A]">Exam in progress</p>
                          <p className="text-sm text-[#6B7280]">You have an unfinished exam. Would you like to continue where you left off?</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" size="md" fullWidth onClick={resumeExam}>Resume Exam →</Button>
                        <Button variant="secondary" size="md" fullWidth onClick={async () => { setShowResumePrompt(false); await beginFresh(); }}>Start Fresh</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 p-4 bg-[#1B2A4A]/5 rounded-xl">
                <svg className="w-5 h-5 text-[#1B2A4A] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-[#1B2A4A]">
                  Sections are individually timed. You can close the tab and return later — sign in with the same name and email to resume your exam.
                </p>
              </div>

              {!showResumePrompt && (
                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
                  {isSubmitting ? 'Preparing Exam…' : '試験を開始する · Begin Exam'}
                </Button>
              )}
            </form>
          </Card>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            <Link href="/" className="hover:text-[#1B2A4A] transition-colors">← Back to Home</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
