'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { tiltToward } from '@/components/story/storyMotion';

/** "Back to the top" sticky note that turns toward a nearby mouse, like the notes in the story. */
export default function BackToTopNote(): React.JSX.Element {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const tilt = (x: number, y: number, s: number): void => {
      // Reading layout here is fine: this is a pointer event, not a shared frame callback.
      const r = el.getBoundingClientRect();
      const t = tiltToward({ x, y, s }, r.left + r.width / 2, r.top + r.height / 2, r.width, 22);
      el.style.transform = t.rx || t.ry ? `perspective(600px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)` : '';
    };
    const move = (e: PointerEvent): void => {
      if (e.pointerType === 'mouse') tilt(e.clientX, e.clientY, 1);
    };
    const out = (e: PointerEvent): void => {
      if (!e.relatedTarget) tilt(0, 0, 0); // left the window
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', out);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', out);
      el.style.removeProperty('transform');
    };
  }, [reduced]);

  return (
    <a
      ref={ref}
      href="#top"
      className="relative flex size-[132px] rotate-4 flex-col justify-between bg-note-empathize note-paper p-3.5 text-[#1F1B16] no-underline shadow-[0_2px_3px_rgba(0,0,0,0.35),0_16px_24px_-10px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
    >
      <span aria-hidden="true" className="absolute -top-2.5 left-[32%] h-5 w-[36%] -rotate-4 bg-[rgba(240,234,218,0.85)]" />
      <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V5M5 11l7-7 7 7" />
      </svg>
      <span className="font-hand text-2xl leading-none font-bold">Back to the top</span>
    </a>
  );
}
