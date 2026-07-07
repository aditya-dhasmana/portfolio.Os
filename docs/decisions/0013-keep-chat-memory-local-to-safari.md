# 0013 — Keep chat session memory local to Safari

## Status

Accepted

## Decision

Safari owns the current `AssistantMemory` value and passes it into the local provider. The provider returns the next memory alongside its structured response. The memory is not persisted and is not added to Zustand.

## Why

Only Safari consumes conversation context today. Local component ownership keeps the dependency boundary small and ensures closing the chat naturally ends the session. Explicit input/output memory also keeps the provider pure and testable.

## Tradeoffs

- Benefit: no new global state pattern or persistence lifecycle.
- Benefit: follow-up resolution remains deterministic and easy to inspect.
- Cost: closing or reloading Safari resets the conversation.
- Cost: another surface cannot reuse the same live session yet.

## When to revisit

Move memory behind a shared session boundary only when a second interface genuinely needs the same conversation or when persistence becomes a real product requirement.
