import type { ReactElement } from 'react';
import { MAX } from './storyData';

// CSS-3D kraft box lit from the top-left. --s is the box edge and --h half of it (the cube's depth offset);
// both are static per breakpoint. Everything that animates carries data-s and is driven by storyApply.

const FACE = 'absolute inset-0 backface-hidden';
const FLAP_HINGE = 'absolute left-0 top-0 h-0 [transform-style:preserve-3d]';
const TAPE_STRIP =
  'absolute top-0 h-full w-[18%] [background-image:linear-gradient(90deg,rgba(222,200,150,0.85),rgba(250,240,215,0.95)_50%,rgba(222,200,150,0.85))]';

const FRONT_OUTER =
  'bg-[#DCC196] [background-image:repeating-linear-gradient(0deg,rgba(90,60,30,0.05)_0_1px,transparent_1px_6px)] shadow-[inset_0_0_0_1px_rgba(90,60,30,0.3)]';
const BACK_OUTER = 'bg-[#DCC196] shadow-[inset_0_0_0_1px_rgba(90,60,30,0.3)]';

function BoxInterior(): ReactElement {
  return (
    <>
      <div className="absolute inset-0 bg-[#8A6240] [background-image:linear-gradient(180deg,rgba(255,235,200,0.08),rgba(25,12,0,0.55))] [transform:rotateY(180deg)_translateZ(var(--h))]" />
      <div className="absolute inset-0 bg-[#7D5838] [background-image:linear-gradient(180deg,rgba(255,235,200,0.05),rgba(25,12,0,0.6))] [transform:rotateY(-90deg)_translateZ(var(--h))]" />
      <div className="absolute inset-0 bg-[#5E4128] [background-image:radial-gradient(closest-side,rgba(0,0,0,0),rgba(0,0,0,0.35))] [transform:rotateX(-90deg)_translateZ(var(--h))]" />
    </>
  );
}

