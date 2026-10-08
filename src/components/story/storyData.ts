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

/** Landing spots in % of the board. They ring the poster (x 20–80, y 22–78) without covering it. */
export const PINS_DESKTOP: ReadonlyArray<readonly [number, number]> = [
  [8, 10], [19, 12], [30, 9], [41, 11], [52, 9], [63, 12], [74, 10], [85, 12], [94, 9],
  [7, 90], [18, 88], [29, 91], [40, 89], [51, 91], [62, 88], [73, 90], [84, 89], [94, 91],
  [7, 34], [9, 51], [7, 68], [93, 34], [91, 51], [93, 68],
  [12, 27], [88, 27], [12, 74], [88, 74],
];

/** Mobile: two rows above and two below the poster (y 28–72). */
export const PINS_MOBILE: ReadonlyArray<readonly [number, number]> = [
  [15, 8], [38, 9], [62, 8], [85, 9], [26, 19], [50, 20], [74, 19],
  [26, 81], [50, 80], [74, 81], [15, 92], [38, 91], [62, 92], [85, 91],
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
