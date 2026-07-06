# Complete Coding Tutorial Transcript

## Video Title Options

1. Build a macOS Style Portfolio in React from Scratch
2. React Portfolio Course: Desktop Windows, Finder, Mobile Apps, and GitHub Data
3. Build Macfolio: A Real React Portfolio with Vite, Zustand, GSAP, and Monaco
4. From Beginner React to Real App Architecture: Build an Interactive MacBook Portfolio
5. Build a Full Operating-System Style Portfolio Website in React

## Full Chapter Timeline

- 00:00 - 01:00: Cold open and final result
- 01:00 - 06:00: Product demo
- 06:00 - 13:00: Tools, setup, and dependencies
- 13:00 - 22:00: React foundation and app entry
- 22:00 - 34:00: Styling and assets
- 34:00 - 48:00: App composition and desktop/mobile split
- 48:00 - 1:10:00: Desktop shell and window state
- 1:10:00 - 1:32:00: Finder and portfolio file-system data
- 1:32:00 - 1:55:00: GitHub API and code preview
- 1:55:00 - 2:18:00: Mobile shell and app stack
- 2:18:00 - 2:38:00: Mobile apps, localStorage, weather, PDF, and gallery
- 2:38:00 - 2:52:00: Error handling, edge cases, and polish
- 2:52:00 - 3:00:00: Final demo and outro

## Part 1: Hook, Demo, Setup, Foundation

### Chapter 1: Cold Open / Hook

Approx time: 00:00 - 01:00

[Screen: Show the finished Macfolio desktop experience. Open Finder, VS Code, Gallery, Resume, and then resize to mobile.]
[Action: Move quickly through the final result before showing any code.]
[File: None]

Voiceover:
"Most developer portfolios are simple pages. You scroll through a hero section, maybe click a project card, and then you leave. In this tutorial, we are going to build something much more memorable: a portfolio that behaves like a small operating system.

On desktop, we will build a macOS-style shell with a navbar, a dock, draggable windows, Finder-style folders, a resume PDF window, a gallery, a contact app, a terminal-style skills window, and a VS Code-style source preview that can load public GitHub repositories.

On mobile, we will not just squeeze the same desktop UI into a small screen. We will build a separate iPhone-style shell with widgets, app icons, animated app screens, a todo app with browser storage, weather data, projects, resume, gallery, and contact.

But the real reason to watch this is architecture. If you know basic React and you keep wondering where code should live, this project is perfect. We are going to practice ownership, state placement, feature folders, data flow, and the engineering rhythm that turns a cool UI into a maintainable app."

Coding Direction:
- Do not code yet.
- Show the final product first.
- Make the viewer feel the scope: desktop shell, mobile shell, data layer, windows, Finder, GitHub preview, and browser APIs.

Explanation:
- The project is not a browser extension.
- There is no scoring engine.
- The custom rules in this project are UI and data rules: window behavior, Finder open actions, todo filtering, weather normalization, and GitHub file mapping.

Test:
- Confirm the final app runs.
- Open several windows.
- Resize the browser below 768px and show the mobile shell.

### Chapter 2: Final Demo

Approx time: 01:00 - 06:00

[Screen: Show the completed app in the browser.]
[Action: Walk through desktop first, then mobile.]
[File: None]

Voiceover:
"Let us demo the finished project like a real product.

This is Macfolio. The app starts with an intro loader, then shows a desktop portfolio experience. At the top, we have a menu bar with navigation links and the current time. At the bottom, we have a dock. Each dock icon represents a portfolio app.

When I click Finder, a draggable Finder window opens. Finder shows favorites, projects, breadcrumbs, and a file grid. If I double-click a folder, Finder moves into that folder. If I open a text file, it opens a text window. If I open an image, it opens an image viewer. If I open a code file, it opens the VS Code-style preview.

The Resume app renders a real PDF from the public files folder. The Gallery app has tabs, grid and list views, image preview, likes, downloads, and share behavior. The Contact app shows social links. The Terminal app shows the tech stack.

Now watch what happens on mobile. Instead of forcing the desktop UI onto a phone, the app switches to a mobile shell. We get widgets, app icons, a mobile dock, and animated app screens. The todo app stores data in localStorage. The weather app uses geolocation and Open-Meteo. The Projects app uses the same portfolio file-system idea as the desktop Finder.

