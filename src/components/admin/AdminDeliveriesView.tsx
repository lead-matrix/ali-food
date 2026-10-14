import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Calendar, 
  Plus, 
  Search, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit, 
  X, 
  Check, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { Delivery, DeliveryItem, Client, BillingProduct } from '../../lib/db/types';
import { formatBDT, formatDate } from '../../utils/formatters';
import { generateDeliveryChallanPDF } from '../../utils/pdfGenerator';

interface AdminDeliveriesViewProps {
  repo: IRepository;
  onOpenInvoiceTab?: () => void;
}

export const AdminDeliveriesView: React.FC<AdminDeliveriesViewProps> = ({ repo, onOpenInvoiceTab }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<BillingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Conversion selection
  const [selectedForInvoice, setSelectedForInvoice] = useState<string[]>([]);

  // Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Partial<Delivery> | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dList, cList, pList] = await Promise.all([
        repo.getDeliveries(),
        repo.getClients(),
        repo.getProducts(),
      ]);
      setDeliveries(dList);
      setClients(cList);
      setProducts(pList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePrintChallan = async (delivery: Delivery) => {
    try {
      const settings = await repo.getSettings();
      generateDeliveryChallanPDF(delivery, settings);
    } catch (e) {
      alert('Failed to generate delivery challan PDF');
    }
  };

  const handleStatusChange = async (deliveryId: string, status: Delivery['status']) => {
    try {
      const found = deliveries.find((d) => d.id === deliveryId);
      if (found) {
        await repo.saveDelivery({ id: deliveryId, status });
        loadData();
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleConvertToInvoice = async () => {
    if (selectedForInvoice.length === 0) return;

    // Check all selected belong to the same client
    const selectedDels = deliveries.filter((d) => selectedForInvoice.includes(d.id));
    const firstClient = selectedDels[0].clientId;
    const sameClient = selectedDels.every((d) => d.clientId === firstClient);

    if (!sameClient) {
      alert('Please select deliveries belonging to the same client to convert into a single invoice statement.');
      return;
    }

    try {
      await repo.convertDeliveriesToInvoice(firstClient, selectedForInvoice);
      alert(`Successfully generated Invoice from ${selectedForInvoice.length} delivery(ies)!`);
      setSelectedForInvoice([]);
      loadData();
      if (onOpenInvoiceTab) onOpenInvoiceTab();
    } catch (err: any) {
      alert(err.message || 'Failed to convert deliveries to invoice');
    }
  };

  // Filtered deliveries
  const filtered = deliveries.filter((d) => {
    if (selectedDate && d.date !== selectedDate) return false;
    if (selectedClientId !== 'all' && d.clientId !== selectedClientId) return false;
    if (selectedStatus !== 'all' && d.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Pre-Dawn Dispatch & Deliveries</span>
          </h2>
          <p className="text-xs text-slate-400">
            Daily route schedules, challan generation, and conversion to invoice statements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Calendar Picker */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none"
            />
            {selectedDate && (
              <button onClick={() => setSelectedDate('')} className="text-slate-400 hover:text-white ml-1">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Client Filter */}
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Log Delivery Button */}
          <button
            onClick={() => {
              setEditingDelivery({
                date: new Date().toISOString().split('T')[0],
                status: 'scheduled',
                items: [
                  {
                    id: '',
                    deliveryId: '',
                    productName: products[0]?.name || 'Broiler Breast Meat (Boneless)',
                    qty: 20,
                    unit: 'Kg',
                    rate: products[0]?.rate || 420,
                    amount: 8400,
                  },
                ],
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Delivery</span>
          </button>
        </div>
      </div>

      {/* Batch Conversion Action Strip */}
      {selectedForInvoice.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">
              {selectedForInvoice.length} delivery(ies) selected for billing statement.
            </span>
          </div>
          <button
            onClick={handleConvertToInvoice}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow"
          >
            <FileText className="w-4 h-4" />
            <span>Convert to Invoice Statement</span>
          </button>
        </div>
      )}

      {/* Deliveries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-4 text-center">Select</th>
                <th className="py-3 px-4">Challan #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Driver / Vehicle</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4 text-right">Gross Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((del) => {
                const isSelected = selectedForInvoice.includes(del.id);
                return (
                  <tr key={del.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-center">
                      {!del.invoiceId && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedForInvoice([...selectedForInvoice, del.id]);
                            } else {
                              setSelectedForInvoice(selectedForInvoice.filter((id) => id !== del.id));
                            }
                          }}
                          className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                        />
                      )}
                      {del.invoiceId && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold" title="Invoiced">
                          [INV]
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {del.deliveryNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {formatDate(del.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{del.clientCompany || del.clientName}</div>
                      <div className="text-[11px] text-slate-400">{del.clientName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {del.vehicleDriver || 'Pre-dawn Van DH-12'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {del.items.map((i) => `${i.productName} (${i.qty} ${i.unit})`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                      {formatBDT(del.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={del.status}
                        onChange={(e) => handleStatusChange(del.id, e.target.value as any)}
                        className={`text-[10px] font-bold uppercase rounded px-2 py-1 border focus:outline-none ${
                          del.status === 'delivered'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : del.status === 'out_for_delivery'
                            ? 'bg-blue-950 text-blue-400 border-blue-800'
                            : del.status === 'cancelled'
                            ? 'bg-red-950 text-red-400 border-red-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handlePrintChallan(del)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        title="Print Official Delivery Challan"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span>Challan</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT DELIVERY MODAL */}
      {isModalOpen && editingDelivery && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-white">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingDelivery.id ? 'Edit Delivery' : 'Log New Pre-Dawn Delivery'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingDelivery.clientId) {
                  alert('Please select a client');
                  return;
                }
                try {
                  await repo.saveDelivery(editingDelivery);
                  setIsModalOpen(false);
                  loadData();
                } catch (err: any) {
                  alert(err.message || 'Failed to save delivery');
                }
              }}
              className="p-6 overflow-y-auto space-y-4 flex-1 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Select Client Account *</label>
                  <select
                    required
                    value={editingDelivery.clientId || ''}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Choose Client --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Dispatch Date *</label>
                  <input
                    type="date"
                    required
                    value={editingDelivery.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Vehicle / Driver Details</label>
                  <input
                    type="text"
                    placeholder="e.g. Pickup Van DH-12 (Driver: Rahman)"
                    value={editingDelivery.vehicleDriver || ''}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, vehicleDriver: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Initial Dispatch Status</label>
                  <select
                    value={editingDelivery.status || 'scheduled'}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300">Poultry / Dressed Cut Items</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [
                        ...(editingDelivery.items || []),
                        {
                          id: '',
                          deliveryId: '',
                          productName: products[0]?.name || 'Broiler Dressed',
                          qty: 10,
                          unit: 'Kg',
                          rate: products[0]?.rate || 245,
                          amount: 2450,
                        },
                      ];
                      setEditingDelivery({ ...editingDelivery, items: newItems });
                    }}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    + Add Another Item
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingDelivery.items || []).map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <div className="col-span-5">
                        <select
                          value={item.productName}
                          onChange={(e) => {
                            const pName = e.target.value;
                            const prod = products.find((p) => p.name === pName);
                            const updated = [...(editingDelivery.items || [])];
                            updated[idx] = {
                              ...item,
                              productName: pName,
                              rate: prod?.rate || item.rate,
                              unit: prod?.unit || item.unit,
                              amount: (prod?.rate || item.rate) * item.qty,
                            };
                            setEditingDelivery({ ...editingDelivery, items: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) => {
                            const qty = parseFloat(e.target.value) || 0;
                            const updated = [...(editingDelivery.items || [])];
                            updated[idx] = { ...item, qty, amount: qty * item.rate };
                            setEditingDelivery({ ...editingDelivery, items: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => {
                            const rate = parseFloat(e.target.value) || 0;
                            const updated = [...(editingDelivery.items || [])];
                            updated[idx] = { ...item, rate, amount: item.qty * rate };
                            setEditingDelivery({ ...editingDelivery, items: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                        />
                      </div>

                      <div className="col-span-2 font-mono font-bold text-right text-amber-400">
                        {formatBDT(item.amount)}
                      </div>

                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingDelivery.items || []).filter((_, i) => i !== idx);
                            setEditingDelivery({ ...editingDelivery, items: updated });
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Drop-off specifications, master packs, temperature instructions"
                  value={editingDelivery.notes || ''}
                  onChange={(e) => setEditingDelivery({ ...editingDelivery, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase"
                >
                  Save Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
