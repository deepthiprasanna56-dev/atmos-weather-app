import {
  Droplets,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from 'lucide-react';
import {
  formatLocalTime,
  formatPressure,
  formatTemp,
  formatVisibility,
  formatWindSpeed,
  getUVInfo,
  getWindDirection,
} from '../utils/formatters';

export default function WeatherMetricsGrid({ weather, unit }) {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const today = weather.today || {};
  const uvInfo = getUVInfo(today.uvIndex);
  const windDir = getWindDirection(current.windDirection);

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${current.humidity}%`,
      subValue: current.humidity > 65 ? 'High moisture' : current.humidity < 35 ? 'Dry air' : 'Optimal comfort',
      icon: Droplets,
      iconColor: 'text-sky-500',
      bgColor: 'from-sky-500/10 to-transparent',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: formatWindSpeed(current.windSpeed, unit),
      subValue: windDir ? `Direction: ${windDir} (${current.windDirection}°)` : 'Gentle breeze',
      icon: Wind,
      iconColor: 'text-teal-500',
      bgColor: 'from-teal-500/10 to-transparent',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: formatVisibility(current.visibility, unit),
      subValue: current.visibility > 9000 ? 'Clear view' : 'Reduced visibility',
      icon: Eye,
      iconColor: 'text-indigo-500',
      bgColor: 'from-indigo-500/10 to-transparent',
    },
    {
      id: 'pressure',
      label: 'Air Pressure',
      value: formatPressure(current.surfacePressure),
      subValue: current.surfacePressure > 1013 ? 'High pressure (Fair)' : 'Low pressure',
      icon: Gauge,
      iconColor: 'text-purple-500',
      bgColor: 'from-purple-500/10 to-transparent',
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: today.uvIndex !== undefined ? today.uvIndex.toFixed(1) : '0',
      subValue: `${uvInfo.level} risk`,
      badgeColor: uvInfo.color,
      icon: Sun,
      iconColor: 'text-amber-500',
      bgColor: 'from-amber-500/10 to-transparent',
    },
    {
      id: 'feels_like',
      label: 'Feels Like',
      value: formatTemp(current.feelsLike, unit),
      subValue:
        Math.abs(current.feelsLike - current.temperature) < 1.5
          ? 'Similar to actual temp'
          : current.feelsLike > current.temperature
            ? 'Humid warmth'
            : 'Wind chill cooling',
      icon: Thermometer,
      iconColor: 'text-rose-500',
      bgColor: 'from-rose-500/10 to-transparent',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 6 Key Meteorological Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/70 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {metric.label}
                </span>
                <div className={`rounded-xl bg-white/80 p-2 shadow-2xs dark:bg-slate-800/80 ${metric.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-2.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  {metric.value}
                </span>
                <p className="mt-1 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {metric.badgeColor ? (
                    <span className={`font-semibold ${metric.badgeColor}`}>
                      {metric.subValue}
                    </span>
                  ) : (
                    metric.subValue
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sunrise & Sunset Highlight Card */}
      {today.sunrise && today.sunset && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {/* Sunrise Card */}
          <div className="group flex items-center justify-between rounded-2xl border border-white/40 bg-gradient-to-r from-amber-500/10 via-white/50 to-white/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:shadow-md dark:border-white/10 dark:from-amber-500/10 dark:via-slate-900/60 dark:to-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/15 p-2.5 text-amber-500 dark:bg-amber-400/20 dark:text-amber-300">
                <Sunrise className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Sunrise
                </span>
                <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                  {formatLocalTime(today.sunrise, weather.timezone)}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Dawn
            </span>
          </div>

          {/* Sunset Card */}
          <div className="group flex items-center justify-between rounded-2xl border border-white/40 bg-gradient-to-r from-indigo-500/10 via-white/50 to-white/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:shadow-md dark:border-white/10 dark:from-indigo-500/10 dark:via-slate-900/60 dark:to-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/15 p-2.5 text-indigo-500 dark:bg-indigo-400/20 dark:text-indigo-300">
                <Sunset className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Sunset
                </span>
                <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                  {formatLocalTime(today.sunset, weather.timezone)}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Dusk
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
