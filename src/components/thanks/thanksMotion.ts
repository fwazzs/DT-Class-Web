// Pure math for the thank-you board. Ported from design/canvas/Thanks.dc.html.
import { clamp01, easeInOutCubic, seg } from '../../utils/motion';

/** Marquee speeds in px/s for the top and bottom rows. */
export const ROW_SPEED: readonly [number, number] = [40, 34];
const MAX_DT = 0.1;
const ROW_SLIDE = 240;

export interface ThanksEnter {
  bannerY: number;
  bannerOpacity: number;
  /** Right inset (%) of the "Thank you" wipe: 108 hides it, -8 shows it all. */
  titleClip: number;
  rowsOpacity: number;
  /** Horizontal offset of each row while it slides in from opposite sides. */
  rowSlide: [number, number];
  endOpacity: number;
}

/** Enter animation as a function of px of the section scrolled into view. */
export function thanksEnter(seen: number): ThanksEnter {
  const title = easeInOutCubic(seg(seen, 80, 520));
  const rows = easeInOutCubic(seg(seen, 260, 720));
  const wipe = easeInOutCubic(seg(seen, 200, 620));
  return {
    bannerY: (1 - title) * 40,
    bannerOpacity: clamp01(title * 2),
    titleClip: 108 - 116 * wipe,
    rowsOpacity: clamp01(rows * 1.5),
    rowSlide: [(1 - rows) * ROW_SLIDE, (1 - rows) * -ROW_SLIDE],
    endOpacity: clamp01(title * 2),
  };
}

export function titleClipPath(clip: number): string {
  return `inset(-30% ${clip}% -30% -8%)`;
}

/** Adds one frame of travel. `dt` is clamped so a background tab never makes the row jump. */
export function advanceTravel(travel: number, dt: number, speed: number): number {
  return travel + Math.min(MAX_DT, Math.max(0, dt)) * speed;
}

/**
 * translateX of a looping row. `period` is the width of one copy of the cards; the row is
 * rendered twice, so offsetting by exactly one period is invisible. Row 0 drifts left, row 1 right.
 */
export function marqueeX(row: 0 | 1, travel: number, period: number, slide = 0): number {
  const loop = period > 0 ? travel % period : 0;
  return (row === 0 ? -loop : loop - period) + slide;
}

export type CardKind = 'note' | 'ruled' | 'kraft';
const KINDS: CardKind[] = ['note', 'ruled', 'kraft'];

/** Cards rotate: sticky note, ruled index card, kraft card. */
export function cardKind(index: number): CardKind {
  return KINDS[index % 3];
}

/** 0..6 resting tilt, -1.5 to +1.5 degrees in half-degree steps. */
export function tiltStep(index: number): number {
  return (index * 37) % 7;
}

/** 0..8 tape tilt, -4 to +4 degrees. */
export function tapeStep(index: number): number {
  return (index * 53) % 9;
}
