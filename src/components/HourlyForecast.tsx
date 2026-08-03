import React from 'react';
import { Clock, Umbrella, Wind } from 'lucide-react';
import { HourlyForecastItem, UnitsInfo } from '../types/weather';
import { getWMOInfo } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  units: UnitsInfo;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, units }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 my-6">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Hourly Outlook</h2>
          <span className="text-xs text-slate-400 ml-2 font-medium">Next 24 Hours</span>
        </div>

        {/* Scrollable Hourly Row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 custom-scrollbar">
          {hourly.map((item, index) => {
            const wmo = getWMOInfo(item.weatherCode);
            const timeObj = new Date(item.time);
            const timeFormatted = index === 0 ? 'Now' : timeObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

            return (
              <div
                key={`${item.time}-${index}`}
                className={`shrink-0 w-24 p-3.5 rounded-2xl border flex flex-col items-center justify-between gap-2 text-center transition-all duration-200 hover:scale-105 ${
                  index === 0
                    ? 'bg-sky-500/15 border-sky-500/40 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/30'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                {/* Hour */}
                <span className={`text-xs font-bold ${index === 0 ? 'text-sky-300' : 'text-slate-300'}`}>
                  {timeFormatted}
                </span>

                {/* Weather Icon */}
                <div className="my-1 text-white">
                  <WeatherIcon name={wmo.iconName} size={28} className={item.isDay ? 'text-amber-300' : 'text-sky-300'} />
                </div>

                {/* Temperature */}
                <span className="text-lg font-black text-white">{item.temperature}°</span>

                {/* Rain Chance Badge */}
                <div className="flex items-center gap-0.5 text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-full">
                  <Umbrella className="w-2.5 h-2.5" />
                  <span>{item.precipitationProbability}%</span>
                </div>

                {/* Wind speed */}
                <div className="flex items-center gap-0.5 text-[10px] font-medium text-slate-400">
                  <Wind className="w-2.5 h-2.5 text-slate-400" />
                  <span>{item.windSpeed}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
