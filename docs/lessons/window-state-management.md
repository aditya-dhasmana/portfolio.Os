# Lesson: Window State Management

## What

Window state is the information needed to control desktop app windows.

In Macfolio, each window needs state such as:

- Is it open?
- Is it minimized?
- What is its z-index?
- What size is it?
- What position is it in?
- Is it normal or maximized?
- Does it carry data, like the selected file?

## Why

Without centralized window state, every window would need to manage its own behavior.

That would create duplication:

- Finder would manage open/close rules.
- Gallery would manage open/close rules.
- VS Code would manage open/close rules.
- Resume would manage open/close rules.

Central state gives the desktop shell one consistent way to control windows.

## When

Use centralized window state when multiple independent UI pieces need to coordinate.

Examples:

- Dock opens a window.
- Window controls close a window.
- Clicking a window focuses it.
- Finder opens VS Code with a selected file.

## Where

The state currently lives in:

```txt
src/store/window.js
```

Long term, this belongs near the desktop shell feature:

```txt
features/desktop-shell/store/windowStore.js
```

## How

A component should not directly mutate another component.

Instead:

```txt
Dock click
  |
  +-- openWindow("finder")
        |
        +-- window store updates
              |
              +-- App renders Finder window
```

This gives the app a predictable flow.

## Beginner Mistake

A common beginner mistake is to store `isOpen` inside each window component.

That works until the dock, navbar, Finder, and app shell all need to open the same window.

## Engineering Lesson

State should live where the coordination happens.

For desktop windows, coordination happens at the shell level. That is why window state belongs to the desktop shell, not inside individual windows.
