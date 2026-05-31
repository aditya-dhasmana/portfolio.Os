/**
 * PURPOSE:
 * Render Finder file and folder items.
 * RESPONSIBILITY:
 * Display the active location's children and notify the parent when an item opens.
 * USED BY:
 * FinderWindow.
 * DEPENDS ON:
 * getFileIcon utility and active location data.
 * SHOULD NOT HANDLE:
 * Deciding open behavior, updating location state, or opening windows.
 * SCALING NOTES:
 * Can later support selection, sorting, search, or keyboard navigation locally.
 */

import getFileIcon from "../../../utils/getFileIcon";

const FinderGrid = ({ items = [], onOpenItem }) => (
  <div className="content-grid">
    {items.map((item) => (
      <div
        key={item.id}
        className="grid-item"
        onDoubleClick={() => onOpenItem(item)}
        style={{ cursor: "default" }}
      >
        <div className="item-icon-wrapper">
          {item.kind === "folder" ? (
            <img src={item.icon} className="item-icon-img" alt={item.name} />
          ) : (
            <div className="item-icon-react">{getFileIcon(item.name)}</div>
          )}
        </div>

        <p className="item-name">{item.name}</p>
      </div>
    ))}
  </div>
);

export default FinderGrid;
