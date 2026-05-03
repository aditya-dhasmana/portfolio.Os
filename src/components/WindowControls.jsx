import useWindowStore from '#store/window'
import React from 'react'

const WindowControls = ({ target }) => {
  const { closeWindow, minimizeWindow, toggleMaximize } = useWindowStore();

  return (
    <div id="window-controls">
      
      {/* 🔴 CLOSE */}
      <div
        className="close no-drag"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          closeWindow(target);
        }}
      />

      {/* 🟡 MINIMIZE */}
      <div
        className="minimize no-drag"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
        }}
      />

      {/* 🟢 MAXIMIZE */}
      <div
        className="maximize no-drag"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          toggleMaximize(target);
        }}
      />
    </div>
  );
};

export default WindowControls;