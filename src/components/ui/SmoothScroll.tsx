'use client';

import { useEffect } from 'react';
import { setScrollDriver } from '@/hooks/useFrame';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { spring, type SpringState } from '@/utils/motion';

/**
 * Spring stiffness (rad/s). Lower = the page builds speed more slowly and slides longer before stopping;
 * at 3.5 it reaches top speed after ~0.3s and settles in ~1.5s.
 */
const STIFFNESS = 3.5;
/** Pause (ms) between a wheel tick and the page starting to answer it: a beat of weight before the glide. */
const DELAY_MS = 90;
const LINE_PX = 16;

/**
 * Mouse-wheel momentum: each wheel tick moves a target, and the page follows it on a spring, gently
 * speeding up and then slowing until it stops, instead of jumping in steps. Each tick takes effect DELAY_MS
 * after it happens. Anything else that scrolls the page (keys, scrollbar, anchor links, the story's autoplay, touch) takes over at once; the glide only re-syncs to wherever the page is.
 * Renders nothing. Off for reduced motion.
 */
export default function SmoothScroll(): null {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let target = window.scrollY;
    let s: SpringState = { x: target, v: 0 };
    let gliding = false;
    let lastTime = 0;
    // Wheel ticks waiting out the delay: when they happened (performance.now ms) and how far (px).
    const pending: { at: number; dy: number }[] = [];

    const apply = (dy: number): void => {
      if (!gliding) {
        target = window.scrollY;
        s = { x: target, v: 0 };
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.min(max, Math.max(0, target + dy));
      gliding = true;
    };

    const onWheel = (e: WheelEvent): void => {
      // Leave zoom, horizontal swipes (the showcase carousel) and anything a component already handled.
      if (e.defaultPrevented || e.ctrlKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? LINE_PX : e.deltaMode === 2 ? window.innerHeight : 1;
      pending.push({ at: performance.now(), dy: e.deltaY * unit });
    };

    const drive = (time: number): void => {
      const dt = lastTime ? Math.min(0.05, time - lastTime) : 1 / 60;
      lastTime = time;
      // rAF time and performance.now() share a clock.
      while (pending.length && time * 1000 - pending[0].at >= DELAY_MS) apply(pending.shift()!.dy);
      if (!gliding) return;
      // Someone else moved the page (keys, scrollbar, a link, autoplay): hand over instead of fighting it.
      if (Math.abs(window.scrollY - Math.round(s.x)) > 2) {
        gliding = false;
        return;
      }
      s = spring(s, target, STIFFNESS, dt);
      if (Math.abs(target - s.x) < 0.5 && Math.abs(s.v) < 5) {
        s = { x: target, v: 0 };
        gliding = false;
      }
      window.scrollTo({ top: s.x, behavior: 'instant' }); // 'instant' bypasses the CSS smooth scroll
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    setScrollDriver(drive);
    return () => {
      window.removeEventListener('wheel', onWheel);
      setScrollDriver(null);
    };
  }, [reduced]);

  return null;
}
