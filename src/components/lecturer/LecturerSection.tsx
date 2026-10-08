'use client';

import type { ReactElement } from 'react';
import { useRef } from 'react';
import PaperGrain from '@/components/ui/PaperGrain';
import { LECTURER } from '@/data/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import LecturerCard from './LecturerCard';
import LecturerPhoto from './LecturerPhoto';
import { useLecturerEnter } from './useLecturerEnter';

const PAGE_EDGE = 'absolute inset-0 shadow-[0_1px_2px_rgba(40,30,20,0.15)]';

export default function LecturerSection(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useLecturerEnter(rootRef, reduced);

  return (
    <section
      ref={rootRef}
      id="lecturer"
      aria-label="Lecturer profile"
      className="bg-wall-dots relative flex min-h-[100svh] overflow-hidden bg-wall px-3 py-5 text-ink md:p-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_78%_10%,rgba(255,248,228,0.7),rgba(255,248,228,0)_70%),radial-gradient(130%_110%_at_50%_45%,rgba(0,0,0,0)_55%,rgba(70,52,34,0.16)_100%)]"
      />
      <PaperGrain />

      <div className="relative flex flex-1">
        {/* Page edges stacked behind: the "next pages" of the magazine. */}
        <div aria-hidden="true" data-lec="under" className={`${PAGE_EDGE} translate-x-2.5 translate-y-2 rotate-[0.6deg] bg-[#f1eee6]`} />
        <div aria-hidden="true" data-lec="under" className={`${PAGE_EDGE} translate-x-[5px] translate-y-1 rotate-[0.3deg] bg-[#f6f3ec]`} />

        <div
          data-lec="page"
          className="relative flex flex-1 origin-left flex-col items-center bg-paper px-4 pt-6 pb-6 shadow-[0_2px_4px_rgba(40,30,20,0.12),0_40px_70px_-30px_rgba(40,30,20,0.45)] md:flex-row md:items-stretch md:justify-center md:gap-[clamp(24px,5vw,74px)] md:p-0 md:pr-16"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(40,30,20,0.18),rgba(40,30,20,0)_6%)]" />

          {/* Yellow side tab, desktop only */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 hidden h-full w-16 items-center justify-center bg-note-empathize bg-[linear-gradient(90deg,rgba(0,0,0,0.08),rgba(0,0,0,0)_30%)] md:flex"
          >
            <span className="rotate-90 text-[13px] font-bold tracking-[0.3em] whitespace-nowrap text-[#1f1b16] uppercase">
              03 · Lecturer · Design Thinking Class C
            </span>
          </div>

          <LecturerPhoto photo={LECTURER.photo} />

          {/* On phones this wrapper vanishes so title, photo and card stack in that order. */}
          <div className="contents md:flex md:w-[clamp(320px,36vw,520px)] md:flex-col md:pt-[70px] md:pb-10">
            <div className="order-1 flex flex-col items-center gap-1 text-center md:order-none">
              <p className="text-[13px] font-[650] tracking-[0.16em] text-ink-soft uppercase">03 — Meet the lecturer</p>
              <h2 data-lec="title" className="font-brush text-[44px] leading-[1.05] font-normal md:text-[76px]">
                Lecturer Profile
              </h2>
            </div>
            <LecturerCard lecturer={LECTURER} />
          </div>
        </div>
      </div>
    </section>
  );
}
