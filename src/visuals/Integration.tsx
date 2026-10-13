import { Edges, Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, type ReactNode } from 'react';
import type { Group, Mesh } from 'three';
import { palette } from '../content/theme';
import { GnssModel } from '../models/GnssAntenna';
import { HcSr04Model } from '../models/HcSr04';
import { RadarPlaceholderModel } from '../models/RadarPlaceholder';
import { Zed2iModel } from '../models/Zed2i';
import { M } from '../three/materials';
import { useSlide } from '../shell/contexts';
import { ModelStage } from '../three/ModelStage';
import { SnapshotImage } from '../three/SnapshotImage';
import type { VisualProps } from './registry';
import './scenario.css';

const PLATE = { w: 3.6, d: 2.3, h: 0.06 };
const GAP_TIGHT = 0.42;
const GAP_EXPLODED = 1.05;

/** Contents of each layer, bottom (index 0) to top. */
function VehicleLayer() {
  return (
    <group>
      {[-1.25, 1.25].flatMap((x) =>
        [-0.95, 0.95].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -0.05, z]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
            <meshPhysicalMaterial {...M.rubber} />
          </mesh>
        )),
      )}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.16, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.14, 0.14, 0.42, 24]} />
          <meshPhysicalMaterial {...M.aluminium} />
        </mesh>
      ))}
      <mesh position={[1.25, 0.12, 0]}>
        <boxGeometry args={[0.12, 0.1, 1.6]} />
        <meshPhysicalMaterial {...M.steel} />
      </mesh>
    </group>
  );
}

function InterfacesLayer() {
  const cable = (z: number, y = 0.06) => (
    <Line
      key={z}
      points={[
        [-1.6, y, z],
        [-0.6, y, z * 0.6],
        [0.6, y, z * 0.6],
        [1.6, y, z],
      ]}
      color="#9ba1a8"
      lineWidth={3}
    />
  );
  return (
    <group>
      {[-0.7, -0.25, 0.25, 0.7].map((z) => cable(z))}
      {[-1.3, 0, 1.3].map((x) => (
        <mesh key={x} position={[x, 0.08, 0.9]}>
          <boxGeometry args={[0.3, 0.1, 0.16]} />
          <meshPhysicalMaterial {...M.plasticBlack} />
        </mesh>
      ))}
    </group>
  );
}

function ComputingLayer() {
  return (
    <group>
      <mesh position={[-0.45, 0.12, 0]}>
        <boxGeometry args={[1.3, 0.18, 1]} />
        <meshPhysicalMaterial {...M.anodisedDark} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-0.45 - 0.52 + i * 0.13, 0.27, 0]}>
          <boxGeometry args={[0.04, 0.12, 0.9]} />
          <meshPhysicalMaterial {...M.aluminium} />
        </mesh>
      ))}
      <mesh position={[0.95, 0.06, 0.2]}>
        <boxGeometry args={[0.7, 0.04, 0.5]} />
        <meshPhysicalMaterial {...M.pcbBlue} />
      </mesh>
      <mesh position={[0.95, 0.11, 0.2]}>
        <boxGeometry args={[0.18, 0.05, 0.18]} />
        <meshPhysicalMaterial {...M.epoxy} />
      </mesh>
    </group>
  );
}

function SoftwareLayer() {
  const nodes: [number, number][] = [
    [-1.2, -0.5],
    [-1.2, 0.5],
    [-0.2, 0],
    [0.7, -0.45],
    [0.7, 0.45],
    [1.4, 0],
  ];
  const links: [number, number][] = [
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 5],
  ];
  return (
    <group>
      {links.map(([a, b], i) => (
        <Line key={i} points={[[nodes[a][0], 0.12, nodes[a][1]], [nodes[b][0], 0.12, nodes[b][1]]]} color={palette.orange} lineWidth={2.5} />
      ))}
      {nodes.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.12, z]}>
          <boxGeometry args={[0.34, 0.16, 0.24]} />
          <meshStandardMaterial color="#e9e6e0" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function SensorsLayer() {
  return (
    <group>
      <group position={[1.1, 0.0, 0.55]} scale={0.0062} rotation-y={0.2}>
        <group position={[0, 15.2, 0]}>
          <Zed2iModel />
        </group>
      </group>
      <group position={[1.45, 0.0, -0.45]} scale={0.0062} rotation-y={0.3}>
        <group position={[0, 43, 0]}>
          <RadarPlaceholderModel />
        </group>
      </group>
      <group position={[-0.6, 0.0, 0]} scale={0.0075}>
        <GnssModel />
      </group>
      <group position={[0.2, 0.0, 0.85]} scale={0.016}>
        <group position={[0, 16.5, 0]}>
          <HcSr04Model />
        </group>
      </group>
    </group>
  );
}

