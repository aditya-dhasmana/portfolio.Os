# Local Portfolio Chat Architecture

## What problem this solves

Safari previously displayed a static article list. It now acts as Aditya's first-person portfolio guide while keeping all answers honest, local, and available offline.

## Responsibilities and ownership

- `src/data/portfolioData.ts` owns verified portfolio facts.
- `src/lib/portfolioAssistant.ts` owns question interpretation and structured responses.
- `src/windows/Safari.jsx` owns chat presentation and translates actions into existing window-store calls.
- `src/windows/Safari.css` owns Safari-only visual rules.
- The desktop window store still owns opening, focusing, and positioning apps.
- The Finder location store still owns project navigation.

## Data flow

Visitor question → Safari UI → local assistant → structured response → cards/actions → existing app or external link

The UI never needs to know how intent scoring works. The assistant never needs to know how a Finder or Resume window opens.

## Scaling boundary

A future AI provider can return the same `PortfolioAssistantResponse` shape. The local provider should remain the default offline fallback. Portfolio facts should continue to come from the data layer, not from prompt text or UI components.
