import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  Globe,
  MapPin,
  Radio,
} from 'lucide-react';
import {
  formatLocalDate,
  formatLocalTime,
  formatTemp,
} from '../utils/formatters';
import { getWeatherDetails } from '../utils/weatherCodes';
import WeatherIcon from './WeatherIcon';

export default function CurrentWeather({ city, weather, unit }) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const timezone = weather?.timezone || city?.timezone || 'auto';

  // Live ticking local clock with seconds precision for current location
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(formatLocalTime(now, timezone, true));
      setCurrentDate(formatLocalDate(now, timezone));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, [timezone]);

  if (!weather || !weather.current) return null;

  const current = weather.current;
  const today = weather.today || {};
  const weatherDetails = getWeatherDetails(current.weatherCode, current.isDay);

  return (
    <div className="space-y-4">
      {/* Live Date, Time & Location Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>
              {city.isCurrentLocation ? 'Your Current Location' : 'Location Active'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-sky-500" />
            <span>
              {city.name}
              {city.country ? `, ${city.country}` : ''}
            </span>
          </div>
        </div>

        {/* Prominent Live Digital Clock & Date */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-sky-500" />
            <span className="font-semibold">{currentDate || 'Today'}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-1 font-mono text-sm font-bold text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
            <Clock className="h-3.5 w-3.5" />
            <span>{currentTime || '--:--:--'}</span>
          </div>

          {timezone && timezone !== 'auto' && (
            <div className="hidden items-center gap-1 text-[11px] font-medium text-slate-500 md:flex dark:text-slate-400">
              <Globe className="h-3 w-3 text-slate-400" />
              <span>{timezone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Weather Hero Card */}
      <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/70 via-white/50 to-white/30 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-white/60 hover:shadow-sky-500/10 dark:border-white/10 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-950/40 sm:p-8">
        {/* Decorative ambient color orb */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl transition-transform duration-700 group-hover:scale-125 dark:bg-sky-500/15" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          {/* Left Column: City & Weather Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {city.name}
              </h1>
              {city.isCurrentLocation && (
                <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-bold text-sky-600 dark:text-sky-300">
                  Current
                </span>
              )}
            </div>

            <p className="text-base font-semibold text-sky-600 dark:text-sky-400 sm:text-lg">
              {weatherDetails.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Latitude: {Number(city.latitude).toFixed(2)}°</span>
              <span>•</span>
              <span>Longitude: {Number(city.longitude).toFixed(2)}°</span>
            </div>
          </div>

          {/* Right Column: Large Temperature & Weather Icon */}
          <div className="flex items-center justify-between gap-6 sm:justify-end">
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-7xl md:text-8xl">
                  {Math.round(unit === 'F' ? (current.temperature * 9) / 5 + 32 : current.temperature)}
                </span>
                <span className="text-2xl font-bold text-sky-600 dark:text-sky-400 sm:text-3xl">
                  °{unit}
                </span>
              </div>

              {/* Feels like & Daily High/Low */}
              <div className="mt-1 flex flex-col items-end gap-1 text-xs sm:text-sm">
                <div className="font-medium text-slate-600 dark:text-slate-300">
                  Feels like{' '}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatTemp(current.feelsLike, unit)}
                  </span>
                </div>

                {today.tempMax !== undefined && (
                  <div className="flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center text-rose-500 dark:text-rose-400 font-semibold">
                      <ArrowUp className="h-3.5 w-3.5" />
                      {formatTemp(today.tempMax, unit)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center text-sky-500 dark:text-sky-400 font-semibold">
                      <ArrowDown className="h-3.5 w-3.5" />
                      {formatTemp(today.tempMin, unit)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Large Animated Weather Icon Badge */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/60 bg-gradient-to-tr from-sky-500/20 via-indigo-500/10 to-transparent p-4 shadow-xl backdrop-blur-md transition-transform duration-500 group-hover:scale-105 dark:border-white/10 dark:from-sky-500/10 sm:h-32 sm:w-32">
              <WeatherIcon
                name={weatherDetails.iconName}
                className="h-16 w-16 text-sky-600 drop-shadow-md transition-transform duration-500 group-hover:rotate-6 dark:text-sky-400 sm:h-20 sm:w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
