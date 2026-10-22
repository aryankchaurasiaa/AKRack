import React from 'react';
// RefreshCw icon ko naya add kiya gaya hai
import { Package, AlertTriangle, Users, ShieldCheck, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  // fetchAllData ko AppContext se nikal liya gaya hai
  const { totalProducts, lowStockProducts, employees, fetchAllData } = useApp();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'Super Admin';
  const adminCount = employees.filter(e => e.role === 'Admin').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl p-8 text-white shadow-xl shadow-brand-600/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        {/* Banner container ko responsive banaya gaya hai taaki mobile par bhi Refresh button theek se dikhe */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome to AKRack</h2>
            <p className="text-brand-100 max-w-xl leading-relaxed">
              {isSuperAdmin 
                ? "Super Admin Control Panel. Manage shop administrators securely." 
                : "Smart Hardware Shop Price & Stock Manager. Monitor your live inventory seamlessly."}
            </p>
          </div>
          
          {/* Action Buttons Section */}
          <div className="flex items-center gap-3">
            {/* Naya Refresh Button (Mobile + Desktop dono par chalega) */}
            <button
              onClick={fetchAllData}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Refresh Live Data"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-sm font-medium">Refresh</span>
            </button>

            {/* Purana System Status (Sirf badi screen par) */}
            <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
              <ShieldCheck className="w-5 h-5 text-brand-100" />
              <span className="text-sm font-medium">System Status: <span className="text-green-300">Operational</span></span>
            </div>
          </div>
        </div>
      </div>

      {isSuperAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-2xl text-brand-600 dark:text-brand-400">
                <Users className="w-6 h-6" />
              </div>
              <Link to="/employees" className="text-sm font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Manage &rarr;
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Shop Admins</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{adminCount}</h3>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Inventory Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-2xl text-brand-600 dark:text-brand-400">
                  <Package className="w-6 h-6" />
                </div>
                <Link to="/products" className="text-sm font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View All &rarr;
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Products</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalProducts}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <Link to="/low-stock" className="text-sm font-semibold text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Low Stock &rarr;
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Low Stock Items</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{lowStockProducts.length}</h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};