// Pure math for the students wall. Ported from design/canvas/Students.dc.html.
import { clamp01, easeOutBack, rnd } from '../../utils/motion';

/** Scroll distance (px) between a card's row start and its reveal finishing. */
const REVEAL_SPAN = 220;
const ROW_LEAD = 60;
const COL_STAGGER = 14;
const SAME_ROW_TOLERANCE = 1;

export interface RevealLayout {
  /** Distance from the section top to the grid top. */
  gridTop: number;
  /** Each card's top inside the grid (offsetTop, so tilt never skews it). */
  offsets: number[];
  /** Each card's column within its rendered row (the centered last row counts from 0). */
  cols: number[];
  /** `seen` value at which every card has finished; callers clamp to it to skip idle writes. */
  doneAt: number;
}

/** Rows and columns come from the real rendered layout (card tops), not hard-coded heights. */
export function buildRevealLayout(gridTop: number, tops: number[]): RevealLayout {
  const cols: number[] = [];
  let rowTop = Number.NEGATIVE_INFINITY;
  let col = 0;
  for (const top of tops) {
    if (top - rowTop > SAME_ROW_TOLERANCE) {
      rowTop = top;
      col = 0;
    }
    cols.push(col++);
  }
  const lastOffset = tops.length ? Math.max(...tops) : 0;
  const lastCol = cols.length ? Math.max(...cols) : 0;
  const doneAt = tops.length ? gridTop + lastOffset + ROW_LEAD + lastCol * COL_STAGGER + REVEAL_SPAN : 0;
  return { gridTop, offsets: tops, cols, doneAt };
}

/** 0 → 1 as card (at `offsetY` in the grid, column `col`) is revealed by `seen` px of section scrolled in. */
export function revealProgress(seen: number, gridTop: number, offsetY: number, col: number): number {
  return clamp01((seen - gridTop - offsetY - ROW_LEAD - col * COL_STAGGER) / REVEAL_SPAN);
}

export interface CardReveal {
  opacity: number;
  /** Animated part only: the resting ±3° tilt is a static `rotate` class. */
  transform: string;
  pinOpacity: number;
  settled: boolean;
}

/** Drop 70px with outBack, spin in, scale up; the pin shows at the end. */
export function cardReveal(r: number, index: number): CardReveal {
  const e = easeOutBack(r);
  const spin = (1 - r) * (index % 2 ? 14 : -14);
  return {
    opacity: clamp01(r * 3),
    transform: `translateY(${-(1 - e) * 70}px) rotate(${spin}deg) scale(${0.9 + 0.1 * e})`,
    pinOpacity: clamp01((r - 0.85) / 0.15),
    settled: r >= 1,
  };
}

/** Index 0..12 into the tilt class table: a deterministic ±3° in half-degree steps. */
export function tiltIndex(index: number): number {
  return Math.round((rnd(index, 1) - 0.5) * 6 * 2) + 6;
}
