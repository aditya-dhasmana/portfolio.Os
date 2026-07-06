# GitHub Proxy Boundary

## Problem

Direct browser requests to GitHub share GitHub's unauthenticated rate limit and cannot safely use a secret token. Macfolio also needs to prevent private repository metadata or sensitive files from entering the UI accidentally.

## System Overview

```txt
Macfolio UI
  -> src/api/github.js
  -> backend Express API
  -> GitHub REST API
```

The browser knows only `VITE_API_BASE_URL`. The backend owns `GITHUB_TOKEN`, the GitHub username, the optional repository allowlist, public-only filtering, safe field mapping, and the in-memory repository cache.

## Responsibilities And Ownership

### Frontend API adapter

`src/api/github.js` translates backend responses into the existing repository and file-tree shapes. It must not call GitHub directly or read secrets.

### Portfolio feature

`src/features/portfolio/data/fallbackProjects.js` owns a small static fallback. Portfolio and code-preview features use it when the backend is unavailable.

### Backend

`backend/src/server.js` exposes health, repository, directory, and selected-file requests. It must never return private repositories, raw repository objects, sensitive paths, or token-bearing error details.

## Data Safety Boundary

Repository lists are projected onto an explicit allowlist of public fields. Repository access is checked against the cached public repository list before contents are requested. Dotfiles, environment files, key files, and credential/secret-like paths are hidden. File bodies are returned only for a selected safe file smaller than 250 KB.

## Scaling Notes

The in-memory cache is intentionally process-local. It is correct for one small portfolio server. If Macfolio later runs across multiple backend instances, a shared cache could replace it without changing the frontend contract. A database, login system, or JWT layer would add responsibility without solving the current problem.
