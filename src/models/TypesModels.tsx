import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DoubleSide, Shape, type Group } from 'three';
import type { Vec3 } from '../content/types';
import { extrudeCentered } from '../three/geometry';
import { M } from '../three/materials';
import { extrudeProfile, Segment } from './kit';

/**
 * Study models for slide 04, built from the presenter's reference photos.
 * Generic forms only: no logos, brand marks or likenesses are reproduced.
 * Units: metres, standing on y = 0, facing +X. Orange marks sensors.
 */

const PAINT = { color: '#f1f2f3', metalness: 0.2, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.08 };
const WHITE = { color: '#eceeef', metalness: 0.1, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 };
const TRIM = { color: '#1a1c1f', metalness: 0.2, roughness: 0.55 };
const DARK = { color: '#2a2d31', metalness: 0.35, roughness: 0.42 };
const GLASS = { color: '#090b0e', metalness: 0.3, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.03 };
const SENSOR = { color: '#ff6a13', metalness: 0.1, roughness: 0.45 };
const CHROME = { color: '#d9dcdf', metalness: 1, roughness: 0.16 };
const JOINT = { color: '#3c4046', metalness: 0.8, roughness: 0.35 };
const smooth01 = (v: number) => Math.min(1, Math.max(0, v));

/* ================================================================== */
/* Robotaxi                                                            */
/* ================================================================== */

