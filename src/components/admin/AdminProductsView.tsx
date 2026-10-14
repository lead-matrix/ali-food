import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Edit, Eye, EyeOff, Check, X } from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { BillingProduct } from '../../lib/db/types';
import { formatBDT } from '../../utils/formatters';

interface AdminProductsViewProps {
  repo: IRepository;
}

export const AdminProductsView: React.FC<AdminProductsViewProps> = ({ repo }) => {
  const [products, setProducts] = useState<BillingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<BillingProduct> | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const list = await repo.getProducts();
      setProducts(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleActive = async (p: BillingProduct) => {
    await repo.saveProduct({ id: p.id, active: !p.active });
    loadProducts();
  };

  const handleTogglePriceVisible = async (p: BillingProduct) => {
    await repo.saveProduct({ id: p.id, priceVisible: !p.priceVisible });
    loadProducts();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;
    try {
      await repo.saveProduct(editingProduct);
      setEditingProduct(null);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const filtered = products.filter((p) => {
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.supplyForm || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Product Catalog & Official Rates</span>
          </h2>
          <p className="text-xs text-slate-400">
            Base rates and specifications referenced by dispatches, challans, and invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 w-48"
            />
          </div>

          <button
            onClick={() => {
              setEditingProduct({
                name: '',
                supplyForm: 'Chilled/Frozen',
                unit: 'Kg',
                rate: 350,
                active: true,
                priceVisible: true,
              });
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Item</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-5">Sl</th>
                <th className="py-3 px-5">Product Name</th>
                <th className="py-3 px-5">Supply Form</th>
                <th className="py-3 px-5">Unit</th>
                <th className="py-3 px-5 text-right">Official Rate</th>
                <th className="py-3 px-5 text-center">Public Visibility</th>
                <th className="py-3 px-5 text-center">Active Status</th>
                <th className="py-3 px-5 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-5 font-mono text-slate-400 font-bold">{p.sl}</td>
                  <td className="py-3 px-5">
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{p.notes}</div>
                  </td>
                  <td className="py-3 px-5">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {p.supplyForm}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-slate-300 font-medium">{p.unit}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold text-amber-400 text-sm">
                    {formatBDT(p.rate)}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <button
                      onClick={() => handleTogglePriceVisible(p)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.priceVisible ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p.priceVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{p.priceVisible ? 'Shown' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {p.active ? 'Active' : 'Archived'}
                    </button>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">
                {editingProduct.id ? 'Edit Product Rate & Spec' : 'Add New Commercial Cut'}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broiler Breast Meat (Boneless)"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Official Rate (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.rate || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Unit</label>
                  <select
                    value={editingProduct.unit || 'Kg'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Piece">Piece</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Supply Form</label>
                <input
                  type="text"
                  placeholder="e.g. Chilled Fresh / Skinless Dressed"
                  value={editingProduct.supplyForm || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, supplyForm: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Processing Notes / Specs</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Precision evisceration, chlorinated chilled bath"
                  value={editingProduct.notes || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
