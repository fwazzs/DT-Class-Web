import { PHASE_HEX } from '../../utils/phase';
import { PHASE_ORDER } from '../../data/site';
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, isMobileWidth, rnd, seg } from '../../utils/motion';
import {
  BOX_SIZE, MOBILE_COUNT, MAX, NEAR_NOTES, NOTE_SIZE, NOTE_WORDS, PINS_DESKTOP, PINS_MOBILE, TWINKLE_SPOTS,
} from './storyData';

// Pure math for the scroll story, ported 1:1 from design/canvas/Story.dc.html (renderVals + particles).
// Input: scroll progress p (0..1), idle time (s) and the stage size in px. Output: plain numbers and strings.

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface BoardVals extends Rect {
  opacity: number;
  scale: number;
}
export interface PosterVals extends Rect {
  /** Class line above the title: focuses in (fade, rise, blur clearing) once the poster has landed. */
  kickerOpacity: number;
  kickerTransform: string;
  kickerFilter: string;
  cueOpacity: number;
}
export interface PenVals {
  left: number;
  opacity: number;
  rotate: number;
}
export interface TitleVals {
  fontSize: number;
  /** Right inset in % of the clip-path wipe; 108 = hidden, -8 = fully written. */
  clip1: number;
  clip2: number;
  pen1: PenVals;
  pen2: PenVals;
}
export interface BoxVals {
  left: number;
  top: number;
  transform: string;
  /** The 3D cube's resting angle plus the cursor tilt. */
  cube: string;
  transformOrigin: string;
  opacity: number;
  shadowOpacity: number;
  shadowTransform: string;
  contactOpacity: number;
  flapLeft: string;
  flapRight: string;
  flapFront: string;
  flapBack: string;
  shadeLeft: number;
  shadeRight: number;
}
export interface GlowVals {
  x: number;
  y: number;
  size: number;
  opacity: number;
}
export interface DustVals {
  x: number;
  y: number;
  size: number;
  opacity: number;
}
export interface ScrapVals {
  left: number;
  top: number;
  w: number;
  h: number;
  color: string;
  transform: string;
  opacity: number;
}
export interface NoteVals {
  left: number;
  top: number;
  transform: string;
  filter: string;
  opacity: number;
  shade: number;
  glint: number;
  shadow: string;
  tape: number;
  tapeRotate: number;
}
export interface NearVals {
  left: number;
  top: number;
  transform: string;
  filter: string;
  opacity: number;
}
export interface MoteVals {
  left: number;
  top: number;
  size: number;
  color: string;
  opacity: number;
}
export interface TwinkleVals {
  left: number;
  top: number;
  transform: string;
  opacity: number;
}
export interface StoryFrame {
  mobile: boolean;
  cameraOrigin: string;
  cameraTransform: string;
  wallTranslateY: number;
  board: BoardVals;
  poster: PosterVals;
  title: TitleVals;
  box: BoxVals;
  glow: GlowVals;
  dust: DustVals[];
  scraps: ScrapVals[];
  notes: NoteVals[];
  near: NearVals[];
  motes: MoteVals[];
  twinkles: TwinkleVals[];
  hintOpacity: number;
  hintBob: number;
}

const COLORS: string[] = PHASE_ORDER.map((ph) => PHASE_HEX[ph]);
const SCRAP_COLORS: string[] = COLORS.concat(['#FBFAF6', '#C99C6A']);
const RAD = Math.PI / 180;

interface Point {
  x: number;
  y: number;
}

/** Mouse cursor in stage px; `s` is how present it is (0 = gone, 1 = on the page), eased by the caller. */
export interface Pointer extends Point {
  s: number;
}

/**
 * Tilt (deg) that turns a surface centred at (cx, cy) to face the cursor: full strength within `r`,
 * fading out by 2r. rotateY(+) turns the face right and rotateX(+) turns it up.
 */
