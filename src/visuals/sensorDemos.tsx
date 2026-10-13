import { Html, Line, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import type { Line2 } from 'three-stdlib';
import { palette } from '../content/theme';
import type { SensorConfig, SensorId, Vec3 } from '../content/types';
import { HCSR04 } from '../models/HcSr04';
import { jetsonActivity } from '../models/JetsonOrin';

/**
 * Live values a demo publishes for the read-out panel drawn outside the 3D
 * canvas (plain DOM, so it stays put whatever the camera does).
 */
export interface DemoHud {
  /** IMU: acceleration and rotation rate, scaled to -1..1. */
  accel: number;
  rate: number;
  /** Ultrasonic: last measurement. */
  echoMm: number | null;
}

export const createHud = (): DemoHud => ({ accel: 0, rate: 0, echoMm: null });

export interface DemoProps {
  on: boolean;
  cfg: SensorConfig;
  hud: DemoHud;
  children: ReactNode;
}

const ORANGE = palette.orange;
const INK = palette.textOnLight;
const STEEL = palette.steelDark;

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

/** Fat line whose points are rewritten every frame. */
function useLiveLine() {
  const ref = useRef<Line2>(null);
  const set = (pts: number[], visible = true) => {
    const l = ref.current;
    if (!l) return;
    l.visible = visible && pts.length >= 6;
    if (!l.visible) return;
    l.geometry.setPositions(pts);
    l.computeLineDistances();
  };
  return [ref, set] as const;
}

const PLACEHOLDER_PTS: [number, number, number][] = [
  [0, 0, 0],
  [0, 0, 0.001],
];

function arcPoints(cx: number, cy: number, cz: number, r: number, centre: number, half: number, n = 40): number[] {
  const out: number[] = [];
  for (let i = 0; i <= n; i++) {
    const a = centre - half + (2 * half * i) / n;
    out.push(cx + Math.sin(a) * r, cy, cz + Math.cos(a) * r);
  }
  return out;
}

function Tag({ position, children, accent, boxed }: { position: Vec3; children: ReactNode; accent?: boolean; boxed?: boolean }) {
  return (
    <Html position={position} center zIndexRange={[20, 5]}>
      <div className={`scene-tag${accent ? ' is-accent' : ''}${boxed ? ' is-boxed' : ''}`}>{children}</div>
    </Html>
  );
}

/** Straight arrow made of a shaft and a cone, pointing along +X before rotation. */
function Arrow({ color, length = 1, radius = 0.035 }: { color: string; length?: number; radius?: number }) {
  const head = radius * 4;
  return (
    <group>
      <mesh position={[(length - head) / 2, 0, 0]} rotation-z={-Math.PI / 2}>
        <cylinderGeometry args={[radius, radius, Math.max(0.001, length - head), 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[length - head / 2, 0, 0]} rotation-z={-Math.PI / 2}>
        <coneGeometry args={[radius * 2.6, head, 20]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* ZED 2i: two viewpoints converge on one point                        */
/* ------------------------------------------------------------------ */

function StereoOverlay({ cfg }: { cfg: SensorConfig }) {
  const s = cfg.displayScale;
  const lensL = useMemo(() => new Vector3(-60 * s, 0, 17.4 * s), [s]);
  const lensR = useMemo(() => new Vector3(60 * s, 0, 17.4 * s), [s]);
  const floor = -15.125 * s;
  const target = useRef<Group>(null);
  const pole = useRef<Mesh>(null);
  const [lineL, setL] = useLiveLine();
  const [lineR, setR] = useLiveLine();
  const [arc, setArc] = useLiveLine();
  const [depth, setDepth] = useLiveLine();
  const [near, setNear] = useState(true);
  const [labelZ, setLabelZ] = useState(2);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const z = 1.75 + 1.2 * (1 - Math.cos(t * 0.6));
    target.current?.position.set(0, 0, z);
    if (pole.current) {
      pole.current.position.set(0, (floor - 0.0) / 2, z);
      pole.current.scale.set(1, Math.abs(floor), 1);
    }
    setL([lensL.x, lensL.y, lensL.z, 0, 0, z]);
    setR([lensR.x, lensR.y, lensR.z, 0, 0, z]);
    // Angle arc between the two sight lines, drawn at the target.
    // Both sight lines point back towards the camera (-Z); the arc spans the angle between them.
    const half = Math.atan2(lensR.x, z - lensR.z);
    setArc(arcPoints(0, 0, z, 0.42, Math.PI, half, 24));
    setDepth([0, floor + 0.002, lensL.z, 0, floor + 0.002, z]);
    const isNear = z < 2.95;
    if (isNear !== near) setNear(isNear);
    if (Math.abs(labelZ - z) > 0.05) setLabelZ(z);
  });

  return (
    <group>
      <Line ref={lineL} points={PLACEHOLDER_PTS} color={ORANGE} lineWidth={3} />
      <Line ref={lineR} points={PLACEHOLDER_PTS} color={ORANGE} lineWidth={3} />
      <Line ref={arc} points={PLACEHOLDER_PTS} color={INK} lineWidth={2} />
      <Line ref={depth} points={PLACEHOLDER_PTS} color={STEEL} lineWidth={2} dashed dashSize={0.08} gapSize={0.06} />
      <group ref={target}>
        <mesh>
          <sphereGeometry args={[0.14, 48, 24]} />
          <meshStandardMaterial color="#d9d4ca" roughness={0.6} />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.18, 0.012, 8, 64]} />
          <meshBasicMaterial color={ORANGE} />
        </mesh>
      </group>
      <mesh ref={pole}>
        <cylinderGeometry args={[0.006, 0.006, 1, 8]} />
        <meshBasicMaterial color={STEEL} />
      </mesh>
      <Tag position={[0, 0.42, labelZ]} accent boxed>
        {near ? 'Near · wide angle' : 'Far · narrow angle'}
      </Tag>
      <Tag position={[0.42, floor, (lensL.z + labelZ) / 2]}>Depth</Tag>
      <Tag position={[lensL.x - 0.45, 0, lensL.z + 0.35]}>Left view</Tag>
      <Tag position={[lensR.x + 0.5, 0, lensR.z + 0.35]}>Right view</Tag>
    </group>
  );
}

function StereoDemo({ on, cfg, children }: DemoProps) {
  return (
    <>
      {children}
      {on && <StereoOverlay cfg={cfg} />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Radar: pulses spread out, targets reflect, motion is labelled       */
/* ------------------------------------------------------------------ */

const RADAR_HALF = (32 * Math.PI) / 180;
const RADAR_RANGE = 4.2;

function RadarTarget({
  x,
  from,
  to,
  label,
  phase,
  apex,
  floor,
}: {
  x: number;
  from: number;
  to: number;
  label: string;
  phase: number;
  apex: Vector3;
  floor: number;
}) {
  const g = useRef<Group>(null);
  const mat = useRef<MeshStandardMaterial>(null);
  const [echo, setEcho] = useLiveLine();
  const arrow = useRef<Group>(null);
  const flash = useRef(0);
  const approaching = to < from;

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const period = 10;
    const p = ((t + phase) % period) / period;
    const z = from + (to - from) * p;
    const fade = Math.min(1, p * 8, (1 - p) * 8);
    g.current?.position.set(x, floor, z);
    g.current?.scale.setScalar(Math.max(0.001, fade));
    const dist = Math.hypot(x - apex.x, z - apex.z);
    // A pulse leaves every 1.4 s at 3.6 units/s; flash when it reaches the target.
    const r = ((t % 1.4) / 1.4) * 1.4 * 3.6;
    if (Math.abs(r - dist) < 0.09) flash.current = 1;
    flash.current = Math.max(0, flash.current - dt * 2.2);
    if (mat.current) mat.current.emissiveIntensity = flash.current * 0.9;
    setEcho([x, floor + 0.2, z, apex.x, apex.y, apex.z], flash.current > 0.05);
    if (echo.current) (echo.current.material as { opacity: number }).opacity = flash.current;
    if (arrow.current) arrow.current.position.set(x, floor + 0.01, z + (approaching ? -0.62 : 0.62));
  });

  return (
    <>
      <group ref={g}>
        <RoundedBox args={[0.6, 0.36, 0.9]} radius={0.06} position={[0, 0.18, 0]}>
          <meshStandardMaterial ref={mat} color="#c9c4ba" roughness={0.7} emissive={ORANGE} emissiveIntensity={0} />
        </RoundedBox>
        <Tag position={[0, 0.62, 0]} boxed>
          {label}
        </Tag>
      </group>
      <group ref={arrow} rotation-y={approaching ? Math.PI / 2 : -Math.PI / 2}>
        <Arrow color={ORANGE} length={0.5} radius={0.03} />
      </group>
      <Line ref={echo} points={PLACEHOLDER_PTS} color={ORANGE} lineWidth={2} dashed dashSize={0.1} gapSize={0.07} transparent />
    </>
  );
}

function RadarOverlay({ cfg }: { cfg: SensorConfig }) {
  const s = cfg.displayScale;
  const floor = (-38 - 5) * s;
  const apex = useMemo(() => new Vector3(0, 0, 14.2 * s), [s]);
  const [p1, setP1] = useLiveLine();
  const [p2, setP2] = useLiveLine();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    [setP1, setP2].forEach((set, i) => {
      const r = (((t + i * 0.7) % 1.4) / 1.4) * 1.4 * 3.6;
      set(arcPoints(apex.x, floor + 0.01, apex.z, r, 0, RADAR_HALF), r > 0.1 && r < RADAR_RANGE);
    });
  });

  const fanY = floor + 0.004;
  return (
    <group>
      <mesh position={[apex.x, fanY, apex.z]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[RADAR_RANGE, 64, -Math.PI / 2 - RADAR_HALF, RADAR_HALF * 2]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.08} side={DoubleSide} depthWrite={false} />
      </mesh>
      {[1, 2, 3].map((k) => (
        <Line
          key={k}
          points={chunk(arcPoints(apex.x, fanY, apex.z, (RADAR_RANGE * k) / 3, 0, RADAR_HALF))}
          color={STEEL}
          lineWidth={1.2}
          dashed={k < 3}
          dashSize={0.06}
          gapSize={0.06}
        />
      ))}
      {[-1, 1].map((side) => (
        <Line
          key={side}
          points={[
            [apex.x, fanY, apex.z],
            [apex.x + Math.sin(side * RADAR_HALF) * RADAR_RANGE, fanY, apex.z + Math.cos(RADAR_HALF) * RADAR_RANGE],
          ]}
          color={ORANGE}
          lineWidth={1.5}
        />
      ))}
      <Line ref={p1} points={PLACEHOLDER_PTS} color={ORANGE} lineWidth={3} />
      <Line ref={p2} points={PLACEHOLDER_PTS} color={ORANGE} lineWidth={3} />
      <RadarTarget x={-0.75} from={3.9} to={1.4} label="Approaching" phase={0} apex={apex} floor={floor} />
      <RadarTarget x={0.95} from={1.5} to={3.9} label="Moving away" phase={4} apex={apex} floor={floor} />
      <Tag position={[apex.x + Math.sin(RADAR_HALF) * RADAR_RANGE * 0.98 + 0.3, fanY, apex.z + RADAR_RANGE * 0.8]}>
        Field of view · representative
      </Tag>
    </group>
  );
}

