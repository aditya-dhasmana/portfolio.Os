export const mobileApps = [
  {
    id: "about",
    name: "About",
    title: "About Aditya",
    icon: "/icons/mobile-icons/contact1.svg",
    dock: false,
  },
  {
    id: "projects",
    name: "Projects",
    title: "Projects",
    icon: "/icons/mobile-icons/finder.svg",
    dock: false,
  },
  {
    id: "skills",
    name: "Skills",
    title: "Tech Stack",
    icon: "/icons/mobile-icons/skills.svg",
    dock: false,
  },
  {
    id: "articles",
    name: "Articles",
    title: "Articles",
    icon: "/icons/mobile-icons/safari.svg",
    dock: false,
  },
  {
    id: "weather",
    name: "Weather",
    title: "Weather",
    icon: "/icons/mobile-icons/weather.svg",
    dock: false,
  },
  {
    id: "todo",
    name: "Todo",
    title: "Todo",
    icon: "/icons/mobile-icons/todo.svg",
    dock: false,
  },
  {
    id: "github",
    name: "GitHub",
    title: "GitHub",
    icon: "/icons/mobile-icons/github.svg",
    dock: false,
  },
  {
    id: "code",
    name: "Code",
    title: "VS Code",
    icon: "/icons/mobile-icons/vscode.svg",
    dock: false,
  },
  {
    id: "resume",
    name: "Resume",
    title: "Resume",
    icon: "/icons/mobile-icons/pdf.svg",
    dock: true,
  },
  {
    id: "gallery",
    name: "Gallery",
    title: "Gallery",
    icon: "/icons/mobile-icons/gallery.svg",
    dock: true,
  },
  {
    id: "contact",
    name: "Contact",
    title: "Contact",
    icon: "/icons/mobile-icons/contact.svg",
    dock: true,
  },
  {
    id: "phone",
    name: "Phone",
    title: "Reach Me",
    icon: "/icons/mobile-icons/phone.svg",
    dock: true,
    appId: "contact",
  },
];

export const homeApps = mobileApps.filter((app) => !app.dock);
export const dockApps = mobileApps.filter((app) => app.dock);

export const getMobileApp = (id) => {
  const app = mobileApps.find((item) => item.id === id);
  if (!app) return null;
  return app.appId ? mobileApps.find((item) => item.id === app.appId) || app : app;
};
