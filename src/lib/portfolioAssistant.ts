/**
 * PURPOSE:
 * Power Macfolio Chat V2 with a deterministic, context-aware local assistant.
 * RESPONSIBILITY:
 * Score natural-language intents, resolve commands and follow-ups, recommend projects, and update session memory.
 * USED BY:
 * The Safari portfolio chat UI through the local provider interface.
 * DEPENDS ON:
 * Verified portfolio data and reusable card builders.
 * SHOULD NOT HANDLE:
 * React state, timers, rendering, opening windows, browser navigation, or remote AI requests.
 * SCALING NOTES:
 * Future providers should implement PortfolioAssistantProvider while the local provider remains the offline default.
 */

import {
  contactCard,
  createProjectCard,
  portfolioData,
  portfolioHomeCards,
  resumeCard,
  skillsCard,
  type PortfolioAction,
  type PortfolioAppId,
  type PortfolioCard,
  type PortfolioProject,
} from "../data/portfolioData";
import type {
  AssistantMemory,
  PortfolioAssistantResponse,
  PortfolioAssistantResult,
  PortfolioIntent,
} from "./assistantTypes";

export type {
  AssistantMemory,
  PortfolioAssistantResponse,
  PortfolioAssistantResult,
  PortfolioIntent,
} from "./assistantTypes";

type WeightedPhrase = { value: string; weight: number };

type IntentRule = {
  intent: Exclude<PortfolioIntent, "downloadResume" | "recommendation" | "projectFollowUp" | "portfolioBuild" | "help" | "unknown">;
  keywords: WeightedPhrase[];
  synonyms: WeightedPhrase[];
  phrases: WeightedPhrase[];
};

const MINIMUM_CONFIDENCE_SCORE = 3;

