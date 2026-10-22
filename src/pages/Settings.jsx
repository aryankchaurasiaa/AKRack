import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Lock, User, Shield, Check } from 'lucide-react';

export const Settings = () => {
  const { darkMode, toggleDarkMode } = useApp();
  const { user, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [successMsg, setSuccessMsg] = useState('');

  const [passData, setPassData] = useState({ current: '', newPass: '', confirm: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile({ fullName });
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (passData.newPass !== passData.confirm) {
      setPassError('New passwords do not match.');
      return;
    }

    if (passData.newPass.length < 4) {
      setPassError('Password must be at least 4 characters.');
      return;
    }

    setPassSuccess('Password updated successfully!');
    setPassData({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPassSuccess(''), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      {/* Theme Settings */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Appearance Settings</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200">Dark Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark UI themes.</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            {darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
          </button>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Profile Information</h3>
        {successMsg && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" /> {successMsg}
          </div>
        )}
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
              <input
                type="text"
                disabled
                value={user?.username || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-md shadow-brand-600/20 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Change Password</h3>
        {passError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {passError}
          </div>
        )}
        {passSuccess && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" /> {passSuccess}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={passData.newPass}
              onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={passData.confirm}
              onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-md shadow-brand-600/20 transition-colors"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};