# Decision 0001: Use Feature-Based Architecture Gradually

## Status

Accepted

## Context

Macfolio started with a type-based structure:

```txt
components/
windows/
store/
utils/
constants/
api/
```

This is easy to understand at the beginning. As the app grows, the same feature becomes spread across many folders.

For example, the desktop shell currently involves components, stores, constants, utilities, and app-level rendering.

## Decision

Use feature-based architecture as the long-term direction, but migrate gradually.

The project should move toward:

```txt
features/
  desktop-shell/
  finder/
  code-preview/
  mobile-shell/
  portfolio/
shared/
app/
```

Do not move everything at once. Refactor one feature at a time.

## Why

Feature-based architecture improves ownership.

It helps answer:

- Who owns this logic?
- Where should new code go?
- What should this feature not depend on?
- How does this feature scale?

This is especially useful for a teaching repository because it makes engineering decisions visible.

## When To Use This Pattern

Use a feature folder when code has a clear product responsibility.

Examples:

- Finder
- Desktop shell
- Mobile shell
- Code preview
- Gallery

## When Not To Use This Pattern

Do not create a feature folder for tiny one-off helpers.

Do not move code into `shared/` before it is genuinely shared.

Do not reorganize the whole project just to make the tree look clean.

## Tradeoffs

Pros:

- Clear ownership
- Easier onboarding
- Better scaling
- Better teaching material

Cons:

- Requires discipline
- Can create too many folders if overused
- Migration takes time

## Migration Rule

Refactor by learning slice:

1. Pick one feature.
2. Document its responsibility.
3. Move only files that clearly belong to it.
4. Keep behavior unchanged.
5. Repeat the same pattern on the next feature.
