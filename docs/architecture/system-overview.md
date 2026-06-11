# Macfolio System Overview

## Purpose

Macfolio is an interactive portfolio built as a simulated operating system.

The project has three goals:

1. Present Aditya's work in a memorable way.
2. Practice production-quality React engineering.
3. Produce teaching material about architecture, refactoring, and feature design.

This means the app should not only work visually. It should also teach clear engineering rhythm.

## Product Model

The application has two main experiences:

```txt
User
  |
  +-- Desktop viewport
  |     |
  |     +-- macOS-style shell
  |           |
  |           +-- Dock
  |           +-- Navbar
  |           +-- Desktop icons
  |           +-- Draggable windows
  |
  +-- Mobile viewport
        |
        +-- iOS-style shell
              |
              +-- Home screen
              +-- Widgets
              +-- App icons
              +-- App frame
```

The desktop and mobile experiences should remain visually different, but they should share domain ideas when possible.

## Main Domains

### 1. App Shell

The shell owns the simulated operating-system behavior.

Desktop shell responsibilities:

- Show the menu/navbar.
- Show the dock.
- Open, close, focus, minimize, restore, and resize windows.
- Render desktop icons.
- Provide draggable window behavior.

Mobile shell responsibilities:

- Show the home screen.
- Render widgets and mobile app icons.
- Manage the mobile app stack.
- Provide the app frame and back navigation.

The shell should not own portfolio business data.

### 2. Portfolio Content

Portfolio content owns the information being presented.

Examples:

- Projects
- About information
- Skills
- Articles
- Gallery items
- Contact links
- Resume metadata

This content may appear in both desktop and mobile UI. Because of that, it should eventually live in a place that is not tied to either shell.

### 3. GitHub Data

GitHub data owns external repository fetching and transformation.

Responsibilities:

- Fetch repositories.
- Fetch repository trees.
- Convert GitHub API responses into file/folder nodes.
- Handle loading and failure states.

UI components should ask for GitHub data. They should not know too much about how the API is shaped.

### 4. File System Model

The portfolio uses a fake file system to make projects feel explorable.

A file-system node usually has:

- `id`
- `name`
- `kind`
- `icon`
- `children`
- `fileType`
- `href`
- `download_url`
- `parent`

This model is shared by Finder, mobile Projects, and code preview features. That makes it an important architecture boundary.

## Current Data Flow

```txt
App.jsx
  |
  +-- usePortfolioFileSystem()
        |
        +-- useDataStore
        +-- buildWorkLocation()
              |
              +-- fetchRepos()
              +-- fetchRepoTree()
  |
  +-- desktop Finder / Home
  +-- mobile Projects
```

The portfolio file system now has an explicit owner. `usePortfolioFileSystem()` coordinates loading and `useDataStore` stores the loaded Work folder.

## Recommended Data Flow

```txt
App provider or feature hook
  |
  +-- usePortfolioFileSystem()
        |
        +-- GitHub API adapter
        +-- file-system mapper
        +-- loading/error state
        |
        +-- Desktop Finder
        +-- Desktop Home
        +-- Mobile Projects
        +-- Code Preview
```

This gives the data one owner and gives each UI feature a clean dependency.

## Engineering Rule

Shell code should answer:

"How does the simulated device behave?"

Portfolio code should answer:

"What content does Aditya want to show?"

GitHub code should answer:

"How do we load and transform external repository data?"

When a file starts answering more than one of these questions, it is a candidate for refactoring.
