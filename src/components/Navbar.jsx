import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Sun, Moon } from 'lucide-react';

export const Navbar = ({ title }) => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
        
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.fullName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">@{user?.username}</p>
        </div>
      </div>
    </header>
  );
};