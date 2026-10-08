import { pinnedProgress } from '../../utils/motion';
import { storyFrame } from './storyMotion';
import type { PenVals, Pointer, Rect, StoryFrame } from './storyMotion';

// Imperative side of the scroll story: finds the animated nodes once (they carry data-s="...") and writes the
// numbers from storyFrame() straight to element styles. React never re-renders while scrolling.

export interface StoryEls {
  camera: HTMLElement;
  wall: HTMLElement;
  board: HTMLElement;
  poster: HTMLElement;
  title: HTMLElement;
  clips: HTMLElement[];
  pens: HTMLElement[];
  tagline: HTMLElement;
  cue: HTMLElement;
  glow: HTMLElement;
  box: HTMLElement;
  cube: HTMLElement;
  boxShadow: HTMLElement;
  boxContact: HTMLElement;
  flapL: HTMLElement;
  flapR: HTMLElement;
  flapF: HTMLElement;
  flapB: HTMLElement;
  shadeL: HTMLElement;
  shadeR: HTMLElement;
  hint: HTMLElement;
  hintIcon: HTMLElement;
  dust: HTMLElement[];
  scraps: HTMLElement[];
  notes: HTMLElement[];
  noteShade: HTMLElement[];
  noteGlint: HTMLElement[];
  noteTape: HTMLElement[];
  near: HTMLElement[];
  motes: HTMLElement[];
  twinkles: HTMLElement[];
}

export function collectEls(root: HTMLElement): StoryEls {
  const all = (name: string): HTMLElement[] => Array.from(root.querySelectorAll<HTMLElement>(`[data-s="${name}"]`));
  const one = (name: string): HTMLElement => {
    const el = root.querySelector<HTMLElement>(`[data-s="${name}"]`);
    if (!el) throw new Error(`Story node missing: ${name}`);
    return el;
  };
  return {
    camera: one('camera'), wall: one('wall'), board: one('board'), poster: one('poster'), title: one('title'),
    clips: all('clip'), pens: all('pen'), tagline: one('tagline'), cue: one('cue'), glow: one('glow'),
    box: one('box'), cube: one('cube'), boxShadow: one('box-shadow'), boxContact: one('box-contact'),
    flapL: one('flap-l'), flapR: one('flap-r'), flapF: one('flap-f'), flapB: one('flap-b'),
    shadeL: one('shade-l'), shadeR: one('shade-r'), hint: one('hint'), hintIcon: one('hint-icon'),
    dust: all('dust'), scraps: all('scrap'), notes: all('note'), noteShade: all('note-shade'),
    noteGlint: all('note-glint'), noteTape: all('note-tape'), near: all('near'), motes: all('mote'),
    twinkles: all('twinkle'),
  };
}

const px = (n: number): string => `${n}px`;

// Last value written per element and property. Writing the same string again is skipped, so idle frames
// (only the dust and camera drift changing) don't invalidate styles on ~200 other nodes.
const written = new WeakMap<HTMLElement, Map<string, string>>();
type StyleProp = 'left' | 'top' | 'width' | 'height' | 'opacity' | 'transform' | 'transformOrigin' | 'clipPath'
  | 'fontSize' | 'filter' | 'boxShadow' | 'backgroundColor' | 'display';
function put(el: HTMLElement, prop: StyleProp, value: string): void {
  let m = written.get(el);
  if (!m) {
    m = new Map();
    written.set(el, m);
  }
  if (m.get(prop) === value) return;
  m.set(prop, value);
  el.style[prop] = value;
}

function setRect(el: HTMLElement, r: Rect): void {
  put(el, 'left', px(r.x));
  put(el, 'top', px(r.y));
  put(el, 'width', px(r.w));
  put(el, 'height', px(r.h));
}

/** Positions a list of elements; those past `count` (mobile shows fewer) are hidden. */
function eachShown<T>(els: HTMLElement[], vals: T[], write: (el: HTMLElement, v: T, i: number) => void): void {
  els.forEach((el, i) => {
    const v = vals[i];
    if (v === undefined) {
      put(el, 'display', 'none');
      return;
    }
    put(el, 'display', '');
    write(el, v, i);
  });
}

function writePen(el: HTMLElement, pen: PenVals): void {
  put(el, 'left', `${pen.left}%`);
  put(el, 'opacity', String(pen.opacity));
  put(el, 'transform', `translateX(-50%) rotate(${pen.rotate}deg)`);
}

function writeScene(e: StoryEls, f: StoryFrame): void {
  put(e.camera, 'transformOrigin', f.cameraOrigin);
  put(e.camera, 'transform', f.cameraTransform);
  put(e.wall, 'transform', `translateY(${f.wallTranslateY}px)`);

  const { board: b, poster: po, title: ti } = f;
  setRect(e.board, b);
  put(e.board, 'opacity', String(b.opacity));
  put(e.board, 'transform', `scale(${b.scale})`);
  setRect(e.poster, po);
  put(e.poster, 'opacity', String(b.opacity));
  put(e.poster, 'transform', `rotate(-1.2deg) scale(${b.scale})`);
  put(e.title, 'fontSize', px(ti.fontSize));
  put(e.clips[0], 'clipPath', `inset(-30% ${ti.clip1}% -30% -8%)`);
  put(e.clips[1], 'clipPath', `inset(-30% ${ti.clip2}% -30% -8%)`);
  writePen(e.pens[0], ti.pen1);
  writePen(e.pens[1], ti.pen2);
  put(e.tagline, 'opacity', String(po.tagOpacity));
  put(e.cue, 'opacity', String(po.cueOpacity));

  put(e.hint, 'opacity', String(f.hintOpacity));
  put(e.hintIcon, 'transform', `translateY(${f.hintBob}px)`);
}