function TaxiWheel({ x, z }: { x: number; z: number }) {
  const side = Math.sign(z);
  return (
    <group position={[x, 0.37, z]}>
      {/* Tyre with rounded sidewalls */}
      <mesh>
        <torusGeometry args={[0.285, 0.088, 20, 64]} />
        <meshPhysicalMaterial {...M.rubber} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.36, 0.36, 0.2, 48, 1, true]} />
        <meshPhysicalMaterial {...M.rubber} side={DoubleSide} />
      </mesh>
      {/* Aero rim: dark disc, ten spokes, centre cap */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0, side * 0.06]}>
        <cylinderGeometry args={[0.25, 0.25, 0.04, 48]} />
        <meshPhysicalMaterial color="#121315" metalness={0.7} roughness={0.3} />
      </mesh>
      {Array.from({ length: 10 }, (_, k) => (
        <mesh key={k} position={[0, 0, side * 0.085]} rotation-z={(k * Math.PI) / 5}>
          <boxGeometry args={[0.03, 0.46, 0.015]} />
          <meshPhysicalMaterial color="#3a3d42" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}
      <mesh rotation-x={Math.PI / 2} position={[0, 0, side * 0.095]}>
        <cylinderGeometry args={[0.055, 0.055, 0.02, 24]} />
        <meshPhysicalMaterial {...CHROME} />
      </mesh>
      {/* Brake disc behind the spokes */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0, side * 0.02]}>
        <cylinderGeometry args={[0.19, 0.19, 0.02, 40]} />
        <meshPhysicalMaterial {...M.steel} roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Small perimeter lidar / camera pod. */
function SensorPod({ position, facing }: { position: Vec3; facing: number }) {
  return (
    <group position={position} rotation-y={facing}>
      <RoundedBox args={[0.2, 0.2, 0.18]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>
      <mesh position={[0.06, 0.0, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.075, 0.075, 0.1, 32]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      <mesh position={[0.111, 0, 0]} rotation-y={Math.PI / 2}>
        <torusGeometry args={[0.075, 0.008, 8, 40]} />
        <meshPhysicalMaterial {...SENSOR} />
      </mesh>
    </group>
  );
}

function RoofTower() {
  const lidar = useRef<Group>(null);
  useFrame((_, dt) => {
    if (lidar.current) lidar.current.rotation.y += dt * 4;
  });
  return (
    <group position={[-0.5, 1.53, 0]}>
      <RoundedBox args={[1.2, 0.08, 1.0]} radius={0.035} smoothness={4} position={[0, 0.04, 0]}>
        <meshPhysicalMaterial {...TRIM} />
      </RoundedBox>
      {/* Forward camera window along the front edge */}
      <mesh position={[0.58, 0.04, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.86]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      {/* Camera ring */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.27, 0.31, 0.2, 48]} />
        <meshPhysicalMaterial {...PAINT} />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.285, 0.29, 0.07, 48, 1, true]} />
        <meshPhysicalMaterial {...GLASS} side={DoubleSide} />
      </mesh>
      {/* Spinning lidar head */}
      <group position={[0, 0.38, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.22, 0.2, 48]} />
          <meshPhysicalMaterial {...GLASS} />
        </mesh>
        <group ref={lidar}>
          <mesh position={[0.205, 0, 0]}>
            <boxGeometry args={[0.01, 0.16, 0.05]} />
            <meshStandardMaterial color="#ff6a13" emissive="#ff6a13" emissiveIntensity={0.5} />
          </mesh>
        </group>
        <mesh position={[0, -0.11, 0]}>
          <torusGeometry args={[0.215, 0.012, 8, 56]} />
          <meshPhysicalMaterial {...SENSOR} />
        </mesh>
        <mesh position={[0, 0.1, 0]} scale={[1, 0.3, 1]}>
          <sphereGeometry args={[0.2, 40, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial {...TRIM} />
        </mesh>
      </group>
    </group>
  );
}

export function RoboTaxi() {
  const body = useMemo(() => {
    const s = new Shape();
    s.moveTo(2.2, 0.28);
    s.quadraticCurveTo(2.42, 0.3, 2.42, 0.52);
    s.lineTo(2.4, 0.66);
    s.quadraticCurveTo(2.38, 0.83, 2.16, 0.87);
    s.quadraticCurveTo(1.6, 0.97, 0.98, 1.0);
    s.lineTo(-1.9, 1.07);
    s.quadraticCurveTo(-2.28, 1.07, -2.35, 0.93);
    s.lineTo(-2.35, 0.55);
    s.quadraticCurveTo(-2.33, 0.3, -2.12, 0.28);
    s.lineTo(-1.94, 0.28);
    s.absarc(-1.45, 0.28, 0.49, Math.PI, 0, true);
    s.lineTo(0.96, 0.28);
    s.absarc(1.45, 0.28, 0.49, Math.PI, 0, true);
    s.closePath();
    // Slight tumblehome above the shoulder line.
    return extrudeProfile(s, 1.9, 0.15, (x, y, z) => [x, y, z * (1 - 0.05 * smooth01((y - 0.8) / 0.27))], 28);
  }, []);
  const cabin = useMemo(() => {
    const s = new Shape();
    s.moveTo(0.98, 1.0);
    s.quadraticCurveTo(0.62, 1.2, 0.14, 1.46);
    s.quadraticCurveTo(-0.5, 1.54, -1.25, 1.5);
    s.quadraticCurveTo(-1.95, 1.38, -2.14, 1.1);
    s.lineTo(-1.9, 1.07);
    s.closePath();
    return extrudeProfile(s, 1.74, 0.06, (x, y, z) => [x, y, z * (1 - 0.18 * smooth01((y - 1.0) / 0.5))], 24);
  }, []);
  const roof = useMemo(() => {
    const s = new Shape();
    s.moveTo(0.1, 1.462);
    s.quadraticCurveTo(-0.5, 1.548, -1.22, 1.512);
    s.lineTo(-1.22, 1.49);
    s.quadraticCurveTo(-0.5, 1.53, 0.1, 1.44);
    s.closePath();
    return extrudeCentered(s, 1.32, { bevel: 0.006, curveSegments: 24 });
  }, []);

  return (
    <group>
      <mesh geometry={body}>
        <meshPhysicalMaterial {...PAINT} />
      </mesh>
      <mesh geometry={cabin}>
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      <mesh geometry={roof}>
        <meshPhysicalMaterial {...PAINT} />
      </mesh>

      {/* Sill cladding, door seams and flush handles (both sides) */}
      {[-1, 1].map((sd) => (
        <group key={sd}>
          <mesh position={[0, 0.34, sd * 0.952]}>
            <boxGeometry args={[1.92, 0.1, 0.01]} />
            <meshPhysicalMaterial {...TRIM} />
          </mesh>
          {[0.78, -0.36, -1.32].map((x) => (
            <mesh key={x} position={[x, 0.68, sd * 0.953]}>
              <boxGeometry args={[0.008, 0.6, 0.004]} />
              <meshPhysicalMaterial {...TRIM} />
            </mesh>
          ))}
          {[0.25, -0.85].map((x) => (
            <mesh key={x} position={[x, 0.9, sd * 0.953]}>
              <boxGeometry args={[0.2, 0.025, 0.006]} />
              <meshPhysicalMaterial {...TRIM} />
            </mesh>
          ))}
          {/* Mirror with camera */}
          <group position={[0.88, 1.08, sd * 0.98]}>
            <RoundedBox args={[0.2, 0.11, 0.16]} radius={0.04} smoothness={3}>
              <meshPhysicalMaterial {...PAINT} />
            </RoundedBox>
            <mesh position={[0.02, -0.06, sd * 0.03]}>
              <sphereGeometry args={[0.02, 12, 10]} />
              <meshPhysicalMaterial {...SENSOR} />
            </mesh>
          </group>
          {/* Headlight blade */}
          <mesh position={[2.26, 0.79, sd * 0.62]} rotation-y={sd * -0.35}>
            <boxGeometry args={[0.16, 0.045, 0.32]} />
            <meshStandardMaterial color="#ffffff" emissive="#dfe8ff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Grille, lower intake, tail light bar */}
      <RoundedBox args={[0.05, 0.22, 0.86]} radius={0.02} position={[2.405, 0.58, 0]}>
        <meshPhysicalMaterial {...TRIM} />
      </RoundedBox>
      <mesh position={[2.405, 0.36, 0]}>
        <boxGeometry args={[0.04, 0.08, 1.3]} />
        <meshPhysicalMaterial {...TRIM} />
      </mesh>
      <mesh position={[-2.352, 0.93, 0]}>
        <boxGeometry args={[0.012, 0.035, 1.5]} />
        <meshStandardMaterial color="#c81e1e" emissive="#e02a2a" emissiveIntensity={0.7} />
      </mesh>

      <RoofTower />
      <SensorPod position={[1.62, 1.05, 0.88]} facing={-0.6} />
      <SensorPod position={[1.62, 1.05, -0.88]} facing={0.6} />
      <SensorPod position={[-2.02, 1.08, 0.86]} facing={-2.5} />
      <SensorPod position={[-2.02, 1.08, -0.86]} facing={2.5} />
      {/* Bumper radar */}
      <mesh position={[2.43, 0.5, 0]}>
        <boxGeometry args={[0.01, 0.08, 0.14]} />
        <meshPhysicalMaterial {...SENSOR} />
      </mesh>

      <TaxiWheel x={1.45} z={0.82} />
      <TaxiWheel x={1.45} z={-0.82} />
      <TaxiWheel x={-1.45} z={0.82} />
      <TaxiWheel x={-1.45} z={-0.82} />
    </group>
  );
}

/* ================================================================== */
/* Warehouse AMRs                                                      */
/* ================================================================== */

function octo(l: number, w: number, c: number): [number, number][] {
  return [
    [l / 2, w / 2 - c],
    [l / 2 - c, w / 2],
    [-l / 2 + c, w / 2],
    [-l / 2, w / 2 - c],
    [-l / 2, -w / 2 + c],
    [-l / 2 + c, -w / 2],
    [l / 2 - c, -w / 2],
    [l / 2, -w / 2 + c],
  ];
}

function OctoBand({ l, w, c, y0, y1, mat, bevel = 0 }: { l: number; w: number; c: number; y0: number; y1: number; mat: object; bevel?: number }) {
  const geo = useMemo(() => {
    const pts = octo(l, w, c);
    const s = new Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([x, y]) => s.lineTo(x, y));
    s.closePath();
    return extrudeCentered(s, y1 - y0, { bevel, crease: 0.5 });
  }, [l, w, c, y0, y1, bevel]);
  return (
    <mesh geometry={geo} rotation-x={-Math.PI / 2} position={[0, (y0 + y1) / 2, 0]}>
      <meshPhysicalMaterial {...mat} />
    </mesh>
  );
}

function LargeAmr() {
  const L = 1.35;
  const W = 0.85;
  const C = 0.22;
  return (
    <group>
      {/* Hidden drive wheels and casters */}
      {[-0.5, 0.5].flatMap((x) =>
        [-0.3, 0.3].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.05, z]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.05, 0.05, 0.05, 20]} />
            <meshPhysicalMaterial {...M.rubber} />
          </mesh>
        )),
      )}
      {/* Rubber bumper skirt */}
      <OctoBand l={L + 0.02} w={W + 0.02} c={C} y0={0.04} y1={0.12} mat={TRIM} bevel={0.01} />
      <OctoBand l={L} w={W} c={C} y0={0.12} y1={0.33} mat={WHITE} bevel={0.006} />
      {/* Dark sensor band with safety-scanner windows */}
      <OctoBand l={L - 0.01} w={W - 0.01} c={C} y0={0.33} y1={0.47} mat={GLASS} />
      <OctoBand l={L + 0.004} w={W + 0.004} c={C} y0={0.47} y1={0.515} mat={{ color: '#8c9097', metalness: 0.4, roughness: 0.35 }} />
      <OctoBand l={L} w={W} c={C} y0={0.515} y1={0.82} mat={WHITE} bevel={0.006} />
      {/* Scanner windows on two diagonal corners */}
      {[
        [L / 2 - C / 2, W / 2 - C / 2, -Math.PI / 4],
        [-L / 2 + C / 2, -W / 2 + C / 2, (3 * Math.PI) / 4],
      ].map(([x, z, r], i) => (
        <mesh key={i} position={[x * 1.005, 0.2, z * 1.005]} rotation-y={r}>
          <boxGeometry args={[0.012, 0.07, 0.26]} />
          <meshPhysicalMaterial {...SENSOR} />
        </mesh>
      ))}
      {/* Front stereo camera pair in the dark band */}
      {[-0.06, 0.06].map((z) => (
        <mesh key={z} position={[L / 2 + 0.002, 0.4, z]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.022, 0.022, 0.012, 20]} />
          <meshPhysicalMaterial {...SENSOR} />
        </mesh>
      ))}
      {/* Panel seams */}
      {[-0.3, 0.3].flatMap((x) =>
        [-1, 1].map((sd) => (
          <mesh key={`${x}${sd}`} position={[x, 0.67, sd * (W / 2 + 0.002)]}>
            <boxGeometry args={[0.006, 0.28, 0.004]} />
            <meshPhysicalMaterial {...TRIM} />
          </mesh>
        )),
      )}
      {/* Lift deck with raised ends and grip ribs */}
      <OctoBand l={L - 0.1} w={W - 0.08} c={0.18} y0={0.82} y1={0.9} mat={{ color: '#22357a', metalness: 0.3, roughness: 0.38 }} bevel={0.008} />
      {[-1, 1].map((sd) => (
        <RoundedBox key={sd} args={[0.14, 0.16, W - 0.12]} radius={0.02} position={[sd * (L / 2 - 0.13), 0.97, 0]}>
          <meshPhysicalMaterial color="#22357a" metalness={0.3} roughness={0.38} />
        </RoundedBox>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-0.35 + i * 0.14, 0.905, 0]}>
          <boxGeometry args={[0.03, 0.012, W - 0.2]} />
          <meshPhysicalMaterial color="#1a2a62" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.94, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.014, 0.014, L - 0.36, 12]} />
        <meshPhysicalMaterial {...M.steel} />
      </mesh>
      {/* Emergency stop on a yellow collar */}
      <group position={[0.47, 0.9, 0.2]}>
        <mesh position={[0, 0.012, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 24]} />
          <meshStandardMaterial color="#f2c230" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.034, 0.03, 0.05, 24]} />
          <meshStandardMaterial color="#d8261c" roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

