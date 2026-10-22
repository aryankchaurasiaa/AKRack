import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle } from 'lucide-react';

export const LowStock = () => {
  const { lowStockProducts } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400">Low Stock Alert Management</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Showing all hardware items with stock levels below 10 units. Restock promptly to avoid stockouts.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Product Name</th>
                <th className="py-4 px-6">Rack Number</th>
                <th className="py-4 px-6">Selling Price</th>
                <th className="py-4 px-6">Last Price</th>
                <th className="py-4 px-6">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{p.productName}</td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono">{p.rackNumber}</td>
                    <td className="py-4 px-6 text-slate-900 dark:text-white font-semibold">₹{p.sellingPrice}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">₹{p.lastPrice}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 font-semibold text-xs rounded-full ${
                        p.stock < 5 
                          ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' 
                          : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {p.stock} units ({p.stock < 5 ? 'Critical' : 'Warning'})
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    Fantastic! No low stock products at the moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};