function writeBox(e: StoryEls, f: StoryFrame): void {
  const { box: x, glow: g } = f;
  put(e.box, 'left', px(x.left));
  put(e.box, 'top', px(x.top));
  put(e.box, 'transformOrigin', x.transformOrigin);
  put(e.box, 'transform', x.transform);
  put(e.box, 'opacity', String(x.opacity));
  put(e.cube, 'transform', x.cube);
  put(e.boxShadow, 'opacity', String(x.shadowOpacity));
  put(e.boxShadow, 'transform', x.shadowTransform);
  put(e.boxContact, 'opacity', String(x.contactOpacity));
  put(e.flapL, 'transform', x.flapLeft);
  put(e.flapR, 'transform', x.flapRight);
  put(e.flapF, 'transform', x.flapFront);
  put(e.flapB, 'transform', x.flapBack);
  put(e.shadeL, 'opacity', String(x.shadeLeft));
  put(e.shadeR, 'opacity', String(x.shadeRight));

  put(e.glow, 'left', px(g.x));
  put(e.glow, 'top', px(g.y));
  put(e.glow, 'width', px(g.size));
  put(e.glow, 'height', px(g.size));
  put(e.glow, 'opacity', String(g.opacity));
  eachShown(e.dust, f.dust, (el, d) => {
    put(el, 'left', px(d.x));
    put(el, 'top', px(d.y));
    put(el, 'width', px(d.size));
    put(el, 'height', px(d.size));
    put(el, 'opacity', String(d.opacity));
  });
}

function writeFlyers(e: StoryEls, f: StoryFrame): void {
  eachShown(e.scraps, f.scraps, (el, s) => {
    put(el, 'left', px(s.left));
    put(el, 'top', px(s.top));
    put(el, 'width', px(s.w));
    put(el, 'height', px(s.h));
    put(el, 'backgroundColor', s.color);
    put(el, 'transform', s.transform);
    put(el, 'opacity', String(s.opacity));
  });
  eachShown(e.notes, f.notes, (el, n, i) => {
    put(el, 'left', px(n.left));
    put(el, 'top', px(n.top));
    put(el, 'transform', n.transform);
    put(el, 'filter', n.filter);
    put(el, 'opacity', String(n.opacity));
    put(el, 'boxShadow', n.shadow);
    put(e.noteShade[i], 'opacity', String(n.shade));
    put(e.noteGlint[i], 'opacity', String(n.glint));
    put(e.noteTape[i], 'opacity', String(n.tape));
    put(e.noteTape[i], 'transform', `rotate(${n.tapeRotate}deg)`);
  });
  eachShown(e.near, f.near, (el, q) => {
    put(el, 'left', px(q.left));
    put(el, 'top', px(q.top));
    put(el, 'transform', q.transform);
    put(el, 'filter', q.filter);
    put(el, 'opacity', String(q.opacity));
  });
  eachShown(e.motes, f.motes, (el, m) => {
    put(el, 'transform', `translate(${m.left}px, ${m.top}px)`);
    put(el, 'width', px(m.size));
    put(el, 'height', px(m.size));
    put(el, 'backgroundColor', m.color);
    put(el, 'opacity', String(m.opacity));
  });
  eachShown(e.twinkles, f.twinkles, (el, k) => {
    put(el, 'left', px(k.left));
    put(el, 'top', px(k.top));
    put(el, 'transform', k.transform);
    put(el, 'opacity', String(k.opacity));
  });
}

export function applyFrame(e: StoryEls, f: StoryFrame): void {
  writeScene(e, f);
  writeBox(e, f);
  writeFlyers(e, f);
}

export interface StoryGeometry {
  /** Section's top relative to the viewport. */
  top: number;
  sectionHeight: number;
  /** Sticky stage height (100svh), which can be shorter than innerHeight on phones with a collapsing URL bar. */
  stageHeight: number;
}

let lastP = Number.NaN;
let lastPtr = '';
let lastPaint = 0;

/**
 * Computes progress from cached geometry and paints. Skips while the section is off-screen unless `force`
 * (first paint, reduced motion). When neither the scroll position nor the cursor has moved, only idle motion
 * changes, so those frames are capped at ~30fps. `pointer` is in viewport px.
 */
export function drawStory(
  els: StoryEls, g: StoryGeometry, time: number, vw: number, vh: number, force: boolean, pointer: Pointer | null = null,
): boolean {
  if (!force && (g.top + g.sectionHeight < 0 || g.top > vh)) return false;
  const p = pinnedProgress(g.top, g.sectionHeight, vh);
  const stageH = g.stageHeight || vh;
  // The sticky stage sits at the viewport top while pinned, then scrolls away with the section's end.
  const stageTop = Math.min(Math.max(g.top, 0), g.top + g.sectionHeight - stageH);
  const ptr = pointer && { x: pointer.x, y: pointer.y - stageTop, s: pointer.s };
  const ptrKey = ptr ? `${ptr.x},${ptr.y},${ptr.s}` : '';
  if (!force && p === lastP && ptrKey === lastPtr && time - lastPaint < 1 / 30) return true;
  lastP = p;
  lastPtr = ptrKey;
  lastPaint = time;
  applyFrame(els, storyFrame(p, time, vw, stageH, ptr));
  return true;
}
