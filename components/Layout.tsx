
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, LogOut, CheckCircle2, Heart, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Overview', path: '/yearly', icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar - Desktop Only (Lg screens and up) */}
      <aside className="hidden lg:flex w-64 flex-col bg-gray-900 border-r border-gray-800 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-emerald-500/20 p-2 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase italic">
            Habit Tracker
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === item.path
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-emerald-400' : 'group-hover:text-white'}`} />
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-800 space-y-6">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-2 cursor-pointer rounded-xl py-2 -mx-1 hover:bg-gray-800/50 transition-all group/profile"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold uppercase shrink-0">
              {profile?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate uppercase italic group-hover/profile:text-emerald-400 transition-colors">{profile?.name || 'User'}</p>
              <p className="text-[10px] text-gray-500 truncate font-bold">{profile?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile & Tablet Top Header (Below 1024px) */}
      <header className="lg:hidden bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="font-black text-lg md:text-xl tracking-tighter uppercase italic text-white">Habit Tracker</span>
        </div>
        <button onClick={handleSignOut} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors">
          <LogOut className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5px]" />
        </button>
      </header>

      {/* Mobile & Tablet Bottom Navigation (Below 1024px) */}
      <nav className="lg:hidden fixed bottom-6 left-4 right-4 z-[90] bg-gray-900/90 backdrop-blur-2xl border border-white/5 px-6 py-4 flex items-center justify-around rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${location.pathname === item.path ? 'text-emerald-400 scale-110' : 'text-gray-500'
              }`}
          >
            <item.icon className={`w-6 h-6 ${location.pathname === item.path ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
        <Link to="/profile" className="flex flex-col items-center gap-1.5 text-gray-500 active:scale-90 transition-all">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[9px] md:text-[10px] font-black text-gray-400 uppercase">
            {profile?.name?.[0] || 'U'}
          </div>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Profile</span>
        </Link>
      </nav>

      <main className="flex-1 p-4 md:p-8 lg:p-10 flex flex-col min-h-screen pb-32 lg:pb-8">
        <div className="max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>

        <footer className="mt-12 pb-8 text-center lg:text-left border-t border-gray-900 pt-8 max-w-7xl mx-auto w-full">
          <p className="text-[8px] md:text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] flex flex-wrap items-center justify-center lg:justify-start gap-2">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" /> by
            <span className="text-gray-500">Shaik Haries Hussain</span>
          </p>
        </footer>
      </main>
    </div>
  );
};
