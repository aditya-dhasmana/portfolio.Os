/**
 * PURPOSE:
 * Render the desktop welcome title and mobile clock welcome view.
 * RESPONSIBILITY:
 * Display time on mobile and animated variable-weight heading text on desktop.
 * USED BY:
 * App desktop shell.
 * DEPENDS ON:
 * dayjs, react-responsive, GSAP, and useGSAP.
 * SHOULD NOT HANDLE:
 * Window state, portfolio data, routing, or app loading.
 * SCALING NOTES:
 * If the welcome section gains more desktop-only behavior, split desktop and mobile views into separate components.
 */

import React, { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import dayjs from "dayjs";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const FONT_WEIGHT = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, index) => (
    <span
      key={index}
      className={className}
      style={{
        fontVariationSettings: `'wght' ${baseWeight}`,
        display: "inline-block",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const Welcome = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [time, setTime] = useState(dayjs());

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    if (isMobile) return;

    const cleanups = [];

    const setup = (container, type) => {
      if (!container) return;

      const letters = container.querySelectorAll("span");
      const { min, max, default: base } = FONT_WEIGHT[type];

      const handleMouseMove = (event) => {
        letters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const center = rect.left + rect.width / 2;
          const distance = Math.abs(event.clientX - center);
          const intensity = Math.exp(-(distance ** 2) / 20000);

          gsap.to(letter, {
            fontVariationSettings: `'wght' ${min + (max - min) * intensity}`,
            scale: 1 + intensity * 0.2,
            duration: 0.2,
          });
        });
      };

      const handleMouseLeave = () => {
        letters.forEach((letter) => {
          gsap.to(letter, {
            fontVariationSettings: `'wght' ${base}`,
            scale: 1,
            duration: 0.3,
          });
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      });
    };

    setup(titleRef.current, "title");
    setup(subtitleRef.current, "subtitle");

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <section
        id="welcome"
        className="flex flex-col items-center justify-center h-screen text-white"
      >
        <h1 className="text-7xl font-extralight tracking-tight">
          {time.format("HH:mm")}
        </h1>

        <p className="mt-1 text-base opacity-80">
          {time.format("dddd, D MMMM")}
        </p>
      </section>
    );
  }

  return (
    <section id="welcome" className="px-4 sm:px-0">
      <p ref={subtitleRef} className="text-center">
        {renderText(
          "Hey, I'm Aditya! Welcome to my",
          "text-2xl sm:text-3xl font-georama",
          100
        )}
      </p>

      <h1 ref={titleRef} className="mt-4 sm:mt-7 text-center">
        {renderText(
          "portfolio",
          "text-6xl sm:text-7xl lg:text-9xl italic font-georama",
          400
        )}
      </h1>
    </section>
  );
};

export default Welcome;
