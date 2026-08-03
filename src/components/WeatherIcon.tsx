import React from 'react';
import * as Icons from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  // Map custom icon names safely to Lucide icons
  const iconMap: Record<string, React.ElementType> = {
    Sun: Icons.Sun,
    SunDim: Icons.SunDim,
    SunMedium: Icons.SunMedium,
    CloudSun: Icons.CloudSun,
    Cloud: Icons.Cloud,
    CloudRain: Icons.CloudRain,
    CloudDrizzle: Icons.CloudDrizzle,
    CloudSnow: Icons.CloudSnow,
    CloudLightning: Icons.CloudLightning,
    CloudFog: Icons.CloudFog,
    Umbrella: Icons.Umbrella,
    Wind: Icons.Wind,
    Flame: Icons.Flame,
    Snowflake: Icons.Snowflake,
    Droplets: Icons.Droplets,
    Activity: Icons.Activity,
    Sparkles: Icons.Sparkles,
    Compass: Icons.Compass,
    Eye: Icons.Eye,
    Gauge: Icons.Gauge,
    Sunrise: Icons.Sunrise,
    Sunset: Icons.Sunset,
    Thermometer: Icons.Thermometer,
    MapPin: Icons.MapPin,
    Navigation: Icons.Navigation,
    Search: Icons.Search,
    RefreshCw: Icons.RefreshCw,
    AlertTriangle: Icons.AlertTriangle,
    CheckCircle2: Icons.CheckCircle2,
    Info: Icons.Info,
    Shirt: Icons.Shirt,
    Calendar: Icons.Calendar,
    Clock: Icons.Clock,
  };

  const IconComponent = iconMap[name] || Icons.Cloud;

  return <IconComponent className={className} size={size} />;
};
