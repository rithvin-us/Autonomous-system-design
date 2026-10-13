import { useFrame } from '@react-three/fiber';
import { useRef, useState, type ReactNode } from 'react';
import type { Group } from 'three';
import { palette } from '../content/theme';
import { DroneDock, Humanoid, RoboTaxi, WarehouseAmrs } from '../models/TypesModels';
import { useSlide } from '../shell/contexts';
import { ModelStage } from '../three/ModelStage';
import { SnapshotImage } from '../three/SnapshotImage';
import type { VisualProps } from './registry';
import './types.css';

const base = import.meta.env.BASE_URL;
const CELL = 2.2;
const DISPLAY = 1.9; // largest dimension of each model on stage
const CANVAS = { left: 0, right: 0, top: 0, bottom: 268 } as const;

/** Model and its largest dimension (m), keyed by item id in slides.ts. */
const MODELS: Record<string, { size: number; render: (live: boolean) => ReactNode }> = {
  car: { size: 5.5, render: () => <RoboTaxi /> },
  amr: { size: 2.1, render: () => <WarehouseAmrs /> },
  drone: { size: 1.95, render: (live) => <DroneDock animate={live} /> },
  robot: { size: 2.25, render: () => <Humanoid /> },
};

function Turntable({ x, size, active, dim, children }: { x: number; size: number; active: boolean; dim: boolean; children: ReactNode }) {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    const t = g.current;
    if (!t) return;
    t.rotation.y += dt * (active ? 0.4 : 0.14);
    const s = (DISPLAY / size) * (dim ? 0.82 : 1);
    t.scale.setScalar(t.scale.x + (s - t.scale.x) * Math.min(1, dt * 5));
  });
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.003, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.0, 1.04, 96]} />
        <meshBasicMaterial color={active ? palette.orange : '#c8c2b7'} />
      </mesh>
      <group ref={g} rotation-y={0.65} scale={DISPLAY / size}>
        {children}
      </group>
    </group>
  );
}

function Photo({ src, focus, label }: { src: string; focus?: string; label: string }) {
  const [missing, setMissing] = useState(false);
  if (missing) return <div className="types-missing">public/{src}</div>;
  return (
    <img
      className="types-photo"
      src={`${base}${src}`}
      alt={label}
      style={{ objectPosition: focus ?? '50% 50%' }}
      onError={() => setMissing(true)}
      draggable={false}
    />
  );
}

/**
 * Slide 04: four kinds of autonomous machine as 3D study models built from
 * the reference photos, each photo shown beneath its model. Orange marks
 * sensors. Clicker steps spotlight one type at a time.
 */
export default function SystemTypes({ visual }: VisualProps<'systemTypes'>) {
  const { mode, slide, step } = useSlide();
  const active = step - 1;
  const mid = (visual.items.length - 1) / 2;
  const live = mode === 'live';

  return (
    <>
      {live ? (
        <ModelStage
          camera={{ position: [0, 2.0, 5.4], target: [0, 0.98, 0], fov: 22, minDistance: 4, maxDistance: 12 }}
          autoRotate={false}
          enableZoom={false}
          lighting="light"
          shadow={{ y: 0, opacity: 0.32, scale: 12, blur: 2.6, far: 2 }}
          snapshotId={slide.id}
          style={CANVAS}
        >
          <mesh position={[0, -0.03, 0]}>
            <boxGeometry args={[CELL * 4 + 0.4, 0.06, 2.2]} />
            <meshStandardMaterial color="#e6e1d8" roughness={0.9} />
          </mesh>
          {visual.items.map((it, i) => {
            const m = MODELS[it.id];
            if (!m) return null;
            return (
              <Turntable key={it.id} x={(i - mid) * CELL} size={m.size} active={i === active} dim={active >= 0 && i !== active}>
                {m.render(live)}
              </Turntable>
            );
          })}
        </ModelStage>
      ) : (
        <SnapshotImage id={slide.id} style={CANVAS} />
      )}

      <ol className="types-row">
        {visual.items.map((it, i) => (
          <li key={it.id} className={i === active ? 'is-active' : active >= 0 ? 'is-dim' : ''}>
            <div className="types-label">{it.label}</div>
            <div className="types-frame">
              <Photo src={it.image} focus={it.focus} label={it.label} />
            </div>
            {it.detail && <div className="types-note">{it.detail}</div>}
          </li>
        ))}
      </ol>
      <div className="types-shared">
        <span>{visual.shared}</span>
      </div>
    </>
  );
}
