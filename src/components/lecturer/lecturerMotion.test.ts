import { describe, expect, it } from 'vitest';
import { enterProgress, lecturerFrame, tornPolygon } from './lecturerMotion';

describe('enterProgress', () => {
  it('runs 0 → 1 as the section scrolls in', () => {
    expect(enterProgress(900, 900)).toBe(0);
    expect(enterProgress(1200, 900)).toBe(0);
    expect(enterProgress(90, 900)).toBeCloseTo(1);
    expect(enterProgress(-400, 900)).toBe(1);
    expect(enterProgress(450, 900)).toBeCloseTo(450 / 810);
  });
});

describe('lecturerFrame', () => {
  it('enter=1 is the settled final state', () => {
    const f = lecturerFrame(1);
    expect(f.pageTransform).toBe('perspective(1800px) rotateY(0deg)');
    expect(f.pageOpacity).toBe(1);
    expect(f.underOpacity).toBe(1);
    expect(f.photoTransform).toBe('translateX(0px) rotate(-3deg) scale(1)');
    expect(f.photoOpacity).toBe(1);
    expect(f.photoTape).toBe(1);
    expect(f.titleClip).toBe('inset(-30% -8% -30% -8%)');
    expect(f.cardTransform).toBe('translateY(0px) rotate(1.5deg)');
    expect(f.cardOpacity).toBe(1);
    expect(f.cardTape).toBe(1);
  });

  it('enter=0 hides everything and keeps the page turned away', () => {
    const f = lecturerFrame(0);
    expect(f.pageTransform).toBe('perspective(1800px) rotateY(-100deg)');
    expect(f.pageOpacity).toBe(0);
    expect(f.photoOpacity).toBeCloseTo(0);
    expect(f.cardOpacity).toBeCloseTo(0);
    expect(f.photoTape).toBe(0);
    expect(f.cardTape).toBe(0);
    expect(f.titleClip).toBe('inset(-30% 108% -30% -8%)');
  });

  it('never produces NaN, even for out-of-range input', () => {
    for (const e of [-1, 0, 0.13, 0.5, 0.77, 1, 3, Number.EPSILON]) {
      expect(Object.values(lecturerFrame(e)).join('|')).not.toContain('NaN');
    }
  });

  it('page turns in before the card lands', () => {
    expect(lecturerFrame(0.6).pageTransform).toBe('perspective(1800px) rotateY(0deg)');
    expect(lecturerFrame(0.6).cardTransform).not.toBe(lecturerFrame(1).cardTransform);
  });
});

describe('tornPolygon', () => {
  it('is deterministic and well formed', () => {
    const p = tornPolygon(51, 2.4);
    expect(p).toBe(tornPolygon(51, 2.4));
    expect(p.startsWith('polygon(')).toBe(true);
    expect(p).not.toContain('NaN');
    expect(p.split(',').length).toBe(14 + 1 + 14 + 14 + 13);
  });
});
