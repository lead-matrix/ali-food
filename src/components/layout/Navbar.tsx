import React, { useState } from 'react';
import { Phone, MessageSquare, Menu, X, ShieldCheck, Clock, Lock, UserCheck } from 'lucide-react';
import { AliFoodLogo } from '../common/AliFoodLogo';
import { COMPANY_INFO } from '../../data/companyInfo';
import { createGeneralWhatsAppLink } from '../../utils/whatsapp';
import { t } from '../../i18n';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.whatWeSupply, path: '/products' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
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
              Institutional Poultry & Wholesale Meat Supplier
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-[#38B265]" />
              Pre-dawn Express Routes (5:00 AM–8:00 AM)
            </span>
          </div>

          {/* Right hotlines & admin */}
          <div className="flex items-center gap-4 text-slate-300">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-slate-400">Dhaka & Chattogram:</span>
              <a
                href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                className="hover:text-[#F5A623] font-mono transition-colors font-semibold"
              >
                {COMPANY_INFO.hotlines[0].number}
              </a>
              <span className="text-slate-600">|</span>
              <a
                href={`tel:${COMPANY_INFO.hotlines[1].raw}`}
                className="hover:text-[#F5A623] font-mono transition-colors font-semibold"
              >
                {COMPANY_INFO.hotlines[1].number}
              </a>
            </div>

            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-xs transition-colors text-[#38B265] hover:text-emerald-400"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </a>

            {/* Small Admin Link */}
            <button
              onClick={() => handleNav('/admin')}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentPath.startsWith('/admin')
                  ? 'bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Super-Admin Console"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
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
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-sm font-semibold transition-all py-1 relative ${
                    isActive ? 'font-bold text-[#F5A623]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-0.5 rounded-full bg-[#F5A623]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs: Direct Call & Client Login */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
              className="hidden xl:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A0A0A] hover:bg-[#3D1212] text-slate-200 border border-[#4A1515] text-xs font-semibold tracking-wide transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#F5A623]" />
              <span>Direct Hotline</span>
            </a>

            <button
              onClick={() => handleNav('/client')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                currentPath.startsWith('/client')
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Client Login</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNav('/client')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Client Portal</span>
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
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'border-l-4 bg-[#2A0A0A] text-[#F5A623] border-[#F5A623]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            
            <button
              onClick={() => handleNav('/client')}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Client Portal Login
              </span>
            </button>

            <button
              onClick={() => handleNav('/admin')}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Super-Admin Console
              </span>
            </button>
          </div>

          <div className="pt-3 border-t flex flex-col gap-2" style={{ borderColor: '#3D1010' }}>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-xs font-semibold text-slate-200"
                style={{ background: '#2A0A0A', borderColor: '#4A1515' }}
              >
                <Phone className="w-3.5 h-3.5 text-[#F5A623]" />
                Call Hotline
              </a>
              <a
                href={createGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-xs font-semibold text-[#38B265]"
                style={{ background: '#0A2A12', borderColor: '#1A5A2A' }}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
