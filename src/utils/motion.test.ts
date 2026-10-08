import { describe, expect, it } from 'vitest';
import { clamp01, easeInOutCubic, easeOutBack, isMobileWidth, pinnedProgress, rnd, seenPx, seg } from './motion';

describe('motion helpers', () => {
  it('clamps and segments', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(seg(0.5, 0, 1)).toBe(0.5);
    expect(seg(0.1, 0.2, 0.4)).toBe(0);
    expect(seg(0.9, 0.2, 0.4)).toBe(1);
  });

  it('eases hit their endpoints', () => {
    for (const f of [easeInOutCubic, (t: number) => easeOutBack(t)]) {
      expect(f(0)).toBeCloseTo(0);
      expect(f(1)).toBeCloseTo(1);
    }
    expect(Math.max(...Array.from({ length: 50 }, (_, i) => easeOutBack(i / 49)))).toBeGreaterThan(1);
  });

  it('rnd is deterministic and in range', () => {
    expect(rnd(3, 7)).toBe(rnd(3, 7));
    for (let i = 0; i < 200; i++) {
      const v = rnd(i, i % 13);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('pinned progress maps the scroll travel to 0..1', () => {
    expect(pinnedProgress(0, 4000, 1000)).toBe(0);
    expect(pinnedProgress(-1500, 4000, 1000)).toBe(0.5);
    expect(pinnedProgress(-5000, 4000, 1000)).toBe(1);
    expect(pinnedProgress(200, 4000, 1000)).toBe(0);
    expect(pinnedProgress(0, 800, 1000)).toBe(1);
  });

  it('seenPx and the mobile breakpoint', () => {
    expect(seenPx(900, 900)).toBe(0);
    expect(seenPx(100, 900)).toBe(800);
    expect(isMobileWidth(390)).toBe(true);
    expect(isMobileWidth(768)).toBe(false);
  });
});
