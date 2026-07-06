/**
 * PURPOSE:
 * Render Finder breadcrumb navigation.
 * RESPONSIBILITY:
 * Display the active folder trail and allow jumping to a previous location.
 * USED BY:
 * FinderWindow.
 * DEPENDS ON:
 * The canonical Finder path, breadcrumb utility, and navigation callback.
 * SHOULD NOT HANDLE:
 * File opening rules, sidebar rendering, window controls, or API requests.
 * SCALING NOTES:
 * Can later support truncation, keyboard navigation, or path copying without changing FinderWindow.
 */

import React from "react";
import { ChevronRight } from "lucide-react";

import { buildBreadcrumbTrail } from "../utils/buildBreadcrumbTrail";

const FinderBreadcrumbs = ({ currentPath, onNavigate }) => {
  const breadcrumbTrail = buildBreadcrumbTrail(currentPath);

  return (
    <div className="flex items-center gap-1 text-xs text-gray-500 px-4 py-2 border-b bg-gray-50 overflow-x-auto whitespace-nowrap">
      {breadcrumbTrail.map((crumb, index) => (
        <React.Fragment key={`${crumb.id}-${index}`}>
          <button
            type="button"
            onClick={() => onNavigate(currentPath.slice(0, index + 1))}
            className="hover:text-black"
          >
            {crumb.name}
          </button>

          {index !== breadcrumbTrail.length - 1 && (
            <ChevronRight className="w-3 h-3" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FinderBreadcrumbs;
