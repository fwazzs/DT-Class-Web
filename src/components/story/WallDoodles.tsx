import type { ReactElement } from 'react';

// Hand-drawn doodles on the studio wall. They drift up slowly with scroll (the wrapper is moved by storyApply).
// Desktop gets the full set; phones get a compact set. No pencil: the user removed it.


function DesktopSet(): ReactElement {
  return (
    <div className="hidden md:contents">
      {/* Double diamond */}
      <div className="absolute left-[5%] top-[15%] rotate-[-4deg] opacity-[0.62]">
        <svg width="230" height="128" viewBox="0 0 230 128" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 54 C28 34 40 22 58 10 C74 26 88 38 110 54 C88 72 74 82 58 98 C40 82 26 70 6 54Z" />
          <path d="M118 54 C140 34 152 22 170 10 C186 26 200 40 222 54 C200 72 186 82 170 98 C152 82 138 70 118 54Z" />
          <path d="M58 10 V98 M170 10 V98" strokeDasharray="3 5" />
          <text x="115" y="122" fill="currentColor" stroke="none" fontSize="17" textAnchor="middle">discover · define · develop · deliver</text>
        </svg>
      </div>
      {/* Lightbulb */}
      <div className="absolute left-1/4 top-1/4 rotate-[8deg] opacity-60">
        <svg width="74" height="96" viewBox="-12 -12 84 104" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30 6 C14 6 6 18 6 30 C6 42 16 48 18 58 H42 C44 48 54 42 54 30 C54 18 46 6 30 6Z" />
          <path d="M20 65 H40 M22 72 H38 M26 79 H34" />
          <path d="M-6 10 L1 15 M66 10 L59 15 M30 -9 V-2 M-9 34 H-2 M62 34 H69" />
        </svg>
      </div>
      {/* User + speech bubble */}
      <div className="absolute left-[6%] top-[57%] rotate-[-3deg] opacity-[0.62]">
        <svg width="150" height="90" viewBox="0 0 150 90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="20" cy="22" r="9" />
          <path d="M20 31 V62 M20 40 L7 52 M20 40 L33 52 M20 62 L9 84 M20 62 L31 84" />
          <path d="M54 6 H134 C142 6 146 10 146 18 V38 C146 46 142 50 134 50 H76 L62 63 L65 50 H54 C46 50 42 46 42 38 V18 C42 10 46 6 54 6Z" />
          <text x="94" y="34" fill="currentColor" stroke="none" fontSize="19" textAnchor="middle">what if…?</text>
        </svg>
      </div>
      {/* Curly arrow pointing at the box */}
      <div className="absolute left-[29%] top-[63%] opacity-60">
        <svg width="120" height="70" viewBox="0 0 120 70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 48 C26 8 66 6 76 32 C84 54 58 62 52 46 C46 32 72 22 108 30" />
          <path d="M98 22 L108 30 L97 37" />
          <text x="2" y="68" fill="currentColor" stroke="none" fontSize="17">open me</text>
        </svg>
      </div>
      {/* HMW circled */}
      <div className="absolute left-[81%] top-[19%] rotate-[5deg] opacity-[0.62]">
        <svg width="130" height="70" viewBox="0 0 130 70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M14 36 C10 12 116 6 120 32 C124 58 18 64 10 40 C6 28 32 14 70 14" />
          <text x="64" y="44" fill="currentColor" stroke="none" fontSize="30" textAnchor="middle">HMW?</text>
        </svg>
      </div>
      {/* Sparkles */}
      <div className="absolute left-[70%] top-[31%] opacity-55">
        <svg width="70" height="50" viewBox="0 0 70 50" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M14 4 L17 16 L28 19 L17 22 L14 34 L11 22 L0 19 L11 16Z" />
          <path d="M52 20 L54 28 L62 30 L54 32 L52 40 L50 32 L42 30 L50 28Z" />
        </svg>
      </div>
      <div className="absolute left-[91%] top-[63%] opacity-50">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M15 2 L18 12 L28 15 L18 18 L15 28 L12 18 L2 15 L12 12Z" />
        </svg>
      </div>
      {/* Squiggle */}
      <div className="absolute left-[68%] top-[82%] opacity-50">
        <svg width="140" height="40" viewBox="0 0 140 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 20 C14 2 24 38 34 20 S54 2 64 20 S84 38 94 20 S114 2 124 20" />
        </svg>
      </div>
      {/* Paper clip */}
      <div className="absolute left-[19%] top-[82%] rotate-[-28deg] drop-shadow-[0_2px_2px_rgba(40,30,20,0.25)]">
        <svg width="30" height="64" viewBox="0 0 30 64" fill="none" stroke="#8E9196" strokeWidth="2.6" strokeLinecap="round">
          <path d="M12 54 V14 C12 4 26 4 26 14 V50 C26 62 6 62 6 50 V20" />
        </svg>
      </div>
      {/* Loose washi tape strips */}
      <div className="absolute left-[59%] top-[12%] h-6 w-24 rotate-[8deg] bg-[rgba(255,143,177,0.55)] [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.45)_0_6px,rgba(255,255,255,0)_6px_14px)] shadow-[0_1px_2px_rgba(0,0,0,0.08)]" />
      <div className="absolute left-[12%] top-[40%] h-[22px] w-20 rotate-[-12deg] bg-[rgba(124,200,255,0.5)] shadow-[0_1px_2px_rgba(0,0,0,0.08)]" />
      {/* Push pins */}
      <div className="absolute left-[46%] top-[17%] size-4 rounded-full bg-[#D2493A] [background-image:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0_2px,rgba(255,255,255,0)_3px)] shadow-[3px_4px_4px_rgba(40,30,20,0.3)]" />
      <div className="absolute left-[88%] top-[86%] size-4 rounded-full bg-[#2F6FDB] [background-image:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0_2px,rgba(255,255,255,0)_3px)] shadow-[3px_4px_4px_rgba(40,30,20,0.3)]" />
    </div>
  );
}

