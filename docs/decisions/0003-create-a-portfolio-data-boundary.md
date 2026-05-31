# Decision 0003: Create a Portfolio Data Boundary

## Status

Proposed

## Context

GitHub and portfolio data are currently used by multiple places:

- Desktop Home
- Desktop Finder
- Desktop VS Code
- Mobile Projects
- Mobile Code

The project currently uses `buildWorkLocation()` and `window.__WORK_DATA__` to share work data.

This works, but it creates hidden coupling.

## Decision

Create a portfolio data boundary that owns loading, caching, and mapping data.

The target shape should be:

```txt
features/portfolio/
  hooks/
    usePortfolioFileSystem.js
  utils/
    buildWorkLocation.js
    attachParents.js
    mapGithubRepoToFolder.js
  data/
    staticPortfolioData.js
```

## Why

The UI should receive portfolio-shaped data.

It should not need to know:

- Which GitHub endpoint was called.
- How deep the GitHub tree fetch goes.
- How parent pointers are attached.
- Whether data came from cache, API, or fallback content.

## When To Use This Boundary

Use it whenever a feature needs portfolio content or file-system nodes.

Examples:

- Finder needs folders and files.
- Mobile Projects needs folders and files.
- Code Preview needs repo trees and file content.

## When Not To Use It

Do not put visual layout logic here.

Do not put window behavior here.

Do not put mobile navigation here.

## Future Scaling

If the project later adds a backend, CMS, or local project metadata, this boundary protects the UI from major rewrites.

The UI would still ask for portfolio data. Only the data source would change.