const intentRules: IntentRule[] = [
  {
    intent: "about",
    keywords: [
      { value: "yourself", weight: 3 },
      { value: "aditya", weight: 2 },
      { value: "introduce", weight: 4 },
    ],
    synonyms: [
      { value: "who are you", weight: 6 },
      { value: "who is aditya", weight: 6 },
    ],
    phrases: [
      { value: "tell me about yourself", weight: 8 },
      { value: "what do you do", weight: 6 },
      { value: "introduce yourself", weight: 8 },
    ],
  },
  {
    intent: "projects",
    keywords: [
      { value: "project", weight: 4 },
      { value: "projects", weight: 4 },
      { value: "portfolio", weight: 2 },
      { value: "built", weight: 3 },
      { value: "work", weight: 2 },
    ],
    synonyms: [
      { value: "things you made", weight: 5 },
      { value: "your work", weight: 5 },
    ],
    phrases: [
      { value: "show projects", weight: 8 },
      { value: "show your work", weight: 8 },
      { value: "what have you built", weight: 8 },
      { value: "what can you build", weight: 7 },
      { value: "can i see what you built", weight: 9 },
    ],
  },
  {
    intent: "filteredProjects",
    keywords: [
      { value: "frontend", weight: 5 },
      { value: "react", weight: 5 },
      { value: "typescript", weight: 5 },
      { value: "vite", weight: 5 },
      { value: "ui", weight: 4 },
    ],
    synonyms: [
      { value: "web development", weight: 5 },
      { value: "front end", weight: 5 },
    ],
    phrases: [
      { value: "show react projects", weight: 9 },
      { value: "frontend work", weight: 8 },
      { value: "typescript projects", weight: 9 },
      { value: "ui projects", weight: 8 },
      { value: "projects using react", weight: 9 },
      { value: "are you good for frontend", weight: 9 },
    ],
  },
  {
    intent: "resume",
    keywords: [
      { value: "resume", weight: 6 },
      { value: "cv", weight: 6 },
      { value: "experience", weight: 4 },
      { value: "qualification", weight: 4 },
    ],
    synonyms: [
      { value: "work history", weight: 5 },
      { value: "curriculum vitae", weight: 7 },
    ],
    phrases: [
      { value: "open resume", weight: 9 },
      { value: "show resume", weight: 9 },
      { value: "what about resume", weight: 8 },
    ],
  },
  {
    intent: "skills",
    keywords: [
      { value: "skills", weight: 5 },
      { value: "technologies", weight: 5 },
      { value: "frameworks", weight: 5 },
      { value: "languages", weight: 4 },
      { value: "tools", weight: 3 },
      { value: "stack", weight: 5 },
    ],
    synonyms: [
      { value: "tech stack", weight: 7 },
      { value: "programming languages", weight: 7 },
    ],
    phrases: [
      { value: "what technologies do you know", weight: 9 },
      { value: "tools you use", weight: 7 },
      { value: "what is your tech stack", weight: 9 },
    ],
  },
  {
    intent: "contact",
    keywords: [
      { value: "contact", weight: 6 },
      { value: "email", weight: 6 },
      { value: "linkedin", weight: 6 },
      { value: "connect", weight: 4 },
      { value: "collaborate", weight: 5 },
      { value: "reach", weight: 5 },
      { value: "hire", weight: 3 },
    ],
    synonyms: [
      { value: "get in touch", weight: 7 },
      { value: "find you", weight: 5 },
    ],
    phrases: [
      { value: "how can i reach you", weight: 9 },
      { value: "where can i find you", weight: 8 },
      { value: "hire you", weight: 7 },
    ],
  },
  {
    intent: "github",
    keywords: [
      { value: "github", weight: 7 },
      { value: "repo", weight: 6 },
      { value: "repository", weight: 6 },
      { value: "repositories", weight: 6 },
      { value: "code", weight: 2 },
      { value: "link", weight: 2 },
    ],
    synonyms: [
      { value: "source code", weight: 8 },
      { value: "code online", weight: 7 },
      { value: "live demo", weight: 6 },
      { value: "website link", weight: 5 },
    ],
    phrases: [
      { value: "do you have code online", weight: 9 },
      { value: "open github", weight: 9 },
      { value: "show source code", weight: 9 },
    ],
  },
  {
    intent: "blog",
    keywords: [
      { value: "blog", weight: 6 },
      { value: "articles", weight: 6 },
      { value: "posts", weight: 5 },
      { value: "tutorials", weight: 5 },
      { value: "read", weight: 2 },
    ],
    synonyms: [{ value: "writing", weight: 4 }],
    phrases: [
      { value: "read something", weight: 7 },
      { value: "show blog", weight: 8 },
      { value: "show articles", weight: 8 },
    ],
  },
];

const contextualSuggestions: Record<string, string[]> = {
  about: ["Show my projects", "My tech stack", "Here's my resume", "Contact me"],
  projects: ["Which project should I check first?", "Show React projects", "Open GitHub", "Show resume"],
  filteredProjects: ["Which project should I check first?", "Open GitHub", "My tech stack", "Show resume"],
  recommendation: ["Open it", "Give me the link", "Show React projects", "Open resume"],
  resume: ["Show projects", "Contact me", "What skills do you have?"],
  downloadResume: ["Show projects", "Contact me", "What skills do you have?"],
  skills: ["Show projects using React", "Show your best project", "Open resume"],
  contact: ["Show resume", "Open GitHub", "Show projects"],
  github: ["Show projects", "Which project should I check first?", "Contact me"],
  blog: ["Show projects", "My tech stack", "Contact me"],
  help: ["Show projects", "Open resume", "My tech stack", "Contact me"],
  unknown: ["Show projects", "Open resume", "My tech stack", "Contact me"],
};

const commandIntent: Record<string, PortfolioIntent> = {
  "/about": "about",
  "/projects": "projects",
  "/resume": "resume",
  "/skills": "skills",
  "/contact": "contact",
  "/github": "github",
  "/blog": "blog",
  "/help": "help",
};

