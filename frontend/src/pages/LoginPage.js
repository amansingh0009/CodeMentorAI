import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaApple, FaGithub, FaGoogle } from 'react-icons/fa';
import { FiCheck, FiMoreHorizontal, FiShield } from 'react-icons/fi';
import api from '../services/api';

const AuthLogo = () => (
  <div className="flex flex-col items-center">
    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_45px_rgba(34,211,238,0.18)]">
      <span className="text-3xl font-black text-cyan-200">C</span>
    </div>
    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">CodeMentor</p>
  </div>
);

const HumanCheck = ({ checked, onChange }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-4 text-slate-100">
    <div className="flex items-center gap-3">
      <span className={`grid h-7 w-7 place-items-center rounded-lg border ${checked ? 'border-cyan-300 bg-cyan-400 text-slate-950' : 'border-slate-500 bg-slate-900'}`}>
        {checked && <FiCheck className="h-5 w-5" />}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" />
      <span className="text-base">Verify you are human</span>
    </div>
    <div className="flex items-center gap-2 text-cyan-300">
      <FiShield className="h-5 w-5" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em]">Secure</span>
    </div>
  </label>
);

const SocialButtons = () => (
  <div className="space-y-4 text-center">
    <p className="text-sm text-slate-500">or continue with</p>
    <div className="flex justify-center gap-5">
      {[FaGoogle, FaGithub, FaApple, FiMoreHorizontal].map((Icon, index) => (
        <button
          key={index}
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-200"
          aria-label="Social sign in"
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  </div>
);

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [fieldsLocked, setFieldsLocked] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername('');
    setPassword('');
    const clearTimers = [100, 300, 700].map((delay) =>
      setTimeout(() => {
        setUsername('');
        setPassword('');
      }, delay)
    );
    return () => clearTimers.forEach(clearTimeout);
  }, []);

  const unlockFields = () => {
    setFieldsLocked(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!verified) {
      setError('Please verify that you are human.');
      return;
    }
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role || 'ROLE_USER');
      localStorage.setItem('username', username);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Backend is not reachable. Please start the backend server on port 8080.');
        return;
      }
      setError(err.response?.data?.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="mx-auto max-w-[500px] rounded-3xl border border-slate-800 bg-slate-900/80 px-8 py-10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <AuthLogo />
      {error && <div className="mt-7 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
      <form onSubmit={handleSubmit} autoComplete="new-password" className="mt-9 space-y-5">
        <input type="text" name="username" autoComplete="username" className="hidden" tabIndex="-1" />
        <input type="password" name="password" autoComplete="current-password" className="hidden" tabIndex="-1" />
        <input
          name="cm-user-entry"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username or E-mail"
          autoComplete="new-password"
          readOnly={fieldsLocked}
          onFocus={unlockFields}
          onMouseDown={unlockFields}
          className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
        />
        <input
          name="cm-secret-entry"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="new-password"
          readOnly={fieldsLocked}
          onFocus={unlockFields}
          onMouseDown={unlockFields}
          className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
        />
        <HumanCheck checked={verified} onChange={setVerified} />
        <button
          type="submit"
          className={`h-12 w-full rounded-2xl text-base font-semibold transition ${
            verified ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' : 'bg-slate-700 text-slate-400'
          }`}
        >
          Sign In
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-500">
        By continuing, you agree to <span className="text-cyan-300">Terms</span> & <span className="text-cyan-300">Privacy Policy</span>.
      </p>
      <div className="mt-7 flex items-center justify-between text-sm text-slate-400">
        <button type="button" className="hover:text-cyan-200">Forgot Password?</button>
        <Link to="/register" className="hover:text-cyan-200">Sign Up</Link>
      </div>
      <div className="mt-9">
        <SocialButtons />
      </div>
    </div>
  );
};

export default LoginPage;
