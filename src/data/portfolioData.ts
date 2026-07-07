/**
 * PURPOSE:
 * Provide the verified local facts used by Aditya's portfolio chat.
 * RESPONSIBILITY:
 * Describe the profile, skills, projects, articles, contacts, resume asset, and reusable cards.
 * USED BY:
 * The local portfolio assistant and Safari portfolio chat UI.
 * DEPENDS ON:
 * Existing portfolio constants, fallback project records, and real public assets.
 * SHOULD NOT HANDLE:
 * Intent matching, conversation memory, React state, window actions, or network requests.
 * SCALING NOTES:
 * Enrich project metadata here as facts become available; every assistant provider should consume this shape.
 */

import { blogPosts, socials, techStack } from "../constants/portfolioContent";
import { fallbackProjects } from "../features/portfolio/data/fallbackProjects";

export type PortfolioAppId = "finder" | "resume" | "terminal" | "contact";

export type PortfolioAction =
  | { type: "openApp"; appId: PortfolioAppId }
  | { type: "openProject"; projectId: string }
  | { type: "openExternal"; href: string }
  | { type: "openResume" }
  | { type: "downloadFile"; href: string; fileName: string }
  | { type: "showProjects" }
  | { type: "showContact" }
  | { type: "showBlog" };

export interface PortfolioCardAction {
  label: string;
  action: PortfolioAction;
  emphasis?: "primary" | "secondary";
}

