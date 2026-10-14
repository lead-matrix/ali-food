import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Users, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { Invoice, Payment, Client, Delivery } from '../../lib/db/types';
import { formatBDT, formatDate } from '../../utils/formatters';

interface AdminReportsViewProps {
  repo: IRepository;
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({ repo }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  // Per client statement selector
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientStatement, setClientStatement] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [iList, pList, cList, dList] = await Promise.all([
        repo.getInvoices(),
        repo.getPayments(),
        repo.getClients(),
        repo.getDeliveries(),
      ]);
      setInvoices(iList);
      setPayments(pList);
      setClients(cList);
      setDeliveries(dList);

      if (cList.length > 0) {
        setSelectedClientId(cList[0].id);
        const st = await repo.getClientLedger(cList[0].id);
        setClientStatement(st);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectClient = async (cId: string) => {
    setSelectedClientId(cId);
    try {
      const st = await repo.getClientLedger(cId);
      setClientStatement(st);
    } catch (e) {
      console.error(e);
    }
  };

  // Aging calculation
  const today = new Date().toISOString().split('T')[0];
  let agingCurrent = 0; // 0-7 days
  let agingMedium = 0; // 8-30 days
  let agingOld = 0; // 30+ days

  invoices.forEach((inv) => {
    if (inv.status !== 'paid' && inv.status !== 'void' && inv.dueAmount > 0) {
      const dueTime = new Date(inv.dueDate).getTime();
      const todayTime = new Date(today).getTime();
      const diffDays = Math.floor((todayTime - dueTime) / (86400000));

      if (diffDays <= 7) {
        agingCurrent += inv.dueAmount;
      } else if (diffDays <= 30) {
        agingMedium += inv.dueAmount;
      } else {
        agingOld += inv.dueAmount;
      }
    }
  });

  const totalOutstanding = agingCurrent + agingMedium + agingOld;

  const handleExportCSV = async (type: any) => {
    try {
      const csv = await repo.exportTableCSV(type);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alifood_${type}_report_${today}.csv`;
      a.click();
    } catch (e) {
      alert('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>Commercial Financial Reports & Aging</span>
          </h2>
          <p className="text-xs text-slate-400">
            Receivables aging breakdown, sales vs collection analytics, and CSV exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExportCSV('invoices')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Invoices CSV</span>
          </button>
          <button
            onClick={() => handleExportCSV('payments')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Payments CSV</span>
          </button>
          <button
            onClick={() => handleExportCSV('deliveries')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Deliveries CSV</span>
          </button>
        </div>
      </div>

      {/* Receivables Aging Card Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider text-xs">
          Accounts Receivable Aging Breakdown (Total: {formatBDT(totalOutstanding)})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">0 – 7 Days Due / Current</span>
              <span className="text-[10px] font-mono text-slate-500">Regular Cycle</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{formatBDT(agingCurrent)}</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-1.5 rounded-full"
                style={{ width: `${totalOutstanding ? (agingCurrent / totalOutstanding) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-orange-400">8 – 30 Days Overdue</span>
              <span className="text-[10px] font-mono text-slate-500">Attention Required</span>
            </div>
            <div className="text-2xl font-black text-orange-400 font-mono">{formatBDT(agingMedium)}</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-orange-400 h-1.5 rounded-full"
                style={{ width: `${totalOutstanding ? (agingMedium / totalOutstanding) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-red-400">30+ Days Critical</span>
              <span className="text-[10px] font-mono text-red-500 font-bold">Follow-Up Urgent</span>
            </div>
            <div className="text-2xl font-black text-red-400 font-mono">{formatBDT(agingOld)}</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-red-500 h-1.5 rounded-full"
                style={{ width: `${totalOutstanding ? (agingOld / totalOutstanding) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Per-Client Statement Ledger Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Per-Client Statement Ledger Summary</span>
            </h3>
            <span className="text-xs text-slate-400">Select any client to inspect deliveries, invoices, and running balance</span>
          </div>

          <select
            value={selectedClientId}
            onChange={(e) => handleSelectClient(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {clientStatement && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Opening Balance</span>
                <span className="font-bold text-white text-sm font-mono">{formatBDT(clientStatement.client?.openingBalance || 0)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Total Invoiced</span>
                <span className="font-bold text-amber-400 text-sm font-mono">{formatBDT(clientStatement.totalBilled)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Total Collected</span>
                <span className="font-bold text-emerald-400 text-sm font-mono">{formatBDT(clientStatement.totalPaid)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Running Due Balance</span>
                <span className="font-black text-red-400 text-base font-mono">{formatBDT(clientStatement.runningBalance)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                Invoices on Record ({clientStatement.invoices.length})
              </span>
              <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                {clientStatement.invoices.map((i: Invoice) => (
                  <div key={i.id} className="p-3 flex items-center justify-between text-xs bg-slate-950/40">
                    <div>
                      <span className="font-mono font-bold text-amber-400">{i.invoiceNumber}</span>
                      <span className="text-slate-400 ml-2">Issued: {formatDate(i.issueDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white">{formatBDT(i.total)}</span>
                      <span className="font-mono text-emerald-400">Paid: {formatBDT(i.paidAmount)}</span>
                      <span className="font-mono text-red-400 font-bold">Due: {formatBDT(i.dueAmount)}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                        {i.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
