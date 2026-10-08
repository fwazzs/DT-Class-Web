import type { ReactElement } from 'react';

/** "Scroll or tap the box to open it" with a mouse icon; faded out and bobbed by the story loop. */
export default function ScrollHint(): ReactElement {
  return (
    <div
      aria-hidden="true"
      data-s="hint"
      className="absolute inset-x-0 bottom-6 z-[5] flex flex-col items-center gap-2 text-sm font-medium text-muted md:bottom-8"
    >
      <span>Scroll or tap the box to open it</span>
      <svg data-s="hint-icon" width="18" height="28" viewBox="0 0 18 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="1" width="16" height="26" rx="8" />
        <path d="M9 7v5" />
      </svg>
    </div>
  );
}
