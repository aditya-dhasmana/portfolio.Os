# Decision 0008: Move Mobile Shell Boundary

## Status

Accepted

## Context

The mobile experience was already isolated under:

```txt
src/mobile/
```

That was a good boundary, but it lived outside the emerging `features/` architecture.

## Decision

Move the mobile implementation into:

```txt
src/features/mobile-shell/
  apps/
  components/
  data/
  shell/
  MobileApp.jsx
  styles.css
```

Keep `src/mobile/MobileApp.jsx` as a compatibility export.

## Why

The mobile experience is its own interaction model.

It owns:

- Mobile home screen
- Mobile widgets
- Mobile app frame
- Mobile app stack
- Mobile app screens
- Mobile-specific styles

This is parallel to the desktop shell boundary.

## When To Use This Pattern

Use this pattern when a whole experience is already cohesive and can move as a unit.

The mobile shell was a good candidate because most imports were internal to the mobile folder.

## When Not To Use This Pattern

Do not move shared portfolio data into mobile shell.

Mobile shell can consume portfolio data, but it should not own it.

## Tradeoffs

Pros:

- Aligns mobile with feature-based architecture
- Makes desktop shell and mobile shell parallel concepts
- Keeps mobile-specific CSS with the mobile experience

Cons:

- Requires a compatibility bridge while old imports exist
- Relative imports need care after the move

## Future Direction

Mobile app screens can be split further only when they grow enough to justify it.

For now, keeping the mobile shell cohesive is better than over-decomposing it.
