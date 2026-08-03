import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Droplets, Wind, Sun, Eye, Gauge, Cloud, Sparkles } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { getWMOInfo } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: WeatherData;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather }) => {
  const { location, current, daily, units } = weather;
  const wmo = getWMOInfo(current.weatherCode);

  const todayForecast = daily[0];
  const locationText = [location.name, location.admin1, location.country].filter(Boolean).join(', ');

  const gradientClass = current.isDay ? wmo.gradientDay : wmo.gradientNight;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-4">
      {/* Hero Weather Card */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientClass} p-6 sm:p-8 text-white shadow-2xl transition-all duration-500 ring-1 ring-white/20`}
      >
        {/* Background Decorative Circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-black/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Temp & Condition */}
          <div className="space-y-4">
            {/* Location & Status Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-white/90 text-xs font-semibold ring-1 ring-white/20">
                <MapPin className="w-3.5 h-3.5 text-sky-300" />
                <span>{locationText}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white">
                {current.isDay ? '☀️ Daytime' : '🌙 Nighttime'}
              </span>
            </div>

            {/* Temperature Display */}
            <div className="flex items-baseline gap-4">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight drop-shadow-md">
                {current.temperature}°
              </span>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-bold capitalize flex items-center gap-2 drop-shadow">
                  <WeatherIcon name={wmo.iconName} size={28} className="text-white drop-shadow" />
                  {wmo.description}
                </p>
                <p className="text-sm text-white/80 font-medium">
                  Feels like{' '}
                  <span className="font-semibold text-white">
                    {current.apparentTemperature}{units.temperature}
                  </span>
                </p>
              </div>
            </div>

            {/* High / Low Range */}
            {todayForecast && (
              <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold text-white/90">
                <span className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <ArrowUp className="w-3.5 h-3.5 text-amber-300" />
                  High: {todayForecast.tempMax}{units.temperature}
                </span>
                <span className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <ArrowDown className="w-3.5 h-3.5 text-sky-200" />
                  Low: {todayForecast.tempMin}{units.temperature}
                </span>
              </div>
            )}
          </div>

          {/* Key Weather Metrics Quick Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:w-1/2">
            {/* Humidity */}
            <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/15 text-sky-200">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Humidity</p>
                <p className="text-base font-bold text-white">{current.relativeHumidity}%</p>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/15 text-teal-200">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Wind Speed</p>
                <p className="text-base font-bold text-white">
                  {current.windSpeed} <span className="text-xs font-normal">{units.windSpeed}</span>
                </p>
              </div>
            </div>

            {/* UV Index */}
            <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/15 text-amber-200">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">UV Index</p>
                <p className="text-base font-bold text-white">{current.uvIndex ?? 0}</p>
              </div>
            </div>

            {/* Atmospheric Pressure */}
            <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/15 text-indigo-200">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Pressure</p>
                <p className="text-base font-bold text-white">
                  {current.pressureMsl} <span className="text-xs font-normal">hPa</span>
                </p>
              </div>
            </div>

            {/* Cloud Cover */}
            <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/15 text-slate-200">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Cloud Cover</p>
                <p className="text-base font-bold text-white">{current.cloudCover}%</p>
              </div>
            </div>

            {/* Rain / Precip */}
            <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/15 text-blue-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Precipitation</p>
                <p className="text-base font-bold text-white">
                  {current.precipitation} <span className="text-xs font-normal">{units.precipitation}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
