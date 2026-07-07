# 0014 — Keep Gemini as an enhancement layer

## Status

Accepted

## Decision

The local provider always runs first and remains authoritative for facts, memory, cards, links, files, and app actions. Gemini may replace only response wording, suggestions, and optional confidence after server validation.

## Why

The portfolio must remain fast, honest, and usable without a key, network, quota, or third-party service. Local-first execution also prevents model output from inventing executable links or window actions.

## Tradeoffs

- Benefit: complete offline behavior and deterministic actions.
- Benefit: AI failures degrade quietly to a useful answer.
- Benefit: API credentials remain server-only.
- Cost: Gemini cannot introduce new tools or actions dynamically.
- Cost: the backend must receive a small duplicate of public portfolio context.

## Revisit when

Only reconsider action authority if actions are represented by a strict server-validated capability registry and the product genuinely needs model-selected tools.
