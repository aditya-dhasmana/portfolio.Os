import useWindowStore from '#store/window';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import React, { useRef, useEffect, useLayoutEffect } from 'react';
import Draggable from 'gsap/Draggable';
import { DEFAULT_WINDOW_SIZES } from '#constants';
import clsx from 'clsx';

gsap.registerPlugin(Draggable);

const windowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const {
      focusWindow,
      windows,
      setWindowPosition,
      setWindowSize,
      setSizeMode,
    } = useWindowStore();

    const {
      isOpen,
      sizeMode,
      zIndex,
      position,
      size,
    } = windows[windowKey] || {};

    const ref = useRef(null);
    const originalSizeRef = useRef(null);
    const originalPositionRef = useRef(null);
    const prevSizeModeRef = useRef(sizeMode);

    // remember original normal state
    useEffect(() => {
      if (isOpen && sizeMode === "normal") {
        originalSizeRef.current =
          size || DEFAULT_WINDOW_SIZES[windowKey] || { width: 800, height: 600 };

        originalPositionRef.current = position || { x: 0, y: 0 };
      }
    }, [isOpen, size, position, windowKey, sizeMode]);

    // smooth maximize / restore animation
    useLayoutEffect(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      const prevMode = prevSizeModeRef.current;

      // only animate when mode actually changes
      if (prevMode !== sizeMode) {
        if (sizeMode === "full") {
          gsap.to(el, {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            borderRadius: 0,
            duration: 0.34,
            ease: "power3.inOut",
          });
        }

        if (sizeMode === "normal") {
          const restoreSize =
            originalSizeRef.current ||
            DEFAULT_WINDOW_SIZES[windowKey] ||
            { width: 800, height: 600 };

          const restorePos =
            originalPositionRef.current || { x: 0, y: 0 };

          gsap.to(el, {
            x: restorePos.x,
            y: restorePos.y,
            width: restoreSize.width,
            height: restoreSize.height,
            borderRadius: 8,
            duration: 0.34,
            ease: "power3.inOut",
          });
        }
      } else {
        // initial sync no animation
        if (sizeMode === "normal") {
          gsap.set(el, {
            x: position?.x || 0,
            y: position?.y || 0,
            width: size?.width || DEFAULT_WINDOW_SIZES[windowKey]?.width || 800,
            height: size?.height || DEFAULT_WINDOW_SIZES[windowKey]?.height || 600,
          });
        }

        if (sizeMode === "full") {
          gsap.set(el, {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            borderRadius: 0,
          });
        }
      }

      prevSizeModeRef.current = sizeMode;
    }, [position, size, isOpen, sizeMode]);

    // DRAG
    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      const header = el.querySelector("#window-header");
      if (!header) return;

      const [instance] = Draggable.create(el, {
        trigger: header,
        type: "x,y",
        cursor: "pointer",
        activeCursor: "pointer",

        onPress: function (e) {
          if (e.target.closest(".no-drag")) return;

          focusWindow(windowKey);

          // drag restore from fullscreen
          if (sizeMode === "full") {
            const rect = el.getBoundingClientRect();
            const cursorX = this.pointerX;
            const cursorY = this.pointerY;

            const cursorRelativeX = cursorX - rect.left;
            const cursorRelativeY = cursorY - rect.top;

            const originalSize =
              originalSizeRef.current ||
              DEFAULT_WINDOW_SIZES[windowKey] ||
              { width: 800, height: 600 };

            setWindowSize(windowKey, originalSize);
            setSizeMode(windowKey, "normal");

            const newX = Math.max(
              0,
              Math.min(
                cursorX - cursorRelativeX * (originalSize.width / rect.width),
                window.innerWidth - originalSize.width
              )
            );

            const newY = Math.max(
              0,
              Math.min(
                cursorY - cursorRelativeY * (originalSize.height / rect.height),
                window.innerHeight - originalSize.height
              )
            );

            setWindowPosition(windowKey, { x: newX, y: newY });

            gsap.set(el, {
              x: newX,
              y: newY,
              width: originalSize.width,
              height: originalSize.height,
            });

            this.update();
          }
        },

        onDrag: function () {
          gsap.set(el, {
            x: this.x,
            y: this.y,
          });
        },

        onDragEnd: function () {
          const newPos = {
            x: this.x,
            y: this.y,
          };

          setWindowPosition(windowKey, newPos);

          if (sizeMode === "normal") {
            originalPositionRef.current = newPos;
            originalSizeRef.current = size;
          }
        },

        onRelease: function () {
          this.update();
        },
      });

      return () => instance.kill();
    }, [isOpen, sizeMode]);

    if (!isOpen) return null;

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{
          zIndex,
          position: "fixed",
          transformOrigin: "center center",
        }}
        className={clsx(
          "bg-white rounded-lg shadow-2xl overflow-hidden",
          sizeMode === "full" && "window-full"
        )}
        onMouseDown={(e) => {
          if (e.target.closest(".no-drag")) return;
          focusWindow(windowKey);
        }}
      >
        <Component {...props} />
      </section>
    );
  };

  return Wrapped;
};

export default windowWrapper;