import React from 'react';
import {
  Sun,
  Moon,
  SunMedium,
  MoonStar,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  LucideProps,
} from 'lucide-react';
import { getWeatherCondition } from '../utils/weatherUtils';

interface WeatherIconProps extends LucideProps {
  code: number;
  isDay?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay = true, className = '', ...props }) => {
  const condition = getWeatherCondition(code, isDay);

  switch (condition.iconName) {
    case 'Sun':
      return <Sun className={`${condition.accentColor} ${className}`} {...props} />;
    case 'Moon':
      return <Moon className={`${condition.accentColor} ${className}`} {...props} />;
    case 'SunMedium':
      return <SunMedium className={`${condition.accentColor} ${className}`} {...props} />;
    case 'MoonStar':
      return <MoonStar className={`${condition.accentColor} ${className}`} {...props} />;
    case 'CloudSun':
      return <CloudSun className={`${condition.accentColor} ${className}`} {...props} />;
    case 'CloudMoon':
      return <CloudMoon className={`${condition.accentColor} ${className}`} {...props} />;
    case 'Cloud':
      return <Cloud className={`${condition.accentColor} ${className}`} {...props} />;
    case 'CloudFog':
      return <CloudFog className={`${condition.accentColor} ${className}`} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${condition.accentColor} ${className}`} {...props} />;
    case 'CloudRain':
      return <CloudRain className={`${condition.accentColor} ${className}`} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={`${condition.accentColor} ${className}`} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={`${condition.accentColor} ${className}`} {...props} />;
    case 'Snowflake':
      return <Snowflake className={`${condition.accentColor} ${className}`} {...props} />;
    default:
      return <CloudSun className={`${condition.accentColor} ${className}`} {...props} />;
  }
};
