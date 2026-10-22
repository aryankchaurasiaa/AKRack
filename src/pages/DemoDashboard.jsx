import React from 'react';
import { IndianRupee, FileText, Package, AlertCircle } from 'lucide-react';

export const DemoDashboard = () => {
  // Dummy Data for College Presentation
  const stats = [
    { title: "Today's Sales", value: "₹12,450", icon: <IndianRupee className="w-6 h-6 text-green-600" />, bg: "bg-green-100" },
    { title: "Total Bills Today", value: "24", icon: <FileText className="w-6 h-6 text-blue-600" />, bg: "bg-blue-100" },
    { title: "Total Products", value: "1,432", icon: <Package className="w-6 h-6 text-purple-600" />, bg: "bg-purple-100" },
    { title: "Low Stock Items", value: "18", icon: <AlertCircle className="w-6 h-6 text-red-600" />, bg: "bg-red-100" }
  ];

  const dummyBills = [
    { id: "INV-1021", name: "Rahul Verma", items: 4, total: "₹4,200", time: "10:45 AM" },
    { id: "INV-1022", name: "Suresh Builders", items: 12, total: "₹18,500", time: "11:30 AM" },
    { id: "INV-1023", name: "Amit Singh", items: 2, total: "₹850", time: "01:15 PM" },
    { id: "INV-1024", name: "Priya Sharma", items: 1, total: "₹120", time: "02:00 PM" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard (View Only)</h1>
          <p className="text-slate-500">Welcome to AKRack - Guest Mode</p>
        </div>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-semibold text-sm">
          Presentation Mode Active
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bills (Dummy) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Invoice ID</th>
                <th className="p-4 font-semibold text-slate-600">Customer Name</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Items</th>
                <th className="p-4 font-semibold text-slate-600">Total Amount</th>
                <th className="p-4 font-semibold text-slate-600">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dummyBills.map((bill, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-brand-600">{bill.id}</td>
                  <td className="p-4 font-medium text-slate-800">{bill.name}</td>
                  <td className="p-4 text-center text-slate-600">{bill.items}</td>
                  <td className="p-4 font-bold text-slate-800">{bill.total}</td>
                  <td className="p-4 text-slate-500">{bill.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};