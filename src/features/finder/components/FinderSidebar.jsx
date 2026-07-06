/**
 * PURPOSE:
 * Render Finder sidebar sections.
 * RESPONSIBILITY:
 * Display favorite locations and project shortcuts.
 * USED BY:
 * FinderWindow.
 * DEPENDS ON:
 * Root location data, the canonical Finder path, and the navigation callback.
 * SHOULD NOT HANDLE:
 * Breadcrumbs, file grid rendering, file opening behavior, or window controls.
 * SCALING NOTES:
 * Sidebar groups can grow into configurable sections without changing FinderWindow.
 */

import clsx from "clsx";

const FinderSidebarSection = ({
  title,
  items = [],
  activeItem,
  buildPath,
  onNavigate,
}) => (
  <div>
    <h3>{title}</h3>
    <ul>
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => onNavigate(buildPath(item))}
          className={clsx(
            item === activeItem ? "active" : "not-active"
          )}
          style={{ cursor: "default" }}
        >
          <img src={item.icon} className="w-4" alt={item.name} />
          <p className="text-sm font-medium truncate">{item.name}</p>
        </li>
      ))}
    </ul>
  </div>
);

const FinderSidebar = ({
  favorites,
  projects,
  currentPath,
  onNavigate,
}) => {
  const activeRoot = currentPath[0];
  const activeProject = activeRoot === favorites[0] ? currentPath[1] : null;
  const workRoot = favorites[0];

  return (
    <div className="sidebar">
      <FinderSidebarSection
        title="Favorites"
        items={favorites}
        activeItem={activeRoot}
        buildPath={(item) => [item]}
        onNavigate={onNavigate}
      />

      <FinderSidebarSection
        title="Projects"
        items={projects}
        activeItem={activeProject}
        buildPath={(item) => [workRoot, item]}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default FinderSidebar;
