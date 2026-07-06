# 0011 - Put GitHub Access Behind A Minimal Backend

## Status

Accepted

## Context

Macfolio previously called GitHub from the browser. Unauthenticated requests hit rate limits, while placing a token in a `VITE_` variable would expose it in the client bundle. Finder and code-preview features also need a stable, safe data contract.

## Decision

Use the existing `backend/` folder for a small Express proxy. It will:

- Keep `GITHUB_TOKEN` in `backend/.env` only.
- Return public repositories only.
- Apply an optional case-insensitive repository-name allowlist.
- Return an explicit repository field projection rather than raw GitHub objects.
- Hide sensitive paths and limit selected file previews to 250 KB.
- Cache the filtered repository source data in memory for 900 seconds by default.
- Return clean JSON errors for GitHub and network failures.

The frontend will use `VITE_API_BASE_URL`, normalize transport data in one adapter, and use static portfolio projects when live data is unavailable.

## Alternatives

Continuing unauthenticated browser requests is simpler but retains the rate-limit failure. A serverless function would provide the same security boundary but introduces a deployment-specific pattern. A database, login system, or JWT authentication does not help this public read-only use case.

## Consequences

The token stays outside the browser and GitHub traffic can be authenticated and cached. Local development now runs two processes. The cache resets when the backend restarts, which is acceptable for a portfolio.

## Engineering Lesson

A backend is useful here because it owns a secret and enforces a data boundary—not merely because “production apps need backends.” Add a layer when it has a clear responsibility.
