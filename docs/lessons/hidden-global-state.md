# Lesson: Hidden Global State

## What

Hidden global state is data stored somewhere that many files can access without an explicit dependency.

Earlier in the app, work data was placed on:

```txt
window.__WORK_DATA__
```

## Why It Exists

This was likely added to solve a real problem:

- GitHub data needed to be loaded once.
- Desktop Home needed the data.
- Finder needed the same data.
- Mobile Projects also needed similar data.

Using `window.__WORK_DATA__` made the data available across the app quickly.

That is understandable.

## Why It Becomes a Problem

The problem is not that it fails immediately.

The problem is that ownership becomes unclear.

Questions become harder:

- Who creates this data?
- Who can change it?
- Is it loaded yet?
- What happens if the request fails?
- Which component should show loading?
- How do we test this logic?

## Better Direction

Create an explicit portfolio data owner.

Example target flow:

```txt
usePortfolioFileSystem()
  |
  +-- loads GitHub data
  +-- maps repos into folders
  +-- tracks loading state
  +-- tracks error state
  +-- returns stable portfolio file-system data
```

Then features can depend on the hook or provider instead of the global window object.

This first slice now exists in:

```txt
src/features/portfolio/hooks/usePortfolioFileSystem.js
src/features/portfolio/utils/buildWorkLocation.js
src/store/useDataStore.js
```

## Beginner Explanation

Imagine putting an important notebook somewhere in the room and telling everyone, "Just remember where it is."

That works with one or two people.

With a team, someone moves it, someone reads it before it is ready, and someone else does not know it exists.

Explicit state is like putting the notebook in a labeled drawer and giving everyone the same access rule.

## Engineering Lesson

Hidden globals are often shortcuts that solve access but weaken ownership.

A better architecture makes dependencies visible.
