/**
 * PURPOSE:
 * Render desktop icons on the simulated desktop.
 * RESPONSIBILITY:
 * Position project folders, allow folder dragging, and open Finder to a selected project.
 * USED BY:
 * Desktop shell composition in App.
 * DEPENDS ON:
 * Portfolio data store, Finder location store, desktop window store, GSAP draggable behavior.
 * SHOULD NOT HANDLE:
 * Loading portfolio data, rendering Finder contents, mobile shell UI, or window internals.
 * SCALING NOTES:
 * If desktop icons gain selection or context menus, keep that behavior local to this shell component.
 */

import React, { useMemo, useRef, useEffect } from "react";
import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/all";

import { useDataStore, useLocationStore } from "#store";
import useWindowStore from "../store/windowStore";

gsap.registerPlugin(Draggable);

const generateDesktopPositions = (items) => {
  const COLUMN_WIDTH = 118;
  const ROW_HEIGHT = 112;
  const START_X = 20;
  const START_Y = 72;

  const usableHeight = window.innerHeight - 220;
  const maxRows = Math.max(1, Math.floor(usableHeight / ROW_HEIGHT));

  return items.map((item, index) => {
    const column = Math.floor(index / maxRows);
    const row = index % maxRows;

    return {
      ...item,
      dynamicPosition: {
        left: START_X + column * COLUMN_WIDTH,
        top: START_Y + row * ROW_HEIGHT,
      },
    };
  });
};

const Home = () => {
  const containerRef = useRef(null);

  const { navigateTo } = useLocationStore();
  const { openWindow, windows } = useWindowStore();
  const { work } = useDataStore();

  const positionedProjects = useMemo(() => {
    const projects = work?.children || [];
    return generateDesktopPositions(projects);
  }, [work]);

  const handleOpenProjectFinder = (project) => {
    navigateTo([work, project]);

    if (!windows.finder?.isOpen) {
      openWindow("finder", {
        root: project,
      });
    }
  };

  const isWindowOpen = Object.values(windows || {}).some(
    (windowState) => windowState?.isOpen && !windowState?.isMinimized
  );

  useEffect(() => {
    if (isWindowOpen) {
      gsap.set(".folder", {
        zIndex: 1,
        scale: 1,
      });
    }
  }, [isWindowOpen]);

  useGSAP(() => {
    const instances = Draggable.create(".folder", {
      bounds: containerRef.current,
      dragClickables: true,
      inertia: false,
      minimumMovement: 0,
      cursor: "default",
      activeCursor: "default",
      edgeResistance: 0,
      dragResistance: 0,
      allowNativeTouchScrolling: false,

      onPress() {
        this.target.style.zIndex = 50;
        gsap.set(this.target, { scale: 1.03 });
      },

      onRelease() {
        this.target.style.zIndex = 1;
        gsap.set(this.target, { scale: 1 });
      },
    });

    gsap.set(".folder", { zIndex: 1 });

    return () => {
      instances.forEach((instance) => instance.kill());
    };
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className={clsx("fixed inset-0 z-[1]", {
        "pointer-events-none": isWindowOpen,
      })}
    >
      <ul className="desktop-icons">
        {positionedProjects.map((project) => (
          <li
            key={project.id}
            className="group folder"
            style={{
              left: `${project.dynamicPosition.left}px`,
              top: `${project.dynamicPosition.top}px`,
              zIndex: 1,
            }}
            onDoubleClick={() => handleOpenProjectFinder(project)}
          >
            <img
              src="/images/folder.png"
              alt={project.name}
              draggable={false}
              className="w-12 h-12 object-contain"
            />

            <p>{project.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;
