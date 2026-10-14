import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboardView } from '../components/admin/AdminDashboardView';
import { AdminClientsView } from '../components/admin/AdminClientsView';
import { AdminDeliveriesView } from '../components/admin/AdminDeliveriesView';
import { AdminInvoicesView } from '../components/admin/AdminInvoicesView';
import { AdminPaymentsView } from '../components/admin/AdminPaymentsView';
import { AdminComplaintsView } from '../components/admin/AdminComplaintsView';
import { AdminProductsView } from '../components/admin/AdminProductsView';
import { AdminReportsView } from '../components/admin/AdminReportsView';
import { AdminSettingsView } from '../components/admin/AdminSettingsView';
import { AdminActivityLogView } from '../components/admin/AdminActivityLogView';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Package, 
  BarChart3, 
  Settings, 
  History, 
  LogOut, 
  ShieldCheck, 
  Eye, 
  ArrowLeft 
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { ClientPortalPage } from './ClientPortalPage';

export const AdminPage: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    logoutAdmin, 
    repo, 
    refreshKey, 
    triggerRefresh,
    impersonatedClientId,
    setImpersonatedClientId 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'clients' | 'deliveries' | 'invoices' | 'payments' | 'complaints' | 'products' | 'reports' | 'settings' | 'activity'
  >('dashboard');

  // Shared state between views
  const [initialInvoiceToPay, setInitialInvoiceToPay] = useState<any>(null);
  const [selectedClientIdForLedger, setSelectedClientIdForLedger] = useState<string | null>(null);

  if (!isAdminLoggedIn) {
    return (
      <div className="bg-slate-950 min-h-screen">
        <AdminLogin />
      </div>
    );
  }

  // If in "View as client" impersonation mode
  if (impersonatedClientId) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Impersonation Banner */}
        <div className="sticky top-0 z-50 bg-blue-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 animate-pulse" />
            <span>SUPER-ADMIN IMPERSONATION MODE: Viewing Client Portal as Client ({impersonatedClientId})</span>
          </div>
          <button
            onClick={() => setImpersonatedClientId(null)}
            className="px-3 py-1 rounded bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Super-Admin Console</span>
          </button>
        </div>

        <div className="flex-1">
          <ClientPortalPage impersonatedClientId={impersonatedClientId} />
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients & Ledgers', icon: Users },
    { id: 'deliveries', label: 'Pre-Dawn Deliveries', icon: Truck },
    { id: 'invoices', label: 'Invoices & Billing', icon: FileText },
    { id: 'payments', label: 'Collections & Payments', icon: CreditCard },
    { id: 'complaints', label: 'Complaints & Inquiries', icon: MessageSquare },
    { id: 'products', label: 'Products & Rates', icon: Package },
    { id: 'reports', label: 'Reports & Aging', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Backups', icon: Settings },
    { id: 'activity', label: 'Audit Trail', icon: History },
  ];

  const handleNavigateTab = (tab: string, extra?: any) => {
    setActiveTab(tab as any);
    if (extra?.selectedClientId) {
      setSelectedClientIdForLedger(extra.selectedClientId);
    }
  };

  const handleOpenCreate = (type: 'delivery' | 'invoice' | 'payment' | 'client') => {
    if (type === 'delivery') setActiveTab('deliveries');
    if (type === 'invoice') setActiveTab('invoices');
    if (type === 'payment') setActiveTab('payments');
    if (type === 'client') setActiveTab('clients');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col pb-16 lg:pb-0">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>{COMPANY_INFO.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                SUPER-ADMIN
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 font-mono">
              Hubs: Dhaka (Tejgaon) & Chattogram (West Madarbari)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`hidden sm:inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
            repo.mode === 'cloud' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
          }`}>
            {repo.mode === 'cloud' ? 'Cloud Mode' : 'Local Storage Mode'}
          </span>

          <button
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Body: Sidebar + Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSelectedClientIdForLedger(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Hub Notice */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">Operational Hotline</div>
            <div className="font-mono text-amber-400">{COMPANY_INFO.hotlines[0].number}</div>
            <div className="text-[10px] text-slate-500 pt-1">
              Proprietor: {COMPANY_INFO.proprietor}
            </div>
          </div>
        </aside>

        {/* Mobile Horizontal Tab Navigation */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900 border-t border-slate-800 p-2 flex items-center justify-around overflow-x-auto shadow-2xl">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-bold ${
                  isActive ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <AdminDashboardView
              repo={repo}
              onNavigateTab={handleNavigateTab}
              onOpenCreate={handleOpenCreate}
            />
          )}

          {activeTab === 'clients' && (
            <AdminClientsView
              repo={repo}
              initialSelectedClientId={selectedClientIdForLedger}
              onViewAsClient={(cId) => setImpersonatedClientId(cId)}
            />
          )}

          {activeTab === 'deliveries' && (
            <AdminDeliveriesView
              repo={repo}
              onOpenInvoiceTab={() => setActiveTab('invoices')}
            />
          )}

          {activeTab === 'invoices' && (
            <AdminInvoicesView
              repo={repo}
              onOpenPaymentModal={(inv) => {
                setInitialInvoiceToPay(inv);
                setActiveTab('payments');
              }}
            />
          )}

          {activeTab === 'payments' && (
            <AdminPaymentsView
              repo={repo}
              initialInvoiceToPay={initialInvoiceToPay}
              onClearInitialInvoice={() => setInitialInvoiceToPay(null)}
            />
          )}

          {activeTab === 'complaints' && (
            <AdminComplaintsView repo={repo} />
          )}

          {activeTab === 'products' && (
            <AdminProductsView repo={repo} />
          )}

          {activeTab === 'reports' && (
            <AdminReportsView repo={repo} />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsView repo={repo} onRefreshData={triggerRefresh} />
          )}

          {activeTab === 'activity' && (
            <AdminActivityLogView repo={repo} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
