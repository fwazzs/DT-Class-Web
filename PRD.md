# PRD — Design Thinking Class C Portfolio

**Status:** Design approved 2026-10-07 · Build in progress
**Design source:** [Claude Design canvas](https://claude.ai/artifact/5GYRT9TMkkAk9JR1X3iDB5) (mirrored in `design/canvas/`)

## 1. Summary

A one-page website for **Design Thinking Class C (First Semester, 2026)**. It celebrates the class's work: a scroll-driven opening story, a showcase of the 10 group projects, the lecturer, all 50 students, and their feedback. The theme is **sticky notes on a wall magazine (mading)**: paper, cork, tape and handwriting.

## 2. Goals

| Goal | Measure |
|---|---|
| Show every group's project in one memorable page | All 10 groups reachable within the showcase; each has title, HMW, members, cover |
| Make the class feel like a community | All 50 students shown with photo, full name, NRP and feedback |
| Feel crafted, not templated | Passes the `/apple-design` review; no generic AI-template patterns |
| Work everywhere | Usable from 360px phones to large desktops; keyboard and screen-reader friendly |
| Fast | Lighthouse ≥ 90 in all categories; LCP < 2.5s, CLS < 0.1, INP < 200ms |

## 3. Audience

- **Students of Class C** — find themselves and their group, share the link.
- **Lecturer** — a record of the semester.
- **Visitors** (other classes, families, recruiters) — understand what the class made in under a minute.

## 4. Page structure (in scroll order)

1. **Scroll story** (`#top`). This section is pinned for about 4.2 screens on desktop and 3.6 on phones. Scrolling drives it through these beats:
   1. A closed cardboard box idles: it breathes and rattles now and then.
   2. The box shakes, rocking on its edges and kicking up dust.
   3. The tape splits and four flaps spring open, with light spilling out.
   4. 28 sticky notes (14 on phones) burst out, tumble, and drift down like paper, with motion blur. A few fly past the camera.
   5. A framed cork board fades in and the box drops away.
   6. Each note presses onto the board and gets taped.
   7. "Design Thinking" is hand-written across the poster with a moving pen.

   A "Skip to showcase" link sits in the top bar.
2. **Group showcase** (`#showcase`): a full-screen slider of 10 "magazine page" cards.
   - Each card shows an issue number, cover, group number, project title, members, and the group's "How might we…?" sticky note.
   - Controls: drag with momentum, horizontal trackpad swipe, ←/→/Home/End, prev/next buttons and a dot index.
   - The wall tint follows the active group's phase color.
3. **Lecturer profile** (`#lecturer`).
   - Content: a magazine page with a torn-paper cut-out photo, the "Lecturer Profile" lettering, and a bio on ruled notebook paper (name, title, bio, expertise tags, email). A yellow side tab runs down the page on desktop.
   - Entrance: the page turns in, the photo slides in, the title writes in, then the card drops in.
   - No exit animation (removed by the user).
4. **Students** (`#students`).
   - 50 polaroids, each with a photo, number, full name and NRP. Desktop rows hold 8; phones hold 3.
   - Incomplete rows are centered.
   - Each row drops in and gets pinned as it scrolls into view.
5. **Thank you** (`#thanks`).
   - A cork board with a paper banner carrying "Thank you" in the brush lettering.
   - Below it, two rows of student feedback cards (sticky note, ruled index card or kraft card) slide in a loop in opposite directions. Hovering a row pauses it.
6. **Footer**.
   - A torn-paper edge, the "Keep it human." wordmark, and the five phase notes.
   - Explore links, class info and a "Back to the top" sticky note.

## 5. Functional requirements

- **FR1** All content comes from typed data in `src/data/site.ts`. A missing value renders as a visible `[Placeholder]`.
- **FR2** The scroll story and the reveals are tied to scroll position, never to timers. Scrolling back reverses them.
- **FR3** With `prefers-reduced-motion`:
  - the story shows its final board with no pinning
  - reveals appear already in place
  - the feedback rows and idle motion stop
- **FR4** The showcase slider is fully keyboard operable and announces the current group (`aria-live`).
- **FR5** Every image has alt text. Decorative layers are `aria-hidden`.
- **FR6** All in-page links (skip to showcase, footer links, back to top) jump to the right section.

## 6. Non-functional requirements

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4. The page is statically prerendered.
- No animation library. A single shared `requestAnimationFrame` loop writes transforms through refs, so scrolling never re-renders React.
- Mobile-first. Touch targets are at least 44px. Text contrast meets WCAG 2.1 AA.
- Main JS under 500KB gzipped. Images go through `next/image` and are lazy-loaded below the fold.
- No secrets, no user input, no backend in v1.

## 7. Content still needed (blocking launch, not blocking build)

| Item | Count | Format |
|---|---|---|
| Group project title, HMW statement, members, cover image | 10 | text + image (16:10 or 4:3) |
| Lecturer name, title, department, bio, expertise, email, photo | 1 | text + portrait photo |
| Student full name, NRP, group number, feedback, photo | 50 | spreadsheet + square photos named `<NRP>.jpg` |
| Course code, department, university, class email | 1 | text |

## 8. Out of scope (v1)

- Per-group detail pages. The cards link to `#group-nn` for now; a route can be added later.
- CMS or admin editing (content is edited in `src/data/site.ts`), a feedback submission form, i18n, and dark mode. The paper metaphor is light by design.
- Real 3D (React Three Fiber) for the box. Revisit if the CSS 3D version isn't convincing enough.

## 9. Milestones

1. Design canvas: approved.
2. Scaffold, docs and shared contracts.
3. Sections built in parallel: story · showcase + lecturer · students + thanks + footer.
4. Integration and evaluation: build, lint, tests, mobile, reduced motion, Lighthouse.
5. Reviews: `/apple-design`, security and code review.
6. Real content in, then deploy to Vercel.
