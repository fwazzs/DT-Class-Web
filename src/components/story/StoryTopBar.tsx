import type { ReactElement } from 'react';

/** Skip link for keyboard users: invisible until it receives focus (44px minimum target). */
export default function StoryTopBar(): ReactElement {
  return (
    <a
      href="#showcase"
      className="sr-only z-[6] text-[15px] font-semibold text-ink focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:right-4 focus-visible:inline-flex focus-visible:min-h-11 focus-visible:items-center focus-visible:rounded-sm focus-visible:bg-paper focus-visible:px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:focus-visible:right-10 md:focus-visible:top-6"
    >
      Skip to showcase
    </a>
  );
}
