/**
 * PURPOSE:
 * Provide the verified local facts used by Aditya's portfolio chat.
 * RESPONSIBILITY:
 * Describe the profile, skills, projects, articles, contacts, and resume asset.
 * USED BY:
 * The local portfolio assistant and Safari portfolio chat UI.
 * DEPENDS ON:
 * Existing portfolio constants and fallback project records.
 * SHOULD NOT HANDLE:
 * Intent matching, React state, window actions, or network requests.
 * SCALING NOTES:
 * Replace or enrich entries here when real portfolio content changes; providers should consume the same shape.
 */

import { blogPosts, socials, techStack } from "../constants/portfolioContent";
import { fallbackProjects } from "../features/portfolio/data/fallbackProjects";

export type PortfolioAction =
  | { type: "openApp"; appId: "finder" | "resume" | "terminal" | "contact" }
  | { type: "openExternal"; href: string }
  | { type: "openResume" }
  | { type: "downloadFile"; href: string; fileName: string }
  | { type: "showProjects" }
  | { type: "showContact" }
  | { type: "showBlog" };

export interface PortfolioCard {
  id: string;
  type: "project" | "resume" | "skills" | "blog" | "contact";
  title: string;
  description: string;
  label: string;
  accent: "purple" | "green" | "blue" | "orange" | "pink";
  technologies?: string[];
  action: PortfolioAction;
}

const findSocial = (name: string) =>
  socials.find((social) => social.text.toLowerCase() === name.toLowerCase());

const github = findSocial("Github");
const linkedIn = findSocial("LinkedIn");

export const portfolioData = {
  profile: {
    name: "Aditya",
    title: "Developer",
    avatarLabel: "Aditya's portfolio avatar",
    greeting: "Hi, I’m Aditya 👋",
    subtitle:
      "I like building things with code. You can ask me about my projects, resume, skills, blog, or how to get in touch.",
    about:
      "Hey! I’m Aditya. I’m a developer who enjoys coding, building projects, and exploring new ideas in tech. You can walk through my projects, skills, resume, and what I’m building.",
  },
  skills: techStack,
  projects: fallbackProjects.map((project) => ({
    id: String(project.id),
    name: project.name,
    description: project.description,
    githubUrl: project.html_url,
    liveUrl: project.homepage || "",
    technologies: /react|macfolio|portfolio/i.test(
      `${project.name} ${project.description}`,
    )
      ? ["React"]
      : [],
  })),
  blogPosts: blogPosts.map((post) => ({
    id: String(post.id),
    title: post.title,
    date: post.date,
    image: post.image,
    link: post.link,
  })),
  contact: {
    github: github?.link || "",
    linkedIn: linkedIn?.link || "",
  },
  resume: {
    filePath: "/files/resume.pdf",
    fileName: "Aditya-Resume.pdf",
    appId: "resume" as const,
  },
  quickPrompts: [
    "Tell me about yourself",
    "Show my projects",
    "Here’s my resume",
    "My tech stack",
    "Contact me",
  ],
} as const;

export const portfolioHomeCards: PortfolioCard[] = [
  {
    id: "projects",
    type: "project",
    title: "Projects",
    description: "Explore the projects I’ve built and the ideas behind them.",
    label: "View Projects",
    accent: "purple",
    action: { type: "openApp", appId: "finder" },
  },
  {
    id: "resume",
    type: "resume",
    title: "Resume",
    description: "Open my resume here or download the available PDF.",
    label: "Open Resume",
    accent: "green",
    action: { type: "openResume" },
  },
  {
    id: "skills",
    type: "skills",
    title: "Skills",
    description: "See the technologies and tools I currently work with.",
    label: "View Skills",
    accent: "blue",
    action: { type: "openApp", appId: "terminal" },
  },
  {
    id: "blog",
    type: "blog",
    title: "Blog",
    description: "Browse the development articles linked from my portfolio.",
    label: "Show Articles",
    accent: "orange",
    action: { type: "showBlog" },
  },
  {
    id: "contact",
    type: "contact",
    title: "Contact",
    description: "Find my GitHub, LinkedIn, and other contact options.",
    label: "Contact Me",
    accent: "pink",
    action: { type: "openApp", appId: "contact" },
  },
];
