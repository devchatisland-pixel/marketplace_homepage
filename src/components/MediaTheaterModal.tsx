import React, { useState, useEffect } from 'react';
import { 
  X, ZoomIn, ZoomOut, ShoppingBag, Heart, Check, Star, 
  Camera, ShieldCheck, Download, Share2, Sparkles, Award 
} from 'lucide-react';
import { PhotoSet, LicenseTier } from '../types/catalog';

interface MediaTheaterModalProps {
  set: PhotoSet;
  onClose: () => void;
  onAddToCart: (set: PhotoSet, license: LicenseTier) => void;
  onToggleWishlist: (setId: string) => void;
  isWishlisted: boolean;
  onOpenStudio?: (studioId: string) => void;
}

export const MediaTheaterModal: React.FC<MediaTheaterModalProps> = ({
  set,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenStudio,
}) => {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 3>(1);
  const [selectedLicense, setSelectedLicense] = useState<LicenseTier>('personal');
  const [tippedAmount, setTippedAmount] = useState<number | null>(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewsList, setReviewsList] = useState(set.reviews);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentImage = set.galleryImages[activeAngleIndex] || set.coverImage;

  const getMultiplier = () => {
    if (selectedLicense === 'commercial') return 2.5;
    if (selectedLicense === 'exclusive') return 5.0;
    return 1.0;
  };

  const calculatedPrice = Math.round(set.price * getMultiplier());

  const handleTip = (amount: number) => {
    setTippedAmount(amount);
    setTimeout(() => setTippedAmount(null), 3000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newRev = {
      id: 'rev_' + Date.now(),
      author: 'Verified Collector',
      rating: 5,
      date: 'Just now',
      comment: newReviewText.trim(),
      verified: true,
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-2xl bg-[#0c0c16] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] z-10 flex flex-col lg:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 transition-colors border border-white/10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Media Inspection & Zoom Canvas */}
        <div className="flex-1 bg-black/60 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 p-4 sm:p-6">
          <div className="flex items-center justify-between pb-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Camera className="w-4 h-4" />
              <span>Angle {activeAngleIndex + 1} of {set.galleryImages.length}</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Zoom:</span>
              <button
                onClick={() => setZoomLevel(1)}
                className={`px-2 py-1 rounded ${zoomLevel === 1 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                1x
              </button>
              <button
                onClick={() => setZoomLevel(2)}
                className={`px-2 py-1 rounded ${zoomLevel === 2 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                2x
              </button>
              <button
                onClick={() => setZoomLevel(3)}
                className={`px-2 py-1 rounded ${zoomLevel === 3 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                3x Detail
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[340px] sm:min-h-[460px] max-h-[560px] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center border border-white/10 select-none">
            <img
              src={currentImage}
              alt={set.title}
              referrerPolicy="no-referrer"
              className={`max-h-full max-w-full object-contain transition-transform duration-300 ease-out cursor-grab ${
                zoomLevel === 1 ? 'scale-100' : zoomLevel === 2 ? 'scale-150' : 'scale-200'
              }`}
            />
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-white/15">
              {set.resolution} · Uncompressed Master
            </div>
          </div>

          {/* Filmstrip Multi-Angle Thumbnails */}
          <div className="pt-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {set.galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveAngleIndex(idx)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activeAngleIndex
                    ? 'border-cyan-400 shadow-[0_0_12px_#00f0ff]'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Angle ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Camera EXIF Technical Data Strip */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 text-xs font-mono">
            <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
              Production & Sensor Telemetry
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300 text-[11px]">
              <div><span className="text-slate-500">Body:</span> {set.exif.camera}</div>
              <div><span className="text-slate-500">Optics:</span> {set.exif.lens}</div>
              <div><span className="text-slate-500">Aperture:</span> {set.exif.aperture}</div>
              <div><span className="text-slate-500">Shutter:</span> {set.exif.shutter}</div>
              <div><span className="text-slate-500">ISO:</span> {set.exif.iso}</div>
              <div className="col-span-2 sm:col-span-3 text-slate-400">
                <span className="text-slate-500">Light:</span> {set.exif.lighting}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Licensing, Studio Bio, Reviews, Cart Action */}
        <div className="w-full lg:w-[420px] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (onOpenStudio) onOpenStudio(set.studioId);
                }}
                className="flex items-center gap-2 text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs font-bold font-mono text-cyan-300">
                  {set.studioName[0]}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                    {set.studioName}
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">by {set.creatorName}</div>
                </div>
              </button>

              <button
                onClick={() => onToggleWishlist(set.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  isWishlisted
                    ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                    : 'glass-panel border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-pink-500' : ''}`} />
              </button>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight leading-snug">
                {set.title}
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {set.description}
              </p>
            </div>

            {/* License Tier Selector */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Select Digital License Tier
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLicense('personal')}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    selectedLicense === 'personal'
                      ? 'border-cyan-400 bg-cyan-500/10 text-white'
                      : 'border-white/10 glass-panel text-slate-400 hover:border-white/25'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">Personal / Collector</div>
                    <div className="text-[11px] text-slate-400">High-res 4K files for personal display</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    ${set.price}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLicense('commercial')}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    selectedLicense === 'commercial'
                      ? 'border-cyan-400 bg-cyan-500/10 text-white'
                      : 'border-white/10 glass-panel text-slate-400 hover:border-white/25'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">Commercial Digital</div>
                    <div className="text-[11px] text-slate-400">Digital ads, footwear references & media</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    ${Math.round(set.price * 2.5)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLicense('exclusive')}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    selectedLicense === 'exclusive'
                      ? 'border-cyan-400 bg-cyan-500/10 text-white'
                      : 'border-white/10 glass-panel text-slate-400 hover:border-white/25'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">Exclusive 8K Master RAW</div>
                    <div className="text-[11px] text-slate-400">Full RAW camera digital negatives</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    ${Math.round(set.price * 5.0)}
                  </span>
                </button>
              </div>
            </div>

            {/* Creator Tip Jar */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Support {set.creatorName}
                </span>
                {tippedAmount && (
                  <span className="text-xs font-bold text-amber-400 animate-bounce">
                    +${tippedAmount} Tipped! Thank you!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {[5, 15, 30].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleTip(amt)}
                    className="flex-1 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    +${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Collector Reviews */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">
                  Collector Reviews ({reviewsList.length})
                </span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {set.rating} / 5.0
                </span>
              </div>

              <div className="max-h-36 overflow-y-auto no-scrollbar space-y-2 pr-1">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-200">{rev.author}</span>
                      <span className="text-slate-500 font-mono">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{rev.comment}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddReview} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Leave collector feedback..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                >
                  Post
                </button>
              </form>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Total Purchase:</span>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">
                ${calculatedPrice} USD
              </span>
            </div>

            <button
              onClick={() => {
                onAddToCart(set, selectedLicense);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-white hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Purchase & Unlock Digital Negative</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
