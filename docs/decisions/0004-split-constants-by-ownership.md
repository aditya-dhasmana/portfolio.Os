# Decision 0004: Split Constants By Ownership

## Status

Accepted

## Context

`src/constants/index.js` previously contained several unrelated responsibilities:

- Navigation links
- Dock app metadata
- Portfolio content
- Gallery data
- Finder locations
- Desktop window config

This made the file easy to import from, but hard to safely grow.

## Decision

Split constants into focused modules while keeping `src/constants/index.js` as the compatibility barrel.

Current shape:

```txt
src/constants/
  desktopApps.js
  index.js
  locations.js
  navigation.js
  portfolioContent.js
  windowConfig.js
```

Existing imports from `#constants` still work.

## Why

Constants are still architecture.

A constants file can become a junk drawer if ownership is unclear. Splitting by responsibility makes it easier to answer:

- Who owns this value?
- What feature should change it?
- What should not be placed next to it?

## When To Use This Pattern

Use focused constants modules when groups of values change for different reasons.

Examples:

- Window sizes change when desktop shell behavior changes.
- Blog posts change when portfolio content changes.
- Dock apps change when desktop shell app registration changes.
- Finder locations change when the file-system model changes.

## When Not To Use This Pattern

Do not create a separate file for every tiny value.

Do not split constants only because a file is long.

Split when there is a clear ownership boundary.

## Tradeoffs

Pros:

- Clearer ownership
- Safer edits
- Easier teaching material
- Better migration path toward feature folders

Cons:

- More files to navigate
- Requires discipline to place new constants correctly
- Barrel exports can hide where values truly live

## Future Direction

Some constants should eventually move closer to their feature owners:

```txt
features/desktop-shell/
  constants/
    desktopApps.js
    windowConfig.js

features/portfolio/
  data/
    portfolioContent.js

features/finder/
  data/
    locations.js
```

For now, keeping them under `src/constants/` is a conservative step.
