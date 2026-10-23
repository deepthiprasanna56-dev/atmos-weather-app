# 🌦️ Atmos — Modern Weather Intelligence Application

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

A responsive, high-performance **Weather Intelligence Dashboard** built with **React, Vite, and Tailwind CSS**. Powered by real-time meteorological sensor feeds, Atmos provides live weather data, 24-hour hourly forecasts, 7-day extended forecasts, and canvas-rendered weather animations that adapt dynamically to environmental conditions.

---

## ✨ Features

### 1. 🌤️ Home & Real-time Weather Dashboard
- **Location Detection**: Instant geolocation lookup via HTML5 `navigator.geolocation` with reverse-geocoded city naming and sensible default fallback.
- **Dynamic Live Clock**: Real-time ticking digital clock calibrated specifically to the queried city's local timezone.
- **Current Temperature & Condition**: High-resolution temperature display with descriptive condition labels (e.g., Clear Sky, Light Drizzle, Thunderstorm).
- **Feels-Like Reading**: Apparent temperature accounting for humidity, wind chill, and radiation.
- **Meteorological Metrics Grid**:
  - 💧 **Humidity (%)**: Moisture levels with optimal comfort indicators.
  - 💨 **Wind Speed & Direction**: Real-time wind velocity in km/h or mph with 8-point compass bearing.
  - 👁️ **Visibility**: Atmospheric visibility range in kilometers or miles.
  - ⏱️ **Air Pressure (hPa)**: Barometric pressure with fair/storm indicators.
  - ☀️ **UV Index**: Live UV index with color-coded safety and risk level ratings.
  - 🌅 **Sunrise & Sunset**: Dawn and dusk timings calculated for the city's exact coordinates.

### 2. 🔍 Smart Search & Exploration
- **Real-Time Geocoding**: Search any city worldwide with instant auto-suggestions.
- **Search History (Recent Searches)**: Remembers your recently searched cities with quick-select chips and 1-click removal.
- **Featured World Capitals**: Quick-select chips for major global hubs (London, New York, Tokyo, Paris, Dubai, Sydney).
- **Debounced Input**: Smooth 320ms debouncing to minimize unnecessary network traffic.
- **Error & Empty States**: Polished alert modal with retry action and recommended cities when queries fail.

### 3. 📈 Forecast Visualizations
- **24-Hour Hourly Forecast**:
  - Horizontal interactive scrollable carousel with smooth navigation buttons.
  - Hourly timestamps, condition icons, temperatures, and precipitation probabilities.
  - Visual accent highlighting the current hour.
- **7-Day Extended Forecast**:
  - Daily outlook with weekday names and calendar dates.
  - Condition icons and rain probability percentages.
  - Visual temperature range bar demonstrating relative high/low variations across the week.

### 4. 🎨 Atmospheric Animations & Visual Effects
- **Dynamic HTML5 Canvas Effects**:
  - 🌧️ **Rain & Showers**: Angled streaks with varying velocity and splash effects.
  - ⚡ **Thunderstorm**: Darkened environment with ambient lightning pulses.
  - ❄️ **Snow & Flurries**: Floating, tumbling crystalline flakes with organic drift.
  - ☀️ **Clear Sunshine**: Radiant pulsing solar flare and warm ambient dust motes.
  - ☁️ **Clouds & Overcast**: Layered, soft drifting cloud puffs.
  - 🌫️ **Fog & Mist**: Soft horizontal atmospheric mist bands.
  - ✨ **Night Starry Sky**: Twinkling stars with periodic shooting star streaks.
- **Performance & Accessibility**:
  - 60 FPS requestAnimationFrame loop with timestamp delta.
  - **Motion Toggle Button**: Instant pause/play button in the header.
  - Respects user's OS `prefers-reduced-motion` settings.
  - Glassmorphic backdrop blur (`backdrop-blur-xl`) with smooth card hover transitions.

### 5. 📱 Responsive Layout & Theming
- **Dynamic Weather Gradients**: Sky backgrounds automatically adapt based on weather conditions and local day/night status.
- **Dark & Light Mode**: Seamless theme switching adhering to modern web guidance (`color-scheme: light dark`).
- **Fully Responsive**:
  - Mobile (320px+)
  - Tablet (768px+)
  - Laptop (1024px+)
  - Desktop (1440px+)

### 6. ⚙️ Additional Enhancements
- **°C / °F Unit Toggle**: Synchronously updates all current temperatures, hourly timelines, daily forecasts, wind speed (km/h vs mph), and visibility (km vs mi).
- **Skeleton Shimmer Loading**: Polished shimmer placeholders for zero layout shifts during data fetching.
- **Zero API Key Required**: Operates out of the box using high-accuracy Open-Meteo meteorological models.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: [Open-Meteo API](https://open-meteo.com/) (Free, open-source weather API)
- **Deployment**: [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/)

---

## 📁 Project Structure

```
atmos-weather-app/
├── public/                     # Static assets and icons
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                 # App assets
│   ├── components/             # Reusable UI Components
│   │   ├── CurrentWeather.jsx  # Hero weather card with live clock
│   │   ├── DailyForecast.jsx   # 7-day forecast cards with temp bars
│   │   ├── ErrorAlert.jsx      # Error handling & recovery state
│   │   ├── Footer.jsx          # Attribution & status
│   │   ├── HourlyForecast.jsx  # 24-hour horizontal forecast slider
│   │   ├── Navbar.jsx          # Header with units, theme, location, motion
│   │   ├── SearchBar.jsx       # Search with auto-complete & history
│   │   ├── SkeletonLoader.jsx  # Shimmer loading placeholders
│   │   ├── WeatherBackgroundCanvas.jsx # Canvas weather animations
│   │   └── WeatherIcon.jsx     # Dynamic weather icon renderer
│   ├── constants/
│   │   └── defaultCities.js    # Pre-configured popular world cities
│   ├── hooks/
│   │   ├── useTheme.js         # Theme management & persistence
│   │   └── useWeather.js       # Weather state & geolocation hook
│   ├── services/
│   │   └── weatherApi.js       # Open-Meteo API & geocoding service
│   ├── utils/
│   │   ├── formatters.js       # Unit conversion & date/time formatters
│   │   └── weatherCodes.js     # WMO code mapping to conditions & icons
│   ├── App.css                 # Clean root CSS
│   ├── App.jsx                 # Main application dashboard layout
│   ├── index.css               # Tailwind CSS v4 & glassmorphic styles
│   └── main.jsx                # React root mount
├── netlify.toml                # Netlify deployment configuration
├── vercel.json                 # Vercel deployment configuration
├── vite.config.js              # Vite bundler configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed:
```bash
node -v
npm -v
```

### Installation

1. Clone or navigate to the repository:
```bash
cd atmos-weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

4. Build for production:
```bash
npm run build
```

5. Preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Deployment Guide

### Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Atmos Weather App"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and log in.
3. Click **"Add New Project"** and import your GitHub repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **"Deploy"**. Your live URL will be ready in seconds!

### Deploying to Netlify

1. Go to [Netlify](https://app.netlify.com/) and log in.
2. Click **"Add new site"** -> **"Import an existing project"**.
3. Select your GitHub repository.
4. Netlify will detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy site"**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
