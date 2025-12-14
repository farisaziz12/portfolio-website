import type { JSX } from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  ImpactMetricV2,
  ImpactDomain,
  ImpactLens,
  HighlightStripMetric,
  ProofItem,
  PortableTextBlock,
} from '../../types/impact';
import {
  DOMAIN_CONFIG,
  LENS_CONFIG,
  formatMetricNumber,
  getColorClasses,
} from '../../types/impact';

interface ImpactExplorerProps {
  metrics: ImpactMetricV2[];
  highlightStrip?: HighlightStripMetric[];
  defaultDomain?: ImpactDomain;
  defaultLens?: ImpactLens;
  imageUrls?: Record<string, string>;
}

// Parse URL params on mount
function parseUrlState(): { domain?: ImpactDomain; lens?: ImpactLens; metric?: string } {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace('#', '');

  return {
    domain: (params.get('domain') as ImpactDomain) || undefined,
    lens: (params.get('lens') as ImpactLens) || undefined,
    metric: hash.startsWith('metric=') ? hash.replace('metric=', '') : undefined,
  };
}

// Update URL without reload
function updateUrl(domain: ImpactDomain, lens: ImpactLens, metricSlug?: string) {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.set('domain', domain);
  url.searchParams.set('lens', lens);

  if (metricSlug) {
    url.hash = `metric=${metricSlug}`;
  } else {
    url.hash = '';
  }

  window.history.replaceState({}, '', url.toString());
}

