import { AlertTriangle, RefreshCw } from 'lucide-react';
import { POPULAR_CITIES } from '../constants/defaultCities';

export default function ErrorAlert({ message, onRetry, onSelectPopular }) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 shadow-xl backdrop-blur-xl dark:border-rose-500/30 dark:bg-rose-950/30">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-500 dark:bg-rose-500/30 dark:text-rose-400">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Weather Data Unavailable
        </h3>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {message || 'We could not fetch the weather for this location. Please verify your query or connection.'}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
        )}

        <div className="mt-6 border-t border-rose-500/10 pt-4 dark:border-rose-500/20">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Or select a featured world city:
          </p>
          <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
            {POPULAR_CITIES.slice(0, 4).map((city) => (
              <button
                key={city.name}
                onClick={() => onSelectPopular(city)}
                className="rounded-lg border border-slate-300/60 bg-white/60 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
