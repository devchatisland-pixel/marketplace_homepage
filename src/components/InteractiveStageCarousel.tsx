import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Eye, Plus, Check, Star, 
  Play, Pause, ShieldCheck, Sparkles, MoveHorizontal 
} from 'lucide-react';
import { PhotoSet } from '../types/catalog';

interface InteractiveStageCarouselProps {
  sets: PhotoSet[];
  onSelectSet: (set: PhotoSet) => void;
  onAddToCart: (set: PhotoSet) => void;
  onToggleWishlist: (setId: string) => void;
  isWishlisted: (setId: string) => boolean;
  onActiveCardChange?: (accent: 'cyan' | 'magenta' | 'amber' | 'indigo') => void;
}

export const InteractiveStageCarousel: React.FC<InteractiveStageCarouselProps> = ({
  sets,
  onSelectSet,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onActiveCardChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const activeSet = sets[currentIndex] || sets[0];

  useEffect(() => {
    if (activeSet && onActiveCardChange) {
      onActiveCardChange(activeSet.accentColor);
    }
  }, [currentIndex, activeSet, onActiveCardChange]);

  useEffect(() => {
    if (isPlaying) {
      autoplayTimer.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sets.length);
      }, 4500);
    }
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [isPlaying, sets.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sets.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sets.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sets.length]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
    setIsPlaying(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX !== null) {
      setDragOffset(e.clientX - dragStartX);
    }
  };

  const handlePointerUp = () => {
    if (dragStartX !== null) {
      if (dragOffset > 70) {
        handlePrev();
      } else if (dragOffset < -70) {
        handleNext();
      }
      setDragStartX(null);
      setDragOffset(0);
    }
  };

  if (!sets || sets.length === 0) return null;

  const getCardStyle = (index: number) => {
    const length = sets.length;
    let delta = (index - currentIndex) % length;
    if (delta > length / 2) delta -= length;
    if (delta < -length / 2) delta += length;

    const isCenter = delta === 0;
    const absDelta = Math.abs(delta);

    if (absDelta > 2) {
      return {
        display: 'none',
      };
    }

    const translateX = delta * 260 + (isCenter ? dragOffset * 0.8 : 0);
    const translateZ = -absDelta * 140;
    const rotateY = -delta * 28;
    const scale = isCenter ? 1.05 : 0.82;
    const opacity = isCenter ? 1 : Math.max(0.3, 0.8 - absDelta * 0.25);
    const zIndex = 30 - absDelta * 10;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      transition: dragStartX !== null ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
    };
  };

  const inWishlist = isWishlisted(activeSet.id);

  return (
    <div 
      className="relative w-full py-8 md:py-12 overflow-hidden select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Stage Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] animate-pulse" />
            <span>Interactive 3D Stage Carousel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display mt-1">
            Featured Studio Collections
          </h2>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-400 font-mono">
            <MoveHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drag or click side cards to rotate</span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={isPlaying ? 'Pause Auto-Spin' : 'Play Auto-Spin'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4" />}
          </button>

          <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-md tabular-nums">
            {currentIndex + 1} / {sets.length}
          </span>
        </div>
      </div>

      {/* 3D Spatial Carousel Stage */}
      <div 
        className="relative h-[380px] sm:h-[440px] md:h-[500px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* Active Stage Spotlight Beam */}
        <div 
          className="absolute top-0 w-96 h-96 -translate-y-1/2 rounded-full blur-[110px] pointer-events-none transition-colors duration-700"
          style={{
            background: activeSet.accentColor === 'magenta' 
              ? 'radial-gradient(circle, rgba(217,70,239,0.35) 0%, transparent 70%)'
              : activeSet.accentColor === 'amber'
              ? 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)'
          }}
        />

        {/* Left Glowing Navigation Chevron */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 sm:left-8 md:left-16 z-40 p-3 sm:p-4 rounded-2xl glass-panel text-cyan-300 border border-cyan-400/40 hover:border-cyan-300 hover:bg-cyan-500/20 hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* 3D Cards Track */}
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {sets.map((set, index) => {
            const isCenter = index === currentIndex;
            const style = getCardStyle(index);

            return (
              <div
                key={set.id}
                onClick={() => {
                  if (!isCenter) {
                    setCurrentIndex(index);
                  }
                }}
                className={`absolute w-72 sm:w-80 md:w-96 rounded-2xl overflow-hidden cursor-pointer select-none border transition-shadow duration-500 ${
                  isCenter
                    ? 'border-cyan-400 shadow-[0_15px_45px_-10px_rgba(6,182,212,0.5)] bg-slate-900 ring-1 ring-cyan-300/40'
                    : 'border-white/10 bg-slate-950/80 hover:border-white/30'
                }`}
                style={style}
              >
                {/* Card Media Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={set.coverImage}
                    alt={set.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />

                  {/* Resolution & Price Badges */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
                    {set.resolution}
                  </div>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md text-xs font-mono font-bold text-emerald-400 border border-white/10 tabular-nums">
                    ${set.price} USD
                  </div>
                </div>

                {/* Card Info Box */}
                <div className="p-4 sm:p-5 space-y-2 bg-[#0c0c16]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold truncate">
                      {set.studioName}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {set.rating}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white font-display tracking-tight line-clamp-1">
                    {set.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {set.subtitle}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 font-mono">
                    <span>{set.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{set.photoCount} High-Res Frames</span>
                  </div>

                  {/* Quick Action Buttons (Only active on center card) */}
                  {isCenter && (
                    <div className="pt-3 flex items-center gap-2 border-t border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSet(set);
                        }}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full Set</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(set);
                        }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
                        title="Add to Bag"
                      >
                        <Plus className="w-4 h-4 text-cyan-400" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(set.id);
                        }}
                        className={`p-2 rounded-lg border transition-colors ${
                          inWishlist
                            ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                            : 'bg-white/10 border-white/15 text-slate-300 hover:text-white'
                        }`}
                        title="Wishlist"
                      >
                        {inWishlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Wet Obsidian Floor Reflection */}
                <div 
                  className="w-full h-16 opacity-20 overflow-hidden transform scale-y-[-1] pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]"
                  aria-hidden="true"
                >
                  <img
                    src={set.coverImage}
                    alt=""
                    className="w-full h-full object-cover filter blur-[2px]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Glowing Navigation Chevron */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 sm:right-8 md:right-16 z-40 p-3 sm:p-4 rounded-2xl glass-panel text-cyan-300 border border-cyan-400/40 hover:border-cyan-300 hover:bg-cyan-500/20 hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Interactive Carousel Scrubber Dots */}
      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {sets.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-10 bg-cyan-400 shadow-[0_0_10px_#00f0ff]'
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
