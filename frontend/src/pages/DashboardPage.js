import { useEffect, useState } from 'react';
import api from '../services/api';

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      const response = await api.get('/dashboard/analytics');
      setAnalytics(response.data);
    }
    fetchAnalytics().catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-slate-800 p-6 shadow-lg shadow-slate-900">
        <h2 className="text-2xl font-semibold text-cyan-300">Your Dashboard</h2>
        <p className="mt-2 text-slate-300">Track submissions, performance, and coding progress.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {['Total Submissions', 'Total Solved', 'Average Score', 'Active Questions'].map((label, index) => (
          <div key={label} className="rounded-2xl bg-slate-800 p-6 shadow-lg shadow-slate-900">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">
              {analytics ? [analytics.totalSubmissions, analytics.totalSolved, analytics.averageScore, analytics.activeQuestions][index] : '...'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
