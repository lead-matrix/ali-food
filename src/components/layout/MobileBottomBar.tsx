import React from 'react';
import { Phone, MessageSquare, UserCheck } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';
import { createGeneralWhatsAppLink } from '../../utils/whatsapp';

interface MobileBottomBarProps {
  navigate: (path: string) => void;
  currentPath: string;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ navigate, currentPath }) => {
  // Hide on admin portal to provide max screen real estate for admin dashboard
  if (currentPath.startsWith('/admin')) {
    return null;
  }

  return (
    <div
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 backdrop-blur-md p-2 shadow-2xl"
      style={{ background: 'rgba(28,8,8,0.97)', borderTop: '1px solid #3D1010' }}
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* Call Hotline */}
        <a
          href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg active:scale-95 transition-all text-center text-slate-200"
          style={{ background: '#2A0A0A', border: '1px solid #4A1515' }}
        >
          <Phone className="w-4 h-4 mb-0.5 text-[#F5A623]" />
          <span className="text-[11px] font-bold tracking-tight">Call</span>
          <span className="text-[9px] text-slate-400 font-mono">01319-345501</span>
        </a>

        {/* WhatsApp Inquiry */}
        <a
          href={createGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg active:scale-95 transition-all text-center text-[#38B265]"
          style={{ background: '#0A2A12', border: '1px solid #1A5A2A' }}
        >
          <MessageSquare className="w-4 h-4 mb-0.5 text-[#38B265]" />
          <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
          <span className="text-[9px]">Direct Chat</span>
        </a>

        {/* Client Login */}
        <button
          onClick={() => {
            navigate('/client');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg font-bold active:scale-95 transition-all text-center shadow-md ${
            currentPath.startsWith('/client')
              ? 'bg-amber-400 text-slate-950'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950'
          }`}
        >
          <UserCheck className="w-4 h-4 mb-0.5 text-slate-950" />
          <span className="text-[11px] font-black tracking-tight leading-tight">Client Login</span>
          <span className="text-[9px] text-amber-950 font-medium">Invoices & Dues</span>
        </button>
      </div>
    </div>
  );
};
