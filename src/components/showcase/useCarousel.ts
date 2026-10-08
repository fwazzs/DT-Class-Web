'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, RefObject, WheelEvent } from 'react';
import {
  CARD_TRANSITION,
  DRAG_THRESHOLD_PX,
  cardMotion,
  cardStep,
  clampIndex,
  dragPosition,
  horizontalWheel,
  snapIndex,
} from './showcaseMotion';

interface CardNodes {
  card: HTMLElement;
  parallax: HTMLElement | null;
}

interface DragState {
  startX: number;
  startPos: number;
  lastX: number;
  lastT: number;
  velocity: number;
  moved: boolean;
  pointerId: number;
}

type WriteMode = 'drag' | 'snap' | 'instant';

interface UseCarouselOptions {
  count: number;
  reduced: boolean;
}

export interface UseCarousel {
  trackRef: RefObject<HTMLDivElement | null>;
  /** Discrete active index (React state); the continuous drag position never touches React. */
  active: number;
  go: (index: number) => void;
  /** True right after a drag, so the click that follows it can be swallowed. */
  wasDragged: () => boolean;
  handlers: {
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
    onWheel: (e: WheelEvent<HTMLDivElement>) => void;
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
  };
}

/**
 * Carousel behaviour. Card transforms are written straight to the DOM (cards are found by
 * `[data-card]` inside the track), so dragging re-renders nothing; only `active` is state.
 */
export function useCarousel({ count, reduced }: UseCarouselOptions): UseCarousel {
  const trackRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<CardNodes[]>([]);
  const pos = useRef(0);
  const activeRef = useRef(0);
  const drag = useRef<DragState | null>(null);
  const dragged = useRef(false);
  const dragTimer = useRef(0);
  const wheel = useRef({ acc: 0, last: 0 });
  const [active, setActive] = useState(0);

  const apply = useCallback(
    (mode: WriteMode): void => {
      const step = cardStep(window.innerWidth);
      const transition = mode === 'snap' && !reduced ? CARD_TRANSITION : 'none';
      nodes.current.forEach(({ card, parallax }, i) => {
        const m = cardMotion(i, pos.current, step);
        card.style.transition = transition;
        card.style.transform = m.transform;
        card.style.opacity = m.opacity;
        card.style.zIndex = m.zIndex;
        card.dataset.front = String(m.front);
        if (parallax) {
          parallax.style.transition = transition;
          parallax.style.transform = m.parallax;
        }
      });
    },
    [reduced],
  );

  const sync = useCallback(
    (): void => {
      const idx = clampIndex(Math.round(pos.current), count);
      if (idx === activeRef.current) return;
      activeRef.current = idx;
      setActive(idx);
    },
    [count],
  );

  const go = useCallback(
    (index: number): void => {
      pos.current = clampIndex(index, count);
      apply('snap');
      sync();
    },
    [apply, count, sync],
  );

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    nodes.current = Array.from(track.querySelectorAll<HTMLElement>('[data-card]')).map((card) => ({
      card,
      parallax: card.querySelector<HTMLElement>('[data-parallax]'),
    }));
    apply('instant');
    const onResize = (): void => apply('instant');
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [apply]);

  useEffect(() => () => window.clearTimeout(dragTimer.current), []);

  const endDrag = (): void => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    trackRef.current?.removeAttribute('data-dragging');
    dragged.current = true;
    window.clearTimeout(dragTimer.current);
    dragTimer.current = window.setTimeout(() => {
      dragged.current = false;
    }, 0);
    // A pause before release means the pointer was stopped: don't fling on stale velocity.
    const v = performance.now() - d.lastT > 100 ? 0 : d.velocity;
    pos.current = snapIndex(pos.current, v, cardStep(window.innerWidth), count);
    apply('snap');
    sync();
  };

  const handlers: UseCarousel['handlers'] = {
    onKeyDown: (e) => {
      // Leave browser shortcuts alone (Alt+← is Back, Cmd/Ctrl+← jumps).
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const targets: Record<string, number> = {
        ArrowRight: activeRef.current + 1,
        ArrowLeft: activeRef.current - 1,
        Home: 0,
        End: count - 1,
      };
      if (e.key in targets) {
        e.preventDefault();
        go(targets[e.key]);
        // The old slide's link just became tabIndex=-1; keep focus on the carousel so Tab order stays right.
        if (e.target !== e.currentTarget) (e.currentTarget as HTMLElement).focus();
      }
    },
    onWheel: (e) => {
      // Horizontal swipes (or shift+wheel) only, so vertical page scroll is untouched.
      const dx = horizontalWheel(e.deltaX, e.deltaY, e.shiftKey);
      if (!dx) return;
      const w = wheel.current;
      w.acc += dx;
      const now = performance.now();
      if (Math.abs(w.acc) > 50 && now - w.last > 380) {
        go(activeRef.current + Math.sign(w.acc));
        w.acc = 0;
        w.last = now;
      }
    },
    onPointerDown: (e) => {
      if (e.button) return;
      drag.current = {
        startX: e.clientX,
        startPos: pos.current,
        lastX: e.clientX,
        lastT: performance.now(),
        velocity: 0,
        moved: false,
        pointerId: e.pointerId,
      };
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d) return;
      // The button was released outside the track (no pointerup reached us): drop the stale drag.
      if (e.buttons === 0 || e.pointerId !== d.pointerId) {
        drag.current = null;
        return;
      }
      const dx = e.clientX - d.startX;
      if (!d.moved) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        // Capture only once it is a real drag, so plain clicks still reach links and cards.
        d.moved = true;
        try {
          e.currentTarget.setPointerCapture(d.pointerId);
        } catch {
          // Pointer already gone; the drag still works without capture.
        }
        trackRef.current?.setAttribute('data-dragging', 'true');
      }
      const now = performance.now();
      d.velocity = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
      d.lastX = e.clientX;
      d.lastT = now;
      pos.current = dragPosition(d.startPos, dx, cardStep(window.innerWidth), count);
      apply('drag');
      sync();
    },
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };

  return { trackRef, active, go, wasDragged: () => dragged.current, handlers };
}
