import { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
} from 'lucide-react';
import { formatLocalTime, formatTemp } from '../utils/formatters';
import { getWeatherDetails } from '../utils/weatherCodes';
import WeatherIcon from './WeatherIcon';

export default function HourlyForecast({ hourly = [], timezone, unit }) {
  const scrollRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 sm:p-6">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-sky-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            Hourly Forecast (24 Hours)
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/60 bg-white/50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            title="Scroll left"
            aria-label="Scroll hourly forecast left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/60 bg-white/50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            title="Scroll right"
            aria-label="Scroll hourly forecast right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="custom-scrollbar flex gap-3 overflow-x-auto pb-2 scroll-smooth"
      >
        {hourly.map((item, idx) => {
          const isNow = idx === 0;
          const condition = getWeatherDetails(item.weatherCode, item.isDay);
          const timeLabel = isNow ? 'Now' : formatLocalTime(item.time, timezone);

          return (
            <div
              key={item.time}
              className={`group flex min-w-[94px] flex-col items-center justify-between rounded-2xl p-3.5 transition-all duration-300 hover:-translate-y-1 ${
                isNow
                  ? 'border border-sky-500/40 bg-gradient-to-b from-sky-500/20 via-sky-500/10 to-transparent shadow-md'
                  : 'border border-white/40 bg-white/40 hover:border-sky-300/60 hover:bg-white/80 dark:border-white/5 dark:bg-white/5 dark:hover:border-white/15 dark:hover:bg-white/10'
              }`}
            >
              {/* Time */}
              <span
                className={`font-mono text-xs font-semibold ${
                  isNow
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {timeLabel}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5 flex h-9 w-9 items-center justify-center">
                <WeatherIcon
                  name={condition.iconName}
                  className="h-8 w-8 text-slate-700 drop-shadow-xs transition-transform group-hover:scale-110 dark:text-slate-200"
                />
              </div>

              {/* Temperature */}
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {formatTemp(item.temperature, unit)}
              </span>

              {/* Rain Probability */}
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                <Droplets className="h-3 w-3" />
                <span>{item.precipitationProbability}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
