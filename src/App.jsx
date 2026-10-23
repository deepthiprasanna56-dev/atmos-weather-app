import CurrentWeather from './components/CurrentWeather';
import DailyForecast from './components/DailyForecast';
import ErrorAlert from './components/ErrorAlert';
import Footer from './components/Footer';
import HourlyForecast from './components/HourlyForecast';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import SkeletonLoader from './components/SkeletonLoader';
import WeatherBackgroundCanvas from './components/WeatherBackgroundCanvas';
import WeatherMetricsGrid from './components/WeatherMetricsGrid';
import { useTheme } from './hooks/useTheme';
import { useWeather } from './hooks/useWeather';
import { getWeatherDetails } from './utils/weatherCodes';

export default function App() {
  const {
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
  } = useWeather();

  const { toggleTheme, isDark } = useTheme();

  // Resolve condition and background styling based on live weather & day/night
  const weatherDetails = weatherData?.current
    ? getWeatherDetails(weatherData.current.weatherCode, weatherData.current.isDay)
    : {
        particle: 'sun',
        gradient: 'from-sky-400 via-sky-300 to-indigo-400',
      };

  return (
    <div className="relative min-h-screen text-slate-900 transition-colors duration-700 selection:bg-sky-500 selection:text-white dark:text-slate-100">
      {/* Dynamic Animated Background Gradient */}
      <div
        className={`fixed inset-0 -z-10 bg-gradient-to-br transition-all duration-1000 ${
          isDark
            ? 'from-slate-950 via-slate-900 to-slate-950'
            : weatherDetails.gradient || 'from-sky-100 via-slate-50 to-indigo-100'
        }`}
      />

      {/* Dynamic Weather Particle Canvas (Rain, Snow, Sun, Clouds, Stars, Thunder) */}
      <WeatherBackgroundCanvas
        particleType={weatherDetails.particle}
        reducedMotion={reducedMotion}
      />

      {/* Glassmorphic Ambient Mesh Overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      {/* Main Content Layout */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between">
        {/* Navigation Bar */}
        <Navbar
          unit={unit}
          toggleUnit={toggleUnit}
          toggleTheme={toggleTheme}
          isDark={isDark}
          reducedMotion={reducedMotion}
          toggleMotion={toggleMotion}
          onDetectLocation={detectLocation}
          loadingLocation={loading}
        />

        {/* Core Dashboard Content */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="space-y-6 sm:space-y-8">
            {/* Search Functionality & City Suggestions */}
            <section aria-label="Search city weather">
              <SearchBar
                onSelectCity={loadWeather}
                searchCities={searchCities}
                recentSearches={recentSearches}
                onRemoveRecentSearch={removeRecentSearch}
                onClearRecentSearches={clearRecentSearches}
                currentCityName={currentCity?.name}
              />
            </section>

            {/* Error State with Recovery Options */}
            {error && (
              <section aria-label="Error announcement" className="animate-fade-in-up">
                <ErrorAlert
                  message={error}
                  onRetry={() => loadWeather(currentCity)}
                  onSelectPopular={(city) => loadWeather(city)}
                />
              </section>
            )}

            {/* Loading Skeletons */}
            {loading && !weatherData && <SkeletonLoader />}

            {/* Weather Dashboard Elements */}
            {weatherData && (
              <div
                className={`space-y-6 sm:space-y-8 transition-opacity duration-500 ${
                  loading ? 'opacity-60' : 'opacity-100 animate-fade-in-up'
                }`}
              >
                {/* 1. Hero Weather Card */}
                <section aria-label="Current Weather Overview">
                  <CurrentWeather
                    city={currentCity}
                    weather={weatherData}
                    unit={unit}
                  />
                </section>

                {/* 2. Key Meteorological Metrics Grid (Humidity, Wind, Pressure, Visibility, UV, Sunrise/Sunset) */}
                <section aria-label="Meteorological Metrics">
                  <WeatherMetricsGrid
                    weather={weatherData}
                    unit={unit}
                  />
                </section>

                {/* 3. Weather Forecast: 24-Hour Hourly Forecast */}
                <section aria-label="Hourly Weather Forecast">
                  <HourlyForecast
                    hourly={weatherData.hourly}
                    timezone={weatherData.timezone}
                    unit={unit}
                  />
                </section>

                {/* 4. Weather Forecast: 7-Day Daily Forecast */}
                <section aria-label="7-Day Weekly Forecast">
                  <DailyForecast
                    daily={weatherData.daily}
                    timezone={weatherData.timezone}
                    unit={unit}
                  />
                </section>
              </div>
            )}
          </div>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </div>
  );
}