export function tiltToward(ptr: Pointer | null, cx: number, cy: number, r: number, maxDeg: number): { rx: number; ry: number } {
  if (!ptr) return { rx: 0, ry: 0 };
  const dx = ptr.x - cx;
  const dy = ptr.y - cy;
  const k = maxDeg * ptr.s * (1 - easeInOutCubic(seg(Math.hypot(dx, dy), r, 2 * r)));
  if (k === 0) return { rx: 0, ry: 0 };
  const unit = (v: number): number => Math.max(-1, Math.min(1, v / r));
  return { rx: -unit(dy) * k, ry: unit(dx) * k };
}

function boardAndPoster(W: number, H: number, p: number, mobile: boolean): { board: BoardVals; poster: PosterVals } {
  const bx = mobile ? 12 : Math.max(80, (W - 1180) / 2);
  const by = mobile ? 76 : 100;
  const bw = W - bx * 2;
  const bh = H - by - (mobile ? 24 : 44);
  const tBoard = easeOutCubic(seg(p, 0.56, 0.7));
  const pw = bw * (mobile ? 0.86 : 0.6);
  const ph = bh * (mobile ? 0.44 : 0.56);
  const k = easeOutCubic(seg(p, 0.68, 0.76)); // between the poster landing and the title being written
  const blur = Math.round((1 - k) * 6 * 2) / 2;
  return {
    board: { x: bx, y: by, w: bw, h: bh, opacity: tBoard, scale: 0.94 + 0.06 * tBoard },
    poster: {
      x: bx + (bw - pw) / 2, y: by + (bh - ph) / 2, w: pw, h: ph,
      kickerOpacity: k,
      kickerTransform: `translateY(${(1 - k) * 10}px)`,
      kickerFilter: blur > 0 ? `blur(${blur.toFixed(1)}px)` : 'none',
      cueOpacity: seg(p, 0.92, 1),
    },
  };
}

/** Poster padding and the height of everything on it except the two title lines (class line, cue, gaps). */
export const POSTER_PAD = { mobile: 18, desktop: 32 } as const;
// Mobile: the class line wraps to two lines.
export const POSTER_REST = { mobile: 76, desktop: 76 } as const;
/** Two lines at leading 0.98, plus room for the brush lettering's ascenders and descenders. */
export const TITLE_LINES_EM = 2.1;

/**
 * Title size that fits the poster both ways: by width ("Thinking" is the long line) and by height, so on
 * short screens the lettering never pushes the tag line under the tape or the cue off the paper.
 */
export function titleFontSize(posterW: number, posterH: number, mobile: boolean): number {
  const pad = mobile ? POSTER_PAD.mobile : POSTER_PAD.desktop;
  const byWidth = ((posterW - 2 * pad) * 116) / 600; // the design canvas's fit-to-width ratio
  const byHeight = (posterH - 2 * pad - (mobile ? POSTER_REST.mobile : POSTER_REST.desktop)) / TITLE_LINES_EM;
  return Math.max(22, Math.floor(Math.min(byWidth, byHeight)));
}

/** "Design" then "Thinking" are written left to right; a marker pen rides the wipe's edge. */
function titleVals(p: number, posterW: number, posterH: number, mobile: boolean): TitleVals {
  const pen = (a: number, b: number): { clip: number; pen: PenVals } => {
    const e = easeInOutCubic(seg(p, a, b));
    return {
      clip: 108 - 116 * e,
      pen: {
        left: Math.min(100, Math.max(0, -8 + 116 * e)),
        opacity: Math.min(1, e * 25, (1 - e) * 25),
        rotate: 28 + Math.sin(e * 46) * 7,
      },
    };
  };
  const l1 = pen(0.76, 0.85);
  const l2 = pen(0.84, 0.94);
  return { fontSize: titleFontSize(posterW, posterH, mobile), clip1: l1.clip, clip2: l2.clip, pen1: l1.pen, pen2: l2.pen };
}

interface BoxResult {
  box: BoxVals;
  glow: GlowVals;
  dust: DustVals[];
  mouth: Point;
}

