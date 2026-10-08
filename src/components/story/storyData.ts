import type { Phase } from '../../types';

// Relative imports on purpose: the pure motion files are unit-tested by Vitest, which has no "@/" alias.

export interface StoryNoteWord {
  text: string;
  phase: Phase;
}

/** The 28 flying notes. Mobile uses the first 14. */
export const NOTE_WORDS: readonly StoryNoteWord[] = [
  { text: 'Interview 5 users', phase: 'empathize' },
  { text: 'How might we…?', phase: 'define' },
  { text: 'Crazy 8s', phase: 'ideate' },
  { text: 'Paper proto', phase: 'prototype' },
  { text: 'Test with users', phase: 'test' },
  { text: 'Empathy map', phase: 'empathize' },
  { text: 'Point of view', phase: 'define' },
  { text: 'Brainstorm', phase: 'ideate' },
  { text: 'Storyboard', phase: 'prototype' },
  { text: 'Feedback grid', phase: 'test' },
  { text: 'Observe', phase: 'empathize' },
  { text: '5 Whys', phase: 'define' },
  { text: 'Yes, and…', phase: 'ideate' },
  { text: 'Build to think', phase: 'prototype' },
  { text: 'Iterate', phase: 'test' },
  { text: 'Pain points', phase: 'empathize' },
  { text: 'Persona', phase: 'define' },
  { text: 'Wild ideas!', phase: 'ideate' },
  { text: 'MVP', phase: 'prototype' },
  { text: 'Fail early', phase: 'test' },
  { text: 'Shadow a day', phase: 'empathize' },
  { text: 'Journey map', phase: 'define' },
  { text: 'Dot vote', phase: 'ideate' },
  { text: 'Role-play', phase: 'prototype' },
  { text: 'Learn', phase: 'test' },
  { text: 'Who is it for?', phase: 'empathize' },
  { text: 'Reframe', phase: 'define' },
  { text: 'SCAMPER', phase: 'ideate' },
];

/** Landing spots in % of the board. They ring the poster; four overlap its corners. */
export const PINS_DESKTOP: ReadonlyArray<readonly [number, number]> = [
  [8, 12], [19, 15], [30, 11], [41, 14], [52, 11], [63, 15], [74, 12], [85, 15], [94, 11],
  [7, 88], [18, 85], [29, 89], [40, 86], [51, 89], [62, 85], [73, 88], [84, 86], [94, 89],
  [8, 33], [10, 51], [8, 69], [92, 33], [90, 51], [92, 69],
  [23, 29], [77, 27], [24, 73], [76, 74],
];

export const PINS_MOBILE: ReadonlyArray<readonly [number, number]> = [
  [15, 9], [38, 10], [62, 9], [85, 10], [26, 21], [50, 22], [74, 21],
  [26, 79], [50, 78], [74, 79], [15, 91], [38, 90], [62, 91], [85, 90],
];

/** Notes that rush past the camera: [target x as fraction of width, target y as fraction of height, phase]. */
export const NEAR_NOTES: ReadonlyArray<readonly [number, number, Phase]> = [
  [-0.2, 0.15, 'empathize'],
  [1.2, 0.05, 'ideate'],
  [1.1, 1.25, 'test'],
  [-0.1, 1.2, 'define'],
];

/** [x %, y %] around the poster where twinkles appear. */
export const TWINKLE_SPOTS: ReadonlyArray<readonly [number, number]> = [
  [-3, -5], [103, 8], [-5, 96], [102, 103], [52, -10], [46, 110], [-8, 48], [108, 54],
];

/** Max element counts rendered; mobile shows fewer (the rest are hidden). */
export const MAX = { notes: 28, near: 4, dust: 12, motes: 30, scraps: 30, twinkles: 8 } as const;
export const MOBILE_COUNT = { notes: 14, near: 2, dust: 6, motes: 14, scraps: 16, twinkles: 4 } as const;

/** Sizes shared by the math and the Tailwind classes (size-14 / md:size-[92px], etc.). */
export const NOTE_SIZE = { mobile: 56, desktop: 92 } as const;
export const BOX_SIZE = { mobile: 150, desktop: 230 } as const;
