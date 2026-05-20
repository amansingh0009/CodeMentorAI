import { motion } from 'framer-motion';

function HeroStatCard({ icon, value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group flex items-center gap-4 rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-5 shadow-[0_20px_60px_rgba(14,165,233,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/40"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 shadow-[0_0_40px_rgba(14,165,233,0.2)] backdrop-blur-xl transition group-hover:bg-cyan-500/15">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-semibold text-slate-50">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
    </motion.div>
  );
}

export default HeroStatCard;
