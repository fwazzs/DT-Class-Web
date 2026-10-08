import { clamp01, isMobileWidth } from '../../utils/motion';

// Pure carousel math, ported from design/canvas/Showcase.dc.html.

/** Px between card centres: 296 on phones, 440 on desktop (cards are 280 / 400 wide). */
export function cardStep(vw: number): number {
  return isMobileWidth(vw) ? 296 : 440;
}

/** Same easing the canvas used for neighbours sliding, fading and casting shadows. */
export const CARD_TRANSITION =
  'transform 0.65s cubic-bezier(0.22, 0.8, 0.24, 1), opacity 0.5s ease, box-shadow 0.5s ease';

export const SNAP_PROJECTION_MS = 180;
export const DRAG_THRESHOLD_PX = 6;
const RUBBER = 0.35;

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function clampIndex(i: number, count: number): number {
  return Math.max(0, Math.min(count - 1, i));
}

/** Slider position while dragging: follows the pointer, resisting past either end. */
export function dragPosition(startPos: number, dx: number, step: number, count: number): number {
  const p = startPos - dx / step;
  if (p < 0) return p * RUBBER;
  if (p > count - 1) return count - 1 + (p - (count - 1)) * RUBBER;
  return p;
}

/** Where a release lands: project `ms` of the release velocity (px/ms) forward, round, clamp. */
export function snapIndex(pos: number, velocity: number, step: number, count: number, ms = SNAP_PROJECTION_MS): number {
  return clampIndex(Math.round(pos - (velocity * ms) / step), count);
}

/** Horizontal wheel/trackpad delta only (or shift+wheel); 0 for plain vertical scrolling. */
export function horizontalWheel(deltaX: number, deltaY: number, shiftKey: boolean): number {
  if (Math.abs(deltaX) > Math.abs(deltaY)) return deltaX;
  return shiftKey ? deltaY : 0;
}

export interface CardMotion {
  transform: string;
  opacity: string;
  zIndex: string;
  /** Parallax shift of the giant number inside the cover. */
  parallax: string;
  /** Closest card gets the deeper shadow. */
  front: boolean;
}

/** Transform of card `i` when the slider sits at (fractional) position `pos`. */
export function cardMotion(i: number, pos: number, step: number): CardMotion {
  const d = i - pos;
  const ad = Math.abs(d);
  const scale = 1 - Math.min(ad, 2) * 0.08;
  const rot = Math.max(-2, Math.min(2, d)) * 3 + (i % 2 ? 1.2 : -1.2) * Math.min(ad, 1);
  const opacity = ad > 3.2 ? 0 : 1 - Math.min(ad, 2) * 0.25;
  return {
    transform: `translateX(${d * step}px) rotate(${rot}deg) scale(${scale})`,
    opacity: String(clamp01(opacity)),
    zIndex: String(100 - Math.round(ad * 10)),
    parallax: `translateX(${-d * 40}px)`,
    front: ad < 0.5,
  };
}
