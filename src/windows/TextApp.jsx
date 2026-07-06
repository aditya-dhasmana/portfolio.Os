/**
 * PURPOSE:
 * Present text-based Finder files in a managed document window.
 * RESPONSIBILITY:
 * Read the selected text file, render its title bar, and choose its document view.
 * USED BY:
 * The desktop window registry through the txtfile window ID.
 * DEPENDS ON:
 * Desktop window state, window controls, window wrapper, and AboutDocument.
 * SHOULD NOT HANDLE:
 * Finder navigation, standalone image previews, or About document layout details.
 * SCALING NOTES:
 * Add document renderers here by explicit file type or document kind; do not reuse media preview stages.
 */

import { useWindowStore } from "#store";

import AboutDocument from "../features/about/components/AboutDocument";
import WindowControls from "../features/desktop-shell/components/WindowControls";
import windowWrapper from "../features/desktop-shell/hoc/windowWrapper";

// eslint-disable-next-line react-refresh/only-export-components
const TextApp = () => {
  const { windows } = useWindowStore();
  const data = windows.txtfile?.data;

  if (!data) {
    return (
      <div id="window-header">
        <WindowControls target="txtfile" />
        <h2>No Data</h2>
      </div>
    );
  }

  const { name = "Untitled" } = data;

  return (
    <div className="text-document-window">
      <div id="window-header">
        <WindowControls target="txtfile" />
        <h2>{name}</h2>
      </div>

      <div className="text-document-window__scroll-region">
        <AboutDocument {...data} />
      </div>
    </div>
  );
};

export default windowWrapper(TextApp, "txtfile");
