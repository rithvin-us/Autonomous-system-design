import { Line, RoundedBox } from '@react-three/drei';
import { useMemo, type ReactNode } from 'react';
import { Quaternion, Vector3 } from 'three';
import { palette } from '../content/theme';
import type { Vec3 } from '../content/types';
import { M } from '../three/materials';
import { HcSr04Model } from './HcSr04';
import { RadarPlaceholderModel } from './RadarPlaceholder';
import { Zed2iModel } from './Zed2i';

/**
 * Illustrative autonomous off-road buggy (stand-in for the team vehicle).
 * Units: metres. Origin: centre of the wheelbase on the ground. Forward +Z.
 * The sensors are the same models as the sensor slides, at true size.
 */
export type VehicleGroup = 'sensors' | 'computing' | 'actuators';

const UP = new Vector3(0, 1, 0);

function Tube({ a, b, r = 0.022, mat = M.frame }: { a: Vec3; b: Vec3; r?: number; mat?: object }) {
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
      <cylinderGeometry args={[r, r, len, 14]} />
      <meshPhysicalMaterial {...mat} />
    </mesh>
  );
}

/** Mirror a point across the centre line. */
const mx = ([x, y, z]: Vec3): Vec3 => [-x, y, z];

function Pair({ a, b, r }: { a: Vec3; b: Vec3; r?: number }) {
  return (
    <>
      <Tube a={a} b={b} r={r} />
      <Tube a={mx(a)} b={mx(b)} r={r} />
    </>
  );
}

function Wheel({ x, z }: { x: number; z: number }) {
  const side = Math.sign(x);
  return (
    <group position={[x, 0.36, z]}>
      <mesh rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.36, 0.36, 0.27, 40]} />
        <meshPhysicalMaterial {...M.rubber} />
      </mesh>
      {/* Tread blocks */}
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return (
          <mesh key={i} position={[0, Math.sin(a) * 0.362, Math.cos(a) * 0.362]} rotation-x={-a}>
            <boxGeometry args={[0.24, 0.02, 0.05]} />
            <meshPhysicalMaterial {...M.rubber} />
          </mesh>
        );
      })}
      <mesh rotation-z={Math.PI / 2} position={[side * 0.1, 0, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.09, 32]} />
        <meshPhysicalMaterial {...M.aluminium} />
      </mesh>
      <mesh rotation-z={Math.PI / 2} position={[side * 0.15, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshPhysicalMaterial {...M.steel} />
      </mesh>
    </group>
  );
}

/** Wire box drawn around a part when its group is highlighted. */
function Halo({ size, position }: { size: Vec3; position: Vec3 }) {
  const [w, h, d] = size.map((v) => v / 2);
  const c: Vec3[] = [
    [-w, -h, -d],
    [w, -h, -d],
    [w, -h, d],
    [-w, -h, d],
  ];
  const segs: Vec3[][] = [];
  for (let i = 0; i < 4; i++) {
    const a = c[i];
    const b = c[(i + 1) % 4];
    segs.push([a, b], [[a[0], h, a[2]], [b[0], h, b[2]]], [a, [a[0], h, a[2]]]);
  }
  return (
    <group position={position}>
      {segs.map((p, i) => (
        <Line key={i} points={p} color={palette.orange} lineWidth={2.5} />
      ))}
    </group>
  );
}

/** Parts of each group: [position, halo size] in metres. */
export const VEHICLE_PARTS: Record<VehicleGroup, { name: string; position: Vec3; size: Vec3 }[]> = {
  sensors: [
    { name: 'Stereo camera', position: [0, 1.5, 0.3], size: [0.26, 0.1, 0.12] },
    { name: 'Radar', position: [0, 0.6, 1.33], size: [0.16, 0.14, 0.12] },
    { name: 'GNSS', position: [0, 1.39, -0.32], size: [0.16, 0.08, 0.16] },
    { name: 'Ultrasonic', position: [0.3, 0.46, 1.3], size: [0.1, 0.08, 0.08] },
    { name: 'IMU', position: [0, 0.48, -0.05], size: [0.1, 0.06, 0.1] },
  ],
  computing: [{ name: 'Onboard computer', position: [0, 0.62, -0.8], size: [0.56, 0.24, 0.4] }],
  actuators: [
    { name: 'Drive motor', position: [0, 0.42, -0.95], size: [0.5, 0.24, 0.26] },
    { name: 'Steering', position: [0, 0.42, 0.95], size: [0.9, 0.14, 0.16] },
  ],
};

