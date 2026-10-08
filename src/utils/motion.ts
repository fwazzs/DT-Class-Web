// Small, pure helpers shared by every scroll animation. Ported from the design canvas (design/canvas).

export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/** Progress of `v` through the window [a, b], clamped to 0..1. */
export function seg(v: number, a: number, b: number): number {
  return clamp01((v - a) / (b - a));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Overshoots past 1 then settles; `c` sets how far (1.70158 is the classic amount). */
export function easeOutBack(t: number, c = 1.70158): number {
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

/**
 * Deterministic pseudo-random in [0, 1) for item `i`, stream `k`.
 * Same inputs always give the same value, so animations look identical on every scroll.
 */
export function rnd(i: number, k: number): number {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Progress (0..1) through a pinned section: 0 when its top hits the viewport top, 1 when its bottom reaches the viewport bottom. */
export function pinnedProgress(rectTop: number, sectionHeight: number, viewportHeight: number): number {
  const travel = sectionHeight - viewportHeight;
  return travel <= 0 ? 1 : clamp01(-rectTop / travel);
}

/** Pixels of a section that have scrolled into view from the bottom of the viewport (can be negative or exceed its height). */
export function seenPx(rectTop: number, viewportHeight: number): number {
  return viewportHeight - rectTop;
}

/** Layout switch shared by CSS (`md:` = 768px) and animation math. */
export const MOBILE_MAX = 767;
export function isMobileWidth(vw: number): boolean {
  return vw <= MOBILE_MAX;
}

/** Moves `current` toward `target` by at most `maxStep`, so a value chasing a fast-moving target travels at a constant speed. */
export function approach(current: number, target: number, maxStep: number): number {
  const d = target - current;
  return Math.abs(d) <= maxStep ? target : current + Math.sign(d) * maxStep;
}

export interface SpringState {
  x: number;
  /** Velocity in units per second. */
  v: number;
}

/**
 * Critically damped spring pulling `s` toward `target` for `dt` seconds: from rest it speeds up gently, then
 * slows and settles without overshooting. Closed form, so it is exact and stable at any frame rate.
 * `omega` (rad/s) is the stiffness: lower is slower to build up and slower to stop.
 */
export function spring(s: SpringState, target: number, omega: number, dt: number): SpringState {
  const d = s.x - target;
  const c = s.v + omega * d;
  const e = Math.exp(-omega * dt);
  return { x: target + (d + c * dt) * e, v: (s.v - omega * c * dt) * e };
}
