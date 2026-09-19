import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AliFoodLogo } from '../common/AliFoodLogo';

export const AdminLogin: React.FC = () => {
  const { loginAdmin } = useAdmin();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div
        className="max-w-md w-full rounded-2xl p-8 shadow-2xl text-white space-y-6 border"
        style={{ background: '#160606', borderColor: '#3D1010' }}
      >
        <div className="flex justify-center mb-2">
          <AliFoodLogo variant="dark" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-lg font-bold tracking-tight">
            Commercial Operations Portal
          </h2>
          <p className="text-xs text-slate-400">
            Private administrative console for rate schedules, order management, and commercial dispatch logs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Enter Administrative Passcode
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
                  setError(false);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Invalid administrative passcode. Please try again.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Authorized Ali Food personnel only. Default passcodes: <code className="text-amber-400 font-mono">alifood2026</code> or <code className="text-amber-400 font-mono">admin123</code>
          </p>
        </div>

      </div>
    </div>
  );
};
