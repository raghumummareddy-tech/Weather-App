import React from 'react';
import { AlertTriangle, RefreshCw, Compass } from 'lucide-react';
import { GeoLocationResult } from '../types/weather';
import { POPULAR_CITIES } from '../services/weatherApi';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
  onSelectPopular: (city: GeoLocationResult) => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry, onSelectPopular }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-12 px-4">
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl space-y-4">
        <div className="inline-flex p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Weather Service Notice</h3>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">{message}</p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400 font-medium mb-3 flex items-center justify-center gap-1">
            <Compass className="w-3.5 h-3.5 text-sky-400" /> Or pick one of these popular cities:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_CITIES.slice(0, 6).map((city) => (
              <button
                key={`err-${city.id}`}
                onClick={() => onSelectPopular(city)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
