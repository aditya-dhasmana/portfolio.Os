import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const useViewportMode = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
    isTablet:
      window.innerWidth > MOBILE_BREAKPOINT &&
      window.innerWidth <= TABLET_BREAKPOINT,
    isDesktop: window.innerWidth > TABLET_BREAKPOINT,
  });

  useEffect(() => {
    const onResize = () => {
      setViewport({
        width: window.innerWidth,
        isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
        isTablet:
          window.innerWidth > MOBILE_BREAKPOINT &&
          window.innerWidth <= TABLET_BREAKPOINT,
        isDesktop: window.innerWidth > TABLET_BREAKPOINT,
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return viewport;
};

export default useViewportMode;