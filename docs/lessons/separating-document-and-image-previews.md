# Separating document media from image previews

## Current problem

The About Me text document rendered its inline profile image at `width: 100%`. That rule was reasonable for a small fixed window, but the image grew with the window when maximized. A viewport-based content height also created a second layout boundary, producing unnecessary scrolling and displaced text.

## Why it matters

An image file and an image inside a document have different responsibilities:

- A standalone image is the content, so the preview stage should give it the available space and contain it without cropping.
- A document image supports the content, so the document layout must constrain it independently of the window size.

Sharing the same asset does not mean sharing the same presentation component.

## Recommended boundary

Finder decides which window opens from the file type. Image files open the dedicated image preview. Text files open the text window, which composes a document-specific renderer. The About renderer owns its avatar dimensions, readable line length, spacing, and responsive profile layout.

The window owns exactly one scrolling region. Its header stays fixed, and its document body scrolls only when the rendered content is taller than the available area.

## Scaling lesson

If more text document types appear, add explicit document renderers rather than teaching the image preview stage about documents. Extract shared document primitives only after multiple renderers need the same behavior. This keeps feature ownership clear and avoids a broad CSS rule changing unrelated windows.
