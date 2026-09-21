import React from 'react';
import { MapPin, RefreshCw, Star, ArrowDown, ArrowUp, Thermometer } from 'lucide-react';
import { WeatherData, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcon';
import {
  getWeatherCondition,
  formatTemperature,
  formatTimeString,
} from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: UnitSystem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  unit,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  isRefreshing,
}) => {
  const current = weather.current;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);
  const todayForecast = weather.daily[0];

  const currentDateFormatted = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div
      id="current-weather-card"
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/60 shadow-2xl backdrop-blur-xl"
    >
      {/* Ambient background light glow */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
          current.isDay ? 'bg-amber-400' : 'bg-indigo-500'
        }`}
      />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none bg-sky-500" />

      {/* Header bar: Location + Action buttons */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {weather.city}
            </h1>
            {weather.country && (
              <span className="text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
                {weather.country}
              </span>
            )}
          </div>
          {weather.region && (
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 ml-7">
              {weather.region}
            </p>
          )}
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 capitalize ml-7">
            {currentDateFormatted} • Mis à jour à {formatTimeString(current.time)}
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="toggle-favorite-btn"
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30'
                : 'bg-slate-800/70 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/80'
            }`}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            type="button"
            id="refresh-weather-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all cursor-pointer disabled:opacity-50"
            title="Rafraîchir les données météo"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main hero display */}
      <div className="relative z-10 mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative p-3 rounded-2xl bg-slate-800/50 border border-slate-700/40 shadow-inner">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md"
            />
          </div>

          <div>
            <div className="flex items-baseline">
              <span className="text-6xl sm:text-7xl font-extrabold text-white tracking-tighter">
                {formatTemperature(current.temperature, unit).replace(/[^\d-]/g, '')}
              </span>
              <span className="text-3xl sm:text-4xl font-semibold text-slate-300 ml-1">
                {unit === 'metric' ? '°C' : '°F'}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-200 text-sm font-medium">
              <span>{condition.label}</span>
            </div>
          </div>
        </div>

        {/* Secondary snapshot pills: Feels like, Min/Max */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Thermometer className="w-4 h-4 text-rose-400" />
            <span>Ressenti :</span>
            <span className="font-semibold text-white">
              {formatTemperature(current.apparentTemperature, unit)}
            </span>
          </div>

          {todayForecast && (
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 text-sky-400 font-medium">
                <ArrowDown className="w-3.5 h-3.5" />
                {formatTemperature(todayForecast.minTemp, unit)}
              </span>
              <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                <ArrowUp className="w-3.5 h-3.5" />
                {formatTemperature(todayForecast.maxTemp, unit)}
              </span>
            </div>
          )}

          {current.precipitation > 0 && (
            <div className="text-xs text-cyan-300 font-medium bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-full">
              Précipitations : {current.precipitation} mm
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
