import { useState } from 'react';

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
}: HeadshotDownloaderProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [mobileDownloading, setMobileDownloading] = useState(false);

  // Get high-res for mobile (Large or Original)
  const highRes = resolutions.find(r => r.name === 'Large') || resolutions[resolutions.length - 1];

  const handleDownload = async (res: ResolutionOption, isMobile = false) => {
    if (isMobile) {
      setMobileDownloading(true);
    } else {
      setDownloading(res.name);
    }

    try {
      const response = await fetch(res.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = res.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(res.url, '_blank');
    }

    setTimeout(() => {
      setDownloading(null);
      setMobileDownloading(false);
    }, 1500);
  };

  return (
    <>
      {/* Mobile: Simple save button */}
      <button
        onClick={() => handleDownload(highRes, true)}
        disabled={mobileDownloading}
        className="flex md:hidden items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg active:opacity-90 transition-opacity disabled:opacity-70"
      >
        {mobileDownloading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Saving...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Save Photo
          </>
        )}
      </button>

      {/* Desktop: Inline size buttons */}
      <div className="hidden md:flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-xs text-slate-500 uppercase tracking-wide">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
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
    </>
  );
}
