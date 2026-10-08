interface PlayPauseButtonProps {
  playing: boolean;
  onToggle: () => void;
}

/** Visible stop control for the auto-moving feedback rows (WCAG 2.2.2). */
export default function PlayPauseButton({ playing, onToggle }: PlayPauseButtonProps): React.JSX.Element {
  return (
    <div className="relative mt-5 flex justify-center">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink shadow-[0_2px_3px_rgba(40,30,20,0.25),0_8px_14px_-8px_rgba(40,30,20,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          {playing ? <path d="M3 2h2.5v10H3zM8.5 2H11v10H8.5z" /> : <path d="M3 1.5v11l9-5.5z" />}
        </svg>
        {playing ? 'Pause scrolling' : 'Play scrolling'}
      </button>
    </div>
  );
}
