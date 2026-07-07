/**
 * PURPOSE:
 * Define static Finder locations.
 * RESPONSIBILITY:
 * Store non-GitHub folders such as About, Resume, Gallery, and VS Code.
 * USED BY:
 * Finder sidebar and location-based portfolio views.
 * DEPENDS ON:
 * Static portfolio gallery data and asset paths.
 * SHOULD NOT HANDLE:
 * Fetching GitHub repositories, loading Work data, window state, or rendering.
 * SCALING NOTES:
 * Dynamic Work children should come from the portfolio data boundary, not this file.
 */

import { gallery } from "./portfolioContent";

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [],
};

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "profile.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/gal/circlesunset1.png",
    },
    {
      id: 2,
      name: "about-me.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      subtitle: "Meet the Developer Behind the Code",
      image: "/gal/circlesunset1.png",
      description: [
        "Hey! I'm Aditya, a web developer who enjoys building sleek, interactive websites that actually work well.",
        "I specialize in JavaScript, React, and Next.js, and I love making things feel smooth, fast, and just a little bit delightful.",
        "I'm big on clean UI, good UX, and writing code that does not need a search party to debug.",
        "Outside of dev work, you'll find me tweaking layouts, sipping coffee, or trying new gadgets.",
      ],
    },
  ],
};

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.png",
      kind: "file",
      fileType: "pdf",
    },
  ],
};

const VSCODE_LOCATION = {
  id: 4,
  type: "vsCode",
  name: "VS Code",
  icon: "/icons/vscode.svg",
  kind: "folder",
  children: [],
};

const buildGalleryFile = (item) => ({
  id: `gallery-${item.id}`,
  name: item.name,
  icon: "/images/image.png",
  kind: "file",
  fileType: "img",
  imageUrl: item.img,
});

const GALLERY_LOCATION = {
  id: 5,
  type: "gallery",
  name: "Gallery",
  icon: "/images/photos.png",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Library",
      icon: "/images/folder.png",
      kind: "folder",
      children: gallery.map(buildGalleryFile),
    },
    {
      id: 2,
      name: "Memories",
      icon: "/images/folder.png",
      kind: "folder",
      children: gallery.slice(0, 2).map(buildGalleryFile),
    },
    {
      id: 3,
      name: "Places",
      icon: "/images/folder.png",
      kind: "folder",
      children: gallery.slice(2).map(buildGalleryFile),
    },
    {
      id: 4,
      name: "Favorites",
      icon: "/images/folder.png",
      kind: "folder",
      children: gallery
        .filter((item) => item.id === 1 || item.id === 4)
        .map(buildGalleryFile),
    },
  ],
};

export const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  gallery: GALLERY_LOCATION,
  vsCode: VSCODE_LOCATION,
};

