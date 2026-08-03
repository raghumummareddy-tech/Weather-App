export type UnitSystem = 'metric' | 'imperial';

export interface GeoLocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex?: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  relativeHumidity: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  dominantWindDir: number;
}

export interface UnitsInfo {
  temperature: string; // "°C" or "°F"
  windSpeed: string; // "km/h" or "mph"
  precipitation: string; // "mm" or "inch"
  pressure: string; // "hPa"
}

export interface WeatherData {
  location: GeoLocationResult;
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  units: UnitsInfo;
  updatedAt: Date;
}

export interface PlanningRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'essential' | 'activity' | 'clothing' | 'health' | 'night';
  badgeText: string;
  iconName: string;
  variant: 'danger' | 'warning' | 'success' | 'info' | 'primary';
  actionableTip: string;
}
