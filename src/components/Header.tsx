import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, RefreshCw, Sparkles, Thermometer } from 'lucide-react';
import { UnitSystem } from '../types/weather';

interface HeaderProps {
  unitSystem: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  onUseLocation: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  unitSystem,
  onToggleUnit,
  onUseLocation,
  onRefresh,
  isLoading,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-30 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                Weather Intel
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="w-3 h-3" /> Live Forecast
              </span>
            </div>
            {timeStr && <p className="text-xs text-slate-400 font-medium">{timeStr}</p>}
          </div>
        </div>

        {/* Right Controls: Location, Refresh, Unit Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          {/* Use Current GPS Location */}
          <button
            onClick={onUseLocation}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700/70 transition-all active:scale-95 disabled:opacity-50"
            title="Use current GPS location"
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            <span className="hidden xs:inline">My Location</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700/70 transition-all active:scale-95 disabled:opacity-50"
            title="Refresh current weather"
          >
            <RefreshCw className={`w-4 h-4 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Metric / Imperial Unit Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onToggleUnit('metric')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                unitSystem === 'metric'
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C <span className="hidden sm:inline text-[10px] opacity-80">(km/h)</span>
            </button>
            <button
              onClick={() => onToggleUnit('imperial')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                unitSystem === 'imperial'
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F <span className="hidden sm:inline text-[10px] opacity-80">(mph)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
