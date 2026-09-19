import React from 'react';
import { PackageCheck, Scissors, Snowflake, Building2, MapPin } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const pillars = [
    {
      title: "Wholesale Supply",
      subtitle: "Official commercial bulk rates",
      icon: PackageCheck,
    },
    {
      title: "Custom Cuts",
      subtitle: "Precision culinary portioning",
      icon: Scissors,
    },
    {
      title: "Cold-Chain Handling",
      subtitle: "0°C–4°C chilled & -18°C frozen",
      icon: Snowflake,
    },
    {
      title: "Institutional Orders",
      subtitle: "Weekly / Monthly corporate settlement",
      icon: Building2,
    },
    {
      title: "Dhaka + Chattogram",
      subtitle: "Pre-dawn routes (5:00–8:00 AM)",
      icon: MapPin,
    },
  ];

  return (
    <section className="border-b py-6" style={{ background: '#160606', borderColor: '#2A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{ background: 'rgba(16,4,4,0.8)', border: '1px solid rgba(61,16,16,0.8)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(61,16,16,0.8)')}
              >
                <div className="p-2.5 rounded-md flex-shrink-0" style={{ background: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white uppercase tracking-tight truncate">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {p.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
