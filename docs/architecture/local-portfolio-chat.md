# Local Portfolio Chat Architecture

## What problem this solves

Safari previously displayed a static article list. It now acts as Aditya's first-person portfolio guide while keeping all answers honest, local, and available offline.

## Responsibilities and ownership

- `src/data/portfolioData.ts` owns verified portfolio facts, project ranking metadata, and reusable card contracts.
- `src/lib/portfolioAssistant.ts` owns weighted intent scoring, confidence, slash commands, contextual follow-ups, recommendations, and memory transitions.
- `src/windows/Safari.jsx` owns chat presentation, session memory state, the short thinking delay, and translation of actions into existing window-store calls.
- `src/windows/Safari.css` owns Safari-only visual rules.
- The desktop window store still owns opening, focusing, and positioning apps.
- The Finder location store still owns project navigation.

## Data flow

Visitor question → Safari UI → local provider + recent memory → scored intent → structured response + updated memory → cards/actions → existing app or verified external link

The UI never needs to know how intent scoring works. The assistant never needs to know how a Finder or Resume window opens. Memory stores recent identifiers and topics rather than rendered components.

## Session memory

The memory boundary records the last intent, topic, shown projects, recommended project, opened app, cards, suggestions, and conversation count. It exists only for the mounted Safari session. It is deliberately not stored globally or persisted yet.

This supports predictable follow-ups such as:

- `show projects` → remember shown project IDs
- `which one is best?` → rank the verified featured/high-priority project
- `open it` → use the most recently recommended project link
- `give me the link` → show actions for the remembered project

## Scaling boundary

A future AI provider can implement `PortfolioAssistantProvider` and return the same result shape. The local provider should remain the default offline fallback. Portfolio facts should continue to come from the data layer, not from prompt text or UI components.
