/**
 * PURPOSE:
 * Compose the Macfolio application.
 * RESPONSIBILITY:
 * Load portfolio data, choose desktop or mobile shell, and render desktop window registrations.
 * USED BY:
 * src/main.jsx.
 * DEPENDS ON:
 * Portfolio data hook, desktop shell, mobile shell, desktop windows, and app-level error/loading components.
 * SHOULD NOT HANDLE:
 * Feature internals, GitHub API details, window mechanics, or mobile app screen logic.
 * SCALING NOTES:
 * Add providers or app-level routing here when needed, but keep feature behavior inside feature folders.
 */

import React, { lazy, Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import { ErrorBoundary } from "#components/Index";

import IntroLoader from "../components/IntroLoader";
import { usePortfolioFileSystem } from "../features/portfolio/hooks/usePortfolioFileSystem";
import Dock from "../features/desktop-shell/components/Dock";
import Home from "../features/desktop-shell/components/Home";
import Navbar from "../features/desktop-shell/components/Navbar";
import useWindowStore from "../features/desktop-shell/store/windowStore";
import { useLocationStore } from "#store";

const Terminal = lazy(() => import("../windows/Terminal"));
const Safari = lazy(() => import("../windows/Safari"));
const Resume = lazy(() => import("../windows/Resume"));
const Finder = lazy(() => import("../windows/Finder"));
const TextWindow = lazy(() => import("../windows/TextApp"));
const ImageWindow = lazy(() => import("../windows/ImageApp"));
const ContactWindow = lazy(() => import("../windows/Contact"));
const Gallery = lazy(() => import("../windows/Gallery"));
const VsCode = lazy(() => import("../windows/VsCode"));
const MobileApp = lazy(() => import("../features/mobile-shell/MobileApp"));
const Welcome = lazy(() => import("../components/Welcome"));

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { windows } = useWindowStore();
  const { resetNavigation } = useLocationStore();
  const { loadPortfolioFileSystem } = usePortfolioFileSystem();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isAlive = true;
    let readyTimer = null;

    const preload = async () => {
      try {
        const work = await loadPortfolioFileSystem();

        if (isAlive) {
          resetNavigation(work);
        }
      } catch {
        // The portfolio hook owns error state; startup must not leak a rejected promise.
      } finally {
        readyTimer = setTimeout(() => {
          if (isAlive) {
            setIsReady(true);
          }
        }, 2200);
      }
    };

    preload();

    return () => {
      isAlive = false;
      if (readyTimer) {
        clearTimeout(readyTimer);
      }
    };
  }, [loadPortfolioFileSystem, resetNavigation]);

  if (!isReady) return <IntroLoader />;

  if (isMobile) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<IntroLoader />}>
          <MobileApp />
        </Suspense>
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
        <Suspense fallback={null}>
          <Welcome />
        </Suspense>
        <Dock />

        <ErrorBoundary>
          <Suspense fallback={null}>
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
          </Suspense>
        </ErrorBoundary>

        <Home />
      </main>
    </ErrorBoundary>
  );
};

export default App;
