import { motion } from 'framer-motion';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { MdOutlineWorkspacePremium } from 'react-icons/md';
import { BsLightningCharge } from 'react-icons/bs';
import HeroStatCard from './HeroStatCard';

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      {/* Background glow layers */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute right-0 top-24 -z-10 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-40 -z-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="mx-auto flex max-w-7xl flex-col gap-12 xl:flex-row xl:items-center">
        <div className="w-full xl:w-6/12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-slate-900/60 px-4 py-2 text-sm text-cyan-200 shadow-[0_0_40px_rgba(56,189,248,0.1)] backdrop-blur-xl">
              <FiZap className="h-4 w-4 text-cyan-300" />
              AI-powered interview training for elite engineers
            </span>
            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-tight text-slate-50 sm:text-6xl">
              Master Coding Interviews with AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              Practice coding, get AI-powered feedback, improve problem-solving skills, and crack top tech interviews.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="/questions"
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-7 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_40px_rgba(6,182,212,0.28)] transition duration-200 hover:bg-cyan-300"
              >
                Start Coding
                <FiArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-7 py-3 text-base font-semibold text-slate-100 transition duration-200 hover:border-cyan-400/40 hover:text-cyan-300"
              >
                Explore Problems
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-900/70 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.25)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">Featured</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-100">AI Code Review</h3>
              <p className="mt-2 text-sm text-slate-400">
                Receive instant insight into code quality, performance, and hidden bugs.
              </p>
            </div>
            <div className="rounded-[2rem] border border-violet-400/20 bg-slate-900/70 p-5 shadow-[0_30px_80px_rgba(76,29,149,0.18)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.22em] text-violet-300/80">Premium</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Interview Prep Paths</h3>
              <p className="mt-2 text-sm text-slate-400">
                Tailored challenge journeys to help you score interviews at top tech firms.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative w-full xl:w-6/12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative mx-auto max-w-3xl rounded-[2rem] border border-cyan-400/20 bg-slate-900/70 p-6 shadow-[0_40px_120px_rgba(14,165,233,0.15)] backdrop-blur-2xl"
          >
            <div className="absolute -right-8 top-8 hidden h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl xl:block" />
            <div className="absolute -left-10 top-32 hidden h-24 w-24 rounded-full bg-violet-500/10 blur-3xl xl:block" />
            <div className="mb-6 flex items-center justify-between rounded-3xl bg-slate-950/80 px-5 py-4 text-slate-300 shadow-inner shadow-slate-950/20 ring-1 ring-slate-700/50">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Live Session</p>
                <p className="mt-2 text-xl font-semibold text-slate-50">AI Review Console</p>
              </div>
              <div className="rounded-2xl bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200">
                2.3s latency
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.75rem] bg-slate-950/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.4)] ring-1 ring-white/5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">AI Analysis</p>
                <p className="mt-3 text-3xl font-semibold text-cyan-300">98%</p>
                <p className="mt-2 text-sm text-slate-400">Precision in bug detection.</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-950/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.4)] ring-1 ring-white/5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Code Score</p>
                <p className="mt-3 text-3xl font-semibold text-violet-300">A+</p>
                <p className="mt-2 text-sm text-slate-400">Optimized for runtime and readability.</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-700/60 bg-slate-950/85 p-5 shadow-[inset_0_0_60px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Problem: Merge K Sorted Lists</span>
                <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">Medium</span>
              </div>
              <div className="mt-4 rounded-3xl bg-slate-900/95 p-4 text-sm text-slate-100 ring-1 ring-slate-700/40">
                <pre className="max-h-48 overflow-y-auto text-[0.82rem] leading-6 text-slate-200">
                  <code>
{`function mergeLists(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  return l1.val < l2.val ? { ...l1, next: mergeLists(l1.next, l2) } : { ...l2, next: mergeLists(l1, l2.next) };
}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <HeroStatCard
                icon={<BsLightningCharge className="h-5 w-5 text-cyan-300" />}
                value="4.8/5"
                label="AI Difficulty Rating"
              />
              <HeroStatCard
                icon={<MdOutlineWorkspacePremium className="h-5 w-5 text-violet-300" />}
                value="120+"
                label="Premium interview paths"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
            className="mt-8 flex items-center justify-center gap-4 rounded-[2rem] border border-white/5 bg-slate-900/70 px-6 py-4 text-slate-300 shadow-[0_30px_70px_rgba(15,23,42,0.24)] backdrop-blur-xl"
          >
            <AiOutlinePlayCircle className="h-8 w-8 text-cyan-300" />
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Live challenge mode</p>
              <p className="font-medium text-slate-100">Jump into a real-time coding showdown</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
