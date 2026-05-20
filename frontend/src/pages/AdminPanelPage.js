import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminPanelPage = () => {
  const [users, setUsers] = useState([]);
  const [question, setQuestion] = useState({ title: '', description: '', difficulty: 'Easy', sampleInput: '', sampleOutput: '', tags: '' });

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    }
    loadUsers().catch(console.error);
  }, []);

  const handleDeleteUser = async (userId) => {
    await api.delete(`/admin/users/${userId}`);
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleSubmitQuestion = async (event) => {
    event.preventDefault();
    await api.post('/admin/questions', question);
    setQuestion({ title: '', description: '', difficulty: 'Easy', sampleInput: '', sampleOutput: '', tags: '' });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-slate-800 p-6 shadow-lg shadow-slate-900">
        <h2 className="text-2xl font-semibold text-cyan-300">Admin Panel</h2>
        <p className="mt-2 text-slate-300">Manage users, questions, and review submissions.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg shadow-slate-950">
          <h3 className="mb-4 text-xl font-semibold text-white">User Management</h3>
          <ul className="space-y-3">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between rounded-2xl border border-slate-700 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">{user.username}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
                <button onClick={() => handleDeleteUser(user.id)} className="rounded bg-rose-500 px-3 py-1 text-sm font-semibold text-white">Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg shadow-slate-950">
          <h3 className="mb-4 text-xl font-semibold text-white">Add Question</h3>
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            {['title', 'description', 'sampleInput', 'sampleOutput', 'tags'].map((field) => (
              <input key={field} value={question[field]} onChange={(e) => setQuestion({ ...question, [field]: e.target.value })} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
            ))}
            <select value={question.difficulty} onChange={(e) => setQuestion({ ...question, difficulty: e.target.value })} className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <button type="submit" className="rounded bg-cyan-500 px-4 py-3 text-slate-950 font-semibold">Add Question</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
