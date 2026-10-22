import React from 'react';
import { Info, Code, User, ShieldCheck } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl p-8 text-white shadow-xl shadow-brand-600/10 flex items-center gap-6">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
          <Info className="w-8 h-8 text-brand-100" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">About AKRack</h2>
          <p className="text-brand-100 mt-1 text-sm">Version 5.16.0 | Smart Hardware Shop Price & Stock Manager</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Developer Info</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            This application was exclusively designed and developed by <span className="font-bold text-brand-600 dark:text-brand-400">ARYAN KUMAR And Comes Under Arkum Technologies</span>. It aims to streamline hardware shop inventory, track low stocks, and manage employees securely.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Security</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            AKRack is equipped with strict Role-Based Access Control (RBAC). Super Admins control Shop Admins. Shop Admins control Employees and Products. Employees have view-only access.
          </p>
        </div>
      </div>
    </div>
  );
};