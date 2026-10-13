import { ExtrudeGeometry, Path, Shape, type BufferGeometry } from 'three';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Rounded rectangle centred on the origin. */
export function roundedRect(w: number, h: number, r: number): Shape {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  const rr = Math.min(r, w / 2, h / 2);
  s.moveTo(x + rr, y);
  s.lineTo(x + w - rr, y);
  s.absarc(x + w - rr, y + rr, rr, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - rr);
  s.absarc(x + w - rr, y + h - rr, rr, 0, Math.PI / 2, false);
  s.lineTo(x + rr, y + h);
  s.absarc(x + rr, y + h - rr, rr, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + rr);
  s.absarc(x + rr, y + rr, rr, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** Stadium (rectangle with fully round ends). */
export const stadium = (w: number, h: number) => roundedRect(w, h, h / 2 - 0.001);

export interface ExtrudeOptions {
  bevel?: number;
  curveSegments?: number;
  /** Narrow the back: X scales to `backScale` at the rear face. */
  taper?: number;
  /** Normals smooth below this angle, crisp above (radians). */
  crease?: number;
}

/**
 * Extrude a shape along +Z, centred in depth, with a rounded edge bevel.
 * Total depth equals `depth` including the bevel.
 */
export function extrudeCentered(shape: Shape, depth: number, opts: ExtrudeOptions = {}): BufferGeometry {
  const { bevel = 0, curveSegments = 40, taper, crease = Math.PI / 5 } = opts;
  const g = new ExtrudeGeometry(shape, {
    depth: Math.max(0.001, depth - bevel * 2),
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 5,
    curveSegments,
  });
  g.translate(0, 0, -depth / 2 + bevel);
  if (taper !== undefined && taper !== 1) {
    const pos = g.attributes.position;
    const front = depth / 2;
    for (let i = 0; i < pos.count; i++) {
      const t = Math.min(1, Math.max(0, (front - pos.getZ(i)) / depth));
      pos.setX(i, pos.getX(i) * (1 + (taper - 1) * t));
    }
  }
  return toCreasedNormals(g, crease);
}

/** Rounded-rectangle frame: outer outline with a rounded-rectangle hole. */
export function roundedFrame(w: number, h: number, r: number, iw: number, ih: number, ir: number): Shape {
  const outer = roundedRect(w, h, r);
  outer.holes.push(roundedRect(iw, ih, ir));
  return outer;
}

/** Rounded plate with circular through-holes: [x, y, radius][]. */
export function plateWithHoles(w: number, h: number, r: number, holes: [number, number, number][]): Shape {
  const s = roundedRect(w, h, r);
  for (const [x, y, hr] of holes) {
    const p = new Path();
    p.absarc(x, y, hr, 0, Math.PI * 2, true);
    s.holes.push(p);
  }
  return s;
}
