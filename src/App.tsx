import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudSun, Loader2, Sparkles, RefreshCw, Heart } from 'lucide-react';
import { GeoLocationResult, UnitSystem, WeatherData } from './types/weather';
import { POPULAR_CITIES, fetchWeatherData, getLocationByCoords } from './services/weatherApi';
import { generatePlanningRecommendations } from './utils/recommendations';

import { Header } from './components/Header';
import { CitySearch } from './components/CitySearch';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { RecommendationsGrid } from './components/RecommendationsGrid';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherDetails } from './components/WeatherDetails';
import { ErrorDisplay } from './components/ErrorDisplay';

const LAST_CITY_STORAGE_KEY = 'weather_intel_last_city';

export default function App() {
  const [location, setLocation] = useState<GeoLocationResult>(() => {
    try {
      const saved = localStorage.getItem(LAST_CITY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse last location');
    }
    return POPULAR_CITIES[0]; // Default to London
  });

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data for currently selected location
  const loadWeather = useCallback(async (loc: GeoLocationResult, units: UnitSystem) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(loc, units);
      setWeatherData(data);
      // Save last selected city
      try {
        localStorage.setItem(LAST_CITY_STORAGE_KEY, JSON.stringify(loc));
      } catch (e) {
        console.warn('Failed to save last city');
      }
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(err?.message || 'Unable to fetch forecast data right now. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load or location / unit system change
  useEffect(() => {
    loadWeather(location, unitSystem);
  }, [location, unitSystem, loadWeather]);

  // Handle city selection from search or quick pills
  const handleSelectCity = (newLocation: GeoLocationResult) => {
    setLocation(newLocation);
  };

  // Handle unit system toggle
  const handleToggleUnit = (newUnit: UnitSystem) => {
    if (newUnit !== unitSystem) {
      setUnitSystem(newUnit);
    }
  };

  // Handle Geolocation trigger
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const coordsLoc = await getLocationByCoords(position.coords.latitude, position.coords.longitude);
          setLocation(coordsLoc);
        } catch (err) {
          setError('Could not identify your current city name from GPS coordinates.');
          setIsLoading(false);
        }
      },
      (geoErr) => {
        setIsLoading(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError('Location access was denied. Please allow location permissions in your browser or search for your city above.');
        } else {
          setError('Unable to retrieve your current location. Please search for your city manually.');
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleRefresh = () => {
    loadWeather(location, unitSystem);
  };

  // Recommendations calculated on weatherData
  const recommendations = weatherData
    ? generatePlanningRecommendations(weatherData.current, weatherData.daily[0], unitSystem)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <Header
        unitSystem={unitSystem}
        onToggleUnit={handleToggleUnit}
        onUseLocation={handleUseLocation}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {/* City Search Bar */}
        <CitySearch
          onSelectCity={handleSelectCity}
          isLoading={isLoading}
          currentCityName={location.name}
        />

        {/* Loading Spinner Skeleton */}
        {isLoading && !weatherData && (
          <div className="w-full max-w-4xl mx-auto my-16 px-4 text-center">
            <div className="inline-flex p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              <div className="text-left">
                <p className="text-base font-bold text-white">Fetching Live Weather Intelligence</p>
                <p className="text-xs text-slate-400">Querying Open-Meteo Geocoding & Forecast API for {location.name}...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorDisplay
            message={error}
            onRetry={handleRefresh}
            onSelectPopular={handleSelectCity}
          />
        )}

        {/* Main Weather Intelligence View */}
        <AnimatePresence mode="wait">
          {!error && weatherData && (
            <motion.div
              key={`${weatherData.location.id}-${weatherData.units.temperature}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-2"
            >
              {/* Hero Current Weather Card */}
              <CurrentWeatherCard weather={weatherData} />

              {/* Smart Planning Recommendations (Umbrella, Outdoor, Hot Weather, etc.) */}
              <RecommendationsGrid recommendations={recommendations} />

              {/* 24-Hour Hourly Forecast */}
              <HourlyForecast hourly={weatherData.hourly} units={weatherData.units} />

              {/* 7-Day Forecast */}
              <DailyForecast daily={weatherData.daily} units={weatherData.units} />

              {/* Environmental Metrics (Sunrise/Sunset, Wind Compass, UV Index, Humidity) */}
              <WeatherDetails weather={weatherData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-900/60 border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span>Weather Intelligence App &copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <span>Powered by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">Open-Meteo API</a></span>
            <span>&bull;</span>
            <span>Geocoding & 7-Day Forecast</span>
            {weatherData && (
              <>
                <span>&bull;</span>
                <span>Updated: {weatherData.updatedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
