# Hybrid Portfolio Agent Architecture

## System overview

Macfolio Chat V3 is local-first. Every question is processed by the deterministic local provider before optional Gemini enhancement is considered.

```text
Safari question
→ local provider creates facts, cards, actions, suggestions, and next memory
→ hybrid policy checks Auto / Local / AI Enhanced mode
→ optional backend Gemini enhancement rewrites message and suggestions only
→ validated enhancement merges into the local result
→ Safari executes local actions through existing stores
```

## Ownership

- `portfolioData.ts` owns public portfolio facts and verified links.
- `portfolioAssistant.ts` owns deterministic intent scoring and memory transitions.
- `assistantTypes.ts` owns provider-independent contracts.
- `localProvider.ts` adapts the local engine to the asynchronous provider contract.
- `geminiProvider.ts` owns the browser-to-backend request and frontend timeout.
- `hybridProvider.ts` owns mode policy, merging, and fallback.
- `backend/src/server.js` owns `GEMINI_API_KEY`, Gemini prompt safety, bounds, per-client throttling, upstream timeout, and output validation.
- `Safari.jsx` owns mode selection, visual status, session state, and existing app/window action dispatch.

## Trust boundary

Gemini never controls cards, links, downloads, app IDs, or window actions. Those values are produced locally and merged unchanged. The backend receives public portfolio context, a bounded memory summary, and the local draft. It does not receive private browser data or a full conversation transcript.

## Modes

- Local: never performs an enhancement request.
- Auto: enhances flexible explanation intents while direct actions stay local.
- AI Enhanced: attempts enhancement for non-command questions and falls back locally on any failure.

## Scaling

A future provider implements `AssistantProvider`. The hybrid policy can choose it without changing Safari rendering or local action ownership.
