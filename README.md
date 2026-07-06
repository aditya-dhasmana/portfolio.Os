# Macfolio

Macfolio is an interactive React portfolio that presents Aditya's work through a simulated desktop and mobile operating-system experience.

This repository is also a learning project. The goal is not only to build a polished portfolio, but to practice engineering rhythm: clear responsibilities, stable patterns, thoughtful refactoring, and useful documentation.

## What This App Does

Macfolio has two main experiences:

- Desktop users see a macOS-style interface with a dock, draggable windows, Finder, Gallery, Resume, Safari, Terminal, Contact, and VS Code-style source preview.
- Mobile users see an iOS-style interface with widgets, app icons, app frames, and mobile-specific portfolio screens.

The app uses GitHub data to build an explorable project file system.

## Tech Stack

- React
- Vite
- Zustand
- GSAP
- Framer Motion
- Monaco Editor
- React PDF
- Tailwind CSS

## Current Project Shape

```txt
src/
  app/
  api/
  components/
  constants/
    desktopApps.js
    locations.js
    navigation.js
    portfolioContent.js
    windowConfig.js
  features/
    code-preview/
    desktop-shell/
    finder/
    mobile-shell/
    portfolio/
  hoc/
  hooks/
  mobile/
  store/
  utils/
  windows/
  main.jsx
  index.css
```

The current structure is understandable, but the app has grown beyond a simple component-based portfolio. The long-term direction is feature-based architecture. Finder, portfolio data, desktop shell, code preview, and mobile shell are the first feature boundaries introduced in that direction.

Read more:

- [System Overview](docs/architecture/system-overview.md)
- [Current Folder Structure](docs/architecture/current-folder-structure.md)
- [Recommended Folder Structure](docs/architecture/recommended-folder-structure.md)

## Engineering Direction

The recommended architecture is:

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
```

This should be introduced gradually. The goal is not a large rewrite. The goal is to build a repeatable pattern and improve one feature at a time.

## Key Architecture Decisions

- [Use feature-based architecture gradually](docs/decisions/0001-use-feature-based-architecture-gradually.md)
- [Keep desktop and mobile shells separated](docs/decisions/0002-keep-desktop-and-mobile-shells-separated.md)
- [Create a portfolio data boundary](docs/decisions/0003-create-a-portfolio-data-boundary.md)
- [Split constants by ownership](docs/decisions/0004-split-constants-by-ownership.md)
- [Extract desktop shell boundary](docs/decisions/0005-extract-desktop-shell-boundary.md)
- [Extract code preview boundary](docs/decisions/0006-extract-code-preview-boundary.md)
- [Lazy load shell apps](docs/decisions/0007-lazy-load-shell-apps.md)
- [Move mobile shell boundary](docs/decisions/0008-move-mobile-shell-boundary.md)

## Learning Notes

- [Window State Management](docs/lessons/window-state-management.md)
- [Hidden Global State](docs/lessons/hidden-global-state.md)
- [Feature Decomposition](docs/lessons/feature-decomposition.md)

## Documentation Structure

```txt
docs/
  architecture/
  decisions/
  lessons/
  diagrams/
  tutorials/
```

Documentation is part of development in this repository. Major features should update the relevant docs.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## GitHub Backend And Environment Variables

The browser calls a small Express proxy in `backend/`. Copy the two example files and keep real `.env` files uncommitted.

Frontend `.env`:

```txt
VITE_API_BASE_URL=http://localhost:4000
```

Backend `backend/.env`:

```txt
GITHUB_TOKEN=
GITHUB_USERNAME=aditya-dhasmana
CACHE_TTL_SECONDS=900
ALLOWED_REPOS=
FRONTEND_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://192.168.0.100:5173,http://192.168.0.100:5174,http://192.168.0.100:5175
```

Never place a GitHub token in a `VITE_` variable. Vite variables are shipped to the browser; `GITHUB_TOKEN` is read only by the backend.

Run the backend in a second terminal:

```bash
cd backend
npm install
npm run dev
```

Then run the frontend from the repository root with `npm run dev`.

## Refactoring Roadmap

### Phase 1: Stabilize Documentation

- Replace starter README.
- Create required docs folders.
- Document current architecture.
- Document recommended architecture.
- Record architecture decisions.

### Phase 2: Define Ownership

- Separate shell concerns from portfolio concerns.
- Move window configuration toward desktop shell ownership.
- Move portfolio content into a clear portfolio boundary.

### Phase 3: Refactor Finder First

Finder is the best first feature to refactor because it touches UI, navigation, data shape, and file-opening behavior.

Current first slice:

```txt
features/finder/
  components/
  utils/
  FinderWindow.jsx
```

Future Finder improvements can add feature hooks once data ownership is clearer.

### Phase 4: Create Portfolio Data Boundary

- Replace hidden global work data with an explicit data owner.
- Centralize GitHub loading and file-system mapping.
- Share portfolio-shaped data between desktop and mobile.

Current first slice:

```txt
features/portfolio/
  hooks/
  utils/
```

The old `src/utils/buildWorkLocation.js` path remains as a compatibility bridge.

### Phase 5: Repeat the Pattern

Apply the same rhythm to:

- Code preview
- Gallery
- Desktop shell
- Mobile shell

## Engineering Rhythm

The project should grow through repetition:

```txt
Pattern
  -> Practice
  -> Repetition
  -> Refinement
  -> Habit
```

Prefer simple, explicit, maintainable code over clever abstractions.
