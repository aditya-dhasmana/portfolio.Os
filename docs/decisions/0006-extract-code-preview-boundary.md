# Decision 0006: Extract Code Preview Boundary

## Status

Accepted

## Context

The VS Code-style source preview experience was split between generic folders:

```txt
src/components/Editor.jsx
src/components/Explorer.jsx
src/components/Terminal.jsx
src/windows/VsCode.jsx
```

These files are not generic shared components. They belong to one feature: code preview.

## Decision

Move code-preview ownership into:

```txt
src/features/code-preview/
  components/
    Editor.jsx
    Explorer.jsx
    Terminal.jsx
  windows/
    CodePreviewWindow.jsx
```

Keep the old paths as compatibility exports so the current UI flow remains intact.

## Why

The code preview feature owns:

- Repository browsing
- Source file opening
- Editor tabs
- Monaco editor display
- Repo terminal panel
- VS Code-style layout controls

Keeping these together makes the feature easier to reason about and safer to grow.

## When To Use This Pattern

Use this pattern when a feature has its own UI, local state, and workflow.

Code preview has all three.

## When Not To Use This Pattern

Do not move generic helpers here just because code preview uses them.

Examples that should stay outside:

- GitHub API adapter
- File icon utility if Finder and code preview both use it
- Desktop window mechanics
- Portfolio file-system loading

## Tradeoffs

Pros:

- Clear feature ownership
- Easier future code-preview hooks
- Less pressure on `src/components`
- Better separation from Finder and desktop shell

Cons:

- Compatibility bridges temporarily add indirection
- Source preview still depends on GitHub API helpers directly

## Future Direction

The next improvement is to extract a code-preview hook for repository loading, file preparation, and tab management.

For now, the window coordinator keeps that behavior so the refactor stays behavior-preserving.
