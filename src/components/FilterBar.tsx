import React from 'react';
import { Search, X } from 'lucide-react';
import { Category } from '../types/catalog';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  creatorFilter: 'all' | 'studios' | 'independents';
  onCreatorFilterChange: (filter: 'all' | 'studios' | 'independents') => void;
  sortBy: 'featured' | 'rating' | 'price-asc' | 'price-desc' | 'photos';
  onSortChange: (sort: 'featured' | 'rating' | 'price-asc' | 'price-desc' | 'photos') => void;
}

const CATEGORIES: Category[] = [
  'All',
  'High Heels & Arches',
  'Silk & Boudoir',
  'Beach & Water Droplets',
  'Streetwear & Sneakers',
  'Sculptural Monochrome',
  'Tattooed & Golden Gems',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  creatorFilter,
  onCreatorFilterChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* Top Controls Row: Search + Creator Switcher + Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sets, studios, heels, beach, cameras..."
            className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-slate-900/90 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Creator Scope Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-white/10 rounded-lg self-start md:self-auto">
          <button
            onClick={() => onCreatorFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              creatorFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Market
          </button>
          <button
            onClick={() => onCreatorFilterChange('studios')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              creatorFilter === 'studios'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Premier Studios
          </button>
          <button
            onClick={() => onCreatorFilterChange('independents')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              creatorFilter === 'independents'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Independents
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="featured">Featured Releases</option>
            <option value="rating">Highest Rated (★ 5.0)</option>
            <option value="photos">Most Photos in Set</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Horizontal Category Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-white text-slate-950 font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'glass-panel text-slate-300 hover:text-white hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
