# 0010 - Use Public GitHub Requests In Browser Code

## Status

Superseded by [0011 - Put GitHub Access Behind A Minimal Backend](./0011-put-github-access-behind-a-minimal-backend.md)

## Context

Macfolio is a Vite frontend app. Vite exposes environment variables that start with `VITE_` to browser code.

The app previously supported reading `VITE_GITHUB_TOKEN` inside `src/api/github.js`. That made the token available to the deployed browser bundle, which is not safe for production.

## Decision

Browser code will only call public GitHub APIs without authentication.

The production environment should keep:

```txt
VITE_GITHUB_USERNAME=aditya-dhasmana
```

It should not define:

```txt
VITE_GITHUB_TOKEN=
```

## Consequences

- Public repositories and public source previews continue to work.
- Private repositories are intentionally not supported from browser code.
- GitHub unauthenticated rate limits apply.
- If private access or higher rate limits become necessary, GitHub requests should move behind a server/API route that owns the secret token.

## Engineering Lesson

Frontend code cannot safely own secrets. Anything shipped to the browser should be treated as public.
