/**
 * PURPOSE:
 * Render Finder sidebar sections.
 * RESPONSIBILITY:
 * Display favorite locations and project shortcuts.
 * USED BY:
 * FinderWindow.
 * DEPENDS ON:
 * Location data and the onSelectLocation callback.
 * SHOULD NOT HANDLE:
 * Breadcrumbs, file grid rendering, file opening behavior, or window controls.
 * SCALING NOTES:
 * Sidebar groups can grow into configurable sections without changing FinderWindow.
 */

import clsx from "clsx";

const FinderSidebarSection = ({
  title,
  items = [],
  activeLocation,
  onSelectLocation,
}) => (
  <div>
    <h3>{title}</h3>
    <ul>
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => onSelectLocation(item)}
          className={clsx(
            item.id === activeLocation?.id ? "active" : "not-active"
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
  activeLocation,
  onSelectLocation,
}) => (
  <div className="sidebar">
    <FinderSidebarSection
      title="Favorites"
      items={favorites}
      activeLocation={activeLocation}
      onSelectLocation={onSelectLocation}
    />

    <FinderSidebarSection
      title="Projects"
      items={projects}
      activeLocation={activeLocation}
      onSelectLocation={onSelectLocation}
    />
  </div>
);

export default FinderSidebar;
