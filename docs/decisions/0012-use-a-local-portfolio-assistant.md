# 0012 — Use a local portfolio assistant before an AI provider

## Status

Accepted

## Decision

Use deterministic local intent matching over structured portfolio data. Do not connect Gemini or another external model yet.

## Why

The current feature needs predictable answers, privacy, offline availability, and zero invented portfolio claims. A scored keyword/synonym matcher is sufficient for the known question set and keeps behavior easy to test.

## Tradeoffs

- Benefit: fast, private, deterministic, and inexpensive.
- Benefit: action handling stays explicit and safe.
- Cost: it cannot answer arbitrary questions with natural-language flexibility.
- Cost: new intent families require a small rule update.

## When to revisit

Add a provider only when real user questions show that deterministic matching is the limiting factor. Preserve the local provider as a fallback and keep portfolio facts outside the provider.