/** Box: idle breathing + rattle, rocks on its bottom edge, tape splits, flaps spring open, drops away. Turns toward a nearby cursor. */
function boxVals(cx: number, cy: number, H: number, p: number, t: number, mobile: boolean, ptr: Pointer | null): BoxResult {
  const S = mobile ? BOX_SIZE.mobile : BOX_SIZE.desktop;
  const idle = 1 - seg(p, 0.06, 0.12);
  const bob = Math.sin(t * 2.2) * 5 * idle;
  const rp = t % 3.4; // something inside bumps the lid every few seconds
  const rattle = rp < 0.45 ? Math.sin(rp * 52) * 2.8 * (1 - rp / 0.45) * idle : 0;
  const lift = rp < 0.45 ? Math.sin((rp / 0.45) * Math.PI) * 7 * idle : 0;
  const env = Math.sin(Math.PI * seg(p, 0.12, 0.3));
  const hop = Math.abs(Math.sin(p * 95)) * env; // 0 = on the floor
  const rz = Math.sin(p * 190) * 6 * env + rattle;
  const eLong = easeOutBack(seg(p, 0.25, 0.32), 2.2);
  const eLongR = easeOutBack(seg(p, 0.26, 0.33), 2.2);
  const eShort = easeOutBack(seg(p, 0.285, 0.37), 1.6);
  const tExit = seg(p, 0.58, 0.7);
  const ty = -hop * 14 + easeInOutCubic(tExit) * H * 0.55 + bob;
  const h = S / 2;
  const tilt = tiltToward(ptr, cx, cy + ty, S, 16);
  const box: BoxVals = {
    left: cx - S / 2,
    top: cy - S / 2,
    transform: `translateY(${ty}px) rotate(${rz}deg)`,
    cube: `rotateX(${-22 + tilt.rx}deg) rotateY(${-34 + tilt.ry}deg)`,
    transformOrigin: `${rz >= 0 ? '100%' : '0%'} 100%`, // pivot on whichever bottom edge stays down
    opacity: 1 - clamp01((tExit - 0.4) / 0.6),
    shadowOpacity: 1 - tExit,
    shadowTransform: `translateY(${-bob}px) scale(${1 + bob * 0.012 - hop * 0.08})`,
    contactOpacity: (1 - tExit) * (1 - hop * 0.85),
    flapLeft: `rotateZ(${-125 * eLong - lift}deg)`,
    flapRight: `rotateZ(${125 * eLongR + lift * 0.6}deg)`,
    flapFront: `translateZ(${h}px) rotateX(${-205 * eShort}deg)`,
    flapBack: `translateZ(${-h}px) rotateX(${200 * eShort}deg)`,
    shadeLeft: 0.22 * clamp01(eLong),
    shadeRight: 0.08 * clamp01(eLongR),
  };
  const mouth: Point = { x: cx, y: cy - S * 0.62 };
  const glowT = seg(p, 0.25, 0.46);
  const glow: GlowVals = { x: mouth.x, y: mouth.y + S * 0.12, size: S * 2.6, opacity: 0.9 * Math.sin(Math.PI * glowT) * (1 - tExit) };

  // Dust puffs at the bottom corners, spawned at each landing during the shake.
  const u = ((p * 95) % Math.PI) / Math.PI; // 0 = just landed
  const dust: DustVals[] = [];
  for (let i = 0; i < (mobile ? MOBILE_COUNT.dust : MAX.dust); i++) {
    const side = i % 2 ? 1 : -1;
    dust.push({
      x: cx + side * (S * 0.44 + u * (24 + rnd(i, 52) * 46)),
      y: cy + S * 0.52 - u * (6 + rnd(i, 53) * 18),
      size: (mobile ? 8 : 12) + rnd(i, 51) * 16 + u * 22,
      opacity: env > 0.08 ? env * (1 - u) * 0.75 : 0,
    });
  }
  return { box, glow, dust, mouth };
}

interface NotePath extends Point {
  eB: number;
  tL: number;
  eL: number;
  phase: number;
  ramp: number;
}

