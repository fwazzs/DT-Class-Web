import { describe, expect, it } from 'vitest';
import { advanceTravel, cardKind, marqueeX, tapeStep, thanksEnter, tiltStep, titleClipPath } from './thanksMotion';

describe('thanksEnter', () => {
  it('starts hidden, off to the sides', () => {
    const s = thanksEnter(0);
    expect(s.bannerOpacity).toBe(0);
    expect(s.bannerY).toBe(40);
    expect(s.titleClip).toBe(108);
    expect(s.rowSlide).toEqual([240, -240]);
    expect(s.rowsOpacity).toBe(0);
  });
  it('ends in the resting state', () => {
    const s = thanksEnter(5000);
    expect(s.bannerOpacity).toBe(1);
    expect(s.bannerY).toBe(0);
    expect(s.titleClip).toBeCloseTo(-8);
    expect(Math.abs(s.rowSlide[0])).toBe(0);
    expect(Math.abs(s.rowSlide[1])).toBe(0);
    expect(s.rowsOpacity).toBe(1);
    expect(s.endOpacity).toBe(1);
    expect(titleClipPath(s.titleClip)).toBe('inset(-30% -8% -30% -8%)');
  });
  it('never returns NaN', () => {
    for (let seen = -300; seen < 2000; seen += 13) {
      expect(Object.values(thanksEnter(seen)).flat().some(Number.isNaN)).toBe(false);
    }
  });
});

describe('marquee', () => {
  const period = 7040;
  it('wraps seamlessly: one full period looks like zero', () => {
    for (const row of [0, 1] as const) {
      expect(marqueeX(row, period, period)).toBeCloseTo(marqueeX(row, 0, period));
      expect(marqueeX(row, period * 3 + 12, period)).toBeCloseTo(marqueeX(row, 12, period));
    }
  });
  it('moves in opposite directions and stays within one period', () => {
    expect(marqueeX(0, 100, period)).toBeLessThan(marqueeX(0, 0, period));
    expect(marqueeX(1, 100, period)).toBeGreaterThan(marqueeX(1, 0, period));
    for (let t = 0; t < period * 2; t += 313) {
      expect(marqueeX(0, t, period)).toBeLessThanOrEqual(0);
      expect(marqueeX(0, t, period)).toBeGreaterThan(-period);
      expect(marqueeX(1, t, period)).toBeLessThan(0);
      expect(marqueeX(1, t, period)).toBeGreaterThanOrEqual(-period);
    }
  });
  it('is safe before the first measurement', () => {
    expect(marqueeX(0, 500, 0, 10)).toBe(10);
    expect(Number.isNaN(marqueeX(1, 500, 0))).toBe(false);
  });
  it('accumulates travel with a clamped dt', () => {
    expect(advanceTravel(0, 0.016, 40)).toBeCloseTo(0.64);
    expect(advanceTravel(0, 5, 40)).toBeCloseTo(4);
    expect(advanceTravel(10, -1, 40)).toBe(10);
  });
});

describe('card variety', () => {
  it('rotates kinds and keeps tilt steps in range', () => {
    expect([0, 1, 2, 3].map(cardKind)).toEqual(['note', 'ruled', 'kraft', 'note']);
    for (let i = 0; i < 50; i++) {
      expect(tiltStep(i)).toBeGreaterThanOrEqual(0);
      expect(tiltStep(i)).toBeLessThanOrEqual(6);
      expect(tapeStep(i)).toBeGreaterThanOrEqual(0);
      expect(tapeStep(i)).toBeLessThanOrEqual(8);
    }
  });
});
