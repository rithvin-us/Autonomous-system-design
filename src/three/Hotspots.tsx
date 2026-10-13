import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Group, Vector3 } from 'three';
import type { Hotspot } from '../content/types';
import { useStageApi } from './ModelStage';

const tmpPos = new Vector3();
const tmpNormal = new Vector3();
const tmpCam = new Vector3();

function Marker({
  spot,
  n,
  active,
}: {
  spot: Hotspot;
  n: number;
  active: boolean;
}) {
  const group = useRef<Group>(null);
  const el = useRef<HTMLDivElement>(null);
  const normal = useMemo(() => new Vector3(...spot.normal).normalize(), [spot.normal]);

  // Dim markers on the far side of the object so the eye reads what's visible.
  useFrame(({ camera }) => {
    const g = group.current;
    const d = el.current;
    if (!g || !d) return;
    g.getWorldPosition(tmpPos);
    tmpNormal.copy(normal).transformDirection(g.matrixWorld);
    tmpCam.copy(camera.position).sub(tmpPos).normalize();
    const facing = tmpNormal.dot(tmpCam) > 0.02;
    if (d.dataset.facing !== String(facing)) d.dataset.facing = String(facing);
  });

  return (
    <group ref={group} position={spot.position}>
      <Html center zIndexRange={[30, 10]}>
        <div ref={el} className={`hotspot${active ? ' is-active' : ''}`} data-facing="true">
          <div className="hotspot-dot" aria-hidden>
            {n}
          </div>
          {active && (
            <div className="hotspot-label">
              <strong>{spot.label}</strong>
              {spot.detail && <span>{spot.detail}</span>}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

/**
 * Numbered markers on the model; the active one shows its label.
 * Which marker is active is decided by the clicker step.
 */
export function Hotspots({ items, active }: { items: Hotspot[]; active: string | null }) {
  const api = useStageApi();

  useEffect(() => {
    api.hold('hotspot', active !== null);
    return () => api.hold('hotspot', false);
  }, [active, api]);

  return (
    <>
      {items.map((spot, i) => (
        <Marker key={spot.id} spot={spot} n={i + 1} active={active === spot.id} />
      ))}
    </>
  );
}
