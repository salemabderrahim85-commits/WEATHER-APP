import React from 'react';
import { Star, History, Trash2, MapPin } from 'lucide-react';

export interface SavedCity {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  region?: string;
}

interface FavoritesListProps {
  favorites: SavedCity[];
  recentSearches: SavedCity[];
  currentCityName: string;
  onSelectCity: (city: SavedCity) => void;
  onRemoveFavorite: (name: string) => void;
  onClearRecent: () => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  recentSearches,
  currentCityName,
  onSelectCity,
  onRemoveFavorite,
  onClearRecent,
}) => {
  if (favorites.length === 0 && recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3" id="saved-cities-section">
      {/* Favoris */}
      {favorites.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-md">
          <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Mes Villes Favorites</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {favorites.map((city) => {
              const isActive = city.name.toLowerCase() === currentCityName.toLowerCase();
              return (
                <div
                  key={`fav-${city.name}-${city.lat}`}
                  className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-xl border text-xs sm:text-sm transition-all ${
                    isActive
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectCity(city)}
                    className="font-medium cursor-pointer"
                  >
                    {city.name}
                    {city.country && <span className="opacity-60 ml-1 text-xs">({city.country})</span>}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(city.name);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Récents */}
      {recentSearches.length > 0 && (
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Recherches Récentes</span>
            </div>
            <button
              type="button"
              onClick={onClearRecent}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Effacer
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((city) => (
              <button
                key={`recent-${city.name}-${city.lat}`}
                type="button"
                onClick={() => onSelectCity(city)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-sky-400" />
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
