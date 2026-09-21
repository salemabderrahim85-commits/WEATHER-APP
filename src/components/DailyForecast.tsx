import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { DailyForecastItem, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature, getWeatherCondition } from '../utils/weatherUtils';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unit: UnitSystem;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit }) => {
  if (!daily || daily.length === 0) return null;

  // Calculate the global min and max temperature across all days for proportional range bars
  const allMin = Math.min(...daily.map((d) => d.minTemp));
  const allMax = Math.max(...daily.map((d) => d.maxTemp));
  const tempRange = Math.max(1, allMax - allMin);

  return (
    <div
      id="daily-forecast-section"
      className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4 text-slate-300">
        <Calendar className="w-4 h-4 text-sky-400" />
        <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
          Prévisions sur 7 jours
        </h2>
      </div>

      <div className="space-y-2.5">
        {daily.map((item, index) => {
          const condition = getWeatherCondition(item.weatherCode, true);
          // Calculate percentage offsets for min/max bar
          const leftPercent = Math.max(0, ((item.minTemp - allMin) / tempRange) * 100);
          const widthPercent = Math.max(12, ((item.maxTemp - item.minTemp) / tempRange) * 100);

          return (
            <div
              key={item.date}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/30 transition-all text-sm"
            >
              {/* Day Name */}
              <div className="w-28 sm:w-36 shrink-0">
                <span className={`font-semibold ${index === 0 ? 'text-sky-400' : 'text-slate-200'}`}>
                  {item.dayName}
                </span>
                <p className="text-xs text-slate-400 capitalize hidden sm:block truncate">
                  {condition.label}
                </p>
              </div>

              {/* Weather Icon & Rain */}
              <div className="flex items-center gap-2.5 w-24 shrink-0">
                <WeatherIcon code={item.weatherCode} isDay={true} className="w-6 h-6 shrink-0" />
                {item.precipitationSum > 0 ? (
                  <span className="flex items-center text-xs text-cyan-400 font-medium">
                    <Droplets className="w-3 h-3 mr-0.5" />
                    {item.precipitationSum}mm
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Sec</span>
                )}
              </div>

              {/* Temperature Bar & Min/Max */}
              <div className="flex items-center gap-3 flex-1 max-w-xs justify-end">
                <span className="text-xs sm:text-sm font-medium text-slate-400 w-10 text-right">
                  {formatTemperature(item.minTemp, unit)}
                </span>

                <div className="flex-1 bg-slate-800 rounded-full h-2 relative overflow-hidden hidden xs:block">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                    }}
                  />
                </div>

                <span className="text-xs sm:text-sm font-bold text-white w-10 text-right">
                  {formatTemperature(item.maxTemp, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
