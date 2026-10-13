import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { palette } from '../content/theme';
import { sensors } from '../content/sensors';
import type { SensorId } from '../content/types';
import { sensorModels } from '../models/sensorModels';
import { useSlide } from '../shell/contexts';
import { ModelSource } from '../three/GlbModel';
import { ModelStage } from '../three/ModelStage';
import { SnapshotImage } from '../three/SnapshotImage';
import type { VisualProps } from './registry';
import './lineup.css';

/** One display cell per sensor, side by side, never overlapping. */
const CELL = 2; // scene units between cell centres
const DISPLAY_SIZE = 1.55; // largest dimension of each model, scene units
const PLINTH_R = 0.84;

/** Canvas sits in the lower part of the slide, clear of the heading. */
const CANVAS = { left: 120, right: 120, top: 455, bottom: 210 } as const;

function Exhibit({ id, x, n, active, dim }: { id: SensorId; x: number; n: number; active: boolean; dim: boolean }) {
  const cfg = sensors[id];
  const { Model, floorY, size } = sensorModels[id];
  const scale = DISPLAY_SIZE / size;
  const turntable = useRef<Group>(null);
  const lift = useRef<Group>(null);

  useFrame((_, dt) => {
    if (turntable.current) turntable.current.rotation.y += dt * (active ? 0.45 : 0.16);
    if (lift.current) {
      const target = active ? 0.12 : 0;
      lift.current.position.y += (target - lift.current.position.y) * Math.min(1, dt * 5);
      const s = dim ? 0.86 : 1;
      lift.current.scale.setScalar(lift.current.scale.x + (s - lift.current.scale.x) * Math.min(1, dt * 5));
    }
  });

  return (
    <group position={[x, 0, 0]}>
      {/* Low display disc */}
      <mesh position={[0, -0.015, 0]}>
        <cylinderGeometry args={[PLINTH_R, PLINTH_R, 0.03, 72]} />
        <meshStandardMaterial color="#1e2023" roughness={0.7} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[PLINTH_R - 0.025, PLINTH_R, 96]} />
        <meshBasicMaterial color={active ? palette.orange : '#3a3e44'} />
      </mesh>
      <group ref={lift}>
        <group ref={turntable} rotation-y={0.6 + n * 0.4}>
          <group scale={scale} position={[0, -floorY * scale, 0]}>
            <ModelSource glb={cfg.glb} transform={cfg.glbTransform} fallback={<Model />} />
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * Slide 07: the five sensors side by side, each in its own cell.
 * Clicker steps spotlight one sensor at a time with what it measures.
 */
export default function SensorLineup({ visual }: VisualProps<'sensorLineup'>) {
  const { mode, slide, step } = useSlide();
  const active = step - 1; // -1 = all equal
  const mid = (visual.sensors.length - 1) / 2;

  return (
    <>
      {mode === 'thumb' ? (
        <SnapshotImage id={slide.id} style={CANVAS} />
      ) : (
        <ModelStage
          camera={{ position: [0, 2.05, 6.4], target: [0, 0.5, 0], fov: 21, minDistance: 4, maxDistance: 14 }}
          autoRotate={false}
          enableZoom={false}
          lighting="dark"
          shadow={{ y: -0.031, opacity: 0.55, scale: 12, blur: 2.4, far: 2 }}
          snapshotId={slide.id}
          style={CANVAS}
        >
          {visual.sensors.map((id, i) => (
            <Exhibit key={id} id={id} n={i} x={(i - mid) * CELL} active={i === active} dim={active >= 0 && i !== active} />
          ))}
        </ModelStage>
      )}

      <ol className="lineup-labels">
        {visual.sensors.map((id, i) => (
          <li key={id} className={i === active ? 'is-active' : active >= 0 ? 'is-dim' : ''}>
            <span className="lineup-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="lineup-name">{sensors[id].shortName}</span>
            <span className="lineup-measures">{sensors[id].measures}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