function SmallAmr() {
  return (
    <group>
      {[-0.18, 0.18].flatMap((x) =>
        [-0.17, 0.17].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.035, z]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
            <meshPhysicalMaterial {...M.rubber} />
          </mesh>
        )),
      )}
      <RoundedBox args={[0.62, 0.06, 0.46]} radius={0.025} position={[0, 0.07, 0]}>
        <meshPhysicalMaterial {...TRIM} />
      </RoundedBox>
      <RoundedBox args={[0.62, 0.2, 0.46]} radius={0.07} smoothness={5} position={[0, 0.2, 0]}>
        <meshPhysicalMaterial {...WHITE} />
      </RoundedBox>
      {/* Scanner slit and front camera */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.625, 0.025, 0.465]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      {[-0.04, 0.04].map((z) => (
        <mesh key={z} position={[0.312, 0.21, z]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.014, 0.014, 0.008, 16]} />
          <meshPhysicalMaterial {...SENSOR} />
        </mesh>
      ))}
      <RoundedBox args={[0.56, 0.04, 0.4]} radius={0.015} position={[0, 0.315, 0]}>
        <meshPhysicalMaterial {...WHITE} />
      </RoundedBox>
      {[-0.14, 0.14].map((z) => (
        <group key={z} position={[0.2, 0.34, z]}>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.005, 0.006, 0.18, 8]} />
            <meshPhysicalMaterial {...TRIM} />
          </mesh>
          <mesh position={[0, 0.005, 0]}>
            <cylinderGeometry args={[0.014, 0.016, 0.012, 12]} />
            <meshPhysicalMaterial {...TRIM} />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[0.27, 0.2, sd * 0.232]}>
          <boxGeometry args={[0.06, 0.025, 0.004]} />
          <meshStandardMaterial color="#d8261c" emissive="#ff3b2e" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function WarehouseAmrs() {
  return (
    <group>
      <group position={[-0.25, 0, -0.25]}>
        <LargeAmr />
      </group>
      <group position={[0.78, 0, 0.58]} rotation-y={0.15}>
        <SmallAmr />
      </group>
    </group>
  );
}

