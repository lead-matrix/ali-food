import React from 'react';
import { ShieldCheck, Scissors, Snowflake, Package, Truck, CheckCircle2 } from 'lucide-react';

export const ColdChainFlow: React.FC = () => {
  const steps = [
    {
      step: "01",
      name: "Source",
      title: "Bio-Secure Farm",
      desc: "Direct farm contract birds with veterinary inspection and health clearance.",
      icon: ShieldCheck,
    },
    {
      step: "02",
      name: "Process",
      title: "100% Halal Manual",
      desc: "Clean evisceration, complete blood-draining, and sanitized butcher portioning.",
      icon: Scissors,
    },
    {
      step: "03",
      name: "Chill",
      title: "Active Cold Bath",
      desc: "Chlorinated chilled bath (0°C–4°C) to rapidly arrest bacterial development.",
      icon: Snowflake,
    },
    {
      step: "04",
      name: "Pack",
      title: "Portion & Vacuum",
      desc: "Calibrated culinary portioning, food-grade packing, and weight sorting.",
      icon: Package,
    },
    {
      step: "05",
      name: "Dispatch",
      title: "Express Cold Fleet",
      desc: "Pre-dawn dispatch (5:00 AM–8:00 AM) in temperature-monitored distribution vehicles.",
      icon: Truck,
    },
    {
      step: "06",
      name: "Deliver",
      title: "Direct to Kitchen",
      desc: "Prompt delivery to commercial kitchens, supermarket hubs, and catering bases.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-20 text-white border-b" style={{ background: '#0D0303', borderColor: '#2A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-wider">
            Cold-Chain Integrity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Unbroken Supply Chain Flow
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From bio-secure poultry contracts to your kitchen counters in Dhaka and Chattogram.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/50 transition-all duration-300 group"
              >
                {/* Step pill */}
                <div className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full mb-3 border border-amber-500/20">
                  STEP {s.step}
                </div>

                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                  {s.name}
                </div>
                <div className="text-sm font-bold text-white mb-2 leading-tight">
                  {s.title}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Temperature Badge Strip */}
        <div className="mt-10 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              Chilled Handling Standard: <strong className="text-white font-mono">0°C to 4°C</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-slate-300">
              Deep Freeze Standard: <strong className="text-white font-mono">-18°C</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-300">
              Commercial Delivery Window: <strong className="text-white font-mono">5:00 AM – 8:00 AM</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