This is the big project lesson: desktop and mobile share portfolio ideas, but they do not share the same shell behavior. Same domain, different interaction model."

Coding Direction:
- Use the final demo to establish the destination.
- Mention exact major features the viewer will build.
- Avoid pretending unfinished features exist.

Explanation:
- Desktop behavior belongs to `src/features/desktop-shell`.
- Mobile behavior belongs to `src/features/mobile-shell`.
- Portfolio data belongs to `src/features/portfolio`.
- Finder behavior belongs to `src/features/finder`.
- Code preview behavior belongs to `src/features/code-preview`.

Test:
- Show: dock opens windows.
- Show: Finder navigation works.
- Show: mobile app opens and back navigation works.

### Chapter 3: Tools and Setup

Approx time: 06:00 - 13:00

[Screen: Show VS Code or editor, terminal, and browser.]
[Action: Create a new Vite React project from scratch.]
[File: `package.json`]

Voiceover:
"Now let us build the project from zero.

First, make sure Node is installed. Open your terminal and run:"

```bash
node -v
npm -v
```

"If both commands print a version number, we are ready.

Now create a new Vite React project."

```bash
npm create vite@latest Macfolio -- --template react
cd Macfolio
npm install
```

"Next, install the libraries used by this project. I am installing them in groups so the purpose is clear."

```bash
npm install zustand immer clsx dayjs react-responsive
npm install gsap @gsap/react framer-motion
npm install lucide-react react-icons react-tooltip
npm install @monaco-editor/react react-pdf
npm install tailwindcss @tailwindcss/vite postcss-nesting sass-embedded
```

"Now start the dev server."

```bash
npm run dev
```

"At this point, Vite gives us a basic React app. The first job in a serious tutorial is not adding fancy features. It is cleaning the foundation so every future file has a reason to exist."

Coding Direction:
- Create the Vite app.
- Install dependencies from the real project.
- Open `package.json` and confirm the scripts:
  - `dev`
  - `build`
  - `lint`
  - `preview`

Explanation:
- Vite handles development and bundling.
- React renders the UI.
- Zustand handles shared state.
- GSAP handles desktop drag and animation.
- Framer Motion handles mobile transitions.
- Monaco powers the code editor preview.
- React PDF renders the resume.
- Dayjs formats time.
- Lucide and React Icons provide icons.

Test:
- Run `npm run dev`.
- Open the local URL.
- Confirm the starter React app appears.

### Chapter 4: Project Foundation

Approx time: 13:00 - 22:00

[Screen: Open `src/main.jsx`, `src/app/App.jsx`, `src/App.jsx`, and `src/index.css`.]
[Action: Clean the starter project and create the app composition boundary.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\main.jsx`]

Voiceover:
"Let us start with the React entry point.

In Vite, `index.html` contains a div with the id `root`. React finds that div and renders our application into it.

Open `src/main.jsx`. This file should stay small. It imports React, imports React DOM, imports global CSS, imports the App component, and renders the app inside `StrictMode`."

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

"The important architecture decision here is that `main.jsx` should not contain product logic. It should not know about Finder, windows, GitHub, weather, or mobile apps. It just starts React.

Next, create `src/app/App.jsx`. This is our composition root. A composition root is the file that decides which big parts of the app are connected together.

We also keep `src/App.jsx` as a compatibility bridge. That file simply re-exports from `src/app/App.jsx`. In a real project, compatibility bridges help us refactor gradually without breaking old imports."

Coding Direction:
- Create `src/app/App.jsx`.
- Keep `src/App.jsx` as:

```jsx
export { default } from "./app/App";
```

- Import `App` from `./app/App.jsx` in `main.jsx`.

Explanation:
- `main.jsx` owns bootstrapping.
- `app/App.jsx` owns top-level composition.
- Feature internals should not move into `main.jsx`.
- A compatibility bridge is temporary. It preserves old import paths while the architecture improves.

Test:
- Run the dev server.
- Confirm the app still renders after moving `App`.

## Part 2: Core Layout and First Features

### Chapter 5: Styling and Assets Setup

Approx time: 22:00 - 34:00

[Screen: Open `public`, `src/index.css`, and `src/features/mobile-shell/styles.css`.]
[Action: Explain where assets and styles live.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\index.css`]

