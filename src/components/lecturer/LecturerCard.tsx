import type { ReactElement } from 'react';
import type { Lecturer } from '@/types';
import { orPlaceholder } from '@/utils/phase';
import { safeEmail } from '@/utils/safeUrl';

interface LecturerCardProps {
  lecturer: Lecturer;
}

const RULED =
  'bg-liner bg-[linear-gradient(90deg,transparent_47px,rgba(210,70,60,0.45)_47px,rgba(210,70,60,0.45)_49px,transparent_49px),repeating-linear-gradient(180deg,transparent_0_31px,rgba(80,120,190,0.25)_31px_32px)] bg-position-[0_0,0_30px]';
const TAG = 'px-2.5 py-1.5 text-[13px] font-[650]';

/** Ruled-notebook bio card with washi tape. */
export default function LecturerCard({ lecturer }: LecturerCardProps): ReactElement {
  const tags = lecturer.expertise.length > 0 ? lecturer.expertise : ['[Expertise]'];
  return (
    <div
      data-lec="card"
      className={`relative order-3 mt-[22px] flex min-h-[380px] w-full flex-col pt-[30px] pr-7 pb-6 pl-16 leading-8 shadow-[0_2px_3px_rgba(40,30,20,0.18),0_22px_36px_-16px_rgba(40,30,20,0.4)] md:order-none md:mt-[76px] md:min-h-[420px] ${RULED}`}
    >
      <div
        aria-hidden="true"
        data-lec="card-tape"
        className="absolute -top-[13px] left-[42%] h-[26px] w-[110px] rotate-3 bg-[rgba(255,143,177,0.6)] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.45)_0_6px,rgba(255,255,255,0)_6px_14px)] shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
      />
      <h3 className="text-[22px] leading-8 font-[750] tracking-[-0.02em] md:text-[28px]">{orPlaceholder(lecturer.name, 'Lecturer name')}</h3>
      <p className="text-[15px] font-semibold text-ink-soft">{orPlaceholder(lecturer.title, 'Title · Department, University')}</p>
      <p className="font-hand text-xl font-bold text-[#23201b] md:text-[23px]">
        {orPlaceholder(lecturer.bio, 'Short bio: teaching focus, research, and what they hope students take from Design Thinking.')}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-2 leading-[1.2]">
        <span className={`${TAG} bg-note-empathize`}>Design Thinking</span>
        {tags.map((t) => (
          <span key={t} className={`${TAG} bg-note-ideate`}>
            {t}
          </span>
        ))}
        {lecturer.email && safeEmail(lecturer.email) ? (
          <a
            href={`mailto:${safeEmail(lecturer.email)}`}
            className="inline-flex min-h-11 items-center px-2.5 text-[13px] font-[650] underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {lecturer.email}
          </a>
        ) : (
          <span className="inline-flex min-h-8 items-center px-2.5 text-[13px] font-[650]">[Email]</span>
        )}
      </div>
    </div>
  );
}
