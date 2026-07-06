/**
 * PURPOSE:
 * Render an image inside a stable, transparency-friendly preview stage.
 * RESPONSIBILITY:
 * Center the selected image and contain it within the available preview space without cropping or scrolling.
 * USED BY:
 * Finder's image window and Gallery's image modal.
 * DEPENDS ON:
 * A public image source and shared image-preview styles.
 * SHOULD NOT HANDLE:
 * Window state, modal state, Finder navigation, Gallery actions, downloads, or image asset processing.
 * SCALING NOTES:
 * Add media-type variants here only when another preview surface needs the same containment behavior.
 */

const ImagePreviewStage = ({ src, alt, className = "" }) => {
  const stageClassName = ["image-preview-stage", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={stageClassName}>
      {src ? (
        <div className="image-preview-frame">
          <img
            src={src}
            alt={alt || "Image preview"}
            className="image-preview-media"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
      ) : (
        <p className="image-preview-empty">Image preview unavailable</p>
      )}
    </div>
  );
};

export default ImagePreviewStage;
