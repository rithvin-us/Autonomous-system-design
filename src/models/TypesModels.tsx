import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DoubleSide, Shape, type Group } from 'three';
import { extrudeCentered } from '../three/geometry';
import { M } from '../three/materials';

/**
 * Study models for slide 04, built from the presenter's reference photos.
 * Generic forms only: no brand marks or logos are reproduced.
 * Units: metres, standing on y = 0, facing +X. Orange marks sensors.
 */

const WHITE = { color: '#eef0f1', metalness: 0.15, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.18 };
const DARK = { color: '#24272b', metalness: 0.3, roughness: 0.45 };
const GLASS = { color: '#0b0d10', metalness: 0.2, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.05 };
const SENSOR = { color: '#ff6a13', metalness: 0.1, roughness: 0.45 };
const CHROME = { color: '#d7dade', metalness: 0.95, roughness: 0.18 };

function polyShape(points: [number, number][]) {
  const s = new Shape();
  s.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => s.lineTo(x, y));
  s.closePath();
  return s;
}

/* ------------------------------------------------------------------ */
/* Robotaxi: compact electric SUV with roof sensor tower and pods      */
/* ------------------------------------------------------------------ */

function TaxiWheel({ x, z }: { x: number; z: number }) {
  const side = Math.sign(z);
  return (
    <group position={[x, 0.37, z]}>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.37, 0.37, 0.25, 40]} />
        <meshPhysicalMaterial {...M.rubber} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 0, side * 0.105]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 36]} />
        <meshPhysicalMaterial color="#17181a" metalness={0.6} roughness={0.35} />
      </mesh>
      {[0, 1, 2, 3, 4].map((k) => (
        <mesh key={k} position={[0, 0, side * 0.135]} rotation-z={(k * Math.PI * 2) / 5}>
          <boxGeometry args={[0.04, 0.42, 0.02]} />
          <meshPhysicalMaterial color="#2b2d31" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export function RoboTaxi() {
  const body = useMemo(() => {
    // Side profile with open wheel arches (x forward, y up).
    const s = new Shape();
    s.moveTo(2.32, 0.3);
    s.lineTo(2.4, 0.6);
    s.lineTo(2.28, 0.8);
    s.lineTo(1.25, 0.97);
    s.lineTo(0.92, 1.0);
    s.lineTo(-1.95, 1.07);
    s.lineTo(-2.3, 0.98);
    s.lineTo(-2.34, 0.6);
    s.lineTo(-2.3, 0.3);
    s.lineTo(-1.92, 0.3);
    s.absarc(-1.45, 0.3, 0.47, Math.PI, 0, true);
    s.lineTo(0.98, 0.3);
    s.absarc(1.45, 0.3, 0.47, Math.PI, 0, true);
    s.closePath();
    return extrudeCentered(s, 1.84, { bevel: 0.12, curveSegments: 24, crease: Math.PI / 4 });
  }, []);
  const cabin = useMemo(
    () =>
      extrudeCentered(
        polyShape([
          [0.92, 1.0],
          [0.08, 1.47],
          [-1.2, 1.5],
          [-2.0, 1.12],
          [-1.95, 1.07],
        ]),
        1.58,
        { bevel: 0.06, crease: Math.PI / 4 },
      ),
    [],
  );

  return (
    <group>
      <mesh geometry={body}>
        <meshPhysicalMaterial {...WHITE} />
      </mesh>
      <mesh geometry={cabin}>
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      {/* Roof skin */}
      <mesh position={[-0.55, 1.5, 0]}>
        <boxGeometry args={[1.2, 0.03, 1.42]} />
        <meshPhysicalMaterial {...WHITE} />
      </mesh>
      {/* Grille and lights */}
      <mesh position={[2.41, 0.6, 0]}>
        <boxGeometry args={[0.04, 0.22, 0.9]} />
        <meshPhysicalMaterial {...DARK} />
      </mesh>
      {[-0.68, 0.68].map((z) => (
        <mesh key={z} position={[2.3, 0.8, z]}>
          <boxGeometry args={[0.12, 0.05, 0.36]} />
          <meshPhysicalMaterial color="#cfd6de" metalness={0.2} roughness={0.1} />
        </mesh>
      ))}
      {/* Mirrors */}
      {[-1, 1].map((sd) => (
        <RoundedBox key={sd} args={[0.18, 0.1, 0.14]} radius={0.03} position={[0.82, 1.08, sd * 1.0]}>
          <meshPhysicalMaterial {...WHITE} />
        </RoundedBox>
      ))}

      {/* Roof sensor tower */}
      <RoundedBox args={[1.25, 0.08, 1.05]} radius={0.03} position={[-0.5, 1.57, 0]}>
        <meshPhysicalMaterial {...DARK} />
      </RoundedBox>
      <mesh position={[0.1, 1.56, 0]}>
        <boxGeometry args={[0.06, 0.08, 0.86]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      <mesh position={[-0.5, 1.72, 0]}>
        <cylinderGeometry args={[0.27, 0.3, 0.22, 40]} />
        <meshPhysicalMaterial {...DARK} />
      </mesh>
      <mesh position={[-0.5, 1.93, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.2, 40]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      <mesh position={[-0.5, 1.84, 0]}>
        <torusGeometry args={[0.215, 0.012, 8, 48]} />
        <meshPhysicalMaterial {...SENSOR} />
      </mesh>
      <mesh position={[-0.5, 2.03, 0]} scale={[1, 0.35, 1]}>
        <sphereGeometry args={[0.21, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...DARK} />
      </mesh>

      {/* Fender sensor pods (front and rear corners) */}
      {[
        [1.55, 1.0],
        [-1.95, 1.02],
      ].flatMap(([x, y]) =>
        [-1, 1].map((sd) => (
          <group key={`${x}${sd}`} position={[x, y, sd * 1.0]}>
            <RoundedBox args={[0.24, 0.2, 0.16]} radius={0.04}>
              <meshPhysicalMaterial {...WHITE} />
            </RoundedBox>
            <mesh position={[0.06, 0, sd * 0.081]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.065, 0.065, 0.01, 24]} />
              <meshPhysicalMaterial {...GLASS} />
            </mesh>
            <mesh position={[0.06, 0, sd * 0.087]}>
              <torusGeometry args={[0.07, 0.008, 6, 32]} />
              <meshPhysicalMaterial {...SENSOR} />
            </mesh>
          </group>
        )),
      )}

      <TaxiWheel x={1.45} z={0.84} />
      <TaxiWheel x={1.45} z={-0.84} />
      <TaxiWheel x={-1.45} z={0.84} />
      <TaxiWheel x={-1.45} z={-0.84} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Warehouse AMRs: a large lifting robot and a compact one             */
/* ------------------------------------------------------------------ */

/** Octagonal footprint, extruded upwards between y0 and y1. */
function OctoBand({ l, w, c, y0, y1, mat }: { l: number; w: number; c: number; y0: number; y1: number; mat: object }) {
  const geo = useMemo(() => {
    const s = polyShape([
      [l / 2, w / 2 - c],
      [l / 2 - c, w / 2],
      [-l / 2 + c, w / 2],
      [-l / 2, w / 2 - c],
      [-l / 2, -w / 2 + c],
      [-l / 2 + c, -w / 2],
      [l / 2 - c, -w / 2],
      [l / 2, -w / 2 + c],
    ]);
    return extrudeCentered(s, y1 - y0, { crease: 0.5 });
  }, [l, w, c, y0, y1]);
  return (
    <mesh geometry={geo} rotation-x={-Math.PI / 2} position={[0, (y0 + y1) / 2, 0]}>
      <meshPhysicalMaterial {...mat} />
    </mesh>
  );
}

function LargeAmr() {
  const L = 1.35;
  const W = 0.85;
  return (
    <group>
      <OctoBand l={L - 0.04} w={W - 0.04} c={0.2} y0={0.02} y1={0.12} mat={DARK} />
      <OctoBand l={L} w={W} c={0.22} y0={0.12} y1={0.32} mat={WHITE} />
      <OctoBand l={L + 0.005} w={W + 0.005} c={0.22} y0={0.32} y1={0.47} mat={GLASS} />
      <OctoBand l={L} w={W} c={0.22} y0={0.47} y1={0.52} mat={{ color: '#8c9097', metalness: 0.3, roughness: 0.4 }} />
      <OctoBand l={L} w={W} c={0.22} y0={0.52} y1={0.8} mat={WHITE} />
      {/* Lift deck */}
      <OctoBand l={L - 0.12} w={W - 0.1} c={0.18} y0={0.8} y1={0.88} mat={{ color: '#22357a', metalness: 0.25, roughness: 0.4 }} />
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[sd * (L / 2 - 0.12), 0.95, 0]}>
          <boxGeometry args={[0.12, 0.14, W - 0.14]} />
          <meshPhysicalMaterial color="#22357a" metalness={0.25} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.9, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.015, 0.015, L - 0.3, 12]} />
        <meshPhysicalMaterial {...M.steel} />
      </mesh>
      {/* Emergency stop */}
      <mesh position={[0.48, 0.91, 0.18]}>
        <cylinderGeometry args={[0.035, 0.035, 0.05, 24]} />
        <meshStandardMaterial color="#d8261c" roughness={0.4} />
      </mesh>
      {/* Front camera */}
      <mesh position={[L / 2 + 0.005, 0.6, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.025, 0.025, 0.02, 20]} />
        <meshPhysicalMaterial {...SENSOR} />
      </mesh>
    </group>
  );
}

function SmallAmr() {
  return (
    <group>
      <RoundedBox args={[0.6, 0.06, 0.44]} radius={0.02} position={[0, 0.05, 0]}>
        <meshPhysicalMaterial {...DARK} />
      </RoundedBox>
      <RoundedBox args={[0.62, 0.2, 0.46]} radius={0.06} position={[0, 0.18, 0]}>
        <meshPhysicalMaterial {...WHITE} />
      </RoundedBox>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.625, 0.03, 0.465]} />
        <meshPhysicalMaterial {...DARK} />
      </mesh>
      <RoundedBox args={[0.58, 0.05, 0.42]} radius={0.02} position={[0, 0.3, 0]}>
        <meshPhysicalMaterial {...WHITE} />
      </RoundedBox>
      {[-0.14, 0.14].map((z) => (
        <mesh key={z} position={[0.22, 0.4, z]}>
          <cylinderGeometry args={[0.006, 0.006, 0.18, 8]} />
          <meshPhysicalMaterial {...DARK} />
        </mesh>
      ))}
      {[-0.06, 0, 0.06].map((z) => (
        <mesh key={z} position={[0.312, 0.08, z]}>
          <boxGeometry args={[0.01, 0.03, 0.03]} />
          <meshPhysicalMaterial {...SENSOR} />
        </mesh>
      ))}
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[0.27, 0.18, sd * 0.232]}>
          <boxGeometry args={[0.05, 0.03, 0.005]} />
          <meshStandardMaterial color="#d8261c" emissive="#d8261c" emissiveIntensity={0.6} />
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
      <group position={[0.75, 0, 0.55]} rotation-y={0.2}>
        <SmallAmr />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Drone hovering over its docking station                             */
/* ------------------------------------------------------------------ */

function Quadcopter({ animate }: { animate: boolean }) {
  const g = useRef<Group>(null);
  const rotors = useRef<(Group | null)[]>([]);
  useFrame(({ clock }, dt) => {
    if (!animate) return;
    if (g.current) g.current.position.y = 1.12 + Math.sin(clock.elapsedTime * 1.3) * 0.03;
    rotors.current.forEach((r, i) => r && (r.rotation.y += dt * (i % 2 ? 14 : -14)));
  });
  const arms = [40, 140, 220, 320].map((d) => (d * Math.PI) / 180);
  return (
    <group ref={g} position={[0, 1.12, 0]}>
      <RoundedBox args={[0.34, 0.1, 0.22]} radius={0.04}>
        <meshPhysicalMaterial color="#5c6066" metalness={0.3} roughness={0.45} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.06, 0.16]} radius={0.03} position={[-0.05, 0.07, 0]}>
        <meshPhysicalMaterial color="#4a4e54" metalness={0.3} roughness={0.45} />
      </RoundedBox>
      {arms.map((a, i) => {
        const x = Math.cos(a) * 0.36;
        const z = Math.sin(a) * 0.36;
        return (
          <group key={i}>
            <mesh position={[x / 2, 0.02, z / 2]} rotation-y={-a}>
              <boxGeometry args={[0.36, 0.03, 0.035]} />
              <meshPhysicalMaterial color="#4a4e54" metalness={0.3} roughness={0.45} />
            </mesh>
            <mesh position={[x, 0.05, z]}>
              <cylinderGeometry args={[0.03, 0.03, 0.06, 16]} />
              <meshPhysicalMaterial {...DARK} />
            </mesh>
            <group ref={(r) => { rotors.current[i] = r; }} position={[x, 0.085, z]}>
              <mesh rotation-x={-Math.PI / 2}>
                <circleGeometry args={[0.17, 40]} />
                <meshStandardMaterial color="#9ba1a8" transparent opacity={0.22} side={DoubleSide} depthWrite={false} />
              </mesh>
              <mesh>
                <boxGeometry args={[0.34, 0.006, 0.025]} />
                <meshPhysicalMaterial color="#c9ccd0" metalness={0.2} roughness={0.5} />
              </mesh>
            </group>
          </group>
        );
      })}
      {/* Camera gimbal */}
      <group position={[0.18, -0.06, 0]}>
        <RoundedBox args={[0.08, 0.08, 0.1]} radius={0.02}>
          <meshPhysicalMaterial {...DARK} />
        </RoundedBox>
        <mesh position={[0.042, 0, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.026, 0.026, 0.01, 20]} />
          <meshPhysicalMaterial {...SENSOR} />
        </mesh>
      </group>
    </group>
  );
}

function Dock() {
  const DOCK = '#d9dbdd';
  return (
    <group>
      {/* Feet */}
      {[-0.28, 0.28].flatMap((x) =>
        [-0.24, 0.24].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.03, z]}>
            <boxGeometry args={[0.1, 0.06, 0.1]} />
            <meshPhysicalMaterial {...DARK} />
          </mesh>
        )),
      )}
      {/* Main body */}
      <RoundedBox args={[0.7, 0.44, 0.62]} radius={0.03} position={[0, 0.28, 0]}>
        <meshPhysicalMaterial color={DOCK} metalness={0.2} roughness={0.4} />
      </RoundedBox>
      {/* Dark top cover */}
      <RoundedBox args={[0.68, 0.14, 0.6]} radius={0.06} position={[0, 0.55, 0]}>
        <meshPhysicalMaterial color="#2e3135" metalness={0.3} roughness={0.5} />
      </RoundedBox>
      {/* Front service panel */}
      <group position={[0.352, 0.28, 0]}>
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[0.005, 0.24, 0.2]} />
          <meshPhysicalMaterial {...GLASS} />
        </mesh>
        <mesh position={[0, 0.08, -0.17]}>
          <boxGeometry args={[0.006, 0.07, 0.07]} />
          <meshStandardMaterial color="#f2c230" roughness={0.5} />
        </mesh>
        <mesh position={[0.008, 0.08, -0.17]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.024, 0.024, 0.02, 20]} />
          <meshStandardMaterial color="#d8261c" roughness={0.4} />
        </mesh>
        {[-0.2, -0.13, -0.06].map((z) => (
          <mesh key={z} position={[0.006, -0.06, z]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
            <meshPhysicalMaterial {...DARK} />
          </mesh>
        ))}
      </group>
      {/* Open covers on either side, forming the landing deck */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[0, 0.3, sd * 0.62]}>
          <RoundedBox args={[0.66, 0.26, 0.62]} radius={0.05}>
            <meshPhysicalMaterial color="#e7e9eb" metalness={0.1} roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, 0.131, -sd * 0.05]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[0.56, 0.44]} />
            <meshPhysicalMaterial color="#3a3d42" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* GNSS puck and weather mast */}
      <mesh position={[0.1, 0.64, 0]} scale={[1, 0.4, 1]}>
        <sphereGeometry args={[0.05, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...SENSOR} />
      </mesh>
      <mesh position={[0.2, 0.55, 0.95]}>
        <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
        <meshPhysicalMaterial {...M.steel} />
      </mesh>
      {[0, 2.1, 4.2].map((a) => (
        <mesh key={a} position={[0.2 + Math.cos(a) * 0.04, 0.66, 0.95 + Math.sin(a) * 0.04]}>
          <sphereGeometry args={[0.014, 10, 8]} />
          <meshPhysicalMaterial {...M.steel} />
        </mesh>
      ))}
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

/* ------------------------------------------------------------------ */
/* Humanoid robot (silver android, film-inspired costume)              */
/* ------------------------------------------------------------------ */

function Limb({ from, to, r }: { from: [number, number, number]; to: [number, number, number]; r: number }) {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
  const mid: [number, number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  const tilt = Math.atan2(to[0] - from[0], from[1] - to[1]);
  return (
    <mesh position={mid} rotation-z={tilt}>
      <capsuleGeometry args={[r, Math.max(0.01, len - r * 2), 8, 20]} />
      <meshPhysicalMaterial {...CHROME} />
    </mesh>
  );
}

export function Humanoid() {
  return (
    <group>
      {/* Legs and feet */}
      {[-1, 1].map((sd) => (
        <group key={sd}>
          <Limb from={[0, 0.92, sd * 0.11]} to={[0, 0.08, sd * 0.12]} r={0.07} />
          <RoundedBox args={[0.24, 0.07, 0.11]} radius={0.03} position={[0.05, 0.035, sd * 0.12]}>
            <meshPhysicalMaterial {...CHROME} />
          </RoundedBox>
        </group>
      ))}
      {/* Pelvis and torso */}
      <RoundedBox args={[0.22, 0.14, 0.34]} radius={0.05} position={[0, 0.96, 0]}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedBox>
      <RoundedBox args={[0.26, 0.5, 0.46]} radius={0.08} position={[0, 1.26, 0]}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedBox>
      {/* Ribbed chest panel */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0.135, 1.12 + i * 0.033, -0.07]}>
          <boxGeometry args={[0.01, 0.014, 0.16]} />
          <meshPhysicalMaterial color="#9aa0a6" metalness={0.95} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.136, 1.36, 0.1]} rotation-x={0.6}>
        <boxGeometry args={[0.01, 0.2, 0.012]} />
        <meshPhysicalMaterial color="#9aa0a6" metalness={0.95} roughness={0.3} />
      </mesh>
      {/* Arms */}
      {[-1, 1].map((sd) => (
        <group key={sd}>
          <mesh position={[0, 1.46, sd * 0.28]}>
            <sphereGeometry args={[0.085, 24, 16]} />
            <meshPhysicalMaterial {...CHROME} />
          </mesh>
          <Limb from={[0, 1.44, sd * 0.29]} to={[0.02, 1.13, sd * 0.31]} r={0.055} />
          <Limb from={[0.02, 1.13, sd * 0.31]} to={[0.08, 0.86, sd * 0.3]} r={0.048} />
          <mesh position={[0.09, 0.82, sd * 0.3]}>
            <sphereGeometry args={[0.05, 16, 12]} />
            <meshPhysicalMaterial {...CHROME} />
          </mesh>
        </group>
      ))}
      {/* Tall ribbed collar */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 1.53 + i * 0.03, 0]}>
          <cylinderGeometry args={[0.085 - i * 0.004, 0.09 - i * 0.004, 0.026, 32]} />
          <meshPhysicalMaterial {...CHROME} />
        </mesh>
      ))}
      {/* Head */}
      <mesh position={[0, 1.75, 0]} scale={[1, 1.18, 0.95]}>
        <sphereGeometry args={[0.105, 32, 24]} />
        <meshPhysicalMaterial {...CHROME} />
      </mesh>
      {/* Hair volume */}
      <mesh position={[-0.02, 1.81, 0]} scale={[1.05, 0.7, 1.02]}>
        <sphereGeometry args={[0.112, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshPhysicalMaterial color="#141414" roughness={0.55} />
      </mesh>
      {/* Wraparound visor (its sensors) */}
      <mesh position={[0.01, 1.765, 0]} rotation-y={Math.PI / 2}>
        <cylinderGeometry args={[0.112, 0.108, 0.05, 32, 1, true, -1.15, 2.3]} />
        <meshPhysicalMaterial color="#060607" metalness={0.6} roughness={0.05} clearcoat={1} side={DoubleSide} />
      </mesh>
      <mesh position={[0.012, 1.742, 0]} rotation-y={Math.PI / 2}>
        <cylinderGeometry args={[0.113, 0.113, 0.004, 32, 1, true, -1.15, 2.3]} />
        <meshPhysicalMaterial {...SENSOR} side={DoubleSide} />
      </mesh>
    </group>
  );
}
