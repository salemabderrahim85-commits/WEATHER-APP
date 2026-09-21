import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { HourlyForecastItem, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '../utils/weatherUtils';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div
      id="hourly-forecast-section"
      className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4 text-slate-300">
        <Clock className="w-4 h-4 text-sky-400" />
        <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
          Prévisions heure par heure (24h)
        </h2>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {hourly.map((item, index) => (
          <div
            key={`${item.time}-${index}`}
            className="flex flex-col items-center justify-between min-w-[76px] p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/30 transition-all shrink-0"
          >
            <span className="text-xs font-medium text-slate-400">
              {index === 0 ? 'Maint.' : item.hour}
            </span>

            <div className="my-2.5 p-1">
              <WeatherIcon
                code={item.weatherCode}
                isDay={item.isDay}
                className="w-8 h-8"
              />
            </div>

            <span className="text-sm font-bold text-white">
              {formatTemperature(item.temperature, unit)}
            </span>

            {item.precipitationProbability > 0 ? (
              <div className="flex items-center gap-0.5 mt-1.5 text-[11px] font-medium text-cyan-400">
                <Droplets className="w-2.5 h-2.5" />
                <span>{item.precipitationProbability}%</span>
              </div>
            ) : (
              <div className="h-4 mt-1.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
