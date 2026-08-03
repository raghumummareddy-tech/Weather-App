import React from 'react';
import { Sunrise, Sunset, Wind, Compass, Sun, Droplets, Gauge, Eye } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherDetailsProps {
  weather: WeatherData;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather }) => {
  const { current, daily, units } = weather;
  const today = daily[0];

  // Calculate UV description
  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400', bg: 'bg-orange-500' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400', bg: 'bg-rose-500' };
    return { text: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-500' };
  };

  const uvInfo = getUVLevel(current.uvIndex ?? 0);

  // Calculate wind direction compass label
  const getWindDirectionLabel = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sunrise & Sunset Card */}
        {today && (
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Sun Schedule
              </span>
              <Sunrise className="w-5 h-5 text-amber-400" />
            </div>

            <div className="my-4 space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-slate-300">Sunrise</span>
                </div>
                <span className="text-sm font-bold text-white">{today.sunrise}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Sunset className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-medium text-slate-300">Sunset</span>
                </div>
                <span className="text-sm font-bold text-white">{today.sunset}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Sunlight duration based on local geographical coordinates.
            </p>
          </div>
        )}

        {/* Wind & Gusts Compass Card */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Wind Dynamics
            </span>
            <Wind className="w-5 h-5 text-teal-400" />
          </div>

          <div className="my-4 flex items-center gap-4">
            {/* Compass degree visual */}
            <div className="relative w-16 h-16 rounded-full bg-slate-950 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Compass
                className="w-8 h-8 text-teal-400 transition-transform duration-500"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              />
              <span className="absolute top-1 text-[9px] font-bold text-slate-500">N</span>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-black text-white">
                {current.windSpeed}{' '}
                <span className="text-xs font-medium text-slate-400">{units.windSpeed}</span>
              </p>
              <p className="text-xs text-slate-300 font-medium">
                Direction:{' '}
                <span className="font-bold text-teal-300">
                  {getWindDirectionLabel(current.windDirection)} ({current.windDirection}°)
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Gusts up to <span className="font-semibold text-slate-200">{current.windGusts} {units.windSpeed}</span>
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Surface wind vectors measured at 10 meters height.
          </p>
        </div>

        {/* UV Index Scale Card */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              UV Index Scale
            </span>
            <Sun className="w-5 h-5 text-amber-400" />
          </div>

          <div className="my-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{current.uvIndex ?? 0}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${uvInfo.color} bg-slate-800`}>
                {uvInfo.text}
              </span>
            </div>

            {/* Spectrum Bar */}
            <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-800">
              <div className="h-full flex-1 bg-emerald-500 rounded-s-full" />
              <div className="h-full flex-1 bg-amber-500" />
              <div className="h-full flex-1 bg-orange-500" />
              <div className="h-full flex-1 bg-rose-500" />
              <div className="h-full flex-1 bg-purple-500 rounded-e-full" />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            {current.uvIndex && current.uvIndex >= 6
              ? 'Protection required: Wear sunscreen, sunglasses, and hat.'
              : 'Low sun hazard level currently.'}
          </p>
        </div>

        {/* Humidity & Pressure Card */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Atmosphere
            </span>
            <Gauge className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="my-4 space-y-3">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60">
              <span className="text-xs text-slate-300">Humidity</span>
              <span className="text-sm font-bold text-white">{current.relativeHumidity}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60">
              <span className="text-xs text-slate-300">Pressure</span>
              <span className="text-sm font-bold text-white">{current.pressureMsl} hPa</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60">
              <span className="text-xs text-slate-300">Cloudiness</span>
              <span className="text-sm font-bold text-white">{current.cloudCover}%</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Real-time barometric and moisture readings.
          </p>
        </div>
      </div>
    </section>
  );
};
