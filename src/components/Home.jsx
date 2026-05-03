import React, { useMemo, useRef } from 'react';
import { locations } from '#constants';
import clsx from 'clsx';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/all';
import { useLocationStore, useWindowStore } from '#store';

gsap.registerPlugin(Draggable);

const projects = locations.work?.children ?? [];

/* =========================================
   AUTO DESKTOP POSITIONING
========================================= */

const generateDesktopPositions = (items) => {
  const COLUMN_WIDTH = 150;

  const ROW_HEIGHT = 140;

  // START FROM VERY TOP LEFT
  const START_X = 20;

  const START_Y = 20;

  // leave space for dock at bottom
  const usableHeight = window.innerHeight - 220;

  const maxRows = Math.max(
    1,
    Math.floor(usableHeight / ROW_HEIGHT)
  );

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

  const { setActiveLocation } = useLocationStore();

  const { openWindow, windows } = useWindowStore();

  const positionedProjects = useMemo(() => {
    return generateDesktopPositions(projects);
  }, []);

  const handleOpenProjectFinder = (project) => {
    setActiveLocation(project);

    openWindow('finder');
  };

  const isWindowOpen = Object.values(windows || {}).some(
    (w) => w?.isOpen
  );

  /* =========================================
     GSAP DRAGGABLE
  ========================================= */

useGSAP(() => {
  if (isWindowOpen) return;

  const instances = Draggable.create('.folder', {
    bounds: containerRef.current,

    dragClickables: true,

    inertia: false,

    minimumMovement: 0,

    cursor: 'default',

    activeCursor: 'default',

    edgeResistance: 0,

    dragResistance: 0,

    allowNativeTouchScrolling: false,

    onPress() {
      this.target.style.zIndex = 50;

      // 🔥 instant scale (NO animation)
      gsap.set(this.target, {
        scale: 1.03,
      });
    },

    onRelease() {
      this.target.style.zIndex = 1;

      // 🔥 instant reset
      gsap.set(this.target, {
        scale: 1,
      });
    },
  });

  return () => {
    instances.forEach((inst) => inst.kill());
  };
}, [isWindowOpen]);

  return (
    <section
      id="home"
      ref={containerRef}
      className={clsx({
        'desktop-inactive': isWindowOpen,
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
            }}
            onDoubleClick={() =>
              handleOpenProjectFinder(project)
            }
          >
            <img
              src="/images/folder.png"
              alt={project.name}
              draggable={false}
              className="w-16 h-16 object-contain"
            />

            <p>
              {project.name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;