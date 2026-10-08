interface PhotoPlaceholderProps {
  /** Accessible name, e.g. "Photo of the lecturer". */
  label: string;
  className?: string;
}

/** Grey silhouette on hatched paper, shown until a real photo is added. */
export default function PhotoPlaceholder({ label, className = '' }: PhotoPlaceholderProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMax meet"
      className={`bg-hatch block h-full w-full bg-[#cfcac0] ${className}`}
    >
      <circle cx="50" cy="40" r="17" fill="#a29c91" />
      <path d="M14 100 C16 72 32 62 50 62 C68 62 84 72 86 100Z" fill="#a29c91" />
    </svg>
  );
}
