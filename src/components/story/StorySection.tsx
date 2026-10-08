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

  // Mouse position (viewport px) and an eased copy that the box and notes turn toward. Touch is ignored,
  // so a finger scrolling the page doesn't tilt anything.
  const mouse = useRef({ x: 0, y: 0, on: 0 });
  const eased = useRef<Pointer>({ x: 0, y: 0, s: 0 });
  useEffect(() => {
    if (reduced) return;
    const move = (e: PointerEvent): void => {
      if (e.pointerType === 'mouse') mouse.current = { x: e.clientX, y: e.clientY, on: 1 };
    };
    const out = (e: PointerEvent): void => {
      if (!e.relatedTarget) mouse.current.on = 0; // left the window
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', out);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', out);
    };
  }, [reduced]);

  useFrame((f) => {
    const els = elsRef.current;
    if (!els) return;
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
    const geometry = { top: pageTop.current - f.scrollY, sectionHeight: sizes.current.section, stageHeight: sizes.current.stage };
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
          <CardboardBox />
          <StickyNotes />
          <Sparkle />
        </div>
        <StoryTopBar />
        <ScrollHint />
      </div>
    </section>
  );
}
