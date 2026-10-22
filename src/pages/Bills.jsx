import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Search, Eye, MessageCircle, FileText, Trash2 } from 'lucide-react'; // Trash2 icon import kiya

export const Bills = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false }); 

      if (error) throw error;
      setBills(data || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==== BILL DELETE KARNE KA FUNCTION ====
  const handleDeleteBill = async (id) => {
    const isConfirmed = window.confirm("Kya aap sach mein is bill ko delete karna chahte hain? (Ye hamesha ke liye delete ho jayega)");
    
    if (isConfirmed) {
      try {
        // Database se delete kar rahe hain
        const { error } = await supabase
          .from('bills')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // UI (Screen) se bhi turant gayab karne ke liye state update kar rahe hain
        setBills(bills.filter(bill => bill.id !== id));
        
        alert("Bill successfully delete ho gaya!");
      } catch (error) {
        console.error("Error deleting bill:", error);
        alert("Bill delete karne mein problem aayi.");
      }
    }
  };

  const filteredBills = bills.filter(b => {
    const q = searchQuery.toLowerCase();
    return (
      (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
      (b.customer_phone && b.customer_phone.includes(q))
    );
  });

  const openWhatsApp = (phone, id, name) => {
    if (!phone) {
      alert("Customer ka phone number nahi hai!");
      return;
    }
    const billLink = `${window.location.origin}/bill/${id}`;
    const message = `Hello ${name}, aapka Ishan Hardware Center ka bill yahan check karein: ${billLink}`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" /> Bill History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sabhi generated bills yahan dekhein aur manage karein.
          </p>
        </div>

        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name or Phone..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Customer Details</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Paid</th>
                <th className="py-4 px-6">Remaining</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <span className="animate-pulse">Loading bills...</span>
                  </td>
                </tr>
              ) : filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900 dark:text-white">{bill.bill_date}</p>
                      <p className="text-xs text-slate-500">{bill.bill_time}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900 dark:text-white uppercase">{bill.customer_name}</p>
                      {bill.customer_phone && <p className="text-xs text-slate-500">{bill.customer_phone}</p>}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      ₹{bill.grand_total}
                    </td>
                    <td className="py-4 px-6 text-green-600 dark:text-green-400 font-semibold">
                      ₹{bill.amount_paid}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${bill.remaining_amount > 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                        ₹{bill.remaining_amount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 flex justify-end">
                      
                      {/* WhatsApp Button */}
                      <button
                        onClick={() => openWhatsApp(bill.customer_phone, bill.id, bill.customer_name)}
                        className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors flex items-center gap-1"
                        title="Send on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      {/* View / Print Bill Button */}
                      <button
                        onClick={() => window.open(`/bill/${bill.id}`, '_blank')}
                        className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/40 rounded-lg text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1"
                        title="View / PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteBill(bill.id)}
                        className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors flex items-center gap-1"
                        title="Delete Bill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No bills found.
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