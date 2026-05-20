import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username') || '';
  const profileKey = username ? `codementor_profile_${username}` : '';
  const storedProfile = profileKey ? localStorage.getItem(profileKey) : null;
  let profile = {};
  try {
    profile = storedProfile ? JSON.parse(storedProfile) : {};
  } catch {
    profile = {};
  }
  const displayName = profile.displayName || username || 'Me';
  const initials = displayName
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="overflow-hidden border-b border-slate-800 bg-slate-900 py-4">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-5 px-5">
        <div className="shrink-0">
          <Link to="/" className="text-xl font-semibold text-cyan-300">CodeMentor AI</Link>
        </div>
        <div className="flex min-w-0 items-center gap-4 text-slate-200">
          {token ? (
            <> 
              <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
              <Link to="/questions" className="hover:text-white">Questions</Link>
              <Link to="/contests" className="hover:text-white">Contests</Link>
              <Link to="/leaderboard" className="hover:text-white">Leaderboard</Link>
              <Link
                to="/profile"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20"
                aria-label="Profile"
                title={displayName}
              >
                {initials || 'ME'}
              </Link>
              {role === 'ROLE_ADMIN' && <Link to="/admin" className="hover:text-white">Admin</Link>}
              <button onClick={logout} className="rounded bg-cyan-500 px-3 py-1 text-slate-950 font-semibold">Logout</button>
            </>
          ) : (
            <> 
              <Link to="/login" className="hover:text-white">Login</Link>
              <Link to="/register" className="hover:text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
