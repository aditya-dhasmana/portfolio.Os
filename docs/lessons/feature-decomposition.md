# Lesson: Feature Decomposition

## What

Feature decomposition means breaking a product area into smaller responsibilities.

Instead of asking, "What type of file is this?"

Ask, "What feature owns this behavior?"

## Why

As projects grow, organizing only by file type creates scattered features.

For example:

```txt
components/FinderPart.jsx
store/location.js
utils/fileHelpers.js
constants/index.js
windows/Finder.jsx
```

All of these may belong to one product feature: Finder.

Feature decomposition brings related decisions closer together.

## When

Use feature decomposition when a feature has:

- Multiple components
- Its own state
- Its own rules
- Its own data shape
- Its own growth path

Finder qualifies.

Code preview qualifies.

Desktop shell qualifies.

## Where

Feature-owned files should live under:

```txt
features/{feature-name}/
```

Generic reusable files should live under:

```txt
shared/
```

## How

Start with one feature and split by responsibility.

Example Finder decomposition:

```txt
FinderWindow.jsx
components/FinderSidebar.jsx
components/FinderBreadcrumbs.jsx
components/FinderGrid.jsx
utils/buildBreadcrumbTrail.js
utils/getFinderOpenAction.js
```

## Common Mistake

Do not create abstractions before the feature shape is clear.

Moving code too early can make the project look organized while making it harder to change.

## Engineering Lesson

Architecture is not about having many folders.

Architecture is about making change predictable.
