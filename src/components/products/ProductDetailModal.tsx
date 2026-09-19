import React, { useState } from 'react';
import { X, ShoppingBag, MessageSquare, Check, ShieldCheck, Snowflake, Layers, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatBDT, createProductInquiryWhatsApp } from '../../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToOrder } = useCart();
  const [qty, setQty] = useState(product ? (product.minQuantity || 5) : 5);
  const [customNotes, setCustomNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToOrder(product, qty, customNotes);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleWhatsApp = () => {
    const url = createProductInquiryWhatsApp(product);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden text-slate-900 border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header with image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-mono font-bold">
                Item Sl. {product.sl}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-200 text-[10px] font-bold">
                {product.categoryName}
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">{product.name}</h2>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Official Specs Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Official Processing & Cut Specification
            </h4>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {product.processingSpecification}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-100/80 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Supply Form</span>
              <strong className="text-slate-800 text-xs">{product.supplyForm}</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-100/80 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Pricing Unit</span>
              <strong className="text-slate-800 text-xs font-mono">Per {product.unit}</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-100/80 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Temperature</span>
              <strong className="text-emerald-700 text-xs flex items-center gap-1">
                <Snowflake className="w-3 h-3" />
                {product.temperature}
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-100/80 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Min. Order</span>
              <strong className="text-slate-800 text-xs font-mono">{product.minQuantity} {product.unit}</strong>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block">
                Official Wholesale Rate (Sept 2026 Schedule)
              </span>
              {product.priceVisible ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {formatBDT(product.rate)}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">/ {product.unit}</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-amber-900">
                  Custom Quotation for Commercial Volume
                </span>
              )}
            </div>
            <div className="text-right text-[11px] text-amber-800 font-medium">
              Weekly / Monthly Settlement
            </div>
          </div>

          {/* Custom Cut Instructions input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Custom Culinary Cut Instructions for this Item (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 'Skinless', '4-way curry cut', '2kg vacuum bags', 'specific piece weight'..."
              value={customNotes}
              onChange={e => setCustomNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Quantity and Order Action Bar */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-1 w-full sm:w-auto justify-center">
              <button
                onClick={() => setQty(prev => Math.max(product.minQuantity || 1, prev - 5))}
                className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded font-bold"
              >
                -
              </button>
              <span className="px-4 text-sm font-mono font-bold text-slate-800 min-w-14 text-center">
                {qty} {product.unit}
              </span>
              <button
                onClick={() => setQty(prev => prev + 5)}
                className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded font-bold"
              >
                +
              </button>
            </div>

            {/* Submit to Order */}
            <button
              onClick={handleAdd}
              className={`flex-1 w-full py-3 px-5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Order Request!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Add {qty} {product.unit} to Order</span>
                </>
              )}
            </button>

            {/* WhatsApp Inquiry */}
            <button
              onClick={handleWhatsApp}
              className="py-3 px-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
