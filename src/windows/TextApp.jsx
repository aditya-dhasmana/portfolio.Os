import React from "react";
import windowWrapper from "../features/desktop-shell/hoc/windowWrapper";
import WindowControls from "../features/desktop-shell/components/WindowControls";
import { useWindowStore } from "#store";

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

  const {
    name = "Untitled",
    image,
    subtitle,
    description = []
  } = data;

  return (
    <>
      {/* ✅ MATCH TERMINAL */}
      <div id="window-header">
        <WindowControls target="txtfile" />
        <h2>{name}</h2>
      </div>

      <div className="p-5 space-y-6 bg-white overflow-y-auto max-h-[70vh]">
        {image && (
          <div className="w-full">
            <img
              src={image}
              alt={name || "text image"}
              className="w-full h-auto rounded"
            />
          </div>
        )}

        {subtitle && (
          <h3 className="text-lg font-semibold">{subtitle}</h3>
        )}

        {description.length > 0 && (
          <div className="space-y-3 leading-relaxed text-base text-gray-800">
            {description.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const TextWindow = windowWrapper(TextApp, "txtfile");

export default TextWindow;
