import { useCallback, useEffect, useState } from 'react';
import { POPULAR_CITIES } from '../constants/defaultCities';
import { fetchWeatherData, reverseGeocode, searchCities } from '../services/weatherApi';

const RECENT_SEARCHES_KEY = 'atmos_recent_searches';
const UNIT_KEY = 'atmos_temp_unit';
const MOTION_KEY = 'atmos_reduced_motion';

export function useWeather() {
  const [currentCity, setCurrentCity] = useState({
    ...POPULAR_CITIES[0],
    isCurrentLocation: false,
  }); // Default to London (not current location)
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [unit, setUnit] = useState(() => {
    try {
      return localStorage.getItem(UNIT_KEY) || 'C';
    } catch {
      return 'C';
    }
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    try {
      const stored = localStorage.getItem(MOTION_KEY);
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      try {
        localStorage.setItem(UNIT_KEY, next);
      } catch {
        // storage disabled
      }
      return next;
    });
  }, []);

  const toggleMotion = useCallback(() => {
    setReducedMotion((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MOTION_KEY, String(next));
      } catch {
        // storage disabled
      }
      return next;
    });
  }, []);

  const saveRecentSearch = useCallback((city) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (c) =>
          c.name.toLowerCase() !== city.name.toLowerCase() ||
          (c.country && city.country && c.country.toLowerCase() !== city.country.toLowerCase())
      );
      const updated = [city, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // storage disabled
      }
      return updated;
    });
  }, []);

  const removeRecentSearch = useCallback((cityName) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((c) => c.name !== cityName);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // storage disabled
      }
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // storage disabled
    }
  }, []);

  const loadWeather = useCallback(
    async (city, isFromGeo = false) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherData(city.latitude, city.longitude, city.timezone || 'auto');
        setWeatherData(data);
        const resolvedCity = {
          ...city,
          timezone: data.timezone || city.timezone || 'auto',
          isCurrentLocation: isFromGeo || Boolean(city.isCurrentLocation),
        };
        setCurrentCity(resolvedCity);
        saveRecentSearch(resolvedCity);
      } catch (err) {
        console.error(err);
        setError(`Unable to fetch weather data for ${city.name}. Please check your connection and try again.`);
      } finally {
        setLoading(false);
      }
    },
    [saveRecentSearch]
  );

  // ONLY triggered when user clicks the "My Location" button
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const locInfo = await reverseGeocode(lat, lon);
          await loadWeather(
            {
              name: locInfo.name,
              country: locInfo.country,
              latitude: lat,
              longitude: lon,
              timezone: 'auto',
              isCurrentLocation: true,
            },
            true
          );
        } catch {
          setError('Failed to fetch weather for your current location.');
          setLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or error:', err.message);
        setError('Location permission denied or unavailable. Showing current city.');
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [loadWeather]);

  // Initial load: Only load default city (London). Geolocation is NOT queried until user clicks.
  useEffect(() => {
    let active = true;

    async function initialLoad() {
      try {
        const data = await fetchWeatherData(
          currentCity.latitude,
          currentCity.longitude,
          currentCity.timezone || 'auto'
        );
        if (active) {
          setWeatherData(data);
          setCurrentCity((prev) => ({
            ...prev,
            timezone: data.timezone || prev.timezone,
            isCurrentLocation: false,
          }));
          setLoading(false);
          saveRecentSearch(currentCity);
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError('Unable to load weather. Please try searching for a city.');
          setLoading(false);
        }
      }
    }

    initialLoad();

    return () => {
      active = false;
    };
  }, [currentCity, saveRecentSearch]);

  return {
    currentCity,
    weatherData,
    loading,
    error,
    unit,
    toggleUnit,
    reducedMotion,
    toggleMotion,
    recentSearches,
    removeRecentSearch,
    clearRecentSearches,
    loadWeather,
    detectLocation,
    searchCities,
  };
}
