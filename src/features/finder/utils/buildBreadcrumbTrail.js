/**
 * PURPOSE:
 * Build a Finder breadcrumb trail from the active location.
 * RESPONSIBILITY:
 * Walk parent pointers from the current node back to the root.
 * USED BY:
 * FinderBreadcrumbs.
 * DEPENDS ON:
 * File-system nodes that include optional parent references.
 * SHOULD NOT HANDLE:
 * Rendering breadcrumbs, changing location, or mutating nodes.
 * SCALING NOTES:
 * This stays useful as long as the portfolio file system keeps parent references.
 */

export const buildBreadcrumbTrail = (node) => {
  const trail = [];
  let current = node;

  while (current) {
    trail.unshift(current);
    current = current.parent;
  }

  return trail;
};