export default function ImpactExplorer({
  metrics,
  highlightStrip = [],
  defaultDomain = 'product',
  defaultLens = 'outcomes',
  imageUrls = {},
}: ImpactExplorerProps) {
  // Initialize state from URL or defaults
  const [domain, setDomain] = useState<ImpactDomain>(() => {
    const urlState = parseUrlState();
    return urlState.domain || defaultDomain;
  });

  const [lens, setLens] = useState<ImpactLens>(() => {
    const urlState = parseUrlState();
    return urlState.lens || defaultLens;
  });

  const [expandedMetric, setExpandedMetric] = useState<string | null>(() => {
    const urlState = parseUrlState();
    return urlState.metric || null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter metrics by domain and search
  const filteredMetrics = useMemo(() => {
    let result = domain === 'all' ? metrics : metrics.filter((m) => m.domain === domain);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.label.toLowerCase().includes(query) ||
          m.contextNote?.toLowerCase().includes(query) ||
          m.story?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [metrics, domain, searchQuery]);

  // Separate featured and regular metrics
  const featuredMetrics = useMemo(
    () => filteredMetrics.filter((m) => m.featured),
    [filteredMetrics]
  );
  const regularMetrics = useMemo(
    () => filteredMetrics.filter((m) => !m.featured),
    [filteredMetrics]
  );

  // Group metrics by domain for "All" view
  const metricsByDomain = useMemo(() => {
    if (domain !== 'all') return null;

    const groups: Record<string, { featured: ImpactMetricV2[]; regular: ImpactMetricV2[] }> = {};
    const domainOrder = ['community', 'product', 'leadership', 'speaking'];

    domainOrder.forEach((d) => {
      const domainMetrics = filteredMetrics.filter((m) => m.domain === d);
      if (domainMetrics.length > 0) {
        groups[d] = {
          featured: domainMetrics.filter((m) => m.featured),
          regular: domainMetrics.filter((m) => !m.featured),
        };
      }
    });

    return groups;
  }, [domain, filteredMetrics]);

  // Update URL when state changes
  useEffect(() => {
    updateUrl(domain, lens, expandedMetric || undefined);
  }, [domain, lens, expandedMetric]);

  // Handle hash change (e.g., back button)
  useEffect(() => {
    const handleHashChange = () => {
      const urlState = parseUrlState();
      if (urlState.metric) {
        setExpandedMetric(urlState.metric);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to expanded metric
  useEffect(() => {
    if (expandedMetric) {
      const element = document.getElementById(`metric-${expandedMetric}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [expandedMetric]);

  // Handle domain tab change
  const handleDomainChange = useCallback((newDomain: ImpactDomain) => {
    setDomain(newDomain);
    setExpandedMetric(null);
    setSearchQuery('');
  }, []);


  // Handle metric expand/collapse
  const handleMetricToggle = useCallback((slug: string) => {
    setExpandedMetric((prev) => (prev === slug ? null : slug));
  }, []);

  // Keyboard navigation for tabs
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const tabs = DOMAIN_CONFIG;
      let newIndex = currentIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabs.length - 1;
      }

      if (newIndex !== currentIndex) {
        handleDomainChange(tabs[newIndex].id);
        // Focus the new tab
        const tabElement = document.querySelector(`[data-tab="${tabs[newIndex].id}"]`);
        (tabElement as HTMLElement)?.focus();
      }
    },
    [handleDomainChange]
  );

  return (
    <div className="impact-explorer">
      {/* Highlight Strip (Quick Stats) */}
      {highlightStrip.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {highlightStrip.map((metric) => {
              const colors = getColorClasses(metric.highlightColor);
              return (
                <button
                  key={metric._id}
                  onClick={() => {
                    setDomain(metric.domain);
                    setExpandedMetric(metric.slug);
                  }}
                  className={`group px-4 py-3 rounded-xl border transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${colors.bg} ${colors.border}`}
                >
                  <div className={`text-2xl md:text-3xl font-display font-bold ${colors.text}`}>
                    {formatMetricNumber(metric.headlineNumber, metric.unit, metric.prefix)}
                  </div>
                  <div className="text-sm text-ink-muted">{metric.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls Row */}
      <div className="mb-8 space-y-4">
        {/* Domain Tabs */}
        <div
          className="flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Filter by domain"
        >
          {DOMAIN_CONFIG.map((d, index) => (
            <button
              key={d.id}
              role="tab"
              data-tab={d.id}
              aria-selected={domain === d.id}
              aria-controls={`panel-${d.id}`}
              tabIndex={domain === d.id ? 0 : -1}
              onClick={() => handleDomainChange(d.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                domain === d.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg'
                  : 'bg-surface-overlay text-ink-muted hover:bg-surface-raised hover:text-ink border border-edge'
              }`}
            >
              <span className="mr-1.5">{d.icon}</span>
              <span className="hidden sm:inline">{d.label}</span>
              <span className="sm:hidden">{d.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-edge rounded-lg text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        id={`panel-${domain}`}
        role="tabpanel"
        aria-labelledby={`tab-${domain}`}
        className="space-y-8"
      >
        {/* Grouped View for "All" domain */}
        {domain === 'all' && metricsByDomain && (
          <div className="space-y-12">
            {Object.entries(metricsByDomain).map(([domainKey, { featured, regular }]) => {
              const domainConfig = DOMAIN_CONFIG.find((d) => d.id === domainKey);
              const allDomainMetrics = [...featured, ...regular];
              if (allDomainMetrics.length === 0) return null;

              return (
                <section key={domainKey} className="space-y-4">
                  {/* Domain Header */}
                  <div className="flex items-center gap-3 pb-2 border-b border-edge">
                    <span className="text-2xl">{domainConfig?.icon}</span>
                    <div>
                      <h3 className="text-lg font-display font-semibold text-ink">
                        {domainConfig?.label}
                      </h3>
                      <p className="text-sm text-ink-muted">
                        {allDomainMetrics.length} metric{allDomainMetrics.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Featured in this domain */}
                  {featured.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {featured.map((metric) => (
                        <MetricCard
                          key={metric._id}
                          metric={metric}
                          lens={lens}
                          isExpanded={expandedMetric === metric.slug}
                          onToggle={() => handleMetricToggle(metric.slug)}
                          imageUrls={imageUrls}
                          isFeatured
                        />
                      ))}
                    </div>
                  )}

                  {/* Regular in this domain */}
                  {regular.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regular.map((metric) => (
                        <MetricCard
                          key={metric._id}
                          metric={metric}
                          lens={lens}
                          isExpanded={expandedMetric === metric.slug}
                          onToggle={() => handleMetricToggle(metric.slug)}
                          imageUrls={imageUrls}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {/* Single Domain View */}
        {domain !== 'all' && (
          <>
            {/* Featured Metrics (Hero) */}
            {featuredMetrics.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {featuredMetrics.map((metric) => (
                  <MetricCard
                    key={metric._id}
                    metric={metric}
                    lens={lens}
                    isExpanded={expandedMetric === metric.slug}
                    onToggle={() => handleMetricToggle(metric.slug)}
                    imageUrls={imageUrls}
                    isFeatured
                  />
                ))}
              </div>
            )}

            {/* Regular Metrics */}
            {regularMetrics.length > 0 && (
              <>
                {featuredMetrics.length > 0 && (
                  <div className="border-t border-edge pt-8">
                    <h3 className="text-sm font-medium text-ink-muted uppercase tracking-wider mb-4">
                      More {DOMAIN_CONFIG.find((d) => d.id === domain)?.label} Metrics
                    </h3>
                  </div>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularMetrics.map((metric) => (
                    <MetricCard
                      key={metric._id}
                      metric={metric}
                      lens={lens}
                      isExpanded={expandedMetric === metric.slug}
                      onToggle={() => handleMetricToggle(metric.slug)}
                      imageUrls={imageUrls}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Empty State */}
        {filteredMetrics.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-ink-muted mb-4">
              {searchQuery
                ? `No metrics match "${searchQuery}"`
                : `No metrics in this domain yet`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-accent hover:text-accent-hover font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Metric Card Component
// ─────────────────────────────────────────────────────────────────────────────

interface MetricCardProps {
  metric: ImpactMetricV2;
  lens: ImpactLens;
  isExpanded: boolean;
  onToggle: () => void;
  imageUrls: Record<string, string>;
  isFeatured?: boolean;
}

function MetricCard({
  metric,
  lens: globalLens,
  isExpanded,
  onToggle,
  imageUrls,
  isFeatured = false,
}: MetricCardProps) {
  const colors = getColorClasses(metric.highlightColor);
  const cardRef = useRef<HTMLDivElement>(null);

  // Local lens state for card-level switching
  const [localLens, setLocalLens] = useState<ImpactLens>(globalLens);

  // Sync local lens with global when card closes or global changes
  useEffect(() => {
    if (!isExpanded) {
      setLocalLens(globalLens);
    }
  }, [isExpanded, globalLens]);

  // Use local lens when expanded, global when collapsed
  const activeLens = isExpanded ? localLens : globalLens;

  // Get lens content
  const lensContent = useMemo(() => {
    switch (activeLens) {
      case 'outcomes':
        return metric.outcomesBlock;
      case 'how':
        return metric.howBlock;
      case 'proof':
        return metric.proofBlock;
      default:
        return metric.outcomesBlock;
    }
  }, [activeLens, metric]);

  // Handle keyboard on card
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      id={`metric-${metric.slug}`}
      ref={cardRef}
      className={`group relative bg-surface border rounded-xl transition-all duration-300 ${
        isExpanded
          ? `${colors.border} shadow-lg ring-2 ring-offset-2 ${colors.text.replace('text-', 'ring-')}`
          : 'border-edge hover:border-edge-strong hover:shadow-md'
      } ${isFeatured ? 'md:col-span-1' : ''}`}
    >
      {/* Card Header (always visible) */}
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={`metric-content-${metric.slug}`}
        className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-xl"
      >
        <div className="flex items-start justify-between gap-2">
          {/* Number + Label */}
          <div className="flex-1 min-w-0">
            <div className={`text-3xl md:text-4xl font-display font-bold ${colors.text}`}>
              {formatMetricNumber(metric.headlineNumber, metric.unit, metric.prefix)}
            </div>
            <div className="text-sm font-medium text-ink mt-1 line-clamp-4">{metric.label}</div>

            {/* Time window + Delta */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {metric.timeWindow && (
                <span className="text-xs text-ink-faint">{metric.timeWindow}</span>
              )}
              {metric.delta && (
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    metric.delta.startsWith('+') || metric.delta.includes('↑')
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}
                >
                  {metric.delta}
                </span>
              )}
            </div>
          </div>

          {/* Expand indicator */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isExpanded ? `${colors.bg} ${colors.text}` : 'bg-surface-overlay text-ink-faint'
            }`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Context note (always visible) */}
        {metric.contextNote && (
          <p className="text-xs text-ink-muted mt-3 line-clamp-4">{metric.contextNote}</p>
        )}
      </button>

      {/* Expanded Content */}
      <div
        id={`metric-content-${metric.slug}`}
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="px-4 pb-4 border-t border-edge pt-4 space-y-4">
          {/* Card-level Lens Toggle - Mobile Optimized */}
          <div
            className="flex w-full rounded-lg bg-surface-overlay border border-edge p-1 gap-1"
            role="radiogroup"
            aria-label="Switch view"
          >
            {LENS_CONFIG.map((l) => (
              <button
                key={l.id}
                role="radio"
                aria-checked={localLens === l.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setLocalLens(l.id);
                }}
                className={`flex-1 px-3 py-2.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ${
                  localLens === l.id
                    ? `${colors.bg} ${colors.text} shadow-sm`
                    : 'text-ink-muted hover:text-ink hover:bg-surface'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Lens Content */}
          {lensContent && (
            <div>
              {lensContent.headline && (
                <h4 className="font-medium text-ink mb-2">{lensContent.headline}</h4>
              )}

              {/* Outcomes/How body (Portable Text) */}
              {'body' in lensContent && lensContent.body && (
                <div className="text-sm text-ink-muted prose prose-sm max-w-none">
                  <PortableText blocks={lensContent.body} />
                </div>
              )}

              {/* Proof items */}
              {'items' in lensContent && lensContent.items && lensContent.items.length > 0 && (
                <div className="space-y-2">
                  {lensContent.items.map((item, idx) => (
                    <ProofItemDisplay key={idx} item={item} imageUrls={imageUrls} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Story */}
          {metric.story && (
            <div className="text-sm text-ink-muted whitespace-pre-line">{metric.story}</div>
          )}

          {/* Action Links */}
          {metric.actionLinks && metric.actionLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {metric.actionLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${colors.bg} ${colors.text} hover:opacity-80`}
                >
                  <ActionLinkIcon type={link.type} />
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Confidence source */}
          {metric.confidenceSource && (
            <p className="text-xs text-ink-faint italic border-t border-edge pt-2">
              Source: {metric.confidenceSource}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────────────────────

function PortableText({ blocks }: { blocks: PortableTextBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block) => {
        if (block._type === 'block') {
          const Tag = block.listItem ? 'li' : 'p';
          return (
            <Tag key={block._key} className={block.listItem ? '' : 'mb-2'}>
              {block.children.map((child) => {
                let text: React.ReactNode = child.text;

                // Apply marks
                if (child.marks?.includes('strong')) {
                  text = <strong key={child._key}>{text}</strong>;
                }
                if (child.marks?.includes('em')) {
                  text = <em key={child._key}>{text}</em>;
                }

                // Check for links
                const linkMark = block.markDefs?.find(
                  (def) => def._type === 'link' && child.marks?.includes(def._key)
                );
                if (linkMark?.href) {
                  text = (
                    <a
                      key={child._key}
                      href={linkMark.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {text}
                    </a>
                  );
                }

                return text;
              })}
            </Tag>
          );
        }
        return null;
      })}
    </>
  );
}

function ProofItemDisplay({
  item,
  imageUrls,
}: {
  item: ProofItem;
  imageUrls: Record<string, string>;
}) {
  const iconMap: Record<string, JSX.Element> = {
    link: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    ),
    image: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    logo: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    quote: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    metricSource: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  };

  // Handle quote type
  if (item.type === 'quote' && item.quote) {
    return (
      <div className="bg-surface-overlay rounded-lg p-3 border-l-2 border-accent">
        <p className="text-sm text-ink italic">"{item.quote}"</p>
        {item.quoteAuthor && <p className="text-xs text-ink-muted mt-1">— {item.quoteAuthor}</p>}
      </div>
    );
  }

  // Handle link types
  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors group"
      >
        <span className="text-ink-faint group-hover:text-accent transition-colors">
          {iconMap[item.type] || iconMap.link}
        </span>
        <span className="flex-1 text-sm text-ink group-hover:text-accent transition-colors">
          {item.label}
        </span>
        {item.tag && (
          <span className="text-xs px-2 py-0.5 bg-surface rounded-full text-ink-faint">
            {item.tag}
          </span>
        )}
      </a>
    );
  }

  // Default display
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-overlay">
      <span className="text-ink-faint">{iconMap[item.type] || iconMap.link}</span>
      <span className="text-sm text-ink">{item.label}</span>
      {item.sourceNote && <span className="text-xs text-ink-faint">({item.sourceNote})</span>}
    </div>
  );
}

function ActionLinkIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    talk: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    ),
    blog: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    project: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    service: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    booking: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    external: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    ),
  };

  return icons[type] || icons.external;
}
