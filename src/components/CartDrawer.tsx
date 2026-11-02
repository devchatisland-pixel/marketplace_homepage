import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Download, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types/catalog';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [downloadToken, setDownloadToken] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.price, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      setDownloadToken('NEON-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-4K');
    }, 1200);
  };

  const resetOrder = () => {
    onClearCart();
    setOrderComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0a14] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white font-display">
                Media Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            {orderComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  Digital Negative Unlocked!
                </h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Your high-resolution photo licenses and RAW camera negatives have been provisioned on our high-speed edge CDN.
                </p>

                <div className="w-full p-4 rounded-xl bg-slate-900 border border-cyan-400/30 text-left space-y-1 font-mono text-xs">
                  <div className="text-slate-500 text-[10px] uppercase">Access Token:</div>
                  <div className="text-cyan-300 font-bold text-sm tracking-widest">{downloadToken}</div>
                  <div className="text-slate-400 text-[10px] pt-1">
                    Licensed to traxjob3000@gmail.com · Commercial Grade
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Downloading licensed package archive (${downloadToken}.zip)...`);
                  }}
                  className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master Package (.ZIP)</span>
                </button>

                <button
                  onClick={resetOrder}
                  className="text-xs text-slate-400 hover:text-white pt-2 font-mono"
                >
                  Return to Catalog
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white">Your bag is empty</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Explore our studios and independent releases to discover exclusive photographic master sets.
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
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Items</span>
                  <button
                    onClick={onClearCart}
                    className="hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex gap-3 items-center group"
                  >
                    <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-950 shrink-0">
                      <img
                        src={item.set.coverImage}
                        alt={item.set.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.set.title}
                      </h4>
                      <div className="text-[11px] text-cyan-400 font-mono">
                        {item.set.studioName}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">
                        License: <span className="text-slate-200">{item.license}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold font-mono text-emerald-400 tabular-nums">
                        ${item.price}
                      </div>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="mt-1 text-slate-500 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!orderComplete && items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-slate-950/80 space-y-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-white">${subtotal} USD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Edge CDN Provisioning</span>
                  <span className="text-cyan-400 font-semibold">FREE (Instant)</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 text-lg tabular-nums">
                    ${subtotal} USD
                  </span>
                </div>
              </div>

              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-white hover:brightness-110 transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Generating Crypto Token...</span>
                ) : (
                  <>
                    <span>Confirm & Instant Download</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Encrypted Direct Studio Royalty Payout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