export const createAssistantMemory = (): AssistantMemory => ({
  lastIntent: null,
  lastTopic: null,
  lastShownProjectIds: [],
  lastRecommendedProjectId: null,
  lastOpenedApp: null,
  lastExternalLink: null,
  lastCardsShown: [],
  lastSuggestions: [...portfolioData.quickPrompts],
  conversationCount: 0,
  currentMode: "auto",
});

const normalize = (input: string) =>
  input
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesWord = (input: string, value: string) =>
  value.includes(" ")
    ? input.includes(value)
    : input.split(" ").includes(value);

const scoreTerms = (input: string, terms: WeightedPhrase[]) =>
  terms.reduce((total, term) => total + (includesWord(input, term.value) ? term.weight : 0), 0);

const scoreIntent = (input: string, rule: IntentRule) =>
  scoreTerms(input, rule.keywords) +
  scoreTerms(input, rule.synonyms) +
  scoreTerms(input, rule.phrases) +
  (rule.phrases.some((phrase) => input === phrase.value) ? 3 : 0);

const detectIntent = (input: string) => {
  const ranked = intentRules
    .map((rule) => ({ intent: rule.intent, score: scoreIntent(input, rule) }))
    .sort((left, right) => right.score - left.score);
  const winner = ranked[0];
  const confidence = winner ? Math.min(1, winner.score / 12) : 0;

  return winner && winner.score >= MINIMUM_CONFIDENCE_SCORE
    ? { intent: winner.intent, confidence, score: winner.score }
    : { intent: "unknown" as const, confidence: 0, score: 0 };
};

const getProjectById = (id: string | null) =>
  portfolioData.projects.find((project) => project.id === id);

const getRecentProject = (memory: AssistantMemory) =>
  getProjectById(memory.lastRecommendedProjectId) ||
  getProjectById(memory.lastShownProjectIds[0] || null);

const getRecommendedProject = () =>
  [...portfolioData.projects].sort(
    (left, right) => Number(right.featured) - Number(left.featured) || right.priority - left.priority,
  )[0];

const filterProjects = (input: string) => {
  const requestedTerms = ["react", "typescript", "vite", "frontend", "front end", "ui", "web development"]
    .filter((term) => input.includes(term));

  if (requestedTerms.length === 0) {
    return portfolioData.projects.filter((project) =>
      project.category === "frontend" || project.category === "portfolio",
    );
  }

  const matches = portfolioData.projects.filter((project) => {
    const searchable = [project.category, ...project.stack, ...project.tags].join(" ").toLowerCase();
    return requestedTerms.some((term) => searchable.includes(term.replace("front end", "frontend")));
  });

  return matches.length > 0 ? matches : portfolioData.projects;
};

const createBlogCards = (): PortfolioCard[] =>
  portfolioData.blogPosts.map((post) => ({
    id: `blog-${post.id}`,
    type: "blog",
    title: post.title,
    description: `${post.date} · Development article linked from this portfolio.`,
    accent: "orange",
    actions: [{ label: "Read", action: { type: "openExternal", href: post.url }, emphasis: "primary" }],
  }));

const createGithubCard = (): PortfolioCard => ({
  id: "github-link",
  type: "link",
  title: "GitHub",
  description: "Explore the repositories and source links connected to my portfolio.",
  accent: "purple",
  actions: portfolioData.contact.github
    ? [{ label: "Open GitHub", action: { type: "openExternal", href: portfolioData.contact.github }, emphasis: "primary" }]
    : [],
});

const getOpenedApp = (action?: PortfolioAction): PortfolioAppId | null => {
  if (!action) return null;
  if (action.type === "openApp") return action.appId;
  if (action.type === "openProject") return "finder";
  if (action.type === "openResume") return "resume";
  if (action.type === "showProjects") return "finder";
  if (action.type === "showContact") return "contact";
  return null;
};

