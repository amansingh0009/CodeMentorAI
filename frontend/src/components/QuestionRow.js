import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const difficultyStyles = {
  Easy: 'text-cyan-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-500',
};

const normalizeDifficulty = (difficulty) => {
  if (!difficulty) return 'Easy';
  const normalized = difficulty.toString().toLowerCase();
  if (normalized.includes('hard')) return 'Hard';
  if (normalized.includes('med')) return 'Medium';
  return 'Easy';
};

const formatAcceptance = (acceptance) => {
  if (acceptance === null || acceptance === undefined || acceptance === '') return '0%';
  const value = acceptance.toString();
  return value.includes('%') ? value : `${value}%`;
};

const QuestionRow = ({ question, displayNumber, isFavorite, onToggleFavorite, isAlternate }) => {
  const difficulty = normalizeDifficulty(question.difficulty ?? question.level);
  const acceptance = question.acceptance ?? question.acceptanceRate ?? question.acceptancePercentage ?? 72;
  const solved = question.solved ?? question.completed ?? false;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group overflow-hidden rounded-3xl border border-slate-800/80 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.08)] transition duration-300 hover:border-cyan-400/30 hover:bg-slate-900/95 ${
        isAlternate ? 'bg-slate-900/70' : 'bg-slate-950/80'
      }`}
    >
      <div className="hidden items-center gap-3 md:grid md:grid-cols-[52px_minmax(0,1fr)_82px_70px_94px_40px] xl:grid-cols-[72px_minmax(0,1fr)_100px_82px_104px_48px]">
        <div className="text-sm font-semibold text-slate-400">#{displayNumber}</div>
        <div className="min-w-0">
          <Link to={`/questions/${question.id}`} className="space-y-1">
            <p className="truncate text-base font-semibold text-white transition group-hover:text-cyan-300">
              {question.title}
            </p>
            <p className="truncate text-xs leading-5 text-slate-500">
              {question.description ? question.description.slice(0, 100) + '...' : 'Solve the next challenge to earn points.'}
            </p>
          </Link>
        </div>
        <div className="text-right text-sm font-semibold text-slate-200">
          {formatAcceptance(acceptance)}
        </div>
        <div className={`text-sm font-semibold ${difficultyStyles[difficulty] || 'text-cyan-400'}`}>
          {difficulty === 'Medium' ? 'Med.' : difficulty}
        </div>
        <div className="text-sm font-semibold text-slate-200">
          {solved ? 'Solved' : 'Unsolved'}
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          className="mx-auto rounded-full p-2 text-slate-400 transition hover:text-cyan-300"
          aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <FiStar className={`${isFavorite ? 'text-cyan-400' : 'text-slate-500'} h-5 w-5`} />
        </button>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-400">#{displayNumber}</div>
          <button
            type="button"
            onClick={onToggleFavorite}
            className="rounded-full p-2 text-slate-400 transition hover:text-cyan-300"
            aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <FiStar className={`${isFavorite ? 'text-cyan-400' : 'text-slate-500'} h-5 w-5`} />
          </button>
        </div>
        <Link to={`/questions/${question.id}`} className="space-y-2">
          <p className="text-lg font-semibold text-white transition group-hover:text-cyan-300">
            {question.title}
          </p>
          <p className="text-sm text-slate-500">
            {question.description ? question.description.slice(0, 90) + '...' : 'Solve the next challenge to earn points.'}
          </p>
        </Link>
        <div className="grid grid-cols-3 gap-3 text-sm font-semibold text-slate-200">
          <span className="text-slate-400">Accept</span>
          <span className="text-slate-400">Level</span>
          <span className="text-slate-400">Status</span>
          <span>{formatAcceptance(acceptance)}</span>
          <span className={`${difficultyStyles[difficulty] || 'text-cyan-400'}`}>
            {difficulty === 'Medium' ? 'Med.' : difficulty}
          </span>
          <span>{solved ? 'Solved' : 'Unsolved'}</span>
        </div>
      </div>
    </motion.article>
  );
};

export default QuestionRow;
