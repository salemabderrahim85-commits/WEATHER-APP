import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Gauge,
  CloudRain,
  Sunrise,
  Sunset,
  Navigation2,
  Compass,
} from 'lucide-react';
import { WeatherData, UnitSystem } from '../types';
import {
  formatWindSpeed,
  getWindDirectionLabel,
  getUvIndexDescription,
  getHumidityDescription,
  formatTimeString,
} from '../utils/weatherUtils';

interface WeatherMetricsGridProps {
  weather: WeatherData;
  unit: UnitSystem;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ weather, unit }) => {
  const current = weather.current;
  const today = weather.daily[0];

  const uvInfo = getUvIndexDescription(today ? today.uvIndexMax : 0);
  const humidityDesc = getHumidityDescription(current.humidity);
  const windDirLabel = getWindDirectionLabel(current.windDirection);

  return (
    <div id="weather-metrics-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Humidité */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs sm:text-sm font-medium">Humidité</span>
          <Droplets className="w-4 h-4 text-sky-400" />
        </div>
        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {current.humidity}%
          </div>
          <p className="text-xs text-slate-400 mt-1">{humidityDesc}</p>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-sky-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, current.humidity))}%` }}
          />
        </div>
      </div>

      {/* 2. Vent */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs sm:text-sm font-medium">Vent</span>
          <Wind className="w-4 h-4 text-teal-400" />
        </div>
        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {formatWindSpeed(current.windSpeed, unit)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
            <Navigation2
              className="w-3.5 h-3.5 text-teal-400 shrink-0"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            />
            <span>Direction : {windDirLabel} ({Math.round(current.windDirection)}°)</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          {current.windSpeed < 15 ? 'Vent faible' : current.windSpeed < 30 ? 'Brise modérée' : 'Vent soutenu'}
        </div>
      </div>

      {/* 3. Indice UV */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs sm:text-sm font-medium">Indice UV</span>
          <Sun className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {today ? Math.round(today.uvIndexMax * 10) / 10 : 0}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${uvInfo.badgeBg} ${uvInfo.color}`}>
              {uvInfo.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Maximum prévu aujourd'hui</p>
        </div>
        {/* UV Meter bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, ((today ? today.uvIndexMax : 0) / 12) * 100)}%` }}
          />
        </div>
      </div>

      {/* 4. Pression atmosphérique */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs sm:text-sm font-medium">Pression</span>
          <Gauge className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {Math.round(current.surfacePressure)} <span className="text-sm font-normal text-slate-300">hPa</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {current.surfacePressure >= 1013 ? 'Haute pression (stable)' : 'Basse pression (perturbé)'}
          </p>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Normale : ~1013 hPa</span>
        </div>
      </div>

      {/* 5. Précipitations */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs sm:text-sm font-medium">Précipitations</span>
          <CloudRain className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {current.precipitation} <span className="text-sm font-normal text-slate-300">mm</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total du jour : {today ? Math.round(today.precipitationSum * 10) / 10 : 0} mm
          </p>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          {current.precipitation === 0 ? 'Aucune pluie en ce moment' : 'Pluie active'}
        </div>
      </div>

      {/* 6. Soleil (Lever & Coucher) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between col-span-2 md:col-span-1 lg:col-span-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs sm:text-sm font-medium">Éphéméride</span>
          <Sunrise className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Lever :
            </span>
            <span className="text-sm font-semibold text-white">
              {today && today.sunrise ? formatTimeString(today.sunrise) : '--:--'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <Sunset className="w-3.5 h-3.5 text-rose-400" /> Coucher :
            </span>
            <span className="text-sm font-semibold text-white">
              {today && today.sunset ? formatTimeString(today.sunset) : '--:--'}
            </span>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Fuseau : {weather.timezone.replace('_', ' ')}
        </div>
      </div>
    </div>
  );
};
