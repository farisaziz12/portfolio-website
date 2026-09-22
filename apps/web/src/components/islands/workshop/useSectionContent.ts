import { useCallback, useRef, useState } from 'react';
import type { ContentBlock, SectionContentStatus } from './types';

/**
 * Lazy-load + cache workshop section bodies (`/api/workshop/section`).
 */
export function useSectionContent(token: string) {
  const [contentByKey, setContentByKey] = useState<Record<string, ContentBlock[]>>({});
  const [errors, setErrors] = useState<Record<string, true>>({});
  const contentRef = useRef(contentByKey);
  const loadingRef = useRef<Record<string, true>>({});

  contentRef.current = contentByKey;

  const loadSection = useCallback(
    async (sectionKey: string) => {
      if (contentRef.current[sectionKey] || loadingRef.current[sectionKey]) return;
      loadingRef.current = { ...loadingRef.current, [sectionKey]: true };
      setErrors((prev) => {
        if (!prev[sectionKey]) return prev;
        const next = { ...prev };
        delete next[sectionKey];
        return next;
      });

      try {
        const res = await fetch(
          `/api/workshop/section?token=${encodeURIComponent(token)}&sectionKey=${encodeURIComponent(sectionKey)}`
        );
        const body = (await res.json().catch(() => ({}))) as {
          section?: { content?: ContentBlock[] };
          error?: string;
        };
        if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
        const content = body.section?.content || [];
        contentRef.current = { ...contentRef.current, [sectionKey]: content };
        setContentByKey((prev) => ({ ...prev, [sectionKey]: content }));
      } catch {
        setErrors((prev) => ({ ...prev, [sectionKey]: true }));
      } finally {
        const nextLoading = { ...loadingRef.current };
        delete nextLoading[sectionKey];
        loadingRef.current = nextLoading;
      }
    },
    [token]
  );

  const statusFor = useCallback(
    (sectionKey: string): SectionContentStatus => {
      if (errors[sectionKey]) return 'error';
      if (sectionKey in contentByKey) return 'ready';
      return 'loading';
    },
    [contentByKey, errors]
  );

  return {
    contentByKey,
    loadSection,
    statusFor,
  };
}
