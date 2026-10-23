import { useEffect, useRef, useState } from 'react';
import {
  History,
  Loader2,
  MapPin,
  Search,
  TrendingUp,
  X,
} from 'lucide-react';
import { POPULAR_CITIES } from '../constants/defaultCities';

export default function SearchBar({
  onSelectCity,
  searchCities,
  recentSearches = [],
  onRemoveRecentSearch,
  onClearRecentSearches,
  currentCityName,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchError, setSearchError] = useState(null);

  const containerRef = useRef(null);

  // Debounced search query
  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        if (results.length === 0) {
          setSearchError(`No cities found matching "${query}". Try another city name.`);
        }
      } catch {
        setSearchError('Error searching for cities. Please try again.');
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [query, searchCities]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSearchError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
    } else if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative z-20 mx-auto w-full max-w-3xl">
      {/* Search Input Container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="group relative flex items-center rounded-2xl border border-white/50 bg-white/70 shadow-lg backdrop-blur-xl transition-all duration-300 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/20 hover:border-white/80 dark:border-white/10 dark:bg-slate-900/70 dark:focus-within:border-sky-400 dark:focus-within:ring-sky-400/20">
          <div className="flex h-12 w-12 items-center justify-center text-slate-400 transition-colors group-focus-within:text-sky-500 dark:text-slate-500 dark:group-focus-within:text-sky-400">
            {searching ? (
              <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              setIsOpen(true);
              setActiveIndex(-1);
              if (val.trim().length < 2) {
                setSuggestions([]);
                setSearching(false);
                setSearchError(null);
              }
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search by city name (e.g., Tokyo, Chicago, Madrid)..."
            aria-label="Search city weather"
            className="h-12 w-full bg-transparent pr-12 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-slate-500"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setSearchError(null);
              }}
              className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Live Auto-suggest Dropdown */}
        {isOpen && (suggestions.length > 0 || searchError || searching) && (
          <div className="absolute top-full left-0 mt-2 w-full overflow-hidden rounded-2xl border border-white/40 bg-white/95 py-2 shadow-2xl backdrop-blur-2xl transition-all animate-fade-in-up dark:border-white/10 dark:bg-slate-900/95">
            {searching && (
              <div className="flex items-center gap-2.5 px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                Searching live global locations...
              </div>
            )}

            {searchError && !searching && (
              <div className="px-4 py-3 text-xs text-rose-500 dark:text-rose-400">
                {searchError}
              </div>
            )}

            {suggestions.map((city, idx) => (
              <button
                key={`${city.latitude}-${city.longitude}-${idx}`}
                type="button"
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                  idx === activeIndex
                    ? 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300'
                    : 'text-slate-700 hover:bg-slate-100/60 dark:text-slate-200 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <span className="font-semibold">{city.name}</span>
                  {city.admin1 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {city.admin1},
                    </span>
                  )}
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {city.country}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  {city.timezone}
                </span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Quick Access Chips: Recent Searches & Popular Cities */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              <History className="h-3 w-3" /> Recent:
            </span>
            {recentSearches.map((city) => (
              <div
                key={city.name}
                className="group flex items-center rounded-lg border border-white/40 bg-white/50 px-2.5 py-1 text-slate-700 shadow-2xs backdrop-blur-md transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-sky-400/40 dark:hover:bg-white/10 dark:hover:text-sky-300"
              >
                <button
                  type="button"
                  onClick={() => onSelectCity(city)}
                  className="font-medium"
                >
                  {city.name}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecentSearch(city.name);
                  }}
                  className="ml-1.5 rounded-full p-0.5 text-slate-400 opacity-60 hover:bg-slate-200 hover:text-rose-500 group-hover:opacity-100 dark:hover:bg-slate-800"
                  title="Remove from history"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {recentSearches.length > 2 && (
              <button
                type="button"
                onClick={onClearRecentSearches}
                className="text-[11px] text-slate-400 underline decoration-dotted hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Popular Cities */}
        <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
          <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            <TrendingUp className="h-3 w-3" /> Popular:
          </span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`rounded-lg border px-2.5 py-1 font-medium transition-all ${
                currentCityName?.toLowerCase() === city.name.toLowerCase()
                  ? 'border-sky-500 bg-sky-500 text-white shadow-xs'
                  : 'border-white/40 bg-white/40 text-slate-700 hover:border-sky-300 hover:bg-sky-50/70 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-sky-300'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
