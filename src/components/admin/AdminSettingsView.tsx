import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  KeyRound, 
  Cloud, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  FileText
} from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { AppSettings, FullBackupPayload } from '../../lib/db/types';
import { adminAuth } from '../../utils/adminAuth';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminSettingsViewProps {
  repo: IRepository;
  onRefreshData?: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ repo, onRefreshData }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Change password states
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // Cloud sync states
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await repo.getSettings();
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await repo.saveSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    }
  };

  const handleExportBackup = async () => {
    try {
      const backup = await repo.exportFullBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alifood_database_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      localStorage.setItem('alifood_last_backup_date', String(Date.now()));
    } catch (e) {
      alert('Failed to export database backup');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string) as FullBackupPayload;
        if (!json.data) {
          alert('Invalid backup JSON format');
          return;
        }

        if (confirm(`Import backup from ${json.exportedAt}? This will restore all clients, invoices, dispatches, and payments.`)) {
          await repo.importFullBackup(json);
          alert('Database successfully restored from backup!');
          window.location.reload();
        }
      } catch (err: any) {
        alert('Failed to read or parse JSON backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    try {
      await adminAuth.changeLocalPassword(currentPass, newPass);
      setPassSuccess('Master password successfully updated!');
      setCurrentPass('');
      setNewPass('');
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password');
    }
  };

  const handlePushToCloud = async () => {
    if (!repo.syncLocalToCloud) return;
    if (!confirm('Push all local clients, deliveries, invoices, and payments to Supabase cloud? This will sync local records to the cloud database.')) return;

    setSyncLoading(true);
    setSyncStatus('Syncing records to Supabase...');
    try {
      const counts = await repo.syncLocalToCloud();
      setSyncStatus(`Sync successful! Pushed: ${counts.clients} clients, ${counts.deliveries} deliveries, ${counts.invoices} invoices, ${counts.payments} payments.`);
    } catch (err: any) {
      setSyncStatus(`Sync failed: ${err.message || String(err)}`);
    } finally {
      setSyncLoading(false);
    }
  };

  if (loading || !settings) {
    return <div className="text-slate-400 py-12 text-center text-xs">Loading enterprise settings...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Operating Mode Indicator Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${repo.mode === 'cloud' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            {repo.mode === 'cloud' ? <Cloud className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Active Database Mode:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                repo.mode === 'cloud' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {repo.mode === 'cloud' ? 'Supabase Cloud Mode' : 'Local Storage Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {repo.mode === 'cloud'
                ? 'Connected to cloud PostgreSQL backend. Clients can access portal from any device.'
                : 'Data stored locally in this browser. Export backups regularly to preserve records.'}
            </p>
          </div>
        </div>

        {/* Cloud Sync Button if Supabase configured */}
        {isSupabaseConfigured && (
          <button
            onClick={handlePushToCloud}
            disabled={syncLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase shadow transition-all"
          >
            <Cloud className="w-4 h-4" />
            <span>{syncLoading ? 'Syncing...' : 'Push Local Data to Cloud'}</span>
          </button>
        )}
      </div>

      {syncStatus && (
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200">
          {syncStatus}
        </div>
      )}

      {/* Main Settings Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Company Information & Invoice Customization</span>
            </h3>
            <span className="text-xs text-slate-400">Printed on official invoices, challans, and receipts</span>
          </div>

          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved Successfully</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Proprietor Name</label>
              <input
                type="text"
                value={settings.proprietor}
                onChange={(e) => setSettings({ ...settings, proprietor: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Primary Procurement Hotline</label>
              <input
                type="text"
                value={settings.primaryHotline}
                onChange={(e) => setSettings({ ...settings, primaryHotline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Operations & Logistics Hotline</label>
              <input
                type="text"
                value={settings.secondaryHotline}
                onChange={(e) => setSettings({ ...settings, secondaryHotline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Official Corporate Email</label>
              <input
                type="email"
                value={settings.officialEmail}
                onChange={(e) => setSettings({ ...settings, officialEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Dhaka Central Hub Address</label>
              <input
                type="text"
                value={settings.dhakaAddress}
                onChange={(e) => setSettings({ ...settings, dhakaAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Chattogram Regional Hub Address</label>
              <input
                type="text"
                value={settings.chattogramAddress}
                onChange={(e) => setSettings({ ...settings, chattogramAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={settings.invoicePrefix}
                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Delivery Prefix</label>
              <input
                type="text"
                value={settings.deliveryPrefix}
                onChange={(e) => setSettings({ ...settings, deliveryPrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Payment Prefix</label>
              <input
                type="text"
                value={settings.paymentPrefix}
                onChange={(e) => setSettings({ ...settings, paymentPrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Default Due Days</label>
              <input
                type="number"
                value={settings.defaultDueDays}
                onChange={(e) => setSettings({ ...settings, defaultDueDays: parseInt(e.target.value, 10) || 7 })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Bank Settlement Details</label>
            <input
              type="text"
              value={settings.bankDetails}
              onChange={(e) => setSettings({ ...settings, bankDetails: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">bKash Merchant Account Number</label>
              <input
                type="text"
                value={settings.bkashNumber}
                onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Nagad Merchant Account Number</label>
              <input
                type="text"
                value={settings.nagadNumber}
                onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Invoice Footer Text & Notice</label>
            <textarea
              rows={2}
              value={settings.invoiceFooterText}
              onChange={(e) => setSettings({ ...settings, invoiceFooterText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Two Columns: Backup/Restore & Change Master PIN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Backup & Restore (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              <span>Database Backup & Restore (JSON)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Export complete business data (clients, deliveries, invoices, receipts) or import a backup file.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase">Export Full Backup</h4>
              <p className="text-[11px] text-slate-400">
                Downloads an encrypted JSON package containing all ledger tables and settings.
              </p>
              <button
                onClick={handleExportBackup}
                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase">Restore from Backup</h4>
              <p className="text-[11px] text-slate-400">
                Upload a previously exported JSON file to restore the entire business state.
              </p>
              <label className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Import Backup JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Change Master PIN / Password (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Change Master Password</span>
            </h3>
            <span className="text-xs text-slate-400">Update local SHA-256 administrative master passcode</span>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Current Master Passcode *</label>
              <input
                type="password"
                required
                placeholder="Current PIN/Password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">New Master Passcode (Min. 4 chars) *</label>
              <input
                type="password"
                required
                placeholder="New PIN/Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono"
              />
            </div>

            {passError && (
              <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-[11px]">
                {passError}
              </div>
            )}

            {passSuccess && (
              <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px]">
                {passSuccess}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs uppercase border border-slate-700 transition-all"
            >
              Update Master PIN
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
