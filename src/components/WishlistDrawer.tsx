import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { PhotoSet } from '../types/catalog';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistSets: PhotoSet[];
  onRemoveWishlist: (setId: string) => void;
  onAddToCart: (set: PhotoSet) => void;
  onSelectSet: (set: PhotoSet) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistSets,
  onRemoveWishlist,
  onAddToCart,
  onSelectSet,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0a14] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <h2 className="text-lg font-bold text-white font-display">
                Saved Sets ({wishlistSets.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            {wishlistSets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white">Your wishlist is empty</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Click the plus icon on any photo set or hover card to bookmark it for later.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistSets.map((set) => (
                  <div
                    key={set.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex gap-3 items-center group"
                  >
                    <div
                      onClick={() => {
                        onSelectSet(set);
                        onClose();
                      }}
                      className="w-16 h-14 rounded-lg overflow-hidden bg-slate-950 shrink-0 cursor-pointer"
                    >
                      <img
                        src={set.coverImage}
                        alt={set.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4
                        onClick={() => {
                          onSelectSet(set);
                          onClose();
                        }}
                        className="text-xs font-bold text-white truncate cursor-pointer hover:text-cyan-300"
                      >
                        {set.title}
                      </h4>
                      <div className="text-[11px] text-cyan-400 font-mono">
                        {set.studioName}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold tabular-nums">
                        ${set.price} USD · {set.photoCount} photos
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onAddToCart(set)}
                        className="p-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRemoveWishlist(set.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
