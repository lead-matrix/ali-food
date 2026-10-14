import React from 'react';
import { INITIAL_PARTNERS } from '../../data/initialPartners';
import { Building2, Store, UtensilsCrossed, ChefHat } from 'lucide-react';

interface PartnersSectionProps {
  navigate?: (path: string) => void;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ navigate }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'shwapno':
        return Store;
      case 'aribahs-kitchen':
        return ChefHat;
      case 'charulota-restora':
        return UtensilsCrossed;
      default:
        return Building2;
    }
  };

  return (
    <section className="py-16 bg-slate-100 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-amber-800 font-mono text-xs uppercase font-bold tracking-wider">
            Verified Institutional Portfolio
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Selected Supply Partners
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Selected commercial and institutional relationships.
          </p>
        </div>

        {/* Clean Monochrome Partner Logo / Title Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_PARTNERS.map((partner) => {
            const Icon = getIcon(partner.id);
            return (
              <div
                key={partner.id}
                className="bg-white rounded-xl p-6 border border-slate-250 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
                      {partner.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {partner.name}
                  </h3>
                  <div className="text-[11px] font-medium text-amber-700 mb-2">
                    {partner.category}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {partner.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>Location: {partner.location}</span>
                </div>
              </div>
            );
          })}
        </div>

        {navigate && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/partners')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 uppercase tracking-wider underline underline-offset-4"
            >
              View Supply Relationships & Delivery Framework →
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
