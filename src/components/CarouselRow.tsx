import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { PhotoSet } from '../types/catalog';
import { ExpandableCard } from './ExpandableCard';

interface CarouselRowProps {
  title: string;
  subtitle?: string;
  sets: PhotoSet[];
  onSelectSet: (set: PhotoSet) => void;
  onAddToCart: (set: PhotoSet) => void;
  onToggleWishlist: (setId: string) => void;
  isWishlisted: (setId: string) => boolean;
  onOpenStudio?: (studioId: string) => void;
}

export const CarouselRow: React.FC<CarouselRowProps> = ({
  title,
  subtitle,
  sets,
  onSelectSet,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenStudio,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      const progress = scrollWidth > clientWidth ? (scrollLeft / (scrollWidth - clientWidth)) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [sets]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = Math.min(scrollContainerRef.current.clientWidth * 0.8, 650);
      const offset = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!sets || sets.length === 0) return null;

  return (
    <section className="relative py-6 md:py-8 border-b border-white/5">
      {/* Row Header with Title, Count & Progress bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 font-sans">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Progress Track & Counter */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${Math.max(15, scrollProgress)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-cyan-400/90 tabular-nums">
            {sets.length} Releases
          </span>
        </div>
      </div>

      {/* Horizontal Carousel Viewport with Prominent Glowing Controls */}
      <div className="relative group">
        {/* Left Glowing Scroll Chevron */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-xl glass-panel text-cyan-300 border border-cyan-400/30 transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-110 active:scale-95 hover:border-cyan-400 hover:bg-cyan-500/20 ${
            canScrollLeft ? 'opacity-90 hover:opacity-100 cursor-pointer' : 'opacity-20 pointer-events-none'
          }`}
          aria-label="Scroll carousel left"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Carousel Item Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-4 md:gap-5 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-4 scroll-smooth"
        >
          {sets.map((set) => (
            <ExpandableCard
              key={set.id}
              set={set}
              onSelect={onSelectSet}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={isWishlisted(set.id)}
              onOpenStudio={onOpenStudio}
            />
          ))}
        </div>

        {/* Right Glowing Scroll Chevron */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-xl glass-panel text-cyan-300 border border-cyan-400/30 transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-110 active:scale-95 hover:border-cyan-400 hover:bg-cyan-500/20 ${
            canScrollRight ? 'opacity-90 hover:opacity-100 cursor-pointer' : 'opacity-20 pointer-events-none'
          }`}
          aria-label="Scroll carousel right"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </section>
  );
};
