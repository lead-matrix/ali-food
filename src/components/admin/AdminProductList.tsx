import React, { useState } from 'react';
import { Search, Edit3, Eye, EyeOff, Check, X, Plus, Sparkles, AlertCircle, Save } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Product } from '../../types';
import { formatBDT } from '../../utils/whatsapp';

export const AdminProductList: React.FC = () => {
  const { products, updateProductRate, toggleProductPriceVisibility, toggleProductActive, updateProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number>(0);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(search.toLowerCase()) ||
    p.processingSpecification.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditRate(p.rate);
  };

  const saveRate = (p: Product) => {
    updateProductRate(p.id, editRate);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Wholesale Catalog & Official Rate Schedule</h3>
          <p className="text-xs text-slate-400">
            Real-time price updating, quote toggle, and inventory active status.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Table of Products */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Sl</th>
                <th className="py-3 px-4">Product Name & Category</th>
                <th className="py-3 px-4">Supply Form</th>
                <th className="py-3 px-4">Official Rate (BDT)</th>
                <th className="py-3 px-4">Price Visibility</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map(product => {
                const isEditing = editingId === product.id;
                return (
                  <tr key={product.id} className="hover:bg-slate-850/50 transition-colors">
                    {/* Sl */}
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {product.sl}
                    </td>

                    {/* Product Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{product.name}</div>
                      <div className="text-[11px] text-slate-400">{product.categoryName}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{product.processingSpecification}</div>
                    </td>

                    {/* Supply Form */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                        {product.supplyForm}
                      </span>
                    </td>

                    {/* Rate Editing */}
                    <td className="py-3 px-4 font-mono">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">৳</span>
                          <input
                            type="number"
                            value={editRate}
                            onChange={e => setEditRate(Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded bg-slate-800 border border-amber-500 text-white text-xs font-mono focus:outline-none"
                          />
                          <button
                            onClick={() => saveRate(product)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                            title="Save rate"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {formatBDT(product.rate)}
                          </span>
                          <span className="text-[11px] text-slate-400">/ {product.unit}</span>
                          <button
                            onClick={() => startEdit(product)}
                            className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                            title="Edit rate"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Price Visibility Switch */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleProductPriceVisibility(product.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          product.priceVisible
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {product.priceVisible ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>SHOW PRICE</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-amber-400" />
                            <span>REQUEST QUOTE</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Active/Inactive */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleProductActive(product.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          product.active
                            ? 'bg-slate-800 text-emerald-400'
                            : 'bg-red-950 text-red-400 border border-red-900'
                        }`}
                      >
                        {product.active ? 'Active' : 'Archived'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => startEdit(product)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                      >
                        Quick Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
