import React from 'react';
import { ShieldCheck, Snowflake, Building2, CheckCircle2, Phone, Mail, MessageSquare, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner */}
        <div
          className="text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)', borderColor: '#3D1010' }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
                <Building2 className="w-3.5 h-3.5" />
                <span>Who We Are • Corporate Profile</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                M/S ALI FOOD
              </h1>
              <p className="text-base sm:text-lg text-amber-400 font-serif italic">
                “{COMPANY_INFO.tagline}”
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Institutional wholesale poultry processor and meat distribution partner operating with dedicated processing facilities in Dhaka and Chattogram.
              </p>
            </div>
            <div className="hidden md:flex flex-shrink-0 items-center justify-center">
              <img
                src="/images/alifood-emblem.svg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/alifood-emblem.png';
                }}
                alt="M/S Ali Food Emblem"
                className="w-24 h-24 lg:w-28 lg:h-28 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Story, Proprietor, Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story & Standards (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-amber-800 font-bold tracking-wider">
                Our Story & Scope
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Reliable Meat Processing for Commercial Kitchens
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>M/S Ali Food</strong> was established to bridge the gap between rural poultry production and the exacting hygiene, portioning, and schedule requirements of institutional buyers in Bangladesh. We supply supermarket retail chains, star hotels, commercial restaurants, banquet catering services, and corporate cafeterias.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our operational model combines bio-secure contract farming, hygienic manual slaughter, active cold-chain handling, and pre-dawn express transport to ensure fresh, safe, and calibrated poultry reaches our institutional partners on time, every single day.
              </p>
            </div>

            {/* Operating Standards */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Operating Standards & Hygiene Protocol</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">100% Halal Manual Slaughter</strong>
                  <span className="text-slate-600">{COMPANY_INFO.operatingStandards.slaughter}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">Bio-Secure Sourcing</strong>
                  <span className="text-slate-600">{COMPANY_INFO.operatingStandards.farming}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">Active Chill-Chain</strong>
                  <span className="text-slate-600">{COMPANY_INFO.operatingStandards.chillChain}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">Pre-Dawn Logistics</strong>
                  <span className="text-slate-600">{COMPANY_INFO.operatingStandards.dispatch}</span>
                </div>
              </div>
            </div>

            {/* Hubs */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Operating Hubs & Distribution Network
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold uppercase">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{COMPANY_INFO.hubs.dhaka.title}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{COMPANY_INFO.hubs.dhaka.address}</p>
                  <p className="text-slate-500 text-[11px]">Daily coverage across Tejgaon, Kawran Bazar, Gulshan, Banani, Dhanmondi, Uttara & greater Dhaka.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold uppercase">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{COMPANY_INFO.hubs.chattogram.title}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{COMPANY_INFO.hubs.chattogram.address}</p>
                  <p className="text-slate-500 text-[11px]">Daily coverage across West Madarbari, Agrabad, Khulshi, GEC, Nasirabad & port area.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Proprietor & Profile (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div
              className="text-white rounded-2xl border p-6 shadow-md space-y-4"
              style={{ background: '#160606', borderColor: '#3D1010' }}
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Management & Identity
              </h3>

              <div className="space-y-3 text-xs divide-y divide-slate-800">
                <div className="pt-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Proprietor & Management</span>
                  <strong className="text-white text-sm block font-bold">{COMPANY_INFO.proprietor}</strong>
                  <span className="text-slate-400">Proprietor, M/S Ali Food</span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Corporate Record Ref</span>
                  <span className="font-mono text-amber-300 font-bold">{COMPANY_INFO.recordRef}</span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Institutional Vendor Code</span>
                  <span className="font-mono text-amber-300 font-bold">{COMPANY_INFO.vendorCode}</span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Institutional Settlement</span>
                  <span className="text-slate-200 font-medium">{COMPANY_INFO.billingTerms}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <a
                  href={createGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={() => navigate('/contact')}
                  className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Contact Hubs</span>
                </button>
              </div>
            </div>

            {/* Direct Hotlines Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide">
                Direct Communications
              </h4>
              <div className="space-y-2 font-mono">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <a href={`tel:${COMPANY_INFO.hotlines[0].raw}`} className="hover:underline font-bold">
                    {COMPANY_INFO.hotlines[0].number}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <a href={`tel:${COMPANY_INFO.hotlines[1].raw}`} className="hover:underline font-bold">
                    {COMPANY_INFO.hotlines[1].number}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-sans">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:underline">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
