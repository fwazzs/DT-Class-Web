import type { ReactElement } from 'react';
import { CLASS_INFO } from '@/data/site';
import { orPlaceholder } from '@/utils/phase';

const TAPE =
  'absolute h-[26px] w-16 bg-[rgba(238,232,214,0.85)] shadow-[0_1px_1px_rgba(0,0,0,0.08)] md:w-[92px]';
// Pen nib: dark body with a yellow cap, parked at left:0 until the wipe moves it.
const PEN =
  'absolute bottom-[22%] left-0 h-[1.15em] w-[0.14em] origin-bottom rounded-[0.03em_0.03em_0.05em_0.05em] bg-ink [background-image:linear-gradient(180deg,#FFE45C_0_22%,transparent_22%)] opacity-0 shadow-[0.08em_0.1em_0.12em_rgba(40,30,20,0.3)]';

interface TitleLineProps {
  text: string;
}

/** One lettering line: the text is revealed by a clip-path wipe while a marker pen rides its edge. */
function TitleLine({ text }: TitleLineProps): ReactElement {
  return (
    <span aria-hidden="true" className="relative block px-[0.12em]">
      <span data-s="clip" className="block [clip-path:inset(-30%_108%_-30%_-8%)]">
        {text}
      </span>
      <span data-s="pen" className={PEN} />
    </span>
  );
}

/** Cork board in a dark wood frame, with the paper poster and lettering on it. */
export default function BoardPoster(): ReactElement {
  return (
    <>
      <div
        aria-hidden="true"
        data-s="board"
        className="bg-cork-texture absolute z-[1] box-border rounded-[6px] border-[10px] border-frame bg-cork opacity-0 shadow-[inset_0_3px_12px_rgba(0,0,0,0.38),0_30px_60px_-24px_rgba(40,30,20,0.45)] before:absolute before:inset-0 before:bg-[radial-gradient(70%_70%_at_30%_20%,rgba(255,240,215,0.28),rgba(255,240,215,0)_70%)] md:border-[14px]"
      />
      <div
        data-s="poster"
        className="absolute z-[2] box-border flex flex-col items-center justify-center gap-2 bg-paper p-[18px] text-center opacity-0 shadow-[0_1px_2px_rgba(40,30,20,0.2),0_14px_30px_-10px_rgba(40,30,20,0.35)] md:gap-3.5 md:p-8"
      >
        {/* Tape sits on the corners, above the padding, so it never covers the tag line */}
        <div aria-hidden="true" className={`${TAPE} -top-4 -left-3 rotate-[-38deg]`} />
        <div aria-hidden="true" className={`${TAPE} -top-4 -right-3 rotate-[38deg]`} />
        <p data-s="kicker" className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-muted opacity-0">
          {orPlaceholder(CLASS_INFO.name, 'Class name')} · {orPlaceholder(CLASS_INFO.semester, 'Semester')}
        </p>
        <h1
          aria-label="Design Thinking"
          data-s="title"
          className="m-0 flex w-full flex-col items-center text-center font-brush font-normal leading-[0.98] text-ink"
        >
          <TitleLine text="Design" />
          <TitleLine text="Thinking" />
        </h1>
        <p data-s="cue" className="m-0 flex items-center gap-1.5 text-sm font-semibold text-muted opacity-0">
          Scroll for the showcase
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 2v10M3 8l4 4 4-4" />
          </svg>
        </p>
      </div>
    </>
  );
}
