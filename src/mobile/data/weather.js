import { useEffect, useState } from "react";

const FALLBACK_LOCATION = {
  name: "New Delhi",
  latitude: 28.6139,
  longitude: 77.209,
};

const WEATHER_CODES = {
  0: { label: "Sunny", tone: "sunny", icon: "sun" },
  1: { label: "Mostly Sunny", tone: "sunny", icon: "sun" },
  2: { label: "Partly Cloudy", tone: "cloudy", icon: "cloud-sun" },
  3: { label: "Cloudy", tone: "cloudy", icon: "cloud" },
  45: { label: "Foggy", tone: "fog", icon: "fog" },
  48: { label: "Foggy", tone: "fog", icon: "fog" },
  51: { label: "Drizzle", tone: "rain", icon: "rain" },
  53: { label: "Drizzle", tone: "rain", icon: "rain" },
  55: { label: "Heavy Drizzle", tone: "rain", icon: "rain" },
  61: { label: "Light Rain", tone: "rain", icon: "rain" },
  63: { label: "Rain", tone: "rain", icon: "rain" },
  65: { label: "Heavy Rain", tone: "rain", icon: "rain" },
  71: { label: "Light Snow", tone: "snow", icon: "snow" },
  73: { label: "Snow", tone: "snow", icon: "snow" },
  75: { label: "Heavy Snow", tone: "snow", icon: "snow" },
  80: { label: "Showers", tone: "rain", icon: "rain" },
  81: { label: "Showers", tone: "rain", icon: "rain" },
  82: { label: "Heavy Showers", tone: "rain", icon: "rain" },
  95: { label: "Thunderstorm", tone: "storm", icon: "storm" },
};

const round = (value) => Math.round(Number(value));
const getCondition = (code) => WEATHER_CODES[code] || WEATHER_CODES[0];

const getBrowserLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(FALLBACK_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          name: FALLBACK_LOCATION.name,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => resolve(FALLBACK_LOCATION),
      { enableHighAccuracy: false, timeout: 4500, maximumAge: 1000 * 60 * 20 }
    );
  });

const resolvePlaceName = async (location) => {
  if (location.name !== FALLBACK_LOCATION.name) return location.name;

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    localityLanguage: "en",
  });

  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`
    );
    if (!response.ok) throw new Error("Reverse geocoding failed");
    const data = await response.json();
    const primary =
      data.locality ||
      data.localityInfo?.administrative?.find((item) => item.adminLevel >= 8)?.name ||
      data.city ||
      data.principalSubdivision ||
      FALLBACK_LOCATION.name;
    const secondary =
      primary !== data.city ? data.city : data.principalSubdivision;

    return [primary, secondary].filter(Boolean).slice(0, 2).join(", ");
  } catch {
    return FALLBACK_LOCATION.name;
  }
};

const buildForecast = (hourly) => {
  const times = hourly.time || [];
  const now = Date.now();
  const startIndex = times.findIndex((time) => new Date(time).getTime() > now);
  const first = startIndex >= 0 ? startIndex : 0;
  const forecast = [];

  for (let index = first; index < times.length && forecast.length < 5; index += 2) {
    const code = hourly.weather_code?.[index] ?? 0;
    forecast.push({
      time: times[index],
      temperature: round(hourly.temperature_2m?.[index]),
      code,
      ...getCondition(code),
    });
  }

  return forecast;
};

const normalizeWeather = (payload, location) => {
  const current = payload.current || {};
  const daily = payload.daily || {};
  const hourly = payload.hourly || {};
  const code = current.weather_code ?? 0;
  const condition = getCondition(code);

  return {
    location: location.name,
    temperature: round(current.temperature_2m),
    condition: condition.label,
    tone: condition.tone,
    icon: condition.icon,
    high: round(daily.temperature_2m_max?.[0]),
    low: round(daily.temperature_2m_min?.[0]),
    humidity: round(current.relative_humidity_2m),
    wind: round(current.wind_speed_10m),
    hourly: buildForecast(hourly),
  };
};

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;

    const loadWeather = async () => {
      setStatus("loading");
      const location = await getBrowserLocation();
      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
        hourly: "temperature_2m,weather_code",
        daily: "temperature_2m_max,temperature_2m_min",
        forecast_days: "2",
        timezone: "auto",
      });

      try {
        const placeName = await resolvePlaceName(location);
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        if (!response.ok) throw new Error("Weather request failed");
        const payload = await response.json();
        if (!alive) return;
        setWeather(normalizeWeather(payload, { ...location, name: placeName }));
        setStatus("ready");
      } catch {
        if (!alive) return;
        setWeather(null);
        setStatus("error");
      }
    };

    loadWeather();

    return () => {
      alive = false;
    };
  }, []);

  return { weather, status };
};
