import Image from 'next/image';
import type { RefCallback } from 'react';
import PhotoPlaceholder from '@/components/ui/PhotoPlaceholder';
import type { Student } from '@/types';
import { orPlaceholder } from '@/utils/phase';
import { tiltIndex } from './studentsMotion';

// Full class names so Tailwind can see them. Index = tiltIndex(): -3 to +3 degrees in half-degree steps.
const TILT = [
  '-rotate-3', '-rotate-[2.5deg]', '-rotate-2', '-rotate-[1.5deg]', '-rotate-1', '-rotate-[0.5deg]', 'rotate-0',
  'rotate-[0.5deg]', 'rotate-1', 'rotate-[1.5deg]', 'rotate-2', 'rotate-[2.5deg]', 'rotate-3',
];
const PIN_BG = ['bg-[#D2493A]', 'bg-[#2F6FDB]', 'bg-[#E8B53A]', 'bg-[#3E9B5B]', 'bg-[#E07A2E]'];

interface StudentCardProps {
  student: Student;
  /** 0-based position in the wall (drives tilt, pin color and reveal direction). */
  index: number;
  cardRef: RefCallback<HTMLLIElement>;
  pinRef: RefCallback<HTMLSpanElement>;
}

/** One polaroid on the wall. The reveal animation is written onto `cardRef` / `pinRef` by the section. */
export default function StudentCard({ student, index, cardRef, pinRef }: StudentCardProps): React.JSX.Element {
  const num = String(student.number).padStart(2, '0');
  const photoLabel = student.name ? `Photo of ${student.name}` : `Student ${num} photo`;
  return (
    <li
      ref={cardRef}
      className={`relative w-[calc((100%-28px)/3-0.5px)] bg-[#FDFCF8] px-1.5 pt-1.5 pb-2.5 shadow-[0_1px_2px_rgba(40,30,20,0.2),0_8px_14px_-6px_rgba(40,30,20,0.3)] md:w-[calc((100%-196px)/8-0.5px)] md:px-2 md:pt-2 md:pb-3.5 ${TILT[tiltIndex(index)]}`}
    >
      <span
        ref={pinRef}
        aria-hidden="true"
        className={`absolute -top-1.5 left-1/2 z-10 -ml-[7px] size-3.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0_2px,transparent_3px)] shadow-[2px_3px_3px_rgba(40,30,20,0.3)] ${PIN_BG[index % 5]}`}
      />
      <div className="relative aspect-square overflow-hidden">
        {student.photo ? (
          <Image
            src={student.photo}
            alt={photoLabel}
            fill
            sizes="(min-width: 768px) 10vw, 30vw"
            className="object-cover"
          />
        ) : (
          <PhotoPlaceholder label={photoLabel} />
        )}
        <span
          aria-hidden="true"
          className="absolute top-[5px] left-1.5 rounded-sm bg-paper/80 px-1 text-[11px] leading-4 font-bold tracking-[0.06em] text-ink/70 tabular-nums"
        >
          {num}
        </span>
      </div>
      <p className="mt-2 font-hand text-[17px] leading-[1.05] font-bold text-[#1F1B16] md:text-[19px]">
        {orPlaceholder(student.name, 'Full name')}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold tracking-[0.04em] text-muted tabular-nums md:text-xs">
        NRP {orPlaceholder(student.nrp, 'NRP')}
      </p>
    </li>
  );
}
