import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { CustomCutBanner } from '../components/home/CustomCutBanner';
import { CustomCutModal } from '../components/quote/CustomCutModal';
import { Product } from '../types';
import { Package, ShieldCheck, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';

interface ProductsPageProps {
  navigate: (path: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ navigate }) => {
  const { products } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTagFilter, setActiveTagFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCustomCutOpen, setIsCustomCutOpen] = useState(false);

  // Advanced multi-criteria filtering
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSpec = item.processingSpecification.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchSpec && !matchDesc && !matchTags) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Attribute Filter
      if (activeTagFilter !== 'all') {
        switch (activeTagFilter) {
          case 'boneless':
            if (!item.isBoneless) return false;
            break;
          case 'bone-in':
            if (item.isBoneless || item.isLive) return false;
            break;
          case 'skinless':
            if (item.hasSkin || item.isLive) return false;
            break;
          case 'with-skin':
            if (!item.hasSkin || item.isLive) return false;
            break;
          case 'specialty':
            if (!item.isSpecialty) return false;
            break;
          case 'live':
            if (!item.isLive) return false;
            break;
          case 'chilled':
            if (item.temperature !== 'Chilled') return false;
            break;
          case 'frozen':
            if (item.temperature !== 'Frozen' && !item.supplyForm.includes('Frozen')) return false;
            break;
        }
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, activeTagFilter]);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div
          className="text-white rounded-2xl p-8 shadow-xl relative overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #1C0808 0%, #2A0A0A 100%)', borderColor: '#3D1010' }}
        >
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Institutional Rate Schedule • Ref {COMPANY_INFO.recordRef}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Commercial Products & Supply Catalog
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Standardized culinary portions, specialty waterfowl, calibrated dressed birds, and live poultry. All processed under 100% Halal manual protocols with active 0°C–4°C chilled handling.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>Billing Terms: <strong>{COMPANY_INFO.billingTerms}</strong></span>
              <span>•</span>
              <span>Vendor Code: <strong className="font-mono text-amber-400">{COMPANY_INFO.vendorCode}</strong></span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <ProductFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeTagFilter={activeTagFilter}
          setActiveTagFilter={setActiveTagFilter}
          totalMatches={filteredProducts.length}
        />

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-4 shadow-sm">
            <Package className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              No products found matching your criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try modifying your search keywords or resetting the filters to view the entire commercial supply catalog.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setActiveTagFilter('all');
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectDetail={(p) => setSelectedProduct(p)}
                onNavigate={navigate}
              />
            ))}
          </div>
        )}

        {/* Custom Cut Callout */}
        <CustomCutBanner onOpenModal={() => setIsCustomCutOpen(true)} />

      </div>

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
