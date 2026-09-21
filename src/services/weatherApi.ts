import { GeoLocation, WeatherData, HourlyForecastItem, DailyForecastItem } from '../types';
import { formatDayName } from '../utils/weatherUtils';

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=8&language=fr&format=json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche des villes');
    }

    const data = await response.json();
    if (!data.results) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

export async function fetchWeatherData(
  lat: number,
  lon: number,
  cityName: string,
  country?: string,
  region?: string
): Promise<WeatherData> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
    'surface_pressure',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'weather_code',
    'precipitation_probability',
    'is_day',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
  ].join(',');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Impossible de récupérer les prévisions météo.');
  }

  const data = await response.json();
  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  // Process next 24 hours of hourly data starting from current time
  const nowIso = current.time;
  const nowTime = new Date(nowIso).getTime();
  const hourlyList: HourlyForecastItem[] = [];

  if (hourly && hourly.time) {
    for (let i = 0; i < hourly.time.length; i++) {
      const itemTime = new Date(hourly.time[i]).getTime();
      // take items from now or slightly earlier up to 24 hours ahead
      if (itemTime >= nowTime - 3600000 && hourlyList.length < 24) {
        const dateObj = new Date(hourly.time[i]);
        const hourLabel = dateObj.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        });

        hourlyList.push({
          time: hourly.time[i],
          hour: hourLabel,
          temperature: hourly.temperature_2m[i],
          weatherCode: hourly.weather_code[i],
          precipitationProbability: hourly.precipitation_probability ? hourly.precipitation_probability[i] || 0 : 0,
          isDay: hourly.is_day ? Boolean(hourly.is_day[i]) : true,
        });
      }
    }
  }

  // Process 7 days of daily forecast
  const dailyList: DailyForecastItem[] = [];
  if (daily && daily.time) {
    for (let i = 0; i < daily.time.length; i++) {
      dailyList.push({
        date: daily.time[i],
        dayName: formatDayName(daily.time[i]),
        weatherCode: daily.weather_code[i],
        minTemp: daily.temperature_2m_min[i],
        maxTemp: daily.temperature_2m_max[i],
        uvIndexMax: daily.uv_index_max ? daily.uv_index_max[i] || 0 : 0,
        sunrise: daily.sunrise ? daily.sunrise[i] : '',
        sunset: daily.sunset ? daily.sunset[i] : '',
        precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[i] || 0 : 0,
      });
    }
  }

  return {
    city: cityName,
    country,
    region,
    latitude: lat,
    longitude: lon,
    timezone: data.timezone || 'auto',
    current: {
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      weatherCode: current.weather_code,
      isDay: Boolean(current.is_day),
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      surfacePressure: current.surface_pressure,
      precipitation: current.precipitation,
      time: current.time,
    },
    hourly: hourlyList,
    daily: dailyList,
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ name: string; country?: string; region?: string }> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Position actuelle';
      return {
        name: city,
        country: data.countryName,
        region: data.principalSubdivision,
      };
    }
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
  }

  return {
    name: 'Position actuelle',
  };
}
