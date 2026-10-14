import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*NEW ENQUIRY FROM WEBSITE*
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Company:* ${formData.company || 'Not Specified'}
*Message:* ${formData.message}`;

    const url = `https://wa.me/8801319345501?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner */}
        <div
          className="text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)', borderColor: '#3D1010' }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
                <Phone className="w-3.5 h-3.5" />
                <span>Direct Commercial Communications</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                Contact M/S ALI FOOD
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Contact our procurement desk or logistics dispatch hubs in Dhaka and Chattogram for wholesale rate inquiries, delivery scheduling, or custom portioning.
              </p>
            </div>
            <div className="hidden md:flex flex-shrink-0 items-center justify-center">
              <img
                src="/images/alifood-emblem.svg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/alifood-emblem.png';
                }}
                alt="M/S Ali Food Emblem"
                className="w-24 h-24 lg:w-28 lg:h-28 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Dual Hub Cards & Hotline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Hubs & Contact Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dhaka Head Office */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                  Dhaka Central Hub
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                {COMPANY_INFO.hubs.dhaka.title}
              </h2>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium text-slate-800">
                    {COMPANY_INFO.hubs.dhaka.address}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 pt-1">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pre-dawn Dispatch Route: 5:00 AM – 8:00 AM Daily</span>
                </div>
              </div>
            </div>

            {/* Chattogram Regional Office */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                  Chattogram Regional Hub
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                {COMPANY_INFO.hubs.chattogram.title}
              </h2>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium text-slate-800">
                    {COMPANY_INFO.hubs.chattogram.address}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 pt-1">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Regional Pre-dawn Logistics Active Daily</span>
                </div>
              </div>
            </div>

            {/* Direct Commercial Hotlines Card */}
            <div
              className="text-white rounded-2xl border p-6 shadow-md space-y-4"
              style={{ background: '#160606', borderColor: '#3D1010' }}
            >
              <h3 className="text-xs font-mono uppercase text-amber-400 font-bold">
                Tap-to-Call Procurement Hotlines
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Direct Procurement Hotline (Dhaka)
                  </span>
                  <a
                    href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                    className="text-base font-black text-amber-300 font-mono hover:underline flex items-center gap-2 mt-0.5"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>{COMPANY_INFO.hotlines[0].number}</span>
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Operations & Logistics (Chattogram)
                  </span>
                  <a
                    href={`tel:${COMPANY_INFO.hotlines[1].raw}`}
                    className="text-base font-black text-amber-300 font-mono hover:underline flex items-center gap-2 mt-0.5"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>{COMPANY_INFO.hotlines[1].number}</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Official Corporate Email
                  </span>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="text-xs text-slate-200 hover:text-white underline font-mono flex items-center gap-2 mt-0.5"
                  >
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{COMPANY_INFO.email}</span>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={createGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Direct Chat</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right: Simple Enquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Send an Enquiry
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill in your details to immediately initiate a structured WhatsApp chat with our procurement team.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Company / Establishment (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Restaurant / Supermarket name"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Message / Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What products or daily volumes are you looking for? (e.g., 50kg skinless broiler breast daily for Tejgaon kitchen)..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Enquiry via WhatsApp</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                Clicking opens WhatsApp with your prefilled enquiry text for an instant response.
              </p>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
