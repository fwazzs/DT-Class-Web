import { clamp01, easeInOutCubic, easeOutBack, rnd, seg } from '../../utils/motion';

// Pure enter-animation math, ported from design/canvas/Lecturer.dc.html (exit animation was removed).

/** 0 when the section's top touches the viewport bottom, 1 once 90% of a viewport has scrolled in. */
export function enterProgress(rectTop: number, vh: number): number {
  return clamp01((vh - rectTop) / (0.9 * vh));
}

export interface LecturerFrame {
  pageTransform: string;
  pageOpacity: number;
  /** The two page edges stacked behind the page. */
  underOpacity: number;
  photoTransform: string;
  photoOpacity: number;
  photoTape: number;
  /** Right-hand inset (%) that wipes the title in. */
  titleClip: string;
  cardTransform: string;
  cardOpacity: number;
  cardTape: number;
}

/** Everything that moves, as a function of enter progress `e` (0..1). */
export function lecturerFrame(enter: number): LecturerFrame {
  const e = clamp01(enter);
  const page = easeInOutCubic(seg(e, 0, 0.6));
  const photo = easeOutBack(seg(e, 0.35, 0.85));
  const card = easeOutBack(seg(e, 0.5, 1));
  const wipe = 108 - 116 * easeInOutCubic(seg(e, 0.45, 0.9));
  return {
    pageTransform: `perspective(1800px) rotateY(${-(1 - page) * 100}deg)`,
    pageOpacity: Math.min(1, e * 4),
    underOpacity: Math.min(1, e * 2),
    photoTransform: `translateX(${-(1 - photo) * 160}px) rotate(${-3 - (1 - photo) * 14}deg) scale(${0.9 + 0.1 * photo})`,
    photoOpacity: clamp01(photo * 3),
    photoTape: seg(e, 0.8, 0.9),
    titleClip: `inset(-30% ${wipe}% -30% -8%)`,
    cardTransform: `translateY(${-(1 - card) * 120}px) rotate(${1.5 + (1 - card) * 10}deg)`,
    cardOpacity: clamp01(card * 3),
    cardTape: seg(e, 0.9, 1),
  };
}

/** Torn-paper outline: a jittered rectangle. Deterministic per seed, so it never flickers. */
export function tornPolygon(seed: number, jitter: number): string {
  const n = 14;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= n; i++) pts.push([(i / n) * 100, rnd(i, seed) * jitter]);
  for (let i = 1; i <= n; i++) pts.push([100 - rnd(i, seed + 1) * jitter * 0.7, (i / n) * 100]);
  for (let i = n - 1; i >= 0; i--) pts.push([(i / n) * 100, 100 - rnd(i, seed + 2) * jitter]);
  for (let i = n - 1; i >= 1; i--) pts.push([rnd(i, seed + 3) * jitter * 0.7, (i / n) * 100]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(', ')})`;
}
