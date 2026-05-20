import { useEffect, useState } from 'react';
import api from '../services/api';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function loadLeaderboard() {
      const response = await api.get('/dashboard/leaderboard');
      setLeaderboard(response.data);
    }
    loadLeaderboard().catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-slate-800 p-6 shadow-lg shadow-slate-900">
        <h2 className="text-2xl font-semibold text-cyan-300">Leaderboard</h2>
        <p className="mt-2 text-slate-300">Top performers based on score and solved challenges.</p>
      </div>
      <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-lg shadow-slate-950">
        <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-slate-200">
          <thead className="bg-slate-950">
            <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Solved</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item, index) => (
              <tr key={item.username} className="border-t border-slate-800 hover:bg-slate-950/80">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.username}</td>
                <td className="px-6 py-4">{item.totalScore}</td>
                <td className="px-6 py-4">{item.solvedQuestions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
