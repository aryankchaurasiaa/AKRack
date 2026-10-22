import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    productName: '',
    rackNumber: '',
    sellingPrice: '',
    lastPrice: '',
    stock: '',
    unit: 'Pcs' 
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        rackNumber: product.rackNumber || '',
        sellingPrice: product.sellingPrice || '',
        lastPrice: product.lastPrice || '',
        stock: product.stock || '',
        unit: product.unit || 'Pcs' 
      });
    } else {
      setFormData({
        productName: '',
        rackNumber: '',
        sellingPrice: '',
        lastPrice: '',
        stock: '',
        unit: 'Pcs'
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              placeholder="e.g. Iron Nails (Keel) 2 inch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rack Number</label>
            <input
              type="text"
              required
              value={formData.rackNumber}
              onChange={(e) => setFormData({ ...formData, rackNumber: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              placeholder="e.g. A1-2"
            />
          </div>
          
          {/* Unit Dropdown ko humne Upar kar diya taaki rate likhne se pehle unit select ho */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selling Unit</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="Pcs">Pcs (Pieces)</option>
              <option value="Kg">Kg (Kilogram)</option>
              <option value="Feet">Feet (Foot)</option>
              <option value="Mtr">Mtr (Meter)</option>
              <option value="Ltr">Ltr (Liter)</option>
              <option value="Box">Box (Pack)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* Yahan 'per Kg' ya 'per Pcs' khud aayega */}
              <label className="block text-sm font-bold text-brand-600 dark:text-brand-400 mb-1">
                Selling Price (₹ per {formData.unit})
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-300 dark:border-brand-600/50 bg-brand-50/50 dark:bg-brand-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Last Price (₹ per {formData.unit})
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.lastPrice}
                onChange={(e) => setFormData({ ...formData, lastPrice: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Total Stock Quantity (in {formData.unit})
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              placeholder="e.g. 50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
            >
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};