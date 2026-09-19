import React from 'react';
import { ShieldCheck, HeartHandshake, Snowflake, Truck, MapPin, Building2, CheckCircle2, Phone, Mail, Award, Users } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Banner */}
        <div
          className="text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)', borderColor: '#3D1010' }}
        >
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>Corporate Profile & Institutional Capabilities</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              M/S ALI FOOD
            </h1>
            <p className="text-base sm:text-lg text-amber-400 font-serif italic">
              “Your Trusted Meat Source”
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Wholesale Poultry, Meat & Dressed Cuts Partner operating strategically from central processing hubs in Tejgaon, Dhaka and West Madarbari, Chattogram.
            </p>
          </div>
        </div>

        {/* Executive Overview & Operating Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-amber-800 font-bold tracking-wider">
                1. Executive Overview & Business Scope
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Institutional Agro-Meat Processing & Distribution
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>M/S Ali Food</strong> is a premier commercial agro-meat processor, institutional poultry manufacturer, and wholesale meat distributor in Bangladesh. Operating strategically from central processing hubs in <strong>Tejgaon, Dhaka</strong> and <strong>West Madarbari, Chattogram</strong>, Ali Food caters to top-tier supermarket chains, hotel-restaurant-catering (HoReCa) networks, corporate canteens, and food-service franchises.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                With complete integration across bio-secure contract farming, temperature-controlled butchery, customized culinary portioning, and express cold-chain logistics, Ali Food ensures an uninterrupted supply of certified fresh, chilled, and frozen meat products adhering strictly to national food safety benchmarks.
              </p>
            </div>

            {/* Core Operating Model Integration */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Documented Operating Integration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">Bio-Secure Contract Farming</strong>
                  <span className="text-slate-600">Direct contract sourcing with mandatory veterinary health clearances.</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">Temperature-Controlled Butchery</strong>
                  <span className="text-slate-600">Sanitized stainless worktables, precision evisceration, and blood-draining.</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">Customized Culinary Portioning</strong>
                  <span className="text-slate-600">Gram-calibrated fillets, skinless drumsticks, Thai cuts, and custom vacuum packs.</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">Express Cold-Chain Logistics</strong>
                  <span className="text-slate-600">Daily pre-dawn routes (5:00 AM – 8:00 AM) in temperature-monitored vehicles.</span>
                </div>
              </div>
            </div>

            {/* Target Sectors */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Target Institutional Customers
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supermarket Chains</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>HoReCa Businesses</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Restaurants</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Catering Operations</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Corporate Canteens</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Institutional Kitchens</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Management & Record Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div
              className="text-white rounded-2xl border p-6 shadow-md space-y-4"
              style={{ background: '#160606', borderColor: '#3D1010' }}
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Commercial Profile Information
              </h3>

              <div className="space-y-3 text-xs divide-y divide-slate-800">
                <div className="pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Management</span>
                  <strong className="text-white text-sm block">{COMPANY_INFO.proprietor}</strong>
                  <span className="text-slate-400">Proprietor</span>
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
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Billing Settlement</span>
                  <span className="text-slate-200 font-medium">{COMPANY_INFO.billingTerms}</span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Established Operating Presence</span>
                  <span className="text-slate-200 font-medium">Dhaka Central & Chattogram Regional Divisions</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => navigate('/order')}
                  className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow"
                >
                  Request Supply Agreement
                </button>
              </div>
            </div>

            {/* Hub Contacts Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide">
                Direct Communications
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <a href={`tel:${COMPANY_INFO.hotlines[0].raw}`} className="hover:underline font-bold">
                    {COMPANY_INFO.hotlines[0].number}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <a href={`tel:${COMPANY_INFO.hotlines[1].raw}`} className="hover:underline font-bold">
                    {COMPANY_INFO.hotlines[1].number}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
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
