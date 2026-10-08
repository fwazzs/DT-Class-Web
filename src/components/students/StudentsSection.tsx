'use client';

import { useEffect, useId, useRef } from 'react';
import PaperGrain from '@/components/ui/PaperGrain';
import { CLASS_INFO, STUDENTS } from '@/data/site';
import { useFrame } from '@/hooks/useFrame';
import { usePageTop } from '@/hooks/usePageTop';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { seenPx } from '@/utils/motion';
import StudentCard from './StudentCard';
import { buildRevealLayout, cardReveal, revealProgress, type RevealLayout } from './studentsMotion';

const RAISED_SHADOW = '0 18px 26px -8px rgba(40,30,20,0.3)';

/** Students wall: 50 polaroids that drop in row by row as the section scrolls into view. */
export default function StudentsSection(): React.JSX.Element {
  const titleId = useId();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pinRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const layoutRef = useRef<RevealLayout | null>(null);
  const lastSeen = useRef(Number.NaN);
  const pageTop = usePageTop(sectionRef);

  // Measure the rendered layout (wrapping differs per breakpoint) instead of hard-coding row heights.
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;
    const measure = (): void => {
      const cards = cardRefs.current.filter((c): c is HTMLLIElement => c !== null);
      const gridTop = grid.getBoundingClientRect().top - section.getBoundingClientRect().top;
      layoutRef.current = buildRevealLayout(
        gridTop,
        cards.map((c) => c.offsetTop),
      );
      lastSeen.current = Number.NaN;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Back to the resting state if the visitor switches reduced motion on mid-session.
  useEffect(() => {
    lastSeen.current = Number.NaN; // repaint on the next frame when motion comes back on
    if (!reduced) return;
    cardRefs.current.forEach((c) => {
      c?.style.removeProperty('opacity');
      c?.style.removeProperty('transform');
      c?.style.removeProperty('box-shadow');
    });
    pinRefs.current.forEach((p) => p?.style.removeProperty('opacity'));
  }, [reduced]);

  useFrame(({ vh, scrollY }) => {
    const section = sectionRef.current;
    const layout = layoutRef.current;
    if (!section || !layout) return;
    // Clamping to doneAt means nothing is rewritten once the wall is complete (or still below the fold).
    const seen = Math.min(Math.max(seenPx(pageTop.current - scrollY, vh), 0), layout.doneAt);
    if (seen === lastSeen.current) return;
    lastSeen.current = seen;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const r = revealProgress(seen, layout.gridTop, layout.offsets[i], layout.cols[i]);
      const v = cardReveal(r, i);
      card.style.opacity = String(v.opacity);
      card.style.transform = v.transform;
      card.style.boxShadow = v.settled ? '' : RAISED_SHADOW;
      const pin = pinRefs.current[i];
      if (pin) pin.style.opacity = String(v.pinOpacity);
    });
  }, !reduced);

  return (
    <section
      ref={sectionRef}
      id="students"
      aria-labelledby={titleId}
      className="relative overflow-hidden bg-wall bg-wall-dots px-4 pt-14 pb-16 text-ink md:px-16 md:pt-24 md:pb-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_30%_at_20%_0%,rgba(255,248,228,0.7),transparent_70%)]"
      />
      <PaperGrain />

      <div className="relative mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-12">
        <div>
          <p className="text-[13px] font-[650] tracking-[0.16em] text-ink-soft uppercase">04 — The class</p>
          <h2 id={titleId} className="mt-2.5 text-[34px] leading-none font-[750] tracking-[-0.03em] md:text-[56px]">
            {STUDENTS.length} students. One wall.
          </h2>
        </div>
        <p className="mb-1 -rotate-2 font-hand text-[22px] font-bold text-ink-soft md:text-[28px]">
          {CLASS_INFO.name} · {CLASS_INFO.semester}
        </p>
      </div>

      <ul ref={gridRef} className="relative flex flex-wrap justify-center gap-[14px] md:gap-7">
        {STUDENTS.map((student, i) => (
          <StudentCard
            key={student.number}
            student={student}
            index={i}
            cardRef={(el) => {
              cardRefs.current[i] = el;
            }}
            pinRef={(el) => {
              pinRefs.current[i] = el;
            }}
          />
        ))}
      </ul>
    </section>
  );
}
