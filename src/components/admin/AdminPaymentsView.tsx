import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  Calendar, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { Payment, Client, Invoice } from '../../lib/db/types';
import { formatBDT, formatDate } from '../../utils/formatters';
import { generatePaymentReceiptPDF } from '../../utils/pdfGenerator';

interface AdminPaymentsViewProps {
  repo: IRepository;
  initialInvoiceToPay?: Invoice | null;
  onClearInitialInvoice?: () => void;
}

export const AdminPaymentsView: React.FC<AdminPaymentsViewProps> = ({
  repo,
  initialInvoiceToPay,
  onClearInitialInvoice,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    method: 'bank',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pList, cList, iList] = await Promise.all([
        repo.getPayments(),
        repo.getClients(),
        repo.getInvoices(),
      ]);
      setPayments(pList);
      setClients(cList);
      setInvoices(iList);

      if (initialInvoiceToPay) {
        setNewPayment({
          clientId: initialInvoiceToPay.clientId,
          invoiceId: initialInvoiceToPay.id,
          invoiceNumber: initialInvoiceToPay.invoiceNumber,
          amount: initialInvoiceToPay.dueAmount,
          method: 'bank',
          date: new Date().toISOString().split('T')[0],
          note: `Payment for invoice ${initialInvoiceToPay.invoiceNumber}`,
        });
        setIsModalOpen(true);
        if (onClearInitialInvoice) onClearInitialInvoice();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialInvoiceToPay]);

  const handlePrintReceipt = async (p: Payment) => {
    try {
      const settings = await repo.getSettings();
      generatePaymentReceiptPDF(p, settings);
    } catch (e) {
      alert('Failed to generate money receipt PDF');
    }
  };

  const handleUndoPayment = async (p: Payment) => {
    if (confirm(`Cancel/Undo payment ${p.paymentNumber} of ${formatBDT(p.amount)}? This will recalculate the invoice due amount.`)) {
      try {
        await repo.deletePayment(p.id, true);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to undo payment');
      }
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.clientId || !newPayment.amount || newPayment.amount <= 0) {
      alert('Please select a client and enter a valid positive amount.');
      return;
    }

    try {
      await repo.recordPayment(newPayment);
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to record payment');
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (methodFilter !== 'all' && p.method !== methodFilter) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchNum = p.paymentNumber.toLowerCase().includes(q);
      const matchClient = (p.clientName || '').toLowerCase().includes(q);
      const matchRef = (p.reference || '').toLowerCase().includes(q);
      if (!matchNum && !matchClient && !matchRef) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <span>Payments & Collections Ledger</span>
          </h2>
          <p className="text-xs text-slate-400">
            Record bank deposits, bKash/Nagad transfers, cheques, and print official money receipts.
          </p>
        </div>

        <button
          onClick={() => {
            setNewPayment({
              method: 'bank',
              amount: 0,
              date: new Date().toISOString().split('T')[0],
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Payment</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'bank', 'bkash', 'nagad', 'cash', 'cheque'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase text-[11px] transition-all ${
                methodFilter === m
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search receipt, reference, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 w-48 sm:w-64"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-5">Receipt #</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Client Name</th>
                <th className="py-3 px-5">Payment Method</th>
                <th className="py-3 px-5">Reference / TrxID</th>
                <th className="py-3 px-5">Applied Invoice</th>
                <th className="py-3 px-5 text-right">Amount Collected</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-amber-400">
                    {p.paymentNumber}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-300">
                    {formatDate(p.date)}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-white text-sm">
                    {p.clientName || 'Client'}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-200">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-300">
                    {p.reference || '—'}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-blue-400">
                    {p.invoiceNumber || 'On Account'}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-black text-emerald-400 text-sm">
                    {formatBDT(p.amount)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handlePrintReceipt(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        title="Print Official Money Receipt"
                      >
                        <Printer className="w-4 h-4 text-amber-400" />
                      </button>

                      <button
                        onClick={() => handleUndoPayment(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                        title="Cancel / Soft-Delete Payment"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Record Commercial Payment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Client *</label>
                <select
                  required
                  value={newPayment.clientId || ''}
                  onChange={(e) => {
                    const cId = e.target.value;
                    const cInvs = invoices.filter((i) => i.clientId === cId && i.dueAmount > 0 && i.status !== 'void');
                    setNewPayment({
                      ...newPayment,
                      clientId: cId,
                      invoiceId: cInvs[0]?.id || null,
                      amount: cInvs[0]?.dueAmount || newPayment.amount,
                    });
                  }}
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

              {/* Invoice allocation optional */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">Apply to Specific Invoice (Optional)</label>
                <select
                  value={newPayment.invoiceId || ''}
                  onChange={(e) => {
                    const invId = e.target.value || null;
                    const inv = invoices.find((i) => i.id === invId);
                    setNewPayment({
                      ...newPayment,
                      invoiceId: invId,
                      invoiceNumber: inv?.invoiceNumber,
                      amount: inv ? inv.dueAmount : newPayment.amount,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                >
                  <option value="">-- General Account (Auto-allocates oldest due) --</option>
                  {invoices
                    .filter((i) => (!newPayment.clientId || i.clientId === newPayment.clientId) && i.dueAmount > 0 && i.status !== 'void')
                    .map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} (Due: {formatBDT(inv.dueAmount)})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Amount Collected (BDT) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPayment.amount || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Payment Method *</label>
                  <select
                    value={newPayment.method || 'bank'}
                    onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  >
                    <option value="bank">Bank Transfer / Deposit</option>
                    <option value="bkash">bKash Merchant</option>
                    <option value="nagad">Nagad Merchant</option>
                    <option value="cash">Cash Settlement</option>
                    <option value="cheque">Bank Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={newPayment.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Reference / TrxID / Cheque #</label>
                  <input
                    type="text"
                    placeholder="e.g. Trx #984210"
                    value={newPayment.reference || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Deposited in Tejgaon DBBL branch"
                  value={newPayment.note || ''}
                  onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
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
                  Record & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
