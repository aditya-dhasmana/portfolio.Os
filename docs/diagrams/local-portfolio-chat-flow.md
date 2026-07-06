# Local Portfolio Chat Flow

```mermaid
flowchart TD
    Visitor["Visitor asks a question"] --> Safari["Safari chat UI"]
    Safari --> Engine["Local portfolio assistant"]
    Data["Structured portfolio data"] --> Engine
    Engine --> Response["Message, cards, suggestions, actions"]
    Response --> Safari
    Safari --> WindowStore["Existing window store"]
    Safari --> FinderStore["Existing Finder location store"]
    Safari --> External["Verified external link or resume PDF"]
```
