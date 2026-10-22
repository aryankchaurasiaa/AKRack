import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Printer, Building2 } from 'lucide-react';

export const CustomerBill = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  const SHOP_DETAILS = {
    name: "Ishan Hardware Center",
    address: "Ward No. 15, Munshi Premchand Nagar, Bharwal, Chauraha, Peppeganj, Sahbganj, Uttar Pradesh 273165",
    gst: "09ABCDE1234F1Z5",
    phone: "+91 9876543210"
  };

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const { data, error } = await supabase
          .from('bills')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setBill(data);
      } catch (error) {
        console.error("Error fetching bill:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="animate-pulse font-semibold">Loading Bill...</p></div>;
  }

  if (!bill) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-500 font-bold">Bill Not Found!</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex justify-center items-start print:p-0 print:bg-white print:block">
      
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none print:overflow-visible print:max-w-full">
        
        {/* Buttons Bar - Language toggle button yahan se hata diya gaya hai */}
        <div className="p-4 bg-slate-800 flex justify-end items-center gap-4 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-lg active:scale-95"
          >
            <Printer className="w-5 h-5" /> Download PDF / Print
          </button>
        </div>

        {/* Bill Content Area */}
        <div className="p-8 print:p-4 text-slate-900">
          
          {/* Shop Header */}
          <div className="text-center border-b-2 border-slate-200 pb-6 mb-6">
            <Building2 className="w-10 h-10 text-slate-800 mx-auto mb-2" />
            <h1 className="text-3xl font-black uppercase text-slate-900">{SHOP_DETAILS.name}</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">{SHOP_DETAILS.address}</p>
            <p className="text-sm font-semibold mt-1">Phone: {SHOP_DETAILS.phone}</p>
            {bill.is_gst_enabled && <p className="text-sm font-bold mt-1 text-slate-700">GSTIN: {SHOP_DETAILS.gst}</p>}
          </div>

          {/* Bill Details */}
          <div className="flex flex-col sm:flex-row justify-between mb-8 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Billed To:</p>
              <p className="font-bold text-lg uppercase">{bill.customer_name}</p>
              {bill.customer_phone && <p className="font-semibold text-slate-700">Ph: {bill.customer_phone}</p>}
            </div>
            <div className="sm:text-right mt-4 sm:mt-0">
              <p><span className="text-slate-500">Invoice No:</span> <span className="font-mono font-semibold">{bill.id.split('-')[0].toUpperCase()}</span></p>
              <p><span className="text-slate-500">Date:</span> <span className="font-semibold">{bill.bill_date}</span></p>
              <p><span className="text-slate-500">Time:</span> <span className="font-semibold">{bill.bill_time}</span></p>
              <p><span className="text-slate-500">Cashier:</span> <span className="font-semibold">{bill.cashier_name}</span></p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse mb-6">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="py-3 font-bold text-slate-700 w-12 text-center">#</th>
                <th className="py-3 font-bold text-slate-700">Item Description</th>
                <th className="py-3 font-bold text-slate-700 text-center">Qty</th>
                <th className="py-3 font-bold text-slate-700 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bill.cart_items.map((item, index) => (
                <tr key={index} className="print:break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                  <td className="py-3 text-center text-slate-500">{index + 1}</td>
                  <td className="py-3 font-medium">
                    {/* Yahan ab koi translation nahi hoga. Jo item name aapne save kiya hai wahi direct aayega */}
                    {item.nameEn || item.nameHi} 
                  </td>
                  <td className="py-3 text-center font-medium">{item.qty} <span className="text-xs text-slate-500">{item.unit}</span></td>
                  <td className="py-3 text-right font-bold">₹{Number(item.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end print:break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
            <div className="w-full sm:w-1/2 space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold">₹{Number(bill.sub_total).toFixed(2)}</span>
              </div>
              
              {bill.discount > 0 && (
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Discount</span>
                  <span className="font-semibold text-green-600">- ₹{Number(bill.discount).toFixed(2)}</span>
                </div>
              )}
              
              {bill.is_gst_enabled && (
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">GST (18%)</span>
                  <span className="font-semibold">+ ₹{Number(bill.gst_amount).toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between border-b-2 border-slate-800 py-2 text-lg">
                <span className="font-bold">Grand Total</span>
                <span className="font-black">₹{Number(bill.grand_total).toFixed(2)}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-600 font-medium">Amount Paid</span>
                <span className="font-bold">₹{Number(bill.amount_paid).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Remaining Balance</span>
                <span className={`font-bold ${bill.remaining_amount > 0 ? 'text-red-600' : 'text-slate-900'}`}>₹{Number(bill.remaining_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200 text-center print:break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
            <p className="font-bold text-slate-800">Thank You For Shopping!</p>
            <p className="text-xs text-slate-500 mt-1">Computer generated invoice. No signature required.</p>
          </div>

        </div>
      </div>
    </div>
  );
};