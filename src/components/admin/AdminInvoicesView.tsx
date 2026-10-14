import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Printer, 
  Download, 
  MessageSquare, 
  Trash2, 
  Edit, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Ban,
  Clock
} from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { Invoice, InvoiceItem, Client, BillingProduct } from '../../lib/db/types';
import { formatBDT, formatDate } from '../../utils/formatters';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

interface AdminInvoicesViewProps {
  repo: IRepository;
  initialFilter?: string;
  onOpenPaymentModal?: (invoice: Invoice) => void;
}

export const AdminInvoicesView: React.FC<AdminInvoicesViewProps> = ({
  repo,
  initialFilter,
  onOpenPaymentModal,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<BillingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter || 'all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Partial<Invoice> | null>(null);
  const [voidModalInvoice, setVoidModalInvoice] = useState<Invoice | null>(null);
  const [voidReason, setVoidReason] = useState('');

  // Monthly generator modal
  const [isBulkGenOpen, setIsBulkGenOpen] = useState(false);
  const [bulkFrom, setBulkFrom] = useState('');
  const [bulkTo, setBulkTo] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [iList, cList, pList] = await Promise.all([
        repo.getInvoices(),
        repo.getClients(),
        repo.getProducts(),
      ]);
      setInvoices(iList);
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

  const handlePrintPDF = async (inv: Invoice) => {
    try {
      const settings = await repo.getSettings();
      generateInvoicePDF(inv, settings);
    } catch (e) {
      alert('Failed to generate invoice PDF');
    }
  };

  const handleWhatsAppShare = (inv: Invoice) => {
    const text = `*M/S ALI FOOD - OFFICIAL COMMERCIAL INVOICE*
Invoice No: *${inv.invoiceNumber}*
Client: *${inv.clientCompany || inv.clientName}*
Issue Date: ${formatDate(inv.issueDate)}
Due Date: ${formatDate(inv.dueDate)}

*Subtotal:* ${formatBDT(inv.subtotal)}
${inv.discount > 0 ? `Discount: -${formatBDT(inv.discount)}\n` : ''}*Net Invoice Total:* ${formatBDT(inv.total)}
*Paid to Date:* ${formatBDT(inv.paidAmount)}
*Current Balance Due:* *${formatBDT(inv.dueAmount)}*
*Status:* ${inv.status.toUpperCase()}

*Settlement Bank Accounts:*
- Dutch-Bangla Bank PLC | A/C: M/S Ali Food | 123.110.456789
- bKash Merchant: 01319-345501
- Procurement Hotlines: 01319-345501 / 01401-238019

_Generated electronically by M/S Ali Food Commercial Billing Platform._`;

    const phone = (inv.clientPhone || '').replace(/[^0-9]/g, '');
    const targetPhone = phone.startsWith('88') ? phone : `88${phone}`;
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleVoidInvoice = async () => {
    if (!voidModalInvoice || !voidReason.trim()) return;
    try {
      await repo.voidInvoice(voidModalInvoice.id, voidReason);
      setVoidModalInvoice(null);
      setVoidReason('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to void invoice');
    }
  };

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFrom || !bulkTo) return;
    setBulkLoading(true);
    try {
      const result = await repo.generateMonthlyInvoices(bulkFrom, bulkTo);
      alert(`Bulk generator complete! Created ${result.created.length} statement invoice(s).`);
      setIsBulkGenOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Bulk generation error');
    } finally {
      setBulkLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'unpaid') {
        if (inv.status === 'paid' || inv.status === 'void') return false;
      } else if (inv.status !== statusFilter) {
        return false;
      }
    }
    if (clientFilter !== 'all' && inv.clientId !== clientFilter) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
      const matchComp = (inv.clientCompany || '').toLowerCase().includes(q);
      const matchName = (inv.clientName || '').toLowerCase().includes(q);
      if (!matchNum && !matchComp && !matchName) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Commercial Invoices & Statements</span>
          </h2>
          <p className="text-xs text-slate-400">
            Issue invoices, print PDF statements, share via WhatsApp, and manage payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              const firstDay = `${today.substring(0, 7)}-01`;
              setBulkFrom(firstDay);
              setBulkTo(today);
              setIsBulkGenOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Bulk Monthly Invoices</span>
          </button>

          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              const due = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
              setEditingInvoice({
                issueDate: today,
                dueDate: due,
                status: 'issued',
                items: [
                  {
                    id: '',
                    invoiceId: '',
                    productName: products[0]?.name || 'Broiler Breast Meat (Boneless)',
                    qty: 25,
                    unit: 'Kg',
                    rate: products[0]?.rate || 420,
                    amount: 10500,
                  },
                ],
                discount: 0,
                deliveryCharge: 0,
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'unpaid', 'issued', 'partial', 'paid', 'overdue', 'draft', 'void'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase text-[11px] transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Client & Search */}
        <div className="flex items-center gap-2">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 w-36 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client Company</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Net Total</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{inv.clientCompany || inv.clientName}</div>
                    <div className="text-[11px] text-slate-400">{inv.clientPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {formatDate(inv.issueDate)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                    {formatBDT(inv.total)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400">
                    {formatBDT(inv.paidAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-red-400 text-sm">
                    {formatBDT(inv.dueAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        inv.status === 'paid'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : inv.status === 'partial'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : inv.status === 'overdue'
                          ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                          : inv.status === 'void'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 line-through'
                          : 'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handlePrintPDF(inv)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        title="Download / Print PDF"
                      >
                        <Printer className="w-4 h-4 text-amber-400" />
                      </button>

                      <button
                        onClick={() => handleWhatsAppShare(inv)}
                        className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800"
                        title="Share Invoice Details on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {onOpenPaymentModal && inv.dueAmount > 0 && inv.status !== 'void' && (
                        <button
                          onClick={() => onOpenPaymentModal(inv)}
                          className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] uppercase"
                          title="Record Payment against this invoice"
                        >
                          Pay
                        </button>
                      )}

                      {inv.status !== 'void' && (
                        <button
                          onClick={() => setVoidModalInvoice(inv)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400"
                          title="Void this Invoice"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VOID INVOICE MODAL */}
      {voidModalInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase">Void Invoice Confirmation</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you wish to void <strong>{voidModalInvoice.invoiceNumber}</strong> (৳{voidModalInvoice.total})?
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Reason for Voiding *</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Quantity discrepancy, re-issued under new contract"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setVoidModalInvoice(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVoidInvoice}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase"
              >
                Confirm Void
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK MONTHLY GENERATOR MODAL */}
      {isBulkGenOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">Generate Monthly Invoices</h3>
              </div>
              <button onClick={() => setIsBulkGenOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Scans all delivered dispatches in the selected period that have not yet been invoiced, and automatically bundles them into client monthly billing statements.
            </p>

            <form onSubmit={handleBulkGenerate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Period From *</label>
                  <input
                    type="date"
                    required
                    value={bulkFrom}
                    onChange={(e) => setBulkFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Period To *</label>
                  <input
                    type="date"
                    required
                    value={bulkTo}
                    onChange={(e) => setBulkTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkGenOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkLoading}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold uppercase"
                >
                  {bulkLoading ? 'Generating...' : 'Run Bulk Generator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MANUAL INVOICE MODAL */}
      {isModalOpen && editingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-white">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold">Create Invoice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingInvoice.clientId) {
                  alert('Please select client');
                  return;
                }
                try {
                  await repo.saveInvoice(editingInvoice);
                  setIsModalOpen(false);
                  loadData();
                } catch (err: any) {
                  alert(err.message || 'Failed to save invoice');
                }
              }}
              className="p-6 overflow-y-auto space-y-4 flex-1 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Select Client *</label>
                  <select
                    required
                    value={editingInvoice.clientId || ''}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
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
                  <label className="block font-bold text-slate-300 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={editingInvoice.dueDate || ''}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300">Invoice Line Items</label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...(editingInvoice.items || []),
                        {
                          id: '',
                          invoiceId: '',
                          productName: products[0]?.name || 'Broiler Cuts',
                          qty: 10,
                          unit: 'Kg',
                          rate: products[0]?.rate || 330,
                          amount: 3300,
                        },
                      ];
                      setEditingInvoice({ ...editingInvoice, items: updated });
                    }}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                {(editingInvoice.items || []).map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="col-span-5">
                      <select
                        value={item.productName}
                        onChange={(e) => {
                          const pName = e.target.value;
                          const prod = products.find((p) => p.name === pName);
                          const updated = [...(editingInvoice.items || [])];
                          updated[idx] = {
                            ...item,
                            productName: pName,
                            rate: prod?.rate || item.rate,
                            amount: (prod?.rate || item.rate) * item.qty,
                          };
                          setEditingInvoice({ ...editingInvoice, items: updated });
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
                          const updated = [...(editingInvoice.items || [])];
                          updated[idx] = { ...item, qty, amount: qty * item.rate };
                          setEditingInvoice({ ...editingInvoice, items: updated });
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
                          const updated = [...(editingInvoice.items || [])];
                          updated[idx] = { ...item, rate, amount: item.qty * rate };
                          setEditingInvoice({ ...editingInvoice, items: updated });
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
                          const updated = (editingInvoice.items || []).filter((_, i) => i !== idx);
                          setEditingInvoice({ ...editingInvoice, items: updated });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase"
                >
                  Save & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