function chunk(flat: number[]): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let i = 0; i < flat.length; i += 3) out.push([flat[i], flat[i + 1], flat[i + 2]]);
  return out;
}

function RadarDemo({ on, cfg, children }: DemoProps) {
  return (
    <>
      {children}
      {on && <RadarOverlay cfg={cfg} />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* GNSS: satellites, signals, one blocked by a building                */
/* ------------------------------------------------------------------ */

const SATS: { az: number; el: number; blocked?: boolean }[] = [
  { az: 25, el: 58 },
  { az: 105, el: 38 },
  { az: 205, el: 64 },
  { az: 320, el: 80 },
  { az: 150, el: 27, blocked: true },
];

function Satellite({ position, look }: { position: Vector3; look: Vector3 }) {
  const g = useRef<Group>(null);
  useEffect(() => {
    g.current?.lookAt(look);
  }, [look]);
  return (
    <group ref={g} position={position}>
      <mesh>
        <boxGeometry args={[0.14, 0.14, 0.2]} />
        <meshStandardMaterial color="#c9ccd0" metalness={0.8} roughness={0.35} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.27, 0, 0]}>
          <boxGeometry args={[0.36, 0.012, 0.13]} />
          <meshStandardMaterial color="#2a3550" metalness={0.4} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.13]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.03, 0.05, 0.06, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
      </mesh>
    </group>
  );
}

