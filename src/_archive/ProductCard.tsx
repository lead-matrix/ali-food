import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Info, MessageSquare, Check, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatBDT, createProductInquiryWhatsApp } from '../../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onSelectDetail: (product: Product) => void;
  onNavigate?: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectDetail, onNavigate }) => {
  const { addToOrder } = useCart();
  const [qty, setQty] = useState(product.minQuantity || 5);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToOrder(product, qty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1800);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = createProductInquiryWhatsApp(product);
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={() => {
        if (onNavigate) {
          onNavigate(`/products/${product.slug}`);
        } else {
          onSelectDetail(product);
        }
      }}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Upper Media Block */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60" />

          {/* Top Pill Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <span className="bg-slate-900/90 backdrop-blur-md text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
              Sl. {product.sl}
            </span>
            <span className="bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow">
              {product.supplyForm}
            </span>
          </div>

          {/* Right Specialty / Attribute Badge */}
          {product.isBoneless && (
            <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              100% Boneless
            </span>
          )}
          {product.isSpecialty && (
            <span className="absolute top-2.5 right-2.5 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Specialty
            </span>
          )}

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-white">
            <span className="text-[11px] font-medium tracking-wide drop-shadow-sm text-slate-200">
              Min. Order: {product.minQuantity} {product.unit}
            </span>
            <span className="text-[11px] font-medium text-emerald-300 drop-shadow-sm">
              {product.temperature}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.processingSpecification}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <span className="truncate">{product.categoryName}</span>
          </div>
        </div>
      </div>

      {/* Bottom Pricing & Action Section */}
      <div className="p-4 pt-0 space-y-3">
        {/* Rate Display */}
        <div className="pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Official Rate
            </span>
            {product.priceVisible ? (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-900 font-mono">
                  {formatBDT(product.rate)}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ {product.unit}</span>
              </div>
            ) : (
              <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-xs">
                Request Quotation
              </span>
            )}
          </div>

          {/* Quick Specification Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectDetail(product);
            }}
            className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 font-semibold"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Specs</span>
          </button>
        </div>

        {/* Quantity Controller & Add to Order */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {/* Stepper */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden"
            >
              <button
                onClick={() => setQty(prev => Math.max(product.minQuantity || 1, prev - 5))}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-mono font-bold text-slate-800 min-w-8 text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(prev => prev + 5)}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add to Order CTA */}
            <button
              onClick={handleAdd}
              className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                addedNotice
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added {qty} {product.unit}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add to Order</span>
                </>
              )}
            </button>
          </div>

          {/* Quick WhatsApp Inquiry for this item */}
          <button
            onClick={handleWhatsApp}
            className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            <MessageSquare className="w-3 h-3 text-emerald-600" />
            <span>Inquire Availability on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
