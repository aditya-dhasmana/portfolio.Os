import React, { useMemo, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/all';
import { useLocationStore, useWindowStore } from '#store';

gsap.registerPlugin(Draggable);

/* =========================================
   AUTO DESKTOP POSITIONING
========================================= */
const generateDesktopPositions = (items) => {
  const COLUMN_WIDTH = 118;
  const ROW_HEIGHT = 112;
  const START_X = 20;
  const START_Y = 72;

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
    const workRoot = window.__WORK_DATA__;
    const projects = workRoot?.children || [];
    return generateDesktopPositions(projects);
  }, []);

  const handleOpenProjectFinder = (project) => {
    setActiveLocation(project);

    // Open Finder only if it's not already open
    if (!windows.finder?.isOpen) {
      openWindow('finder', {
        root: project,
      });
    }
  };

  const isWindowOpen = Object.values(windows || {}).some(
    (w) => w?.isOpen && !w?.isMinimized
  );

  // Reset folder z-index whenever a window opens
  useEffect(() => {
    if (isWindowOpen) {
      gsap.set('.folder', {
        zIndex: 1,
        scale: 1,
      });
    }
  }, [isWindowOpen]);

  useGSAP(() => {
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
        gsap.set(this.target, { scale: 1.03 });
      },

      onRelease() {
        // Keep folder above other icons but below windows
        this.target.style.zIndex = 1;
        gsap.set(this.target, { scale: 1 });
      },
    });

    // Ensure all folders start with low z-index
    gsap.set('.folder', { zIndex: 1 });

    return () => {
      instances.forEach((inst) => inst.kill());
    };
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className={clsx(
        'fixed inset-0 z-[1]',
        {
          'pointer-events-none': isWindowOpen,
        }
      )}
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
            onDoubleClick={() =>
              handleOpenProjectFinder(project)
            }
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
