const navLinks = [
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

const navIcons = [
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

// 🔹 Dock Apps
const dockApps = [
  { id: "finder", name: "Portfolio", icon: "finder.png", canOpen: true },
  { id: "safari", name: "Articles", icon: "safari.png", canOpen: true },
  { id: "photos", name: "Gallery", icon: "photos.png", canOpen: true },
  { id: "contact", name: "Contact", icon: "contact.png", canOpen: true },
  { id: "terminal", name: "Skills", icon: "terminal.png", canOpen: true },

  { id: "vsCode", name: "VS Code", icon: "vscode.png", canOpen: true },
];

const blogPosts = [
  {
    id: 1,
    date: "Sep 2, 2025",
    title:
      "TypeScript Explained: What It Is, Why It Matters, and How to Master It",
    image: "/images/blog1.png",
    link: "https://jsmastery.com/blog/typescript-explained-what-it-is-why-it-matters-and-how-to-master-it",
  },
  {
    id: 2,
    date: "Aug 28, 2025",
    title: "The Ultimate Guide to Mastering Three.js for 3D Development",
    image: "/images/blog2.png",
    link: "https://jsmastery.com/blog/the-ultimate-guide-to-mastering-three-js-for-3d-development",
  },
  {
    id: 3,
    date: "Aug 15, 2025",
    title: "The Ultimate Guide to Mastering GSAP Animations",
    image: "/images/blog3.png",
    link: "https://jsmastery.com/blog/the-ultimate-guide-to-mastering-gsap-animations",
  },
];

const techStack = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "TypeScript"],
  },
  {
    category: "Mobile",
    items: ["React Native", "Expo"],
  },
  {
    category: "Styling",
    items: ["Tailwind CSS", "Sass", "CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "Hono"],
  },
  {
    category: "Database",
    items: ["MongoDB", "PostgreSQL"],
  },
  {
    category: "Dev Tools",
    items: ["Git", "GitHub", "Docker"],
  },
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/aditya-dhasmana",
  },
  {
    id: 2,
    text: "Platform",
    icon: "/icons/atom.svg",
    bg: "#4bcb63",
    link: "https://jsmastery.com/",
  },
  {
    id: 3,
    text: "Twitter/X",
    icon: "/icons/twitter.svg",
    bg: "#ff866b",
    link: "https://x.com/home",
  },
  {
    id: 4,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://www.linkedin.com/in/aditya-dhasmana",
  },
];

const photosLinks = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Library",
  },
  {
    id: 2,
    icon: "/icons/gicon2.svg",
    title: "Memories",
  },
  {
    id: 3,
    icon: "/icons/file.svg",
    title: "Places",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "People",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favorites",
  },
];

const gallery = [
  {
    id: 1,
    img: "/images/gal1.png",
    name: "sunset-beach.jpg",
  },
  {
    id: 2,
    img: "/images/gal2.png",
    name: "mountain-landscape.jpg",
  },
  {
    id: 3,
    img: "/images/gal3.png",
    name: "city-lights.jpg",
  },
  {
    id: 4,
    img: "/images/gal4.png",
    name: "summer-vacation.jpg",
  },
];

export {
  navLinks,
  navIcons,
  dockApps,
  blogPosts,
  techStack,
  socials,
  photosLinks,
  gallery,
};

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [], // 👈 will be filled dynamically
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
      name: "me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/images/adrian.jpg",
    },
    {
      id: 2,
      name: "casual-me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/images/adrian-2.jpg",
    },
    {
      id: 3,
      name: "conference-me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/images/adrian-3.jpeg",
    },
    {
      id: 4,
      name: "about-me.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      subtitle: "Meet the Developer Behind the Code",
      image: "/images/aditya.jpg",
      description: [
        "Hey! I’m Aditya 👋, a web developer who enjoys building sleek, interactive websites that actually work well.",
        "I specialize in JavaScript, React, and Next.js—and I love making things feel smooth, fast, and just a little bit delightful.",
        "I’m big on clean UI, good UX, and writing code that doesn’t need a search party to debug.",
        "Outside of dev work, you'll find me tweaking layouts at 2AM, sipping overpriced coffee, or impulse-buying gadgets I absolutely convinced myself I needed 😅",
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
      // you can add `href` if you want to open a hosted resume
      // href: "/your/resume/path.pdf",
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
      children: gallery.filter((item) => item.id === 1 || item.id === 4).map(buildGalleryFile),
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

const INITIAL_Z_INDEX = 1000;

// Default sizes for each window type
const DEFAULT_WINDOW_SIZES = {
  finder: { width: 900, height: 650 },
  contact: { width: 600, height: 500 },
  resume: { width: 800, height: 900 },
  safari: { width: 1200, height: 700 },
  photos: { width: 1000, height: 650 },
  terminal: { width: 700, height: 500 },
  vsCode: { width: 1100, height: 700 },
  txtfile: { width: 500, height: 600 },
  imgfile: { width: 600, height: 700 },
};

const WINDOW_CONFIG = {

  finder: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.finder,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.finder,
    lastNormalPosition: null
  },

  contact: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.contact,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.contact,
    lastNormalPosition: null
  },

  resume: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.resume,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.resume,
    lastNormalPosition: null
  },

  safari: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.safari,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.safari,
    lastNormalPosition: null
  },

  photos: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.photos,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.photos,
    lastNormalPosition: null
  },

  gallery: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.gallery,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.gallery,
    lastNormalPosition: null
  },

  terminal: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.terminal,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.terminal,
    lastNormalPosition: null
  },

  vsCode: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.vsCode,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.vsCode,
    lastNormalPosition: null
  },

  txtfile: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.txtfile,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.txtfile,
    lastNormalPosition: null
  },

  imgfile: { 
    isOpen:false,
    isMinimized:false,
    sizeMode:"normal",
    zIndex:INITIAL_Z_INDEX,
    data:null,
    size:DEFAULT_WINDOW_SIZES.imgfile,
    position:null,
    lastNormalSize: DEFAULT_WINDOW_SIZES.imgfile,
    lastNormalPosition: null
  },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG, DEFAULT_WINDOW_SIZES };
