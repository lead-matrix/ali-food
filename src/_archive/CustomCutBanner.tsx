import React from 'react';
import { Scissors, CheckCircle, ArrowRight } from 'lucide-react';

interface CustomCutBannerProps {
  onOpenModal: () => void;
}

export const CustomCutBanner: React.FC<CustomCutBannerProps> = ({ onOpenModal }) => {
  return (
    <section className="py-16 text-white border-b" style={{ background: '#160606', borderColor: '#2A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl border p-8 sm:p-12 overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #100404 0%, #1C0808 50%, #100404 100%)',
            borderColor: '#3D1010',
          }}
        >
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold uppercase">
                <Scissors className="w-3.5 h-3.5" />
                <span>Customized Culinary Portioning</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Need a Custom Cut for Your Menu?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                ALI FOOD specializes in custom butcher portioning tailored to restaurant recipes, central kitchen specifications, and catering portion sizes. From specific gram-weight breast tenderloins to descaled skinless drumsticks and 4/8-way curry cuts.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Calibrated Gram Weights</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Bone-in or Boneless Filleting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Skin-on or Skin-peeled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Custom Vacuum Packaging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Scheduled Pre-Dawn Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Dhaka & Chattogram Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Action (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              <button
                onClick={onOpenModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all active:scale-95"
              >
                <Scissors className="w-4 h-4" />
                <span>Request Custom Processing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-slate-400 mt-2 text-center lg:text-right w-full">
                Guaranteed commercial portion tolerances
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
