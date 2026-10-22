import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase'; // <-- Database connect karne ke liye
import { Plus, Trash2, User, Phone, ShoppingCart, Receipt, CheckCircle, Languages, Building2, Tag } from 'lucide-react';

// ==========================================
// DETAILS OF SHOPE 
// ==========================================
const SHOP_DETAILS = {
  name: "Ishan Hardware Center",
  address: "Ward No. 15, Munshi Premchand Nagar, Bharwal, Chauraha, Peppeganj, Sahbganj, Uttar Pradesh 273165",
  gst: "09ABCDE1234F1Z5"
};

export const Billing = () => {
  // fetchAllData nikal liya taaki stock kam hone par list refresh ho sake
  const { products, fetchAllData } = useApp(); 
  const { user } = useAuth(); 

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState(''); 
  
  const [cart, setCart] = useState([]);
  const [billLanguage, setBillLanguage] = useState('en'); 
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // Naya loading state
  
  // Toggles & Financials
  const [isGSTEnabled, setIsGSTEnabled] = useState(true);
  const [showRate, setShowRate] = useState(false); 
  const [discountAmount, setDiscountAmount] = useState(''); 
  const [amountPaid, setAmountPaid] = useState('');

  const currentDate = new Date().toLocaleDateString('en-IN'); 

  const translateToHindi = async (text) => {
    try {
      const regex = /([0-9.]+\s*(ml|ltr|l|kg|g|gm|inch|"|cm|mm|ft|feet))/gi;
      let matchedUnits = text.match(regex) || [];
      
      let textToTranslate = text;
      matchedUnits.forEach((unit, idx) => {
        textToTranslate = textToTranslate.replace(unit, `__UNIT${idx}__`);
      });

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(textToTranslate)}`;
      const res = await fetch(url);
      const data = await res.json();
      let hindiTranslated = data[0][0][0]; 
      
      matchedUnits.forEach((unit, idx) => {
        const regexMarker = new RegExp(`__\\s*UNIT\\s*${idx}\\s*__`, 'gi');
        hindiTranslated = hindiTranslated.replace(regexMarker, ` ${unit} `);
      });

      return hindiTranslated.replace(/\s+/g, ' ').trim(); 
    } catch (e) {
      console.error("Translation error:", e);
      return text; 
    }
  };

  const handleProductSelect = (product) => {
    setSearchTerm(product.productName.replace(/\s*\(.*?\)\s*/g, ''));
    setSelectedProduct(product);
    setCustomPrice(product.sellingPrice);
    setShowDropdown(false);
  };

  const handleAddToCart = async () => {
    if (!searchTerm.trim() || quantity <= 0 || !customPrice) return;
    
    setIsTranslating(true);
    const itemNameEn = searchTerm.trim();
    const hindiName = await translateToHindi(itemNameEn);
    const priceToUse = Number(customPrice); 
    
    const cartItemId = selectedProduct ? selectedProduct.id : `manual-${Date.now()}`;
    const itemUnit = selectedProduct ? (selectedProduct.unit || 'Pcs') : 'Pcs'; 

    setCart(prev => {
      const existingItem = prev.find(item => item.id === cartItemId && item.price === priceToUse);
      if (existingItem && selectedProduct) {
        return prev.map(item => 
          item.id === cartItemId 
            ? { ...item, qty: item.qty + Number(quantity), total: (item.qty + Number(quantity)) * priceToUse }
            : item
        );
      } else {
        return [...prev, {
          id: cartItemId,
          nameEn: itemNameEn,
          nameHi: hindiName, 
          price: priceToUse,
          qty: Number(quantity),
          unit: itemUnit,
          total: priceToUse * Number(quantity)
        }];
      }
    });
    
    setSearchTerm('');
    setSelectedProduct(null);
    setQuantity(1);
    setCustomPrice('');
    setIsTranslating(false);
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const safeDiscount = Math.min(Number(discountAmount) || 0, subTotal); 
  const discountedSubTotal = subTotal - safeDiscount;
  
  const gstAmount = isGSTEnabled ? (discountedSubTotal * 0.18) : 0; 
  const grandTotalRounded = Math.round(discountedSubTotal + gstAmount);
  
  const remainingAmount = amountPaid !== '' ? grandTotalRounded - Number(amountPaid) : grandTotalRounded;

  // ==== BILL SAVE KARNE WALA MAIN LOGIC ====
  const handleGenerateBill = async () => {
    if (cart.length === 0) {
      alert("Please add at least one item to generate the bill!");
      return;
    }

    setIsGenerating(true);

    try {
      const now = new Date();
      const generatedTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }); 

      const finalBillData = {
        customer_name: customerName || 'Cash Customer',
        customer_phone: customerPhone || '',
        cart_items: cart,
        sub_total: subTotal,
        discount: safeDiscount,
        discounted_sub_total: discountedSubTotal,
        gst_amount: gstAmount,
        grand_total: grandTotalRounded,
        amount_paid: Number(amountPaid) || 0,
        remaining_amount: remainingAmount,
        is_gst_enabled: isGSTEnabled,
        bill_date: currentDate, 
        bill_time: generatedTime, 
        cashier_name: user?.fullName || 'Admin'
      };

      // 1. Database me Bill Insert Karna
      const { error: billError } = await supabase
        .from('bills')
        .insert([finalBillData]);

      if (billError) throw billError;

      // 2. Stock Kam Karna (Inventory Management)
      for (const item of cart) {
        // Agar id 'manual-' se shuru hoti hai to wo database ka hissa nahi hai, use skip karo
        if (!item.id.toString().startsWith('manual-')) {
          const productInDb = products.find(p => p.id === item.id);
          if (productInDb) {
            // Naya stock = Purana stock minus Quantity
            const newStock = Math.max(0, Number(productInDb.stock) - Number(item.qty));
            
            await supabase
              .from('products')
              .update({ stock: newStock })
              .eq('id', item.id);
          }
        }
      }

      // 3. System ko refresh karna taaki naya stock baki app me dikhe
      if (fetchAllData) fetchAllData();

      alert(`Bill Successfully Saved to Database!\n\nTotal: ₹${grandTotalRounded}\nDiscount: ₹${safeDiscount}\nPaid: ₹${Number(amountPaid) || 0}\nRemaining: ₹${remainingAmount}`);
      
      // 4. Agle customer ke liye form clear karna
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setAmountPaid('');
      setDiscountAmount('');
      setSearchTerm('');

    } catch (error) {
      console.error("Bill generation error:", error);
      alert("Error saving bill. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-600 dark:text-brand-400" /> New Sale / Billing
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create a bill, customize rates, and auto-translate to Hindi.
          </p>
        </div>
        
        {/* Language Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Languages className="w-4 h-4 text-slate-500 ml-2" />
          <button 
            onClick={() => setBillLanguage('en')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${billLanguage === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}
          >
            English
          </button>
          <button 
            onClick={() => setBillLanguage('hi')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${billLanguage === 'hi' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}
          >
            हिंदी
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Details */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Customer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter name"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="10-digit number"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add Products */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Search or Manually Add Item</h4>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              
              <div className="flex-1 w-full relative">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedProduct(null); 
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setShowDropdown(false)}
                  placeholder="Type to search or add new..."
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                />
                
                {showDropdown && searchTerm && (
                  <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {products.filter(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                      <li 
                        key={p.id} 
                        onMouseDown={(e) => { e.preventDefault(); handleProductSelect(p); }}
                        className="px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 last:border-0"
                      >
                        {p.productName.replace(/\s*\(.*?\)\s*/g, '')} <span className="text-xs text-slate-400">(Stock: {p.stock})</span>
                      </li>
                    ))}
                    {products.filter(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                      <li className="px-4 py-2 text-xs text-slate-500 italic">
                        Not found. Will be added as Manual Item.
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="w-full md:w-28">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Rate (₹)</label>
                <input 
                  type="number" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                />
              </div>

              <div className="w-full md:w-24">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Qty</label>
                <input 
                  type="number" min="0.1" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                />
              </div>

              <button 
                onClick={handleAddToCart} disabled={!searchTerm.trim() || isTranslating}
                className="w-full md:w-auto px-6 py-2 bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[38px]"
              >
                {isTranslating ? <span className="animate-pulse">Adding...</span> : <><Plus className="w-4 h-4" /> Add</>}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Bill Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col min-h-[600px] h-auto">
          
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-brand-50 dark:bg-slate-800/80 rounded-t-2xl text-center transition-all duration-300">
            <Building2 className="w-6 h-6 text-brand-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{SHOP_DETAILS.name}</h4>
            <p className="text-[10px] text-slate-500 leading-tight mt-1 px-4">{SHOP_DETAILS.address}</p>
            
            {isGSTEnabled && (
              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-1">GSTIN: {SHOP_DETAILS.gst}</p>
            )}

            <div className="flex justify-between items-end mt-4 border-t border-slate-200 dark:border-slate-700 pt-3 px-1 text-left">
              <div>
                <p className="text-[10px] text-slate-500 mb-0.5">Bill To:</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">{customerName || 'Cash Customer'}</p>
                {customerPhone && <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Ph: {customerPhone}</p>}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 mb-0.5">Cashier: <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.fullName || 'Admin'}</span></p>
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Date: {currentDate}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 max-h-[300px]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                <ShoppingCart className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">Bill is empty</p>
              </div>
            ) : (
              <div className="w-full text-sm">
                
                <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2 mb-3 px-2">
                  <div className="w-6 text-center">S.No</div>
                  <div className="flex-1 pl-2">Product</div>
                  {showRate && <div className="w-16 text-right">Rate</div>}
                  <div className="w-16 text-center">Qty</div>
                  <div className="w-20 text-right">Amount</div>
                  <div className="w-6"></div>
                </div>

                <div className="space-y-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="w-6 text-center text-[10px] font-semibold text-slate-500">{index + 1}.</div>
                      <div className="flex-1 pl-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                          {billLanguage === 'hi' ? item.nameHi : item.nameEn.replace(/\s*\(.*?\)\s*/g, '')}
                        </p>
                      </div>
                      {showRate && (
                        <div className="w-16 text-right text-xs text-slate-600 dark:text-slate-400">₹{item.price}</div>
                      )}
                      <div className="w-16 text-center text-xs font-medium text-slate-700 dark:text-slate-300">
                        {item.qty} {item.unit}
                      </div>
                      <div className="w-20 text-right font-bold text-slate-700 dark:text-slate-300">₹{item.total}</div>
                      <div className="w-6 flex justify-end">
                        <button 
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl space-y-2.5">
            
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Show Rate in Bill</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={showRate} onChange={() => setShowRate(!showRate)} />
                <div className="w-9 h-5 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isGSTEnabled ? 'Pakka Bill (with GST)' : 'Kaccha Bill (No GST)'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isGSTEnabled} onChange={() => setIsGSTEnabled(!isGSTEnabled)} />
                <div className="w-9 h-5 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">₹{subTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-brand-600 dark:text-brand-400 text-sm font-medium flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Discount (₹)
              </span>
              <input 
                type="number" 
                min="0"
                max={subTotal}
                value={discountAmount} 
                onChange={(e) => setDiscountAmount(e.target.value)} 
                placeholder="0"
                className="w-20 px-2 py-0.5 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-md text-sm focus:ring-1 focus:ring-brand-500 outline-none dark:text-brand-300 text-right font-medium"
              />
            </div>
            
            {isGSTEnabled && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">GST (18%)</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">+ ₹{gstAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-800 dark:text-slate-200 font-bold">Grand Total</span>
              <span className="text-2xl font-black text-brand-600 dark:text-brand-400">₹{grandTotalRounded}</span>
            </div>

            <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Amount Paid (₹)</span>
              <input 
                type="number" 
                min="0"
                value={amountPaid} 
                onChange={(e) => setAmountPaid(e.target.value)} 
                placeholder="0"
                className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-white text-right font-bold"
              />
            </div>
            
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Remaining Bal.</span>
              <span className={`text-lg font-bold ${remainingAmount > 0 ? 'text-red-500' : 'text-green-500 dark:text-green-400'}`}>
                ₹{remainingAmount}
              </span>
            </div>
            
            <button 
              onClick={handleGenerateBill}
              disabled={isGenerating}
              className="w-full mt-3 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                 <span className="animate-pulse">Saving Bill...</span>
              ) : (
                <><CheckCircle className="w-5 h-5" /> Generate Bill</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};