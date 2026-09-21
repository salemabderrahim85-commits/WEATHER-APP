export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  precipitation: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  hour: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  weatherCode: number;
  minTemp: number;
  maxTemp: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  precipitationSum: number;
}

export interface WeatherData {
  city: string;
  country?: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export type UnitSystem = 'metric' | 'imperial';

export interface WeatherConditionInfo {
  label: string;
  iconName: string;
  category: 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';
  bgGradient: string;
  accentColor: string;
}
