import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import {
  Navbar,
  Welcome,
  Dock,
  Home,
  ErrorBoundary,
} from "#components/Index";

import {
  Finder,
  Resume,
  Safari,
  Terminal,
  TextWindow,
  ImageWindow,
  ContactWindow,
  Gallery,
  VsCode,
} from "#windows";

import MobileApp from "./mobile/MobileApp";
import IntroLoader from "./components/IntroLoader";
import { buildWorkLocation } from "./utils/buildWorkLocation";
import { useLocationStore } from "#store";

import { gsap } from "gsap";
import Draggable from "gsap/src/Draggable";
import useWindowStore from "#store/window";

gsap.registerPlugin(Draggable);

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { windows } = useWindowStore();
  const { setActiveLocation } = useLocationStore();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const preload = async () => {
      // Build the root Work folder once
      const work = await buildWorkLocation();

      // Save a stable copy globally so Home.jsx can always
      // render the same desktop folders.
      window.__WORK_DATA__ = work;

      // Set Finder's initial location
      setActiveLocation(work);

      // Show intro loader, then reveal app
      setTimeout(() => setIsReady(true), 2200);
    };

    preload();
  }, [setActiveLocation]);

  if (!isReady) return <IntroLoader />;

  // Mobile version is completely isolated
  if (isMobile) {
    return (
      <ErrorBoundary>
        <MobileApp />
      </ErrorBoundary>
    );
  }

  const desktopRenderWindow = (Component, id) => {
    const win = windows[id];

    if (!win?.isOpen || win?.isMinimized) {
      return null;
    }

    return <Component key={id} windowId={id} />;
  };

  return (
    <ErrorBoundary>
      <main className="relative overflow-hidden">
        <Navbar />
        <Welcome />
        <Dock />

        <ErrorBoundary>
          <div className="window-layer">
            {desktopRenderWindow(Terminal, "terminal")}
            {desktopRenderWindow(Safari, "safari")}
            {desktopRenderWindow(Resume, "resume")}
            {desktopRenderWindow(Finder, "finder")}
            {desktopRenderWindow(TextWindow, "txtfile")}
            {desktopRenderWindow(ImageWindow, "imgfile")}
            {desktopRenderWindow(ContactWindow, "contact")}
            {desktopRenderWindow(Gallery, "photos")}
            {desktopRenderWindow(VsCode, "vsCode")}
          </div>
        </ErrorBoundary>

        <Home />
      </main>
    </ErrorBoundary>
  );
};

export default App;