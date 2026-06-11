# App Data Flow

## Current Flow

```txt
main.jsx
  |
  +-- App.jsx
        |
        +-- usePortfolioFileSystem()
              |
              +-- useDataStore
              +-- buildWorkLocation()
                    |
                    +-- fetchRepos()
                    +-- fetchRepoTree()
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

## Long-Term Flow

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
