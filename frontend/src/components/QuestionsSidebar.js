import { NavLink } from 'react-router-dom';
import { AiOutlineAppstore, AiOutlineThunderbolt, AiOutlineCalendar, AiOutlineTrophy, AiOutlineBarChart, AiOutlineUser } from 'react-icons/ai';

const menuItems = [
  { label: 'Problems', to: '/questions', icon: AiOutlineAppstore },
  { label: 'AI Review', to: '/dashboard', icon: AiOutlineThunderbolt },
  { label: 'Contests', to: '/contests', icon: AiOutlineCalendar },
  { label: 'Leaderboard', to: '/leaderboard', icon: AiOutlineTrophy },
  { label: 'Dashboard', to: '/dashboard', icon: AiOutlineBarChart },
  { label: 'Profile', to: '/profile', icon: AiOutlineUser },
];

const QuestionsSidebar = () => {
  return (
    <aside className="hidden h-full min-h-[calc(100vh-3rem)] flex-col gap-6 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl xl:flex">
      <div className="space-y-3">
        <div className="inline-flex rounded-2xl bg-slate-900/80 px-4 py-3 text-sm font-semibold text-cyan-300 shadow-sm shadow-cyan-500/10">
          <span className="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
          Problem Hub
        </div>
        <p className="text-sm leading-6 text-slate-400">
          Explore curated challenges, track progress, and feel the premium coding energy.
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-cyan-400/10 text-cyan-200 shadow-[0_15px_35px_-25px_rgba(34,211,238,0.9)]'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-cyan-300'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-sm text-slate-300 shadow-inner shadow-slate-950/10">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Fast track</p>
        <p className="mt-3 text-lg font-semibold text-white">Interview mode</p>
        <p className="mt-2 text-slate-400">Complete 3 problems in under 45 minutes to unlock the recruiter-ready badge.</p>
      </div>
    </aside>
  );
};

export default QuestionsSidebar;
