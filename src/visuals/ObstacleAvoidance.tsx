import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { DoubleSide, type Group } from 'three';
import { palette } from '../content/theme';
import { MiniRover } from '../models/MiniRover';
import { useSlide } from '../shell/contexts';
import { ModelStage } from '../three/ModelStage';
import { SnapshotImage } from '../three/SnapshotImage';
import { PhaseStrip } from './PhaseStrip';
import type { VisualProps } from './registry';
import './scenario.css';

/* Scenario geometry (scene units ≈ metres). The vehicle drives +Z. */
const LANE_RIGHT = -1.3;
const LANE_LEFT = 1.3;
const OBSTACLE_Z = 14;
const START_Z = -3;
const END_Z = 27;
const SPEED = 3.2;
const RADAR_RANGE = 9.5;
const RADAR_HALF = (17 * Math.PI) / 180;

const smooth = (a: number, b: number, v: number) => {
  const x = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const laneX = (z: number) => LANE_RIGHT + (LANE_LEFT - LANE_RIGHT) * (smooth(7.6, 11.6, z) - smooth(17, 21, z));
const yawAt = (z: number) => Math.atan2(laneX(z + 0.4) - laneX(z - 0.4), 0.8);

/** Where the vehicle is held for each explained phase (steps 1..4). */
const HOLD_Z = [5.2, 5.2, 5.2, 7.9];

/** Which phase a free-running position belongs to (for the strip in step 0). */
function phaseAtZ(z: number): number {
  if (z < 4.5) return -1;
  if (z < 6) return 0;
  if (z < 7) return 1;
  if (z < 7.6) return 2;
  if (z < 9.5) return 3;
  return 4;
}

function Tag({ position, children, tone = 'chip' }: { position: [number, number, number]; children: ReactNode; tone?: 'chip' | 'accent' | 'fault' }) {
  return (
    <Html position={position} center zIndexRange={[20, 5]}>
      <div className={`scene-chip is-${tone}`}>{children}</div>
    </Html>
  );
}

function Road() {
  const dashes = useMemo(() => {
    const out: number[] = [];
    for (let z = START_Z - 4; z < END_Z + 6; z += 3) out.push(z);
    return out;
  }, []);
  const length = END_Z - START_Z + 16;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, (START_Z + END_Z) / 2]}>
        <planeGeometry args={[5.6, length]} />
        <meshStandardMaterial color="#202226" roughness={0.95} />
      </mesh>
      {[-2.7, 2.7].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.004, (START_Z + END_Z) / 2]}>
          <planeGeometry args={[0.1, length]} />
          <meshBasicMaterial color="#8a9199" />
        </mesh>
      ))}
      {dashes.map((z) => (
        <mesh key={z} rotation-x={-Math.PI / 2} position={[0, 0.004, z]}>
          <planeGeometry args={[0.1, 1.4]} />
          <meshBasicMaterial color="#8a9199" />
        </mesh>
      ))}
    </group>
  );
}

/** Orange detection box drawn around the obstacle. */
function BoundingBox() {
  const w = 0.85;
  const h = 1.3;
  const c = [
    [-w, -w],
    [w, -w],
    [w, w],
    [-w, w],
  ];
  const segs: [number, number, number][][] = [];
  for (let i = 0; i < 4; i++) {
    const [ax, az] = c[i];
    const [bx, bz] = c[(i + 1) % 4];
    segs.push([[ax, 0.02, az], [bx, 0.02, bz]]);
    segs.push([[ax, h, az], [bx, h, bz]]);
    segs.push([[ax, 0.02, az], [ax, h, az]]);
  }
  return (
    <group>
      {segs.map((p, i) => (
        <Line key={i} points={p} color={palette.orange} lineWidth={2.5} />
      ))}
    </group>
  );
}

function Crate({ highlight }: { highlight: boolean }) {
  return (
    <group position={[LANE_RIGHT, 0, OBSTACLE_Z]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.4, 1.1, 1.4]} />
        <meshStandardMaterial color="#8d8a84" roughness={0.85} />
      </mesh>
      {highlight && <BoundingBox />}
    </group>
  );
}

