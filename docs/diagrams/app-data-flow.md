# App Data Flow

## Current Flow

```txt
main.jsx
  |
  +-- App.jsx
        |
        +-- buildWorkLocation()
        |     |
        |     +-- fetchRepos()
        |     +-- fetchRepoTree()
        |
        +-- window.__WORK_DATA__
        |
        +-- Desktop Shell
        |     |
        |     +-- Home
        |     +-- Finder
        |     +-- VS Code
        |
        +-- Mobile Shell
              |
              +-- Projects
              +-- Code
```

## Recommended Flow

```txt
main.jsx
  |
  +-- App.jsx
        |
        +-- AppProviders
              |
              +-- Portfolio Data Boundary
                    |
                    +-- GitHub API Adapter
                    +-- File System Mapper
                    +-- Loading State
                    +-- Error State
                    |
                    +-- Desktop Shell
                    |     |
                    |     +-- Home
                    |     +-- Finder
                    |     +-- VS Code
                    |
                    +-- Mobile Shell
                          |
                          +-- Projects
                          +-- Code
```

## Key Lesson

The UI should depend on portfolio-shaped data.

The UI should not depend directly on GitHub-shaped data unless the feature is specifically a GitHub feature.