Voiceover:
"Before we build components, we need to understand assets and styling.

This project uses the `public` folder for static files that the browser can request directly. That includes icons, images, wallpaper, the resume PDF, and app icons.

For example, if an image lives at `public/images/finder.png`, we can reference it in React as `/images/finder.png`.

The desktop styles mostly live in `src/index.css`. This file includes global CSS, Tailwind setup, layout styles, dock styles, Finder styles, window styles, VS Code styles, Gallery styles, and desktop responsive rules.

The mobile styles live in `src/features/mobile-shell/styles.css`. That is a good ownership decision because the mobile shell is its own feature. Mobile has its own home screen, widgets, app frame, and app screens.

One beginner mistake is thinking CSS files are not architecture. They are. If all styles become one huge unstructured file, changing one feature can accidentally affect another. In this project, the next future improvement would be moving more feature-specific styles closer to their feature folders or documenting stricter class naming."

Coding Direction:
- Copy static assets into:
  - `public/images`
  - `public/icons`
  - `public/icons/mobile-icons`
  - `public/files/resume.pdf`
- Configure Tailwind through `vite.config.js` using `@tailwindcss/vite`.
- Keep desktop global styles in `src/index.css`.
- Keep mobile shell styles in `src/features/mobile-shell/styles.css`.

Explanation:
- Use `public` for assets referenced by URL.
- Use `src` for code imported by JavaScript.
- CSS organization should follow ownership as the app grows.

Test:
- Add a temporary image in a component using `/images/logo.svg`.
- Confirm it renders.

### Chapter 6: Main Layout and Desktop/Mobile Split

Approx time: 34:00 - 48:00

[Screen: Open `src/app/App.jsx`.]
[Action: Build the top-level shell switch.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\app\App.jsx`]

Voiceover:
"Now we need the main layout decision.

This app has two different experiences. Desktop users see a macOS-style shell. Mobile users see an iPhone-style shell.

This is not just responsive CSS. The interaction models are different. Desktop has draggable windows. Mobile has stack navigation and app frames.

So in `App.jsx`, we check the viewport with `useMediaQuery`. If the viewport is 768 pixels or smaller, we render the mobile shell. Otherwise, we render the desktop shell."

```jsx
const isMobile = useMediaQuery({ maxWidth: 768 });

if (isMobile) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<IntroLoader />}>
        <MobileApp />
      </Suspense>
    </ErrorBoundary>
  );
}
```

"We also use lazy loading. Heavy windows like Resume, Gallery, VS Code, Finder, and MobileApp do not need to be loaded immediately. React `lazy` and `Suspense` let us load them only when needed.

This is the point where a beginner may ask: why not just import everything normally? You can at first. But as the app grows, initial bundle size matters. Lazy loading is useful when a feature is large and not needed on the first render."

Coding Direction:
- Import `lazy`, `Suspense`, `useEffect`, and `useState`.
- Use `useMediaQuery` to choose desktop or mobile.
- Lazy-load desktop windows and `MobileApp`.
- Add `IntroLoader` while startup work is happening.
- Wrap major branches with `ErrorBoundary`.

Explanation:
- `useState` stores local readiness state.
- `useEffect` runs startup loading after render.
- `Suspense` gives React a fallback while lazy components load.
- `ErrorBoundary` catches render-time crashes and shows a debug screen.

Test:
- Run the app wide: desktop shell should show.
- Resize below 768px: mobile shell should show.

### Chapter 7: Core Window State Store

Approx time: 48:00 - 1:02:00

[Screen: Open `src/features/desktop-shell/store/windowStore.js` and `src/features/desktop-shell/config/windowConfig.js`.]
[Action: Create the shared window store.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\features\desktop-shell\store\windowStore.js`]

Voiceover:
"Now we are going to build one of the most important systems in the project: desktop window state.

At first, you may think each window can have its own `isOpen` state. But that breaks down quickly.

The dock needs to open windows. The navbar needs to open windows. Finder needs to open the resume, image, text, and VS Code windows. Window controls need to close, minimize, and maximize windows. Clicking a window needs to focus it.

That means window state is not owned by one window. It is owned by the desktop shell.

So we create a Zustand store."

