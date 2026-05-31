/**
 * PURPOSE:
 * Render Finder breadcrumb navigation.
 * RESPONSIBILITY:
 * Display the active folder trail and allow jumping to a previous location.
 * USED BY:
 * FinderWindow.
 * DEPENDS ON:
 * buildBreadcrumbTrail utility and the setActiveLocation callback.
 * SHOULD NOT HANDLE:
 * File opening rules, sidebar rendering, window controls, or API requests.
 * SCALING NOTES:
 * Can later support truncation, keyboard navigation, or path copying without changing FinderWindow.
 */

import React from "react";
import { ChevronRight } from "lucide-react";

import { buildBreadcrumbTrail } from "../utils/buildBreadcrumbTrail";

const FinderBreadcrumbs = ({ activeLocation, onSelectLocation }) => {
  const breadcrumbTrail = buildBreadcrumbTrail(activeLocation);

  return (
    <div className="flex items-center gap-1 text-xs text-gray-500 px-4 py-2 border-b bg-gray-50 overflow-x-auto whitespace-nowrap">
      {breadcrumbTrail.map((crumb, index) => (
        <React.Fragment key={`${crumb.id}-${index}`}>
          <button
            type="button"
            onClick={() => onSelectLocation(crumb)}
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