function SignalPulses({ from, to, offset }: { from: Vector3; to: Vector3; offset: number }) {
  const dots = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    dots.current.forEach((m, i) => {
      if (!m) return;
      const p = ((t * 0.55 + offset + i / 3) % 1 + 1) % 1;
      m.position.lerpVectors(from, to, p);
    });
  });
  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { dots.current[i] = m; }}>
          <sphereGeometry args={[0.028, 12, 8]} />
          <meshBasicMaterial color={ORANGE} />
        </mesh>
      ))}
    </>
  );
}

function GnssOverlay({ cfg }: { cfg: SensorConfig }) {
  const s = cfg.displayScale;
  const antenna = useMemo(() => new Vector3(-39 * s, 25.8 * s, 0), [s]);
  const R = 2.8;
  const sats = useMemo(
    () =>
      SATS.map((sat) => {
        const az = (sat.az * Math.PI) / 180;
        const el = (sat.el * Math.PI) / 180;
        const dir = new Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
        const pos = antenna.clone().add(dir.clone().multiplyScalar(R));
        // Blocked signals stop at the building's far face.
        const horiz = Math.cos(el) * R;
        const stop = sat.blocked ? antenna.clone().lerp(pos, 1.75 / horiz) : antenna;
        return { ...sat, dir, pos, stop };
      }),
    [antenna],
  );
  const blocked = sats.find((x) => x.blocked)!;
  const bAz = (blocked.az * Math.PI) / 180;
  const building = new Vector3(antenna.x + Math.sin(bAz) * 1.4, 0.9, antenna.z + Math.cos(bAz) * 1.4);

  return (
    <group>
      <mesh position={building}>
        <boxGeometry args={[0.7, 1.8, 0.7]} />
        <meshStandardMaterial color="#bdb7ad" roughness={0.85} />
      </mesh>
      {sats.map((sat, i) => (
        <group key={i}>
          <Satellite position={sat.pos} look={antenna} />
          <Line
            points={[sat.pos.toArray(), sat.stop.toArray()]}
            color={sat.blocked ? STEEL : ORANGE}
            lineWidth={1.4}
            dashed
            dashSize={0.07}
            gapSize={0.06}
            transparent
            opacity={sat.blocked ? 0.8 : 0.55}
          />
          <SignalPulses from={sat.pos} to={sat.stop} offset={i * 0.23} />
        </group>
      ))}
      <Tag position={[blocked.stop.x, blocked.stop.y + 0.28, blocked.stop.z]} boxed>
        Signal blocked
      </Tag>
      <Tag position={[antenna.x, antenna.y - 0.62, antenna.z + 0.6]} accent boxed>
        4 satellites in view · at least 4 needed
      </Tag>
    </group>
  );
}

