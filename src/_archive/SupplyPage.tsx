import React, { useState } from 'react';
import { ShieldCheck, HeartHandshake, Snowflake, Truck, Package, Scissors, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { ColdChainFlow } from '../components/home/ColdChainFlow';
import { CustomCutBanner } from '../components/home/CustomCutBanner';
import { CustomCutModal } from '../components/quote/CustomCutModal';
import { COMPANY_INFO } from '../data/companyInfo';

interface SupplyPageProps {
  navigate: (path: string) => void;
}

export const SupplyPage: React.FC<SupplyPageProps> = ({ navigate }) => {
  const [isCustomCutOpen, setIsCustomCutOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div
          className="text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)', borderColor: '#3D1010' }}
        >
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
              <Truck className="w-3.5 h-3.5" />
              <span>Commercial Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Commercial Supply & Cold-Chain Capabilities
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Engineered for large-scale institutional procurement: bio-secure contract farming, precision evisceration, cold bath chilling, culinary portioning, and dedicated pre-dawn delivery routes.
            </p>
          </div>
        </div>

        {/* 4 Pillars Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-mono font-bold text-xl">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Bio-Secure Contract Sourcing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Direct contract sourcing with veterinary health clearance. Birds are reared under regulated bio-security conditions with strict feed quality oversight, mitigating biological contaminants before arrival at central slaughter hubs.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Veterinary health verified batch clearance</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-mono font-bold text-xl">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              100% Halal Manual Slaughter
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Trained manual slaughter by experienced Islamic butchers. Complete blood draining and rigorous evisceration protocols eliminate microbiological hazards, ensuring religious compliance and wholesome meat purity.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete blood-draining & sanitary evisceration</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-mono font-bold text-xl">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Active Chill-Chain Integrity
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Chilled products handled at 0°C–4°C in chlorinated chilled water baths immediately post-evisceration. Deep frozen inventory maintained at -18°C preserving muscle moisture, texture, and nutritional value.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>0°C–4°C chilled handling & -18°C deep freeze</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-mono font-bold text-xl">
              04
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Express Pre-Dawn Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Documented daily pre-dawn delivery routes (5:00 AM – 8:00 AM) across Dhaka and Chattogram. Designed specifically to reach hotel, restaurant, and supermarket kitchens before early morning operational prep begins.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Daily scheduled 5:00 AM – 8:00 AM dispatch</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cold Chain Process Timeline */}
      <ColdChainFlow />

      {/* Custom Cut & Supply Request Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CustomCutBanner onOpenModal={() => setIsCustomCutOpen(true)} />
      </div>

      <CustomCutModal
        isOpen={isCustomCutOpen}
        onClose={() => setIsCustomCutOpen(false)}
      />
    </div>
  );
};
