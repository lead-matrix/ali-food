import React from 'react';
import { CheckCircle2, MessageSquare, Phone, Printer, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';
import { formatBDT, createOrderWhatsAppMessage } from '../../utils/whatsapp';
import { COMPANY_INFO } from '../../data/companyInfo';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, navigate }) => {
  if (!order) return null;

  const handleWhatsApp = () => {
    const url = createOrderWhatsAppMessage(order);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden text-slate-900 border border-slate-200 my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Banner */}
        <div
          className="text-white p-6 sm:p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)' }}
        >
          <div className="relative z-10 space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              B2B Order Request Logged
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Order Reference: {order.orderNumber}
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your ALI FOOD order request has been received. Our logistics desk will review product availability and confirm scheduled dispatch.
            </p>
          </div>
        </div>

        {/* Modal Content / Order Sheet */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-bold">Pending Commercial Verification:</strong>
              <span>
                To expedite pre-dawn dispatch for tomorrow morning, tap below to send this order summary directly to the procurement desk via WhatsApp or call our hotline.
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Client</span>
              <strong className="text-slate-900 block truncate">{order.companyName || order.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Hub & City</span>
              <strong className="text-slate-900 block">{order.deliveryCity} Regional</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Preferred Slot</span>
              <strong className="text-slate-900 block truncate">{order.preferredTimeSlot.split(' ')[0]} {order.preferredTimeSlot.split(' ')[1]}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Estimated Subtotal</span>
              <strong className="text-emerald-700 font-mono font-bold block">{formatBDT(order.estimatedTotal)}</strong>
            </div>
          </div>

          {/* Items Summary Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 text-xs font-mono font-bold text-slate-700 flex justify-between">
              <span>Item Description</span>
              <span>Qty & Rate</span>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 text-xs flex items-start justify-between gap-4">
                  <div>
                    <strong className="text-slate-900 block">{item.productName}</strong>
                    {item.customNotes && (
                      <span className="text-[11px] text-amber-800 font-medium block">
                        Cut Note: {item.customNotes}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="font-bold text-slate-800">{item.quantity} {item.unit}</span>
                    <span className="text-slate-500 block text-[11px]">
                      {item.priceVisible ? formatBDT(item.subtotal) : 'Quote Basis'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm & Dispatch on WhatsApp (1-Click)</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>Call Hotline</span>
              </a>

              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Packing Slip</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Copy sent to: <span className="font-mono text-slate-700">{order.email || COMPANY_INFO.email}</span>
          </span>
          <button
            onClick={() => {
              onClose();
              navigate('/products');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600"
          >
            <span>Back to Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
