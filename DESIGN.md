# DESIGN — Sticky note × wall magazine

The source of truth is the approved canvas: https://claude.ai/artifact/5GYRT9TMkkAk9JR1X3iDB5. Each artboard's full source is in `design/canvas/*.dc.html`, and porting means matching those files.

## Concept

The page is a classroom wall: a dotted studio wall, a cork "mading" board in a dark wood frame, paper, kraft card, washi tape and handwriting. Everything is a physical object lit from a window at the top-left. Nothing glows, there are no gradients-for-their-own-sake, and nothing is glass.

## Color tokens (`src/app/globals.css` → `@theme`)

| Token | Hex | Use |
|---|---|---|
| `wall` | #E9E6DF | Page ground, with the `bg-wall-dots` 22px dot grid |
| `paper` | #FBFAF6 | Posters, cards, polaroids |
| `liner` | #FFFEFA | Ruled notebook paper |
| `cork` | #C9A47E | Boards (`bg-cork-texture`) |
| `kraft` | #C99C6A | Cardboard box, kraft cards |
| `frame` | #3A2E25 | Board frame |
| `ink` | #17181A | Text, footer ground |
| `ink-soft` / `muted` | #3B3934 / #55534E | Secondary text (both pass AA on paper and wall) |
| `note-empathize` | #FFE45C | Empathize |
| `note-define` | #FF8FB1 | Define |
| `note-ideate` | #7CC8FF | Ideate |
| `note-prototype` | #8EE07A | Prototype |
| `note-test` | #FFA552 | Test |
| `tint-*` | pale versions of the notes | Showcase ambient wall tint |

Each phase owns its color everywhere it appears (helpers in `src/utils/phase.ts`). Text on notes is always ink.

## Type

| Role | Font | Notes |
|---|---|---|
| Display lettering | Kaushan Script (`font-brush`) | "Design Thinking", "Lecturer Profile", "Thank you", "Keep it human." |
| Handwriting | Caveat 700 (`font-hand`) | Note text, captions, feedback quotes |
| Interface and body | Bricolage Grotesque 400–800 (`font-sans`) | Headings at 750 with tight tracking; tabular numbers for counters and NRPs |

Kicker labels are 13px, 650 weight, 0.16em tracking and uppercase, for example "02 — The showcase".

## Surfaces and details

- **Sticky note:** a square in a phase color with the `note-paper` utility, curled corner radius `1px 1px 3px 14px / 1px 1px 3px 4px`, a two-layer shadow and an optional `tape` strip on top.
- **Polaroid:** paper with an 8px border and a thicker bottom, a colored push pin and a random tilt of ±3°.
- **Tape:** the `tape` utility (masking tape), or pink/blue washi with a diagonal stripe.
- **Placeholders:** `PhotoPlaceholder` (silhouette on hatch). Missing text renders as `[Label]` through `orPlaceholder()`.
- **Grain:** the `PaperGrain` overlay on wall and board sections.

## Motion

Every animation is a pure function of scroll progress (plus `time` for idle loops), ported from the canvas math. Easing helpers live in `src/utils/motion.ts`.

### Scroll story (progress p = 0 → 1 over the pinned section)

| p | Beat |
|---|---|
| 0 – 0.12 | Box idles: bob, plus a lid bump every 3.4s. Scroll hint is shown |
| 0.12 – 0.30 | Shake: rocks on the bottom edge that stays down, hops, dust at each landing. Camera pushes in to 1.13× |
| 0.25 – 0.37 | Long flaps spring open with overshoot, then the inner flaps. Warm light spills out |
| 0.30 – 0.58 | 28 notes launch along curved paths (3D tumble, motion blur), then drift like leaves. Paper scraps fall. 4 notes fly past the camera. Camera pulls back |
| 0.56 – 0.70 | Board and poster fade and scale in. Box drops out of frame |
| 0.64 – 0.91 | Notes fly to their pins, press in, wobble, and get taped |
| 0.76 – 0.94 | "Design" then "Thinking" written by a moving marker pen (clip-path wipe) |
| 0.88 – 1.00 | Tagline, "Scroll for the showcase" cue, twinkles around the poster |

### Other sections

- **Showcase:**
  - Neighbouring cards scale to 0.92, tilt ±3° and dim.
  - Snaps with momentum: 180ms of release velocity is projected forward before snapping.
  - Transition: `0.65s cubic-bezier(0.22,0.8,0.24,1)`. Background tint crossfades over 0.7s.
- **Lecturer:**
  1. The page turns in with rotateY(-100° → 0) from the left spine.
  2. The photo slides in (outBack).
  3. The title wipe runs.
  4. The card drops in (outBack).
- **Students:** each row drops 70px with tilt and scale, using outBack. Columns are staggered by 14px of scroll. The pin appears last.
- **Thanks:** the banner rises and writes in. The rows slide in from opposite sides, then loop at 40px/s and 34px/s.

### Reduced motion

Show each section's final state: no pinning travel, no loops, no idle bob.

## Layout and responsive

- Breakpoint `md` (768px). Below it, the phone layout from `Mobile.dc.html`: story with 14 notes and a 150px box, showcase cards 280px wide, students in 3 columns, stacked footer.
- Side gutters are 16–20px on phones and 64px on desktop.
- Touch targets are at least 44px. Focus rings stay visible (never `outline: none`).