```jsx
const useWindowStore = create((set) => ({
  windows: WINDOW_CONFIG,
  openWindow: (name, data = null) => {
    // update the selected window
  },
  closeWindow: (name) => {
    // close the selected window
  },
}));
```

"A window record stores whether the window is open, whether it is minimized, its z-index, its size, its position, and optional data.

That optional data is what allows Finder to open a generic text window with different content, or VS Code with a selected file."

Coding Direction:
- Create `src/features/desktop-shell/config/windowConfig.js`.
- Define `INITIAL_Z_INDEX`, `DEFAULT_WINDOW_SIZES`, and `WINDOW_CONFIG`.
- Create `src/features/desktop-shell/store/windowStore.js`.
- Add actions:
  - `openWindow`
  - `closeWindow`
  - `focusWindow`
  - `minimizeWindow`
  - `restoreWindow`
  - `setWindowPosition`
  - `setWindowSize`
  - `setSizeMode`
  - `toggleMaximize`

Explanation:
- Local state is good when one component owns the behavior.
- Shared state is needed when distant components coordinate.
- Zustand lets components read state and call actions without prop drilling.
- z-index is how we bring the active window to the front.

Test:
- Temporarily call `openWindow("finder")` from a button.
- Confirm the store state changes.

### Chapter 8: Desktop Shell Components

Approx time: 1:02:00 - 1:10:00

[Screen: Open `Dock.jsx`, `Navbar.jsx`, `Home.jsx`, and `WindowControls.jsx`.]
[Action: Build visible desktop shell pieces.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\features\desktop-shell\components\Dock.jsx`]

Voiceover:
"Now that state exists, we can build UI that talks to it.

The dock reads a list of apps from `dockApps`. When the user clicks an icon, the dock checks the current window state.

If the window is closed, it opens it. If the window is minimized, it restores it. If it is already open, it focuses it.

That is an important pattern: the component does not directly control every detail. It sends intent to the store.

Next, the navbar displays top navigation and opens windows like Finder, Contact, and Resume.

The Home component renders project folders on the desktop. These folders come from the loaded Work data. When the user double-clicks a project, Home sets the Finder location and opens Finder.

WindowControls renders the three traffic-light controls. Each control calls the store action for close, minimize, or maximize."

Coding Direction:
- Create:
  - `src/features/desktop-shell/components/Dock.jsx`
  - `src/features/desktop-shell/components/Navbar.jsx`
  - `src/features/desktop-shell/components/Home.jsx`
  - `src/features/desktop-shell/components/WindowControls.jsx`
- Create `src/constants/desktopApps.js` for dock metadata.
- Create `src/constants/navigation.js` for navbar links and icons.

Explanation:
- Config describes what exists.
- Components render it.
- Stores change behavior.
- This keeps UI and state responsibilities separate.

Test:
- Click dock icons.
- Click navbar links.
- Confirm store actions fire and windows can open.

## Part 3: Data, Finder, Code Preview, Mobile

### Chapter 9: Window Wrapper

Approx time: 1:10:00 - 1:22:00

[Screen: Open `src/features/desktop-shell/hoc/windowWrapper.jsx`.]
[Action: Create the wrapper that gives windows shared behavior.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\features\desktop-shell\hoc\windowWrapper.jsx`]

Voiceover:
"Every desktop app needs the same outside behavior. It needs position, size, focus, dragging, maximize, and restore. But the inside content is different.

The Contact window renders links. Resume renders a PDF. Finder renders folders. Gallery renders images.

We do not want to copy drag logic into every window. So we create a higher-order component called `windowWrapper`.

A higher-order component is a function that receives a component and returns a new component with extra behavior."

```jsx
const windowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { windows, focusWindow } = useWindowStore();
    const state = windows[windowKey];

    if (!state?.isOpen) return null;

    return (
      <section onMouseDown={() => focusWindow(windowKey)}>
        <Component {...props} />
      </section>
    );
  };

  return Wrapped;
};
```

"The real file goes further. It uses refs to access the DOM element, GSAP Draggable for dragging, `useLayoutEffect` to apply size and position before the browser paints, and store actions to save the window position."

Coding Direction:
- Create `windowWrapper.jsx`.
- Read window state from `useWindowStore`.
- Return `null` if the window is not open.
- Apply fixed positioning, z-index, size, and position.
- Register GSAP Draggable using the `#window-header` as the drag handle.
- Save position on drag end.
- Support full-screen and normal size modes.

