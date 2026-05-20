import { useEffect, useMemo, useState } from 'react';
import { FiBarChart2, FiBriefcase, FiCode, FiFileText, FiGithub, FiGlobe, FiLinkedin, FiMapPin, FiSave, FiTool, FiUser } from 'react-icons/fi';

const defaultProfile = {
  displayName: '',
  headline: '',
  location: '',
  birthday: '',
  website: '',
  github: '',
  linkedin: '',
  readme: '',
  work: '',
  education: '',
  skills: '',
  showSubmissions: true,
  showHeatmap: true,
};

const fieldGroups = [
  {
    title: 'General',
    subtitle: 'Manage your basic profile information.',
    fields: [
      { name: 'displayName', label: 'Display Name', placeholder: 'Your public name', icon: FiUser },
      { name: 'headline', label: 'Headline', placeholder: 'Student developer, backend engineer, DSA learner...', icon: FiCode },
      { name: 'location', label: 'Location', placeholder: 'City, country', icon: FiMapPin },
      { name: 'birthday', label: 'Birthday', type: 'date', icon: FiUser },
    ],
  },
  {
    title: 'Links',
    subtitle: 'Add the places where recruiters can find your work.',
    fields: [
      { name: 'website', label: 'Website', placeholder: 'https://your-site.com', icon: FiGlobe },
      { name: 'github', label: 'Github', placeholder: 'https://github.com/username', icon: FiGithub },
      { name: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', icon: FiLinkedin },
    ],
  },
  {
    title: 'Experience',
    subtitle: 'Share your learning, work, education, and skills.',
    fields: [
      { name: 'work', label: 'Work', placeholder: 'Current role, internships, projects...', icon: FiBriefcase },
      { name: 'education', label: 'Education', placeholder: 'College, degree, graduation year...', icon: FiFileText },
      { name: 'skills', label: 'Skills', placeholder: 'Java, React, Spring Boot, DSA...', icon: FiTool },
    ],
  },
];

const ProfilePage = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);
  const username = localStorage.getItem('username') || '';
  const storageKey = username ? `codementor_profile_${username}` : 'codementor_profile_guest';

  useEffect(() => {
    const storedProfile = localStorage.getItem(storageKey);
    if (storedProfile) {
      setProfile({ ...defaultProfile, ...JSON.parse(storedProfile) });
      return;
    }
    setProfile({ ...defaultProfile, displayName: username });
  }, [storageKey, username]);

  const initials = useMemo(() => {
    const name = profile.displayName.trim();
    if (!name) return 'ME';
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }, [profile.displayName]);

  const updateProfile = (name, value) => {
    setSaved(false);
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify(profile));
    setSaved(true);
  };

  return (
    <form onSubmit={saveProfile} className="mx-auto w-full max-w-6xl space-y-8 overflow-hidden pb-10">
      <header className="grid gap-5 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center lg:grid-cols-[96px_minmax(0,1fr)_auto]">
        <div className="grid h-24 w-24 place-items-center rounded-3xl border border-cyan-400/30 bg-cyan-400/10 text-3xl font-bold text-cyan-200">
          {initials}
        </div>
        <h1 className="min-w-0 truncate text-3xl font-semibold text-white">{profile.displayName || 'Your name'}</h1>
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
          <FiSave className="h-4 w-4" />
          {saved ? 'Saved' : 'Save Profile'}
        </button>
      </header>

      {fieldGroups.map((group) => (
        <section key={group.title} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{group.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{group.subtitle}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
            {group.fields.map((field) => {
              const Icon = field.icon;
              return (
                <label key={field.name} className="flex flex-col gap-3 border-b border-slate-800/80 px-5 py-5 last:border-b-0 sm:flex-row sm:items-center sm:px-8">
                  <div className="flex min-w-[180px] items-center gap-4">
                    <Icon className="h-5 w-5 text-slate-400" />
                    <span className="text-base font-semibold text-white">{field.label}</span>
                  </div>
                  <input
                    type={field.type || 'text'}
                    value={profile[field.name]}
                    onChange={(event) => updateProfile(field.name, event.target.value)}
                    placeholder={field.placeholder}
                    className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                  />
                </label>
              );
            })}
          </div>
        </section>
      ))}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">ReadMe</h2>
          <p className="mt-1 text-sm text-slate-400">Write a short intro for visitors.</p>
        </div>
        <textarea
          value={profile.readme}
          onChange={(event) => updateProfile('readme', event.target.value)}
          placeholder="Tell people what you are learning, building, and looking for."
          rows={5}
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Curate your profile</h2>
          <p className="mt-1 text-sm text-slate-400">Control what opens to the public.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          {[
            ['showSubmissions', 'Recent AC Problems and Submission Details', FiCode],
            ['showHeatmap', 'Submission Heatmap', FiBarChart2],
          ].map(([name, label, Icon]) => (
            <label key={name} className="flex min-h-[80px] items-center justify-between gap-4 border-b border-slate-800/80 px-5 py-4 last:border-b-0 sm:px-8">
              <span className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-slate-400" />
                <span className="text-base font-semibold text-white sm:text-lg">{label}</span>
              </span>
              <input
                type="checkbox"
                checked={profile[name]}
                onChange={(event) => updateProfile(name, event.target.checked)}
                className="h-5 w-5 accent-cyan-400"
              />
            </label>
          ))}
        </div>
      </section>
    </form>
  );
};

export default ProfilePage;
