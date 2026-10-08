'use client';

import type { MouseEvent, ReactElement } from 'react';
import { useId } from 'react';
import PaperGrain from '@/components/ui/PaperGrain';
import { GROUPS } from '@/data/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PHASE_BG, PHASE_TINT_BG } from '@/utils/phase';
import ShowcaseCard from './ShowcaseCard';
import { pad2 } from './showcaseMotion';
import { useCarousel } from './useCarousel';

const BTN =
  'flex size-12 items-center justify-center rounded-full border-[1.5px] border-ink p-0 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-35 md:size-[52px]';
const KBD =
  'inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-md border-[1.5px] border-ink text-[13px] font-[650]';

export default function ShowcaseSection(): ReactElement {
  const headingId = useId();
  const reduced = useReducedMotion();
  const count = GROUPS.length;
  const { trackRef, active, go, wasDragged, handlers } = useCarousel({ count, reduced });

  const select = (index: number) => (e: MouseEvent<HTMLDivElement>): void => {
    if (wasDragged()) {
      e.preventDefault();
      return;
    }
    if (index !== active) {
      e.preventDefault();
      go(index);
    }
  };

  return (
    <section
      id="showcase"
      aria-labelledby={headingId}
      className={`relative flex min-h-[100svh] flex-col overflow-hidden px-5 pt-9 pb-7 transition-colors duration-700 ease-out motion-reduce:transition-none md:px-16 md:pt-16 md:pb-9 ${PHASE_TINT_BG[GROUPS[active].phase]}`}
    >
      <div aria-hidden="true" className="bg-wall-dots pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_48%,rgba(255,252,240,0.6),rgba(255,252,240,0)_70%),radial-gradient(130%_110%_at_50%_45%,rgba(0,0,0,0)_55%,rgba(70,52,34,0.14)_100%)]"
      />
      <PaperGrain />

      <header className="relative z-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-[650] tracking-[0.16em] text-ink-soft uppercase">02 — The showcase</p>
          <h2 id={headingId} className="mt-2.5 max-w-[12em] text-[34px] leading-none font-[750] tracking-[-0.03em] md:text-[54px]">
            Ten groups. Ten problems worth solving.
          </h2>
        </div>
        <p className="mb-1.5 hidden items-center gap-2 text-sm font-medium text-ink-soft md:flex">
          Drag, swipe or use <kbd className={KBD}>←</kbd>
          <kbd className={KBD}>→</kbd>
        </p>
      </header>

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Group projects"
        tabIndex={0}
        {...handlers}
        className="relative z-10 mt-6 -mx-5 h-[470px] shrink-0 cursor-grab touch-pan-y select-none focus-visible:outline-2 focus-visible:-outline-offset-6 focus-visible:outline-ink data-[dragging=true]:cursor-grabbing md:-mx-16 md:mt-2.5 md:h-[600px]"
      >
        {GROUPS.map((group, i) => (
          <ShowcaseCard key={group.number} group={group} count={count} isActive={i === active} onSelect={select(i)} />
        ))}
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-between gap-4 pt-4">
        <p aria-live="polite" className="text-[28px] font-[750] tracking-[-0.02em] tabular-nums md:text-[34px]">
          {pad2(active + 1)}
          <span className="font-medium text-muted"> / {count}</span>
        </p>

        <nav aria-label="Choose a group" className="hidden gap-0.5 md:flex">
          {GROUPS.map((group, i) => {
            const on = i === active;
            return (
              <button
                key={group.number}
                type="button"
                aria-label={`Go to group ${group.number}`}
                aria-current={on ? 'true' : undefined}
                onClick={() => go(i)}
                className="flex size-11 cursor-pointer items-center justify-center bg-transparent p-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
              >
                <span
                  className={`transition-all duration-300 ease-out ${PHASE_BG[group.phase]} ${
                    on
                      ? 'size-[26px] -translate-y-[3px] shadow-[0_6px_10px_-2px_rgba(40,30,20,0.35)]'
                      : `size-[18px] shadow-[0_1px_2px_rgba(40,30,20,0.25)] ${i % 2 ? 'rotate-6' : '-rotate-5'}`
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex gap-3">
          <button type="button" aria-label="Previous group" disabled={active === 0} onClick={() => go(active - 1)} className={`${BTN} bg-paper text-ink`}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8H3M7 4L3 8l4 4" />
            </svg>
          </button>
          <button type="button" aria-label="Next group" disabled={active === count - 1} onClick={() => go(active + 1)} className={`${BTN} bg-ink text-paper`}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
