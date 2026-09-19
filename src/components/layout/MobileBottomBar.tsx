import React from 'react';
import { Phone, MessageSquare, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { COMPANY_INFO } from '../../data/companyInfo';
import { createGeneralWhatsAppLink } from '../../utils/whatsapp';

interface MobileBottomBarProps {
  navigate: (path: string) => void;
  currentPath: string;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ navigate, currentPath }) => {
  const { totalItemCount } = useCart();

  if (currentPath === '/order') {
    // Hide or simplify on the actual checkout page to avoid clutter
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
          <Phone className="w-4 h-4 mb-0.5" style={{ color: '#F5A623' }} />
          <span className="text-[11px] font-bold tracking-tight">Call</span>
          <span className="text-[9px] text-slate-400 font-mono">01319-345501</span>
        </a>

        {/* WhatsApp Inquiry */}
        <a
          href={createGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg active:scale-95 transition-all text-center"
          style={{ background: '#0A2A12', border: '1px solid #1A5A2A', color: '#38B265' }}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" style={{ color: '#38B265' }} />
          <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
          <span className="text-[9px]" style={{ color: '#38B265' }}>Direct Chat</span>
        </a>

        {/* Order / Supply Request */}
        <button
          onClick={() => {
            navigate('/order');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="relative flex flex-col items-center justify-center py-2 px-1 rounded-lg font-bold active:scale-95 transition-all text-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #F5A623 0%, #E8940D 100%)', color: '#1C0808', boxShadow: '0 4px 12px rgba(245,166,35,0.25)' }}
        >
          <div className="relative mb-0.5">
            <ShoppingBag className="w-4 h-4" style={{ color: '#1C0808' }} />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 font-black text-[9px] min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center" style={{ background: '#1C0808', color: '#F5A623', border: '1px solid #F5A623' }}>
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-black tracking-tight leading-tight">Order Supply</span>
          <span className="text-[9px] font-medium" style={{ color: '#3D1010' }}>
            {totalItemCount > 0 ? `${totalItemCount} items ready` : 'View Cart'}
          </span>
        </button>
      </div>
    </div>
  );
};
