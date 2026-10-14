import React from 'react';
import { ArrowRight, MessageSquare, Phone, ShieldCheck, Snowflake, CheckCircle2, Clock, MapPin, Mail, ChevronRight, UserCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';
import { t } from '../i18n';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const supplyCategories = [
    {
      title: 'Broiler Cuts & Portions',
      tag: 'High Volume Daily Supply',
      desc: 'Skinless dressed broiler, boneless breast fillet, drumsticks, and calibrated portions.',
      icon: '🍗',
      spec: '0°C–4°C Chilled Fresh / Frozen',
    },
    {
      title: 'Indigenous Birds',
      tag: 'Heritage Quality',
      desc: 'Authentic Desi Murgi, Sonalika chicken, and native country breeds dressed to order.',
      icon: '🐓',
      spec: 'Whole Dressed or Custom Portions',
    },
    {
      title: 'Waterfowl, Game & Squab',
      tag: 'Specialty Supply',
      desc: 'China Duck (Chilled/Frozen), Raj Hans, and culinary squab (Kobutor) for banquets.',
      icon: '🦆',
      spec: 'Halal Hand-Dressed',
    },
    {
      title: 'Live Poultry Sourcing',
      tag: 'Direct Farm Contract',
      desc: 'Live weight broiler and Sonali batches with veterinary health checks.',
      icon: '🌾',
      spec: 'Bulk Live Crates',
    },
    {
      title: 'Custom Culinary Cuts',
      tag: 'Chef Specification',
      desc: 'Portion-calibrated cuts, skin-on/skinless, bone-in/boneless vacuum packs.',
      icon: '🔪',
      spec: 'Custom Gram Tolerances',
    },
  ];

  return (
    <div className="space-y-0 text-slate-900 bg-white">
      {/* 1. Short Hero Section */}
      <section className="relative text-white overflow-hidden bg-[#100404] border-b border-[#2A0A0A] py-14 sm:py-20">
        <div className="absolute inset-0 z-0 opacity-25">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(245,166,35,0.25)' }} />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(26,122,60,0.20)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <img
              src="/images/alifood-emblem.svg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/alifood-emblem.png';
              }}
              alt="M/S Ali Food Emblem"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-2xl hover:scale-105 transition-transform"
            />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1C0808] border border-[#F5A623]/40 text-[#F5A623]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Commercial Agro-Meat Processor & Institutional Supplier</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
              {COMPANY_INFO.name}
            </h1>
            <p className="text-xl sm:text-2xl text-[#F5A623] font-serif italic font-medium">
              “{COMPANY_INFO.tagline}”
            </p>
          </div>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Commercial wholesale poultry & dressed meat supplier delivering daily pre-dawn chilled orders across supermarket chains, restaurants, catering houses, and corporate kitchens in Dhaka and Chattogram.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>What We Supply</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>

            <button
              onClick={() => navigate('/client')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Client Portal</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span>Dhaka: <a href={`tel:${COMPANY_INFO.hotlines[0].raw}`} className="text-amber-400 hover:underline">{COMPANY_INFO.hotlines[0].number}</a></span>
            <span>•</span>
            <span>Chattogram: <a href={`tel:${COMPANY_INFO.hotlines[1].raw}`} className="text-amber-400 hover:underline">{COMPANY_INFO.hotlines[1].number}</a></span>
          </div>
        </div>
      </section>

      {/* 2. What We Supply Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700">
              Commercial Product Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What We Supply
            </h2>
            <p className="text-slate-600 text-sm">
              Standardized dressed cuts and portion-controlled poultry processed under strict veterinary and Halal hygiene benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplyCategories.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{item.spec}</span>
                  <button
                    onClick={() => navigate('/products')}
                    className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View List</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {/* Custom cut requisition card */}
            <div className="bg-gradient-to-br from-[#1C0808] to-[#2A0A0A] rounded-2xl border border-[#3D1010] p-6 text-white shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Tailored Specification
                </span>
                <h3 className="text-lg font-bold text-white">
                  Need a Specific Cut or Volume?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We calibrate skinning, deboning, and portion weights for executive chefs, hospital kitchens, and airline caterers.
                </p>
              </div>
              <a
                href={createGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow"
            >
              <span>Browse Full Product List</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Why Us Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Institutional Reliability
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Partner With M/S Ali Food
            </h2>
            <p className="text-slate-600 text-sm">
              We eliminate stockouts, quality variance, and billing ambiguity for food businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Point 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                1. Active Cold Chain
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.whyUs.point1Desc}
              </p>
            </div>

            {/* Point 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Consistent Institutional Supply
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.whyUs.point2Desc}
              </p>
            </div>

            {/* Point 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Weekly & Monthly Billing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.whyUs.point3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Contact Strip */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white">
                Ready to secure commercial poultry supply?
              </h3>
              <p className="text-xs text-slate-400">
                Contact our commercial desk in Dhaka or Chattogram for wholesale rate quotes and delivery scheduling.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{COMPANY_INFO.hotlines[0].number}</span>
              </a>

              <a
                href={createGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase"
              >
                <span>All Hub Contacts</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
