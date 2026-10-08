import type { MouseEvent, ReactElement } from 'react';
import Image from 'next/image';
import type { Group } from '@/types';
import { PHASE_BG, orPlaceholder } from '@/utils/phase';
import { isExternal, safeHref } from '@/utils/safeUrl';
import { pad2 } from './showcaseMotion';

interface ShowcaseCardProps {
  group: Group;
  count: number;
  isActive: boolean;
  onSelect: (e: MouseEvent<HTMLDivElement>) => void;
}

const HMW_FALLBACK = "How might we [your group's HMW question]?";

/** One magazine page. Transform, opacity and z-index are written by `useCarousel`, never here. */
export default function ShowcaseCard({ group, count, isActive, onSelect }: ShowcaseCardProps): ReactElement {
  const num = pad2(group.number);
  const href = safeHref(group.href);
  const alt = group.number % 2 === 0;
  const members = group.members.length > 0 ? group.members.join(', ') : '[Member names]';

  return (
    // The click handler only adds "click a neighbour to go to it"; keyboard users have the arrows and buttons.
    <div
      data-card
      role="group"
      aria-roledescription="slide"
      aria-label={`Group ${group.number} of ${count}`}
      onClick={onSelect}
      className={`absolute top-5 left-1/2 -ml-[140px] flex h-[420px] w-[280px] flex-col rounded-[3px] bg-paper p-3.5 ${group.number === 1 ? '' : 'opacity-0'} shadow-[0_1px_3px_rgba(40,30,20,0.12),0_12px_24px_-14px_rgba(40,30,20,0.3)] data-[front=true]:shadow-[0_2px_4px_rgba(40,30,20,0.12),0_30px_50px_-20px_rgba(40,30,20,0.45)] md:-ml-[200px] md:h-[540px] md:w-[400px] md:p-[18px]`}
    >
      <div className="flex justify-between text-xs font-[650] tracking-[0.12em] text-muted uppercase">
        <span>Issue {num}</span>
        <span>Design Thinking</span>
      </div>

      <div className="bg-hatch relative mt-3 h-[190px] shrink-0 overflow-hidden bg-[#dad6ce] md:h-[262px]">
        {group.cover ? (
          <Image
            src={group.cover}
            alt={`Cover photo of Group ${group.number}`}
            fill
            draggable={false}
            sizes="(min-width: 768px) 364px, 252px"
            className="object-cover"
          />
        ) : (
          <span className="absolute top-3 left-3 bg-paper/90 px-2 py-1 text-xs font-medium text-muted">[Group cover photo]</span>
        )}
        <span
          aria-hidden="true"
          data-parallax
          className={`absolute -bottom-6 left-2 text-[150px] leading-none font-extrabold tracking-[-0.06em] md:-bottom-9 md:text-[220px] ${group.cover ? 'text-paper' : 'text-ink'}`}
        >
          {num}
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5 pr-[92px] md:pr-[130px]">
        <p className="flex items-center gap-2 text-xs font-[650] tracking-[0.12em] uppercase">
          <span aria-hidden="true" className={`size-2.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)] ${PHASE_BG[group.phase]}`} />
          Group {num}
        </p>
        <h3 className="text-[22px] leading-[1.05] font-[750] tracking-[-0.02em] md:text-[30px]">
          {orPlaceholder(group.projectTitle, 'Project title')}
        </h3>
        <p className="text-sm text-muted">{members}</p>
      </div>

      {href ? (
      <a
        href={href}
        {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        tabIndex={isActive ? 0 : -1}
        draggable={false}
        className="inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-[650] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Open project
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
      ) : (
        // No project page yet: say so instead of rendering a link that goes nowhere.
        <span className="inline-flex min-h-11 items-center self-start text-[15px] font-[650] text-muted">[Project link]</span>
      )}

      <div
        className={`note-paper absolute top-[180px] -right-3 box-border size-[108px] p-2.5 font-hand text-base leading-[1.05] font-bold text-[#1f1b16] shadow-[0_2px_3px_rgba(40,30,20,0.22),0_10px_18px_-6px_rgba(40,30,20,0.25)] md:top-[236px] md:-right-[22px] md:size-[150px] md:p-3.5 md:text-[21px] ${PHASE_BG[group.phase]} ${alt ? 'rotate-[5deg]' : '-rotate-4'}`}
      >
        {group.hmw ?? HMW_FALLBACK}
        <div aria-hidden="true" className="tape absolute -top-[9px] left-[30%] h-[18px] w-[40%] -rotate-3" />
      </div>
    </div>
  );
}
