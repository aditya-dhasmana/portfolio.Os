# Recommended Folder Structure

## Goal

The goal is not to create a fancy folder structure.

The goal is to make ownership obvious.

Good architecture helps a developer answer:

- Where should this code live?
- Who owns this behavior?
- What is this file allowed to depend on?
- What should this feature not know about?

## Recommended Structure

```txt
src/
  app/
    App.jsx
    AppProviders.jsx
    routes-or-shell-switching.js

  features/
    desktop-shell/
      components/
      store/
      utils/
      constants.js

    finder/
      components/
      hooks/
      utils/
      FinderWindow.jsx

    code-preview/
      components/
      hooks/
      utils/
      CodePreviewWindow.jsx

    mobile-shell/
      apps/
      components/
      data/
      shell/
      MobileApp.jsx

    portfolio/
      data/
      hooks/
      utils/

  shared/
    api/
    components/
    hooks/
    utils/
    constants/
```

This should be treated as a direction, not an immediate rewrite.

## Folder Responsibilities

### `app/`

Owns application startup and top-level composition.

Belongs here:

- Viewport shell switching
- Global providers
- App-level loading state
- Error boundaries

Does not belong here:

- GitHub fetch details
- Window dragging details
- Portfolio content arrays
- Finder file-opening rules

### `features/desktop-shell/`

Owns the desktop operating-system simulation.

Belongs here:

- Dock
- Navbar
- Desktop home icons
- Window controls
- Window wrapper
- Window state store
- Desktop window configuration

Does not belong here:

- Project content
- GitHub API calls
- Resume rendering internals
- Gallery business rules

### `features/finder/`

Owns browsing the fake portfolio file system.

Belongs here:

- Finder sidebar
- Breadcrumbs
- File grid
- Folder navigation
- Finder-specific file-opening behavior

Does not belong here:

- Raw GitHub API calls
- Desktop window drag behavior
- Mobile app navigation
- Global portfolio content definitions

### `features/code-preview/`

Owns source-code browsing and previewing.

Belongs here:

- Repo explorer
- Editor tabs
- Active file state
- Monaco editor setup
- Code file loading

Does not belong here:

- Finder layout
- Mobile home screen logic
- Window management internals

### `features/mobile-shell/`

Owns the mobile operating-system simulation.

Belongs here:

- Mobile home screen
- Mobile widgets
- Mobile dock
- Mobile app frame
- Mobile app stack

Does not belong here:

- Desktop window behavior
- GitHub API implementation
- Shared portfolio content ownership

### `features/portfolio/`

Owns the portfolio domain.

Belongs here:

- Project metadata
- Skills
- Social links
- Articles
- Gallery metadata
- File-system mapping helpers
- Hooks that expose portfolio-shaped data

Does not belong here:

- Desktop-specific layout
- Mobile-specific layout
- Window z-index management

### `shared/`

Owns truly reusable code.

Belongs here:

- Generic UI primitives
- Generic hooks
- API clients
- Formatting helpers
- Utility functions used by multiple features

Does not belong here:

- Code used by only one feature
- Business rules that belong to a feature
- Components moved there "just in case"

## Important Rule

Local first. Shared later.

Duplicate once if it keeps the feature clear.

Duplicate twice if the shape is still changing.

Abstract on the third real usage.

This protects the project from premature abstraction.

## First Refactor Candidate

Start with Finder.

Why Finder first:

- It has clear UI responsibility.
- It uses file-system data.
- It exposes ownership problems without requiring a full rewrite.
- It can become the example pattern for later features.

Suggested first Finder structure:

```txt
features/finder/
  components/
    FinderBreadcrumbs.jsx
    FinderSidebar.jsx
    FinderGrid.jsx
  utils/
    buildBreadcrumbTrail.js
    getFinderOpenAction.js
  FinderWindow.jsx
```

This teaches feature decomposition without changing the whole app at once.