/**
 * One note's position at progress pp, in three acts: launch (blown out of the box, slowed by drag),
 * drift (falls like a leaf), stick (pulled flat onto its pin on the board).
 */
function notePath(i: number, pp: number, W: number, H: number, mouth: Point, board: Rect, mobile: boolean): NotePath {
  const pins = mobile ? PINS_MOBILE : PINS_DESKTOP;
  const dB = rnd(i, 1) * 0.1;
  const eB = easeOutCubic(clamp01((pp - 0.3 - dB) / 0.16));
  const tL = clamp01((pp - 0.64 - rnd(i, 2) * 0.09) / 0.18);
  const eL = easeInOutCubic(tL);
  const ax = W * (0.05 + 0.9 * rnd(i, 3));
  const ay = H * (0.05 + (mobile ? 0.36 : 0.4) * rnd(i, 4));
  const kx = (mouth.x + ax) / 2 + (rnd(i, 13) - 0.5) * W * 0.12;
  const ky = Math.min(mouth.y, ay) - H * 0.22;
  const qx = (1 - eB) * (1 - eB) * mouth.x + 2 * (1 - eB) * eB * kx + eB * eB * ax;
  const qy = (1 - eB) * (1 - eB) * mouth.y + 2 * (1 - eB) * eB * ky + eB * eB * ay;
  const tau = Math.max(0, pp - (0.3 + dB + 0.16)); // time since the apex
  const ramp = Math.min(1, tau * 14);
  const phase = tau * (48 + rnd(i, 9) * 26) + rnd(i, 10) * 6.28;
  const fx = qx + Math.sin(phase) * (mobile ? 16 : 32) * (0.6 + rnd(i, 11) * 0.6) * ramp;
  const fy = qy + tau * H * (0.3 + rnd(i, 12) * 0.25);
  const pin = pins[(i * (mobile ? 5 : 11)) % pins.length];
  const px = board.x + (board.w * pin[0]) / 100;
  const py = board.y + (board.h * pin[1]) / 100;
  return { x: fx + (px - fx) * eL, y: fy + (py - fy) * eL, eB, tL, eL, phase, ramp };
}

function noteVals(p: number, W: number, H: number, mouth: Point, board: Rect, mobile: boolean, ptr: Pointer | null): NoteVals[] {
  const size = mobile ? NOTE_SIZE.mobile : NOTE_SIZE.desktop;
  const count = mobile ? MOBILE_COUNT.notes : NOTE_WORDS.length;
  const out: NoteVals[] = [];
  for (let i = 0; i < count; i++) {
    const P = notePath(i, p, W, H, mouth, board, mobile);
    const Q = notePath(i, Math.min(1, p + 0.004), W, H, mouth, board, mobile);
    const blur = Math.min(2.5, Math.hypot(Q.x - P.x, Q.y - P.y) / 14); // motion blur from speed
    const { eB, tL, eL, phase, ramp } = P;

    const dir = rnd(i, 7) > 0.5 ? 1 : -1;
    const r1 = (rnd(i, 5) - 0.5) * 70;
    const rFinal = (rnd(i, 6) - 0.5) * 14;
    const rFree = r1 + (1 - eB) * dir * 340 + Math.cos(phase) * 24 * ramp;
    const s = clamp01((tL - 0.8) / 0.2);
    const wobble = tL > 0.8 ? Math.sin(s * Math.PI * 3) * (1 - s) * 7 : 0;
    const rot = rFree * (1 - eL) + rFinal * eL + wobble;

    // Tumble in flight, plus a turn toward a nearby cursor (which also shifts the shade/glint below).
    const tumble = 1 - eB;
    const tilt = tiltToward(ptr, P.x, P.y, size * 1.2, 28);
    const rx = (Math.sin(p * 41 + i * 1.3) * 62 * tumble + Math.sin(phase + 1.2) * 34 * ramp) * (1 - eL) + tilt.rx;
    const ry = (Math.cos(p * 33 + i) * 54 * tumble + Math.cos(phase) * 26 * ramp) * (1 - eL) + tilt.ry;

    const height = eB > 0 ? 1 - eL : 0; // how far above the board the note is
    const sc = (0.35 + 0.65 * eB) * (1 + 0.14 * Math.sin(Math.PI * eL) - 0.04 * Math.sin(Math.PI * s));
    out.push({
      left: P.x - size / 2,
      top: P.y - size / 2,
      transform: `perspective(700px) rotate(${rot}deg) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`,
      filter: blur > 0.6 ? `blur(${(Math.round(blur * 2) / 2).toFixed(1)}px)` : 'none',
      opacity: clamp01(eB * 6),
      shade: 0.2 * Math.abs(Math.sin(rx * RAD)) + 0.12 * Math.abs(Math.sin(ry * RAD)),
      glint: 0.16 * Math.max(0, -Math.sin(rx * RAD)),
      // Airborne: soft shadow far below. On the board: tight contact shadow + the curled corner lifting off.
      shadow:
        `0 ${2 + 26 * height}px ${4 + 30 * height}px rgba(40,30,20,${0.28 - 0.1 * height}), ` +
        `0 1px 1px rgba(40,30,20,${0.25 * (1 - height)}), ` +
        `3px 6px 8px -5px rgba(40,30,20,${0.35 * (1 - height)})`,
      tape: clamp01((tL - 0.88) / 0.12),
      tapeRotate: (rnd(i, 8) - 0.5) * 10,
    });
  }
  return out;
}

