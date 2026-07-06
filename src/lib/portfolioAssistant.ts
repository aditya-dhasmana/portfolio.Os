/**
 * PURPOSE:
 * Interpret portfolio questions locally without an external AI service.
 * RESPONSIBILITY:
 * Match intents, select verified portfolio data, and return structured responses and actions.
 * USED BY:
 * The Safari portfolio chat UI.
 * DEPENDS ON:
 * The local portfolio data module.
 * SHOULD NOT HANDLE:
 * React rendering, opening windows, browser navigation, or remote AI requests.
 * SCALING NOTES:
 * A future provider can implement this response contract while this local provider remains the offline default.
 */

import {
  portfolioData,
  portfolioHomeCards,
  type PortfolioAction,
  type PortfolioCard,
} from "../data/portfolioData";

export type PortfolioIntent =
  | "about"
  | "projects"
  | "filteredProjects"
  | "resume"
  | "downloadResume"
  | "skills"
  | "techStack"
  | "blog"
  | "contact"
  | "github"
  | "recommendation"
  | "portfolioBuild"
  | "unknown";

export interface PortfolioAssistantResponse {
  intent: PortfolioIntent;
  message: string;
  cards?: PortfolioCard[];
  quickActions?: Array<{ label: string; action: PortfolioAction }>;
  action?: PortfolioAction;
  suggestions?: string[];
}

type IntentRule = {
  intent: PortfolioIntent;
  terms: string[];
};

const intentRules: IntentRule[] = [
  { intent: "about", terms: ["who are you", "about yourself", "introduce", "yourself"] },
  { intent: "projects", terms: ["projects", "project", "work", "built"] },
  { intent: "resume", terms: ["resume", "cv", "curriculum vitae"] },
  { intent: "skills", terms: ["skills", "skill", "technologies", "tools"] },
  { intent: "techStack", terms: ["tech stack", "stack", "technology stack"] },
  { intent: "blog", terms: ["blog", "articles", "posts", "writing"] },
  { intent: "contact", terms: ["contact", "reach", "connect", "email", "linkedin"] },
  { intent: "github", terms: ["github", "source code", "repositories", "repos"] },
];

const normalize = (input: string) =>
  input
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const scoreRule = (input: string, rule: IntentRule) =>
  rule.terms.reduce((score, term) => {
    if (input === term) return score + 4;
    if (input.includes(term)) return score + (term.includes(" ") ? 3 : 2);
    return score;
  }, 0);

const toProjectCard = (
  project: (typeof portfolioData.projects)[number],
): PortfolioCard => ({
  id: project.id,
  type: "project",
  title: project.name,
  description: project.description,
  label: "Open on GitHub",
  accent: "purple",
  technologies: [...project.technologies],
  action: { type: "openExternal", href: project.githubUrl },
});

const blogCards: PortfolioCard[] = portfolioData.blogPosts.map((post) => ({
  id: `blog-${post.id}`,
  type: "blog",
  title: post.title,
  description: `${post.date} · Development article linked from this portfolio.`,
  label: "Read Article",
  accent: "orange",
  action: { type: "openExternal", href: post.link },
}));

