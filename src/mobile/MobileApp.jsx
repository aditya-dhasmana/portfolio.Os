import { useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";

import { getMobileApp } from "./data/apps";
import { AppFrame, HomeScreen } from "./shell";
import {
  AboutApp,
  ArticlesApp,
  CodeApp,
  ContactApp,
  GalleryApp,
  ProjectsApp,
  ResumeApp,
  SkillsApp,
  TodoApp,
  WeatherApp,
} from "./apps";
import "./styles.css";

const APP_COMPONENTS = {
  about: AboutApp,
  projects: ProjectsApp,
  skills: SkillsApp,
  articles: ArticlesApp,
  github: CodeApp,
  code: CodeApp,
  weather: WeatherApp,
  todo: TodoApp,
  resume: ResumeApp,
  gallery: GalleryApp,
  contact: ContactApp,
};

const MobileApp = () => {
  const [stack, setStack] = useState([]);

  const activeRoute = stack[stack.length - 1] || null;
  const activeApp = activeRoute ? getMobileApp(activeRoute.id) : null;
  const ActiveComponent = activeApp ? APP_COMPONENTS[activeApp.id] : null;

  const openApp = (app) => {
    if (!app) return;
    const resolvedApp = getMobileApp(app.appId || app.id);
    if (!resolvedApp) return;

    setStack((current) => [
      ...current,
      {
        id: resolvedApp.id,
        title: resolvedApp.title || resolvedApp.name,
        key: `${resolvedApp.id}-${Date.now()}`,
      },
    ]);
  };

  const goBack = () => {
    setStack((current) => current.slice(0, -1));
  };

  return (
    <main className="mobile-root" aria-label="Aditya portfolio mobile experience">
      <HomeScreen onOpenApp={openApp} />

      <AnimatePresence>
        {activeRoute && activeApp && ActiveComponent && (
          <Motion.div
            key={activeRoute.key}
            className="mobile-screen-layer"
            initial={{ x: "100%", opacity: 0.85, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: "100%", opacity: 0.4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <AppFrame title={activeRoute.title} icon={activeApp.icon} onBack={goBack}>
              <ActiveComponent mode={activeApp.id === "github" ? "github" : "code"} openApp={openApp} />
            </AppFrame>
          </Motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MobileApp;
