import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Moon,
  Snowflake,
  Sun,
  SunDim,
  Wind,
} from 'lucide-react';

const ICON_MAP = {
  Sun,
  SunDim,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSunRain,
  CloudMoonRain,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind,
};

export default function WeatherIcon({ name = 'Sun', className = 'w-8 h-8', ...props }) {
  const IconComponent = ICON_MAP[name] || Sun;

  return (
    <IconComponent
      className={`transition-transform duration-300 ${className}`}
      {...props}
    />
  );
}
