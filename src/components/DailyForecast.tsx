import React from 'react';
import { Calendar, Umbrella, Sun, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyForecastItem, UnitsInfo } from '../types/weather';
import { getWMOInfo } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  units: UnitsInfo;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, units }) => {
  if (!daily || daily.length === 0) return null;

  // Calculate overall min and max across all 7 days for the visual range bar
  const globalMin = Math.min(...daily.map((d) => d.tempMin));
  const globalMax = Math.max(...daily.map((d) => d.tempMax));
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 my-6">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
        {/* Title */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">7-Day Forecast</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Daily Outlook</span>
        </div>

        {/* List of 7 Days */}
        <div className="space-y-3">
          {daily.map((day, idx) => {
            const wmo = getWMOInfo(day.weatherCode);

            // Calculate percentage position for bar
            const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - globalMin) / tempRange) * 100));
            const rightPercent = Math.max(0, Math.min(100, ((day.tempMax - globalMin) / tempRange) * 100));
            const barWidth = Math.max(10, rightPercent - leftPercent);

            const dateStr = new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={day.date}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  idx === 0
                    ? 'bg-sky-500/10 border-sky-500/30'
                    : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Day name & Date */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="p-2 rounded-xl bg-slate-800 text-amber-300">
                    <WeatherIcon name={wmo.iconName} size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {day.dayName} {idx === 0 && <span className="text-xs text-sky-400 font-normal">(Today)</span>}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{dateStr}</p>
                  </div>
                </div>

                {/* Weather description & rain chance */}
                <div className="flex items-center gap-3 sm:w-1/4">
                  <p className="text-xs font-semibold text-slate-200 capitalize truncate">{wmo.description}</p>
                  {day.precipitationProbabilityMax > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20 shrink-0">
                      <Umbrella className="w-3 h-3" />
                      {day.precipitationProbabilityMax}%
                    </span>
                  )}
                </div>

                {/* Temperature Progress Visual Bar */}
                <div className="flex items-center gap-3 flex-1 max-w-xs">
                  <span className="text-xs font-semibold text-slate-400 w-8 text-right">
                    {day.tempMin}°
                  </span>
                  <div className="relative flex-1 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white w-8">
                    {day.tempMax}°
                  </span>
                </div>

                {/* UV Max badge */}
                <div className="hidden lg:flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shrink-0">
                  <Sun className="w-3.5 h-3.5" />
                  <span>UV {day.uvIndexMax}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
