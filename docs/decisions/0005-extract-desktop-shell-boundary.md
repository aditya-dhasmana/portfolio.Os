# Decision 0005: Extract Desktop Shell Boundary

## Status

Accepted

## Context

The desktop shell behavior was previously spread across generic folders:

```txt
src/components/Dock.jsx
src/components/Home.jsx
src/components/Navbar.jsx
src/components/WindowControls.jsx
src/hoc/windowWrapper.jsx
src/store/window.js
src/constants/windowConfig.js
```

These files all change for the same reason: desktop operating-system behavior.

## Decision

Move desktop shell ownership into:

```txt
src/features/desktop-shell/
  components/
    Dock.jsx
    Home.jsx
    Navbar.jsx
    WindowControls.jsx
  config/
    windowConfig.js
  hoc/
    windowWrapper.jsx
  store/
    windowStore.js
```

Keep the old paths as compatibility exports so the current UI flow remains intact.

## Why

The desktop shell is a product feature, not a generic utility.

It owns:

- Dock behavior
- Menu/navbar behavior
- Desktop icons
- Window controls
- Window dragging
- Window state
- Window sizing and z-index behavior

Putting these together makes ownership visible.

## When To Use This Pattern

Use this pattern when a group of files represents one interaction model.

The desktop shell is an interaction model. The mobile shell is another interaction model.

## When Not To Use This Pattern

Do not move app-specific content into the shell.

Examples that should not belong to desktop shell:

- Finder file-opening rules
- Gallery image data
- Resume PDF rendering
- GitHub API loading
- Portfolio content

## Tradeoffs

Pros:

- Clearer ownership
- Easier future shell changes
- Less generic-folder clutter
- Better teaching example for feature boundaries

Cons:

- Compatibility bridges temporarily add indirection
- Some imports still point to old paths until future cleanup

## Future Direction

Once desktop app windows are organized into feature boundaries, imports can move from compatibility paths to direct feature paths.

For now, preserving the current app flow is more important than aggressively changing every import.
