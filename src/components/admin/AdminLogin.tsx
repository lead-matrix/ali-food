import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, KeyRound, ArrowRight, ShieldCheck, Download, AlertTriangle, Cloud } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { adminAuth } from '../../utils/adminAuth';
import { AliFoodLogo } from '../common/AliFoodLogo';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

export const AdminLogin: React.FC = () => {
  const { loginAdmin } = useAdmin();
  const [hasCredential, setHasCredential] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Cloud mode auth states
  const [isCloudTab, setIsCloudTab] = useState(false);
  const [cloudEmail, setCloudEmail] = useState('');
  const [cloudPassword, setCloudPassword] = useState('');
  const [cloudLoading, setCloudLoading] = useState(false);

  useEffect(() => {
    setHasCredential(adminAuth.hasLocalCredential());
  }, []);

  const handleFirstTimeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passcode.length < 4) {
      setError('Password/PIN must be at least 4 characters long.');
      return;
    }
    if (passcode !== confirmPasscode) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    try {
      await adminAuth.setInitialPassword(passcode);
      setSuccessMsg('Master password established. Logging in...');
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize password.');
    }
  };

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = await loginAdmin(passcode);
    if (!success) {
      setError('Invalid administrative passcode. Please try again.');
    }
  };

  const handleCloudLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured yet. Set VITE_SUPABASE_URL in .env.');
      return;
    }

    setCloudLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cloudEmail,
        password: cloudPassword,
      });

      if (signInError) throw signInError;

      // Verify admin role
      const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profError || profile?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. This account does not possess Super-Admin privileges.');
      }

      localStorage.setItem('alifood_cloud_session', 'true');
      adminAuth.createSession('cloud', cloudEmail);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Cloud authentication failed.');
    } finally {
      setCloudLoading(false);
    }
  };

  const handleEmergencyReset = async () => {
    // 1. Download backup first
    try {
      const backupData = localStorage.getItem('alifood_invoices') || '{}';
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), storage: localStorage }, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alifood_emergency_backup_${Date.now()}.json`;
      a.click();

      adminAuth.resetLocalCredential();
      setShowForgotModal(false);
      setHasCredential(false);
      setPasscode('');
      setConfirmPasscode('');
      setSuccessMsg('Local credential reset. Please configure your new Master PIN.');
    } catch (err) {
      setError('Failed to create emergency backup.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div
        className="max-w-md w-full rounded-2xl p-8 shadow-2xl text-white space-y-6 border"
        style={{ background: '#160606', borderColor: '#3D1010' }}
      >
        <div className="flex justify-center mb-2">
          <AliFoodLogo variant="dark" />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-white">
            Super-Admin Console
          </h2>
          <p className="text-xs text-slate-400">
            M/S Ali Food Enterprise Billing & Client Management Console
          </p>
        </div>

        {/* Tab switcher if Supabase is configured */}
        {isSupabaseConfigured && (
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => { setIsCloudTab(false); setError(null); }}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                !isCloudTab ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Local Master PIN
            </button>
            <button
              type="button"
              onClick={() => { setIsCloudTab(true); setError(null); }}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
                isCloudTab ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Login</span>
            </button>
          </div>
        )}

        {/* FIRST RUN SETUP */}
        {!isCloudTab && !hasCredential && (
          <form onSubmit={handleFirstTimeSetup} className="space-y-4">
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800 text-amber-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>First-Run Security Setup</span>
              </div>
              <p className="text-[11px] text-amber-300/80">
                Create your administrative Master PIN / Password. This is securely hashed with Web Crypto SHA-256 and stored exclusively in your browser.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Create Master PIN / Password *
              </label>
              <input
                type="password"
                required
                placeholder="Min. 4 characters"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Master PIN / Password *
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPasscode}
                onChange={e => setConfirmPasscode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Save PIN & Launch Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* RETURNING LOCAL LOGIN */}
        {!isCloudTab && hasCredential && (
          <form onSubmit={handleLocalLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter Master PIN / Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passcode}
                  onChange={e => {
                    setPasscode(e.target.value);
                    setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-slate-400 hover:text-amber-400 underline transition-colors"
              >
                Forgot Master PIN / Password?
              </button>
            </div>
          </form>
        )}

        {/* CLOUD LOGIN */}
        {isCloudTab && (
          <form onSubmit={handleCloudLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Administrator Email Address
              </label>
              <input
                type="email"
                required
                placeholder="admin@alifoodbd.com"
                value={cloudEmail}
                onChange={e => setCloudEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Supabase Auth Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={cloudPassword}
                onChange={e => setCloudPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={cloudLoading}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>{cloudLoading ? 'Authenticating...' : 'Sign In with Supabase'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD SAFE RESET MODAL */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-white space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold uppercase">Reset Administrative PIN</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                To safeguard your invoices, clients, and payments ledger, resetting your local PIN requires confirming that an emergency backup file is exported first.
              </p>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleEmergencyReset}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup & Reset PIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400">
          <span>Encrypted with Web Crypto SHA-256 • Inactivity Timeout 30 Minutes</span>
        </div>
      </div>
    </div>
  );
};
