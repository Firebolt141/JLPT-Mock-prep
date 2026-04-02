'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';
import { Logo } from '@/src/components/ui/Logo';

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#1B2A4A] leading-none">SAP Nihongo Community</p>
              <p className="text-xs text-[#6B7280]">JLPT Mock Exam Platform</p>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-[#6B7280]">
            <span>SAP Internal</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="max-w-4xl w-full">
          <motion.div variants={stagger} initial="initial" animate="animate" className="text-center space-y-8">
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#1B2A4A]/8 rounded-full border border-[#1B2A4A]/15 mb-6">
                <span className="text-[#1B2A4A] font-medium text-sm">SAP Nihongo Community</span>
                <span className="text-[#6B7280] text-sm">·</span>
                <span className="text-[#6B7280] text-sm">日本語学習プログラム</span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-3">
              <h1 className="text-7xl font-bold text-[#1B2A4A] tracking-tight">JLPT模擬テスト</h1>
              <p className="text-3xl font-light text-[#6B7280] tracking-wide">JLPT Mock Exam</p>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed">
              Practice your Japanese language proficiency with official-style mock examinations.
              Part of the SAP Nihongo Community upskilling program — timed sections, instant scoring, and full answer review.
            </motion.p>

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

      {/* Exam cards */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h2 className="text-center text-sm font-semibold text-[#6B7280] uppercase tracking-widest mb-8">
              Available Examinations
            </h2>
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link href="/register" className="group">
                <div className="bg-white rounded-2xl border-2 border-[#1B2A4A]/20 shadow-sm p-6 text-center transition-all duration-200 group-hover:border-[#1B2A4A] group-hover:shadow-md group-hover:-translate-y-0.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4A7C59]/15 rounded-full mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#4A7C59]" />
                    <span className="text-xs font-semibold text-[#4A7C59]">Available</span>
                  </div>
                  <h3 className="text-4xl font-bold text-[#1B2A4A] mb-2">N5</h3>
                  <p className="text-sm text-[#6B7280] mb-1">Mock Exam 001</p>
                  <p className="text-xs text-[#6B7280]">3 sections · ~65 min</p>
                </div>
              </Link>
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

      {/* Features */}
      <section className="border-t border-gray-100 bg-white px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="grid grid-cols-3 gap-8">
            {[
              {
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Timed Sections',
                desc: 'Authentic exam conditions with per-section countdowns',
              },
              {
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                title: 'JLPT Scoring',
                desc: 'Official-style scoring with pass/fail determination',
              },
              {
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Resume Later',
                desc: 'Close the tab and pick up exactly where you left off',
              },
            ].map((f) => (
              <div key={f.title} className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#1B2A4A]/10 rounded-xl flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-[#1B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1B2A4A]">{f.title}</h3>
                <p className="text-sm text-[#6B7280]">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[#6B7280]">
          <span>SAP Nihongo Community · JLPT Mock Exam</span>
          <span>日本語能力試験模擬テスト</span>
        </div>
      </footer>
    </main>
  );
}
