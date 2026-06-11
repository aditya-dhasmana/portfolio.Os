import dayjs from "dayjs";
import { Droplets, Loader2, MapPin, Wind } from "lucide-react";

import WeatherIcon from "../components/WeatherIcon";
import { useWeather } from "../data/weather";

const WeatherApp = () => {
  const { weather, status } = useWeather();

  if (status === "loading") {
    return (
      <div className="mobile-page weather-app">
        <div className="mobile-empty-state weather-empty">
          <Loader2 className="spin" size={28} />
          Loading local weather
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="mobile-page weather-app">
        <div className="mobile-empty-state weather-empty">Weather is unavailable right now.</div>
      </div>
    );
  }

  return (
    <div className={`mobile-page weather-app weather-${weather.tone}`}>
      <section className="weather-hero">
        <div className="weather-hero-left">
          <span>
            <MapPin size={15} />
            {weather.location}
          </span>
          <h1>
            {weather.temperature}
            <small>&deg;</small>
          </h1>
          <p>{weather.condition}</p>
        </div>
        <div className="weather-hero-right">
          <WeatherIcon type={weather.icon} size={84} />
          <strong>{weather.condition}</strong>
        </div>
      </section>

      <section className="weather-stats-grid">
        <div>
          <strong>
            {weather.high}&deg; / {weather.low}&deg;
          </strong>
          <span>High / Low</span>
        </div>
        <div>
          <strong>
            <Droplets size={17} />
            {weather.humidity}%
          </strong>
          <span>Humidity</span>
        </div>
        <div>
          <strong>
            <Wind size={17} />
            {weather.wind} km/h
          </strong>
          <span>Wind</span>
        </div>
      </section>

      <section className="weather-hourly-card">
        <h2>Hourly Forecast</h2>
        <div className="weather-hourly-row">
          {weather.hourly.map((item) => (
            <div key={item.time}>
              <span>{dayjs(item.time).format("HH:mm")}</span>
              <WeatherIcon type={item.icon} size={24} />
              <strong>{item.temperature}&deg;</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WeatherApp;