Explanation:
- `useRef` stores a reference to a DOM node.
- `useEffect` runs after render.
- `useLayoutEffect` runs before paint, useful for layout updates.
- A wrapper is useful when many components share the same outer behavior.

Test:
- Wrap one simple window.
- Open it.
- Drag it.
- Click it and confirm it comes to the front.
- Maximize and restore it.

### Chapter 10: Portfolio Data Layer

Approx time: 1:22:00 - 1:32:00

[Screen: Open `src/api/github.js`, `src/features/portfolio/utils/buildWorkLocation.js`, `src/features/portfolio/hooks/usePortfolioFileSystem.js`, and `src/store/useDataStore.js`.]
[Action: Build public GitHub loading and portfolio file-system mapping.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\api\github.js`]

Voiceover:
"Now we need real portfolio data.

The app uses public GitHub requests. In `.env`, the project stores:"

```txt
VITE_GITHUB_USERNAME=aditya-dhasmana
```

"Because this variable starts with `VITE_`, Vite exposes it to browser code. That is okay for a username. It would not be okay for a private token.

In `api/github.js`, we create helpers like `fetchRepos` and `fetchRepoTree`. These functions know about GitHub URLs.

But Finder does not want GitHub-shaped data. Finder wants folders and files.

So `buildWorkLocation` maps repositories into a fake file-system structure. Each repository becomes a folder. Inside that folder, we create a Source Code folder, a Live Site file, and a Project.txt file.

Then `usePortfolioFileSystem` becomes the loading coordinator. It checks the store, loads if needed, saves the Work folder, and exposes loading and error state."

Coding Direction:
- Create `src/api/github.js`.
- Add `fetchRepos`.
- Add `fetchRepoTree` with limited recursion depth.
- Create `src/store/useDataStore.js`.
- Create `src/features/portfolio/utils/buildWorkLocation.js`.
- Create `src/features/portfolio/hooks/usePortfolioFileSystem.js`.

Explanation:
- API helpers know external API details.
- Mappers convert external data into app data.
- Hooks coordinate loading for React.
- Stores hold shared data used by multiple features.

Test:
- Log the result of `loadPortfolioFileSystem`.
- Confirm it returns a Work folder with children.
- Test with missing `VITE_GITHUB_USERNAME`; fallback data should still keep the app usable.

### Chapter 11: Finder Feature

Approx time: 1:32:00 - 1:50:00

[Screen: Open `src/features/finder/FinderWindow.jsx` and its components.]
[Action: Build Finder one layer at a time.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\features\finder\FinderWindow.jsx`]

Voiceover:
"Now we can build Finder.

Finder is a perfect feature to decompose because it has UI, state, data shape, and rules.

First, we create `FinderWindow.jsx`. This is the coordinator. It reads `activeLocation` from the location store. If there is no active location yet, it shows a loading message.

Then we create smaller components.

`FinderSidebar` renders favorites and projects.

`FinderBreadcrumbs` renders the current folder trail.

`FinderGrid` renders the files and folders in the active location.

The key decision is that the grid does not decide what happens when a file opens. It only says, 'this item was opened.' The parent decides what to do."

Coding Direction:
- Create:
  - `src/features/finder/FinderWindow.jsx`
  - `src/features/finder/components/FinderSidebar.jsx`
  - `src/features/finder/components/FinderBreadcrumbs.jsx`
  - `src/features/finder/components/FinderGrid.jsx`
  - `src/features/finder/utils/buildBreadcrumbTrail.js`
  - `src/features/finder/utils/fileTypes.js`
  - `src/features/finder/utils/getFinderOpenAction.js`
- Create or update `src/store/location.js` with:
  - `activeLocation`
  - `history`
  - `setActiveLocation`
  - `goBackLocation`
  - `jumpToLocation`
  - `resetActiveLocation`

Explanation:
- Finder location is separate from window state.
- Window state answers: is Finder open?
- Location state answers: what folder is Finder showing?
- Breadcrumbs work because file-system nodes have parent references.

Test:
- Open Finder.
- Click sidebar locations.
- Double-click a folder.
- Use back navigation.
- Confirm breadcrumbs update.

