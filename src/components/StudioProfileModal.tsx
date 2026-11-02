import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Star, UserPlus, Check } from 'lucide-react';
import { Studio, PhotoSet } from '../types/catalog';

interface StudioProfileModalProps {
  studio: Studio;
  sets: PhotoSet[];
  onClose: () => void;
  onSelectSet: (set: PhotoSet) => void;
}

export const StudioProfileModal: React.FC<StudioProfileModalProps> = ({
  studio,
  sets,
  onClose,
  onSelectSet,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const studioSets = sets.filter((s) => s.studioId === studio.id);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl bg-[#0c0c16] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white transition-colors border border-white/10"
          aria-label="Close studio profile"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Studio Banner */}
        <div className="relative h-48 sm:h-60 overflow-hidden bg-slate-950">
          <img
            src={studio.bannerUrl}
            alt={studio.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c16] via-transparent to-black/40" />
        </div>

        {/* Studio Header Profile Bar */}
        <div className="relative px-6 pb-6 pt-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] bg-slate-900 shrink-0">
                <img
                  src={studio.avatarUrl}
                  alt={studio.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white font-display">
                    {studio.name}
                  </h2>
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {studio.location}
                  </span>
                  <span>·</span>
                  <span>by {studio.founder}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFollow}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isFollowing
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                }`}
              >
                {isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{isFollowing ? 'Following Studio' : 'Follow Studio'}</span>
              </button>
            </div>
          </div>

          {/* Bio & Aesthetic Scope */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <p className="text-sm text-slate-300 leading-relaxed">{studio.bio}</p>
            <div className="text-xs font-mono text-cyan-400 pt-1">
              <span className="text-slate-500">Core Aesthetic: </span>
              {studio.aesthetic}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 text-center border-y border-white/10 py-3">
            <div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {studio.totalSets}
              </div>
              <div className="text-xs text-slate-400">Published Sets</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {(studio.followers + (isFollowing ? 1 : 0)).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">Collectors Following</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-400 font-mono tabular-nums flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                {studio.rating}
              </div>
              <div className="text-xs text-slate-400">Curator Rating</div>
            </div>
          </div>

          {/* Studio Portfolio Grid */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white font-display">
              Studio Catalogue ({studioSets.length})
            </h3>

            {studioSets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {studioSets.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectSet(s)}
                    className="group cursor-pointer rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400/50 overflow-hidden transition-all duration-200"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                      <img
                        src={s.coverImage}
                        alt={s.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-cyan-300">
                        {s.resolution}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-xs font-mono font-bold text-emerald-400 tabular-nums">
                        ${s.price}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300">
                        {s.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                        <span>{s.photoCount} photos</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          ★ {s.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-mono py-4">No published catalog sets found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
