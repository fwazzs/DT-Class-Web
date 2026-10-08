import type { ReactElement } from 'react';
import { PHASE_BG } from '@/utils/phase';
import { PHASE_ORDER } from '@/data/site';
import { MAX } from './storyData';

/** Dust motes in the window light, plus twinkles around the finished poster. */
export default function Sparkle(): ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
      {Array.from({ length: MAX.motes }, (_, i) => (
        <div
          key={`m${i}`}
          data-s="mote"
          className="absolute left-0 top-0 rounded-full opacity-0 will-change-transform shadow-[0_0_0_1px_rgba(120,100,70,0.16),0_0_8px_rgba(255,240,200,0.9)]"
        />
      ))}
      {Array.from({ length: MAX.twinkles }, (_, i) => (
        <div key={`t${i}`} data-s="twinkle" className="absolute -ml-[11px] -mt-[11px] size-[22px] opacity-0">
          <div className={`absolute left-0 top-[9.5px] h-[3px] w-[22px] rounded-[2px] shadow-[0_0_0_1px_rgba(40,30,20,0.18)] ${PHASE_BG[PHASE_ORDER[i % 5]]}`} />
          <div className={`absolute left-[9.5px] top-0 h-[22px] w-[3px] rounded-[2px] shadow-[0_0_0_1px_rgba(40,30,20,0.18)] ${PHASE_BG[PHASE_ORDER[i % 5]]}`} />
        </div>
      ))}
    </div>
  );
}