/** A few notes rush toward the camera and out of frame, out of focus. */
function nearVals(p: number, W: number, H: number, mouth: Point, mobile: boolean): NearVals[] {
  const size = mobile ? NOTE_SIZE.mobile : NOTE_SIZE.desktop;
  return NEAR_NOTES.slice(0, mobile ? MOBILE_COUNT.near : MAX.near).map(([tx, ty], i) => {
    const nu = seg(p, 0.34 + i * 0.045, 0.5 + i * 0.045);
    const ue = nu * nu;
    return {
      left: mouth.x + (tx * W - mouth.x) * ue - size / 2,
      top: mouth.y + (ty * H - mouth.y) * ue - Math.sin(Math.PI * nu) * H * 0.15 - size / 2,
      transform: `perspective(700px) rotate(${(i % 2 ? 1 : -1) * (20 + nu * 160)}deg) rotateX(${30 * Math.sin(nu * 6 + i)}deg) scale(${0.4 + 3.2 * ue})`,
      filter: `blur(${(Math.round((1.5 + 10 * ue) * 2) / 2).toFixed(1)}px)`,
      opacity: nu > 0 && nu < 1 ? Math.min(1, nu * 8, (1 - nu) * 6) : 0,
    };
  });
}

/** Dust in the window light, paper scraps thrown out with the notes, twinkles around the finished poster. */
function particleVals(
  p: number, t: number, W: number, H: number, mobile: boolean, mouth: Point, poster: Rect,
): { motes: MoteVals[]; scraps: ScrapVals[]; twinkles: TwinkleVals[] } {
  const motes: MoteVals[] = [];
  for (let i = 0; i < (mobile ? MOBILE_COUNT.motes : MAX.motes); i++) {
    const sp = 0.4 + rnd(i, 21) * 0.8;
    let y = (rnd(i, 23) * H - t * 14 * sp - p * H * 0.5 * sp) % H;
    if (y < 0) y += H;
    motes.push({
      left: rnd(i, 22) * W + Math.sin(t * 0.6 * sp + i) * 18,
      top: y,
      size: 2 + rnd(i, 24) * 4,
      opacity: 0.45 + 0.35 * Math.sin(t * 1.5 + i * 2.1),
      color: rnd(i, 25) > 0.65 ? COLORS[i % 5] : 'rgba(255,253,245,0.95)',
    });
  }

  const scraps: ScrapVals[] = [];
  for (let i = 0; i < (mobile ? MOBILE_COUNT.scraps : MAX.scraps); i++) {
    const u = (p - (0.28 + rnd(i, 31) * 0.07)) / 0.32;
    const uu = clamp01(u);
    const vx = (rnd(i, 32) - 0.5) * W * (mobile ? 1.0 : 0.8);
    const vy = -H * (0.7 + rnd(i, 33) * 0.6);
    const k = mobile ? 0.8 : 1;
    const rot = uu * (400 + rnd(i, 34) * 500) * (rnd(i, 35) > 0.5 ? 1 : -1);
    scraps.push({
      left: mouth.x + vx * uu + Math.sin(uu * 18 + i) * 12 * uu,
      top: mouth.y + vy * uu + 1.5 * H * uu * uu,
      w: (7 + rnd(i, 36) * 9) * k,
      h: (6 + rnd(i, 37) * 8) * k,
      color: SCRAP_COLORS[i % SCRAP_COLORS.length],
      transform: `rotate(${rot}deg) scaleY(${Math.cos(uu * 22 + i)})`,
      opacity: u > 0 && u < 1 ? Math.min(1, u * 10, (1 - u) * 5) : 0,
    });
  }

  const tw = seg(p, 0.9, 1);
  const twinkles = TWINKLE_SPOTS.slice(0, mobile ? MOBILE_COUNT.twinkles : MAX.twinkles).map(([xp, yp], i) => {
    const pulse = Math.abs(Math.sin(t * 1.8 + i * 1.3));
    return {
      left: poster.x + (poster.w * xp) / 100,
      top: poster.y + (poster.h * yp) / 100,
      transform: `rotate(${t * 25 + i * 30}deg) scale(${0.6 + 0.5 * pulse})`,
      opacity: tw * (0.35 + 0.65 * pulse),
    };
  });
  return { motes, scraps, twinkles };
}

