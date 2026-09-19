import React from 'react';
import { INITIAL_PARTNERS } from '../data/initialPartners';
import { Building2, Store, UtensilsCrossed, ChefHat, ShieldCheck, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';

interface PartnersPageProps {
  navigate: (path: string) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ navigate }) => {
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
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div
          className="text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)', borderColor: '#3D1010' }}
        >
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>Commercial Relationships</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Selected Supply Partners
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Selected commercial and institutional relationships. Ali Food delivers dependable wholesale poultry and custom portion cuts to prominent supermarket networks, commercial catering hubs, and high-volume multi-cuisine restaurants across Bangladesh.
            </p>
          </div>
        </div>

        {/* Partners Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INITIAL_PARTNERS.map((partner) => {
            const Icon = getIcon(partner.id);
            return (
              <div
                key={partner.id}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-800 uppercase px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                      {partner.tag}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {partner.name}
                  </h2>
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wide mt-1">
                    {partner.category}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mt-4">
                    {partner.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="text-slate-500">
                    Operating Facility / Location: <strong className="text-slate-800">{partner.location}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Commercial Purchase Order & Scheduled Requisition Protocol</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commercial Supply Invitation Banner */}
        <div
          className="p-8 rounded-2xl border text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
          style={{ background: 'linear-gradient(135deg, #160606 0%, #240808 100%)', borderColor: '#3D1010' }}
        >
          <div className="space-y-2 text-center sm:text-left max-w-xl">
            <h3 className="text-xl font-black">
              Become an Approved Institutional Procurement Partner
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Establish weekly or monthly corporate credit settlement, calibrated chef portioning, and dedicated daily delivery schedules for your enterprise.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/order')}
              className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow"
            >
              Start Supply Request
            </button>
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              WhatsApp Procurement
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
