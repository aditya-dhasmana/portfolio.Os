# Building a Local Portfolio Chat

## Beginner explanation

Think of the feature as a museum guide. The data file is the approved museum catalogue, the assistant is the guide who recognizes common questions, and Safari is the room where the conversation is displayed. The guide may only answer from the catalogue.

## Developer explanation

Questions are normalized and scored against weighted phrases, keywords, and synonyms. Low scores use a helpful fallback. Commands and contextual follow-ups run before general scoring. Each result uses a structured response contract so the UI can render messages, cards, suggestions, and actions consistently.

## Engineering explanation

Ownership is split by change reason. Portfolio facts change when content changes. Intent rules change when language support changes. Safari changes when presentation changes. Window and Finder stores remain unchanged because opening and navigation were already their responsibilities.

The provider receives the current memory and returns both a response and the next memory. This makes state transitions explicit: the assistant does not secretly mutate UI state, and Safari does not need to understand recommendation rules.

## Common mistakes

- Putting every answer and action inside one React component.
- Automatically opening links as soon as a keyword appears.
- Claiming projects, experience, or contact data that does not exist.
- adding a global state manager for state used by only one window.
- abstracting a provider system before a second provider exists.
- storing rendered cards or entire messages as contextual memory.
- treating a short visual delay as part of the assistant engine.

## Architecture challenge

Design how conversation history could persist after Safari closes. Decide who owns it, when it should reset, and whether it belongs in local storage or the existing global store before writing code.
