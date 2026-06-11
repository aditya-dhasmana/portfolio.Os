import React, { useState, useRef, useEffect } from 'react';
import WindowControls from '../features/desktop-shell/components/WindowControls';
import windowWrapper from '../features/desktop-shell/hoc/windowWrapper';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, Loader2 } from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Resume = () => {
  const [numPages, setNumPages] = useState(null);
  const [pdfWidth, setPdfWidth] = useState(700);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error) {
    console.error(error);
    setError('Failed to load PDF');
  }

  useEffect(() => {
    const updatePdfWidth = () => {
      if (!containerRef.current) return;
      setPdfWidth(containerRef.current.clientWidth - 40);
    };

    updatePdfWidth();
    window.addEventListener('resize', updatePdfWidth);

    return () => window.removeEventListener('resize', updatePdfWidth);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div id="window-header">
        <WindowControls target={'resume'} />
        <h2>Resume.pdf</h2>

        <a href="/files/resume.pdf" download className="cursor-pointer no-drag" title="Download resume">
          <Download className="icon" />
        </a>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-5 no-drag"
      >
        {error ? (
          <div className="flex items-center justify-center h-full text-red-600">
            {error}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <Document
              file="/files/resume.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin size-8" />
                </div>
              }
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={pdfWidth}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              ))}
            </Document>
          </div>
        )}
      </div>
    </div>
  );
};

const ResumeWindow = windowWrapper(Resume, 'resume');
export default ResumeWindow;
