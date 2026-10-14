import React from 'react';
import { ShieldCheck, MessageSquare, Phone, Info } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { COMPANY_INFO } from '../data/companyInfo';
import { formatBDT } from '../utils/formatters';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';

interface ProductsPageProps {
  navigate?: (path: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = () => {
  const activeProducts = INITIAL_PRODUCTS.filter(p => p.active !== false);

  const handleWhatsAppItem = (productName: string) => {
    const text = `Hello M/S Ali Food, I would like to inquire about institutional wholesale supply of: *${productName}*. Please share available volumes and delivery schedule.`;
    window.open(`https://wa.me/8801319345501?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div
          className="text-white rounded-2xl p-8 shadow-xl relative overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)', borderColor: '#3D1010' }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official Institutional Supply Schedule • Ref {COMPANY_INFO.recordRef}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                What We Supply
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Wholesale poultry, dressed culinary cuts, waterfowl, and live birds supplied directly to commercial kitchens, supermarket chains, and catering networks across Dhaka and Chattogram.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>Billing: <strong className="text-slate-200">{COMPANY_INFO.billingTerms}</strong></span>
                <span>•</span>
                <span>Direct Hotline: <a href={`tel:${COMPANY_INFO.hotlines[0].raw}`} className="font-mono text-amber-400 font-bold hover:underline">{COMPANY_INFO.hotlines[0].number}</a></span>
              </div>
            </div>
            <div className="hidden md:flex flex-shrink-0 items-center justify-center">
              <img
                src="/images/alifood-emblem.svg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/alifood-emblem.png';
                }}
                alt="M/S Ali Food Emblem"
                className="w-20 h-20 lg:w-24 lg:h-24 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Read-Only Products List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Supply Catalog ({activeProducts.length} Official Items)
              </h2>
              <span className="text-xs text-slate-500">
                0°C–4°C chilled handling • 100% Halal manual slaughter
              </span>
            </div>
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquire All Items</span>
            </a>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
                  <th className="py-3 px-6">Sl</th>
                  <th className="py-3 px-6">Product / Cut Name</th>
                  <th className="py-3 px-6">Supply Form</th>
                  <th className="py-3 px-6">Unit</th>
                  <th className="py-3 px-6 text-right">Official Rate</th>
                  <th className="py-3 px-6 text-center">Inquire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeProducts.map((p, index) => (
                  <tr key={p.id || index} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-slate-400 font-medium">
                      {p.sl || index + 1}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900 text-sm">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-md">
                        {p.processingSpecification}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {p.supplyForm}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">
                      {p.unit}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900">
                      {p.priceVisible ? (
                        <span>{formatBDT(p.rate)}</span>
                      ) : (
                        <span className="text-amber-800 text-[11px] font-sans font-semibold">
                          Quotation basis
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        onClick={() => handleWhatsAppItem(p.name)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200 transition-colors"
                        title="Inquire about this product on WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>Inquire</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {activeProducts.map((p, index) => (
              <div key={p.id || index} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-800">
                      #{p.sl || index + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {p.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    {p.priceVisible ? (
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {formatBDT(p.rate)}
                        <span className="text-[10px] font-normal text-slate-500"> / {p.unit}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-800">
                        Quotation basis
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  {p.processingSpecification}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {p.supplyForm} ({p.unit})
                  </span>
                  <button
                    onClick={() => handleWhatsAppItem(p.name)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note on Custom Specs & Rates */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Commercial Rates & Custom Cutting Notice</span>
          </div>
          <p className="leading-relaxed">
            Rates are subject to weekly market adjustments based on contract volume. Special cutting, boneless portioning, or custom packing specifications are gladly arranged for HoReCa and supermarket accounts. Contact our commercial desk for contract terms.
          </p>
        </div>

      </div>
    </div>
  );
};
