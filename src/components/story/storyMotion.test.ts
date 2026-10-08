import { describe, expect, it } from 'vitest';
import { NOTE_WORDS, PINS_DESKTOP, PINS_MOBILE, NOTE_SIZE } from './storyData';
import { POSTER_PAD, POSTER_REST, TITLE_LINES_EM, storyFrame, tiltToward } from './storyMotion';

describe('tiltToward', () => {
  it('faces the cursor: right turns the face right (+ry), below turns it down (-rx)', () => {
    expect(tiltToward({ x: 150, y: 100, s: 1 }, 100, 100, 50, 20).ry).toBeCloseTo(20, 9);
    expect(tiltToward({ x: 100, y: 150, s: 1 }, 100, 100, 50, 20).rx).toBeCloseTo(-20, 9);
  });

  it('is flat with no cursor, a cursor beyond 2r, or a cursor that has left (s=0)', () => {
    expect(tiltToward(null, 0, 0, 50, 20)).toEqual({ rx: 0, ry: 0 });
    expect(tiltToward({ x: 101, y: 0, s: 1 }, 0, 0, 50, 20)).toEqual({ rx: 0, ry: 0 });
    expect(tiltToward({ x: 30, y: 0, s: 0 }, 0, 0, 50, 20)).toEqual({ rx: 0, ry: 0 });
  });

  it('fades out between r and 2r', () => {
    const near = tiltToward({ x: 60, y: 0, s: 1 }, 0, 0, 50, 20).ry;
    const far = tiltToward({ x: 90, y: 0, s: 1 }, 0, 0, 50, 20).ry;
    expect(near).toBeGreaterThan(far);
    expect(far).toBeGreaterThan(0);
  });
});

const SIZES: ReadonlyArray<readonly [number, number]> = [
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [320, 568],
];

/** Walks a value and returns the path of the first non-finite number or "NaN"/"Infinity" string. */
function findBad(value: unknown, path = 'frame'): string | null {
  if (typeof value === 'number') return Number.isFinite(value) ? null : path;
  if (typeof value === 'string') return /NaN|Infinity/.test(value) ? path : null;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const bad = findBad(value[i], `${path}[${i}]`);
      if (bad) return bad;
    }
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      const bad = findBad(v, `${path}.${k}`);
      if (bad) return bad;
    }
  }
  return null;
}

describe('storyFrame', () => {
  it('never produces NaN or Infinity across p, time and sizes', () => {
    for (const [vw, vh] of SIZES) {
      for (let k = 0; k <= 200; k++) {
        const frame = storyFrame(k / 200, k * 0.37, vw, vh);
        expect(findBad(frame), `p=${k / 200} ${vw}x${vh}`).toBeNull();
      }
    }
  });

  it('uses 28 notes on desktop and 14 on mobile', () => {
    expect(storyFrame(0.5, 0, 1440, 900).notes).toHaveLength(NOTE_WORDS.length);
    expect(storyFrame(0.5, 0, 390, 844).notes).toHaveLength(14);
    expect(storyFrame(0.5, 0, 390, 844).near).toHaveLength(2);
  });

  it('hides every note at p=0', () => {
    for (const [vw, vh] of SIZES) {
      for (const note of storyFrame(0, 0, vw, vh).notes) expect(note.opacity).toBe(0);
    }
  });

  it('parks every note on its pin, fully opaque and taped, at p=1', () => {
    for (const [vw, vh] of SIZES) {
      const f = storyFrame(1, 0, vw, vh);
      const pins = f.mobile ? PINS_MOBILE : PINS_DESKTOP;
      const size = f.mobile ? NOTE_SIZE.mobile : NOTE_SIZE.desktop;
      f.notes.forEach((note, i) => {
        const pin = pins[(i * (f.mobile ? 5 : 11)) % pins.length];
        expect(note.left + size / 2).toBeCloseTo(f.board.x + (f.board.w * pin[0]) / 100, 6);
        expect(note.top + size / 2).toBeCloseTo(f.board.y + (f.board.h * pin[1]) / 100, 6);
        expect(note.opacity).toBe(1);
        expect(note.tape).toBe(1);
      });
    }
  });

  it('shows the board, poster text and a fully written title at p=1', () => {
    const f = storyFrame(1, 0, 1440, 900);
    expect(f.board.opacity).toBe(1);
    expect(f.board.scale).toBe(1);
    expect(f.poster.kickerOpacity).toBe(1);
    expect(f.poster.kickerFilter).toBe('none');
    expect(storyFrame(0, 0, 1440, 900).poster.kickerOpacity).toBe(0);
    expect(f.poster.cueOpacity).toBe(1);
    expect(f.title.clip1).toBeCloseTo(-8, 9);
    expect(f.title.clip2).toBeCloseTo(-8, 9);
    expect(f.title.pen1.opacity).toBe(0);
    expect(f.title.pen2.opacity).toBe(0);
    expect(f.hintOpacity).toBe(0);
  });

  it('keeps the final poster clear: no note covers it and the lettering fits inside it', () => {
    for (const [vw, vh] of [...SIZES, [1366, 657], [1280, 720], [1920, 1080]] as const) {
      const f = storyFrame(1, 0, vw, vh);
      const { x, y, w, h } = f.poster;
      const size = f.mobile ? NOTE_SIZE.mobile : NOTE_SIZE.desktop;
      f.notes.forEach((n, i) => {
        const overlaps = n.left < x + w && n.left + size > x && n.top < y + h && n.top + size > y;
        expect(overlaps, `note ${i} at ${vw}x${vh}`).toBe(false);
      });
      const pad = f.mobile ? POSTER_PAD.mobile : POSTER_PAD.desktop;
      const rest = f.mobile ? POSTER_REST.mobile : POSTER_REST.desktop;
      expect(TITLE_LINES_EM * f.title.fontSize + rest + 2 * pad, `title at ${vw}x${vh}`).toBeLessThanOrEqual(h);
    }
  });

  it('keeps the title hidden and the board invisible at p=0', () => {
    const f = storyFrame(0, 0, 1440, 900);
    expect(f.title.clip1).toBeCloseTo(108, 9);
    expect(f.title.clip2).toBeCloseTo(108, 9);
    expect(f.board.opacity).toBe(0);
    expect(f.hintOpacity).toBe(1);
  });

  it('turns the box and a parked note toward a nearby cursor', () => {
    const still = storyFrame(1, 0, 1440, 900);
    const n = still.notes[0];
    const size = NOTE_SIZE.desktop;
    const hover = storyFrame(1, 0, 1440, 900, { x: n.left + size, y: n.top + size / 2, s: 1 });
    expect(hover.notes[0].transform).not.toBe(n.transform);
    expect(storyFrame(0, 0, 1440, 900, { x: 900, y: 540, s: 1 }).box.cube).not.toBe(storyFrame(0, 0, 1440, 900).box.cube);
  });

  it('clamps out-of-range progress', () => {
    expect(storyFrame(-1, 0, 1440, 900).board.opacity).toBe(0);
    expect(storyFrame(2, 0, 1440, 900).board.opacity).toBe(1);
  });
});
