import React from 'react';
import { Heart, ShoppingBag, Sparkles, Layers } from 'lucide-react';

interface TopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('catalog')}
            className="group flex items-center gap-2 text-left focus:outline-none"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 group-hover:bg-cyan-300 transition-colors shadow-[0_0_10px_#00f0ff]" />
            <span className="text-xl font-bold tracking-tight text-white font-display whitespace-nowrap">
              NEONARCH
            </span>
          </button>
        </div>

        {/* Zone 2: 4 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'catalog' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Catalog
          </button>

          <button
            onClick={() => onTabChange('studios')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'studios' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Studios
          </button>

          <button
            onClick={() => onTabChange('creators')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'creators' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Independent Sellers
          </button>

          <button
            onClick={() => onTabChange('categories')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'categories' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Categories
          </button>
        </nav>

        {/* Zone 3: Primary Action & Wishlist */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-pink-400"
            title="Saved Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-pink-500 text-white rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Primary Cart / Collection Action */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.35)] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded bg-slate-950 text-cyan-300 text-[11px] font-mono tabular-nums font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