/**
 * Everything the scroll story draws for scroll progress `p` at stage size vw x vh, `time` seconds into the page.
 * `pointer` (stage px) tilts the box and notes near it toward the cursor.
 */
export function storyFrame(progress: number, time: number, vw: number, vh: number, pointer: Pointer | null = null): StoryFrame {
  const p = clamp01(progress);
  const t = time;
  const W = vw;
  const H = vh;
  const mobile = isMobileWidth(vw);
  const cx = W / 2;
  const cy = H * (mobile ? 0.56 : 0.6);

  // Camera: push in on the box while it shakes, pull back as the notes fly, settle on the board.
  const ck = mobile ? 0.6 : 1;
  const push = easeInOutCubic(seg(p, 0.1, 0.32));
  const pull = easeInOutCubic(seg(p, 0.32, 0.6));
  const settle = easeInOutCubic(seg(p, 0.6, 0.74));
  const camS = 1 + (0.13 * push - 0.16 * pull + 0.03 * settle) * ck;
  const ox = cx;
  const oy = cy * (1 - pull) + (H / 2) * pull;
  const dx = Math.sin(t * 0.6) * 1.5;
  const dy = Math.cos(t * 0.45) * 1.2;
  // Undo the camera so the cursor is in the same coordinates as the scene it hovers.
  const ptr = pointer && { x: ox + (pointer.x - ox - dx) / camS, y: oy + (pointer.y - oy - dy) / camS, s: pointer.s };

  const { board, poster } = boardAndPoster(W, H, p, mobile);
  const { box, glow, dust, mouth } = boxVals(cx, cy, H, p, t, mobile, ptr);

  return {
    mobile,
    cameraOrigin: `${ox}px ${oy}px`,
    cameraTransform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${camS})`,
    wallTranslateY: -p * 90,
    board,
    poster,
    title: titleVals(p, poster.w, poster.h, mobile),
    box,
    glow,
    dust,
    notes: noteVals(p, W, H, mouth, board, mobile, ptr),
    near: nearVals(p, W, H, mouth, mobile),
    ...particleVals(p, t, W, H, mobile, mouth, poster),
    hintOpacity: 1 - seg(p, 0.02, 0.09),
    hintBob: Math.sin(t * 3) * 4,
  };
}
