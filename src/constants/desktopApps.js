/**
 * PURPOSE:
 * Define desktop dock application metadata.
 * RESPONSIBILITY:
 * Store app IDs, display names, icons, and openability for the desktop dock.
 * USED BY:
 * Dock.
 * DEPENDS ON:
 * Window IDs and static image names.
 * SHOULD NOT HANDLE:
 * Opening windows, rendering dock icons, mobile apps, or portfolio content.
 * SCALING NOTES:
 * Move this into desktop-shell when that feature boundary is extracted.
 */

export const dockApps = [
  { id: "finder", name: "Portfolio", icon: "finder.png", canOpen: true },
  { id: "safari", name: "Articles", icon: "safari.png", canOpen: true },
  { id: "photos", name: "Gallery", icon: "photos.png", canOpen: true },
  { id: "contact", name: "Contact", icon: "contact.png", canOpen: true },
  { id: "terminal", name: "Skills", icon: "terminal.png", canOpen: true },
  { id: "vsCode", name: "VS Code", icon: "vscode.png", canOpen: true },
];
