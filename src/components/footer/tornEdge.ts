// Deterministic jagged top edge for the footer. Ported from design/canvas/Footer.dc.html.
import { rnd } from '../../utils/motion';

/** SVG path in a 100x100 box (stretch it with preserveAspectRatio="none"): ink below a ragged line. */
export function tornEdgePath(points: number): string {
  const coords: string[] = [];
  for (let i = 0; i <= points; i++) {
    coords.push(`${((i / points) * 100).toFixed(2)} ${(20 + rnd(i, 4) * 75).toFixed(1)}`);
  }
  return `M0 100 L${coords.join(' L')} L100 100 Z`;
}
