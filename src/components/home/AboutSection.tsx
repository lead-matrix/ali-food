import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';

interface AboutSectionProps {
  navigate: (path: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ navigate }) => {
  return (
    <section className="py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image with Quality Badge (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1000&q=80"
                alt="Ali Food Hygienic Processing Facility"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-6 bg-white space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>National Food Safety Benchmark Compliant</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chlorinated chilled wash, eviscerated, weight-classified and batch-coded under continuous cold-chain governance.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-mono text-slate-500">
                  <span>Record Ref: {COMPANY_INFO.recordRef}</span>
                  <span>Proprietor: {COMPANY_INFO.proprietor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Corporate Introduction (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              Corporate Overview
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A serious meat supply partner built for demanding commercial operations.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              <strong>M/S ALI FOOD</strong> is a commercial poultry and meat supply business serving institutional and wholesale customers in Bangladesh. Its operating model combines sourcing, hygienic dressing, customized portioning, chilled/frozen handling and commercial delivery to support the demanding requirements of supermarkets, restaurants, catering businesses and food-service operations.
            </p>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bio-Secure Contract Sourcing</span>
                </div>
                <p className="text-xs text-slate-500 pl-6">
                  Direct farm contract sourcing with verified veterinary health clearances.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Halal Manual Slaughter</span>
                </div>
                <p className="text-xs text-slate-500 pl-6">
                  Trained manual slaughter, strict sanitation protocols, and complete blood-draining.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Active Chill Chain</span>
                </div>
                <p className="text-xs text-slate-500 pl-6">
                  Handled at 0°C–4°C chilled; deep freeze at -18°C preserving cellular tenderness.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Express Dispatch Routes</span>
                </div>
                <p className="text-xs text-slate-500 pl-6">
                  Dedicated pre-dawn 5:00 AM–8:00 AM delivery to ensure kitchens are stocked before morning prep.
                </p>
              </div>
            </div>

            {/* Strategic Dual Hubs */}
            <div className="p-4 rounded-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: '#1C0808' }}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide" style={{ color: '#F5A623' }}>
                  <MapPin className="w-4 h-4" />
                  <span>Strategic Logistics Hubs</span>
                </div>
                <p className="text-xs text-slate-300">
                  Operating central processing hubs in <strong>Tejgaon, Dhaka</strong> and <strong>West Madarbari, Chattogram</strong>.
                </p>
              </div>
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs tracking-wide flex-shrink-0 transition-colors"
                style={{ background: '#F5A623', color: '#1C0808' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E8940D')}
                onMouseLeave={e => (e.currentTarget.style.background = '#F5A623')}
              >
                <span>Read Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
