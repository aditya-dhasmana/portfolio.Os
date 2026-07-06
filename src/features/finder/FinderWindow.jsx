/**
 * PURPOSE:
 * Compose the desktop Finder window.
 * RESPONSIBILITY:
 * Connect Finder UI sections to location state and window-opening actions.
 * USED BY:
 * src/windows/Finder.jsx compatibility export.
 * DEPENDS ON:
 * Finder components, Finder utilities, desktop window wrapper, location store, and window store.
 * SHOULD NOT HANDLE:
 * Raw GitHub fetching, desktop dock behavior, mobile navigation, or portfolio data construction.
 * SCALING NOTES:
 * Keep this file as the feature coordinator. Move rendering details into components and pure decisions into utils.
 */

import { Search, ArrowLeft } from "lucide-react";

import { locations } from "#constants";
import { useDataStore, useLocationStore, useWindowStore } from "#store";

import WindowControls from "../desktop-shell/components/WindowControls";
import windowWrapper from "../desktop-shell/hoc/windowWrapper";
import FinderBreadcrumbs from "./components/FinderBreadcrumbs";
import FinderGrid from "./components/FinderGrid";
import FinderSidebar from "./components/FinderSidebar";
import {
  FINDER_OPEN_ACTIONS,
  getFinderOpenAction,
} from "./utils/getFinderOpenAction";

const Finder = () => {
  const { openWindow } = useWindowStore();
  const { work } = useDataStore();

  const {
    currentPath,
    navigateTo,
    goBackLocation,
  } = useLocationStore();

  const currentLocation = currentPath[currentPath.length - 1];

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        Loading...
      </div>
    );
  }

  const openItem = (item) => {
    const action = getFinderOpenAction(item);

    if (action.type === FINDER_OPEN_ACTIONS.NAVIGATE_TO_FOLDER) {
      navigateTo([...currentPath, action.folder]);
      return;
    }

    if (action.type === FINDER_OPEN_ACTIONS.OPEN_WINDOW) {
      openWindow(action.windowId, action.data);
      return;
    }

    if (action.type === FINDER_OPEN_ACTIONS.OPEN_EXTERNAL_LINK) {
      window.open(action.href, "_blank");
    }
  };

  const favorites = [
    work || locations.work,
    locations.about,
    locations.gallery,
    locations.resume,
  ];

  const projects = work?.children || [];

  return (
    <>
      <div id="window-header">
        <WindowControls target="finder" />
        <button type="button" onClick={goBackLocation} className="ml-3">
          <ArrowLeft className="icon" />
        </button>
        <Search className="icon" />
      </div>

      <FinderBreadcrumbs
        currentPath={currentPath}
        onNavigate={navigateTo}
      />

      <div className="bg-white flex h-full">
        <FinderSidebar
          favorites={favorites}
          projects={projects}
          currentPath={currentPath}
          onNavigate={navigateTo}
        />

        <FinderGrid
          items={currentLocation.children}
          onOpenItem={openItem}
        />
      </div>
    </>
  );
};

const FinderWindow = windowWrapper(Finder, "finder");

export default FinderWindow;
