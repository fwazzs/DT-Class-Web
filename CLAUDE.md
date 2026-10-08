# CLAUDE.md — Design Thinking Class C Portfolio

The parent `D:\AI\Project\CLAUDE.md` applies too (stack rules, git workflow, phased workflow). This file covers what is specific to this project.

## Overview

A one-page portfolio for Design Thinking Class C (First Semester, 2026). The theme is sticky notes on a wall magazine. The page runs in this order: scroll story, group showcase, lecturer, students, thank you, footer.

- Requirements: `PRD.md`
- Visual and motion spec: `DESIGN.md`
- Approved canvas: https://claude.ai/artifact/5GYRT9TMkkAk9JR1X3iDB5. Its source is mirrored in `design/canvas/*.dc.html`, the porting reference for each section.

## Stack

Next.js 16.4 (App Router; read `node_modules/next/dist/docs/` before using unfamiliar APIs), React 19.3, TypeScript strict, Tailwind CSS 4 (`@theme` tokens in `src/app/globals.css`), Vitest. Deploy target: Vercel. No animation library.

## Commands

```bash
npm run dev     # dev server
npm run build   # production build (page is fully static)
npm run lint    # tsc --noEmit + eslint
npm test        # vitest run
```

## Architecture

```
src/
├── app/            layout.tsx (fonts, metadata), page.tsx (section order), globals.css (tokens + utilities)
├── components/
│   ├── story/      StorySection + storyMotion.ts (pure math) + tests
│   ├── showcase/   ShowcaseSection (slider)
│   ├── lecturer/   LecturerSection
│   ├── students/   StudentsSection
│   ├── thanks/     ThanksSection
│   ├── footer/     SiteFooter
│   └── ui/         PaperGrain, PhotoPlaceholder (shared, decorative)
├── data/site.ts    ALL content (class info, groups, lecturer, students)
├── hooks/          useFrame (one shared rAF loop), useReducedMotion
├── types/index.ts  Phase, ClassInfo, Group, Lecturer, Student
└── utils/          motion.ts (clamp/seg/easing/rnd/progress), phase.ts (phase → class names, placeholders)
```

### Animation pattern (every animated section follows it)

1. Put the math in a **pure function** in `<section>/<name>Motion.ts`: inputs are (progress or seen px, viewport, time) and the output is plain numbers and strings. Unit-test it.
2. The component is a client component. It renders static markup with Tailwind classes, and keeps refs to the animated nodes.
3. `useFrame(cb, !reduced)` computes progress from **cached** geometry: `usePageTop(ref).current - frame.scrollY` gives the section's top, and heights come from a ResizeObserver. Never read layout inside a frame callback, because several sections write in the same frame and a read forces a synchronous layout. Results are written with `el.style.… = …`, skipping unchanged values in hot loops. React never re-renders on scroll.
4. Skip the work when the section is off-screen.
5. Reduced motion: render the final state statically and don't subscribe.

### Rules

- No `style` prop in JSX. Static styling uses Tailwind, and per-item variety comes from lookup tables of full class names. The only inline styles are values written imperatively through refs during animation.
- Content only comes from `src/data/site.ts`. A missing value shows `[Placeholder]` through `orPlaceholder()`, never fake text.
- Decorative layers get `aria-hidden`. Real controls are real `<button>` and `<a>` elements with visible focus.
- Section ids `top`, `showcase`, `lecturer`, `students` and `thanks` are a contract, because the footer and skip links use them.

## Phase plan

| Phase | Scope | Status |
|---|---|---|
| 0 | Design canvas approved | ✅ 2026-10-07 |
| 1 | Scaffold, docs, contracts (types, data, hooks, utils, tokens) | ✅ 2026-10-07 |
| 2 | Sections in parallel: story · showcase + lecturer · students + thanks + footer | ✅ 2026-10-07 |
| 3 | Integrate and evaluate: build, lint, tests, mobile, reduced motion, Lighthouse (mobile: Perf 93, A11y 100, BP 100) | ✅ 2026-10-07 |
| 4 | `/apple-design` review, security review, code review, with fixes applied | ✅ 2026-10-07 |
| 5 | Real content (groups, lecturer, 50 students), then deploy to Vercel | ⏳ |

## Decisions log

- **2026-10-07:**
  - **Stack:** Next.js + TS + Tailwind, chosen by the user. This repo uses Next 16 (create-next-app default) with `cacheComponents` enabled.
  - **No animation library.** A custom pure-math timeline is ported 1:1 from the canvas, driven by one shared rAF loop that writes to refs. This keeps the bundle small, avoids React re-renders while scrolling, and makes the math unit-testable.
  - **The box stays CSS 3D.** React Three Fiber is a later option if more realism is wanted.
  - **Light theme only:** the paper metaphor doesn't translate to dark.
  - **The lecturer section has no exit animation** (the user removed it).
  - **Shared mobile breakpoint is 768px (`md`).** The canvas used 700px.
  - **`@types/node` bumped to ^24** to match Node 24 (needed by Vitest 5).
  - **Security baseline:**
    - Links and emails from `site.ts` go through `utils/safeUrl.ts`, and a test checks the content file.
    - The CSP and security headers are in `next.config.ts`.
  - **Privacy:** `robots: noindex` is set by default because the page lists students' names and NRPs, so Lighthouse SEO reads 60 by design. Flip it only if the class agrees.
  - **Performance:** frame callbacks never read layout (`usePageTop` instead), the story caches its style writes and repaints idle-only frames at about 30fps, and the paper grain sits outside the moving camera. Mobile Lighthouse Performance went from 80 to 93 and TBT from 460ms to 80ms.
  - **Showcase links:** a card with no project link shows `[Project link]` instead of a dead `#group-nn` anchor.
  - **Dev-only `npm audit` warnings** (5 high, an eslint-config-next ReDoS) are accepted. Don't run `audit fix --force`.
