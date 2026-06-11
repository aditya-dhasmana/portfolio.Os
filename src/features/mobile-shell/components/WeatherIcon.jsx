import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";

const ICONS = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

const WeatherIcon = ({ type = "cloud-sun", size = 28, className = "" }) => {
  const Icon = ICONS[type] || CloudSun;
  return <Icon size={size} className={className} strokeWidth={1.8} />;
};

export default WeatherIcon;
