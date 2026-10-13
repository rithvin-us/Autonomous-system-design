import { useMemo, type ReactNode } from 'react';
import { ExtrudeGeometry, Quaternion, Vector3, type BufferGeometry, type Shape } from 'three';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Vec3 } from '../content/types';

const UP = new Vector3(0, 1, 0);

/**
 * Cylinder (optionally tapered, optionally capsule-ended) running from `a`
 * to `b`. Used for tubes, struts and limbs.
 */
export function Segment({
  a,
  b,
  r,
  r2 = r,
  capsule = false,
  children,
}: {
  a: Vec3;
  b: Vec3;
  r: number;
  r2?: number;
  capsule?: boolean;
  children: ReactNode;
}) {
  const { pos, quat, len } = useMemo(() => {
    const va = new Vector3(...a);
    const vb = new Vector3(...b);
    const dir = vb.clone().sub(va);
    return {
      len: dir.length(),
      pos: va.clone().add(vb).multiplyScalar(0.5),
      quat: new Quaternion().setFromUnitVectors(UP, dir.normalize()),
    };
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat}>
      {capsule ? (
        <capsuleGeometry args={[Math.max(r, r2), Math.max(0.001, len - Math.max(r, r2) * 2), 8, 20]} />
      ) : (
        <cylinderGeometry args={[r2, r, len, 24]} />
      )}
      {children}
    </mesh>
  );
}

/**
 * Extrude a side profile across Z (centred), then let `shape` reshape the
 * vertices (e.g. narrow the top for a car's tumblehome) before normals are
 * computed. Total depth includes the bevel.
 */
export function extrudeProfile(
  profile: Shape,
  depth: number,
  bevel: number,
  reshape?: (x: number, y: number, z: number) => Vec3,
  curveSegments = 32,
): BufferGeometry {
  const g = new ExtrudeGeometry(profile, {
    depth: Math.max(0.001, depth - bevel * 2),
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 6,
    curveSegments,
  });
  g.translate(0, 0, -depth / 2 + bevel);
  if (reshape) {
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const [x, y, z] = reshape(p.getX(i), p.getY(i), p.getZ(i));
      p.setXYZ(i, x, y, z);
    }
  }
  return toCreasedNormals(g, Math.PI / 4);
}