/* ================================================================== */
/* Drone and docking station                                           */
/* ================================================================== */

function Propeller({ spin }: { spin: number }) {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * spin;
  });
  return (
    <group ref={g}>
      {[0, Math.PI].map((a) => (
        <mesh key={a} rotation-y={a} position={[Math.cos(a) * 0.085, 0, -Math.sin(a) * 0.085]}>
          <boxGeometry args={[0.17, 0.004, 0.026]} />
          <meshPhysicalMaterial color="#cfd2d6" metalness={0.2} roughness={0.45} />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.175, 48]} />
        <meshStandardMaterial color="#aab0b6" transparent opacity={0.16} side={DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Quadcopter({ animate }: { animate: boolean }) {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (animate && g.current) g.current.position.y = 1.14 + Math.sin(clock.elapsedTime * 1.3) * 0.03;
  });
  const shell = { color: '#6b7076', metalness: 0.35, roughness: 0.4, clearcoat: 0.4 };
  const arms = [38, 142, 218, 322].map((d) => (d * Math.PI) / 180);
  return (
    <group ref={g} position={[0, 1.14, 0]}>
      {/* Fuselage */}
      <mesh scale={[1.55, 0.5, 1]}>
        <sphereGeometry args={[0.12, 40, 24]} />
        <meshPhysicalMaterial {...shell} />
      </mesh>
      <RoundedBox args={[0.16, 0.05, 0.12]} radius={0.02} position={[-0.04, 0.06, 0]}>
        <meshPhysicalMaterial color="#555a60" metalness={0.35} roughness={0.4} />
      </RoundedBox>
      {/* Obstacle-sensing camera pairs (front and top) */}
      {[-0.035, 0.035].map((z) => (
        <mesh key={z} position={[0.18, 0.012, z]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.011, 0.011, 0.01, 14]} />
          <meshPhysicalMaterial {...SENSOR} />
        </mesh>
      ))}
      {/* Arms, motors, propellers, landing legs */}
      {arms.map((a, i) => {
        const tip: Vec3 = [Math.cos(a) * 0.36, 0.045, Math.sin(a) * 0.36];
        return (
          <group key={i}>
            <Segment a={[Math.cos(a) * 0.1, 0, Math.sin(a) * 0.08]} b={tip} r={0.018} r2={0.014}>
              <meshPhysicalMaterial {...shell} />
            </Segment>
            <mesh position={[tip[0], tip[1] + 0.02, tip[2]]}>
              <cylinderGeometry args={[0.026, 0.03, 0.04, 20]} />
              <meshPhysicalMaterial {...DARK} />
            </mesh>
            <mesh position={[tip[0], tip[1] + 0.045, tip[2]]}>
              <cylinderGeometry args={[0.022, 0.026, 0.012, 20]} />
              <meshPhysicalMaterial {...M.aluminium} />
            </mesh>
            <group position={[tip[0], tip[1] + 0.058, tip[2]]}>
              <Propeller spin={i % 2 ? 18 : -18} />
            </group>
            {i % 2 === 0 && (
              <Segment a={[tip[0] * 0.7, 0, tip[2] * 0.7]} b={[tip[0] * 0.72, -0.13, tip[2] * 0.72]} r={0.006}>
                <meshPhysicalMaterial {...DARK} />
              </Segment>
            )}
          </group>
        );
      })}
      {/* Gimbal and camera */}
      <group position={[0.15, -0.07, 0]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.04, 12]} />
          <meshPhysicalMaterial {...DARK} />
        </mesh>
        <RoundedBox args={[0.08, 0.07, 0.1]} radius={0.02}>
          <meshPhysicalMaterial color="#202326" metalness={0.4} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0.045, 0, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.028, 0.028, 0.015, 24]} />
          <meshPhysicalMaterial {...GLASS} />
        </mesh>
        <mesh position={[0.053, 0, 0]} rotation-y={Math.PI / 2}>
          <torusGeometry args={[0.028, 0.004, 8, 28]} />
          <meshPhysicalMaterial {...SENSOR} />
        </mesh>
      </group>
    </group>
  );
}

