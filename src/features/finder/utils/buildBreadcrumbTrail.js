/**
 * PURPOSE:
 * Build a Finder breadcrumb trail from the active location.
 * RESPONSIBILITY:
 * Normalize the canonical Finder path into renderable breadcrumb nodes.
 * USED BY:
 * FinderBreadcrumbs.
 * DEPENDS ON:
 * The current Finder path.
 * SHOULD NOT HANDLE:
 * Rendering breadcrumbs, changing location, or mutating nodes.
 * SCALING NOTES:
 * Path normalization can later add truncation without changing navigation ownership.
 */

export const buildBreadcrumbTrail = (currentPath = []) =>
  currentPath.filter(Boolean);
