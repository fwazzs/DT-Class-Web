import type { ReactElement } from 'react';
import { CLASS_INFO } from '@/data/site';
import { orPlaceholder } from '@/utils/phase';

/** Top bar: class name on the left, a skip link on the right (44px minimum target). */
export default function StoryTopBar(): ReactElement {
  return (
    <header className="absolute inset-x-0 top-0 z-[6] box-border flex h-[60px] items-center justify-between gap-4 px-4 md:h-[76px] md:px-10">
      <p className="m-0 flex items-center gap-2.5 text-[15px] font-[650]">
        <span aria-hidden="true" className="size-4 rotate-[-6deg] bg-note-empathize shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
        <span>{orPlaceholder(CLASS_INFO.name, 'Class name')}</span>
        <span className="hidden font-[450] text-muted md:inline">{orPlaceholder(CLASS_INFO.semester, 'Semester')}</span>
      </p>
      <a
        href="#showcase"
        className="inline-flex min-h-11 items-center rounded-sm px-1 text-[15px] font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Skip to showcase
      </a>
    </header>
  );
}
