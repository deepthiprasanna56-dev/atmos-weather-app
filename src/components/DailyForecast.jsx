import { CalendarDays, Droplets } from 'lucide-react';
import {
  formatDayOfWeek,
  formatTemp,
} from '../utils/formatters';
import { getWeatherDetails } from '../utils/weatherCodes';
import WeatherIcon from './WeatherIcon';

export default function DailyForecast({ daily = [], timezone, unit }) {
  if (!daily || daily.length === 0) return null;

  // Calculate overall min and max across all 7 days to size the temperature bars proportionally
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempSpan = globalMax - globalMin || 1;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-sky-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            7-Day Forecast
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Weekly Outlook
        </span>
      </div>

      {/* Daily list */}
      <div className="divide-y divide-slate-200/50 dark:divide-white/5">
        {daily.map((day, idx) => {
          const isToday = idx === 0;
          const condition = getWeatherDetails(day.weatherCode, 1);
          const dayName = formatDayOfWeek(day.date, timezone, isToday);

          // Calculate percentage offsets for the visual temp bar
          const leftPercent = Math.max(
            0,
            Math.min(100, ((day.tempMin - globalMin) / tempSpan) * 100)
          );
          const rightPercent = Math.max(
            0,
            Math.min(100, ((globalMax - day.tempMax) / tempSpan) * 100)
          );

          return (
            <div
              key={day.date}
              className="group flex flex-col gap-2 py-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4 hover:bg-white/40 dark:hover:bg-white/5 rounded-xl px-2"
            >
              {/* Day & Date info */}
              <div className="flex items-center justify-between sm:w-40 sm:justify-start">
                <span
                  className={`text-sm font-bold sm:w-20 ${
                    isToday
                      ? 'text-sky-600 dark:text-sky-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {dayName}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 sm:hidden">
                  {day.date.slice(5)}
                </span>
              </div>

              {/* Weather Condition & Icon */}
              <div className="flex items-center gap-3 sm:w-44">
                <div className="flex h-8 w-8 items-center justify-center">
                  <WeatherIcon
                    name={condition.iconName}
                    className="h-6 w-6 text-slate-700 transition-transform group-hover:scale-110 dark:text-slate-200"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 sm:text-sm">
                    {condition.description}
                  </span>
                  {day.precipitationProbability > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                      <Droplets className="h-3 w-3" />
                      {day.precipitationProbability}%
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Temperature Bar & Min/Max values */}
              <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
                <span className="w-10 text-right font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">
                  {formatTemp(day.tempMin, unit)}
                </span>

                {/* Bar representation */}
                <div className="relative h-2 w-28 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800 sm:w-36 md:w-44">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 shadow-2xs transition-all duration-500"
                    style={{
                      left: `${leftPercent}%`,
                      right: `${rightPercent}%`,
                    }}
                  />
                </div>

                <span className="w-10 text-left font-mono text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                  {formatTemp(day.tempMax, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
