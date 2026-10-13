import { Html } from '@react-three/drei';
import { useEffect } from 'react';
import { deck } from '../content/deck';
import { AssetTag } from '../layouts/AssetTag';
import { VEHICLE_PARTS, VehicleModel } from '../models/Vehicle';
import { useSlide } from '../shell/contexts';
import { RESET_VIEW_EVENT } from '../shell/events';
import { ModelSource } from '../three/GlbModel';
import { ModelStage } from '../three/ModelStage';
import { SnapshotImage } from '../three/SnapshotImage';
import type { VisualProps } from './registry';
import './overview.css';

/**
 * Slide 02: the whole machine. Clicker steps outline its sensors, its
 * computing, then its actuators, naming each part on the vehicle.
 */
export default function VehicleOverview({ visual }: VisualProps<'vehicleOverview'>) {
  const { mode, slide, step } = useSlide();
  const active = visual.groups[step - 1]?.id ?? null;

  // Each step returns the camera to the front three-quarter view so the outlines are visible.
  useEffect(() => {
    if (mode === 'live' && step > 0) window.dispatchEvent(new CustomEvent(RESET_VIEW_EVENT));
  }, [mode, step]);

  return (
    <>
      {mode === 'thumb' ? (
        <SnapshotImage id={slide.id} style={{ inset: 0 }} />
      ) : (
        <ModelStage
          camera={{ position: [4.3, 2.4, 4.0], target: [0, 0.62, 0.05], fov: 30, minDistance: 2.5, maxDistance: 10 }}
          autoRotate={active === null}
          autoRotateSpeed={0.35}
          lighting="dark"
          shadow={{ y: 0.001, opacity: 0.65, scale: 6, blur: 2.2, far: 1.6 }}
          snapshotId={slide.id}
          viewCenterX={0.66}
          style={{ inset: 0 }}
        >
          <ModelSource
            glb={deck.vehicle.glb}
            transform={deck.vehicle.glbTransform}
            fallback={<VehicleModel highlight={active} />}
          />
          {active &&
            VEHICLE_PARTS[active].map((p) => (
              <Html key={p.name} position={[p.position[0], p.position[1] + p.size[1] / 2 + 0.06, p.position[2]]} center zIndexRange={[20, 5]}>
                <div className="part-chip">{p.name}</div>
              </Html>
            ))}
        </ModelStage>
      )}

      <ol className="overview-groups">
        {visual.groups.map((g, i) => (
          <li key={g.id} className={g.id === active ? 'is-active' : active ? 'is-dim' : ''}>
            <span className="og-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="og-label">{g.label}</span>
            {g.detail && <span className="og-detail">{g.detail}</span>}
          </li>
        ))}
      </ol>

      <AssetTag status={deck.vehicle.status} note={deck.vehicle.statusNote} style={{ right: 120, top: 72 }} />
    </>
  );
}
