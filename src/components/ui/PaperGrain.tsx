import { useId } from 'react';

interface PaperGrainProps {
  className?: string;
}

/** Fine paper grain laid over a section (multiply blend). Purely decorative. */
export default function PaperGrain({ className = '' }: PaperGrainProps) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full opacity-55 mix-blend-multiply ${className}`}>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.28" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}
