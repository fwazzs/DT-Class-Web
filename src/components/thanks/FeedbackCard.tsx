import Image from 'next/image';
import PhotoPlaceholder from '@/components/ui/PhotoPlaceholder';
import { PHASE_ORDER } from '@/data/site';
import type { Student } from '@/types';
import { orPlaceholder, PHASE_BG } from '@/utils/phase';
import { cardKind, tapeStep, tiltStep, type CardKind } from './thanksMotion';

// Full class names so Tailwind can see them.
const WIDTH: Record<CardKind, string> = {
  note: 'w-[232px] md:w-[300px]',
  ruled: 'w-[260px] md:w-[340px]',
  kraft: 'w-[232px] md:w-[300px]',
};
const RULED_PAPER =
  'bg-liner bg-[linear-gradient(90deg,transparent_33px,rgba(210,70,60,0.4)_33px,rgba(210,70,60,0.4)_35px,transparent_35px),repeating-linear-gradient(180deg,transparent_0_27px,rgba(80,120,190,0.22)_27px_28px)] pt-5 pr-[18px] pb-4 pl-[46px]';
const KRAFT_PAPER =
  'bg-[#D9B98F] bg-[radial-gradient(rgba(110,74,40,0.18)_0.8px,transparent_1.2px)] px-5 pt-5 pb-4';
const PAPER: Record<CardKind, string> = {
  note: 'note-paper px-5 pt-5 pb-4',
  ruled: RULED_PAPER,
  kraft: KRAFT_PAPER,
};
const TILT = ['-rotate-[1.5deg]', '-rotate-1', '-rotate-[0.5deg]', 'rotate-0', 'rotate-[0.5deg]', 'rotate-1', 'rotate-[1.5deg]'];
const TAPE_TILT = [
  '-rotate-4', '-rotate-3', '-rotate-2', '-rotate-1', 'rotate-0', 'rotate-1', 'rotate-2', 'rotate-3', 'rotate-4',
];

interface FeedbackCardProps {
  student: Student;
  /** 0-based position among all 50 students (picks paper, tilt and tape). */
  index: number;
  /** True for the second copy of a looping row; hidden from assistive tech. */
  duplicate?: boolean;
}

/** One feedback card: sticky note, ruled index card or kraft card, rotating by index. */
export default function FeedbackCard({ student, index, duplicate = false }: FeedbackCardProps): React.JSX.Element {
  const kind = cardKind(index);
  const num = String(student.number).padStart(2, '0');
  const bg = kind === 'note' ? PHASE_BG[PHASE_ORDER[Math.floor(index / 3) % 5]] : '';
  const group = student.group === null ? '[nn]' : String(student.group).padStart(2, '0');
  return (
    <li
      aria-hidden={duplicate || undefined}
      className={`relative flex h-[196px] shrink-0 snap-center flex-col shadow-[0_2px_3px_rgba(40,30,20,0.25),0_14px_22px_-12px_rgba(40,30,20,0.45)] md:h-[210px] ${WIDTH[kind]} ${PAPER[kind]} ${bg} ${TILT[tiltStep(index)]}`}
    >
      <span
        aria-hidden="true"
        className={`absolute -top-[11px] left-[36%] h-[22px] w-[28%] bg-[rgba(240,234,218,0.85)] shadow-[0_1px_1px_rgba(0,0,0,0.08)] ${TAPE_TILT[tapeStep(index)]}`}
      />
      <p className="line-clamp-4 flex-1 font-hand text-xl leading-[1.15] font-bold text-[#1F1B16] md:text-2xl">
        “{orPlaceholder(student.feedback, `Feedback from student ${num}`)}”
      </p>
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="relative size-[34px] shrink-0 overflow-hidden rounded-full bg-[#CFCAC0] shadow-[0_0_0_2px_#FDFCF8]"
        >
          {student.photo ? (
            <Image src={student.photo} alt="" fill sizes="34px" className="object-cover" />
          ) : (
            <PhotoPlaceholder label="" />
          )}
        </span>
        <span className="flex min-w-0 flex-col leading-[1.2]">
          <span className="truncate text-sm font-bold text-[#1F1B16]">{orPlaceholder(student.name, 'Full name')}</span>
          <span className="truncate text-xs font-medium text-ink-soft tabular-nums">
            NRP {orPlaceholder(student.nrp, 'NRP')} · Group {group}
          </span>
        </span>
      </div>
    </li>
  );
}
