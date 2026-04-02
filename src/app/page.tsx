'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1B2A4A] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">JP</span>
            </div>
            <span className="font-semibold text-[#1B2A4A]">JLPT Mock Exam</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-[#6B7280]">
            <span>Internal Use Only</span>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="max-w-4xl w-full">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="text-center space-y-8"
          >
            {/* Japanese decorative element */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#1B2A4A]/8 rounded-full border border-[#1B2A4A]/15 mb-6">
                <span className="text-[#1B2A4A] font-medium text-sm">
                  社内研修プログラム
                </span>
                <span className="text-[#6B7280] text-sm">·</span>
                <span className="text-[#6B7280] text-sm">Internal Upskilling Program</span>
              </div>
            </motion.div>

            {/* Main title */}
            <motion.div variants={fadeInUp} className="space-y-3">
              <h1 className="text-7xl font-bold text-[#1B2A4A] tracking-tight">
                JLPT模擬テスト
              </h1>
              <p className="text-3xl font-light text-[#6B7280] tracking-wide">
                JLPT Mock Exam
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed"
            >
              Practice your Japanese language proficiency with our official-style
              mock examinations. Designed for internal team upskilling with
              timed sections and instant scoring.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeInUp}>
              <Link href="/register">
                <Button variant="primary" size="lg" className="px-12 py-4 text-lg">
                  Start Exam →
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Exam selection section */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-center text-sm font-semibold text-[#6B7280] uppercase tracking-widest mb-8">
              Available Examinations
            </h2>

            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* N5 — Available */}
              <Link href="/register" className="group">
                <div className="bg-white rounded-2xl border-2 border-[#1B2A4A]/20 shadow-sm p-6 text-center transition-all duration-200 group-hover:border-[#1B2A4A] group-hover:shadow-md group-hover:-translate-y-0.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4A7C59]/15 rounded-full mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#4A7C59]" />
                    <span className="text-xs font-semibold text-[#4A7C59]">Available</span>
                  </div>
                  <h3 className="text-4xl font-bold text-[#1B2A4A] mb-2">N5</h3>
                  <p className="text-sm text-[#6B7280] mb-1">Mock Exam 001</p>
                  <p className="text-xs text-[#6B7280]">3 sections · ~105 min</p>
                </div>
              </Link>

              {/* N4 — Coming Soon */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6 text-center opacity-50 cursor-not-allowed select-none">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-xs font-semibold text-[#6B7280]">Coming Soon</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-300 mb-2">N4</h3>
                <p className="text-sm text-gray-300 mb-1">In preparation</p>
                <p className="text-xs text-gray-300">Content coming soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section className="border-t border-gray-100 bg-white px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-8"
          >
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-[#1B2A4A]/10 rounded-xl flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-[#1B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1B2A4A]">Timed Sections</h3>
              <p className="text-sm text-[#6B7280]">
                Authentic exam conditions with per-section countdowns
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-[#1B2A4A]/10 rounded-xl flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-[#1B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1B2A4A]">Instant Scoring</h3>
              <p className="text-sm text-[#6B7280]">
                JLPT-standard scoring with pass/fail determination
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-[#1B2A4A]/10 rounded-xl flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-[#1B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1B2A4A]">Answer Review</h3>
              <p className="text-sm text-[#6B7280]">
                Full review of answers with explanations after completion
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[#6B7280]">
          <span>JLPT Mock Exam — Internal Use Only</span>
          <span>日本語能力試験模擬テスト</span>
        </div>
      </footer>
    </main>
  );
}
