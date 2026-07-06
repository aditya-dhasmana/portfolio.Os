/**
 * PURPOSE:
 * Render Aditya's local first-person portfolio chat inside the Safari window.
 * RESPONSIBILITY:
 * Present the chat UI, collect questions, render structured responses, and dispatch approved portfolio actions.
 * USED BY:
 * The desktop application window registry.
 * DEPENDS ON:
 * The local portfolio assistant, portfolio data, Finder navigation, and desktop window store.
 * SHOULD NOT HANDLE:
 * Intent definitions, portfolio facts, remote AI requests, or global window mechanics.
 * SCALING NOTES:
 * Keep provider-independent response rendering here so a future assistant provider can reuse the UI.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
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
import { askPortfolioAssistant } from "../lib/portfolioAssistant";
import { useDataStore, useLocationStore } from "#store";
import WindowControls from "../features/desktop-shell/components/WindowControls";
import windowWrapper from "../features/desktop-shell/hoc/windowWrapper";
import useWindowStore from "../features/desktop-shell/store/windowStore";

import "./Safari.css";

const cardIcons = {
  project: FolderKanban,
  resume: FileText,
  skills: Code2,
  blog: MessageCircleMore,
  contact: ContactRound,
};

const promptIcons = [UserRound, FolderKanban, FileText, Code2, ContactRound];

const initialMessages = [
  { id: "initial-user", role: "user", text: "Hey! Can you introduce yourself?" },
  {
    id: "initial-assistant",
    role: "assistant",
    response: {
      intent: "about",
      message: portfolioData.profile.about,
      cards: portfolioHomeCards,
    },
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const Safari = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const transcriptRef = useRef(null);
  const messageIdRef = useRef(0);
  const { openWindow } = useWindowStore();
  const { work } = useDataStore();
  const { navigateTo } = useLocationStore();

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages]);

  const openProjects = () => {
    if (work) navigateTo([work]);
    openWindow("finder", { root: work || null });
  };

  const runAction = (action) => {
    if (!action) return;

    switch (action.type) {
      case "openApp":
        if (action.appId === "finder") openProjects();
        else openWindow(action.appId);
        break;
      case "openResume":
        openWindow("resume");
        break;
      case "showProjects":
        openProjects();
        break;
      case "showContact":
        openWindow("contact");
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
        if (action.href) window.open(action.href, "_blank", "noopener,noreferrer");
        break;
      case "showBlog":
      default:
        break;
    }
  };

  const submitQuestion = (question) => {
    const value = question.trim();
    if (!value) return;

    const response = askPortfolioAssistant(value);
    messageIdRef.current += 1;
    const id = messageIdRef.current;

    setMessages((current) => [
      ...current,
      { id: `user-${id}`, role: "user", text: value },
      { id: `assistant-${id}`, role: "assistant", response },
    ]);
    setInput("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitQuestion(input);
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
            Hi, I’m <span>Aditya</span> <span aria-hidden="true">👋</span>
          </h1>
          <p>{portfolioData.profile.subtitle}</p>
        </header>

        <section className="portfolio-prompts" aria-label="Suggested questions">
          {portfolioData.quickPrompts.map((prompt, index) => {
            const PromptIcon = promptIcons[index];
            return (
              <button key={prompt} type="button" onClick={() => submitQuestion(prompt)}>
                <PromptIcon aria-hidden="true" />
                {prompt}
              </button>
            );
          })}
        </section>

        <section ref={transcriptRef} className="portfolio-transcript" aria-live="polite">
          {messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="portfolio-message portfolio-message--user">
                <div className="portfolio-message__bubble">{message.text}</div>
                <small>Now · ✓</small>
              </div>
            ) : (
              <div key={message.id} className="portfolio-response">
                <div className="portfolio-response__message">
                  <div className="portfolio-response__avatar" aria-hidden="true">👨🏻</div>
                  <div>
                    <div className="portfolio-message__bubble">{message.response.message}</div>
                    <small>Aditya’s portfolio voice · Local response</small>
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
                          {card.technologies?.length > 0 && (
                            <div className="portfolio-card__tags">{card.technologies.join(" · ")}</div>
                          )}
                          <button type="button" onClick={() => runAction(card.action)}>
                            {card.label}
                            <ArrowRight aria-hidden="true" />
                          </button>
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

                {message.response.suggestions?.length > 0 && (
                  <div className="portfolio-response__actions">
                    {message.response.suggestions.slice(0, 3).map((suggestion) => (
                      <button key={suggestion} type="button" onClick={() => submitQuestion(suggestion)}>
                        <Sparkles />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </section>

        <form className="portfolio-composer" onSubmit={handleSubmit}>
          <MessageCircleMore aria-hidden="true" />
          <label className="sr-only" htmlFor="portfolio-question">Ask about Aditya’s work</label>
          <input
            id="portfolio-question"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask me anything about my work..."
            autoComplete="off"
          />
          <button type="submit" aria-label="Send question" disabled={!input.trim()}>
            <Send aria-hidden="true" />
          </button>
        </form>

        <footer>Built with ❤️ by Aditya <span>•</span> Fast <span>•</span> Private <span>•</span> Always available</footer>
      </div>
    </div>
  );
};

export default windowWrapper(Safari, "safari");