function RadarCone({ strength }: { strength: number }) {
  return (
    <mesh position={[0, 0.03, 1.2]} rotation-x={-Math.PI / 2}>
      <circleGeometry args={[RADAR_RANGE, 48, -Math.PI / 2 - RADAR_HALF, RADAR_HALF * 2]} />
      <meshBasicMaterial color={palette.orange} transparent opacity={0.06 + strength * 0.22} side={DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Scene({ phase, live, onAutoPhase }: { phase: number; live: boolean; onAutoPhase: (p: number) => void }) {
  // phase: -1 = free run (step 0); 0..4 = explained phases (steps 1..5)
  const car = useRef<Group>(null);
  const zRef = useRef(START_Z);
  const [steer, setSteer] = useState(0);
  const [autoPhase, setAutoPhase] = useState(-1);
  const trailPts = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let z = 5.2; z <= 24; z += 0.4) pts.push([laneX(z), 0.05, z]);
    return pts;
  }, []);
  const [trail, setTrail] = useState<[number, number, number][]>(trailPts.slice(0, 2));

  useFrame((_, dt) => {
    let z = zRef.current;
    if (phase === -1) {
      z += dt * SPEED;
      if (z > END_Z) z = START_Z;
    } else if (phase === 4) {
      z += dt * SPEED * 0.8;
      if (z > 24 || z < 7.9) z = 7.9;
    } else {
      z += (HOLD_Z[phase] - z) * Math.min(1, dt * 4);
    }
    if (!live) z = phase === -1 ? 3 : phase === 4 ? 12 : HOLD_Z[phase];
    zRef.current = z;
    const g = car.current;
    if (g) {
      g.position.set(laneX(z), 0, z);
      g.rotation.y = yawAt(z);
    }
    const s = phase === 3 ? 0.42 : Math.max(-0.5, Math.min(0.5, (yawAt(z + 1.6) - yawAt(z)) * 2.4));
    if (Math.abs(s - steer) > 0.01) setSteer(s);
    if (phase === -1) {
      const p = phaseAtZ(z);
      if (p !== autoPhase) {
        setAutoPhase(p);
        onAutoPhase(p);
      }
    }
    if (phase === 4) {
      const n = Math.max(2, Math.round((z - 5.2) / 0.4));
      if (n !== trail.length) setTrail(trailPts.slice(0, n));
    }
  });

  const shown = phase === -1 ? autoPhase : phase;
  const understand = phase >= 1 && phase <= 3;
  const decide = phase >= 2 && phase <= 3;
  const stopPath = useMemo<[number, number, number][]>(
    () => [
      [LANE_RIGHT, 0.05, 6.4],
      [LANE_RIGHT, 0.05, 11.6],
    ],
    [],
  );
  const passPath = useMemo(() => trailPts.filter(([, , z]) => z >= 6.4 && z <= 23), [trailPts]);

  return (
    <>
      <Road />
      <Crate highlight={shown >= 0} />
      <group ref={car}>
        <MiniRover steer={steer} highlightSensors={shown === 0} />
        <RadarCone strength={shown === 0 ? 1 : phase === -1 ? 0.15 : 0.35} />
      </group>

      {/* Understand: what is blocked and what is free */}
      {understand && (
        <>
          <mesh rotation-x={-Math.PI / 2} position={[LANE_RIGHT, 0.012, OBSTACLE_Z]}>
            <planeGeometry args={[2.4, 4.2]} />
            <meshBasicMaterial color={palette.fault} transparent opacity={0.35} depthWrite={false} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position={[LANE_LEFT, 0.012, 13.5]}>
            <planeGeometry args={[2.4, 12]} />
            <meshBasicMaterial color={palette.orange} transparent opacity={0.13} depthWrite={false} />
          </mesh>
          <Tag position={[LANE_RIGHT, 1.9, OBSTACLE_Z]} tone="fault">
            Lane blocked
          </Tag>
          <Tag position={[LANE_LEFT + 0.2, 0.3, 17.5]}>Space on the left</Tag>
        </>
      )}

      {/* Decide: options considered */}
      {decide && (
        <>
          <Line points={stopPath} color={palette.steel} lineWidth={4} dashed dashSize={0.35} gapSize={0.25} />
          <Line points={passPath} color={palette.orange} lineWidth={5} />
          <Tag position={[LANE_RIGHT - 0.2, 0.35, 10.6]}>Option: stop</Tag>
          <Tag position={[LANE_LEFT + 0.6, 0.35, 11.8]} tone="accent">
            Chosen: pass on the left
          </Tag>
        </>
      )}

      {phase === 0 && (
        <Tag position={[LANE_RIGHT, 2.1, OBSTACLE_Z]} tone="accent">
          Object detected
        </Tag>
      )}

      {/* Move: the path actually driven */}
      {phase === 4 && <Line points={trail} color={palette.orange} lineWidth={5} />}
    </>
  );
}

/** Remounts the scene when switching between free run and held phases. */
function SceneSwitch(props: { phase: number; live: boolean; onAutoPhase: (p: number) => void }) {
  return <Scene key={props.phase === -1 ? 'run' : 'held'} {...props} />;
}

/**
 * Slide 24. Step 0 plays the whole manoeuvre. Each clicker step then holds
 * the scene at one phase and shows what that subsystem contributes.
 */
export default function ObstacleAvoidance({ visual }: VisualProps<'obstacleAvoidance'>) {
  const { mode, slide, step } = useSlide();
  const phase = step - 1; // -1 at step 0
  const [autoPhase, setAutoPhase] = useState(-1);
  const live = mode === 'live';

  return (
    <>
      {live ? (
        <ModelStage
          camera={{ position: [-8.4, 10.6, -4.2], target: [0.4, 0, 12.6], fov: 34, minDistance: 8, maxDistance: 34 }}
          autoRotate={false}
          lighting="dark"
          shadow={{ y: 0, opacity: 0.55, scale: 40, blur: 2, far: 3, live: true }}
          snapshotId={slide.id}
          viewCenterX={0.6}
          style={{ inset: 0 }}
        >
          <SceneSwitch phase={phase} live={live} onAutoPhase={setAutoPhase} />
        </ModelStage>
      ) : (
        <SnapshotImage id={slide.id} style={{ inset: 0 }} />
      )}

      <div className="scenario-fade" />

      {phase === 3 && live && (
        <div className="scenario-hud">
          <div className="hud-row">
            <span>Steering</span>
            <strong>Left</strong>
          </div>
          <div className="hud-row">
            <span>Speed</span>
            <strong>Reduced</strong>
          </div>
        </div>
      )}

      <PhaseStrip items={visual.phases} active={phase >= 0 ? phase : autoPhase} />
    </>
  );
}