### Chapter 12: Finder Open Rules

Approx time: 1:50:00 - 1:58:00

[Screen: Open `src/features/finder/utils/getFinderOpenAction.js`.]
[Action: Explain the rule engine for file opening.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\features\finder\utils\getFinderOpenAction.js`]

Voiceover:
"This file is one of the best architecture lessons in the project.

When a user opens an item, Finder needs to decide what should happen.

Folder -> set location.
PDF -> open Resume.
Local text file -> open Text window.
Image -> open Image window.
URL or Figma link -> open external link.
Code file -> open VS Code with the file data.

We could put all of that directly inside the React component, but that would mix rendering, state, and business rules.

Instead, `getFinderOpenAction` is a pure function. It receives an item and returns an action object."

```js
if (item.kind === "folder") {
  return {
    type: FINDER_OPEN_ACTIONS.SET_LOCATION,
    location: item,
  };
}
```

"The function does not call `window.open`. It does not call Zustand. It does not update React state. It only decides.

Then FinderWindow performs the side effect based on that decision."

Coding Direction:
- Define `FINDER_OPEN_ACTIONS`.
- Add file type helpers in `fileTypes.js`.
- Add one condition per file behavior.
- Keep the utility pure.

Explanation:
- Pure decision logic is easier to test.
- Side effects belong in the feature coordinator.
- This is a small rules engine, not a scoring system.

Test:
- Open each file type:
  - folder
  - PDF
  - text
  - image
  - URL
  - code file

### Chapter 13: Code Preview Feature

Approx time: 1:58:00 - 2:15:00

[Screen: Open code-preview window and components.]
[Action: Build VS Code-style source preview.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\features\code-preview\windows\CodePreviewWindow.jsx`]

Voiceover:
"Now we build the VS Code-style source preview.

This feature has a coordinator and three panels.

The coordinator is `CodePreviewWindow.jsx`. It loads repositories, stores the active repo, stores repo trees, tracks the active file, tracks open tabs, and controls layout settings like showing the explorer or terminal.

The Explorer component renders repositories and nested source files.

The Editor component uses Monaco Editor. It renders tabs, chooses the language from the file extension, and shows file content.

The Terminal component displays repository status and links. It is not a real command terminal. It is a UI panel."

Coding Direction:
- Create:
  - `src/features/code-preview/windows/CodePreviewWindow.jsx`
  - `src/features/code-preview/components/Explorer.jsx`
  - `src/features/code-preview/components/Editor.jsx`
  - `src/features/code-preview/components/Terminal.jsx`
- Fetch repos with `fetchRepos`.
- Fetch repo trees with `fetchRepoTree`.
- Fetch file content with `file.download_url`.
- Add tab behavior with `openTabs`, `activeFile`, and `closeTab`.

Explanation:
- `useState` manages feature-local state.
- `useEffect` loads repos after mount.
- `useCallback` stabilizes functions used by effects.
- Monaco handles syntax highlighting and editor UI.
- Future improvement: extract repo loading and tab state into a custom hook.

Test:
- Open VS Code from the dock.
- Select a repo.
- Open a file.
- Open multiple tabs.
- Close a tab.
- Open a code file from Finder and confirm it appears in VS Code.

### Chapter 14: Mobile Shell

Approx time: 2:15:00 - 2:30:00

