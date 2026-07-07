# Lesson — Structured responses keep chat architecture honest

## What

The assistant returns message text, cards, suggestions, and typed actions instead of returning JSX or directly opening windows.

## Why

This separates three responsibilities: understanding a question, deciding what the response means, and rendering or executing it. That keeps the local engine testable and prevents business rules from spreading through UI event handlers.

## Beginner approach

Put a long `if/else` chain inside the component and render different markup in every branch. This works quickly but couples wording, UI, and actions.

## Recommended approach

Keep intent matching in a pure module and return one stable response shape. Let Safari render that shape and translate explicit actions into existing store calls.

## Scaling lesson

If a second provider is added later, it should produce the same response contract. The UI then stays stable while the interpretation strategy evolves.

## Memory lesson

Store the smallest fact that lets the next question make sense. Remember a project ID, not a ProjectCard component. Remember an intent, not a copied response. Small, domain-level memory stays testable and can be reconstructed from the data source.

Session memory belongs in Safari today because only Safari uses it. Moving it into Zustand before another feature needs it would create global coupling without a benefit.
