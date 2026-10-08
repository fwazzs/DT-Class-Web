import type { ReactElement } from 'react';
import Image from 'next/image';
import PhotoPlaceholder from '@/components/ui/PhotoPlaceholder';

interface LecturerPhotoProps {
  /** Path under /public, or null for the placeholder. */
  photo: string | null;
}

/** Paper cut-out photo. Its torn edges are clip-paths written by `useLecturerEnter` (see data-torn). */
export default function LecturerPhoto({ photo }: LecturerPhotoProps): ReactElement {
  return (
    <div
      data-lec="photo"
      className="relative order-2 mt-8 h-[260px] w-[210px] shrink-0 [filter:drop-shadow(0_3px_2px_rgba(40,30,20,0.25))_drop-shadow(0_18px_18px_rgba(40,30,20,0.22))] md:order-none md:mt-0 md:mb-10 md:aspect-[380/560] md:h-auto md:w-[clamp(200px,26vw,380px)] md:self-end"
    >
      <div data-torn="51:2.4" className="absolute inset-0 bg-[#fdfcf8]">
        <div data-torn="61:1.2" className="bg-hatch absolute inset-3.5 overflow-hidden bg-[#cfcac0]">
          {photo ? (
            <Image src={photo} alt="Portrait of the lecturer" fill sizes="(min-width: 768px) 380px, 210px" className="object-cover" />
          ) : (
            <>
              <PhotoPlaceholder label="Placeholder for the lecturer photo" />
              <span className="absolute top-3 left-3 bg-paper/90 px-2 py-1 text-xs font-medium text-muted">[Lecturer photo]</span>
            </>
          )}
        </div>
      </div>
      <div
        aria-hidden="true"
        data-lec="photo-tape"
        className="absolute -top-3 left-[34%] h-[26px] w-24 -rotate-6 bg-[rgba(238,232,214,0.85)] shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
      />
    </div>
  );
}
