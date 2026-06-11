/**
 * PURPOSE:
 * Define top-level desktop navigation items.
 * RESPONSIBILITY:
 * Store menu links and navbar status icons.
 * USED BY:
 * Navbar and other shell navigation consumers.
 * DEPENDS ON:
 * Static asset paths.
 * SHOULD NOT HANDLE:
 * Window state, portfolio content, Finder locations, or window sizing.
 * SCALING NOTES:
 * If navigation becomes desktop-shell specific, move this file into the desktop-shell feature.
 */

export const navLinks = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

export const navIcons = [
  {
    id: 1,
    img: "/icons/wifi.svg",
  },
  {
    id: 2,
    img: "/icons/search.svg",
  },
  {
    id: 3,
    img: "/icons/user.svg",
  },
  {
    id: 4,
    img: "/icons/mode.svg",
  },
];