function GnssDemo({ on, cfg, children }: DemoProps) {
  return (
    <>
      {children}
      {on && <GnssOverlay cfg={cfg} />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* IMU: the board moves; acceleration and rotation rate are shown      */
/* ------------------------------------------------------------------ */

// Arrow head at the end of the rotation arc (torus arc of 0.6π, radius 1.25, in the XZ plane).
const SPIN_HEAD = (() => {
  const end = 0.6 * Math.PI;
  const position = new Vector3(Math.cos(end) * 1.25, 0, Math.sin(end) * 1.25);
  const tangent = new Vector3(-Math.sin(end), 0, Math.cos(end));
  const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), tangent);
  return { position, quaternion };
})();

function ImuDemo({ on, hud, children }: DemoProps) {
  const rig = useRef<Group>(null);
  const accel = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const amount = useRef(0);

  useFrame(({ clock }, dt) => {
    amount.current = Math.min(1, Math.max(0, amount.current + (on ? dt : -dt) * 1.6));
    const k = amount.current;
    const t = clock.elapsedTime;
    const g = rig.current;
    if (!g) return;
    const x = 0.34 * Math.sin(0.9 * t);
    const a = -0.34 * 0.81 * Math.sin(0.9 * t); // second derivative of x
    const yaw = 0.42 * Math.sin(0.7 * t + 1);
    const w = 0.42 * 0.7 * Math.cos(0.7 * t + 1); // rate of yaw
    const roll = 0.2 * Math.sin(1.1 * t);
    g.position.set(x * k, 0.42 * k, 0);
    g.rotation.set(0, yaw * k, roll * k);

    if (accel.current) {
      const len = Math.abs(a) / 0.28;
      accel.current.visible = k > 0.5 && len > 0.06;
      accel.current.position.set(x * k, 0.42 * k + 0.55, 0);
      accel.current.rotation.set(0, a >= 0 ? 0 : Math.PI, 0);
      accel.current.scale.set(Math.max(0.05, len), 1, 1);
    }
    if (spin.current) {
      const mag = Math.abs(w) / 0.294;
      spin.current.visible = k > 0.5 && mag > 0.08;
      spin.current.position.set(x * k, 0.42 * k - 0.05, 0);
      spin.current.scale.set(w >= 0 ? 1 : -1, 1, 1);
      spin.current.rotation.set(0, yaw * k, 0);
    }
    hud.accel = (a / 0.28) * k;
    hud.rate = (w / 0.294) * k;
  });

  return (
    <>
      <group ref={rig}>{children}</group>
      {on && (
        <>
          <group ref={accel}>
            <Arrow color={ORANGE} length={0.9} radius={0.028} />
          </group>
          <group ref={spin}>
            <mesh rotation-x={Math.PI / 2}>
              <torusGeometry args={[1.25, 0.022, 8, 96, Math.PI * 0.6]} />
              <meshBasicMaterial color={INK} />
            </mesh>
            <mesh position={SPIN_HEAD.position} quaternion={SPIN_HEAD.quaternion}>
              <coneGeometry args={[0.07, 0.18, 16]} />
              <meshBasicMaterial color={INK} />
            </mesh>
          </group>
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Ultrasonic: pulse out, echo back, distance from round-trip time     */
/* ------------------------------------------------------------------ */

const SOUND_MM_PER_MS = 343; // ≈343 m/s in air at 20 °C
const WALL_SEQUENCE_MM = [100, 70, 50, 85, 120, 60];
const PULSE_UNITS_PER_S = 4.2;
const ARC_HALF = (15 * Math.PI) / 180;

function UltrasonicOverlay({ cfg, hud }: { cfg: SensorConfig; hud: DemoHud }) {
  const s = cfg.displayScale;
  const tx = useMemo(() => new Vector3(HCSR04.tx[0] * s, HCSR04.tx[1] * s, 12.8 * s), [s]);
  const rx = useMemo(() => new Vector3(HCSR04.rx[0] * s, HCSR04.rx[1] * s, 12.8 * s), [s]);
  const floor = -16.4 * s;
  const wall = useRef<Group>(null);
  const waves = [useLiveLine(), useLiveLine(), useLiveLine()];
  const [dim, setDim] = useLiveLine();
  const state = useRef({ cycle: -1, start: 0, from: WALL_SEQUENCE_MM[0], to: WALL_SEQUENCE_MM[0] });
  const [reading, setReading] = useState<{ mm: number; ms: number } | null>(null);
  const [wallZ, setWallZ] = useState(tx.z + WALL_SEQUENCE_MM[0] * s);
  const [phase, setPhase] = useState<'move' | 'out' | 'back' | 'hold'>('move');

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    const st = state.current;
    const MOVE = 0.9;
    const HOLD = 1.6;
    if (st.cycle < 0) {
      st.cycle = 0;
      st.start = now;
    }
    const mm = st.to;
    const D = mm * s;
    const travel = (2 * D) / PULSE_UNITS_PER_S;
    const tIn = now - st.start;
    if (tIn > MOVE + travel + HOLD) {
      st.cycle += 1;
      st.start = now;
      st.from = st.to;
      st.to = WALL_SEQUENCE_MM[st.cycle % WALL_SEQUENCE_MM.length];
      return;
    }
    const move = Math.min(1, tIn / MOVE);
    const e = move * move * (3 - 2 * move);
    const curMm = st.from + (st.to - st.from) * e;
    const zw = tx.z + curMm * s;
    wall.current?.position.set(0, floor, zw);
    if (Math.abs(zw - wallZ) > 0.01) setWallZ(zw);
    setDim([1.35, floor + 0.003, tx.z, 1.35, floor + 0.003, zw]);

    const tp = tIn - MOVE;
    const ph = tp < 0 ? 'move' : tp < travel / 2 ? 'out' : tp < travel ? 'back' : 'hold';
    if (ph !== phase) setPhase(ph);
    if (ph === 'hold' && (!reading || reading.mm !== mm)) {
      hud.echoMm = mm;
      setReading({ mm, ms: (2 * mm) / SOUND_MM_PER_MS });
    }

    waves.forEach(([, set], i) => {
      const r = tp * PULSE_UNITS_PER_S - i * 0.11;
      if (tp < 0 || r <= 0.02 || r >= 2 * D) return set([], false);
      if (r < D) {
        set(arcPoints(tx.x, tx.y, tx.z, r, 0, ARC_HALF));
      } else {
        // Echo: a wave from the mirror image of the transmitter behind the wall.
        set(arcPoints(tx.x, tx.y, tx.z + 2 * D, r, Math.PI, ARC_HALF));
      }
    });
  });

  return (
    <group>
      <group ref={wall}>
        <mesh position={[0, 0.6, 0.06]}>
          <boxGeometry args={[2.6, 1.2, 0.12]} />
          <meshStandardMaterial color="#cfcac0" roughness={0.85} />
        </mesh>
      </group>
      {waves.map(([ref], i) => (
        <Line key={i} ref={ref} points={PLACEHOLDER_PTS} color={ORANGE} lineWidth={3 - i * 0.6} />
      ))}
      <Line ref={dim} points={PLACEHOLDER_PTS} color={INK} lineWidth={1.6} />
      <Tag position={[1.35, floor + 0.18, (tx.z + wallZ) / 2]} boxed>
        {reading ? `${(reading.mm / 10).toFixed(1)} cm` : 'Distance'}
      </Tag>
      <Tag position={[tx.x, tx.y + 0.5, tx.z + 0.15]} accent={phase === 'out'}>
        T · pulse out
      </Tag>
      <Tag position={[rx.x, rx.y + 0.5, rx.z + 0.15]} accent={phase === 'back'}>
        R · echo in
      </Tag>
    </group>
  );
}

function UltrasonicDemo({ on, cfg, hud, children }: DemoProps) {
  return (
    <>
      {children}
      {on && <UltrasonicOverlay cfg={cfg} hud={hud} />}
    </>
  );
}


/* ------------------------------------------------------------------ */
/* Jetson: sensor data in through the ports, commands out              */
/* ------------------------------------------------------------------ */

interface Flow {
  label: string;
  from: Vec3;
  to: Vec3;
  /** true = data leaving the computer */
  out?: boolean;
}

function FlowLine({ flow, offset }: { flow: Flow; offset: number }) {
  const dots = useRef<(Mesh | null)[]>([]);
  const a = useMemo(() => new Vector3(...flow.from), [flow.from]);
  const b = useMemo(() => new Vector3(...flow.to), [flow.to]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    dots.current.forEach((m, i) => {
      if (!m) return;
      const p = (((t * 0.6 + offset + i / 3) % 1) + 1) % 1;
      // Inputs travel source → port; outputs travel port → destination.
      if (flow.out) m.position.lerpVectors(b, a, p);
      else m.position.lerpVectors(a, b, p);
    });
  });
  return (
    <group>
      <Line points={[flow.from, flow.to]} color={flow.out ? ORANGE : STEEL} lineWidth={2} dashed dashSize={0.06} gapSize={0.05} />
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { dots.current[i] = m; }}>
          <boxGeometry args={[0.045, 0.045, 0.045]} />
          <meshBasicMaterial color={ORANGE} />
        </mesh>
      ))}
      <Tag position={[flow.from[0], flow.from[1] + 0.16, flow.from[2]]} boxed accent={flow.out}>
        {flow.label}
      </Tag>
    </group>
  );
}

