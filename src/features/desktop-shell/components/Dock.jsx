/**
 * PURPOSE:
 * Render the desktop application dock.
 * RESPONSIBILITY:
 * Display desktop apps, animate dock icons, and route dock clicks to window actions.
 * USED BY:
 * Desktop shell composition in App.
 * DEPENDS ON:
 * Desktop app config, window store, GSAP, tooltip UI, and OptimizedImage.
 * SHOULD NOT HANDLE:
 * Window rendering, portfolio data loading, mobile navigation, or app internals.
 * SCALING NOTES:
 * Dock-specific behavior should stay here. Shared window behavior belongs in the window store.
 */

import React, { useRef } from "react";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { dockApps } from "../../../constants";
import OptimizedImage from "../../../components/OptimizedImage";
import useWindowStore from "../store/windowStore";

const Dock = () => {
  const { openWindow, restoreWindow, focusWindow, windows } =
    useWindowStore();

  const dockRef = useRef(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = dock.querySelectorAll(".dock-icon");

    const animateIcons = (mouseX) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2) / 12000);

        gsap.to(icon, {
          scale: 1 + 0.18 * intensity,
          y: -10 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (event) => {
      const { left } = dock.getBoundingClientRect();
      animateIcons(event.clientX - left);
    };

    const resetIcons = () => {
      icons.forEach((icon) =>
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        })
      );
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  const toggleApp = (id, canOpen = true) => {
    if (!canOpen) return;

    const win = windows?.[id];
    if (!win) return;

    if (!win.isOpen) {
      openWindow?.(id);
      focusWindow?.(id);
      return;
    }

    if (win.isMinimized) {
      restoreWindow?.(id);
      focusWindow?.(id);
      return;
    }

    focusWindow?.(id);
  };

  return (
    <section id="dock" role="toolbar" aria-label="Application dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={name}
              aria-pressed={windows?.[id]?.isOpen || false}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleApp(id, canOpen)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleApp(id, canOpen);
                }
              }}
            >
              <OptimizedImage
                src={`/images/${icon}`}
                alt={name}
                className={`object-cover object-center ${
                  canOpen ? "" : "opacity-60"
                }`}
              />
            </button>

            {windows?.[id]?.isOpen && (
              <span className="dock-active-dot" aria-hidden="true" />
            )}
          </div>
        ))}

        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
