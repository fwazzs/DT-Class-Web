'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import PaperGrain from '@/components/ui/PaperGrain';
import { useFrame } from '@/hooks/useFrame';
import { usePageTop } from '@/hooks/usePageTop';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import BoardPoster from './BoardPoster';
import CardboardBox from './CardboardBox';
import ScrollHint from './ScrollHint';
import Sparkle from './Sparkle';
import StickyNotes from './StickyNotes';
import StoryTopBar from './StoryTopBar';
import WallDoodles from './WallDoodles';
import { collectEls, drawStory } from './storyApply';
import type { StoryEls } from './storyApply';
import type { Pointer } from './storyMotion';

/** Moves `a` 18% of the way to `b` per frame, landing exactly once close, so idle frames can be skipped again. */
function ease(a: number, b: number, snap: number): number {
  return Math.abs(b - a) < snap ? b : a + (b - a) * 0.18;
}

/**
 * Pinned intro: a box on a studio wall bursts open, 28 sticky notes fly out and stick to a cork board,
 * and "Design Thinking" is written on the poster. All motion is a pure function of scroll (storyMotion.ts),
 * written straight to DOM nodes (storyApply.ts), so React does not re-render while scrolling.
 */
export default function StorySection(): ReactElement {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const elsRef = useRef<StoryEls | null>(null);
  const pageTop = usePageTop(sectionRef);
  // Heights are cached so frames never read layout (see useFrame).
  const sizes = useRef({ section: 0, stage: 0 });

  // First paint (before the browser shows anything), and the whole job for reduced motion: draw the final state.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const els = collectEls(stage);
    elsRef.current = els;
    const paint = (): void => {
      sizes.current = { section: section.offsetHeight, stage: stage.clientHeight };
      const geometry = { top: section.getBoundingClientRect().top, sectionHeight: sizes.current.section, stageHeight: sizes.current.stage };
      drawStory(els, geometry, 0, window.innerWidth, window.innerHeight, true);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(section);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [reduced]);

  // Pointer position (viewport px) and an eased copy that the box and notes turn toward. A mouse tilts
  // while it hovers; a finger tilts while it touches, including while it scrolls the page (touch events
  // keep firing then, unlike pointer events, which the browser cancels once a scroll starts).
  const mouse = useRef({ x: 0, y: 0, on: 0 });
  // A click shakes the box and plays the story by scrolling the page for the visitor.
  // A wheel, key or touch takes back control.
  const autoplay = useRef<{ from: number; to: number; start: number; ms: number } | null>(null);
  const hit = (): void => {
    // `translate`/`rotate` compose with the inline `transform` the frame loop writes, so the cursor tilt keeps working.
    elsRef.current?.cube.animate(
      [
        { translate: '0 0', rotate: '0deg' },
        { translate: '-7px -4px', rotate: '-6deg' },
        { translate: '6px 0', rotate: '5deg' },
        { translate: '-4px -2px', rotate: '-3deg' },
        { translate: '2px 0', rotate: '1.5deg' },
        { translate: '0 0', rotate: '0deg' },
      ],
      { duration: 420, easing: 'ease-out' },
    );
    play();
  };
  const play = (): void => {
    const to = pageTop.current + sizes.current.section - window.innerHeight;
    // Skip the idle stretch (p < 0.1, the box only bobs there) so the shake starts right away.
    const from = Math.max(window.scrollY, pageTop.current + 0.1 * (to - pageTop.current));
    if (to - from < 1) return;
    // 12s for the whole story, less for whatever is left of it.
    autoplay.current = { from, to, start: performance.now(), ms: Math.max(1500, (12000 * (to - from)) / (to - pageTop.current)) };
  };
  const eased = useRef<Pointer>({ x: 0, y: 0, s: 0 });
  useEffect(() => {
    if (reduced) return;
    const move = (e: PointerEvent): void => {
      if (e.pointerType === 'mouse') mouse.current = { x: e.clientX, y: e.clientY, on: 1 };
    };
    const out = (e: PointerEvent): void => {
      if (!e.relatedTarget) mouse.current.on = 0; // left the window
    };
    const stop = (): void => {
      autoplay.current = null;
    };
    const touch = (e: TouchEvent): void => {
      if (e.type === 'touchstart') stop();
      const t = e.touches[0];
      mouse.current = t ? { x: t.clientX, y: t.clientY, on: 1 } : { ...mouse.current, on: 0 };
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', out);
    window.addEventListener('touchstart', touch, { passive: true });
    window.addEventListener('touchmove', touch, { passive: true });
    window.addEventListener('touchend', touch, { passive: true });
    window.addEventListener('touchcancel', touch, { passive: true });
    // Only scrolling back up cancels: a touchpad keeps sending momentum wheel events (downward) for a moment
    // after a swipe, and those would otherwise cancel the autoplay as soon as it starts.
    const wheel = (e: WheelEvent): void => {
      if (e.deltaY < 0) stop();
    };
    window.addEventListener('wheel', wheel, { passive: true });
    window.addEventListener('keydown', stop);
    return () => {
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', out);
      window.removeEventListener('touchstart', touch);
      window.removeEventListener('touchmove', touch);
      window.removeEventListener('touchend', touch);
      window.removeEventListener('touchcancel', touch);
    };
  }, [reduced]);

  useFrame((f) => {
    const els = elsRef.current;
    if (!els) return;
    let scrollY = f.scrollY;
    const a = autoplay.current;
    if (a) {
      const k = Math.min(1, (performance.now() - a.start) / a.ms);
      // Ease-out: full speed from the first frame (no slow wind-up), settling gently onto the poster.
      scrollY = a.from + (a.to - a.from) * Math.sin((k * Math.PI) / 2);
      // 'instant' overrides the page's CSS smooth scrolling, which would lag behind every step.
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      if (k === 1) autoplay.current = null;
    }
    const m = mouse.current;
    const e = eased.current;
    if (e.s === 0) {
      // Appearing: start at the cursor rather than sweeping in from where it left.
      e.x = m.x;
      e.y = m.y;
    }
    e.x = ease(e.x, m.x, 0.05);
    e.y = ease(e.y, m.y, 0.05);
    e.s = ease(e.s, m.on, 0.002);
    const geometry = { top: pageTop.current - scrollY, sectionHeight: sizes.current.section, stageHeight: sizes.current.stage };
    drawStory(els, geometry, f.time, f.vw, f.vh, false, e.s > 0 ? e : null);
  }, !reduced);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Intro"
      className={`relative ${reduced ? 'h-svh' : 'h-[360vh] md:h-[420vh]'}`}
    >
      <div
        ref={stageRef}
        className="bg-wall-dots sticky top-0 h-svh overflow-hidden bg-wall font-sans text-ink"
      >
        {/* Grain stays outside the camera so the moving camera never re-rasterizes the noise filter */}
        <PaperGrain />
        {/* Camera: everything in the scene moves together (push in, pull back, slight handheld drift) */}
        <div data-s="camera" className="absolute inset-0 will-change-transform">
          {/* Studio light: warm window light top-left, soft falloff to the corners */}
          <div
            aria-hidden="true"
            className="absolute inset-0 [background-image:radial-gradient(70%_60%_at_22%_12%,rgba(255,248,228,0.75),rgba(255,248,228,0)_70%),radial-gradient(130%_110%_at_50%_45%,rgba(0,0,0,0)_55%,rgba(70,52,34,0.16)_100%)]"
          />
          <WallDoodles />
          <BoardPoster />
          <CardboardBox onOpen={reduced ? undefined : hit} />
          <StickyNotes />
          <Sparkle />
        </div>
        <StoryTopBar />
        <ScrollHint />
      </div>
    </section>
  );
}
