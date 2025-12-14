import { useState, useEffect } from 'react';

interface ResolutionOption {
  name: string;
  label: string;
  tooltip: string;
  url: string;
  filename: string;
}

interface HeadshotDownloaderProps {
  resolutions: ResolutionOption[];
  previewUrl: string;
}

export default function HeadshotDownloader({
  resolutions,
  previewUrl,
}: HeadshotDownloaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleDownload = async (res: ResolutionOption) => {
    setDownloading(res.name);

    // For mobile, open in new tab with instructions
    if (isMobile) {
      // Try the download first
      const success = await tryDownload(res.url, res.filename);
      if (!success) {
        setShowInstructions(true);
        // Open image in new tab for manual save
        window.open(res.url, '_blank');
      }
    } else {
      // Desktop: Use blob download
      await tryDownload(res.url, res.filename);
    }

    setTimeout(() => {
      setDownloading(null);
    }, 1500);
  };

  const tryDownload = async (url: string, filename: string): Promise<boolean> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

      return true;
    } catch {
      return false;
    }
  };

  const openImageInNewTab = (res: ResolutionOption) => {
    window.open(res.url, '_blank');
    setShowInstructions(true);
  };

  return (
    <>
      {/* Mobile: Single download button that opens sheet */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex md:hidden items-center justify-center gap-2 w-full min-h-12 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        <span>Download Photo</span>
      </button>

      {/* Desktop: Inline size buttons */}
      <div className="hidden md:flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-xs text-slate-500 uppercase tracking-wide">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Size
        </span>
        <div className="flex gap-1">
          {resolutions.map((res) => (
            <button
              key={res.name}
              onClick={() => handleDownload(res)}
              title={res.tooltip}
              className={`
                w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg border transition-all
                ${downloading === res.name
                  ? 'bg-green-100 border-green-300 text-green-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600'
                }
              `}
            >
              {downloading === res.name ? '✓' : res.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setIsOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl p-6 pb-8 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Download Headshot
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose a resolution
              </p>
            </div>

            {/* Resolution Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {resolutions.map((res) => (
                <button
                  key={res.name}
                  onClick={() => handleDownload(res)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all
                    ${downloading === res.name
                      ? 'bg-green-50 border-green-400 dark:bg-green-900/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 active:scale-95'
                    }
                  `}
                >
                  <span className={`text-2xl font-bold mb-1 ${downloading === res.name ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>
                    {downloading === res.name ? '✓' : res.label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {res.tooltip}
                  </span>
                </button>
              ))}
            </div>

            {/* Alternative: Open in new tab */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">
                Download not working? Open the image and save manually:
              </p>
              <div className="flex gap-2">
                {resolutions.slice(0, 2).map((res) => (
                  <button
                    key={`open-${res.name}`}
                    onClick={() => openImageInNewTab(res)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    Open {res.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Instructions Toast */}
      {showInstructions && (
        <div
          className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-slideUp"
          onClick={() => setShowInstructions(false)}
        >
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">To save the image:</p>
                <p className="text-sm text-slate-300">
                  Long-press (hold) on the image, then tap "Save Image" or "Download Image"
                </p>
              </div>
              <button className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        .active\\:scale-95:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
}
