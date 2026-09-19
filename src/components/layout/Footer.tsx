import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight, Clock, Award } from 'lucide-react';
import { AliFoodLogo } from '../common/AliFoodLogo';
import { COMPANY_INFO } from '../../data/companyInfo';
import { createGeneralWhatsAppLink } from '../../utils/whatsapp';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="text-slate-400 text-sm" style={{ background: '#0D0303', borderTop: '1px solid #2A0A0A' }}>
      {/* Upper Corporate Banner */}
      <div className="border-b py-10 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(90deg, #1A0606 0%, #220808 50%, #1A0606 100%)', borderColor: '#2A0A0A' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Ready to streamline your institutional meat supply?
            </h3>
            <p className="text-slate-400 text-sm">
              Daily scheduled deliveries, custom culinary cuts, and guaranteed cold-chain integrity across Dhaka & Chattogram.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/order')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg transition-all"
            >
              <span>Submit Supply Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-900/60 font-semibold text-sm transition-all"
            >
              <span>WhatsApp Inquiries</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Scope (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <AliFoodLogo variant="dark" />
            <p className="text-xs leading-relaxed text-slate-400 pt-2">
              <strong className="text-slate-200">M/S ALI FOOD</strong> is a premier commercial agro-meat processor, institutional poultry manufacturer, and wholesale meat distributor in Bangladesh. Operating with bio-secure contract farming, temperature-controlled butchery, customized culinary portioning, and express cold-chain logistics.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Halal Manual Slaughter & Hygiene Assured</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
              <div>Management: <span className="text-slate-300 font-medium">{COMPANY_INFO.proprietor}</span> (Proprietor)</div>
              <div>Corporate Record: <span className="font-mono text-slate-300">{COMPANY_INFO.recordRef}</span></div>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Products & Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/order')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Order / Request Supply
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/supply')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Supply Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/partners')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Selected Partners
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Corporate Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Wholesale FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact & Hubs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Dhaka Processing Hub (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Dhaka Central Hub
            </h4>
            <div className="text-xs space-y-1 text-slate-300">
              <p className="font-semibold text-white">{COMPANY_INFO.hubs.dhaka.title}</p>
              <p className="text-slate-400 leading-relaxed">{COMPANY_INFO.hubs.dhaka.address}</p>
              <p className="text-[11px] text-slate-400 pt-1">
                Coverage: Tejgaon, Kawran Bazar, Gulshan, Banani, Dhanmondi, Uttara & greater Dhaka.
              </p>
            </div>
            <div className="pt-2 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Pre-dawn Route: 5:00 AM – 8:00 AM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Chattogram Hub & Direct Hotlines (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Chattogram Regional Hub
            </h4>
            <div className="text-xs space-y-1 text-slate-300">
              <p className="font-semibold text-white">{COMPANY_INFO.hubs.chattogram.title}</p>
              <p className="text-slate-400 leading-relaxed">{COMPANY_INFO.hubs.chattogram.address}</p>
            </div>

            <div className="pt-2 space-y-1.5 border-t border-slate-800 text-xs">
              <div className="text-slate-400 font-medium">Procurement Hotlines:</div>
              <div className="space-y-1 font-mono text-amber-400 font-semibold">
                <div>
                  <a href={`tel:${COMPANY_INFO.hotlines[0].raw}`} className="hover:underline">
                    {COMPANY_INFO.hotlines[0].number}
                  </a>
                </div>
                <div>
                  <a href={`tel:${COMPANY_INFO.hotlines[1].raw}`} className="hover:underline">
                    {COMPANY_INFO.hotlines[1].number}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Strict Compliance Notice */}
        <div className="mt-12 pt-8 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-400">M/S ALI FOOD</strong>. All rights reserved. “Your Trusted Meat Source”.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Wholesale & Institutional Meat Partner</span>
            <span>•</span>
            <span>Dhaka & Chattogram</span>
            <span>•</span>
            <button
              onClick={() => navigate('/admin')}
              className="hover:text-slate-300 underline"
            >
              Staff Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
