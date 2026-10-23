import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  MapPin,
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

  // Live ticking local clock formatted in the city's specific timezone
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatLocalTime(now, city.timezone || 'auto'));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [city.timezone]);

  if (!weather || !weather.current) return null;

  const current = weather.current;
  const today = weather.today || {};
  const weatherDetails = getWeatherDetails(current.weatherCode, current.isDay);
  const formattedDate = formatLocalDate(new Date(), city.timezone || 'auto');

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/70 via-white/50 to-white/30 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-white/60 hover:shadow-sky-500/10 dark:border-white/10 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-950/40 sm:p-8">
      {/* Decorative ambient color orb behind hero */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl transition-transform duration-700 group-hover:scale-125 dark:bg-sky-500/15" />

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left column: Location, Date & Live Clock */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {city.name}
              {city.country ? `, ${city.country}` : ''}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
              {city.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              {weatherDetails.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Right column: Temperature & Animated Weather Icon */}
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
                  <span className="flex items-center text-rose-500 dark:text-rose-400">
                    <ArrowUp className="h-3.5 w-3.5" />
                    {formatTemp(today.tempMax, unit)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center text-sky-500 dark:text-sky-400">
                    <ArrowDown className="h-3.5 w-3.5" />
                    {formatTemp(today.tempMin, unit)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Large Animated Weather Icon Badge */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/60 bg-gradient-to-tr from-sky-500/20 via-indigo-500/10 to-transparent p-4 shadow-xl backdrop-blur-md transition-transform duration-500 group-hover:scale-105 dark:border-white/10 dark:from-sky-500/10 sm:h-32 sm:w-32">
            <WeatherIcon
              name={weatherDetails.iconName}
              className="h-16 w-16 text-sky-600 drop-shadow-md transition-transform duration-500 group-hover:rotate-6 dark:text-sky-400 sm:h-20 sm:w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
