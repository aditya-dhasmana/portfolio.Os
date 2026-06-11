# Decision 0007: Lazy Load Shell Apps

## Status

Accepted

## Context

The production build previously bundled too much application code into the initial JavaScript chunk.

Heavy experiences included:

- Desktop windows
- VS Code-style source preview
- Resume/PDF rendering
- Mobile app screens

This caused large chunk warnings during production builds.

## Decision

Lazy-load desktop windows and the mobile shell entry point from `App.jsx`.

The desktop shell still renders immediately, but individual windows load only when needed.

The mobile shell loads only when the viewport branch uses it.

## Why

This preserves the same UI flow while improving startup architecture.

Users should not download every window implementation before opening any window.

## When To Use This Pattern

Use lazy loading when a feature:

- Is not needed on initial render
- Is large
- Is opened conditionally
- Belongs to a separate interaction path

Desktop windows and mobile shell screens fit this pattern.

## When Not To Use This Pattern

Do not lazy-load tiny primitives that are used immediately.

Examples:

- Error boundaries
- Top-level shell composition
- Small shared UI primitives

## Result

The build no longer reports the large chunk warning after this change.

## Tradeoffs

Pros:

- Smaller initial bundle
- Cleaner build baseline
- Better separation between shell and app windows

Cons:

- First window open may include a small async loading delay
- Requires `Suspense` boundaries

## Future Direction

If any lazy-loaded window becomes large enough on its own, split its internal subfeatures separately.
