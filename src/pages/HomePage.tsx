import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { AboutSection } from '../components/home/AboutSection';
import { Capabilities } from '../components/home/Capabilities';
import { ColdChainFlow } from '../components/home/ColdChainFlow';
import { CustomerTypes } from '../components/home/CustomerTypes';
import { PartnersSection } from '../components/home/PartnersSection';
import { CustomCutBanner } from '../components/home/CustomCutBanner';
import { CustomCutModal } from '../components/quote/CustomCutModal';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { useAdmin } from '../context/AdminContext';
import { Product } from '../types';
import { ArrowRight, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { products } = useAdmin();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCustomCutOpen, setIsCustomCutOpen] = useState(false);

  // Pick 6 prominent cuts for preview
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero navigate={navigate} />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. About Section */}
      <AboutSection navigate={navigate} />

      {/* 4. Featured Products Catalog Preview */}
      <section className="py-20 bg-slate-100 text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-amber-800 font-mono text-xs uppercase font-bold tracking-wider">
                Commercial Product Schedule
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Featured Wholesale Cuts & Birds
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Precision dressed, eviscerated, chlorinated chilled bath processed, and portion-calibrated.
              </p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors self-start md:self-auto"
            >
              <span>View All 20+ Official Items</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectDetail={(prod) => setSelectedProduct(prod)}
                onNavigate={navigate}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>Explore Complete Wholesale Catalog & Rates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Supply Capabilities ("Built for Commercial Supply") */}
      <Capabilities navigate={navigate} />

      {/* 6. Cold-Chain Timeline Visualization */}
      <ColdChainFlow />

      {/* 7. Commercial Client Sectors */}
      <CustomerTypes navigate={navigate} />

      {/* 8. Selected Supply Partners (Documented Record) */}
      <PartnersSection navigate={navigate} />

      {/* 9. Need a Custom Cut? Banner */}
      <CustomCutBanner onOpenModal={() => setIsCustomCutOpen(true)} />

      {/* 10. Operational Processing Hubs Snapshot */}
      <section className="py-16 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Dhaka Hub Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                  <MapPin className="w-4 h-4" />
                  <span>Central Distribution Hub</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Dhaka Division
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {COMPANY_INFO.hubs.dhaka.title}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {COMPANY_INFO.hubs.dhaka.address}
              </p>
              <div className="pt-2 text-xs text-slate-400">
                Scheduled Daily Routes: Tejgaon, Kawran Bazar, Gulshan, Banani, Dhanmondi, Uttara & greater Dhaka.
              </div>
            </div>

            {/* Chattogram Hub Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                  <MapPin className="w-4 h-4" />
                  <span>Regional Distribution Hub</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Chattogram Division
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {COMPANY_INFO.hubs.chattogram.title}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {COMPANY_INFO.hubs.chattogram.address}
              </p>
              <div className="pt-2 text-xs text-slate-400">
                Scheduled Daily Routes: West Madarbari, Agrabad, Khulshi, GEC, Nasirabad & port area.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CustomCutModal
        isOpen={isCustomCutOpen}
        onClose={() => setIsCustomCutOpen(false)}
      />
    </div>
  );
};
