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

export default function HeadshotDownloader({ resolutions }: HeadshotDownloaderProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const highRes = resolutions.find((r) => r.name === 'Large') || resolutions[resolutions.length - 1];

  const handleMobileOpen = () => {
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
      {/* Mobile: single CTA */}
      <button
        type="button"
        onClick={handleMobileOpen}
        className="md:hidden flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-accent rounded-lg active:opacity-90"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Save photo
      </button>

      {/* Desktop: size picker */}
      <div className="hidden md:flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-ink-faint font-mono">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Size
        </span>
        <div className="flex gap-1">
          {resolutions.map((res) => (
            <button
              key={res.name}
              onClick={() => handleDesktopDownload(res)}
              title={res.tooltip}
              className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg border transition-all ${
                downloading === res.name
                  ? 'bg-signal/15 border-signal/40 text-signal'
                  : 'bg-surface-1 border-edge text-ink-muted hover:border-accent hover:text-accent-bright hover:bg-accent-muted'
              }`}
            >
              {downloading === res.name ? '✓' : res.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
