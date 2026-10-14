import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  FileText, 
  CreditCard, 
  Users, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Plus, 
  ArrowRight, 
  MessageSquare, 
  Download, 
  RefreshCw 
} from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { Delivery, Client } from '../../lib/db/types';
import { formatBDT, formatDate } from '../../utils/formatters';

interface AdminDashboardViewProps {
  repo: IRepository;
  onNavigateTab: (tab: string, extraState?: any) => void;
  onOpenCreate: (type: 'delivery' | 'invoice' | 'payment' | 'client') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  repo,
  onNavigateTab,
  onOpenCreate,
}) => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<{
    todayDeliveries: Delivery[];
    totalUnpaid: number;
    overdueAmount: number;
    monthBilled: number;
    monthCollected: number;
    openComplaintsCount: number;
    topDebtors: { client: Client; balance: number }[];
  }>({
    todayDeliveries: [],
    totalUnpaid: 0,
    overdueAmount: 0,
    monthBilled: 0,
    monthCollected: 0,
    openComplaintsCount: 0,
    topDebtors: [],
  });

  const [showBackupReminder, setShowBackupReminder] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await repo.getDashboardMetrics();
      setMetrics(data);

      // Check 7-day backup reminder
      const lastBackup = localStorage.getItem('alifood_last_backup_date');
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (!lastBackup || parseInt(lastBackup, 10) < sevenDaysAgo) {
        setShowBackupReminder(true);
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

  const handleExportBackup = async () => {
    try {
      const payload = await repo.exportFullBackup();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alifood_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      localStorage.setItem('alifood_last_backup_date', String(Date.now()));
      setShowBackupReminder(false);
    } catch (e) {
      alert('Failed to export backup');
    }
  };

  return (
    <div className="space-y-6">
      {/* 7-Day Backup Reminder Alert Banner in Local Mode */}
      {repo.mode === 'local' && showBackupReminder && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300">
                Weekly Data Protection Reminder (Local Mode)
              </h4>
              <p className="text-xs text-amber-200/80">
                Your invoices, clients, and receipts are stored safely in this browser. Export a JSON backup to protect your business records.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleExportBackup}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase transition-colors"
            >
              Export Backup Now
            </button>
            <button
              onClick={() => setShowBackupReminder(false)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onOpenCreate('delivery')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-left transition-all group shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">+ Dispatch</span>
            <span className="text-sm font-bold text-white group-hover:text-amber-400">Log Delivery</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => onOpenCreate('invoice')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-left transition-all group shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">+ Statement</span>
            <span className="text-sm font-bold text-white group-hover:text-amber-400">Create Invoice</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => onOpenCreate('payment')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-left transition-all group shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">+ Collection</span>
            <span className="text-sm font-bold text-white group-hover:text-amber-400">Record Payment</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => onOpenCreate('client')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-left transition-all group shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">+ Commercial</span>
            <span className="text-sm font-bold text-white group-hover:text-amber-400">Add Client</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Deliveries */}
        <div
          onClick={() => onNavigateTab('deliveries')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold">Today's Pre-dawn Route</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {metrics.todayDeliveries.length} Deliveries
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>5:00 AM – 8:00 AM dispatch</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Total Unpaid Receivables */}
        <div
          onClick={() => onNavigateTab('invoices')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold">Total Unpaid Dues</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {formatBDT(metrics.totalUnpaid)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Across all client ledgers</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Overdue Amount */}
        <div
          onClick={() => onNavigateTab('invoices', { filter: 'overdue' })}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-red-900/60 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold text-red-400">Overdue Outstanding</span>
            <Clock className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">
            {formatBDT(metrics.overdueAmount)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Past agreed credit term</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Month Billed vs Collected */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold text-emerald-400">Monthly Cashflow</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formatBDT(metrics.monthCollected)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Billed: {formatBDT(metrics.monthBilled)}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Deliveries & Top Debtors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Today's Deliveries Preview (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Today's Deliveries ({metrics.todayDeliveries.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Dispatched pre-dawn across Dhaka & Chattogram hubs</span>
            </div>
            <button
              onClick={() => onNavigateTab('deliveries')}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          {metrics.todayDeliveries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Truck className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No deliveries scheduled for today yet.</p>
              <button
                onClick={() => onOpenCreate('delivery')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Log Today's Delivery</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {metrics.todayDeliveries.map((d) => (
                <div key={d.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{d.clientCompany || d.clientName}</div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      {d.deliveryNumber} • {d.vehicleDriver || 'Standard Route'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-amber-400">{formatBDT(d.totalAmount)}</div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      d.status === 'delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Top 5 Outstanding Debtors (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Top Accounts with Dues</span>
              </h3>
              <span className="text-xs text-slate-400">Ranked by unpaid ledger balance</span>
            </div>
            <button
              onClick={() => onNavigateTab('clients')}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              All Ledgers
            </button>
          </div>

          {metrics.topDebtors.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <CreditCard className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">All client accounts are clear! Zero dues.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {metrics.topDebtors.map(({ client, balance }) => (
                <div key={client.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{client.company}</div>
                    <div className="text-slate-400 text-[11px]">
                      {client.contactName} • <span className="font-mono">{client.phone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-black text-red-400 text-sm">
                      {formatBDT(balance)}
                    </div>
                    <button
                      onClick={() => onNavigateTab('clients', { selectedClientId: client.id })}
                      className="text-[11px] text-amber-400 hover:underline font-semibold"
                    >
                      View Ledger →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
