import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { formatBDT, createProductInquiryWhatsApp } from '../utils/whatsapp';
import { ShoppingBag, ArrowLeft, MessageSquare, Phone, ShieldCheck, Snowflake, Check, Sparkles, ChevronRight, PackageCheck, Scissors } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { CustomCutModal } from '../components/quote/CustomCutModal';

interface ProductDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, navigate }) => {
  const { products } = useAdmin();
  const { addToOrder } = useCart();
  
  const product = products.find(p => p.slug === slug) || products[0];
  const [qty, setQty] = useState(product ? (product.minQuantity || 10) : 10);
  const [customNotes, setCustomNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [isCustomCutOpen, setIsCustomCutOpen] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    addToOrder(product, qty, customNotes);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = createProductInquiryWhatsApp(product);
    window.open(url, '_blank');
  };

  // Related products from same category
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-slate-900">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate('/products')} className="hover:text-slate-900">
            Products & Cuts
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Container */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Media (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 relative min-h-[380px] lg:min-h-[500px]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-slate-950/90 text-amber-400 text-xs font-mono font-bold px-2.5 py-1 rounded shadow">
                Schedule Sl. {product.sl}
              </span>
              <span className="bg-white/95 text-slate-900 text-xs font-bold px-2.5 py-1 rounded shadow">
                {product.supplyForm}
              </span>
            </div>

            {product.isBoneless && (
              <span className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                100% Boneless
              </span>
            )}

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Storage: <strong className="text-emerald-400">{product.temperature}</strong></span>
                <span>Pricing Unit: <strong className="font-mono text-white">Per {product.unit}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Product Details & Order Builder (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-800 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                  {product.categoryName}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Min. Order: {product.minQuantity} {product.unit}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {product.name}
              </h1>

              {/* Official Processing Specification Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                  Processing & Cut Specification
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {product.processingSpecification}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {product.description}
                </p>
              </div>

              {/* Wholesale Rate Schedule Card */}
              <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-900 block">
                    Institutional Wholesale Rate
                  </span>
                  {product.priceVisible ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-slate-900 font-mono">
                        {formatBDT(product.rate)}
                      </span>
                      <span className="text-sm font-medium text-slate-600">/ {product.unit}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-amber-900">
                      Contract Quotation Basis
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 block">
                    Effective: September 2026 Schedule • Weekly / Monthly Settlement
                  </span>
                </div>

                <button
                  onClick={() => setIsCustomCutOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Custom Cut Spec?</span>
                </button>
              </div>

              {/* Technical Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Cut Structure</span>
                  <strong className="text-slate-800 font-semibold">
                    {product.isBoneless ? '100% Boneless' : 'Bone-in Carcass'}
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Skin Protocol</span>
                  <strong className="text-slate-800 font-semibold">
                    {product.hasSkin ? 'Skin-on Natural' : 'Skin-peeled / Skinned'}
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Chill Chain</span>
                  <strong className="text-emerald-700 font-semibold">
                    0°C–4°C Bath Wash
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Slaughter</span>
                  <strong className="text-slate-800 font-semibold">
                    100% Halal Manual
                  </strong>
                </div>
              </div>

              {/* Custom Cutting instructions field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Cut or Packaging Instruction for this Item (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 'Standard 8-way curry cut', 'trimmed tenderloins', '2.5kg bags'..."
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => setQty(prev => Math.max(product.minQuantity || 1, prev - 5))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-mono font-bold text-slate-900 min-w-16 text-center">
                    {qty} {product.unit}
                  </span>
                  <button
                    onClick={() => setQty(prev => prev + 5)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Order Button */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 w-full py-3.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Supply Request Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      <span>Add {qty} {product.unit} to Order Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="py-2.5 px-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Inquire Availability</span>
                </button>

                <a
                  href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                  className="py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Call {COMPANY_INFO.hotlines[0].number}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Complementary & Related Items */}
        {related.length > 0 && (
          <div className="pt-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              Complementary Wholesale Cuts in {product.categoryName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(`/products/${item.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-amber-500 cursor-pointer transition-all shadow-sm flex items-center gap-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      {item.supplyForm}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-700 block mt-1">
                      {formatBDT(item.rate)} / {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <CustomCutModal
        isOpen={isCustomCutOpen}
        onClose={() => setIsCustomCutOpen(false)}
      />
    </div>
  );
};
