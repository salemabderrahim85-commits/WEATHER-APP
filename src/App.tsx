import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { WeatherData, UnitSystem } from './types';
import { fetchWeatherData, reverseGeocode } from './services/weatherApi';
import { getWeatherCondition } from './utils/weatherUtils';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { FavoritesList, SavedCity } from './components/FavoritesList';

const DEFAULT_CITY: SavedCity = {
  name: 'Paris',
  country: 'France',
  region: 'Île-de-France',
  lat: 48.8566,
  lon: 2.3522,
};

export default function App() {
  const [currentCity, setCurrentCity] = useState<SavedCity>(() => {
    try {
      const saved = localStorage.getItem('weather_app_last_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [unit, setUnit] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem('weather_app_unit');
      return (saved as UnitSystem) || 'metric';
    } catch {
      return 'metric';
    }
  });

  const [favorites, setFavorites] = useState<SavedCity[]>(() => {
    try {
      const saved = localStorage.getItem('weather_app_favorites');
      return saved ? JSON.parse(saved) : [DEFAULT_CITY];
    } catch {
      return [DEFAULT_CITY];
    }
  });

  const [recentSearches, setRecentSearches] = useState<SavedCity[]>(() => {
    try {
      const saved = localStorage.getItem('weather_app_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load weather for city
  const loadWeather = useCallback(async (city: SavedCity, showSkeleton = true) => {
    if (showSkeleton) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const data = await fetchWeatherData(
        city.lat,
        city.lon,
        city.name,
        city.country,
        city.region
      );
      setWeather(data);

      // Save to localStorage
      localStorage.setItem('weather_app_last_city', JSON.stringify(city));

      // Add to recent searches (deduplicated)
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (c) => c.name.toLowerCase() !== city.name.toLowerCase()
        );
        const updated = [city, ...filtered].slice(0, 5);
        localStorage.setItem('weather_app_recents', JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      console.error('Weather load error:', err);
      setErrorMessage(
        err.message || 'Impossible de récupérer la météo. Vérifiez votre connexion.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    loadWeather(currentCity);
  }, []);

  // Change city handler
  const handleSelectCity = (city: SavedCity) => {
    setCurrentCity(city);
    loadWeather(city, true);
  };

  // Toggle metric / imperial unit
  const handleUnitChange = (newUnit: UnitSystem) => {
    setUnit(newUnit);
    localStorage.setItem('weather_app_unit', newUnit);
  };

  // Geolocation handling
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geoInfo = await reverseGeocode(lat, lon);
          const userCity: SavedCity = {
            name: geoInfo.name,
            country: geoInfo.country,
            region: geoInfo.region,
            lat,
            lon,
          };
          setCurrentCity(userCity);
          await loadWeather(userCity, true);
        } catch (err) {
          console.error(err);
          setErrorMessage('Erreur lors de la localisation.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage(
            'Accès à la position refusé. Veuillez autoriser la localisation ou chercher manuellement.'
          );
        } else {
          setErrorMessage('Position indisponible pour le moment.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Toggle favorite
  const isCurrentFavorite = favorites.some(
    (c) => c.name.toLowerCase() === currentCity.name.toLowerCase()
  );

  const handleToggleFavorite = () => {
    setFavorites((prev) => {
      let updated: SavedCity[];
      if (isCurrentFavorite) {
        updated = prev.filter(
          (c) => c.name.toLowerCase() !== currentCity.name.toLowerCase()
        );
      } else {
        updated = [...prev, currentCity];
      }
      localStorage.setItem('weather_app_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFavorite = (name: string) => {
    setFavorites((prev) => {
      const updated = prev.filter(
        (c) => c.name.toLowerCase() !== name.toLowerCase()
      );
      localStorage.setItem('weather_app_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('weather_app_recents');
  };

  // Calculate background atmosphere based on weather code and day/night
  const condition = weather
    ? getWeatherCondition(weather.current.weatherCode, weather.current.isDay)
    : null;

  return (
    <div
      id="weather-app-container"
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white"
    >
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            condition ? condition.bgGradient : 'from-slate-900 via-slate-950 to-slate-950'
          } opacity-40 transition-colors duration-1000`}
        />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Header */}
        <header className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Weather App
                </span>
                <span className="text-lg">🌤️</span>
              </div>
              <p className="text-xs text-slate-400">Météo en direct & prévisions précises</p>
            </div>
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/60 p-1 rounded-xl shadow-inner">
            <button
              type="button"
              id="unit-metric-btn"
              onClick={() => handleUnitChange('metric')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                unit === 'metric'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              id="unit-imperial-btn"
              onClick={() => handleUnitChange('imperial')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                unit === 'imperial'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>
        </header>

        {/* Search & Location Bar */}
        <SearchBar
          onSelectCity={handleSelectCity}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
        />

        {/* Saved Favorites & Recents Chips */}
        <FavoritesList
          favorites={favorites}
          recentSearches={recentSearches}
          currentCityName={currentCity.name}
          onSelectCity={handleSelectCity}
          onRemoveFavorite={handleRemoveFavorite}
          onClearRecent={handleClearRecent}
        />

        {/* Error Notification */}
        {errorMessage && (
          <div
            id="error-banner"
            className="flex items-center justify-between p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-sm shadow-lg animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => loadWeather(currentCity, true)}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800/80 border border-rose-700/50 rounded-lg text-xs font-semibold text-rose-100 transition-colors cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weather && (
          <div className="space-y-4 animate-pulse">
            <div className="h-64 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sky-400 text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Chargement des conditions météo en direct...</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-slate-900/50 border border-slate-800" />
              ))}
            </div>
          </div>
        )}

        {/* Main Content when loaded */}
        {weather && (
          <main className="space-y-6">
            {/* Current Weather Hero */}
            <CurrentWeatherCard
              weather={weather}
              unit={unit}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
              onRefresh={() => loadWeather(currentCity, false)}
              isRefreshing={isRefreshing}
            />

            {/* Detailed Metrics Grid */}
            <WeatherMetricsGrid weather={weather} unit={unit} />

            {/* Hourly Forecast (24h) */}
            <HourlyForecast hourly={weather.hourly} unit={unit} />

            {/* 7-Day Forecast */}
            <DailyForecast daily={weather.daily} unit={unit} />
          </main>
        )}

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center text-xs text-slate-500 border-t border-slate-900">
          <p>
            Données météorologiques et géocodage fournies en temps réel par{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-sky-400 underline decoration-slate-700 underline-offset-2 transition-colors"
            >
              Open-Meteo
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