function BoxSides(): ReactElement {
  return (
    <>
      {/* right side: in shade */}
      <div
        className={`absolute inset-0 bg-[#A97C4D] [background-image:linear-gradient(90deg,rgba(0,0,0,0),rgba(40,20,5,0.28)),repeating-linear-gradient(90deg,rgba(70,45,20,0.07)_0_1px,transparent_1px_6px)] shadow-[inset_0_0_0_1px_rgba(80,50,25,0.4),inset_0_2px_0_rgba(255,235,200,0.25)] [transform:rotateY(90deg)_translateZ(var(--h))]`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[6%] text-[length:var(--sf)] font-bold tracking-[0.12em] text-[rgba(55,34,15,0.62)]">
          <svg width="30%" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 18V4M4 10l6-6 6 6M30 18V4M24 10l6-6 6 6" />
          </svg>
          <span>THIS SIDE UP</span>
        </div>
      </div>
      {/* front: in the light */}
      <div
        className={`absolute inset-0 bg-[#C99C6A] [background-image:linear-gradient(160deg,rgba(255,240,215,0.28),rgba(255,240,215,0)_45%,rgba(60,35,10,0.2)),repeating-linear-gradient(90deg,rgba(90,60,30,0.06)_0_1px,transparent_1px_6px)] shadow-[inset_0_0_0_1px_rgba(90,60,30,0.35),inset_0_2px_0_rgba(255,240,215,0.45),inset_0_-14px_20px_-12px_rgba(60,35,10,0.4)] [transform:translateZ(var(--h))]`}
      >
        <div className="absolute left-[10%] top-[16%] box-border h-[30%] w-[48%] rotate-[-1.5deg] bg-[#F4EFE4] [background-image:linear-gradient(170deg,rgba(255,255,255,0.4),rgba(0,0,0,0.04))] [padding:5%_6%] font-hand text-[length:var(--lf)] font-bold leading-[1.1] text-[#2A2622] shadow-[0_1px_1px_rgba(0,0,0,0.18)]">
          To: Class C
          <br />
          From: 10 groups
        </div>
        <div className="absolute bottom-[12%] right-[9%] rotate-[-8deg] border-2 border-[rgba(166,61,47,0.85)] [padding:3%_5%] text-center text-[length:var(--sf)] font-[750] uppercase leading-[1.15] tracking-[0.08em] text-[rgba(166,61,47,0.85)] mix-blend-multiply">
          Handle with
          <br />
          curiosity
        </div>
        {/* packing tape running down from the lid seam */}
        <div className="absolute left-[41%] top-0 h-[24%] w-[18%] [background-image:linear-gradient(90deg,rgba(222,200,150,0.8),rgba(250,240,215,0.92)_35%,rgba(222,200,150,0.8))] shadow-[0_1px_1px_rgba(60,35,10,0.18)]" />
      </div>
    </>
  );
}

/** Front and back inner flaps: pale liner outside, kraft inside. */
function InnerFlap({ name, fold, outer }: InnerFlapProps): ReactElement {
  return (
    <div data-s={name} className={`${FLAP_HINGE} w-[var(--s)]`}>
      <div className={`absolute left-0 top-px h-[var(--h)] w-full origin-top [transform-style:preserve-3d] ${fold}`}>
        <div className={`${FACE} ${outer}`} />
        <div className={`${FACE} bg-[#C39566] [background-image:linear-gradient(180deg,rgba(255,240,215,0.25),rgba(60,35,10,0.15))] shadow-[inset_0_0_0_1px_rgba(90,60,30,0.35)] [transform:rotateY(180deg)]`} />
      </div>
    </div>
  );
}

interface InnerFlapProps {
  name: string;
  fold: string;
  outer: string;
}

// Full literal class strings so Tailwind can see them.
const OUTER_LEFT =
  'bg-[#D6AB78] [background-image:linear-gradient(135deg,rgba(255,245,225,0.3),rgba(60,35,10,0.12)),repeating-linear-gradient(0deg,rgba(90,60,30,0.05)_0_1px,transparent_1px_6px)]';
const OUTER_RIGHT =
  'bg-[#D2A673] [background-image:linear-gradient(135deg,rgba(255,245,225,0.22),rgba(60,35,10,0.16)),repeating-linear-gradient(0deg,rgba(90,60,30,0.05)_0_1px,transparent_1px_6px)]';
const INNER_LEFT = '[background-image:linear-gradient(90deg,rgba(60,35,10,0.18),rgba(60,35,10,0)_40%)]';
const INNER_RIGHT = '[background-image:linear-gradient(270deg,rgba(60,35,10,0.18),rgba(60,35,10,0)_40%)]';

/** Long flaps (left/right): kraft outside with tape, pale liner inside; a shade layer darkens as they open. */
function LongFlap({ side }: LongFlapProps): ReactElement {
  const left = side === 'left';
  return (
    <div data-s={left ? 'flap-l' : 'flap-r'} className={`${FLAP_HINGE} w-0 ${left ? '' : 'left-[var(--s)]'}`}>
      <div className={`absolute -top-[var(--h)] h-[var(--s)] w-[var(--h)] [transform-style:preserve-3d] [transform:rotateX(90deg)] ${left ? 'left-0' : '-left-[var(--h)]'}`}>
        <div className={`${FACE} shadow-[inset_0_0_0_1px_rgba(90,60,30,0.32)] ${left ? OUTER_LEFT : OUTER_RIGHT}`}>
          <div className={`${TAPE_STRIP} ${left ? 'right-0' : 'left-0'}`} />
          <div data-s={left ? 'shade-l' : 'shade-r'} className="absolute inset-0 bg-[#2A1A0A] opacity-0" />
        </div>
        <div className={`${FACE} bg-[#E2C9A0] shadow-[inset_0_0_0_1px_rgba(90,60,30,0.28)] [transform:rotateY(180deg)] ${left ? INNER_LEFT : INNER_RIGHT}`} />
      </div>
    </div>
  );
}

interface LongFlapProps {
  side: 'left' | 'right';
}

/** Warm light spilling out of the opening box. */
function Glow(): ReactElement {
  return (
    <div
      aria-hidden="true"
      data-s="glow"
      className="absolute z-[2] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,247,222,0.95),rgba(255,236,190,0.45)_45%,rgba(255,236,190,0))] opacity-0"
    />
  );
}

/** Dust kicked up each time the box lands while shaking. */
function Dust(): ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3]">
      {Array.from({ length: MAX.dust }, (_, i) => (
        <div
          key={i}
          data-s="dust"
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(150,128,100,0.55),rgba(150,128,100,0))] opacity-0"
        />
      ))}
    </div>
  );
}

interface CardboardBoxProps {
  /** Called on click: the section shakes the box and plays the opening. A pointer shortcut only: keyboard users scroll as usual. */
  onOpen?: () => void;
}

export default function CardboardBox({ onOpen }: CardboardBoxProps): ReactElement {
  return (
    <>
      <Glow />
      <Dust />
      <div
        aria-hidden="true"
        data-s="box"
        onClick={onOpen}
        className="absolute z-[3] size-[var(--s)] cursor-pointer opacity-0 [--h:75px] [--lf:11px] [--s:150px] [--sf:8px] [perspective:1100px] md:[--h:115px] md:[--lf:17px] md:[--s:230px] md:[--sf:12px]"
      >
        {/* tight contact shadow + soft ambient shadow */}
        <div data-s="box-shadow" className="absolute left-[-16%] top-[80%] h-[34%] w-[132%] rounded-full bg-[radial-gradient(closest-side,rgba(40,30,20,0.28),rgba(40,30,20,0))]" />
        <div data-s="box-contact" className="absolute left-[4%] top-[92%] h-[12%] w-[92%] rounded-full bg-[radial-gradient(closest-side,rgba(30,20,10,0.5),rgba(30,20,10,0))]" />
        <div data-s="cube" className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(-22deg)_rotateY(-34deg)]">
          <BoxInterior />
          <BoxSides />
          <InnerFlap name="flap-f" fold="[transform:rotateX(-90deg)]" outer={FRONT_OUTER} />
          <InnerFlap name="flap-b" fold="[transform:rotateX(90deg)]" outer={BACK_OUTER} />
          <LongFlap side="left" />
          <LongFlap side="right" />
        </div>
      </div>
    </>
  );
}
