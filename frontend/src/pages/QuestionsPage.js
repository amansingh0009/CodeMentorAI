import { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import QuestionsSidebar from '../components/QuestionsSidebar';
import QuestionRow from '../components/QuestionRow';

const categories = ['All', 'Arrays', 'Strings', 'Dynamic Programming', 'Graphs', 'Trees', 'Greedy', 'Binary Search'];
const difficultyFilters = ['All', 'Easy', 'Medium', 'Hard'];
const statCards = [
  { label: 'Solved', value: '42', accent: 'text-cyan-300' },
  { label: 'Acceptance', value: '78%', accent: 'text-emerald-300' },
  { label: 'Daily Streak', value: '7 Days', accent: 'text-violet-300' },
];
const recommendationCards = [
  { label: 'Fast Path', value: 'Finish easy array problems', icon: '⚡' },
  { label: 'AI Hint', value: 'Try the pattern matcher tool', icon: '🤖' },
];

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function loadQuestions() {
      const response = await api.get('/questions');
      const raw = response.data || [];
      const normalized = (raw || []).map((q) => ({
        ...q,
        tags: Array.isArray(q.tags)
          ? q.tags
          : typeof q.tags === 'string' && q.tags.length
          ? q.tags.split(',').map((t) => t.trim())
          : [],
        acceptance: q.acceptance ?? q.acceptanceRate ?? q.acceptancePercentage ?? 0,
      }));
      setQuestions(normalized);
    }
    loadQuestions().catch(console.error);
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions
      .filter((question) => {
        const title = (question.title || '').toString().toLowerCase();
        const description = (question.description || '').toString().toLowerCase();
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query || title.includes(query) || description.includes(query);
        const matchesCategory =
          activeCategory === 'All' ||
          (question.category || '').toString().toLowerCase() === activeCategory.toLowerCase() ||
          (question.tags || []).some((tag) => tag.toLowerCase() === activeCategory.toLowerCase());
        const matchesDifficulty =
          activeDifficulty === 'All' ||
          (question.difficulty || question.level || 'Easy').toString().toLowerCase().includes(activeDifficulty.toLowerCase());
        return matchesSearch && matchesCategory && matchesDifficulty;
      })
      .sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [questions, searchQuery, activeCategory, activeDifficulty]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]
    );
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-4 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="grid gap-6 xl:grid-cols-[280px_1fr_320px]">
        <QuestionsSidebar />

        <main className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-400/80">Problem Suite</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Elite Coding Challenges</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Browse premium problems with the speed and polish of a FAANG-style platform. Filter quickly, focus on quality, and solve like a professional.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {statCards.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/30">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{stat.label}</p>
                    <p className={`mt-3 text-2xl font-semibold ${stat.accent}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400/70" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search problems, tags, or topics"
                  className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 py-4 pl-12 pr-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-sm text-slate-200 shadow-inner shadow-slate-950/10">
                  <div className="flex items-center gap-2">
                    <span>Filter</span>
                    <FiChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {difficultyFilters.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setActiveDifficulty(level)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeDifficulty === level
                          ? 'bg-cyan-400/10 text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]'
                          : 'text-slate-400 hover:bg-slate-900/80 hover:text-cyan-300'
                      }`}
                    >
                      {level === 'Medium' ? 'Med.' : level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeCategory === category
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                      : 'border-slate-800 text-slate-400 hover:border-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
          >
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_250px] md:grid-cols-[1fr_260px]">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Question Bank</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">All Active Challenges</h2>
                  </div>
                  <span className="rounded-full bg-slate-900/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {filteredQuestions.length} items
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Compact rows, crisp hover states, and recruiter-ready details make this page feel polished and production-grade.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/20">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Quick summary</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-300">
                  <div className="rounded-3xl bg-slate-950/70 p-3 text-center">
                    <p className="font-semibold text-cyan-300">{filteredQuestions.length}</p>
                    <p className="text-slate-500">Problems</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/70 p-3 text-center">
                    <p className="font-semibold text-emerald-300">{statCards[1].value}</p>
                    <p className="text-slate-500">Acceptance</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/70 p-3 text-center">
                    <p className="font-semibold text-violet-300">{statCards[2].value}</p>
                    <p className="text-slate-500">Streak</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden grid-cols-[52px_minmax(0,1fr)_82px_70px_94px_40px] gap-3 px-4 py-3 text-xs uppercase tracking-[0.28em] text-slate-500 md:grid xl:grid-cols-[72px_minmax(0,1fr)_100px_82px_104px_48px]">
              <span>Problem</span>
              <span className="truncate">Title</span>
              <span>Accept</span>
              <span>Level</span>
              <span>Status</span>
              <span className="text-right">Fav</span>
            </div>

            <div className="space-y-3">
              {filteredQuestions.map((question, index) => (
                <QuestionRow
                  key={question.id}
                  question={question}
                  displayNumber={index + 1}
                  isFavorite={favorites.includes(question.id)}
                  onToggleFavorite={() => toggleFavorite(question.id)}
                  isAlternate={index % 2 === 1}
                />
              ))}
            </div>
          </motion.section>
        </main>

        <aside className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="rounded-3xl border border-cyan-400/10 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Daily Challenge</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Optimize the Graph Maze</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Solve a shortest-path problem using priority queues and dynamic constraints to earn bonus recruiter points.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p className="text-slate-500">Reward</p>
                <p className="mt-2 text-lg font-semibold text-cyan-300">+150 XP</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p className="text-slate-500">Time left</p>
                <p className="mt-2 text-lg font-semibold text-emerald-300">6h 24m</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Trending Companies</p>
            <div className="mt-4 grid gap-3">
              {['Google', 'Amazon', 'Meta', 'Stripe', 'Netflix'].map((company) => (
                <div key={company} className="flex items-center justify-between rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                  <span>{company}</span>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    Top Role
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Progress</p>
              <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-300">Live</span>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Completion</p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-3/5 rounded-full bg-cyan-400" />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-200">60% solved</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Quality score</p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-4/5 rounded-full bg-emerald-400" />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-200">82% accuracy</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/70 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">AI Recommendations</p>
            <div className="mt-4 space-y-3">
              {recommendationCards.map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-900/90 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

export default QuestionsPage;
