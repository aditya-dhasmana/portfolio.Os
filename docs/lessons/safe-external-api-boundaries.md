# Safe External API Boundaries

## What Changed

GitHub access moved from the browser to a minimal Express backend. The frontend still has one reusable API adapter, but that adapter now calls Macfolio's API rather than GitHub.

## Why It Matters

A frontend bundle is public. Renaming a token or hiding it behind a helper does not make it secret. The backend creates a trust boundary: it can add authentication to the upstream request, filter the response, and keep implementation details away from UI code.

## Beginner, Intermediate, And Senior Views

The beginner approach calls GitHub directly because it has the fewest files. It works until rate limits or secrets matter.

The intermediate approach adds a proxy and forwards GitHub's complete response. The token is protected, but the application remains coupled to a large external response and can leak data it never intended to use.

The recommended approach adds the smallest useful boundary: authenticate upstream, select public repositories, map explicit safe fields, reject sensitive paths, cache repeat work, and give the frontend a fallback.

## When To Use This Pattern

Use a backend adapter when the client needs a secret, upstream responses require policy enforcement, rate limiting benefits from shared caching, or several UI features need one stable contract.

Do not add it for static public data that can be bundled safely, or as an excuse to add accounts, databases, and authentication unrelated to the requirement.

## Common Mistakes

- Treating `VITE_` variables as secret.
- Forwarding raw third-party responses.
- Filtering only in the browser.
- Caching private and public data together without a policy.
- Showing an empty or broken UI for recoverable network failures.

## Architecture Score

- Architecture: 9/10 — ownership is clear; backend logic is intentionally kept in one file while small.
- Maintainability: 9/10 — one frontend adapter and one backend boundary contain change.
- Scalability: 7/10 — process-local caching is appropriate now but not shared across instances.
- Readability: 9/10 — explicit mapping and validation favor clarity.
- Reusability: 8/10 — desktop, mobile, Finder, and portfolio composition share the contract.
