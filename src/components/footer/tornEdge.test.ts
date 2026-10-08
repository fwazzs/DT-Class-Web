import { describe, expect, it } from 'vitest';
import { tornEdgePath } from './tornEdge';

describe('tornEdgePath', () => {
  it('is deterministic, closed, and has no NaN', () => {
    const p = tornEdgePath(60);
    expect(p).toBe(tornEdgePath(60));
    expect(p.startsWith('M0 100 L0.00 ')).toBe(true);
    expect(p.endsWith('L100 100 Z')).toBe(true);
    expect(p).not.toContain('NaN');
    expect(p.split(' L').length).toBe(60 + 1 + 1 + 1);
  });
  it('keeps every point inside the box', () => {
    const ys = [...tornEdgePath(24).matchAll(/L[\d.]+ ([\d.]+)/g)].map((m) => Number(m[1]));
    ys.forEach((y) => {
      expect(y).toBeGreaterThanOrEqual(20);
      expect(y).toBeLessThanOrEqual(100);
    });
  });
});
