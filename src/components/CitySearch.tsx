import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, History, Compass, AlertCircle } from 'lucide-react';
import { GeoLocationResult } from '../types/weather';
import { searchCities, POPULAR_CITIES } from '../services/weatherApi';

interface CitySearchProps {
  onSelectCity: (location: GeoLocationResult) => void;
  isLoading: boolean;
  currentCityName?: string;
}

const RECENT_STORAGE_KEY = 'weather_intel_recent_cities';

export const CitySearch: React.FC<CitySearchProps> = ({ onSelectCity, isLoading, currentCityName }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [recentCities, setRecentCities] = useState<GeoLocationResult[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent cities on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) {
        setRecentCities(JSON.parse(stored).slice(0, 5));
      }
    } catch (e) {
      console.warn('Could not read recent searches');
    }
  }, []);

  // Save to recent cities helper
  const saveToRecent = (city: GeoLocationResult) => {
    setRecentCities((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id && item.name.toLowerCase() !== city.name.toLowerCase());
      const updated = [city, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save recent search');
      }
      return updated;
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setHasNoResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setHasNoResults(false);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        setHasNoResults(results.length === 0);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
        setSuggestions([]);
        setHasNoResults(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: GeoLocationResult) => {
    saveToRecent(city);
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-4 px-4">
      <div className="relative" ref={dropdownRef}>
        {/* Search Input Box */}
        <div className="relative flex items-center">
          <div className="absolute left-4 text-sky-400 pointer-events-none">
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city, e.g. London, Tokyo, New York, Paris..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-900 border border-slate-700/80 focus:border-sky-500 rounded-2xl text-white placeholder-slate-400 font-medium shadow-xl shadow-slate-950/40 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all text-sm sm:text-base"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setHasNoResults(false);
              }}
              className="absolute right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {isOpen && (query.trim().length >= 2 || suggestions.length > 0 || hasNoResults) && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden divide-y divide-slate-800">
            {isSearching && suggestions.length === 0 && (
              <div className="p-4 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> Searching locations...
              </div>
            )}

            {!isSearching && hasNoResults && (
              <div className="p-5 text-center">
                <div className="inline-flex p-2.5 rounded-full bg-amber-500/10 text-amber-400 mb-2">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white">No City Found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  We couldn't find matches for "<span className="text-slate-200 font-medium">{query}</span>". Try checking the spelling or search a nearby major city.
                </p>
              </div>
            )}

            {!isSearching && suggestions.length > 0 && (
              <div className="max-h-72 overflow-y-auto custom-scrollbar p-1.5">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Matching Locations
                </div>
                {suggestions.map((city) => {
                  const locationDetail = [city.admin1, city.country].filter(Boolean).join(', ');
                  return (
                    <button
                      key={`${city.id}-${city.latitude}-${city.longitude}`}
                      onClick={() => handleSelect(city)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-left group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-sky-500/20 text-slate-400 group-hover:text-sky-400 transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-sky-300">
                            {city.name}
                          </p>
                          <p className="text-xs text-slate-400">{locationDetail}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Searches & Popular Quick Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {/* Popular Cities */}
        <div className="flex items-center gap-1.5 text-slate-400 mr-1 font-medium">
          <Compass className="w-3.5 h-3.5 text-sky-400" /> Popular:
        </div>
        {POPULAR_CITIES.map((city) => {
          const isActive = currentCityName?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              disabled={isLoading}
              className={`px-2.5 py-1 rounded-full border transition-all text-xs font-medium active:scale-95 ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {city.name}
            </button>
          );
        })}

        {/* Recent Search History */}
        {recentCities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-l border-slate-800 pl-2 ml-1">
            <span className="text-slate-400 flex items-center gap-1">
              <History className="w-3 h-3 text-amber-400" /> Recent:
            </span>
            {recentCities.map((city) => (
              <button
                key={`recent-${city.id}`}
                onClick={() => onSelectCity(city)}
                className="px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-all"
              >
                {city.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