function JetsonOverlay({ cfg }: { cfg: SensorConfig }) {
  const s = cfg.displayScale;
  const port = (x: number, y: number, z: number): Vec3 => [x * s, y * s, z * s];
  const flows: Flow[] = useMemo(
    () => [
      { label: 'Stereo camera', from: [-0.35, 0.45, 2.0], to: port(-8, 9, 41) },
      { label: 'GNSS + IMU', from: [0.55, 0.55, 1.9], to: port(9, 9, 41) },
      { label: 'Radar (network)', from: [1.65, 0.35, 1.45], to: port(28, 7, 42) },
      { label: 'Camera (CSI)', from: [-1.95, 0.35, 0.3], to: port(-47.5, 3, -3) },
      { label: 'To microcontroller', from: [-0.1, 0.35, -1.85], to: port(-6, 8.5, -34.5), out: true },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [s],
  );
  useEffect(() => {
    jetsonActivity.level = 1;
    return () => {
      jetsonActivity.level = 0;
    };
  }, []);
  return (
    <group>
      {flows.map((f, i) => (
        <FlowLine key={f.label} flow={f} offset={i * 0.2} />
      ))}
      <Tag position={[-0.1, 0.62, 0.05]} accent>
        Processing
      </Tag>
    </group>
  );
}

function JetsonDemo({ on, cfg, children }: DemoProps) {
  return (
    <>
      {children}
      {on && <JetsonOverlay cfg={cfg} />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Read-out panels (DOM, outside the canvas)                           */
/* ------------------------------------------------------------------ */

function ImuReadout({ hud }: { hud: DemoHud }) {
  const a = useRef<HTMLDivElement>(null);
  const w = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (a.current) a.current.style.transform = `scaleX(${hud.accel})`;
      if (w.current) w.current.style.transform = `scaleX(${hud.rate})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hud]);
  return (
    <div className="demo-readout">
      <div className="imu-meter">
        <span className="readout-label">Acceleration</span>
        <div className="imu-meter-track is-accent">
          <div ref={a} className="imu-meter-fill" />
        </div>
      </div>
      <div className="imu-meter">
        <span className="readout-label">Angular velocity</span>
        <div className="imu-meter-track">
          <div ref={w} className="imu-meter-fill" />
        </div>
      </div>
    </div>
  );
}

function EchoReadout({ hud }: { hud: DemoHud }) {
  const [mm, setMm] = useState<number | null>(null);
  useEffect(() => {
    const id = window.setInterval(() => setMm(hud.echoMm), 100);
    return () => window.clearInterval(id);
  }, [hud]);
  return (
    <div className="demo-readout">
      <div className="echo-row">
        <span className="readout-label">Echo time</span>
        <strong>{mm === null ? '—' : `${((2 * mm) / SOUND_MM_PER_MS).toFixed(2)} ms`}</strong>
      </div>
      <div className="echo-row">
        <span className="readout-label">Distance</span>
        <strong>{mm === null ? '—' : `${(mm / 10).toFixed(1)} cm`}</strong>
      </div>
      <div className="echo-note">Distance = speed of sound × echo time ÷ 2</div>
    </div>
  );
}

/** Read-out shown beside the 3D view while a demo runs (only some sensors have one). */
export function DemoReadout({ sensor, hud }: { sensor: SensorId; hud: DemoHud }) {
  if (sensor === 'imu') return <ImuReadout hud={hud} />;
  if (sensor === 'ultrasonic') return <EchoReadout hud={hud} />;
  return null;
}

/** Camera used while each demo runs (becomes the reset view). */
export const demoViews: Record<SensorId, { position: Vec3; target: Vec3 }> = {
  zed2i: { position: [2.4, 4.6, 6.0], target: [0, 0, 1.6] },
  radar: { position: [-6.0, 4.8, -0.3], target: [0, -0.5, 1.95] },
  gnss: { position: [2.5, 2.7, 6.6], target: [0.15, 1.25, 0] },
  imu: { position: [2.5, 2.3, 4.0], target: [0, 0.2, 0] },
  ultrasonic: { position: [-4.0, 4.6, -5.0], target: [0.1, -0.3, 2.2] },
  jetson: { position: [3.1, 3.4, 3.9], target: [0, 0.15, 0.1] },
};

/** Per-sensor demonstration wrapped around the hardware model. */
export const sensorDemos: Record<SensorId, ComponentType<DemoProps>> = {
  zed2i: StereoDemo,
  radar: RadarDemo,
  gnss: GnssDemo,
  imu: ImuDemo,
  ultrasonic: UltrasonicDemo,
  jetson: JetsonDemo,
};
