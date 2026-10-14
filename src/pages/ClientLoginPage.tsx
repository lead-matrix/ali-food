import React, { useState } from 'react';
import { UserCheck, Lock, Mail, ArrowRight, ShieldAlert, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { AliFoodLogo } from '../components/common/AliFoodLogo';
import { COMPANY_INFO } from '../data/companyInfo';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';

interface ClientLoginPageProps {
  navigate: (path: string) => void;
}

export const ClientLoginPage: React.FC<ClientLoginPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      setError('Cloud mode is currently not active. Client Portal multi-device logins require Supabase cloud connectivity.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInErr) throw signInErr;

      // Verify client profile
      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profErr || !profile || !profile.client_id) {
        throw new Error('No client account linked to this login. Please contact M/S Ali Food desk.');
      }

      localStorage.setItem('alifood_client_auth', JSON.stringify({
        userId: data.user.id,
        clientId: profile.client_id,
        clientName: profile.full_name,
      }));

      navigate('/client');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to receive password reset link.');
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setError('Cloud mode is not configured.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setForgotSent(true);
    } catch (err: any) {
      setError(err.message || 'Password reset request failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="flex justify-center mb-2">
          <AliFoodLogo variant="light" />
        </div>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold uppercase">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Commercial Client Portal</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Client Account Access
          </h2>
          <p className="text-xs text-slate-500">
            View daily dispatch challans, download invoice statements, and monitor payment ledgers.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4" />
              <span>Cloud Portal Mode Notice</span>
            </div>
            <p className="leading-relaxed">
              Multi-device client logins require Supabase cloud mode. Your account manager sends verified statement PDFs directly to your WhatsApp and email.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <a
                href={createGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Desk on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Commercial Client Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="procurement@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Account Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {forgotSent && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
              Password reset link sent to your email.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Client Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="hover:text-amber-800 underline"
            >
              Forgot password?
            </button>
            <a
              href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
              className="hover:text-slate-800 font-mono"
            >
              Hotline: {COMPANY_INFO.hotlines[0].number}
            </a>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            ← Return to M/S Ali Food Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientLoginPage;
