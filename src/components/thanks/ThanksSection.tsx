'use client';

import { useEffect, useId, useRef } from 'react';
import { STUDENTS } from '@/data/site';
import type { Student } from '@/types';
import { useFrame } from '@/hooks/useFrame';
import { usePageTop } from '@/hooks/usePageTop';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { seenPx } from '@/utils/motion';
import FeedbackRow from './FeedbackRow';
import { ROW_SPEED, advanceTravel, marqueeX, thanksEnter, titleClipPath } from './thanksMotion';

const HALF = Math.ceil(STUDENTS.length / 2);

const ROWS: { students: Student[]; firstIndex: number; label: string }[] = [
  { students: STUDENTS.slice(0, HALF), firstIndex: 0, label: 'Student feedback, part 1' },
  { students: STUDENTS.slice(HALF), firstIndex: HALF, label: 'Student feedback, part 2' },
];

// Edge fade so cards slide in and out of the board instead of being cut off.
const EDGE_FADE =
  '[-webkit-mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]';

/** Cork board with a taped "Thank you" banner and two rows of student feedback drifting in opposite directions. */
export default function ThanksSection(): React.JSX.Element {
  const titleId = useId();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const endRef = useRef<HTMLParagraphElement>(null);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([null, null]);
  const listRefs = useRef<(HTMLUListElement | null)[]>([null, null]);
  const periods = useRef([0, 0]);
  const travel = useRef([0, 0]);
  const rowPaused = useRef([false, false]);
  const lastTime = useRef<number | null>(null);
  const lastSeen = useRef(Number.NaN);
  const sectionH = useRef(0);
  const pageTop = usePageTop(sectionRef);

  // One loop period = distance from the first card to its copy; measured, so it follows the breakpoint.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;
    const measure = (): void => {
      sectionH.current = section.offsetHeight;
      listRefs.current.forEach((ul, k) => {
        const first = ul?.children[0] as HTMLElement | undefined;
        const copy = ul?.children[ROWS[k].students.length] as HTMLElement | undefined;
        periods.current[k] = first && copy ? copy.offsetLeft - first.offsetLeft : 0;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduced]);

  // Back to the resting state if the visitor switches reduced motion on mid-session.
  useEffect(() => {
    if (!reduced) return;
    [bannerRef.current, titleRef.current, endRef.current, ...wrapperRefs.current, ...listRefs.current].forEach((el) => {
      el?.style.removeProperty('transform');
      el?.style.removeProperty('opacity');
      el?.style.removeProperty('clip-path');
    });
  }, [reduced]);

  useFrame(({ time, vh, scrollY }) => {
    const section = sectionRef.current;
    if (!section) return;
    const dt = lastTime.current === null ? 0 : time - lastTime.current;
    lastTime.current = time;
    const top = pageTop.current - scrollY;
    if (top + sectionH.current <= 0 || top >= vh) return; // only animate while on screen

    const seen = seenPx(top, vh);
    const enter = thanksEnter(seen);
    const entering = seen !== lastSeen.current;
    lastSeen.current = seen;
    if (entering && bannerRef.current) {
      bannerRef.current.style.transform = `translateY(${enter.bannerY}px)`;
      bannerRef.current.style.opacity = String(enter.bannerOpacity);
    }
    if (entering && titleRef.current) titleRef.current.style.clipPath = titleClipPath(enter.titleClip);
    if (entering && endRef.current) endRef.current.style.opacity = String(enter.endOpacity);

    ROWS.forEach((_, k) => {
      if (!rowPaused.current[k]) travel.current[k] = advanceTravel(travel.current[k], dt, ROW_SPEED[k]);
      const list = listRefs.current[k];
      const wrapper = wrapperRefs.current[k];
      if (list) list.style.transform = `translateX(${marqueeX(k as 0 | 1, travel.current[k], periods.current[k], enter.rowSlide[k])}px)`;
      if (entering && wrapper) wrapper.style.opacity = String(enter.rowsOpacity);
    });
  }, !reduced);

  return (
    <section
      ref={sectionRef}
      id="thanks"
      aria-labelledby={titleId}
      className="relative overflow-hidden bg-cork bg-cork-texture pt-16 pb-[72px] text-ink shadow-[inset_0_14px_0_var(--color-frame),inset_0_-14px_0_var(--color-frame),inset_0_20px_24px_-8px_rgba(0,0,0,0.35)] md:pt-[104px] md:pb-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_18%,rgba(255,240,215,0.35),transparent_70%)]"
      />

      <div
        ref={bannerRef}
        className="relative mx-auto w-[calc(100%-32px)] max-w-[358px] -rotate-1 bg-paper px-[18px] pt-[22px] pb-5 text-center shadow-[0_2px_3px_rgba(40,30,20,0.2),0_24px_40px_-18px_rgba(40,30,20,0.5)] md:w-[calc(100%-64px)] md:max-w-[760px] md:px-10 md:pt-[30px] md:pb-7"
      >
        <span
          aria-hidden="true"
          className="absolute -top-3 left-[12%] h-[26px] w-[100px] -rotate-6 bg-[rgba(255,228,92,0.7)] shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
        />
        <span
          aria-hidden="true"
          className="absolute -top-2.5 right-[12%] h-[26px] w-[100px] rotate-5 bg-[rgba(124,200,255,0.6)] shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
        />
        <p className="text-[13px] font-[650] tracking-[0.16em] text-ink-soft uppercase">05 — From all of us</p>
        <h2 ref={titleRef} id={titleId} className="mt-1.5 font-brush text-[64px] leading-[1.05] font-normal md:text-[128px]">
          Thank you
        </h2>
        {/* Extra top margin clears the "y" descender of the brush lettering */}
        <p className="mt-4 text-[15px] leading-[1.35] font-medium text-ink-soft md:mt-7 md:text-lg">
          What 50 students of Design Thinking Class C took away this semester.
        </p>
      </div>

      <div className={`relative mt-10 flex flex-col gap-3 md:mt-16 md:gap-5 ${reduced ? '' : EDGE_FADE}`}>
        {ROWS.map((row, k) => (
          <FeedbackRow
            key={row.label}
            students={row.students}
            firstIndex={row.firstIndex}
            label={row.label}
            loop={!reduced}
            wrapperRef={(el) => {
              wrapperRefs.current[k] = el;
            }}
            listRef={(el) => {
              listRefs.current[k] = el;
            }}
            onPausedChange={(paused) => {
              rowPaused.current[k] = paused;
            }}
          />
        ))}
      </div>

      <p
        ref={endRef}
        className="relative mt-7 text-center font-hand text-2xl font-bold text-[#1F1B16] md:mt-11 md:text-[30px]"
      >
        See you at the next wall of ideas.
      </p>
    </section>
  );
}
