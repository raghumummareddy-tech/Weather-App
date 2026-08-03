import { GeoLocationResult, UnitSystem, WeatherData } from '../types/weather';

export const POPULAR_CITIES: GeoLocationResult[] = [
  { id: 2643743, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', country_code: 'GB', admin1: 'England' },
  { id: 5128581, name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'United States', country_code: 'US', admin1: 'New York' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', country_code: 'JP', admin1: 'Tokyo' },
  { id: 2988507, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', country_code: 'FR', admin1: 'Île-de-France' },
  { id: 2147714, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', country_code: 'AU', admin1: 'New South Wales' },
  { id: 1275339, name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, country: 'India', country_code: 'IN', admin1: 'Maharashtra' },
  { id: 292223, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', country_code: 'AE', admin1: 'Dubai' },
  { id: 5391959, name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, country: 'United States', country_code: 'US', admin1: 'California' },
];

export async function searchCities(query: string): Promise<GeoLocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search location. Please check your network connection.');
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    elevation: item.elevation,
    feature_code: item.feature_code,
    country_code: item.country_code ?? '',
    country: item.country,
    admin1: item.admin1,
    admin2: item.admin2,
    timezone: item.timezone,
    population: item.population,
  }));
}

export async function fetchWeatherData(
  location: GeoLocationResult,
  unitSystem: UnitSystem = 'metric'
): Promise<WeatherData> {
  const tempUnit = unitSystem === 'imperial' ? 'fahrenheit' : 'celsius';
  const windUnit = unitSystem === 'imperial' ? 'mph' : 'kmh';
  const precipUnit = unitSystem === 'imperial' ? 'inch' : 'mm';

  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    temperature_unit: tempUnit,
    wind_speed_unit: windUnit,
    precipitation_unit: precipUnit,
    timezone: location.timezone || 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data for ${location.name}. HTTP ${response.status}`);
  }

  const raw = await response.json();

  // Parse Current
  const c = raw.current || {};
  const current = {
    time: c.time || new Date().toISOString(),
    temperature: Math.round(c.temperature_2m ?? 0),
    apparentTemperature: Math.round(c.apparent_temperature ?? 0),
    relativeHumidity: Math.round(c.relative_humidity_2m ?? 0),
    isDay: c.is_day === 1,
    precipitation: c.precipitation ?? 0,
    weatherCode: c.weather_code ?? 0,
    cloudCover: Math.round(c.cloud_cover ?? 0),
    pressureMsl: Math.round(c.pressure_msl ?? 1013),
    windSpeed: Math.round(c.wind_speed_10m ?? 0),
    windDirection: c.wind_direction_10m ?? 0,
    windGusts: Math.round(c.wind_gusts_10m ?? 0),
    uvIndex: raw.hourly?.uv_index?.[0] ? Math.round(raw.hourly.uv_index[0]) : 0,
  };

  // Parse Hourly (Next 24 hours)
  const hTime: string[] = raw.hourly?.time || [];
  const hTemp: number[] = raw.hourly?.temperature_2m || [];
  const hApparent: number[] = raw.hourly?.apparent_temperature || [];
  const hCode: number[] = raw.hourly?.weather_code || [];
  const hPrecipProb: number[] = raw.hourly?.precipitation_probability || [];
  const hPrecip: number[] = raw.hourly?.precipitation || [];
  const hWind: number[] = raw.hourly?.wind_speed_10m || [];
  const hHumidity: number[] = raw.hourly?.relative_humidity_2m || [];
  const hUV: number[] = raw.hourly?.uv_index || [];
  const hIsDay: number[] = raw.hourly?.is_day || [];

  // Find index closest to current time
  const nowStr = new Date().toISOString().substring(0, 13);
  let startIndex = hTime.findIndex((t) => t.startsWith(nowStr));
  if (startIndex < 0) startIndex = 0;

  const hourly = hTime.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const i = startIndex + idx;
    return {
      time: timeStr,
      temperature: Math.round(hTemp[i] ?? 0),
      apparentTemperature: Math.round(hApparent[i] ?? 0),
      weatherCode: hCode[i] ?? 0,
      precipitationProbability: Math.round(hPrecipProb[i] ?? 0),
      precipitation: hPrecip[i] ?? 0,
      windSpeed: Math.round(hWind[i] ?? 0),
      relativeHumidity: Math.round(hHumidity[i] ?? 0),
      uvIndex: Math.round(hUV[i] ?? 0),
      isDay: hIsDay[i] === 1,
    };
  });

  // Parse Daily (7 Days)
  const dTime: string[] = raw.daily?.time || [];
  const dCode: number[] = raw.daily?.weather_code || [];
  const dTempMax: number[] = raw.daily?.temperature_2m_max || [];
  const dTempMin: number[] = raw.daily?.temperature_2m_min || [];
  const dApparentMax: number[] = raw.daily?.apparent_temperature_max || [];
  const dApparentMin: number[] = raw.daily?.apparent_temperature_min || [];
  const dSunrise: string[] = raw.daily?.sunrise || [];
  const dSunset: string[] = raw.daily?.sunset || [];
  const dUVMax: number[] = raw.daily?.uv_index_max || [];
  const dPrecipSum: number[] = raw.daily?.precipitation_sum || [];
  const dPrecipProbMax: number[] = raw.daily?.precipitation_probability_max || [];
  const dWindMax: number[] = raw.daily?.wind_speed_10m_max || [];
  const dWindDir: number[] = raw.daily?.wind_direction_10m_dominant || [];

  const daily = dTime.slice(0, 7).map((dateStr, i) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    return {
      date: dateStr,
      dayName,
      weatherCode: dCode[i] ?? 0,
      tempMax: Math.round(dTempMax[i] ?? 0),
      tempMin: Math.round(dTempMin[i] ?? 0),
      apparentTempMax: Math.round(dApparentMax[i] ?? 0),
      apparentTempMin: Math.round(dApparentMin[i] ?? 0),
      sunrise: dSunrise[i] ? dSunrise[i].substring(11, 16) : '06:00',
      sunset: dSunset[i] ? dSunset[i].substring(11, 16) : '18:00',
      uvIndexMax: Math.round(dUVMax[i] ?? 0),
      precipitationSum: dPrecipSum[i] ?? 0,
      precipitationProbabilityMax: Math.round(dPrecipProbMax[i] ?? 0),
      windSpeedMax: Math.round(dWindMax[i] ?? 0),
      dominantWindDir: dWindDir[i] ?? 0,
    };
  });

  return {
    location,
    current,
    hourly,
    daily,
    units: {
      temperature: unitSystem === 'imperial' ? '°F' : '°C',
      windSpeed: unitSystem === 'imperial' ? 'mph' : 'km/h',
      precipitation: unitSystem === 'imperial' ? 'in' : 'mm',
      pressure: 'hPa',
    },
    updatedAt: new Date(),
  };
}

export async function getLocationByCoords(latitude: number, longitude: number): Promise<GeoLocationResult> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${latitude.toFixed(2)},${longitude.toFixed(2)}&count=1`;
    // Open meteo search with coords or fallback reverse geocodes
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    if (response.ok) {
      const geo = await response.json();
      return {
        id: Math.floor(Math.random() * 1000000),
        name: geo.city || geo.locality || geo.principalSubdivision || 'Your Location',
        latitude,
        longitude,
        country: geo.countryName || '',
        country_code: geo.countryCode || '',
        admin1: geo.principalSubdivision || '',
      };
    }
  } catch (err) {
    console.warn('Reverse geocode fallback used');
  }

  return {
    id: 1001,
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    country_code: '',
  };
}
