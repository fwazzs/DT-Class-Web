import type { Phase } from '@/types';

// Full class names (not built from strings) so Tailwind can see them at build time.
export const PHASE_LABEL: Record<Phase, string> = {
  empathize: 'Empathize',
  define: 'Define',
  ideate: 'Ideate',
  prototype: 'Prototype',
  test: 'Test',
};

export const PHASE_BG: Record<Phase, string> = {
  empathize: 'bg-note-empathize',
  define: 'bg-note-define',
  ideate: 'bg-note-ideate',
  prototype: 'bg-note-prototype',
  test: 'bg-note-test',
};

export const PHASE_TINT_BG: Record<Phase, string> = {
  empathize: 'bg-tint-empathize',
  define: 'bg-tint-define',
  ideate: 'bg-tint-ideate',
  prototype: 'bg-tint-prototype',
  test: 'bg-tint-test',
};

/** Raw hex, for values written imperatively during animation. */
export const PHASE_HEX: Record<Phase, string> = {
  empathize: '#ffe45c',
  define: '#ff8fb1',
  ideate: '#7cc8ff',
  prototype: '#8ee07a',
  test: '#ffa552',
};

/** Text shown for missing content: the value, or a visible "[Label]" placeholder. */
export function orPlaceholder(value: string | null | undefined, label: string): string {
  return value && value.trim() ? value : `[${label}]`;
}
