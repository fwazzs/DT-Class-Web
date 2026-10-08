'use client';

import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Caches an element's distance from the top of the document, re-measured only when the page layout changes.
 * In a frame callback, `pageTop.current - frame.scrollY` equals getBoundingClientRect().top without a layout read.
 * Don't use it on sticky or transformed elements (their visual top differs from their layout top).
 */
export function usePageTop(target: RefObject<HTMLElement | null>): RefObject<number> {
  const pageTop = useRef(0);

  useLayoutEffect(() => {
    const el = target.current;
    if (!el) return;
    const measure = (): void => {
      pageTop.current = el.getBoundingClientRect().top + window.scrollY;
    };
    measure();
    // Anything above the element changing size (fonts loading, images, resize) changes its offset,
    // and that always changes the document's height or width.
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [target]);

  return pageTop;
}
