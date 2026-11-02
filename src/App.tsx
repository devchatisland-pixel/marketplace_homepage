/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  PHOTO_SETS, 
  STUDIOS, 
  INDEPENDENT_CREATORS 
} from './data/catalogData';
import { 
  PhotoSet, 
  Studio, 
  Category, 
  LicenseTier, 
  CartItem 
} from './types/catalog';
import { AmbientDecor } from './components/AmbientDecor';
import { TopNav } from './components/TopNav';
import { InteractiveStageCarousel } from './components/InteractiveStageCarousel';
import { FilterBar } from './components/FilterBar';
import { CarouselRow } from './components/CarouselRow';
import { MediaTheaterModal } from './components/MediaTheaterModal';
import { StudioProfileModal } from './components/StudioProfileModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { StudiosShowcase } from './components/StudiosShowcase';
import { ArrowUp } from 'lucide-react';

export default function App() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<string>('catalog');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [creatorFilter, setCreatorFilter] = useState<'all' | 'studios' | 'independents'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-asc' | 'price-desc' | 'photos'>('featured');

  // Modal States
  const [selectedSet, setSelectedSet] = useState<PhotoSet | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Active Accent for Ambient Decor
  const [activeAccent, setActiveAccent] = useState<'cyan' | 'magenta' | 'amber' | 'indigo'>('cyan');

  // Cart State (Persisted)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('neonarch_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('neonarch_wishlist');
      return saved ? JSON.parse(saved) : ['set-obsidian-nocturne', 'set-velveteen-midnight-silk'];
    } catch {
      return [];
    }
  });

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('neonarch_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist Wishlist
  useEffect(() => {
    localStorage.setItem('neonarch_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Add to Cart
  const handleAddToCart = (set: PhotoSet, license: LicenseTier = 'personal') => {
    const multiplier = license === 'commercial' ? 2.5 : license === 'exclusive' ? 5.0 : 1.0;
    const finalPrice = Math.round(set.price * multiplier);

    const newItem: CartItem = {
      set,
      license,
      licenseMultiplier: multiplier,
      price: finalPrice,
    };

    setCartItems((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist
  const handleToggleWishlist = (setId: string) => {
    setWishlistIds((prev) =>
      prev.includes(setId) ? prev.filter((id) => id !== setId) : [...prev, setId]
    );
  };

  const isWishlisted = (setId: string) => wishlistIds.includes(setId);

  // Open Studio Profile Modal by ID
  const handleOpenStudio = (studioId: string) => {
    const foundStudio = STUDIOS.find((s) => s.id === studioId);
    if (foundStudio) {
      setSelectedStudio(foundStudio);
      return;
    }
    const foundCreator = INDEPENDENT_CREATORS.find((c) => c.id === studioId);
    if (foundCreator) {
      const creatorAsStudio: Studio = {
        id: foundCreator.id,
        name: foundCreator.name,
        founder: foundCreator.name,
        location: foundCreator.location,
        bio: foundCreator.bio,
        avatarUrl: PHOTO_SETS.find((p) => p.studioId === foundCreator.id)?.coverImage || PHOTO_SETS[0].coverImage,
        bannerUrl: PHOTO_SETS.find((p) => p.studioId === foundCreator.id)?.coverImage || PHOTO_SETS[0].coverImage,
        isStudio: false,
        totalSets: PHOTO_SETS.filter((p) => p.studioId === foundCreator.id).length,
        followers: foundCreator.followers,
        rating: foundCreator.rating,
        aesthetic: 'Independent Fine Art & Monograph Photography',
      };
      setSelectedStudio(creatorAsStudio);
    }
  };

  // Filtered & Sorted Data
  const filteredSets = useMemo(() => {
    return PHOTO_SETS.filter((set) => {
      if (selectedCategory !== 'All' && set.category !== selectedCategory) {
        return false;
      }
      if (creatorFilter === 'studios' && !set.isStudio) return false;
      if (creatorFilter === 'independents' && set.isStudio) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = set.title.toLowerCase().includes(q);
        const matchStudio = set.studioName.toLowerCase().includes(q);
        const matchCreator = set.creatorName.toLowerCase().includes(q);
        const matchCategory = set.category.toLowerCase().includes(q);
        const matchDesc = set.description.toLowerCase().includes(q);
        if (!matchTitle && !matchStudio && !matchCreator && !matchCategory && !matchDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'photos') return b.photoCount - a.photoCount;
      return 0;
    });
  }, [searchQuery, selectedCategory, creatorFilter, sortBy]);

  // Featured Sets for 3D Stage Carousel
  const stageSets = useMemo(() => {
    return PHOTO_SETS.slice(0, 7);
  }, []);

  // Categorized Carousel Rows
  const highHeelsRow = useMemo(
    () => PHOTO_SETS.filter((s) => s.category === 'High Heels & Arches'),
    []
  );
  const boudoirRow = useMemo(
    () => PHOTO_SETS.filter((s) => s.category === 'Silk & Boudoir'),
    []
  );
  const beachWaterRow = useMemo(
    () => PHOTO_SETS.filter((s) => s.category === 'Beach & Water Droplets'),
    []
  );
  const streetwearRow = useMemo(
    () => PHOTO_SETS.filter((s) => s.category === 'Streetwear & Sneakers'),
    []
  );
  const monochromeRow = useMemo(
    () => PHOTO_SETS.filter((s) => s.category === 'Sculptural Monochrome'),
    []
  );
  const adornmentsRow = useMemo(
    () => PHOTO_SETS.filter((s) => s.category === 'Tattooed & Golden Gems'),
    []
  );
  const independentRow = useMemo(
    () => PHOTO_SETS.filter((s) => !s.isStudio),
    []
  );

  // Wishlist PhotoSet Objects
  const wishlistSets = useMemo(() => {
    return PHOTO_SETS.filter((s) => wishlistIds.includes(s.id));
  }, [wishlistIds]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060609] text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Cyberpunk Ambient Decor & Cursor Spotlight */}
      <AmbientDecor accentColor={activeAccent} />

      {/* Strict Top Bar Contract Header */}
      <TopNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'catalog') {
            setSelectedCategory('All');
            setCreatorFilter('all');
          }
          if (tab === 'studios') {
            setCreatorFilter('studios');
          }
          if (tab === 'creators') {
            setCreatorFilter('independents');
          }
        }}
        cartCount={cartItems.length}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 relative z-10 pb-20">
        {activeTab === 'studios' || activeTab === 'creators' ? (
          /* Studios & Creators Directory Tab */
          <StudiosShowcase
            studios={STUDIOS}
            independentCreators={INDEPENDENT_CREATORS}
            onOpenStudio={handleOpenStudio}
            photoSets={PHOTO_SETS}
          />
        ) : (
          /* Main Netflix Catalog Browsing Mode */
          <>
            {/* Interactive 3D Stage Carousel (Always Prominent in Catalog) */}
            {searchQuery === '' && selectedCategory === 'All' && creatorFilter === 'all' && (
              <InteractiveStageCarousel
                sets={stageSets}
                onSelectSet={(set) => setSelectedSet(set)}
                onAddToCart={(set) => handleAddToCart(set)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={isWishlisted}
                onActiveCardChange={(accent) => setActiveAccent(accent)}
              />
            )}

            {/* Filter & Search Toolbar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              creatorFilter={creatorFilter}
              onCreatorFilterChange={setCreatorFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* If actively searching or category filtered: Show responsive unified grid */}
            {searchQuery !== '' || selectedCategory !== 'All' || creatorFilter !== 'all' ? (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white font-display">
                    {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory}
                  </h2>
                  <span className="text-xs font-mono text-cyan-400">
                    {filteredSets.length} Sets Found
                  </span>
                </div>

                {filteredSets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredSets.map((set) => (
                      <div
                        key={set.id}
                        className="group rounded-xl overflow-hidden bg-slate-900/90 border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
                      >
                        <div
                          onClick={() => setSelectedSet(set)}
                          className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer"
                        >
                          <img
                            src={set.coverImage}
                            alt={set.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-cyan-300 border border-white/10">
                            {set.resolution}
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-xs font-mono font-bold text-emerald-400 border border-white/10 tabular-nums">
                            ${set.price}
                          </div>
                        </div>

                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] font-mono text-cyan-400 flex items-center justify-between">
                              <span className="truncate">{set.studioName}</span>
                              <span className="text-amber-400">★ {set.rating}</span>
                            </div>
                            <h3
                              onClick={() => setSelectedSet(set)}
                              className="text-sm font-bold text-white mt-1 line-clamp-1 cursor-pointer hover:text-cyan-300 transition-colors"
                            >
                              {set.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {set.subtitle}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-400 font-mono">
                              {set.photoCount} Photos
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggleWishlist(set.id)}
                                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                  isWishlisted(set.id)
                                    ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                                    : 'border-white/10 text-slate-400 hover:text-white'
                                }`}
                                title="Wishlist"
                              >
                                ♥
                              </button>
                              <button
                                onClick={() => handleAddToCart(set)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                              >
                                Bag
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-3">
                    <p className="text-sm text-slate-400">
                      No photo sets matched your current filter criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setCreatorFilter('all');
                      }}
                      className="px-4 py-2 rounded-lg bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </section>
            ) : (
              /* Netflix Horizontal Carousels Rows with Glowing Controls */
              <div className="space-y-2 pt-2">
                {/* Row 1: Trending Releases Carousel */}
                <CarouselRow
                  title="Trending Master Releases"
                  subtitle="Most unlocked fine-art sets this week"
                  sets={PHOTO_SETS.slice(0, 6)}
                  onSelectSet={setSelectedSet}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  onOpenStudio={handleOpenStudio}
                />

                {/* Row 2: High Heels & Architectural Arches Carousel */}
                <CarouselRow
                  title="Architectural Arches & Stiletto Heels"
                  subtitle="Sculptural chrome footwear and wet stone reflections"
                  sets={highHeelsRow}
                  onSelectSet={setSelectedSet}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  onOpenStudio={handleOpenStudio}
                />

                {/* Row 3: Silk & Boudoir Sessions Carousel */}
                <CarouselRow
                  title="Silk Bedding & Candlelight Boudoir"
                  subtitle="Warm chiaroscuro, mulberry satin, and intimate poses"
                  sets={boudoirRow}
                  onSelectSet={setSelectedSet}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  onOpenStudio={handleOpenStudio}
                />

                {/* Row 4: Independent Creators Spotlight Carousel */}
                <CarouselRow
                  title="Independent Creators Spotlight"
                  subtitle="Directly support solo visual artists and creators"
                  sets={independentRow}
                  onSelectSet={setSelectedSet}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  onOpenStudio={handleOpenStudio}
                />

                {/* Row 5: Beach & Water Droplets Carousel */}
                <CarouselRow
                  title="Lagoon Shallows & Glistening Droplets"
                  subtitle="Sunlit tropical sea water, caustics, and coastal sand"
                  sets={beachWaterRow}
                  onSelectSet={setSelectedSet}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  onOpenStudio={handleOpenStudio}
                />

                {/* Row 6: Streetwear & Cyber Sneakers Carousel */}
                <CarouselRow
                  title="Cyberpunk Streetwear & Sneaker Kicks"
                  subtitle="Wet Tokyo asphalt, unlaced kicks, and neon signs"
                  sets={streetwearRow}
                  onSelectSet={setSelectedSet}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  onOpenStudio={handleOpenStudio}
                />

                {/* Row 7: Adornments & Anklets Carousel */}
                <CarouselRow
                  title="24K Gold Jewelry & Ankle Adornments"
                  subtitle="Solid gold chains, toe rings, and botanical tattoos"
                  sets={adornmentsRow}
                  onSelectSet={setSelectedSet}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted}
                  onOpenStudio={handleOpenStudio}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Clean Aesthetic Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#08080f] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-sm bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                <span className="text-sm font-bold text-white font-display tracking-tight">
                  NEONARCH
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">Haute Footwear & Anatomical Photography</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                High-fidelity marketplace connecting international production ateliers and independent media artists.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
              <button
                onClick={() => setActiveTab('studios')}
                className="hover:text-cyan-300 transition-colors"
              >
                Production Ateliers
              </button>
              <button
                onClick={() => setActiveTab('creators')}
                className="hover:text-cyan-300 transition-colors"
              >
                Independent Sellers
              </button>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 text-cyan-400 hover:text-white transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Top</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600 font-mono">
            <span>© 2026 NeonArch Visuals Inc. All rights reserved.</span>
            <span>Edge CDN Delivery · 4K/8K DCI RAW Standard</span>
          </div>
        </div>
      </footer>

      {/* Media Theater Modal */}
      {selectedSet && (
        <MediaTheaterModal
          set={selectedSet}
          onClose={() => setSelectedSet(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={isWishlisted(selectedSet.id)}
          onOpenStudio={handleOpenStudio}
        />
      )}

      {/* Studio Profile Modal */}
      {selectedStudio && (
        <StudioProfileModal
          studio={selectedStudio}
          sets={PHOTO_SETS}
          onClose={() => setSelectedStudio(null)}
          onSelectSet={(set) => {
            setSelectedStudio(null);
            setSelectedSet(set);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistSets={wishlistSets}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectSet={(set) => setSelectedSet(set)}
      />
    </div>
  );
}
