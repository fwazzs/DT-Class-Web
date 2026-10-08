import { describe, expect, it } from 'vitest';
import { cardMotion, cardStep, clampIndex, dragPosition, horizontalWheel, snapIndex } from './showcaseMotion';

describe('cardMotion', () => {
  it('active card sits at identity and is fully opaque', () => {
    const m = cardMotion(3, 3, 440);
    expect(m.transform).toBe('translateX(0px) rotate(0deg) scale(1)');
    expect(m.opacity).toBe('1');
    expect(m.parallax).toBe('translateX(0px)');
    expect(m.front).toBe(true);
  });

  it('neighbours scale to .92, dim and offset by one step', () => {
    const m = cardMotion(4, 3, 440);
    expect(m.transform).toContain('translateX(440px)');
    expect(m.transform).toContain('scale(0.92)');
    expect(m.opacity).toBe('0.75');
    expect(m.front).toBe(false);
  });

  it('far cards vanish and never produce NaN', () => {
    expect(cardMotion(9, 0, 296).opacity).toBe('0');
    for (let i = 0; i < 10; i++) {
      for (const pos of [-0.4, 0, 2.5, 9.4]) {
        const m = cardMotion(i, pos, 296);
        expect(Object.values(m).join('|')).not.toContain('NaN');
      }
    }
  });
});

describe('slider helpers', () => {
  it('picks the step by breakpoint', () => {
    expect(cardStep(390)).toBe(296);
    expect(cardStep(1440)).toBe(440);
  });

  it('clamps indices', () => {
    expect(clampIndex(-3, 10)).toBe(0);
    expect(clampIndex(14, 10)).toBe(9);
  });

  it('drag follows the pointer and rubber-bands at the ends', () => {
    expect(dragPosition(2, -440, 440, 10)).toBe(3);
    expect(dragPosition(0, 440, 440, 10)).toBeCloseTo(-0.35);
    expect(dragPosition(9, -440, 440, 10)).toBeCloseTo(9.35);
  });

  it('snap projects release velocity and clamps', () => {
    expect(snapIndex(2.2, 0, 440, 10)).toBe(2);
    expect(snapIndex(2.2, 0.0001, 440, 10)).toBe(2);
    // flick left (negative velocity) advances; flick right goes back
    expect(snapIndex(2.4, -1, 440, 10)).toBe(3);
    expect(snapIndex(2.6, 1, 440, 10)).toBe(2);
    expect(snapIndex(0.2, 5, 440, 10)).toBe(0);
    expect(snapIndex(8.8, -5, 440, 10)).toBe(9);
  });

  it('only horizontal wheel input counts', () => {
    expect(horizontalWheel(0, 100, false)).toBe(0);
    expect(horizontalWheel(60, 10, false)).toBe(60);
    expect(horizontalWheel(0, 80, true)).toBe(80);
  });
});
