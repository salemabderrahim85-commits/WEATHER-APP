import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react';
import { GeoLocation } from '../types';
import { searchCities } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: { name: string; lat: number; lon: number; country?: string; region?: string }) => void;
  onUseCurrentLocation: () => void;
  isLocating?: boolean;
}

const POPULAR_CITIES = [
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Marseille', country: 'France', lat: 43.2965, lon: 5.3698 },
  { name: 'Lyon', country: 'France', lat: 45.764, lon: 4.8357 },
  { name: 'Casablanca', country: 'Maroc', lat: 33.5731, lon: -7.5898 },
  { name: 'Alger', country: 'Algérie', lat: 36.7538, lon: 3.0588 },
  { name: 'Tunis', country: 'Tunisie', lat: 36.8065, lon: 10.1815 },
  { name: 'Montréal', country: 'Canada', lat: 45.5017, lon: -73.5673 },
  { name: 'Tokyo', country: 'Japon', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', country: 'États-Unis', lat: 40.7128, lon: -74.006 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLocating = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const cities = await searchCities(query);
      setResults(cities);
      setIsLoading(false);
      setIsOpen(true);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: GeoLocation) => {
    onSelectCity({
      name: item.name,
      lat: item.latitude,
      lon: item.longitude,
      country: item.country,
      region: item.admin1,
    });
    setQuery('');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0]);
    }
  };

  return (
    <div ref={containerRef} className="w-full relative z-30" id="search-section">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Rechercher une ville (ex. Paris, Casablanca, Montréal...)"
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/60 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-sm sm:text-base shadow-lg"
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
            {isLoading && <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />}
            {query && !isLoading && (
              <button
                type="button"
                id="clear-search-btn"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          id="geolocation-btn"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/60 hover:border-sky-500/50 hover:bg-slate-800/80 text-white text-sm font-medium transition-all shadow-lg shrink-0 disabled:opacity-60 cursor-pointer"
          title="Utiliser ma position actuelle"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          ) : (
            <Navigation className="w-4 h-4 text-sky-400" />
          )}
          <span className="hidden sm:inline">Ma position</span>
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id="search-results-dropdown"
          className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800/70 max-h-72 overflow-y-auto z-50 animate-in fade-in duration-150"
        >
          {results.map((item) => (
            <button
              key={`${item.id}-${item.latitude}-${item.longitude}`}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full px-4 py-3 text-left hover:bg-slate-800/70 flex items-center justify-between transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-medium text-white text-sm sm:text-base">{item.name}</span>
                  {(item.admin1 || item.country) && (
                    <span className="ml-2 text-xs sm:text-sm text-slate-400">
                      {[item.admin1, item.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </div>
              {item.country_code && (
                <span className="text-xs uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                  {item.country_code}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Popular cities pill bar */}
      <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 shrink-0 font-medium mr-1 hidden xs:inline">Villes rapides :</span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() => onSelectCity(city)}
            className="px-2.5 py-1 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
