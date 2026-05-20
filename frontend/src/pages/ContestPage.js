import { FiClock, FiGift, FiSearch, FiShield, FiZap } from 'react-icons/fi';
import { AiOutlineTrophy } from 'react-icons/ai';
import { motion } from 'framer-motion';

const contests = [
  {
    title: 'Weekly Contest 503',
    date: 'Sun, May 24, 08:00 GMT+05:30',
    timer: '3d 17:42:49',
    tone: 'from-amber-200 via-orange-400 to-orange-900',
    glow: 'shadow-orange-500/20',
  },
  {
    title: 'Biweekly Contest 183',
    date: 'Sat, May 23, 20:00 GMT+05:30',
    timer: '3d 05:42:49',
    tone: 'from-indigo-500 via-violet-500 to-purple-900',
    glow: 'shadow-violet-500/20',
  },
];

const ContestPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-7rem)] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl shadow-slate-950">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.2),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-950/25 to-transparent" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 py-8 sm:px-8 lg:py-12">
        <div className="mb-10 flex w-full items-center justify-between gap-4">
          <button className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 backdrop-blur">
            <FiGift className="h-4 w-4 text-orange-300" />
            Claim secret reward
          </button>

          <div className="hidden items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300 backdrop-blur md:flex">
            <FiSearch className="h-4 w-4" />
            <span>Search contests</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-3xl" />
            <AiOutlineTrophy className="relative h-28 w-28 text-amber-300 drop-shadow-[0_18px_35px_rgba(251,191,36,0.35)]" />
          </div>
          <h1 className="mt-7 text-3xl font-semibold tracking-tight text-white sm:text-4xl">CodeMentor Arena</h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">Timed coding battles, live score shifts, and weekly rank climbs.</p>
        </motion.div>

        <div className="mt-16 grid w-full max-w-5xl gap-6 lg:grid-cols-2">
          {contests.map((contest, index) => (
            <motion.article
              key={contest.title}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
              className={`group overflow-hidden rounded-[2rem] bg-gradient-to-br ${contest.tone} shadow-2xl ${contest.glow}`}
            >
              <div className="relative h-52 overflow-hidden">
                <div className="absolute right-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  <FiClock className="h-4 w-4" />
                  {contest.timer}
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(255,255,255,0.42),transparent_0_28%,rgba(255,255,255,0.16)_29%,transparent_55%)]" />
                <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-2xl border border-white/55 bg-white/15 shadow-[0_0_38px_rgba(255,255,255,0.45)] backdrop-blur-sm transition duration-300 group-hover:scale-105" />
                <div className="absolute left-[58%] top-[56%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xl border border-white/45 bg-white/10 shadow-[0_0_26px_rgba(255,255,255,0.28)] backdrop-blur-sm" />
              </div>

              <div className="flex items-center justify-between gap-4 bg-black/35 px-7 py-5 backdrop-blur">
                <div>
                  <h2 className="text-lg font-semibold text-white">{contest.title}</h2>
                  <p className="mt-1 text-sm text-slate-100/85">{contest.date}</p>
                </div>
                <button className="grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25" aria-label={`Set reminder for ${contest.title}`}>
                  <FiClock className="h-5 w-5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <button className="mt-9 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white">
          <FiShield className="h-4 w-4" />
          Host an Arena Round
        </button>

        <div className="mt-16 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          {[
            ['Live ranking', 'Track your rank while the contest is active.', FiZap],
            ['Weekly streaks', 'Build consistency with scheduled rounds.', FiClock],
            ['Prize badges', 'Earn profile highlights for top finishes.', FiGift],
          ].map(([title, text, Icon]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <Icon className="h-5 w-5 text-amber-300" />
              <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestPage;
