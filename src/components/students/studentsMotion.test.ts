import { describe, expect, it } from 'vitest';
import { buildRevealLayout, cardReveal, revealProgress, tiltIndex } from './studentsMotion';

describe('buildRevealLayout', () => {
  it('derives rows and columns from rendered tops, centered last row included', () => {
    const tops = [0, 0, 0, 100, 100, 100, 200, 200];
    const l = buildRevealLayout(260, tops);
    expect(l.cols).toEqual([0, 1, 2, 0, 1, 2, 0, 1]);
    expect(l.doneAt).toBe(260 + 200 + 60 + 2 * 14 + 220);
  });
  it('tolerates sub-pixel differences within a row and handles no cards', () => {
    expect(buildRevealLayout(0, [0, 0.4, 0.6]).cols).toEqual([0, 1, 2]);
    expect(buildRevealLayout(0, []).doneAt).toBe(0);
  });
});

describe('card reveal', () => {
  it('starts hidden and ends settled with the pin on', () => {
    const start = cardReveal(0, 3);
    expect(start.opacity).toBe(0);
    expect(start.pinOpacity).toBe(0);
    expect(start.settled).toBe(false);
    const end = cardReveal(1, 3);
    expect(end).toMatchObject({ opacity: 1, pinOpacity: 1, settled: true });
    expect(end.transform).toBe('translateY(0px) rotate(0deg) scale(1)');
  });
  it('reveals later rows and columns later, and is never NaN', () => {
    expect(revealProgress(500, 260, 0, 0)).toBeGreaterThan(revealProgress(500, 260, 200, 0));
    expect(revealProgress(400, 260, 0, 0)).toBeGreaterThan(revealProgress(400, 260, 0, 7));
    for (let s = -500; s < 5000; s += 37) {
      const r = revealProgress(s, 260, 150, 3);
      const c = cardReveal(r, 7);
      expect(Number.isNaN(r) || c.transform.includes('NaN')).toBe(false);
    }
  });
  it('pin appears only near the end', () => {
    expect(cardReveal(0.8, 0).pinOpacity).toBe(0);
    expect(cardReveal(0.95, 0).pinOpacity).toBeGreaterThan(0);
  });
});

describe('tiltIndex', () => {
  it('stays inside the 13-entry class table', () => {
    for (let i = 0; i < 200; i++) {
      const t = tiltIndex(i);
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeLessThanOrEqual(12);
    }
  });
});