[Screen: Open `src/features/mobile-shell/MobileApp.jsx`, `HomeScreen.jsx`, and `AppFrame.jsx`.]
[Action: Build mobile stack navigation.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\features\mobile-shell\MobileApp.jsx`]

Voiceover:
"Now we build mobile.

The mobile app uses a stack. A stack is just an array where the last item is the active screen.

When the user taps an app icon, we push a route onto the stack. When the user goes back, we remove the last route.

This gives us mobile-style navigation without introducing a full router."

```jsx
const [stack, setStack] = useState([]);
const activeRoute = stack[stack.length - 1] || null;
```

"HomeScreen renders the mobile wallpaper, status bar, clock, widgets, app grid, search pill, and dock.

AppFrame wraps every app screen with a consistent header, back button, status bar, scroll area, and swipe-back behavior using Framer Motion."

Coding Direction:
- Create:
  - `src/features/mobile-shell/MobileApp.jsx`
  - `src/features/mobile-shell/shell/HomeScreen.jsx`
  - `src/features/mobile-shell/shell/AppFrame.jsx`
  - `src/features/mobile-shell/shell/AppIcon.jsx`
  - `src/features/mobile-shell/shell/StatusBar.jsx`
  - `src/features/mobile-shell/data/apps.js`
- Add `APP_COMPONENTS` mapping from app id to component.
- Use `AnimatePresence` and `motion.div` for transitions.

Explanation:
- Stack navigation is beginner-friendly.
- `props` pass callbacks from shell to icons and apps.
- Framer Motion handles screen enter and exit animation.

Test:
- Resize to mobile.
- Tap an app icon.
- Use back button.
- Swipe back from the edge.

## Part 4: Advanced Logic, Edge Cases, Polish, Outro

### Chapter 15: Mobile Apps and Browser APIs

Approx time: 2:30:00 - 2:42:00

[Screen: Open `todos.js`, `weather.js`, `Projects.jsx`, `Resume.jsx`, and `Gallery.jsx`.]
[Action: Build and explain mobile mini apps.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\features\mobile-shell\data\todos.js`]

Voiceover:
"The mobile shell becomes useful when we add apps.

The Todo app teaches localStorage. localStorage lets us save data in the browser so it survives refreshes.

The `useTodos` hook reads todos, writes todos, calculates stats, and exposes actions like `addTodo`, `toggleTodo`, and `deleteTodo`.

The Weather app teaches browser APIs and external APIs. It tries geolocation first. If that fails, it falls back to New Delhi. Then it calls Open-Meteo and normalizes the response into a UI-friendly weather object.

The Projects app uses the same portfolio file-system hook as desktop. That is good reuse. We are sharing domain data, not shell UI.

The Resume app uses React PDF. The Gallery app uses local component state for image preview. Local state is correct there because selected gallery image only matters inside Gallery."

Coding Direction:
- Create mobile apps:
  - `About.jsx`
  - `Articles.jsx`
  - `Code.jsx`
  - `Contact.jsx`
  - `Gallery.jsx`
  - `Projects.jsx`
  - `Resume.jsx`
  - `Skills.jsx`
  - `Todo.jsx`
  - `Weather.jsx`
- Create `data/todos.js`.
- Create `data/weather.js`.
- Create `components/WeatherIcon.jsx`.

Explanation:
- Use local state for one-screen UI state.
- Use a custom hook for reusable lifecycle logic.
- Use shared portfolio data when desktop and mobile need the same domain.
- Use fallback data when browser APIs fail.

Test:
- Add, complete, and delete todos.
- Refresh and confirm todos persist.
- Open Weather and handle loading/error.
- Open Resume and confirm PDF renders.
- Open Gallery and preview an image.

### Chapter 16: Error Handling and Edge Cases

Approx time: 2:42:00 - 2:50:00

[Screen: Open `ErrorBoundary.jsx`, `IntroLoader.jsx`, API files, and weather/todo hooks.]
[Action: Explain real tricky parts.]
[File: `C:\Users\ADITYA\Desktop\macbookStylePortfolio\Macfolio\src\components\ErrorBoundary.jsx`]

Voiceover:
"Now let us talk about the parts that usually break.

First, missing environment variables. If `VITE_GITHUB_USERNAME` is missing, GitHub repos return an empty array. The portfolio builder has fallback repositories so the UI does not become completely empty.

Second, async loading. Components can unmount before an async request finishes. Several files use an `alive` or `isAlive` flag to avoid updating state after unmount.

Third, browser APIs. Geolocation can be denied. Weather requests can fail. localStorage can contain invalid JSON. The project handles these with fallbacks.

Fourth, undefined data. React renders before async data exists, so we use optional chaining and empty defaults.

Fifth, frontend secrets. The project intentionally uses only public GitHub requests. If we ever need private repos or higher rate limits, the token must move to a backend or API route.

Finally, layout. Desktop windows need size and position rules. Mobile needs its own CSS because the interaction model is different."

Coding Direction:
- Add ErrorBoundary around major app branches.
- Add loading UI with IntroLoader and empty states.
- Use fallback data in the portfolio builder.
- Guard async effects with cleanup flags.
- Avoid private tokens in browser code.

