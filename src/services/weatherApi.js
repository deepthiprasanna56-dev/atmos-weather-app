/**
 * Weather and Geocoding Service using Open-Meteo
 * Free, real-time, no API key required
 */

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search cities by query text
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.results || !data.results.length) return [];

    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
    }));
  } catch (error) {
    console.error('Failed to search cities:', error);
    throw error;
  }
}

/**
 * Reverse geocode latitude and longitude to get city name
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    });
    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const cityName =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.suburb ||
        addr.county ||
        'Current Location';
      const country = addr.country || '';
      const admin1 = addr.state || '';
      return {
        name: cityName,
        country,
        admin1,
        latitude,
        longitude,
      };
    }
  } catch (e) {
    console.warn('Reverse geocoding error:', e);
  }

  return {
    name: 'Current Location',
    country: '',
    admin1: '',
    latitude,
    longitude,
  };
}

/**
 * Fetch full weather data (current, 24-hr hourly, 7-day daily)
 */
export async function fetchWeatherData(latitude, longitude, timezone = 'auto') {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'visibility',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'weather_code',
    'precipitation_probability',
    'wind_speed_10m',
    'is_day',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'sunrise',
    'sunset',
    'precipitation_probability_max',
    'uv_index_max',
  ].join(',');

  const url = `${FORECAST_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=${encodeURIComponent(timezone)}&forecast_days=7`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather fetch failed: ${response.statusText}`);
    }
    const data = await response.json();

    // Process hourly: take 24 hours starting from current hour
    const currentHourIso = data.current.time.slice(0, 13);
    const hourlyTimes = data.hourly.time || [];
    let startIndex = hourlyTimes.findIndex((t) => t.startsWith(currentHourIso));
    if (startIndex === -1) startIndex = 0;

    const hourly = [];
    const maxHours = Math.min(24, hourlyTimes.length - startIndex);
    for (let i = 0; i < maxHours; i++) {
      const idx = startIndex + i;
      hourly.push({
        time: hourlyTimes[idx],
        temperature: data.hourly.temperature_2m[idx],
        humidity: data.hourly.relative_humidity_2m[idx],
        weatherCode: data.hourly.weather_code[idx],
        precipitationProbability: data.hourly.precipitation_probability[idx] || 0,
        windSpeed: data.hourly.wind_speed_10m[idx],
        isDay: data.hourly.is_day ? data.hourly.is_day[idx] : 1,
      });
    }

    // Process daily (7 days)
    const daily = [];
    const dailyTimes = data.daily.time || [];
    for (let i = 0; i < dailyTimes.length; i++) {
      daily.push({
        date: dailyTimes[i],
        weatherCode: data.daily.weather_code[i],
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        sunrise: data.daily.sunrise[i],
        sunset: data.daily.sunset[i],
        precipitationProbability: data.daily.precipitation_probability_max[i] || 0,
        uvIndex: data.daily.uv_index_max[i] ?? 0,
      });
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      current: {
        time: data.current.time,
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        surfacePressure: data.current.surface_pressure,
        visibility: data.current.visibility,
        precipitation: data.current.precipitation,
        isDay: data.current.is_day,
      },
      today: daily[0] || null,
      hourly,
      daily,
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
}
