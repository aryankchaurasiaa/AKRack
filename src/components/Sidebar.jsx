import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, AlertTriangle, Clock, Users, Settings, LogOut, Info, Receipt, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSuperAdmin = user?.role === 'Super Admin';
  const isAdmin = user?.role === 'Admin';
  const isDemo = user?.role === 'Demo'; // <-- Naya Demo Role Check

  const navItems = [];

  // Super Admin ko sirf Manage Admins dikhega
  if (isSuperAdmin) {
    navItems.push({ to: '/', label: 'Dashboard', icon: LayoutDashboard });
    navItems.push({ to: '/employees', label: 'Manage Admins', icon: Users });
  } 
  // Admin (Shop Owner) ka menu
  else if (isAdmin) {
    navItems.push({ to: '/', label: 'Dashboard', icon: LayoutDashboard });
    navItems.push({ to: '/billing', label: 'Billing / Sales', icon: Receipt }); 
    navItems.push({ to: '/bills', label: 'Bill History', icon: FileText });
    navItems.push({ to: '/products', label: 'Products', icon: Package });
    navItems.push({ to: '/low-stock', label: 'Low Stock', icon: AlertTriangle });
    navItems.push({ to: '/recent-updates', label: 'Recent Updates', icon: Clock });
    navItems.push({ to: '/employees', label: 'Manage Employees', icon: Users });
  } 
  // Demo User (College Presentation / Guest) ka menu
  else if (isDemo) {
    navItems.push({ to: '/demo-dashboard', label: 'Dashboard', icon: LayoutDashboard });
    navItems.push({ to: '/products', label: 'Products', icon: Package }); // View Only access ke liye
  }
  // Normal Employee ka menu
  else {
    navItems.push({ to: '/', label: 'Dashboard', icon: LayoutDashboard });
    navItems.push({ to: '/billing', label: 'Billing / Sales', icon: Receipt }); 
    navItems.push({ to: '/bills', label: 'Bill History', icon: FileText });
    navItems.push({ to: '/products', label: 'Products', icon: Package });
    navItems.push({ to: '/low-stock', label: 'Low Stock', icon: AlertTriangle });
    navItems.push({ to: '/recent-updates', label: 'Recent Updates', icon: Clock });
  }

  // Demo user ko Settings na dikhe, baaki sabko dikhe
  if (!isDemo) {
    navItems.push({ to: '/settings', label: 'Settings', icon: Settings });
  }
  
  navItems.push({ to: '/about', label: 'About', icon: Info }); 

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col h-screen sticky top-0 transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700 gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
          AK
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">AKRack</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Hardware Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm">
            {user?.fullName?.charAt(0) || (isDemo ? 'D' : 'U')}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.fullName || 'Guest User'}</p>
            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded">
              {user?.role || 'Guest'}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};