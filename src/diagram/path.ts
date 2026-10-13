/** Polyline helpers for moving things along routes in SVG diagrams. */

export type Pt = [number, number];

export interface Route {
  points: Pt[];
  lengths: number[];
  total: number;
}

export function route(points: Pt[]): Route {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    lengths.push(lengths[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  return { points, lengths, total: lengths[lengths.length - 1] };
}

/** Point and heading (radians) at distance `s` along the route. */
export function at(r: Route, s: number): { x: number; y: number; angle: number } {
  const d = Math.min(r.total, Math.max(0, s));
  let i = 1;
  while (i < r.lengths.length - 1 && r.lengths[i] < d) i++;
  const [ax, ay] = r.points[i - 1];
  const [bx, by] = r.points[i];
  const seg = r.lengths[i] - r.lengths[i - 1] || 1;
  const t = (d - r.lengths[i - 1]) / seg;
  return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, angle: Math.atan2(by - ay, bx - ax) };
}

/** Sub-route from 0 to distance `s` (for drawing a trail). */
export function upTo(r: Route, s: number): Pt[] {
  const out: Pt[] = [r.points[0]];
  for (let i = 1; i < r.points.length; i++) {
    if (r.lengths[i] <= s) out.push(r.points[i]);
    else {
      const p = at(r, s);
      out.push([p.x, p.y]);
      break;
    }
  }
  return out;
}

export const toD = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

/** Sample a cubic Bézier into points. */
export function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, n = 24): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return out;
}

/** Sample a circular arc (angles in radians, SVG y-down). */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number, n = 48): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
}
