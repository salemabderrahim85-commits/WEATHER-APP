import { WeatherConditionInfo, UnitSystem } from '../types';

export function getWeatherCondition(code: number, isDay = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Ciel dégagé' : 'Nuit claire',
        iconName: isDay ? 'Sun' : 'Moon',
        category: 'clear',
        bgGradient: isDay 
          ? 'from-sky-500 via-blue-500 to-indigo-600' 
          : 'from-slate-900 via-indigo-950 to-slate-900',
        accentColor: isDay ? 'text-amber-400' : 'text-indigo-300',
      };
    case 1:
      return {
        label: isDay ? 'Principalement ensoleillé' : 'Nuit peu nuageuse',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        category: 'clear',
        bgGradient: isDay 
          ? 'from-sky-500 via-blue-600 to-indigo-700' 
          : 'from-slate-900 via-slate-800 to-indigo-950',
        accentColor: isDay ? 'text-amber-300' : 'text-indigo-200',
      };
    case 2:
      return {
        label: 'Partiellement nuageux',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
        bgGradient: isDay 
          ? 'from-sky-600 via-slate-600 to-slate-700' 
          : 'from-slate-950 via-slate-900 to-slate-800',
        accentColor: 'text-sky-300',
      };
    case 3:
      return {
        label: 'Couvert',
        iconName: 'Cloud',
        category: 'cloudy',
        bgGradient: 'from-slate-600 via-slate-700 to-slate-800',
        accentColor: 'text-slate-300',
      };
    case 45:
    case 48:
      return {
        label: code === 45 ? 'Brouillard' : 'Brouillard givrant',
        iconName: 'CloudFog',
        category: 'fog',
        bgGradient: 'from-slate-500 via-zinc-600 to-slate-700',
        accentColor: 'text-zinc-300',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Bruine légère',
        iconName: 'CloudDrizzle',
        category: 'rain',
        bgGradient: 'from-slate-700 via-cyan-800 to-slate-900',
        accentColor: 'text-cyan-300',
      };
    case 56:
    case 57:
      return {
        label: 'Bruine verglaçante',
        iconName: 'CloudSnow',
        category: 'snow',
        bgGradient: 'from-slate-800 via-blue-900 to-slate-950',
        accentColor: 'text-cyan-200',
      };
    case 61:
      return {
        label: 'Pluie faible',
        iconName: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-slate-700 via-blue-800 to-slate-900',
        accentColor: 'text-blue-300',
      };
    case 63:
      return {
        label: 'Pluie modérée',
        iconName: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-blue-900 via-slate-800 to-slate-900',
        accentColor: 'text-blue-400',
      };
    case 65:
      return {
        label: 'Pluie forte',
        iconName: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-slate-900 via-blue-950 to-slate-900',
        accentColor: 'text-blue-400',
      };
    case 66:
    case 67:
      return {
        label: 'Pluie verglaçante',
        iconName: 'CloudSnow',
        category: 'snow',
        bgGradient: 'from-slate-900 via-cyan-950 to-slate-900',
        accentColor: 'text-cyan-300',
      };
    case 71:
      return {
        label: 'Chutes de neige faibles',
        iconName: 'CloudSnow',
        category: 'snow',
        bgGradient: 'from-slate-800 via-sky-900 to-slate-900',
        accentColor: 'text-sky-200',
      };
    case 73:
      return {
        label: 'Chutes de neige modérées',
        iconName: 'CloudSnow',
        category: 'snow',
        bgGradient: 'from-slate-800 via-blue-900 to-indigo-950',
        accentColor: 'text-sky-200',
      };
    case 75:
      return {
        label: 'Fortes chutes de neige',
        iconName: 'Snowflake',
        category: 'snow',
        bgGradient: 'from-slate-900 via-blue-950 to-slate-950',
        accentColor: 'text-sky-100',
      };
    case 77:
      return {
        label: 'Grains de neige',
        iconName: 'Snowflake',
        category: 'snow',
        bgGradient: 'from-slate-800 via-slate-900 to-slate-950',
        accentColor: 'text-sky-200',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: code === 82 ? 'Violentes averses' : 'Averses de pluie',
        iconName: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-slate-800 via-blue-900 to-slate-900',
        accentColor: 'text-blue-300',
      };
    case 85:
    case 86:
      return {
        label: 'Averses de neige',
        iconName: 'CloudSnow',
        category: 'snow',
        bgGradient: 'from-slate-800 via-cyan-900 to-slate-900',
        accentColor: 'text-cyan-200',
      };
    case 95:
      return {
        label: 'Orage',
        iconName: 'CloudLightning',
        category: 'storm',
        bgGradient: 'from-slate-900 via-purple-950 to-slate-950',
        accentColor: 'text-amber-300',
      };
    case 96:
    case 99:
      return {
        label: 'Orage avec grêle',
        iconName: 'CloudLightning',
        category: 'storm',
        bgGradient: 'from-slate-950 via-purple-950 to-gray-950',
        accentColor: 'text-amber-400',
      };
    default:
      return {
        label: 'Météo variable',
        iconName: 'CloudSun',
        category: 'cloudy',
        bgGradient: 'from-slate-700 via-slate-800 to-slate-900',
        accentColor: 'text-slate-300',
      };
  }
}

export function formatTemperature(celsius: number, unit: UnitSystem = 'metric'): string {
  if (unit === 'imperial') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempNumber(celsius: number, unit: UnitSystem = 'metric'): number {
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: UnitSystem = 'metric'): string {
  if (unit === 'imperial') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirectionLabel(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSO', 'SO', 'OSO',
    'O', 'ONO', 'NO', 'NNO'
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'N';
}

export function getUvIndexDescription(uv: number): { label: string; color: string; badgeBg: string } {
  if (uv < 3) {
    return { label: 'Faible', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 border-emerald-500/30' };
  } else if (uv < 6) {
    return { label: 'Modéré', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 border-amber-500/30' };
  } else if (uv < 8) {
    return { label: 'Élevé', color: 'text-orange-400', badgeBg: 'bg-orange-500/10 border-orange-500/30' };
  } else if (uv < 11) {
    return { label: 'Très élevé', color: 'text-rose-400', badgeBg: 'bg-rose-500/10 border-rose-500/30' };
  }
  return { label: 'Extrême', color: 'text-purple-400', badgeBg: 'bg-purple-500/10 border-purple-500/30' };
}

export function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return 'Air très sec';
  if (humidity <= 60) return 'Niveau agréable & sain';
  if (humidity <= 80) return 'Humidité modérée';
  return 'Air très lourd & saturé';
}

export function formatTimeString(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatDayName(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Demain';
    }
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
}
