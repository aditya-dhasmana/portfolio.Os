/**
 * PURPOSE:
 * Present Finder image files in a stable macOS-style preview window.
 * RESPONSIBILITY:
 * Read the selected image, render a fixed title bar, and compose the shared image preview stage.
 * USED BY:
 * The desktop window registry through the imgfile window ID.
 * DEPENDS ON:
 * Desktop window state, window controls, window wrapper, and the shared media preview stage.
 * SHOULD NOT HANDLE:
 * Finder navigation, Gallery actions, image mutation, downloads, or window sizing rules.
 * SCALING NOTES:
 * Keep image display behavior in ImagePreviewStage so other preview surfaces remain consistent.
 */

import { useWindowStore } from "#store";

import windowWrapper from "../features/desktop-shell/hoc/windowWrapper";
import WindowControls from "../features/desktop-shell/components/WindowControls";
import ImagePreviewStage from "../features/media/components/ImagePreviewStage";

// eslint-disable-next-line react-refresh/only-export-components
const ImageApp = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile?.data;
  const name = data?.name || "Image Preview";
  const imageSource = data?.image || data?.imageUrl || "";

  return (
    <div className="image-preview-window">
      <div id="window-header" className="image-preview-header">
        <WindowControls target="imgfile" />
        <h2 title={name}>{name}</h2>
      </div>

      <ImagePreviewStage src={imageSource} alt={name} />
    </div>
  );
};

export default windowWrapper(ImageApp, "imgfile");
