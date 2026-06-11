# Decision 0009: Create App Composition Boundary

## Status

Accepted

## Context

The main app composition previously lived at:

```txt
src/App.jsx
```

As feature boundaries grew, top-level startup and shell switching needed an explicit home.

## Decision

Move the implementation into:

```txt
src/app/App.jsx
```

Keep `src/App.jsx` as a compatibility export.

Update `src/main.jsx` to import from `src/app/App.jsx`.

## Why

The `app/` boundary owns application composition.

It should answer:

- Which shell should render?
- What app-level loading happens?
- Which top-level providers exist?
- Which windows are registered in the desktop shell?

It should not own feature internals.

## When To Use This Pattern

Use an app boundary when the project has multiple feature boundaries and needs a clear composition root.

## When Not To Use This Pattern

Do not put business logic in `app/`.

Examples that should stay outside:

- Finder file-opening rules
- GitHub data mapping
- Window dragging internals
- Mobile app screens
- Portfolio content arrays

## Future Direction

If the app gains providers, route-level layout, or global error/reporting setup, add those under `src/app/`.

Keep `src/app/App.jsx` thin.
