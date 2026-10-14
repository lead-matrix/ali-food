import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { ProductCategory } from '../../types';

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  activeTagFilter: string;
  setActiveTagFilter: (tag: string) => void;
  totalMatches: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  activeTagFilter,
  setActiveTagFilter,
  totalMatches,
}) => {
  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Products (20+)' },
    { id: 'broiler_cuts', label: 'Broiler Cuts & Portions' },
    { id: 'waterfowl_game_squab', label: 'Specialty Waterfowl & Squab' },
    { id: 'indigenous_birds', label: 'Heritage & Indigenous Birds' },
    { id: 'live_poultry', label: 'Live Healthy Poultry' },
  ];

  const quickPills = [
    { id: 'all', label: 'All Types' },
    { id: 'boneless', label: 'Boneless' },
    { id: 'bone-in', label: 'With Bone' },
    { id: 'skinless', label: 'Skinless' },
    { id: 'with-skin', label: 'Skin-on' },
    { id: 'specialty', label: 'Specialty & Game' },
    { id: 'chilled', label: 'Chilled' },
    { id: 'frozen', label: 'Frozen' },
    { id: 'live', label: 'Live Poultry' },
  ];

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveTagFilter('all');
  };

  const isFiltered = searchQuery !== '' || selectedCategory !== 'all' || activeTagFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Upper: Live Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search wholesale poultry... (e.g. 'breast', 'duck', 'drumstick', 'sonali', 'boneless')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Middle: Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lower: Attribute Tags & Clear Controls */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {quickPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveTagFilter(pill.id)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTagFilter === pill.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{totalMatches}</strong> commercial items
          </span>
          {isFiltered && (
            <button
              onClick={clearAllFilters}
              className="text-amber-800 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
