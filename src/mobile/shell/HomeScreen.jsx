import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";

import WeatherIcon from "../components/WeatherIcon";
import { dockApps, getMobileApp, homeApps } from "../data/apps";
import { useTodos } from "../data/todos";
import { useWeather } from "../data/weather";
import AppIcon from "./AppIcon";
import StatusBar from "./StatusBar";

const HomeScreen = ({ onOpenApp }) => {
  const [now, setNow] = useState(() => dayjs());
  const { todos, stats } = useTodos();
  const { weather, status } = useWeather();

  useEffect(() => {
    const interval = window.setInterval(() => setNow(dayjs()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const openWeather = () => onOpenApp(getMobileApp("weather"));
  const openTodo = () => onOpenApp(getMobileApp("todo"));

  return (
    <section className="mobile-home">
      <div className="mobile-wallpaper" />
      <div className="mobile-home-content">
        <StatusBar />
        <div className="dynamic-island" aria-hidden="true" />

        <section className="mobile-clock-card">
          <p>{now.format("dddd, D MMMM")}</p>
          <h1>{now.format("HH:mm")}</h1>
        </section>

        <section className="mobile-widget-grid" aria-label="Home widgets">
          <button type="button" className="mobile-widget todo-widget" onClick={openTodo}>
            <span className="widget-kicker">
              <CheckCircle2 size={14} />
              Today
            </span>
            <strong>{stats.active} left</strong>
            <ul>
              {todos.slice(0, 3).map((todo) => (
                <li key={todo.id} className={todo.completed ? "done" : ""}>
                  {todo.text}
                </li>
              ))}
            </ul>
          </button>

          <button
            type="button"
            className={`mobile-widget weather-widget weather-${weather?.tone || "cloudy"}`}
            onClick={openWeather}
          >
            <div className="weather-widget-top">
              <div className="weather-widget-left">
                <span>{weather?.location || "Local Weather"}</span>
                <strong>
                  {weather ? weather.temperature : status === "loading" ? "--" : "NA"}
                  {weather && <small>&deg;</small>}
                </strong>
                {weather && (
                  <p>
                    H:{weather.high}&deg; L:{weather.low}&deg;
                  </p>
                )}
              </div>
              <div className="weather-widget-right">
                <WeatherIcon type={weather?.icon} size={46} />
                <p>{weather?.condition || "Tap for forecast"}</p>
              </div>
            </div>
            <div className="weather-widget-forecast">
              {(weather?.hourly || []).slice(0, 5).map((item) => (
                <span key={item.time}>
                  <small>{dayjs(item.time).format("ha")}</small>
                  <WeatherIcon type={item.icon} size={18} />
                  <b>{item.temperature}&deg;</b>
                </span>
              ))}
            </div>
          </button>
        </section>

        <div className="mobile-app-grid">
          {homeApps.map((app) => (
            <AppIcon key={app.id} app={app} onOpenApp={onOpenApp} />
          ))}
        </div>

        <button type="button" className="mobile-search-pill" aria-label="Search">
          <Search size={15} />
          <span>Search</span>
        </button>

        <nav className="mobile-dock" aria-label="Mobile dock">
          {dockApps.map((app) => (
            <AppIcon key={app.id} app={app} onOpenApp={onOpenApp} />
          ))}
        </nav>
      </div>
    </section>
  );
};

export default HomeScreen;