Explanation:
- Errors are part of architecture.
- Loading state is not decoration; it is user feedback.
- Browser APIs are not guaranteed to work.
- Defensive code protects the experience.

Test:
- Remove `VITE_GITHUB_USERNAME` temporarily and reload.
- Deny geolocation and confirm fallback behavior.
- Corrupt localStorage manually and confirm todos recover.
- Open every window after resizing.

### Chapter 17: Final Polish

Approx time: 2:50:00 - 2:55:00

[Screen: Show UI polish: dock animation, window dragging, mobile transitions, loading spinners.]
[Action: Explain polish decisions.]
[File: Multiple files]

Voiceover:
"The final layer is polish.

GSAP gives the dock a responsive icon animation and makes desktop folders and windows draggable.

Framer Motion gives mobile screens a smooth slide animation and gallery interactions a more natural feel.

OptimizedImage shows a loading spinner and fallback message if an image fails.

Window controls keep behavior consistent across windows. Tooltips help dock icons. Empty states tell the user what is happening instead of leaving blank space.

Accessibility can continue improving. For example, some traffic-light controls could become real buttons with stronger keyboard behavior. That would be a good future upgrade."

Coding Direction:
- Add GSAP animations to Dock and Home.
- Add Framer Motion transitions to mobile and gallery.
- Use `OptimizedImage` where useful.
- Add loading, empty, and error states.

Explanation:
- Polish is not only visual.
- Good polish clarifies system state.
- Animation should support the interaction, not distract from it.

Test:
- Move the mouse across the dock.
- Drag desktop folders.
- Open and close mobile screens.
- Trigger loading states.

### Chapter 18: Final Demo Again

Approx time: 2:55:00 - 2:58:00

[Screen: Show complete app from start to finish.]
[Action: Walk through the main user flow.]
[File: None]

Voiceover:
"Now let us run the completed project one more time.

We start on desktop. The app loads portfolio data, shows the shell, and renders project folders.

We open Finder. Finder reads active location from the location store. We open a project folder. Breadcrumbs update. We open a code file. Finder returns an action, the window store opens VS Code, and VS Code prepares the file for preview.

We open Resume and Gallery. Resume renders the PDF. Gallery uses local state for selected images and liked images.

Now we switch to mobile. The mobile shell renders widgets, app icons, and the dock. We open Todo, add a task, refresh, and the task remains because it is stored in localStorage. We open Weather and see the browser/API flow. We open Projects and see the shared portfolio data on mobile.

This is what we built: a real interactive portfolio, but also a real architecture practice project."

Coding Direction:
- Show desktop flow.
- Show Finder to VS Code flow.
- Show mobile flow.
- Show localStorage persistence.

Explanation:
- User action -> component handler -> store or hook action -> state update -> UI rerender.
- This pattern repeats throughout the project.

Test:
- Run:

```bash
npm run lint
npm run build
```

- Confirm both pass.

### Chapter 19: Outro

Approx time: 2:58:00 - 3:00:00

[Screen: Show final app and then code folders.]
[Action: Summarize what the viewer learned.]
[File: None]

Voiceover:
"And that is Macfolio.

Yes, we built a polished React portfolio. But more importantly, we practiced how to think like an engineer.

We separated app startup from feature internals. We kept desktop and mobile shells separate because they have different interaction models. We created a window store because many components need to coordinate window behavior. We created a portfolio data boundary so the UI does not depend directly on GitHub-shaped data. We decomposed Finder into components and pure rules. We built a code preview feature with repository loading, tabs, and Monaco. We built mobile navigation with a stack. We used browser storage, geolocation, PDF rendering, animation, loading states, and error handling.

The next upgrades would be extracting more code-preview logic into a custom hook, moving more constants closer to their feature owners, improving accessibility on window controls, and continuing to split styles by feature as the project grows.

If you are a beginner, the biggest takeaway is this: do not only ask, 'How do I write the code?' Ask, 'Who owns this logic, where should it live, and what happens when this project grows?'

That is the engineering rhythm we practiced in this tutorial."

Coding Direction:
- No new code.
- End on the final app.

Explanation:
- Architecture is not about fancy folders.
- Architecture is about making change predictable.
- This project is a practical bridge from beginner React to real project organization.

Test:
- Final verification:
  - `npm run lint`
  - `npm run build`

