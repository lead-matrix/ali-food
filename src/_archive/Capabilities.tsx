import React from 'react';
import { ShieldAlert, HeartHandshake, Snowflake, Truck, ArrowRight } from 'lucide-react';

interface CapabilitiesProps {
  navigate: (path: string) => void;
}

export const Capabilities: React.FC<CapabilitiesProps> = ({ navigate }) => {
  const capabilities = [
    {
      number: "01",
      title: "Bio-Secure Sourcing",
      description: "Direct contract sourcing with verified veterinary health clearances ensuring batch traceability and bio-safety compliance.",
      icon: ShieldAlert,
      tag: "Traceable Poultry"
    },
    {
      number: "02",
      title: "Hygienic Processing",
      description: "100% Halal slaughter and trained manual slaughter processes with strict hygiene, sanitized workbenches, and blood-draining controls.",
      icon: HeartHandshake,
      tag: "100% Halal Manual"
    },
    {
      number: "03",
      title: "Active Chill Chain",
      description: "Chilled products rigorously handled around 0°C–4°C and deep-frozen storage at -18°C preserving cellular tenderness and food safety.",
      icon: Snowflake,
      tag: "0°C–4°C / -18°C"
    },
    {
      number: "04",
      title: "Express Dispatch",
      description: "Documented daily pre-dawn delivery routes (approximately 5:00 AM–8:00 AM) across Dhaka and Chattogram supporting commercial operations.",
      icon: Truck,
      tag: "5:00 AM – 8:00 AM"
    }
  ];

  return (
    <section className="py-20 text-white border-b" style={{ background: '#120505', borderColor: '#2A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-wider">
              Operational Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Built for Commercial Supply
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every stage of our supply chain is engineered to eliminate biological risks, maintain temperature integrity, and deliver predictable cuts on time.
            </p>
          </div>
          <button
            onClick={() => navigate('/supply')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold tracking-wide transition-colors self-start md:self-auto"
          >
            <span>Explore Supply Capabilities</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-black text-amber-500/60 group-hover:text-amber-400 transition-colors">
                      {item.number}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-850 flex items-center text-[11px] text-slate-400 group-hover:text-slate-300">
                  <span>Adheres to national food benchmarks</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
