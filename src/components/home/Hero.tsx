import React from 'react';
import { ShoppingBag, ArrowRight, MessageSquare, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';
import { createGeneralWhatsAppLink } from '../../utils/whatsapp';

interface HeroProps {
  navigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ navigate }) => {
  return (
    <section className="relative text-white overflow-hidden" style={{ background: '#100404', borderBottom: '1px solid #2A0A0A' }}>
      {/* Background Graphic Gradients and Subtle Texture */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(245,166,35,0.20)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(26,122,60,0.15)' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(107,26,26,0.12)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Super-title Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-inner"
              style={{ background: '#1C0808', border: '1px solid rgba(245,166,35,0.35)', color: '#F5A623' }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ background: '#38B265' }} />
              <span>Commercial Agro-Meat Processor & Institutional Partner</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] uppercase font-sans">
                Fresh Meat. <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(90deg, #F5A623 0%, #FCBC3A 50%, #E8940D 100%)' }}
                >
                  Reliable Supply.
                </span> <br />
                Built for Business.
              </h1>
            </div>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Wholesale poultry, dressed cuts, and customized meat supply for commercial kitchens, supermarket chains, restaurants, catering operations, and institutional buyers across <span className="text-white font-semibold underline decoration-amber-500 underline-offset-4">Dhaka</span> and <span className="text-white font-semibold underline decoration-amber-500 underline-offset-4">Chattogram</span>.
            </p>

            {/* Operational Highlights Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 max-w-xl text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>100% Halal Manual Cut</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Active 0°C–4°C Chilled</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>5:00–8:00 AM Dispatch</span>
              </div>
            </div>

            {/* Primary and Secondary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => navigate('/order')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>ORDER / REQUEST SUPPLY</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-sm font-bold tracking-wide transition-all shadow-sm hover:border-slate-600"
              >
                <span>VIEW 20+ OFFICIAL CUTS</span>
              </button>

              <a
                href={createGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 text-sm font-semibold transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Desk</span>
              </a>
            </div>

            {/* Prominent Direct Phone Hotline Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-900/80">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                Procurement Hotlines:
              </span>
              <a
                href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                className="font-mono text-amber-400 font-bold hover:underline"
              >
                {COMPANY_INFO.hotlines[0].number}
              </a>
              <span className="text-slate-600">|</span>
              <a
                href={`tel:${COMPANY_INFO.hotlines[1].raw}`}
                className="font-mono text-amber-400 font-bold hover:underline"
              >
                {COMPANY_INFO.hotlines[1].number}
              </a>
            </div>
          </div>

          {/* Right Hero Visual Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              {/* Product Showcase Commercial Photography */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200&q=80"
                  alt="M/S Ali Food Institutional Meat Sourcing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>HALAL FOOD SAFETY</span>
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                      Institutional Sourcing
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Dressed Broiler, Desi & Heritage Birds
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Pricing Schedule</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">Effective Sept 2026</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Processing Hubs</span>
                    <strong className="text-white">Tejgaon & West Madarbari</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Billing Terms</span>
                    <strong className="text-white">Weekly / Monthly Corporate</strong>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Explore Broiler, Duck, Sonali & Cuts Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