const completeResult = (
  memory: AssistantMemory,
  response: Omit<PortfolioAssistantResponse, "suggestions"> & { suggestions?: string[] },
  options: {
    topic?: string;
    shownProjects?: PortfolioProject[];
    recommendedProject?: PortfolioProject;
  } = {},
): PortfolioAssistantResult => {
  const suggestions = response.suggestions || contextualSuggestions[response.intent] || contextualSuggestions.unknown;
  const cards = response.cards || [];
  const nextMemory: AssistantMemory = {
    ...memory,
    lastIntent: response.intent,
    lastTopic: options.topic || response.intent,
    lastShownProjectIds: options.shownProjects
      ? options.shownProjects.map((project) => project.id)
      : memory.lastShownProjectIds,
    lastRecommendedProjectId: options.recommendedProject?.id || memory.lastRecommendedProjectId,
    lastOpenedApp: getOpenedApp(response.autoAction) || memory.lastOpenedApp,
    lastExternalLink:
      response.autoAction?.type === "openExternal"
        ? response.autoAction.href
        : memory.lastExternalLink,
    lastCardsShown: cards.map((card) => card.id),
    lastSuggestions: suggestions,
    conversationCount: memory.conversationCount + 1,
  };

  return { response: { ...response, suggestions }, memory: nextMemory };
};

const respondToRecommendation = (memory: AssistantMemory, confidence = 1) => {
  const project = getRecommendedProject();
  return completeResult(
    memory,
    {
      intent: "recommendation",
      confidence,
      message: `I'd start with ${project.title}. ${project.whyItMatters}`,
      cards: [createProjectCard(project)],
      thinkingLabel: "Choosing the strongest portfolio example...",
    },
    { topic: "projects", shownProjects: [project], recommendedProject: project },
  );
};

const respondToProjectFollowUp = (
  input: string,
  memory: AssistantMemory,
): PortfolioAssistantResult | null => {
  const project = getRecentProject(memory);
  const projectContext = memory.lastTopic === "projects" || memory.lastShownProjectIds.length > 0;

  if (/^(which one|which project|best one|recommend one)|which one is best/.test(input) && projectContext) {
    return respondToRecommendation(memory);
  }

  if (/^(open it|open that|open project)$/.test(input)) {
    if (!project) return null;
    const href = project.liveUrl || project.githubUrl;
    return completeResult(
      memory,
      {
        intent: "projectFollowUp",
        confidence: 1,
        message: href
          ? `Opening ${project.title}. I only use the verified link currently stored for this project.`
          : `I don't have an external link stored for ${project.title} yet, so I'll open the Projects app instead.`,
        cards: [createProjectCard(project)],
        autoAction: href ? { type: "openExternal", href } : { type: "openApp", appId: "finder" },
        thinkingLabel: "Finding the most recent project...",
      },
      { topic: "projects", shownProjects: [project], recommendedProject: project },
    );
  }

  if (/^(give me (the )?link|show (me )?(the )?link|project link)$/.test(input) && projectContext) {
    if (!project) return null;
    return completeResult(
      memory,
      {
        intent: "projectFollowUp",
        confidence: 1,
        message: `Here are the verified links currently available for ${project.title}.`,
        cards: [createProjectCard(project)],
        thinkingLabel: "Checking the saved project links...",
      },
      { topic: "projects", shownProjects: [project], recommendedProject: project },
    );
  }

  if (/^(give me (the )?github|project github|github link)$/.test(input) && projectContext) {
    if (!project) return null;
    return completeResult(
      memory,
      {
        intent: "projectFollowUp",
        confidence: 1,
        message: project.githubUrl
          ? `Here's the verified GitHub action for ${project.title}.`
          : `I haven't added a GitHub link for ${project.title} yet.`,
        cards: [createProjectCard(project)],
        thinkingLabel: "Checking the project's GitHub link...",
      },
      { topic: "projects", shownProjects: [project], recommendedProject: project },
    );
  }

  if (/^(show more|more projects|what else)$/.test(input) && projectContext) {
    const projects = portfolioData.projects;
    return completeResult(
      memory,
      {
        intent: "projects",
        confidence: 1,
        message: "Here are all the projects currently available in my local portfolio data.",
        cards: projects.map(createProjectCard),
        thinkingLabel: "Loading the rest of my project list...",
      },
      { topic: "projects", shownProjects: projects },
    );
  }

  return null;
};

