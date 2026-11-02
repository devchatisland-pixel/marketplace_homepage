import React, { useState } from 'react';
import { Eye, Plus, Check, Star, ShieldCheck } from 'lucide-react';
import { PhotoSet } from '../types/catalog';

interface HeroBillboardProps {
  featuredSets: PhotoSet[];
  onSelectSet: (set: PhotoSet) => void;
  onAddToCart: (set: PhotoSet) => void;
  onToggleWishlist: (setId: string) => void;
  isWishlisted: (setId: string) => boolean;
}

export const HeroBillboard: React.FC<HeroBillboardProps> = ({
  featuredSets,
  onSelectSet,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentSet = featuredSets[activeIndex] || featuredSets[0];
  const [imgError, setImgError] = useState(false);

  if (!currentSet) return null;

  const inWishlist = isWishlisted(currentSet.id);

  return (
    <div className="relative w-full h-[520px] md:h-[620px] overflow-hidden bg-slate-950 border-b border-white/10 select-none">
      {/* Background Photography Asset with Scrim Overlay */}
      <div className="absolute inset-0">
        {!imgError ? (
          <img
            src={currentSet.coverImage}
            alt={currentSet.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.08] transition-transform duration-1000 ease-out scale-100 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center">
            <span className="text-slate-600 font-mono text-sm">[Media Stream Ready]</span>
          </div>
        )}

        {/* Cinematic Scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060609] via-[#060609]/75 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060609] via-transparent to-black/40" />
      </div>

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 md:pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-1.5 font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentSet.studioName}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-sans">{currentSet.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-cyan-300 font-semibold">{currentSet.resolution}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] font-display text-balance drop-shadow-md">
            {currentSet.title}
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed line-clamp-2 max-w-xl">
            {currentSet.subtitle}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 font-mono">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold tabular-nums text-slate-100">{currentSet.rating}</span>
              <span className="text-slate-500">({currentSet.reviewCount})</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{currentSet.photoCount} High-Res Frames</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-bold tabular-nums">${currentSet.price} USD</span>
          </div>

          <div className="flex items-center gap-3 pt-3 flex-wrap">
            <button
              onClick={() => onSelectSet(currentSet)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all duration-200 shadow-[0_0_25px_rgba(6,182,212,0.45)] whitespace-nowrap active:scale-95"
            >
              <Eye className="w-4 h-4" />
              <span>Inspect Full Set</span>
            </button>

            <button
              onClick={() => onAddToCart(currentSet)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white glass-panel hover:bg-white/10 rounded-lg transition-colors border border-white/20 whitespace-nowrap active:scale-95"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={() => onToggleWishlist(currentSet.id)}
              className={`p-3 rounded-lg border transition-colors ${
                inWishlist
                  ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                  : 'glass-panel border-white/20 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              {inWishlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Featured Sets Carousel Indicator Pager */}
        <div className="hidden lg:flex items-center gap-2 absolute right-8 bottom-12 z-20">
          <span className="text-[11px] font-mono text-slate-400 mr-2 uppercase tracking-wider">
            Featured Reel ({activeIndex + 1}/{featuredSets.length})
          </span>
          {featuredSets.map((set, idx) => (
            <button
              key={set.id}
              onClick={() => {
                setActiveIndex(idx);
                setImgError(false);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-8 bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                  : 'w-2.5 bg-white/20 hover:bg-white/50'
              }`}
              title={set.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
