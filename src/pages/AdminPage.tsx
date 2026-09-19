import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminProductList } from '../components/admin/AdminProductList';
import { AdminOrderList } from '../components/admin/AdminOrderList';
import { AdminSettings } from '../components/admin/AdminSettings';
import { Package, ShoppingBag, Settings, LogOut, ShieldCheck, BarChart3, Plus } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { formatBDT } from '../utils/whatsapp';

export const AdminPage: React.FC = () => {
  const { isAdminLoggedIn, logoutAdmin, orders, products } = useAdmin();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  if (!isAdminLoggedIn) {
    return (
      <div className="bg-slate-950 min-h-screen">
        <AdminLogin />
      </div>
    );
  }

  // Quick stats
  const pendingOrders = orders.filter(o => o.status === 'New' || o.status === 'Confirmed').length;
  const activeProducts = products.filter(p => p.active).length;
  const totalVolume = orders.reduce((sum, o) => sum + o.estimatedTotal, 0);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase text-amber-400">
                Official Staff Administration Console
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">
              M/S ALI FOOD Commercial Operations
            </h1>
            <p className="text-xs text-slate-400">
              Record Ref: <code className="font-mono text-slate-300">{COMPANY_INFO.recordRef}</code> • Dhaka & Chattogram Hubs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logoutAdmin}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin Session</span>
            </button>
          </div>
        </div>

        {/* Operational Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Pending Requisitions</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              {pendingOrders} Orders
            </div>
            <span className="text-[11px] text-slate-500">Requires logistics verification</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Product Portfolio</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {activeProducts} of {products.length} Items
            </div>
            <span className="text-[11px] text-slate-500">September 2026 Schedule</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Logged Orders Volume</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {formatBDT(totalVolume)}
            </div>
            <span className="text-[11px] text-slate-500">Total requisition gross</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Requisitions Pipeline ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog & Rates ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Hotlines & Settings</span>
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'orders' && <AdminOrderList />}
          {activeTab === 'products' && <AdminProductList />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>

      </div>
    </div>
  );
};
