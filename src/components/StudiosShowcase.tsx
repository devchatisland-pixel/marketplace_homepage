import React from 'react';
import { ShieldCheck, MapPin, Star, ArrowRight } from 'lucide-react';
import { Studio, PhotoSet } from '../types/catalog';

interface StudiosShowcaseProps {
  studios: Studio[];
  independentCreators: Array<{
    id: string;
    name: string;
    location: string;
    bio: string;
    followers: number;
    rating: number;
  }>;
  onOpenStudio: (studioId: string) => void;
  photoSets: PhotoSet[];
}

export const StudiosShowcase: React.FC<StudiosShowcaseProps> = ({
  studios,
  independentCreators,
  onOpenStudio,
  photoSets,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Premier Studios Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
            Premier Production Studios
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Verified international creative ateliers specializing in fine-art foot ergonomics and luxury footwear photography.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studios.map((studio) => {
            const studioReleases = photoSets.filter((s) => s.studioId === studio.id);
            return (
              <div
                key={studio.id}
                className="group rounded-2xl glass-panel hover:border-cyan-400/40 overflow-hidden transition-all duration-300 flex flex-col justify-between"
              >
                {/* Banner & Avatar */}
                <div className="relative h-40 overflow-hidden bg-slate-950">
                  <img
                    src={studio.bannerUrl}
                    alt={studio.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c16] via-transparent to-black/30" />

                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-md bg-slate-900 shrink-0">
                      <img
                        src={studio.avatarUrl}
                        alt={studio.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-display flex items-center gap-1.5">
                        {studio.name}
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{studio.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Studio Bio & Aesthetic */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {studio.bio}
                    </p>
                    <div className="text-[11px] font-mono text-cyan-400">
                      <span className="text-slate-500">Specialty: </span>
                      {studio.aesthetic}
                    </div>
                  </div>

                  {/* Stats and Action */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span>{studioReleases.length} Catalog Sets</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {studio.rating}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenStudio(studio.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-1 duration-200"
                    >
                      <span>View Atelier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Independent Sellers Section */}
      <section className="space-y-6 pt-6 border-t border-white/10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
            Independent Creators & Photographers
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Solo visual artists, models, and photographers publishing limited edition master archives directly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {independentCreators.map((creator) => (
            <div
              key={creator.id}
              className="p-5 rounded-xl glass-panel hover:border-cyan-400/30 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-sm">
                    {creator.name[0]}
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {creator.rating}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-3 font-display">
                  {creator.name}
                </h3>
                <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {creator.location}
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {creator.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">
                  {creator.followers.toLocaleString()} Collectors
                </span>
                <button
                  onClick={() => onOpenStudio(creator.id)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold"
                >
                  Portfolio
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
