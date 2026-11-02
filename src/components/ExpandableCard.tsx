import React, { useState, useRef } from 'react';
import { Eye, Plus, Check, Star, Camera } from 'lucide-react';
import { PhotoSet } from '../types/catalog';

interface ExpandableCardProps {
  set: PhotoSet;
  onSelect: (set: PhotoSet) => void;
  onAddToCart: (set: PhotoSet) => void;
  onToggleWishlist: (setId: string) => void;
  isWishlisted: boolean;
  onOpenStudio?: (studioId: string) => void;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  set,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenStudio,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setIsHovered(true);
    }, 150);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setIsHovered(false);
    setPreviewIndex(0);
    setTilt({ x: 0, y: 0 });
  };

  const currentImg = set.galleryImages[previewIndex] || set.coverImage;

  // Glow styling according to accent color
  const getGlowBorder = () => {
    switch (set.accentColor) {
      case 'magenta':
        return 'border-fuchsia-500/80 shadow-[0_12px_40px_-8px_rgba(217,70,239,0.5)]';
      case 'amber':
        return 'border-amber-500/80 shadow-[0_12px_40px_-8px_rgba(245,158,11,0.5)]';
      case 'indigo':
        return 'border-indigo-500/80 shadow-[0_12px_40px_-8px_rgba(99,102,241,0.5)]';
      case 'cyan':
      default:
        return 'border-cyan-500/80 shadow-[0_12px_40px_-8px_rgba(6,182,212,0.5)]';
    }
  };

  return (
    <div
      className="relative shrink-0 w-64 sm:w-72 md:w-80 select-none group"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '800px',
      }}
    >
      {/* Base Card Surface with 3D Tilt */}
      <div
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: isHovered ? 'none' : 'transform 0.2s ease-out',
        }}
        className={`relative overflow-hidden rounded-xl bg-slate-900/90 border border-white/10 transition-all duration-300 ${
          isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
        }`}
      >
        {/* Cover Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
          {!imgError ? (
            <img
              src={set.coverImage}
              alt={set.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-center">
              <Camera className="w-6 h-6 text-slate-500 mb-1" />
              <span className="text-xs text-slate-400 font-mono">{set.title}</span>
            </div>
          )}

          {/* Resolution Badge & Price Overlay */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
            {set.resolution}
          </div>

          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-xs font-mono font-bold text-emerald-400 border border-white/10 tabular-nums">
            ${set.price}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="truncate text-cyan-400/90 font-medium">
              {set.studioName}
            </span>
            <span className="tabular-nums flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              {set.rating}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {set.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{set.category}</span>
            <span aria-hidden="true">·</span>
            <span>{set.photoCount} Photos</span>
          </div>
        </div>
      </div>

      {/* Expanded Hover Card Overlay */}
      {isHovered && (
        <div
          className={`absolute -top-12 -left-6 -right-6 z-40 rounded-xl bg-[#0e0e17] border ${getGlowBorder()} overflow-hidden transition-all duration-300 transform scale-105 shadow-2xl animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Expanded Preview Header */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
            <img
              src={currentImg}
              alt={set.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter contrast-[1.05]"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e17] via-transparent to-black/30" />

            {/* Micro thumbnail scrubber dots */}
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5 z-10">
              {set.galleryImages.map((_, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setPreviewIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === previewIndex ? 'w-6 bg-cyan-400 shadow-[0_0_8px_#00f0ff]' : 'w-1.5 bg-white/40 hover:bg-white'
                  }`}
                  aria-label={`Preview angle ${i + 1}`}
                />
              ))}
            </div>

            {/* Resolution Tag */}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
              {set.resolution}
            </div>

            {/* Live photo scrubber hint */}
            <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-300">
              Angle {previewIndex + 1}/{set.galleryImages.length}
            </div>
          </div>

          {/* Expanded Card Details */}
          <div className="p-4 space-y-3">
            {/* Quick Action Buttons Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelect(set)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => onAddToCart(set)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
                  title="Add to Bag"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                </button>

                <button
                  onClick={() => onToggleWishlist(set.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                      : 'bg-white/10 border-white/15 text-slate-300 hover:text-white hover:bg-white/20'
                  }`}
                  title={isWishlisted ? 'Saved' : 'Save to Wishlist'}
                >
                  {isWishlisted ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>

              {/* Price */}
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                  ${set.price}
                </span>
              </div>
            </div>

            {/* Set Title */}
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                {set.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                {set.subtitle}
              </p>
            </div>

            {/* Clean Unboxed Metadata */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-slate-400 font-mono">
              <button
                onClick={() => onOpenStudio && onOpenStudio(set.studioId)}
                className="hover:text-cyan-300 transition-colors truncate max-w-[140px] text-left"
              >
                {set.studioName}
              </button>
              <div className="flex items-center gap-2">
                <span>{set.photoCount} Frames</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  {set.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
