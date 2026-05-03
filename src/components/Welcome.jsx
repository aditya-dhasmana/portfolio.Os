import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react';
import gsap from "gsap";

const FONT_WEIGHT = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 }
};

// 🔤 Split text into spans
const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{
        fontVariationSettings: `'wght' ${baseWeight}`,
        display: "inline-block",
        willChange: "font-variation-settings, transform"
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

// 🎯 Hover wave effect
const setupTextHover = (container, type) => {
  if (!container) return ()=>{};

  const letters = container.querySelectorAll("span");
  const { min, max, default: base } = FONT_WEIGHT[type];

  const animateLetter = (letter, weight, scale = 1, duration = 0.25) => {
    return gsap.to(letter, {
      duration,
      ease: "power2.out",
      fontVariationSettings: `'wght' ${weight}`,
      scale
    });
  };

  const handleMouseMove = (e) => {
    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      const letterCenter = rect.left + rect.width / 2;

      const distance = Math.abs(e.clientX - letterCenter);

      // 🔥 tighter wave
      const intensity = Math.exp(-(distance ** 2) / 20000);

      const weight = min + (max - min) * intensity;
      const scale = 1 + intensity * 0.2;

      animateLetter(letter, weight, scale);
    });
  };

  const handleMouseLeave = () => {
    letters.forEach((letter) => {
      animateLetter(letter, base, 1, 0.4);
    });
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  // 🧹 cleanup (important for React)
  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    const cleanTitle = setupTextHover(titleRef.current, "title");
    const cleanSubtitle = setupTextHover(subtitleRef.current, "subtitle");

    return () => {
      cleanTitle && cleanTitle();
      cleanSubtitle && cleanSubtitle();
    };
  }, []);

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