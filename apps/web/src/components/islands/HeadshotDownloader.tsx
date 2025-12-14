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

  const highRes = resolutions.find(r => r.name === 'Large') || resolutions[resolutions.length - 1];

  const handleMobileOpen = () => {
    // Direct navigation works better on iOS Safari than target="_blank"
    window.location.href = highRes.url;
  };

  const handleDesktopDownload = async (res: ResolutionOption) => {
    setDownloading(res.name);

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
      window.location.href = res.url;
    }

    setTimeout(() => setDownloading(null), 1500);
  };

  return (
    <>
      {/* Mobile: Button that opens image directly */}
      <button
        type="button"
        onClick={handleMobileOpen}
        className="flex md:hidden items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg active:opacity-90"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Save Photo
      </button>

      {/* Desktop: Size options */}
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
              onClick={() => handleDesktopDownload(res)}
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
