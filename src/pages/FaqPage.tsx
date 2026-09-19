import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';

interface FaqPageProps {
  navigate: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ navigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What are the commercial billing and payment terms for institutional clients?",
      a: "As documented in our institutional vendor agreement, Ali Food supports Weekly and Monthly Corporate Settlement terms for approved commercial partners (supermarkets, restaurants, and catering chains) following credit verification."
    },
    {
      q: "What delivery hours and routes does Ali Food operate?",
      a: "Ali Food operates dedicated daily pre-dawn express delivery routes between 5:00 AM and 8:00 AM across Dhaka and Chattogram. This ensures wholesale fresh and chilled poultry arrives before kitchen staff begin morning food preparation."
    },
    {
      q: "How does Ali Food maintain cold-chain temperature integrity during transport?",
      a: "Immediately following evisceration, products undergo an active chlorinated chilled water bath to achieve 0°C–4°C internal muscle temperature. Chilled meats are held strictly at 0°C–4°C, while deep-freeze items are stored at -18°C. Delivery vehicles maintain cold insulation."
    },
    {
      q: "Can we request custom culinary portioning and specific gram weights?",
      a: "Yes. Customized culinary portioning is a core documented supply capability. We accommodate specific chef specifications including 100% boneless breast fillets, skinless descaled drumsticks, Thai cuts, 4-way/8-way curry cuts, whole calibrated roast chickens (800g–900g), and vacuum-sealed offals."
    },
    {
      q: "Are all poultry products certified 100% Halal?",
      a: "Yes. All birds undergo 100% Halal manual slaughter performed by trained Muslim slaughter personnel with complete blood draining and strict hygienic sanitary protocols adhering strictly to national food safety benchmarks."
    },
    {
      q: "What are the minimum order quantities for wholesale supply?",
      a: "Minimum order quantities vary by cut and product type—typically 10–20 Kg for high-volume broiler portions (such as skinless broiler or bone-in breast) and 5–10 units/Kg for specialty waterfowl, heritage birds, or live healthy chickens."
    },
    {
      q: "Which geographical areas are covered by Ali Food's delivery divisions?",
      a: "Ali Food operates dual regional logistics divisions: Dhaka Central Commercial Division (operating from Tejgaon, serving greater Dhaka including Kawran Bazar, Gulshan, Banani, Dhanmondi, Uttara, Mirpur) and Chattogram Regional Division (operating from West Madarbari, serving Agrabad, Khulshi, Nasirabad, GEC, and surrounding areas)."
    },
    {
      q: "How do we start a regular weekly supply contract?",
      a: "You can submit an order request directly via this digital portal, contact our procurement hotlines (01319-345501 / 01401-238019), or click the WhatsApp link to discuss volume pricing and delivery schedules."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-bold uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Institutional Procurement Knowledgebase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Essential information regarding commercial ordering, culinary cut specifications, cold-chain standards, and corporate settlement terms.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:bg-slate-50 transition-colors"
                >
                  <span className="leading-snug">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="text-white rounded-2xl p-8 text-center space-y-4 shadow-xl border"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)', borderColor: '#3D1010' }}
        >
          <h3 className="text-lg font-bold">Have a specific supply or portioning question?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Speak directly with our procurement desk in Tejgaon, Dhaka or West Madarbari, Chattogram.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Contact Operations Desk
            </button>
            <button
              onClick={() => navigate('/order')}
              className="px-5 py-2.5 rounded-lg bg-slate-800 text-white font-bold text-xs uppercase tracking-wider"
            >
              Submit Order Request
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
