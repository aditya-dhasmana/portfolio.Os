import React from "react";

import useWindowStore from "#store/window";

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