export interface PortfolioCard {
  id: string;
  type: "project" | "resume" | "skills" | "blog" | "contact" | "link";
  title: string;
  description: string;
  accent: "purple" | "green" | "blue" | "orange" | "pink";
  tags?: string[];
  actions: PortfolioCardAction[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  stack: string[];
  category: "frontend" | "portfolio" | "practice";
  tags: string[];
  featured: boolean;
  priority: number;
  githubUrl: string;
  liveUrl: string;
  appId: "finder";
  image: string;
  whyItMatters: string;
}

const findSocial = (name: string) =>
  socials.find((social) => social.text.toLowerCase() === name.toLowerCase());

const github = findSocial("Github");
const linkedIn = findSocial("LinkedIn");

const projectMetadata: Record<
  string,
  Pick<
    PortfolioProject,
    "stack" | "category" | "tags" | "featured" | "priority" | "image" | "whyItMatters"
  >
> = {
  Macfolio: {
    stack: ["React", "TypeScript", "Vite", "Zustand"],
    category: "portfolio",
    tags: ["frontend", "ui", "state", "macOS-style"],
    featured: true,
    priority: 100,
    image: "/images/project-1.png",
    whyItMatters:
      "It brings interface design, window state, local data, and product thinking together in one experience.",
  },
  Portfolio: {
    stack: ["Frontend", "UI"],
    category: "frontend",
    tags: ["frontend", "ui", "portfolio"],
    featured: false,
    priority: 60,
    image: "/images/project-2.png",
    whyItMatters: "It collects my frontend portfolio work and interface experiments.",
  },
  "React Projects": {
    stack: ["React"],
    category: "practice",
    tags: ["react", "frontend", "practice"],
    featured: false,
    priority: 50,
    image: "/images/project-3.png",
    whyItMatters: "It shows the React projects currently linked from my GitHub portfolio data.",
  },
};

export const portfolioProjects: PortfolioProject[] = fallbackProjects.map((project) => {
  const metadata = projectMetadata[project.name] || {
    stack: [],
    category: "practice" as const,
    tags: [],
    featured: false,
    priority: 10,
    image: "/images/folder.png",
    whyItMatters: "This project is part of the work currently linked from my portfolio.",
  };

  return {
    id: String(project.id),
    title: project.name,
    description: project.description,
    githubUrl: project.html_url,
    liveUrl: project.homepage || "",
    appId: "finder",
    ...metadata,
  };
});

export const portfolioData = {
  profile: {
    name: "Aditya",
    title: "Developer",
    avatarLabel: "Aditya's portfolio avatar",
    greeting: "Hi, I'm Aditya 👋",
    shortIntro:
      "I like building things with code, especially clean interfaces, portfolio systems, and developer-focused tools.",
    subtitle:
      "I like building things with code. You can ask me about my projects, resume, skills, blog, or how to get in touch.",
    about:
      "Hey! I'm Aditya. I like building practical things with code, especially clean interfaces, portfolio systems, and developer-focused tools. This is my interactive portfolio voice, powered by the local data in this project.",
    location: "",
    education: "",
    interests: ["Interactive UI", "Developer tools", "Portfolio systems"],
    currentFocus: ["Macfolio architecture", "Local-first portfolio interactions"],
  },
  skills: {
    groups: techStack,
    languages: ["TypeScript"],
    frontend: ["React.js", "Next.js", "Tailwind CSS", "Sass", "CSS"],
    backend: ["Node.js", "Express", "NestJS"],
    tools: ["Git", "GitHub", "Docker"],
    currentlyLearning: [],
  },
  projects: portfolioProjects,
  blogPosts: blogPosts.map((post) => ({
    id: String(post.id),
    title: post.title,
    summary: "Development article linked from this portfolio.",
    tags: ["development"],
    date: post.date,
    image: post.image,
    url: post.link,
  })),
  contact: {
    email: "",
    github: github?.link || "",
    linkedIn: linkedIn?.link || "",
    portfolio: "",
  },
  resume: {
    filePath: "/files/resume.pdf",
    fileName: "Aditya-Resume.pdf",
    appId: "resume" as const,
    isDownloadAvailable: true,
    summary: "My web developer resume is available inside Macfolio and as a verified PDF download.",
  },
  quickPrompts: [
    "Tell me about yourself",
    "Show my projects",
    "Here's my resume",
    "My tech stack",
    "Contact me",
  ],
  commands: ["/about", "/projects", "/resume", "/skills", "/contact", "/github", "/blog", "/help"],
} as const;

export const createProjectCard = (project: PortfolioProject): PortfolioCard => {
  const actions: PortfolioCardAction[] = [
    {
      label: "Open Project",
      action: { type: "openProject", projectId: project.id },
      emphasis: "primary",
    },
  ];

  if (project.githubUrl) {
    actions.push({ label: "GitHub", action: { type: "openExternal", href: project.githubUrl } });
  }

  if (project.liveUrl) {
    actions.push({ label: "Live Demo", action: { type: "openExternal", href: project.liveUrl } });
  }

  return {
    id: `project-${project.id}`,
    type: "project",
    title: project.title,
    description: project.description,
    accent: "purple",
    tags: project.stack,
    actions,
  };
};

export const resumeCard: PortfolioCard = {
  id: "resume",
  type: "resume",
  title: "Resume",
  description: "Open my resume inside Macfolio or download the verified PDF.",
  accent: "green",
  actions: [
    { label: "Open Resume", action: { type: "openResume" }, emphasis: "primary" },
    ...(portfolioData.resume.isDownloadAvailable
      ? [
          {
            label: "Download PDF",
            action: {
              type: "downloadFile" as const,
              href: portfolioData.resume.filePath,
              fileName: portfolioData.resume.fileName,
            },
          },
        ]
      : []),
  ],
};

export const skillsCard: PortfolioCard = {
  id: "skills",
  type: "skills",
  title: "Skills",
  description: "Explore the technologies and tools currently listed in my portfolio.",
  accent: "blue",
  tags: portfolioData.skills.groups.flatMap((group) => group.items).slice(0, 6),
  actions: [{ label: "Open Skills", action: { type: "openApp", appId: "terminal" }, emphasis: "primary" }],
};

export const contactCard: PortfolioCard = {
  id: "contact",
  type: "contact",
  title: "Contact",
  description: "Use the verified contact and social links currently available in my portfolio.",
  accent: "pink",
  actions: [
    { label: "Contact App", action: { type: "openApp", appId: "contact" }, emphasis: "primary" },
    ...(portfolioData.contact.email
      ? [{ label: "Email", action: { type: "openExternal" as const, href: `mailto:${portfolioData.contact.email}` } }]
      : []),
    ...(portfolioData.contact.github
      ? [{ label: "GitHub", action: { type: "openExternal" as const, href: portfolioData.contact.github } }]
      : []),
    ...(portfolioData.contact.linkedIn
      ? [{ label: "LinkedIn", action: { type: "openExternal" as const, href: portfolioData.contact.linkedIn } }]
      : []),
  ],
};

export const portfolioHomeCards: PortfolioCard[] = [
  {
    id: "projects",
    type: "project",
    title: "Projects",
    description: "Explore the projects I've built and the ideas behind them.",
    accent: "purple",
    actions: [{ label: "View Projects", action: { type: "openApp", appId: "finder" }, emphasis: "primary" }],
  },
  resumeCard,
  skillsCard,
  {
    id: "blog",
    type: "blog",
    title: "Blog",
    description: "Browse the development articles linked from my portfolio.",
    accent: "orange",
    actions: [{ label: "Show Articles", action: { type: "showBlog" }, emphasis: "primary" }],
  },
  contactCard,
];
