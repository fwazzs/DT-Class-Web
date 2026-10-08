'use client';

import { useEffect, useEffectEvent } from 'react';

export interface FrameInfo {
  /** Seconds since page load (for idle motion). */
  time: number;
  scrollY: number;
  vw: number;
  vh: number;
}

type FrameCallback = (frame: FrameInfo) => void;

// One requestAnimationFrame loop for the whole page; every animated section subscribes to it.
// Sections write transforms straight to DOM refs, so scrolling never re-renders React.
// Callbacks must not read layout (getBoundingClientRect, offsetTop…): several sections write styles in the
// same frame, so a read would force a synchronous layout. Use usePageTop() for positions instead.
const subscribers = new Set<FrameCallback>();
let rafId = 0;

function loop(ts: number): void {
  // Schedule first so one failing section can't stop every animation on the page.
  rafId = subscribers.size > 0 ? requestAnimationFrame(loop) : 0;
  const frame: FrameInfo = { time: ts / 1000, scrollY: window.scrollY, vw: window.innerWidth, vh: window.innerHeight };
  subscribers.forEach((cb) => {
    try {
      cb(frame);
    } catch (err) {
      console.error(err);
    }
  });
}

/** Calls `onFrame` on every animation frame while `enabled`. Write styles via refs; don't read layout. */
export function useFrame(onFrame: FrameCallback, enabled = true): void {
  const handle = useEffectEvent(onFrame);

  useEffect(() => {
    if (!enabled) return;
    const cb: FrameCallback = (f) => handle(f);
    subscribers.add(cb);
    if (rafId === 0) rafId = requestAnimationFrame(loop);
    return () => {
      subscribers.delete(cb);
    };
  }, [enabled]);
}
