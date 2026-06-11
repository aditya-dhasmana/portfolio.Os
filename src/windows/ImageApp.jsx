import React from "react";
import windowWrapper from "../features/desktop-shell/hoc/windowWrapper";
import WindowControls from "../features/desktop-shell/components/WindowControls";
import { useWindowStore } from "#store";

const ImageApp = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile?.data;

  if (!data) {
    return (
      <div id="window-header">
        <WindowControls target="imgfile" />
        <h2>No Data</h2>
      </div>
    );
  }

  const {
    name = "Untitled",
    image,
    imageUrl
  } = data;

  const finalImage = image || imageUrl;

  return (
    <>
      {/* ✅ MATCH TERMINAL */}
      <div id="window-header">
        <WindowControls target="imgfile" />
        <h2>{name}</h2>
      </div>

      <div className="p-5 bg-white overflow-y-auto max-h-[70vh]">
        {finalImage && (
          <div className="w-full">
            <img
              src={finalImage}
              alt={name || "image"}
              className="w-full h-auto rounded"
            />
          </div>
        )}
      </div>
    </>
  );
};

const ImageWindow = windowWrapper(ImageApp, "imgfile");

export default ImageWindow;