const LAYERS: (() => ReactNode)[] = [VehicleLayer, InterfacesLayer, ComputingLayer, SoftwareLayer, SensorsLayer];

function Layer({ index, gap, label, labelsOn, linked, children }: { index: number; gap: { current: number }; label: string; labelsOn: boolean; linked: boolean; children: ReactNode }) {
  const g = useRef<Group>(null);
  const plate = useRef<Mesh>(null);
  useFrame(() => {
    if (g.current) g.current.position.y = index * gap.current;
  });
  return (
    <group ref={g}>
      <mesh ref={plate} position={[0, -PLATE.h / 2, 0]}>
        <boxGeometry args={[PLATE.w, PLATE.h, PLATE.d]} />
        <meshStandardMaterial color="#1c1e21" roughness={0.65} metalness={0.2} transparent opacity={0.92} />
        <Edges color={linked ? palette.orange : '#5c636b'} lineWidth={1.5} />
      </mesh>
      {children}
      {labelsOn && (
        <Html position={[-PLATE.w / 2 - 0.15, 0, PLATE.d / 2]} center zIndexRange={[20, 5]}>
          <div className="scene-chip" style={{ transform: 'translateX(-55%)' }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

/** Vertical orange links between layers once integrated, with a pulse running down them. */
function Links({ gap, count }: { gap: { current: number }; count: number }) {
  const pulse = useRef<Mesh>(null);
  const lines = useRef<Group>(null);
  useFrame(({ clock }) => {
    const top = (count - 1) * gap.current;
    if (lines.current) lines.current.scale.y = Math.max(0.001, top);
    if (pulse.current) {
      const p = (clock.elapsedTime * 0.45) % 1;
      pulse.current.position.y = top * (1 - p);
    }
  });
  const corners: [number, number][] = [
    [-PLATE.w / 2 + 0.15, -PLATE.d / 2 + 0.15],
    [PLATE.w / 2 - 0.15, -PLATE.d / 2 + 0.15],
    [-PLATE.w / 2 + 0.15, PLATE.d / 2 - 0.15],
    [PLATE.w / 2 - 0.15, PLATE.d / 2 - 0.15],
  ];
  return (
    <group>
      <group ref={lines}>
        {corners.map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.5, z]}>
            <boxGeometry args={[0.03, 1, 0.03]} />
            <meshBasicMaterial color={palette.orange} />
          </mesh>
        ))}
      </group>
      <mesh ref={pulse} position={[PLATE.w / 2 - 0.15, 0, PLATE.d / 2 - 0.15]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshBasicMaterial color={palette.orange} />
      </mesh>
    </group>
  );
}

function Stack({ labels, step }: { labels: string[]; step: number }) {
  const gap = useRef(GAP_TIGHT);
  const exploded = step === 1;
  useFrame((_, dt) => {
    const target = exploded ? GAP_EXPLODED : GAP_TIGHT;
    gap.current += (target - gap.current) * Math.min(1, dt * 3);
  });
  // Content lists layers top-down; draw bottom-up.
  const bottomUp = [...labels].reverse();
  return (
    <group position={[0, 0.35, 0]}>
      {LAYERS.map((Contents, i) => (
        <Layer key={i} index={i} gap={gap} label={bottomUp[i] ?? ''} labelsOn={exploded} linked={step === 2}>
          <Contents />
        </Layer>
      ))}
      {step === 2 && <Links gap={gap} count={LAYERS.length} />}
    </group>
  );
}

/**
 * Slide 20. Step 0: the vehicle's subsystems stacked as one unit.
 * Step 1: exploded, each layer named. Step 2: back together, with the
 * connections between layers lit and data running through them.
 */
export default function Integration({ visual }: VisualProps<'integration'>) {
  const { mode, slide, step } = useSlide();
  if (mode === 'thumb') return <SnapshotImage id={slide.id} style={{ inset: 0 }} />;
  return (
    <ModelStage
      camera={{ position: [8.8, 7.4, 10.2], target: [0, 2.3, 0], fov: 30, minDistance: 6, maxDistance: 22 }}
      autoRotateSpeed={0.45}
      lighting="dark"
      shadow={{ y: -0.05, opacity: 0.5, scale: 9, blur: 2.4, far: 3 }}
      snapshotId={slide.id}
      viewCenterX={0.67}
      style={{ inset: 0 }}
    >
      <Stack labels={visual.layers.map((l) => l.label)} step={step} />
    </ModelStage>
  );
}
