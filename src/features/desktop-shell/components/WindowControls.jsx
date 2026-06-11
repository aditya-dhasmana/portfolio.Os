/**
 * PURPOSE:
 * Render desktop window traffic-light controls.
 * RESPONSIBILITY:
 * Close, minimize, and maximize the target desktop window.
 * USED BY:
 * Desktop app windows.
 * DEPENDS ON:
 * Desktop window store.
 * SHOULD NOT HANDLE:
 * Window layout, dragging, app content, or mobile controls.
 * SCALING NOTES:
 * Add accessibility labels here if the controls become keyboard-focusable buttons.
 */

import React from "react";

import useWindowStore from "../store/windowStore";

const WindowControls = ({ target }) => {
  const { closeWindow, minimizeWindow, toggleMaximize } = useWindowStore();

  return (
    <div id="window-controls">
      <div
        className="close no-drag"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          closeWindow(target);
        }}
      />

      <div
        className="minimize no-drag"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          minimizeWindow(target);
        }}
      />

      <div
        className="maximize no-drag"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          toggleMaximize(target);
        }}
      />
    </div>
  );
};

export default WindowControls;
