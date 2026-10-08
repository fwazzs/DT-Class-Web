import { CLASS_INFO, PHASE_ORDER } from '@/data/site';
import { orPlaceholder, PHASE_BG, PHASE_LABEL } from '@/utils/phase';
import { safeEmail } from '@/utils/safeUrl';
import { tornEdgePath } from './tornEdge';

const EDGE_DESKTOP = tornEdgePath(60);
const EDGE_MOBILE = tornEdgePath(24);

// Full class names so Tailwind can see them. One tilt per phase note.
const NOTE_TILT = ['-rotate-3', 'rotate-2', '-rotate-[1.5deg]', 'rotate-3', '-rotate-2'];

const NAV = [
  { href: '#showcase', label: 'Group showcase' },
  { href: '#lecturer', label: 'Lecturer' },
  { href: '#students', label: 'Students' },
  { href: '#thanks', label: 'Thank you' },
];

const LINK =
  'inline-flex min-h-11 items-center text-base font-[550] text-[#ECEBE8] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper';
const ROW = 'flex min-h-11 items-center text-base text-[#ECEBE8]';
const LABEL = 'mb-2 text-xs font-[650] tracking-[0.16em] text-footer-muted uppercase';

/** Dark closing footer with a torn-paper top edge that overlaps the section above. Static. */
export default function SiteFooter(): React.JSX.Element {
  const { courseCode, department, university, email } = CLASS_INFO;
  return (
    <footer className="relative -mt-7 pt-7 text-[#ECEBE8]">
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[30px] w-full fill-ink md:hidden">
        <path d={EDGE_MOBILE} />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 top-0 hidden h-[30px] w-full fill-ink md:block">
        <path d={EDGE_DESKTOP} />
      </svg>

      <div className="relative bg-ink px-5 pt-7 pb-8 md:px-16 md:pt-10 md:pb-9">
        <div className="flex flex-col gap-8 md:flex-row md:flex-wrap md:justify-between md:gap-14">
          <div className="flex min-w-0 flex-col gap-3.5 md:flex-[1_1_420px]">
            <p className="flex items-center gap-3 text-[15px] font-[650]">
              <span aria-hidden="true" className="size-[18px] -rotate-6 bg-note-empathize shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              {CLASS_INFO.name}
            </p>
            <p className="font-brush text-[40px] leading-[1.05] text-paper md:text-[56px]">Keep it human.</p>
            <p className="max-w-[30em] text-[15px] leading-normal text-[#B9B6AF]">
              A semester of interviews, sticky notes, paper prototypes and honest tests. {CLASS_INFO.semester}.
            </p>
            <ul aria-label="The five phases" className="mt-1.5 flex flex-wrap gap-2">
              {PHASE_ORDER.map((phase, i) => (
                <li
                  key={phase}
                  className={`note-paper px-2.5 py-1.5 font-hand text-lg leading-none font-bold text-[#1F1B16] shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${PHASE_BG[phase]} ${NOTE_TILT[i]}`}
                >
                  {PHASE_LABEL[phase]}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-1 md:flex-[0_1_180px]">
            <p className={LABEL}>Explore</p>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className={LINK}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-1 md:flex-[0_1_220px]">
            <p className={LABEL}>Class</p>
            <p className={ROW}>{orPlaceholder(courseCode, 'Course code')} · Design Thinking</p>
            <p className={ROW}>{orPlaceholder(department, 'Department')}</p>
            <p className={ROW}>{orPlaceholder(university, 'University')}</p>
            {email && safeEmail(email) ? (
              <a href={`mailto:${safeEmail(email)}`} className={LINK}>
                {email}
              </a>
            ) : (
              <p className={ROW}>{orPlaceholder(email, 'Class email')}</p>
            )}
          </div>

          <div className="flex items-start">
            <a
              href="#top"
              className="relative flex size-[132px] rotate-4 flex-col justify-between bg-note-empathize note-paper p-3.5 text-[#1F1B16] no-underline shadow-[0_2px_3px_rgba(0,0,0,0.35),0_16px_24px_-10px_rgba(0,0,0,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
            >
              <span aria-hidden="true" className="absolute -top-2.5 left-[32%] h-5 w-[36%] -rotate-4 bg-[rgba(240,234,218,0.85)]" />
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V5M5 11l7-7 7 7" />
              </svg>
              <span className="font-hand text-2xl leading-none font-bold">Back to the top</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-dashed border-[rgba(236,235,232,0.25)] pt-5 text-sm text-footer-muted md:mt-12">
          <p>© 2026 {CLASS_INFO.name}. Made by 10 groups and 50 students.</p>
          <p>Built on paper first.</p>
        </div>
      </div>
    </footer>
  );
}
