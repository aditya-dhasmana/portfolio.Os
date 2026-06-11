import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download, Loader2 } from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ResumeApp = () => {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfWidth, setPdfWidth] = useState(320);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      setPdfWidth(Math.max(280, containerRef.current.clientWidth - 24));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="mobile-page mobile-resume-page" ref={containerRef}>
      <a className="mobile-primary-action" href="/files/resume.pdf" download>
        <Download size={17} />
        Download resume
      </a>

      {error ? (
        <div className="mobile-empty-state">{error}</div>
      ) : (
        <Document
          file="/files/resume.pdf"
          onLoadSuccess={({ numPages: pageCount }) => {
            setNumPages(pageCount);
            setError(null);
          }}
          onLoadError={() => setError("Failed to load PDF")}
          loading={
            <div className="mobile-empty-state">
              <Loader2 className="spin" size={28} />
              Loading resume
            </div>
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`mobile_page_${index + 1}`}
              pageNumber={index + 1}
              width={pdfWidth}
              renderTextLayer
              renderAnnotationLayer
            />
          ))}
        </Document>
      )}
    </div>
  );
};

export default ResumeApp;