function CompactSet(): ReactElement {
  return (
    <div className="contents md:hidden">
      <div className="absolute left-[4%] top-[12%] origin-top-left rotate-[-4deg] scale-[0.7] opacity-60">
        <svg width="230" height="128" viewBox="0 0 230 128" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 54 C28 34 40 22 58 10 C74 26 88 38 110 54 C88 72 74 82 58 98 C40 82 26 70 6 54Z" />
          <path d="M118 54 C140 34 152 22 170 10 C186 26 200 40 222 54 C200 72 186 82 170 98 C152 82 138 70 118 54Z" />
          <text x="115" y="122" fill="currentColor" stroke="none" fontSize="17" textAnchor="middle">discover · define · develop · deliver</text>
        </svg>
      </div>
      <div className="absolute left-[76%] top-[15%] rotate-[8deg] scale-[0.75] opacity-60">
        <svg width="74" height="96" viewBox="-12 -12 84 104" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30 6 C14 6 6 18 6 30 C6 42 16 48 18 58 H42 C44 48 54 42 54 30 C54 18 46 6 30 6Z" />
          <path d="M20 65 H40 M22 72 H38 M26 79 H34" />
          <path d="M-6 10 L1 15 M66 10 L59 15 M30 -9 V-2" />
        </svg>
      </div>
      <div className="absolute left-[5%] top-[74%] origin-top-left rotate-[4deg] scale-[0.8] opacity-[0.62]">
        <svg width="130" height="70" viewBox="0 0 130 70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M14 36 C10 12 116 6 120 32 C124 58 18 64 10 40 C6 28 32 14 70 14" />
          <text x="64" y="44" fill="currentColor" stroke="none" fontSize="30" textAnchor="middle">HMW?</text>
        </svg>
      </div>
      <div className="absolute left-[82%] top-[64%] opacity-55">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M15 2 L18 12 L28 15 L18 18 L15 28 L12 18 L2 15 L12 12Z" />
        </svg>
      </div>
    </div>
  );
}

export default function WallDoodles(): ReactElement {
  return (
    <div aria-hidden="true" data-s="wall" className="absolute inset-0 font-hand font-bold text-[#5E5A53]">
      <DesktopSet />
      <CompactSet />
    </div>
  );
}
