# Current Folder Structure

## Current Shape

```txt
src/
  api/
  components/
  constants/
  features/
    finder/
  hoc/
  hooks/
  mobile/
  store/
  utils/
  windows/
  App.jsx
  main.jsx
  index.css
```

The current structure is mostly organized by technical type:

- `components/` contains reusable UI and desktop shell pieces.
- `windows/` contains desktop app windows.
- `mobile/` contains the isolated mobile experience.
- `store/` contains Zustand stores.
- `api/` contains GitHub API functions.
- `utils/` contains helper logic.
- `constants/` contains configuration and content data.

This structure is understandable for a small project, but the app has grown into multiple product features. The first feature boundary now exists at `src/features/finder`. The next architecture step is to keep organizing by responsibility, one feature at a time.

## What Works Well

### Mobile is already isolated

`src/mobile/` is a good boundary. It keeps mobile shell and apps separate from desktop windows.

This is a useful pattern:

```txt
feature/
  apps/
  components/
  data/
  shell/
```

The same kind of ownership can be introduced elsewhere.

### Finder has started moving into a feature boundary

`src/features/finder/` now owns Finder-specific components and utilities.

This is the pattern to repeat:

```txt
features/finder/
  components/
  utils/
  FinderWindow.jsx
```

The old `src/windows/Finder.jsx` path remains as a compatibility export so the rest of the app does not need to change immediately.

### Stores are separated by concern

Window state and Finder location state are already separate:

- `store/window.js`
- `store/location.js`

That is a good instinct. Each store has a specific job.

### External API logic has a home

GitHub calls live in `api/github.js`. This is better than placing raw fetch calls directly in every component.

The next improvement is to add a domain layer above the API so UI components depend on portfolio-shaped data, not GitHub-shaped data.

## Current Pressure Points

### `constants/index.js` owns too much

It currently contains:

- Navigation links
- Dock apps
- Blog posts
- Tech stack
- Social links
- Gallery data
- Finder locations
- Window sizing config

These are different responsibilities. As the app grows, this file will become hard to safely edit.

### `App.jsx` knows too much

`App.jsx` currently:

- Chooses desktop or mobile.
- Preloads work data.
- Sets Finder initial location.
- Controls intro loading.
- Registers desktop windows.
- Renders global shell components.

This is acceptable while the project is small, but it should become thinner over time.

### Desktop window code is split across many places

Desktop shell behavior is spread across:

- `App.jsx`
- `components/Dock.jsx`
- `components/Home.jsx`
- `components/WindowControls.jsx`
- `hoc/windowWrapper.jsx`
- `store/window.js`
- `constants/index.js`

These files all participate in one feature: the desktop shell. That feature should eventually have clearer ownership.

### GitHub data is requested from multiple features

GitHub data is used by:

- Work location builder
- Desktop VS Code
- Mobile Projects
- Mobile Code

This creates repeated loading logic. The app needs one reusable GitHub/portfolio data boundary.

### CSS is large and global

Current CSS files are large:

- `src/index.css`
- `src/mobile/styles.css`

This is not automatically wrong, but large global CSS requires naming discipline. As features grow, styles should move closer to the feature they support or follow a documented naming convention.

## Recommended Next Folder Direction

Do not rewrite everything at once. Start with one feature.

Suggested target:

```txt
src/
  app/
  features/
    desktop-shell/
    finder/
    code-preview/
    mobile-shell/
    portfolio/
  shared/
    api/
    components/
    hooks/
    utils/
```

## Migration Rule

Move code only when it improves ownership.

Do not move files just because a new folder exists.

A good move answers:

- Who owns this logic?
- Who uses this logic?
- What should this file not know about?
- Will this still make sense if the feature doubles in size?
