# Building A Safe GitHub Proxy For Macfolio

## The Requirement

Macfolio needs live public repository data, but browser requests can hit GitHub's unauthenticated rate limit. A GitHub token cannot be shipped in Vite code because every browser user can inspect it.

## The Boundary

Think of the backend as a receptionist, not a second application. It accepts three narrow questions: “Are you healthy?”, “Which safe public repositories may I show?”, and “What safe directory or selected file may I preview?” It does not own users, sessions, or a database.

## Configuration

The frontend receives only `VITE_API_BASE_URL`. The backend receives `GITHUB_TOKEN`, `GITHUB_USERNAME`, `CACHE_TTL_SECONDS`, and `ALLOWED_REPOS`. An empty allowlist means every public repository is eligible. A populated allowlist narrows results by repository name.

## Execution Flow

1. The UI asks the frontend adapter for repositories.
2. The adapter calls `/api/github/repos`.
3. The backend returns cached data when it is still fresh.
4. On a cache miss, the backend asks GitHub with its server-only token when configured.
5. Private repositories are rejected before mapping.
6. The optional allowlist is applied.
7. Only documented safe fields reach the browser.
8. If the backend fails, the frontend uses static projects and the UI remains usable.

## Engineering Tradeoff

One backend file is preferable while this feature has one responsibility. Splitting routes, controllers, services, repositories, and middleware today would create navigation cost without meaningful isolation. If more external integrations arrive, those responsibilities will become real reasons to split the file.

## Practice Questions

### Beginner

Why is a `VITE_GITHUB_TOKEN` public even when it lives in a local `.env` file during development?

### Intermediate

Why does the backend map an explicit list of repository fields instead of returning GitHub's response unchanged?

### Advanced

If the backend grows to five instances, what behavior changes with the current in-memory cache, and what interface should remain stable when replacing it?
