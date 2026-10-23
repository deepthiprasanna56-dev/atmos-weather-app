/**
 * Helper formatting utilities for temperature, units, dates, and times
 */

export function convertTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius, unit = 'C') {
  const value = convertTemp(celsius, unit);
  if (value === '--') return '--°';
  return `${value}°${unit}`;
}

export function formatWindSpeed(kmh, unit = 'C') {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'F') {
    // Convert to mph
    const mph = (kmh * 0.621371).toFixed(1);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatVisibility(meters, unit = 'C') {
  if (meters === null || meters === undefined || isNaN(meters)) return '10+ km';
  if (unit === 'F') {
    // Convert to miles
    const miles = (meters / 1609.34).toFixed(1);
    return `${miles} mi`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

export function formatPressure(hPa) {
  if (hPa === null || hPa === undefined || isNaN(hPa)) return '--';
  return `${Math.round(hPa)} hPa`;
}

export function formatLocalTime(dateStrOrObj, timezone = 'UTC') {
  try {
    const date = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj;
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return '--:--';
  }
}

export function formatLocalDate(dateStrOrObj, timezone = 'UTC') {
  try {
    const date = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj;
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

export function formatDayOfWeek(dateStr, timezone = 'UTC', isToday = false) {
  if (isToday) return 'Today';
  try {
    // dateStr in "YYYY-MM-DD"
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function getUVInfo(uvIndex) {
  if (uvIndex === null || uvIndex === undefined || isNaN(uvIndex)) {
    return { level: 'Low', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  }
  const val = Math.round(uvIndex);
  if (val <= 2) return { level: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  if (val <= 5) return { level: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10' };
  if (val <= 7) return { level: 'High', color: 'text-orange-500', bg: 'bg-orange-500/10' };
  if (val <= 10) return { level: 'Very High', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  return { level: 'Extreme', color: 'text-purple-500', bg: 'bg-purple-500/10' };
}

export function getWindDirection(deg) {
  if (deg === null || deg === undefined) return '';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((deg % 360) / 45) % 8;
  return directions[index];
}
