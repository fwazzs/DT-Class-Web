import type { ReactElement } from 'react';
import { PHASE_BG } from '@/utils/phase';
import { MAX, NEAR_NOTES, NOTE_WORDS } from './storyData';

// Square sticky paper: adhesive strip + sheen from `note-paper`, a curled lower-left corner, a light that shifts as it tilts.
const NOTE_SHAPE = 'rounded-[1px_1px_3px_14px/1px_1px_3px_4px]';
// Size, padding and type step up together at md (768px); storyMotion uses the same numbers (NOTE_SIZE).
const NOTE_BOX = 'absolute box-border size-14 md:size-[92px]';

/** Paper scraps thrown out of the box with the notes. */
function Scraps(): ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4]">
      {Array.from({ length: MAX.scraps }, (_, i) => (
        <div
          key={i}
          data-s="scrap"
          className="absolute opacity-0 [background-image:linear-gradient(180deg,rgba(255,255,255,0.25),rgba(0,0,0,0.12))] [clip-path:polygon(0_10%,45%_0,100%_14%,92%_100%,12%_88%)] drop-shadow-[0_2px_1px_rgba(40,30,20,0.25)]"
        />
      ))}
    </div>
  );
}

/** The 28 notes (14 on phones): launched from the box, drifting, then taped to the board. */
function Notes(): ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4]">
      {NOTE_WORDS.slice(0, MAX.notes).map((word, i) => (
        <div
          key={i}
          data-s="note"
          className={`note-paper ${PHASE_BG[word.phase]} ${NOTE_BOX} ${NOTE_SHAPE} flex items-end p-1.5 font-hand text-xs font-bold leading-[1.02] text-[#1F1B16] opacity-0 after:absolute after:inset-0 after:rounded-[inherit] after:bg-[linear-gradient(315deg,rgba(0,0,0,0.12),rgba(0,0,0,0)_18%)] md:p-[9px] md:text-[19px]`}
        >
          <span>{word.text}</span>
          <div data-s="note-shade" className="absolute inset-0 rounded-[inherit] bg-[#2A1E10] opacity-0" />
          <div data-s="note-glint" className="absolute inset-0 rounded-[inherit] bg-[#FFFDF2] opacity-0" />
          <div data-s="note-tape" className="tape absolute left-[28%] -top-[8%] h-[17%] w-[44%] opacity-0" />
        </div>
      ))}
    </div>
  );
}

/** A few notes fly right past the camera: big and out of focus. */
function NearNotes(): ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
      {NEAR_NOTES.map(([, , phase], i) => (
        <div
          key={i}
          data-s="near"
          className={`note-paper ${PHASE_BG[phase]} ${NOTE_BOX} ${NOTE_SHAPE} opacity-0 shadow-[0_30px_50px_-10px_rgba(40,30,20,0.35)]`}
        />
      ))}
    </div>
  );
}

export default function StickyNotes(): ReactElement {
  return (
    <>
      <Scraps />
      <Notes />
      <NearNotes />
    </>
  );
}