const respondToIntent = (
  intent: PortfolioIntent,
  confidence: number,
  input: string,
  memory: AssistantMemory,
): PortfolioAssistantResult => {
  switch (intent) {
    case "about":
      return completeResult(memory, {
        intent,
        confidence,
        message: portfolioData.profile.about,
        cards: portfolioHomeCards,
        thinkingLabel: "Looking through my portfolio profile...",
      });
    case "projects": {
      const projects = portfolioData.projects;
      return completeResult(
        memory,
        {
          intent,
          confidence,
          message: "These are the projects currently in my portfolio. I'll open the Projects app too, so you can explore their files and links.",
          cards: projects.map(createProjectCard),
          autoAction: { type: "openApp", appId: "finder" },
          thinkingLabel: "Gathering my project cards...",
        },
        { topic: "projects", shownProjects: projects },
      );
    }
    case "filteredProjects": {
      const projects = filterProjects(input);
      return completeResult(
        memory,
        {
          intent,
          confidence,
          message: "Here are the closest frontend-focused projects I can verify from my local portfolio data.",
          cards: [skillsCard, ...projects.map(createProjectCard)],
          thinkingLabel: "Filtering projects by stack and tags...",
        },
        { topic: "projects", shownProjects: projects },
      );
    }
    case "resume":
      return completeResult(memory, {
        intent,
        confidence,
        message: "Here's my resume. I'd suggest checking my projects too, because they show my practical work better than text alone.",
        cards: [resumeCard],
        autoAction: { type: "openResume" },
        thinkingLabel: "Opening the verified resume...",
      });
    case "skills": {
      const proofProjects = filterProjects("frontend react").slice(0, 2);
      return completeResult(
        memory,
        {
          intent,
          confidence,
          message: `My current portfolio lists ${portfolioData.skills.groups.map((group) => group.items.join(", ")).join("; ")}. These project cards show where some of that frontend work appears.`,
          cards: [skillsCard, ...proofProjects.map(createProjectCard)],
          autoAction: { type: "openApp", appId: "terminal" },
          thinkingLabel: "Matching skills with project evidence...",
        },
        { topic: "skills", shownProjects: proofProjects },
      );
    }
    case "contact":
      return completeResult(memory, {
        intent,
        confidence,
        message: portfolioData.contact.email
          ? "You can reach me through the verified contact options below."
          : "You can connect with me through the verified GitHub and LinkedIn links below. I haven't added a direct email to my portfolio data yet.",
        cards: [contactCard],
        autoAction: { type: "openApp", appId: "contact" },
        thinkingLabel: "Checking my saved contact links...",
      });
    case "github":
      return completeResult(memory, {
        intent,
        confidence,
        message: portfolioData.contact.github
          ? "Here's my verified GitHub link. You can use it to explore the repositories connected to this portfolio."
          : "I haven't added a GitHub link to my portfolio data yet.",
        cards: [createGithubCard()],
        thinkingLabel: "Checking my verified repository links...",
      });
    case "blog":
      return completeResult(memory, {
        intent,
        confidence,
        message: "Here are the development articles currently linked from my portfolio. I don't claim authorship unless the data says so.",
        cards: createBlogCards(),
        thinkingLabel: "Collecting the saved article links...",
      });
    case "help":
      return completeResult(memory, {
        intent,
        confidence: 1,
        message: `Available commands: ${portfolioData.commands.join(", ")}. You can also ask naturally about my work.`,
        cards: portfolioHomeCards,
        thinkingLabel: "Loading local commands...",
      });
    default:
      return completeResult(memory, {
        intent: "unknown",
        confidence: 0,
        message: "I may not have that exact detail in my portfolio data yet, but I can still show you my projects, resume, skills, blog, GitHub, or contact info.",
        thinkingLabel: "Checking what my portfolio can answer...",
      });
  }
};

