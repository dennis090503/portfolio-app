"use client";

import React, { useState, useEffect } from "react";
import { Download, X, ExternalLink, AlertCircle } from "lucide-react";

export function ResumeModal({ isOpen, onClose, resumeUrl }) {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadError(false);
    }
  }, [isOpen, resumeUrl]);

  if (!isOpen) return null;

  // Transform Google Drive URLs (/view -> /preview) for clean iframe embedding
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view(\?.*)?$/, '/preview').replace(/\/view\?usp=drive_link/, '/preview');
    }
    return url.includes('#') ? url : `${url}#toolbar=0`;
  };

  // Transform Google Drive URLs for direct file download
  const getDownloadUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return url;
  };

  const embedSrc = getEmbedUrl(resumeUrl);
  const downloadSrc = getDownloadUrl(resumeUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Resume Preview
          </h3>
          <div className="flex items-center gap-3">
            {resumeUrl && (
              <a
                href={downloadSrc}
                download="Dennis_Lalwani_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-colors shadow-md"
              >
                <Download className="w-4 h-4"/>
                Download PDF
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* PDF Document Viewer Container */}
        <div className="flex-1 w-full h-full bg-neutral-950 relative overflow-hidden flex items-center justify-center">
          {resumeUrl ? (
            <>
              <iframe
                src={embedSrc}
                title="Resume PDF Preview"
                className="w-full h-full border-none"
                onError={() => setLoadError(true)}
              />

              {loadError && (
                <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center z-10 gap-3">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                  <p className="text-white text-base font-semibold">Unable to display inline PDF preview</p>
                  <p className="text-neutral-400 text-xs max-w-sm">
                    Browser security rules or network restrictions prevented embedded previewing.
                  </p>
                  <a
                    href={downloadSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition-all shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4" /> Open or Download PDF
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-neutral-400 text-sm">
              <AlertCircle className="w-8 h-8 text-neutral-500" />
              <span>No resume PDF uploaded yet. Upload a PDF via Admin Operations Center.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ResumeModal;

