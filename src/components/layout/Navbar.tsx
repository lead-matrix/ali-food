import React, { useState } from 'react';
import { Phone, MessageSquare, ShoppingBag, Menu, X, ShieldCheck, Clock, Lock } from 'lucide-react';
import { AliFoodLogo } from '../common/AliFoodLogo';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { COMPANY_INFO } from '../../data/companyInfo';
import { createGeneralWhatsAppLink } from '../../utils/whatsapp';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { totalItemCount } = useCart();
  const { settings, isAdminLoggedIn } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products & Cuts', path: '/products' },
    { label: 'Supply Capabilities', path: '/supply' },
    { label: 'Supply Partners', path: '/partners' },
    { label: 'About Us', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1C0808] border-b border-[#3D1010] text-white shadow-xl">
      {/* Top Corporate Trust & Hotline Announcement Bar */}
      <div className="bg-[#100404] border-b border-[#2A0A0A] py-1.5 px-4 text-xs font-medium text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left badge */}
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#F5A623] font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              Institutional Poultry & Meat Partner
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-[#1A7A3C]" style={{ color: '#38B265' }} />
              Pre-dawn Express Routes (5:00 AM–8:00 AM)
            </span>
          </div>

          {/* Right hotlines */}
          <div className="flex items-center gap-4 text-slate-300">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-slate-400">Dhaka & Chattogram:</span>
              <a
                href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                className="hover:text-[#F5A623] font-mono transition-colors font-semibold"
              >
                {settings.primaryHotline}
              </a>
              <span className="text-slate-600">|</span>
              <a
                href={`tel:${COMPANY_INFO.hotlines[1].raw}`}
                className="hover:text-[#F5A623] font-mono transition-colors font-semibold"
              >
                {settings.secondaryHotline}
              </a>
            </div>
            
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-xs transition-colors"
              style={{ color: '#38B265' }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </a>

            <button
              onClick={() => handleNav('/admin')}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                isAdminLoggedIn
                  ? 'bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Private Administration Portal"
            >
              <Lock className="w-3 h-3" />
              {isAdminLoggedIn ? 'Admin Active' : 'Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Corporate Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity — Official Logo */}
          <div
            onClick={() => handleNav('/')}
            className="cursor-pointer transition-opacity hover:opacity-90"
          >
            <AliFoodLogo variant="dark" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-sm font-semibold transition-all py-1 relative ${
                    isActive
                      ? 'font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  style={isActive ? { color: '#F5A623' } : {}}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                      style={{ background: '#F5A623' }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
              className="hidden xl:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A0A0A] hover:bg-[#3D1212] text-slate-200 border border-[#4A1515] text-xs font-semibold tracking-wide transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" style={{ color: '#F5A623' }} />
              <span>Direct Hotline</span>
            </a>

            <button
              onClick={() => handleNav('/order')}
              className="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-bold text-sm tracking-wide shadow-md transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F5A623 0%, #E8940D 100%)',
                color: '#1C0808',
                boxShadow: '0 4px 14px rgba(245,166,35,0.25)',
              }}
            >
              <ShoppingBag className="w-4 h-4" style={{ color: '#1C0808' }} />
              <span>Request Supply</span>
              {totalItemCount > 0 && (
                <span
                  className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-black text-white rounded-full shadow-inner animate-pulse"
                  style={{ background: '#1C0808' }}
                >
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle & Cart Icon */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNav('/order')}
              className="relative p-2 rounded-lg border text-[#F5A623]"
              style={{ background: '#2A0A0A', borderColor: '#4A1515' }}
              aria-label="Order Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#F5A623', color: '#1C0808' }}
                >
                  {totalItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border text-slate-300 hover:text-white focus:outline-none"
              style={{ background: '#2A0A0A', borderColor: '#4A1515' }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden border-b px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150"
          style={{ background: '#1C0808', borderColor: '#3D1010' }}
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-l-4'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  style={isActive ? {
                    background: '#2A0A0A',
                    color: '#F5A623',
                    borderLeftColor: '#F5A623',
                  } : {}}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => handleNav('/admin')}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-white flex items-center justify-between"
              style={{ background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2A0A0A')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span>Administration Portal</span>
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-3 border-t flex flex-col gap-2" style={{ borderColor: '#3D1010' }}>
            <button
              onClick={() => handleNav('/order')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm tracking-wide shadow"
              style={{ background: '#F5A623', color: '#1C0808' }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order / Request Supply ({totalItemCount} Items)</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-xs font-semibold text-slate-200"
                style={{ background: '#2A0A0A', borderColor: '#4A1515' }}
              >
                <Phone className="w-3.5 h-3.5" style={{ color: '#F5A623' }} />
                Call Hotline
              </a>
              <a
                href={createGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-xs font-semibold"
                style={{ background: '#0A2A12', borderColor: '#1A5A2A', color: '#38B265' }}
              >
                <MessageSquare className="w-3.5 h-3.5" style={{ color: '#38B265' }} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
