# Decision 0002: Keep Desktop and Mobile Shells Separated

## Status

Accepted

## Context

Macfolio has two different user experiences:

- Desktop users see a macOS-style interface.
- Mobile users see an iOS-style interface.

These are not just responsive layouts. They are different interaction models.

Desktop behavior includes:

- Dock
- Draggable windows
- Window controls
- Finder-style browsing

Mobile behavior includes:

- Home screen
- Widgets
- App icons
- App stack navigation

## Decision

Keep desktop shell and mobile shell as separate feature boundaries.

Desktop and mobile can share domain data, but they should not share shell implementation.

## Why

Trying to force both experiences into the same components would make the code harder to reason about.

The visual metaphor is different, the navigation model is different, and the interaction rules are different.

The shared layer should be the portfolio domain, not the shell UI.

## Recommended Boundary

```txt
features/
  desktop-shell/
  mobile-shell/
  portfolio/
```

Both shells may depend on portfolio data.

Portfolio data should not depend on either shell.

## Good Dependency Direction

```txt
desktop-shell ---> portfolio
mobile-shell  ---> portfolio
```

## Bad Dependency Direction

```txt
portfolio ---> desktop-shell
portfolio ---> mobile-shell
desktop-shell ---> mobile-shell
mobile-shell ---> desktop-shell
```

## Teaching Note

This is an example of separating product domains.

Responsive design changes layout.

Different shells change interaction models.

When interaction models are different, separation is usually healthier than forcing reuse.