const getBestIntent = (input: string): PortfolioIntent => {
  const scored = intentRules
    .map((rule) => ({ intent: rule.intent, score: scoreRule(input, rule) }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].intent : "unknown";
};

export const askPortfolioAssistant = (
  userInput: string,
): PortfolioAssistantResponse => {
  const input = normalize(userInput);

  if (!input) {
    return {
      intent: "unknown",
      message: "Ask me about my projects, skills, resume, articles, or contact links.",
      suggestions: [...portfolioData.quickPrompts],
    };
  }

  if (/download/.test(input) && /resume|cv/.test(input)) {
    return {
      intent: "downloadResume",
      message: "My resume PDF is available. Use the action below to download it.",
      action: {
        type: "downloadFile",
        href: portfolioData.resume.filePath,
        fileName: portfolioData.resume.fileName,
      },
      quickActions: [
        { label: "Download Resume", action: { type: "downloadFile", href: portfolioData.resume.filePath, fileName: portfolioData.resume.fileName } },
        { label: "Open Resume App", action: { type: "openResume" } },
      ],
    };
  }

  if (/react/.test(input) && /project|work|built/.test(input)) {
    const projects = portfolioData.projects.filter((project) =>
      project.technologies.some((technology) => /react/i.test(technology)),
    );

    return {
      intent: "filteredProjects",
      message: "Here are my React-focused projects from the local portfolio data.",
      cards: projects.map(toProjectCard),
      quickActions: [{ label: "Open Projects App", action: { type: "openApp", appId: "finder" } }],
    };
  }

  if (/which project|project.*check first|recommend/.test(input)) {
    const project = portfolioData.projects[0];
    return {
      intent: "recommendation",
      message: `Start with ${project.name}. It best represents this interactive portfolio direction and is a useful entry point into my work.`,
      cards: [toProjectCard(project)],
    };
  }

  if (/portfolio/.test(input) && /built with|made with|tech|stack/.test(input)) {
    return {
      intent: "portfolioBuild",
      message:
        "I built this portfolio as a React application with a macOS-style window system, Zustand state, Vite, and carefully scoped UI features.",
      quickActions: [{ label: "View Skills", action: { type: "openApp", appId: "terminal" } }],
    };
  }

  const intent = getBestIntent(input);

  switch (intent) {
    case "about":
      return { intent, message: portfolioData.profile.about, cards: portfolioHomeCards };
    case "projects":
      return {
        intent,
        message: "These are the projects currently available in my portfolio. You can inspect them here or open the Projects app.",
        cards: portfolioData.projects.map(toProjectCard),
        action: { type: "showProjects" },
        quickActions: [{ label: "Open Projects App", action: { type: "openApp", appId: "finder" } }],
      };
    case "resume":
      return {
        intent,
        message: "Sure — here’s my resume. You can open it inside the portfolio or download the available PDF.",
        cards: [portfolioHomeCards[1]],
        action: { type: "openResume" },
        quickActions: [
          { label: "Open Resume", action: { type: "openResume" } },
          { label: "Download PDF", action: { type: "downloadFile", href: portfolioData.resume.filePath, fileName: portfolioData.resume.fileName } },
        ],
      };
    case "skills":
    case "techStack":
      return {
        intent,
        message: `My current stack includes ${portfolioData.skills.map((group) => group.items.join(", ")).join("; ")}.`,
        cards: [portfolioHomeCards[2]],
        quickActions: [{ label: "Open Skills App", action: { type: "openApp", appId: "terminal" } }],
      };
    case "blog":
      return {
        intent,
        message: "Here are the development articles currently linked from my portfolio.",
        cards: blogCards,
        action: { type: "showBlog" },
      };
    case "contact":
      return {
        intent,
        message: "You can connect with me through GitHub or LinkedIn, or open the Contact app for all available links.",
        cards: [portfolioHomeCards[4]],
        action: { type: "showContact" },
        quickActions: [
          { label: "Open Contact App", action: { type: "openApp", appId: "contact" } },
          ...(portfolioData.contact.linkedIn
            ? [{ label: "LinkedIn", action: { type: "openExternal", href: portfolioData.contact.linkedIn } as PortfolioAction }]
            : []),
        ],
      };
    case "github":
      return {
        intent,
        message: "Here’s my GitHub profile, where you can explore the source code and repositories connected to this portfolio.",
        action: { type: "openExternal", href: portfolioData.contact.github },
        quickActions: [{ label: "Open GitHub", action: { type: "openExternal", href: portfolioData.contact.github } }],
      };
    default:
      return {
        intent: "unknown",
        message: "I’m not sure about that yet. I can help with my projects, resume, skills, articles, GitHub, or contact details.",
        suggestions: [...portfolioData.quickPrompts],
      };
  }
};

// TODO: A future Gemini provider can implement PortfolioAssistantResponse without changing the Safari UI.
