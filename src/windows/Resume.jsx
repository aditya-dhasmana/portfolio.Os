/**
 * PURPOSE:
 * Render a fitted preview of the portfolio resume inside its desktop window.
 * RESPONSIBILITY:
 * Load the PDF, measure the available preview stage, and fit the first page without cropping.
 * USED BY:
 * The desktop application window registry.
 * DEPENDS ON:
 * React PDF, the desktop window shell, ResizeObserver, and the resume PDF asset.
 * SHOULD NOT HANDLE:
 * Desktop window positioning, PDF editing, or mobile Resume presentation.
 * SCALING NOTES:
 * Keep single-page preview sizing here; introduce page navigation only if multi-page viewing is required later.
 */

import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download, Loader2 } from "lucide-react";

import WindowControls from "../features/desktop-shell/components/WindowControls";
import windowWrapper from "../features/desktop-shell/hoc/windowWrapper";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const EMPTY_STAGE_SIZE = { width: 0, height: 0 };

const getFittedPageSize = (stageSize, pageAspectRatio) => {
  if (!pageAspectRatio || !stageSize.width || !stageSize.height) {
    return {};
  }

  const stageAspectRatio = stageSize.width / stageSize.height;

  if (stageAspectRatio > pageAspectRatio) {
    return { height: Math.floor(stageSize.height) };
  }

  return { width: Math.floor(stageSize.width) };
};

const Resume = () => {
  const [stageSize, setStageSize] = useState(EMPTY_STAGE_SIZE);
  const [pageAspectRatio, setPageAspectRatio] = useState(null);
  const [error, setError] = useState(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const updateStageSize = () => {
      setStageSize({
        width: stage.clientWidth,
        height: stage.clientHeight,
      });
    };

    updateStageSize();

    const resizeObserver = new ResizeObserver(updateStageSize);
    resizeObserver.observe(stage);

    return () => resizeObserver.disconnect();
  }, []);

  const handleDocumentLoadSuccess = async (pdf) => {
    try {
      const firstPage = await pdf.getPage(1);
      const viewport = firstPage.getViewport({ scale: 1 });

      setPageAspectRatio(viewport.width / viewport.height);
      setError(null);
    } catch (loadError) {
      handleDocumentLoadError(loadError);
    }
  };

  const handleDocumentLoadError = (loadError) => {
    console.error(loadError);
    setError("Failed to load PDF");
  };

  const fittedPageSize = getFittedPageSize(stageSize, pageAspectRatio);
  const canRenderPage = fittedPageSize.width || fittedPageSize.height;

  return (
    <div className="resume-window">
      <div id="window-header">
        <WindowControls target="resume" />
        <h2>Resume.pdf</h2>

        <a
          href="/files/resume.pdf"
          download
          className="cursor-pointer no-drag"
          title="Download resume"
        >
          <Download className="icon" />
        </a>
      </div>

      <div className="resume-viewer no-drag">
        <div ref={stageRef} className="resume-page-stage">
          {error ? (
            <div className="resume-error">{error}</div>
          ) : (
            <Document
              className="resume-document"
              file="/files/resume.pdf"
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={
                <div className="resume-loading" aria-label="Loading resume">
                  <Loader2 className="animate-spin size-8" />
                </div>
              }
            >
              {canRenderPage && (
                <Page
                  pageNumber={1}
                  width={fittedPageSize.width}
                  height={fittedPageSize.height}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              )}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

const ResumeWindow = windowWrapper(Resume, "resume");

export default ResumeWindow;
