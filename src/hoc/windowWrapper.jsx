// src/hoc/windowWrapper.jsx
// Complete working file with minimal fixes:
// 1. Keeps windows above desktop icons.
// 2. Safely handles missing store functions.
// 3. Preserves default export.

import useWindowStore from "#store/window";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import React, { useRef, useEffect, useLayoutEffect } from "react";
import Draggable from "gsap/Draggable";
import { DEFAULT_WINDOW_SIZES } from "#constants";
import clsx from "clsx";

gsap.registerPlugin(Draggable);

const windowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const store = useWindowStore();

    const {
      focusWindow,
      windows,
      setWindowPosition,
      setWindowSize,
      setSizeMode,
    } = store;

    const {
      isOpen,
      sizeMode = "normal",
      zIndex = 1000,
      position,
      size,
    } = windows?.[windowKey] || {};

    const ref = useRef(null);
    const originalSizeRef = useRef(null);
    const originalPositionRef = useRef(null);
    const prevSizeModeRef = useRef(sizeMode);

    useEffect(() => {
      if (isOpen && sizeMode === "normal") {
        originalSizeRef.current =
          size ||
          DEFAULT_WINDOW_SIZES[windowKey] || {
            width: 800,
            height: 600,
          };

        originalPositionRef.current =
          position || { x: 0, y: 0 };
      }
    }, [isOpen, size, position, sizeMode]);

    useLayoutEffect(() => {
      if (window.innerWidth <= 768) return;

      const el = ref.current;
      if (!el || !isOpen) return;

      const prevMode = prevSizeModeRef.current;

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
            DEFAULT_WINDOW_SIZES[windowKey] || {
              width: 800,
              height: 600,
            };

          const restorePos =
            originalPositionRef.current || {
              x: 0,
              y: 0,
            };

          gsap.to(el, {
            x: restorePos.x,
            y: restorePos.y,
            width: restoreSize.width,
            height: restoreSize.height,
            borderRadius: 10,
            duration: 0.34,
            ease: "power3.inOut",
          });
        }
      } else {
        if (sizeMode === "normal") {
          gsap.set(el, {
            x: position?.x || 0,
            y: position?.y || 0,
            width:
              size?.width ||
              DEFAULT_WINDOW_SIZES[windowKey]?.width ||
              800,
            height:
              size?.height ||
              DEFAULT_WINDOW_SIZES[windowKey]?.height ||
              600,
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

    useGSAP(() => {
      if (window.innerWidth <= 768) return;

      const el = ref.current;
      if (!el || !isOpen) return;

      const header = el.querySelector("#window-header");
      if (!header) return;

      const [instance] = Draggable.create(el, {
        trigger: header,
        type: "x,y",

        onPress: function (e) {
          if (e.target.closest(".no-drag")) return;

          focusWindow?.(windowKey);

          if (sizeMode === "full") {
            const originalSize =
              originalSizeRef.current ||
              DEFAULT_WINDOW_SIZES[windowKey] || {
                width: 800,
                height: 600,
              };

            setWindowSize?.(windowKey, originalSize);
            setSizeMode?.(windowKey, "normal");

            gsap.set(el, {
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
          setWindowPosition?.(windowKey, {
            x: this.x,
            y: this.y,
          });
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
          "inset-0 bg-white rounded-xl shadow-2xl overflow-hidden",
          sizeMode === "full" && "window-full"
        )}
        onMouseDown={(e) => {
          if (e.target.closest(".no-drag")) return;
          focusWindow?.(windowKey);
        }}
      >
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${windowKey})`;

  return Wrapped;
};

export default windowWrapper;