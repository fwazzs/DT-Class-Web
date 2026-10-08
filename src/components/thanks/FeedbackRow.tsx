'use client';

import { useRef, type FocusEvent, type Ref } from 'react';
import type { Student } from '@/types';
import FeedbackCard from './FeedbackCard';

interface FeedbackRowProps {
  students: Student[];
  /** Index of students[0] among all 50 (so both rows keep rotating the paper kinds). */
  firstIndex: number;
  label: string;
  /** Animated rows render every card twice for a seamless loop; otherwise it is a scrollable list. */
  loop: boolean;
  wrapperRef: Ref<HTMLDivElement>;
  listRef: Ref<HTMLUListElement>;
  /** Called with true while the pointer is over the row or focus is inside it. */
  onPausedChange: (paused: boolean) => void;
}

/** One row of feedback cards: drifting marquee, or a horizontally scrollable list for reduced motion. */
export default function FeedbackRow({
  students,
  firstIndex,
  label,
  loop,
  wrapperRef,
  listRef,
  onPausedChange,
}: FeedbackRowProps): React.JSX.Element {
  const hold = useRef({ hover: false, focus: false });
  const update = (key: 'hover' | 'focus', on: boolean): void => {
    hold.current[key] = on;
    onPausedChange(hold.current.hover || hold.current.focus);
  };
  const onBlur = (e: FocusEvent<HTMLDivElement>): void => {
    if (!e.currentTarget.contains(e.relatedTarget)) update('focus', false);
  };

  const cards = students.map((s, i) => <FeedbackCard key={s.number} student={s} index={firstIndex + i} />);
  const copy = students.map((s, i) => (
    <FeedbackCard key={`copy-${s.number}`} student={s} index={firstIndex + i} duplicate />
  ));

  if (!loop) {
    return (
      <div
        ref={wrapperRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="snap-x snap-mandatory overflow-x-auto py-3.5 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink"
      >
        <ul ref={listRef} className="flex w-max gap-4 px-6 md:gap-7 md:px-16">
          {cards}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative py-3.5"
      onPointerEnter={() => update('hover', true)}
      onPointerLeave={() => update('hover', false)}
      onFocus={() => update('focus', true)}
      onBlur={onBlur}
    >
      <ul ref={listRef} aria-label={label} className="relative flex w-max gap-4 will-change-transform md:gap-7">
        {cards}
        {copy}
      </ul>
    </div>
  );
}