function Anemometer() {
  const cups = useRef<Group>(null);
  useFrame((_, dt) => {
    if (cups.current) cups.current.rotation.y += dt * 2.5;
  });
  return (
    <group position={[0.18, 0.44, 1.02]}>
      <Segment a={[0, 0, 0]} b={[0, 0.3, 0]} r={0.008}>
        <meshPhysicalMaterial {...M.steel} />
      </Segment>
      <group ref={cups} position={[0, 0.3, 0]}>
        {[0, 2.09, 4.19].map((a) => (
          <group key={a} rotation-y={a}>
            <mesh position={[0.03, 0, 0]}>
              <boxGeometry args={[0.06, 0.004, 0.004]} />
              <meshPhysicalMaterial {...M.steel} />
            </mesh>
            <mesh position={[0.065, 0, 0]} rotation-z={Math.PI / 2}>
              <sphereGeometry args={[0.016, 12, 8, 0, Math.PI]} />
              <meshPhysicalMaterial {...M.steel} side={DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Dock() {
  const BODY = { color: '#dfe1e3', metalness: 0.25, roughness: 0.38, clearcoat: 0.3 };
  return (
    <group>
      {/* Feet */}
      {[-0.28, 0.28].flatMap((x) =>
        [-0.24, 0.24].map((z) => (
          <RoundedBox key={`${x}${z}`} args={[0.12, 0.06, 0.12]} radius={0.01} position={[x, 0.03, z]}>
            <meshPhysicalMaterial {...TRIM} />
          </RoundedBox>
        )),
      )}
      {/* Cabinet */}
      <RoundedBox args={[0.7, 0.44, 0.62]} radius={0.03} smoothness={4} position={[0, 0.28, 0]}>
        <meshPhysicalMaterial {...BODY} />
      </RoundedBox>
      {/* Side vents */}
      {[-1, 1].map((sd) =>
        Array.from({ length: 6 }, (_, i) => (
          <mesh key={`${sd}${i}`} position={[-0.12 + i * 0.05, 0.3, sd * 0.312]}>
            <boxGeometry args={[0.02, 0.16, 0.006]} />
            <meshPhysicalMaterial {...TRIM} />
          </mesh>
        )),
      )}
      {/* Front service panel: viewing window, e-stop, connectors with cables */}
      <group position={[0.352, 0.28, 0]}>
        <RoundedBox args={[0.01, 0.3, 0.52]} radius={0.004}>
          <meshPhysicalMaterial color="#c9ccd0" metalness={0.4} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0.007, 0.0, 0.11]}>
          <boxGeometry args={[0.004, 0.22, 0.22]} />
          <meshPhysicalMaterial {...GLASS} />
        </mesh>
        <mesh position={[0.008, 0.08, -0.16]}>
          <boxGeometry args={[0.004, 0.08, 0.08]} />
          <meshStandardMaterial color="#f2c230" roughness={0.5} />
        </mesh>
        <mesh position={[0.022, 0.08, -0.16]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.026, 0.03, 0.03, 24]} />
          <meshStandardMaterial color="#d8261c" roughness={0.35} />
        </mesh>
        {[-0.22, -0.15, -0.08].map((z) => (
          <group key={z}>
            <mesh position={[0.012, -0.06, z]} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
              <meshPhysicalMaterial {...DARK} />
            </mesh>
            <Segment a={[0.02, -0.07, z]} b={[0.06, -0.26, z + 0.02]} r={0.007}>
              <meshPhysicalMaterial {...M.rubber} />
            </Segment>
          </group>
        ))}
      </group>
      {/* Landing pad on the closed top */}
      <RoundedBox args={[0.68, 0.06, 0.6]} radius={0.025} position={[0, 0.53, 0]}>
        <meshPhysicalMaterial color="#2c2f33" metalness={0.3} roughness={0.55} />
      </RoundedBox>
      <mesh position={[0, 0.561, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.16, 0.18, 48]} />
        <meshBasicMaterial color="#e9ebed" />
      </mesh>
      <mesh position={[0, 0.561, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.04, 24]} />
        <meshBasicMaterial color="#ff6a13" />
      </mesh>
      {/* Clamshell covers, opened flat to either side */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[0, 0.3, sd * 0.64]}>
          <RoundedBox args={[0.66, 0.24, 0.62]} radius={0.08} smoothness={5}>
            <meshPhysicalMaterial {...BODY} color="#eef0f1" />
          </RoundedBox>
          <mesh position={[0, 0.121, -sd * 0.03]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[0.56, 0.48]} />
            <meshPhysicalMaterial color="#3a3d42" roughness={0.6} />
          </mesh>
          {/* Hinge */}
          <mesh position={[0, 0.1, -sd * 0.31]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.018, 0.018, 0.62, 12]} />
            <meshPhysicalMaterial {...M.steel} />
          </mesh>
        </group>
      ))}
      {/* RTK GNSS puck */}
      <mesh position={[0.25, 0.575, 0.22]} scale={[1, 0.4, 1]}>
        <sphereGeometry args={[0.045, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...SENSOR} />
      </mesh>
      <Anemometer />
    </group>
  );
}