export function VehicleModel({ highlight = null }: { highlight?: VehicleGroup | null }) {
  const halos: ReactNode[] = highlight
    ? VEHICLE_PARTS[highlight].map((p) => <Halo key={p.name} size={p.size} position={p.position} />)
    : [];

  return (
    <group>
      {/* ---------- Chassis ---------- */}
      <Pair a={[0.46, 0.4, -1.05]} b={[0.46, 0.4, 0.95]} r={0.03} />
      <Pair a={[0.46, 0.4, 0.95]} b={[0.3, 0.46, 1.25]} r={0.03} />
      {[-1.05, -0.45, 0.25, 0.95].map((z) => (
        <Tube key={z} a={[-0.46, 0.4, z]} b={[0.46, 0.4, z]} r={0.026} />
      ))}
      <Tube a={[-0.3, 0.46, 1.25]} b={[0.3, 0.46, 1.25]} r={0.03} />
      <mesh position={[0, 0.38, -0.05]}>
        <boxGeometry args={[0.9, 0.02, 1.95]} />
        <meshPhysicalMaterial {...M.aluminium} color="#6d737a" />
      </mesh>

      {/* ---------- Roll cage ---------- */}
      <Pair a={[0.48, 0.4, -0.42]} b={[0.44, 1.36, -0.34]} r={0.026} />
      <Tube a={[-0.44, 1.36, -0.34]} b={[0.44, 1.36, -0.34]} r={0.026} />
      <Pair a={[0.46, 0.42, 0.62]} b={[0.42, 1.3, 0.18]} r={0.026} />
      <Tube a={[-0.42, 1.3, 0.18]} b={[0.42, 1.3, 0.18]} r={0.026} />
      <Pair a={[0.44, 1.36, -0.34]} b={[0.42, 1.3, 0.18]} r={0.024} />
      <Pair a={[0.44, 1.36, -0.34]} b={[0.42, 0.42, -1.02]} r={0.022} />
      <Pair a={[0.47, 0.8, -0.38]} b={[0.44, 0.8, 0.4]} r={0.02} />
      {/* Front bumper hoop */}
      <Pair a={[0.3, 0.46, 1.25]} b={[0.3, 0.72, 1.18]} r={0.022} />
      <Tube a={[-0.3, 0.72, 1.18]} b={[0.3, 0.72, 1.18]} r={0.022} />

      {/* ---------- Suspension ---------- */}
      {[0.95, -0.95].flatMap((z) => [
        <Pair key={`a${z}`} a={[0.46, 0.42, z + 0.16]} b={[0.66, 0.36, z]} r={0.018} />,
        <Pair key={`b${z}`} a={[0.46, 0.42, z - 0.16]} b={[0.66, 0.36, z]} r={0.018} />,
        <Pair key={`s${z}`} a={[0.47, 0.86, z * 0.82]} b={[0.64, 0.42, z]} r={0.03} />,
      ])}

      {/* ---------- Wheels ---------- */}
      <Wheel x={0.8} z={0.95} />
      <Wheel x={-0.8} z={0.95} />
      <Wheel x={0.8} z={-0.95} />
      <Wheel x={-0.8} z={-0.95} />

      {/* ---------- Seats (safety driver) ---------- */}
      {[-0.2, 0.2].map((x) => (
        <group key={x} position={[x, 0.42, -0.08]}>
          <RoundedBox args={[0.34, 0.1, 0.4]} radius={0.04} position={[0, 0.06, 0]}>
            <meshPhysicalMaterial {...M.plasticBlack} />
          </RoundedBox>
          <RoundedBox args={[0.34, 0.5, 0.08]} radius={0.04} position={[0, 0.32, -0.2]} rotation-x={-0.18}>
            <meshPhysicalMaterial {...M.plasticBlack} />
          </RoundedBox>
        </group>
      ))}

      {/* ---------- Computing: sealed enclosure behind the seats ---------- */}
      <RoundedBox args={[0.5, 0.18, 0.34]} radius={0.03} position={[0, 0.6, -0.8]}>
        <meshPhysicalMaterial {...M.anodisedDark} />
      </RoundedBox>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[-0.18 + i * 0.06, 0.71, -0.8]}>
          <boxGeometry args={[0.012, 0.04, 0.3]} />
          <meshPhysicalMaterial {...M.aluminium} />
        </mesh>
      ))}

      {/* ---------- Actuators: rear drive motor, steering rack ---------- */}
      <mesh position={[0, 0.42, -0.95]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.1, 0.1, 0.42, 28]} />
        <meshPhysicalMaterial {...M.aluminium} />
      </mesh>
      <mesh position={[0, 0.42, 0.95]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.03, 0.03, 0.86, 14]} />
        <meshPhysicalMaterial {...M.steel} />
      </mesh>

      {/* ---------- Sensors (true scale, mm models) ---------- */}
      <Tube a={[0, 1.3, 0.18]} b={[0, 1.44, 0.28]} r={0.018} />
      <group position={[0, 1.47, 0.3]} scale={0.001}>
        <Zed2iModel />
      </group>
      <group position={[0, 0.6, 1.3]} scale={0.001}>
        <RadarPlaceholderModel />
      </group>
      <mesh position={[0, 1.37, -0.32]} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[0.065, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...M.plasticLight} />
      </mesh>
      {[0.3, -0.3].map((x) => (
        <group key={x} position={[x, 0.47, 1.27]} scale={0.001}>
          <HcSr04Model />
        </group>
      ))}
      <mesh position={[0, 0.48, -0.05]}>
        <boxGeometry args={[0.05, 0.02, 0.05]} />
        <meshPhysicalMaterial {...M.pcbPurple} />
      </mesh>

      {halos}
    </group>
  );
}
