import React from 'react';
import { Store, UtensilsCrossed, Users, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createGeneralWhatsAppLink } from '../../utils/whatsapp';

interface CustomerTypesProps {
  navigate: (path: string) => void;
}

export const CustomerTypes: React.FC<CustomerTypesProps> = ({ navigate }) => {
  const segments = [
    {
      title: "Supermarket Chains",
      desc: "Regular wholesale poultry supply with standardized weight sorting, retail-ready cut specs, and strict cold-chain compliance.",
      icon: Store,
      bullet: "Calibrated weights & retail packaging",
    },
    {
      title: "Restaurants & HoReCa",
      desc: "Customized culinary portioning (boneless fillets, skinless drumsticks, Thai cuts, wings) calibrated to chef recipes.",
      icon: UtensilsCrossed,
      bullet: "Daily pre-dawn delivery before morning mise-en-place",
    },
    {
      title: "Catering Operations",
      desc: "High-volume banquet supply, 800g–900g calibrated whole roast chickens, waterfowl, and event-scale portioning.",
      icon: Users,
      bullet: "Scalable bulk supply with guaranteed timelines",
    },
    {
      title: "Corporate Kitchens & Canteens",
      desc: "Scheduled institutional procurement with transparent monthly corporate billing and fixed pricing agreements.",
      icon: Building,
      bullet: "Weekly / Monthly settlement terms",
    }
  ];

  return (
    <section className="py-20 text-white border-b" style={{ background: '#120505', borderColor: '#2A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-wider">
            Commercial Client Sectors
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Made for Businesses That Can’t Run Out
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Professional kitchens and retail grocers require uninterrupted meat supply without compromising on hygiene or portion consistency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {segments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-850 flex items-center gap-2 text-[11px] text-amber-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{item.bullet}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-extrabold tracking-tight">
              Looking for a dependable wholesale poultry contract?
            </h3>
            <p className="text-slate-900 text-sm font-medium">
              Discuss institutional rates, portioning requirements, and weekly scheduled delivery terms.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/order')}
              className="px-5 py-3 rounded-lg bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Start Supply Conversation
            </button>
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-lg bg-white/90 hover:bg-white text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Direct WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