export function DroneDock({ animate = true }: { animate?: boolean }) {
  return (
    <group>
      <Dock />
      <Quadcopter animate={animate} />
    </group>
  );
}

/* ================================================================== */
/* Humanoid robot (silver android)                                     */
/* ================================================================== */

function Joint({ at, r }: { at: Vec3; r: number }) {
  return (
    <mesh position={at}>
      <sphereGeometry args={[r, 24, 16]} />
      <meshPhysicalMaterial {...JOINT} />
    </mesh>
  );
}

function Arm({ side, bent }: { side: number; bent: boolean }) {
  const shoulder: Vec3 = [0, 1.43, side * 0.3];
  const elbow: Vec3 = [0.02, 1.16, side * 0.33];
  const wrist: Vec3 = bent ? [0.2, 1.02, side * 0.3] : [0.06, 0.9, side * 0.32];
  return (
    <group>
      <mesh position={[0, 1.47, side * 0.29]} scale={[1, 0.75, 1]}>
        <sphereGeometry args={[0.105, 32, 20]} />
        <meshPhysicalMaterial {...CHROME} />
      </mesh>
      <Segment a={shoulder} b={elbow} r={0.056} r2={0.05} capsule>
        <meshPhysicalMaterial {...CHROME} />
      </Segment>
      <Joint at={elbow} r={0.05} />
      <Segment a={elbow} b={wrist} r={0.047} r2={0.04}>
        <meshPhysicalMaterial {...CHROME} />
      </Segment>
      <Joint at={wrist} r={0.035} />
      {/* Hand: palm and four fingers */}
      <group position={[wrist[0] + (bent ? 0.05 : 0.01), wrist[1] - 0.06, wrist[2]]} rotation-z={bent ? 0.6 : 0}>
        <RoundedBox args={[0.07, 0.08, 0.035]} radius={0.012}>
          <meshPhysicalMaterial {...CHROME} />
        </RoundedBox>
        {[-0.024, -0.008, 0.008, 0.024].map((dx) => (
          <mesh key={dx} position={[dx, -0.065, 0]}>
            <capsuleGeometry args={[0.008, 0.045, 4, 8]} />
            <meshPhysicalMaterial {...JOINT} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Leg({ side }: { side: number }) {
  const hip: Vec3 = [0, 0.9, side * 0.105];
  const knee: Vec3 = [0.015, 0.5, side * 0.11];
  const ankle: Vec3 = [0, 0.1, side * 0.115];
  return (
    <group>
      <Joint at={hip} r={0.068} />
      <Segment a={hip} b={knee} r={0.085} r2={0.065}>
        <meshPhysicalMaterial {...CHROME} />
      </Segment>
      <Joint at={knee} r={0.062} />
      <RoundedBox args={[0.05, 0.1, 0.09]} radius={0.02} position={[knee[0] + 0.055, knee[1], knee[2]]}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedBox>
      <Segment a={knee} b={ankle} r={0.064} r2={0.048}>
        <meshPhysicalMaterial {...CHROME} />
      </Segment>
      {/* Shin guard */}
      <RoundedBox args={[0.03, 0.3, 0.08]} radius={0.012} position={[0.06, 0.3, side * 0.112]}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedBox>
      <Joint at={ankle} r={0.042} />
      <RoundedBox args={[0.26, 0.07, 0.11]} radius={0.03} position={[0.05, 0.035, side * 0.115]}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedBox>
    </group>
  );
}

export function Humanoid() {
  return (
    <group>
      <Leg side={-1} />
      <Leg side={1} />

      {/* Pelvis, belt and flexible abdomen */}
      <RoundedBox args={[0.22, 0.13, 0.34]} radius={0.05} position={[0, 0.95, 0]}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedBox>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[0.225, 0.03, 0.345]} />
        <meshPhysicalMaterial {...JOINT} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 1.06 + i * 0.035, 0]} scale={[0.72, 1, 1]}>
          <cylinderGeometry args={[0.17 - i * 0.004, 0.165 - i * 0.004, 0.028, 32]} />
          <meshPhysicalMaterial {...(i % 2 ? JOINT : CHROME)} />
        </mesh>
      ))}

      {/* Chest with ribbed panel and diagonal closure */}
      <RoundedBox args={[0.27, 0.33, 0.46]} radius={0.09} smoothness={5} position={[0, 1.31, 0]}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedBox>
      <RoundedBox args={[0.03, 0.2, 0.36]} radius={0.012} position={[0.128, 1.32, 0]}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedBox>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0.145, 1.23 + i * 0.022, -0.07]}>
          <boxGeometry args={[0.006, 0.01, 0.15]} />
          <meshPhysicalMaterial {...JOINT} />
        </mesh>
      ))}
      <mesh position={[0.146, 1.34, 0.07]} rotation-x={0.55}>
        <boxGeometry args={[0.006, 0.24, 0.008]} />
        <meshPhysicalMaterial {...JOINT} />
      </mesh>

      <Arm side={-1} bent={false} />
      <Arm side={1} bent />

      {/* Tall ribbed collar and neck */}
      <mesh position={[0, 1.53, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.08, 20]} />
        <meshPhysicalMaterial {...JOINT} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 1.5 + i * 0.028, 0]}>
          <cylinderGeometry args={[0.083 - i * 0.003, 0.092 - i * 0.003, 0.022, 36, 1, true]} />
          <meshPhysicalMaterial {...CHROME} side={DoubleSide} />
        </mesh>
      ))}

      {/* Head: face shell, ear discs, hair, wraparound visor */}
      <mesh position={[0, 1.71, 0]} scale={[0.95, 1.16, 0.88]}>
        <sphereGeometry args={[0.1, 40, 28]} />
        <meshPhysicalMaterial {...CHROME} />
      </mesh>
      <mesh position={[0.045, 1.645, 0]} scale={[1, 0.6, 1.2]}>
        <sphereGeometry args={[0.05, 20, 14]} />
        <meshPhysicalMaterial {...CHROME} />
      </mesh>
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[-0.005, 1.72, sd * 0.088]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.025, 0.025, 0.012, 20]} />
          <meshPhysicalMaterial {...JOINT} />
        </mesh>
      ))}
      <mesh position={[-0.02, 1.77, 0]} scale={[1.08, 0.72, 0.98]}>
        <sphereGeometry args={[0.108, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshPhysicalMaterial color="#121212" roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 1.82, 0]} rotation-z={-0.4}>
        <boxGeometry args={[0.07, 0.03, 0.15]} />
        <meshPhysicalMaterial color="#121212" roughness={0.5} />
      </mesh>
      <mesh position={[0.008, 1.73, 0]} rotation-y={Math.PI / 2}>
        <cylinderGeometry args={[0.104, 0.1, 0.046, 40, 1, true, -1.2, 2.4]} />
        <meshPhysicalMaterial color="#050506" metalness={0.7} roughness={0.04} clearcoat={1} side={DoubleSide} />
      </mesh>
      <mesh position={[0.01, 1.707, 0]} rotation-y={Math.PI / 2}>
        <cylinderGeometry args={[0.103, 0.103, 0.004, 40, 1, true, -1.2, 2.4]} />
        <meshPhysicalMaterial {...SENSOR} side={DoubleSide} />
      </mesh>
    </group>
  );
}
