import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Clock, Building2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    hub: 'Dhaka',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div
          className="text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)', borderColor: '#3D1010' }}
        >
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Commercial Communications</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Contact ALI FOOD
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Connect directly with our Dhaka central processing hub or Chattogram regional division for wholesale rate schedules, bulk inquiries, or scheduled daily deliveries.
            </p>
          </div>
        </div>

        {/* Dual Hub Cards & Hotline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Office Hubs & Hotline Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dhaka Head Office */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                  Dhaka Central Division
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
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                  Chattogram Regional Division
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
                Official Inquiries & Desk Hotlines
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Direct Procurement Hotline
                  </span>
                  <a
                    href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                    className="text-base font-black text-amber-300 font-mono hover:underline"
                  >
                    {COMPANY_INFO.hotlines[0].number}
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Operations & Supply Logistics
                  </span>
                  <a
                    href={`tel:${COMPANY_INFO.hotlines[1].raw}`}
                    className="text-base font-black text-amber-300 font-mono hover:underline"
                  >
                    {COMPANY_INFO.hotlines[1].number}
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Official Corporate Email
                  </span>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="text-xs text-slate-200 hover:text-white underline font-mono"
                  >
                    {COMPANY_INFO.email}
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
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right: Institutional Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Submit Commercial Inquiry
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Inquire regarding bulk supply, contract terms, or special poultry cuts.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Inquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for contacting M/S Ali Food. Our commercial desk will review your inquiry and follow up promptly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Restaurant / Business"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
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
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="procurement@company.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Relevant Logistics Hub
                  </label>
                  <select
                    value={formData.hub}
                    onChange={e => setFormData({ ...formData, hub: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="Dhaka">Dhaka Central Processing Hub (Tejgaon)</option>
                    <option value="Chattogram">Chattogram Regional Hub (West Madarbari)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Message / Procurement Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details regarding your expected weekly poultry volume, custom cuts requirements, or contract inquiries..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Send Commercial Inquiry</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
