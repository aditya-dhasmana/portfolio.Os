# Tutorial Notes: Building a macOS-Style Portfolio UI

## Developer Explanation

Macfolio is not a normal portfolio page. It is an interactive shell where portfolio sections behave like apps and files.

The main engineering challenge is separating the visual metaphor from the portfolio data.

The shell owns interaction:

- Dock
- Windows
- Dragging
- Focus
- Minimize and restore

The portfolio owns content:

- Projects
- Skills
- Resume
- Contact
- Articles

The file-system layer connects them by turning portfolio data into folders and files.

## Beginner Explanation

Think of the app like a laptop desktop.

The dock opens apps.

The Finder opens folders.

The folders show projects.

Some files open text, images, websites, or code previews.

The important coding lesson is this:

Do not put every idea in one component.

Each part should have one main job.

## Engineering Explanation

The project has three layers:

```txt
Shell Layer
  |
  +-- controls windows and navigation

Domain Layer
  |
  +-- describes portfolio content and fake file-system nodes

Data Layer
  |
  +-- fetches GitHub repositories and source files
```

When these layers stay separate, the app becomes easier to change.

For example:

- You can redesign Finder without rewriting GitHub fetching.
- You can change GitHub data loading without rewriting the dock.
- You can add a mobile view without copying all desktop behavior.

## Common Mistakes

### Mistake 1: Putting API calls inside UI components

This makes components harder to reuse and test.

Better: create a data hook or service.

### Mistake 2: Making everything shared too early

Shared code should be earned.

If only one feature uses it, keep it local.

### Mistake 3: Letting constants become a junk drawer

Constants should still have ownership.

Navigation config, window config, portfolio content, and gallery data should not all live in the same file forever.

## Real-World Scaling Discussion

If this app had a team of developers, unclear ownership would become the biggest problem.

One developer might change Finder data.

Another might change mobile Projects.

A third might change GitHub fetching.

If all of those areas depend on hidden globals or mixed constants, small changes become risky.

The solution is not complexity. The solution is clear boundaries.
