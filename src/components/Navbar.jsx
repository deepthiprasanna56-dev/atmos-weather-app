import {
  CloudLightning,
  MapPin,
  Moon,
  Pause,
  Play,
  Sun,
} from 'lucide-react';

export default function Navbar({
  unit,
  toggleUnit,
  toggleTheme,
  isDark,
  reducedMotion,
  toggleMotion,
  onDetectLocation,
  loadingLocation,
}) {
  return (
    <header className="sticky top-0 z-30 w-full transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <nav className="glass-panel flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 shadow-lg backdrop-blur-xl transition-all">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <CloudLightning className="h-5 w-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Atmos
                </span>
                <span className="hidden rounded-full bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-600 dark:bg-sky-400/15 dark:text-sky-300 sm:inline-block">
                  Live
                </span>
              </div>
              <p className="hidden text-[11px] font-medium text-slate-500 dark:text-slate-400 md:block">
                Modern Weather Intelligence
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Geolocation Button */}
            <button
              onClick={onDetectLocation}
              disabled={loadingLocation}
              title="Detect your current location"
              aria-label="Detect current location"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-sky-300 hover:bg-sky-50/80 hover:text-sky-600 active:scale-95 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400/40 dark:hover:bg-white/10 dark:hover:text-sky-400"
            >
              <MapPin className={`h-4 w-4 text-sky-500 ${loadingLocation ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">My Location</span>
            </button>

            {/* Celsius / Fahrenheit Unit Switch */}
            <div className="flex items-center rounded-xl border border-slate-200/60 bg-slate-100/70 p-1 dark:border-white/10 dark:bg-white/5">
              <button
                onClick={unit === 'F' ? toggleUnit : undefined}
                className={`flex h-7 items-center justify-center rounded-lg px-2.5 text-xs font-bold transition-all ${
                  unit === 'C'
                    ? 'bg-white text-sky-600 shadow-xs dark:bg-slate-800 dark:text-sky-400'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Switch to Celsius"
              >
                °C
              </button>
              <button
                onClick={unit === 'C' ? toggleUnit : undefined}
                className={`flex h-7 items-center justify-center rounded-lg px-2.5 text-xs font-bold transition-all ${
                  unit === 'F'
                    ? 'bg-white text-sky-600 shadow-xs dark:bg-slate-800 dark:text-sky-400'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Switch to Fahrenheit"
              >
                °F
              </button>
            </div>

            {/* Motion toggle (Accessibility & Animation Control) */}
            <button
              onClick={toggleMotion}
              title={reducedMotion ? 'Resume weather ambient animations' : 'Pause weather ambient animations'}
              aria-label={reducedMotion ? 'Resume animations' : 'Pause animations'}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-white/50 text-slate-600 shadow-xs transition-all hover:bg-slate-100/80 hover:text-slate-900 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {reducedMotion ? (
                <Play className="h-4 w-4 text-emerald-500" />
              ) : (
                <Pause className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-white/50 text-slate-700 shadow-xs transition-all hover:bg-slate-100/80 hover:text-amber-500 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-sky-400"
            >
              {isDark ? (
                <Moon className="h-4 w-4 text-sky-400 transition-transform duration-300 rotate-0" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
