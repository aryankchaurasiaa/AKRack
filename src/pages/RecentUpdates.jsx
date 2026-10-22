import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock } from 'lucide-react';

export const RecentUpdates = () => {
  const { recentUpdates } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">Recent Inventory Updates</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Chronological audit log of recently modified or added hardware products.
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
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              {recentUpdates.length > 0 ? (
                recentUpdates.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{p.productName}</td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono">{p.rackNumber}</td>
                    <td className="py-4 px-6 text-slate-900 dark:text-white font-semibold">₹{p.sellingPrice}</td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{p.stock}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(p.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No recent updates recorded.
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