const localRespond = (userInput: string, memory: AssistantMemory): PortfolioAssistantResult => {
  const input = normalize(userInput);

  if (!input) {
    return respondToIntent("unknown", 0, input, memory);
  }

  if (/^(hi|hello|hey|namaste)$/.test(input)) {
    return completeResult(memory, {
      intent: "greeting",
      confidence: 1,
      message: `Hey, I'm ${portfolioData.profile.name} 👋 ${portfolioData.profile.shortIntro}`,
      cards: portfolioHomeCards,
      suggestions: contextualSuggestions.about,
      thinkingLabel: "Getting my portfolio ready...",
    });
  }

  if (/why should.*hire|why hire|good fit/.test(input)) {
    const project = getRecommendedProject();
    return completeResult(
      memory,
      {
        intent: "hire",
        confidence: 1,
        message: `My portfolio shows how I approach practical UI, state, and product problems. ${project.whyItMatters} I haven't added claims beyond the work and resume available here.`,
        cards: [createProjectCard(project), resumeCard],
        suggestions: ["Explain your best project", "Show resume", "My tech stack", "Contact me"],
        thinkingLabel: "Connecting my skills to practical work...",
      },
      { topic: "projects", shownProjects: [project], recommendedProject: project },
    );
  }

  if (/what (are you|im) learning|currently learning/.test(input)) {
    const learning = portfolioData.skills.currentlyLearning;
    return completeResult(memory, {
      intent: "learning",
      confidence: 1,
      message: learning.length
        ? `I'm currently learning ${learning.join(", ")}.`
        : "I haven't added a currently-learning list to my portfolio data yet. You can still inspect my verified tech stack and projects.",
      cards: [skillsCard],
      suggestions: contextualSuggestions.skills,
      thinkingLabel: "Checking my current learning notes...",
    });
  }

  if (/what is this portfolio|explain (this|your) portfolio/.test(input)) {
    return completeResult(memory, {
      intent: "portfolioBuild",
      confidence: 1,
      message: "This is my macOS-style interactive portfolio: projects, resume, skills, contact links, and local portfolio guidance are presented as apps inside one React experience.",
      cards: [createProjectCard(getRecommendedProject()), skillsCard],
      suggestions: contextualSuggestions.about,
      thinkingLabel: "Summarizing how Macfolio works...",
    });
  }

  const command = commandIntent[input];
  if (command) {
    return respondToIntent(command, 1, input, memory);
  }

  const contextualResponse = respondToProjectFollowUp(input, memory);
  if (contextualResponse) return contextualResponse;

  if (/download/.test(input) && /resume|cv/.test(input)) {
    return completeResult(memory, {
      intent: "downloadResume",
      confidence: 1,
      message: portfolioData.resume.isDownloadAvailable
        ? "My verified resume PDF is ready to download. You can also open it inside Macfolio."
        : "PDF download will be available once I add the resume file. I can still open the Resume app here.",
      cards: [resumeCard],
      autoAction: { type: "openResume" },
      thinkingLabel: "Checking the resume file...",
    });
  }

  if (/which project|best project|recommend (a |one)|check first/.test(input)) {
    return respondToRecommendation(memory);
  }

  if (/portfolio/.test(input) && /built with|made with|tech|stack/.test(input)) {
    return completeResult(memory, {
      intent: "portfolioBuild",
      confidence: 1,
      message: "I built Macfolio with React, TypeScript modules, Vite, Zustand, and a feature-based macOS-style window architecture.",
      cards: [skillsCard, createProjectCard(getRecommendedProject())],
      suggestions: contextualSuggestions.skills,
      thinkingLabel: "Reading this project's verified stack...",
    });
  }

  const detected = detectIntent(input);
  return respondToIntent(detected.intent, detected.confidence, input, memory);
};

export const runLocalAssistant = localRespond;

export const askPortfolioAssistant = (
  userInput: string,
  memory: AssistantMemory = createAssistantMemory(),
): PortfolioAssistantResult => runLocalAssistant(userInput, memory);

// The async local provider adapter lives in assistantProviders/localProvider.ts.
