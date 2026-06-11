/**
 * PURPOSE:
 * Render the desktop top menu bar.
 * RESPONSIBILITY:
 * Display branding, navigation links, status icons, and the current time.
 * USED BY:
 * Desktop shell composition in App.
 * DEPENDS ON:
 * Navigation config, OptimizedImage, dayjs, and desktop window store.
 * SHOULD NOT HANDLE:
 * Mobile shell UI, portfolio data loading, or window rendering.
 * SCALING NOTES:
 * Navbar actions should stay thin and delegate shell behavior to the window store.
 */

import dayjs from "dayjs";
import React from "react";

import { navIcons, navLinks } from "../../../constants";
import OptimizedImage from "../../../components/OptimizedImage";
import useWindowStore from "../store/windowStore";

const Navbar = () => {
  const { openWindow } = useWindowStore();

  return (
    <nav role="banner" className="print:hidden relative z-[50]">
      <div className="flex items-center gap-3">
        <OptimizedImage
          src="/images/logo.svg"
          alt="Aditya's Portfolio Logo"
          className="h-7 w-7"
          priority
        />
        <p className="font-semibold text-black text-sm">Aditya's Portfolio</p>

        <ul className="hidden sm:flex items-center gap-4">
          {navLinks.map(({ id, name, type }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => openWindow(type)}
                className="text-xs font-medium cursor-pointer hover:text-black/70 px-1.5 py-1"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2.5">
        <ul className="hidden sm:flex items-center gap-2.5">
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <OptimizedImage src={img} alt="" className="w-3.5 h-3.5" />
            </li>
          ))}
        </ul>

        <time className="text-xs font-medium text-black">
          {dayjs().format("ddd MMM D h:mm A")}
        </time>
      </div>
    </nav>
  );
};

export default Navbar;
