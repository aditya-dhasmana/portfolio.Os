/**
 * PURPOSE:
 * Render Macfolio Chat V2 inside the Safari window.
 * RESPONSIBILITY:
 * Own session UI state, thinking polish, contextual suggestions, cards, and portfolio action dispatch.
 * USED BY:
 * The desktop application window registry.
 * DEPENDS ON:
 * The local portfolio provider, portfolio data, Finder navigation, and desktop window store.
 * SHOULD NOT HANDLE:
 * Intent scoring, recommendation rules, portfolio facts, remote AI requests, or global window mechanics.
 * SCALING NOTES:
 * Keep provider-independent rendering here so future providers can reuse the same response contract.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  Code2,
  ContactRound,
  Copy,
  FileText,
  FolderKanban,
  Link,
  MessageCircleMore,
  PanelLeft,
  Plus,
  Send,
  Share,
  ShieldHalf,
  Sparkles,
  UserRound,
} from "lucide-react";

import { portfolioData, portfolioHomeCards } from "../data/portfolioData";
import { createAssistantMemory } from "../lib/portfolioAssistant";
import {
  AI_RATE_LIMIT_NOTICE,
  hybridProvider,
} from "../lib/assistantProviders/hybridProvider";
import { isAssistantMode } from "../lib/assistantTypes";
import { useDataStore, useLocationStore } from "#store";
import WindowControls from "../features/desktop-shell/components/WindowControls";
import windowWrapper from "../features/desktop-shell/hoc/windowWrapper";
import useWindowStore from "../features/desktop-shell/store/windowStore";

import "./Safari.css";

const RESPONSE_DELAY_MS = 450;
const QUICK_PROMPT_DEBOUNCE_MS = 500;
const configuredMode = import.meta.env.VITE_ASSISTANT_DEFAULT_MODE || "auto";
const DEFAULT_ASSISTANT_MODE = isAssistantMode(configuredMode) ? configuredMode : "auto";

const cardIcons = {
  project: FolderKanban,
  resume: FileText,
  skills: Code2,
  blog: MessageCircleMore,
  contact: ContactRound,
  link: Link,
};

const promptIcons = [UserRound, FolderKanban, FileText, Code2, ContactRound];

const initialMessages = [
  { id: "initial-user", role: "user", text: "Hey! Can you introduce yourself?" },
  {
    id: "initial-assistant",
    role: "assistant",
    response: {
      intent: "about",
      confidence: 1,
      message: portfolioData.profile.about,
      cards: portfolioHomeCards,
      suggestions: [...portfolioData.quickPrompts],
      source: "local",
      usedGemini: false,
    },
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const Safari = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [mode, setMode] = useState(DEFAULT_ASSISTANT_MODE);
  const [memory, setMemory] = useState(() => ({
    ...createAssistantMemory(),
    currentMode: DEFAULT_ASSISTANT_MODE,
  }));
  const [suggestions, setSuggestions] = useState([...portfolioData.quickPrompts]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assistantStatus, setAssistantStatus] = useState("Local brain ready");
  const transcriptRef = useRef(null);
  const messageIdRef = useRef(0);
  const pendingTimerRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const lastQuickPromptAtRef = useRef(0);
  const isMountedRef = useRef(true);
  const { openWindow } = useWindowStore();
  const { work } = useDataStore();
  const { navigateTo } = useLocationStore();

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    };
  }, []);

  const rememberOpenedApp = (appId) => {
    setMemory((current) => ({ ...current, lastOpenedApp: appId }));
  };

  const rememberExternalLink = (href) => {
    setMemory((current) => ({ ...current, lastExternalLink: href }));
  };

  const openProjects = () => {
    if (work) navigateTo([work]);
    openWindow("finder", { root: work || null });
    rememberOpenedApp("finder");
  };

  const openProject = (projectId) => {
    const project = work?.children?.find((item) => String(item.id) === projectId);

    if (!work || !project) {
      openProjects();
      return;
    }

    navigateTo([work, project]);
    openWindow("finder", { root: project });
    rememberOpenedApp("finder");
  };

  const runAction = (action) => {
    if (!action) return;

    switch (action.type) {
      case "openApp":
        if (action.appId === "finder") openProjects();
        else {
          openWindow(action.appId);
          rememberOpenedApp(action.appId);
        }
        break;
      case "openProject":
        openProject(action.projectId);
        break;
      case "openResume":
        openWindow("resume");
        rememberOpenedApp("resume");
        break;
      case "showProjects":
        openProjects();
        break;
      case "showContact":
        openWindow("contact");
        rememberOpenedApp("contact");
        break;
      case "downloadFile": {
        const anchor = document.createElement("a");
        anchor.href = action.href;
        anchor.download = action.fileName;
        anchor.rel = "noopener";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        break;
      }
      case "openExternal":
        if (action.href) {
          rememberExternalLink(action.href);
          window.open(action.href, "_blank", "noopener,noreferrer");
        }
        break;
      case "showBlog":
        submitQuestion("/blog");
        break;
      default:
        break;
    }
  };

  const submitQuestion = async (question) => {
    const value = question.trim();
    if (!value || isSubmittingRef.current) return;

    isSubmittingRef.current = true;

    messageIdRef.current += 1;
    const id = messageIdRef.current;
    const thinkingId = `thinking-${id}`;
    const thinkingText =
      mode === "local"
        ? "Looking through my local portfolio..."
        : mode === "ai"
          ? "Enhancing my local answer..."
          : "Looking through my portfolio...";

    setInput("");
    setIsGenerating(true);
    setAssistantStatus(mode === "local" ? "Local brain ready" : "Thinking...");
    setMessages((current) => [
      ...current,
      { id: `user-${id}`, role: "user", text: value },
      {
        id: thinkingId,
        role: "thinking",
        text: thinkingText,
      },
    ]);

    const minimumDelay = new Promise((resolve) => {
      pendingTimerRef.current = setTimeout(resolve, RESPONSE_DELAY_MS);
    });

    try {
      const [result] = await Promise.all([
        hybridProvider.respond({
          input: value,
          memory: { ...memory, currentMode: mode },
          mode,
        }),
        minimumDelay,
      ]);

      if (!isMountedRef.current) return;

      setMessages((current) => [
        ...current.filter((message) => message.id !== thinkingId),
        { id: `assistant-${id}`, role: "assistant", response: result.response },
      ]);
      setMemory({ ...result.memory, currentMode: mode });
      setSuggestions(result.response.suggestions);
      setAssistantStatus(
        result.response.source === "gemini"
          ? "AI enhanced"
          : result.response.notice === AI_RATE_LIMIT_NOTICE
            ? "AI cooling down"
            : result.response.source === "local-fallback"
              ? "Using local fallback"
              : "Local brain ready",
      );

      if (result.response.autoAction) {
        runAction(result.response.autoAction);
      }
    } finally {
      isSubmittingRef.current = false;
      pendingTimerRef.current = null;
      if (isMountedRef.current) setIsGenerating(false);
    }
  };

  const submitQuickPrompt = (prompt) => {
    const now = Date.now();
    if (now - lastQuickPromptAtRef.current < QUICK_PROMPT_DEBOUNCE_MS) return;

    lastQuickPromptAtRef.current = now;
    submitQuestion(prompt);
  };

  const handleModeChange = (nextMode) => {
    if (isGenerating || nextMode === mode) return;

    setMode(nextMode);
    setMemory((current) => ({ ...current, currentMode: nextMode }));
    setAssistantStatus(nextMode === "local" ? "Local brain ready" : "Ready to enhance");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitQuestion(input);
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitQuestion(input);
    }
  };

  const renderCardAction = (cardId, cardAction) => {
    const { action, label } = cardAction;
    const className = cardAction.emphasis === "primary" ? "is-primary" : "";

    if (action.type === "downloadFile") {
      return (
        <a
          key={`${cardId}-${label}`}
          href={action.href}
          download={action.fileName}
          className={className}
        >
          <ArrowDownToLine aria-hidden="true" />
          {label}
        </a>
      );
    }

    return (
      <button
        key={`${cardId}-${label}`}
        type="button"
        className={className}
        onClick={() => runAction(action)}
      >
        {action.type === "openExternal" ? <Link aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
        {label}
      </button>
    );
  };

  return (
    <div className="portfolio-safari">
      <div id="window-header" className="safari-toolbar">
        <div className="safari-toolbar__group">
          <WindowControls target="safari" />
          <PanelLeft className="icon safari-toolbar__muted" />
          <ChevronLeft className="icon safari-toolbar__muted" />
          <ChevronRight className="icon safari-toolbar__muted" />
        </div>

        <div className="safari-toolbar__address" aria-label="Portfolio address">
          <ShieldHalf className="icon" />
          <span>ask://aditya</span>
        </div>

        <div className="safari-toolbar__group safari-toolbar__actions">
          <Share className="icon" />
          <Plus className="icon" />
          <Copy className="icon" />
        </div>
      </div>

      <div className="portfolio-chat no-drag" role="main">
        <header className="portfolio-chat__intro">
          <div className="portfolio-avatar" aria-label={portfolioData.profile.avatarLabel}>👨🏻</div>
          <h1>
            Hi, I'm <span>Aditya</span> <span aria-hidden="true">👋</span>
          </h1>
          <p>{portfolioData.profile.subtitle}</p>
          <div className="portfolio-agent-controls">
            <div className="portfolio-mode-selector" role="group" aria-label="Assistant mode">
              {[
                ["auto", "Auto"],
                ["local", "Local"],
                ["ai", "AI Enhanced"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={mode === value}
                  disabled={isGenerating}
                  onClick={() => handleModeChange(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className={`portfolio-agent-status portfolio-agent-status--${assistantStatus.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}>
              <i aria-hidden="true" />
              {assistantStatus}
            </span>
          </div>
        </header>

        <section className="portfolio-prompts" aria-label="Suggested questions">
          {suggestions.slice(0, 5).map((prompt, index) => {
            const PromptIcon = promptIcons[index] || Sparkles;
            return (
              <button
                key={prompt}
                type="button"
                disabled={isGenerating}
                onClick={() => submitQuickPrompt(prompt)}
              >
                <PromptIcon aria-hidden="true" />
                {prompt}
              </button>
            );
          })}
        </section>

        <section ref={transcriptRef} className="portfolio-transcript" aria-live="polite">
          {messages.map((message) => {
            if (message.role === "user") {
              return (
                <div key={message.id} className="portfolio-message portfolio-message--user">
                  <div className="portfolio-message__bubble">{message.text}</div>
                  <small>Now · ✓</small>
                </div>
              );
            }

            if (message.role === "thinking") {
              return (
                <div key={message.id} className="portfolio-thinking" role="status">
                  <div className="portfolio-response__avatar" aria-hidden="true">👨🏻</div>
                  <div className="portfolio-thinking__bubble">
                    <span>{message.text}</span>
                    <span className="portfolio-thinking__dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className="portfolio-response">
                <div className="portfolio-response__message">
                  <div className="portfolio-response__avatar" aria-hidden="true">👨🏻</div>
                  <div>
                    <div className="portfolio-message__bubble">{message.response.message}</div>
                    <small>
                      Aditya's portfolio voice · {message.response.usedGemini ? "AI-enhanced local response" : "Local response"} · {Math.round(message.response.confidence * 100)}% match
                    </small>
                    {message.response.notice && (
                      <div className="portfolio-response__notice">{message.response.notice}</div>
                    )}
                  </div>
                </div>

                {message.response.cards?.length > 0 && (
                  <div className="portfolio-cards">
                    {message.response.cards.map((card) => {
                      const CardIcon = cardIcons[card.type] || Sparkles;
                      return (
                        <article key={card.id} className={`portfolio-card portfolio-card--${card.accent}`}>
                          <div className="portfolio-card__heading">
                            <span><CardIcon aria-hidden="true" /></span>
                            <h2>{card.title}</h2>
                          </div>
                          <p>{card.description}</p>
                          {card.tags?.length > 0 && (
                            <div className="portfolio-card__tags">{card.tags.join(" · ")}</div>
                          )}
                          <div className="portfolio-card__actions">
                            {card.actions.map((cardAction) => renderCardAction(card.id, cardAction))}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}

                {message.response.quickActions?.length > 0 && (
                  <div className="portfolio-response__actions">
                    {message.response.quickActions.map(({ label, action }) =>
                      action.type === "downloadFile" ? (
                        <a key={label} href={action.href} download={action.fileName}>
                          <ArrowDownToLine />
                          {label}
                        </a>
                      ) : (
                        <button key={label} type="button" onClick={() => runAction(action)}>
                          <Link />
                          {label}
                        </button>
                      ),
                    )}
                  </div>
                )}

                {message.response.suggestions.length > 0 && (
                  <div className="portfolio-response__actions portfolio-response__suggestions">
                    {message.response.suggestions.slice(0, 4).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        disabled={isGenerating}
                        onClick={() => submitQuickPrompt(suggestion)}
                      >
                        <Sparkles />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <form className="portfolio-composer" onSubmit={handleSubmit}>
          <MessageCircleMore aria-hidden="true" />
          <label className="sr-only" htmlFor="portfolio-question">Ask about Aditya's work</label>
          <textarea
            id="portfolio-question"
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder={isGenerating ? "Looking through my portfolio..." : "Ask me anything about my work..."}
            autoComplete="off"
            disabled={isGenerating}
          />
          <button type="submit" aria-label="Send question" disabled={!input.trim() || isGenerating}>
            <Send aria-hidden="true" />
          </button>
        </form>

        <footer>Built with ❤️ by Aditya <span>•</span> Fast <span>•</span> Private <span>•</span> Always available</footer>
      </div>
    </div>
  );
};

export default windowWrapper(Safari, "safari");
