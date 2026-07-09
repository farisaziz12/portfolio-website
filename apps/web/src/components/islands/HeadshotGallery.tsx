import { useEffect, useState } from 'react';

interface Resolution {
  name: string;
  label: string;
  tooltip: string;
  url: string;
  filename: string;
}

interface CropOption {
  id: string;
  label: string;
  hint: string;
  previewUrl: string;
  lightboxUrl: string;
  resolutions: Resolution[];
}

interface HeadshotItem {
  styleLabel: string;
  alt: string;
  crops: CropOption[];
}

interface HeadshotGalleryProps {
  headshots: HeadshotItem[];
}

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export default function HeadshotGallery({ headshots }: HeadshotGalleryProps) {
  const [cropIndex, setCropIndex] = useState<number[]>(() => headshots.map(() => 0));
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const selectedCrop = (card: number) =>
    headshots[card].crops[cropIndex[card]] || headshots[card].crops[0];

  const setCrop = (card: number, crop: number) =>
    setCropIndex((prev) => prev.map((c, i) => (i === card ? crop : c)));

  const handleDownload = async (res: Resolution, key: string) => {
    setDownloading(key);
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
    window.setTimeout(() => setDownloading(null), 1500);
  };

  // Mobile: open the large rendition of the selected crop so it can be long-pressed to save.
  const handleMobileSave = (card: number) => {
    const crop = selectedCrop(card);
    const large =
      crop.resolutions.find((r) => r.name === 'Large') || crop.resolutions[crop.resolutions.length - 1];
    window.location.href = large.url;
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + headshots.length) % headshots.length);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % headshots.length);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, headshots.length]);

  const lightboxCrop = selectedCrop(lightboxIndex);

  return (
    <>
      <div className="headshot-gallery">
        {headshots.map((shot, i) => {
          const crop = selectedCrop(i);
          return (
            <article className="headshot-card" key={i}>
              <button
                type="button"
                className="headshot-card__image"
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                aria-label={`Preview ${shot.styleLabel} headshot (${crop.label} crop)`}
              >
                <img src={crop.previewUrl} alt={shot.alt} loading="lazy" />
                <span className="headshot-card__overlay">
                  <span className="headshot-card__expand" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </span>
                </span>
              </button>

              <div className="headshot-card__info">
                <span className="headshot-card__style">{shot.styleLabel}</span>

                <div className="headshot-card__crops" role="group" aria-label={`Crop ratio for ${shot.styleLabel} headshot`}>
                  {shot.crops.map((c, ci) => (
                    <button
                      key={c.id}
                      type="button"
                      title={c.hint}
                      aria-pressed={ci === cropIndex[i]}
                      className={`headshot-crop-pill ${ci === cropIndex[i] ? 'active' : ''}`}
                      onClick={() => setCrop(i, ci)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <p className="headshot-card__hint">{crop.hint}</p>

                {/* Desktop: size picker */}
                <div className="headshot-sizes">
                  <span className="headshot-sizes__label">
                    <DownloadIcon />
                    Size
                  </span>
                  <div className="headshot-sizes__btns">
                    {crop.resolutions.map((res) => {
                      const key = `${i}-${crop.id}-${res.name}`;
                      return (
                        <button
                          key={res.name}
                          type="button"
                          title={res.tooltip}
                          onClick={() => handleDownload(res, key)}
                          className={`headshot-size-btn ${downloading === key ? 'done' : ''}`}
                        >
                          {downloading === key ? '✓' : res.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile: single save CTA for the selected crop */}
                <button type="button" className="headshot-save" onClick={() => handleMobileSave(i)}>
                  <DownloadIcon />
                  Save photo
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox — previews the currently selected crop of each headshot */}
      <div
        className={`lightbox ${lightboxOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Headshot preview"
        aria-hidden={lightboxOpen ? 'false' : 'true'}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLightboxOpen(false);
        }}
      >
        <button type="button" className="lightbox__btn lightbox__close" aria-label="Close preview" onClick={() => setLightboxOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {headshots.length > 1 && (
          <>
            <button
              type="button"
              className="lightbox__btn lightbox__prev"
              aria-label="Previous"
              onClick={() => setLightboxIndex((i) => (i - 1 + headshots.length) % headshots.length)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="lightbox__btn lightbox__next"
              aria-label="Next"
              onClick={() => setLightboxIndex((i) => (i + 1) % headshots.length)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
        <div className="lightbox__content">
          {lightboxOpen && (
            <img className="lightbox__image" src={lightboxCrop.lightboxUrl} alt={headshots[lightboxIndex].alt} />
          )}
        </div>
        <div className="lightbox__counter">
          {lightboxIndex + 1} / {headshots.length} · {lightboxCrop.label === 'Full' ? 'Full frame' : lightboxCrop.label}
        </div>
      </div>
    </>
  );
}
