import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ProductModal } from '../components/ProductModal';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter by Product Name (Partial Match) OR Rack Number (Exact Match)
  const filteredProducts = products.filter(p => {
    const q = searchQuery.trim().toLowerCase();
    
    if (!q) return true; 

    const matchesName = p.productName?.toLowerCase().includes(q);
    const matchesRack = p.rackNumber?.trim().toLowerCase() === q;

    return matchesName || matchesRack;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (formData) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, formData);
    } else {
      addProduct(formData);
    }
  };

  // Stock aur Unit ka badge (Jaise: 25 Pcs, 10.5 Kg, 5 Ltr)
  const getStockBadge = (stock, unit) => {
    const displayUnit = unit || 'Pcs'; 
    if (stock > 10) {
      return <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold text-xs rounded-full">{stock} {displayUnit} (In Stock)</span>;
    } else if (stock >= 5) {
      return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 font-semibold text-xs rounded-full">{stock} {displayUnit} (Medium)</span>;
    } else {
      return <span className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-semibold text-xs rounded-full">{stock} {displayUnit} (Low Stock)</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by Product Name or Rack Number..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-md shadow-brand-600/20 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        )}
      </div>

      {/* Responsive Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Product Name</th>
                <th className="py-4 px-6">Rack Number</th>
                {/* Naya Column: Rate Type (Per Unit) */}
                <th className="py-4 px-6">Rate (Per Unit)</th>
                <th className="py-4 px-6">Selling Price</th>
                {/* Last Price wapas add kar diya */}
                <th className="py-4 px-6">Last Price</th>
                <th className="py-4 px-6">Stock & Unit</th>
                {isAdmin && <th className="py-4 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    
                    {/* Product name se bracket hide hoga */}
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                      {p.productName.replace(/\s*\(.*?\)\s*/g, '')} 
                    </td>

                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono">{p.rackNumber}</td>
                    
                    {/* Rate Unit ka box */}
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-600">
                        ₹ / {p.unit || 'Pcs'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-900 dark:text-white font-semibold">₹{p.sellingPrice}</td>
                    
                    {/* Last Price ka data */}
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">₹{p.lastPrice}</td>
                    
                    <td className="py-4 px-6">{getStockBadge(p.stock, p.unit)}</td>
                    
                    {isAdmin && (
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/40 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/40 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing page <span className="font-semibold text-slate-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </div>
  );
};