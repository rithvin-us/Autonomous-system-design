import { useMemo } from 'react';
import { extrudeCentered, roundedFrame, roundedRect, stadium } from '../three/geometry';
import { M } from '../three/materials';
import { Hole } from './parts';

/**
 * Stereolabs ZED 2i — illustrative reconstruction.
 * Key dimensions from the Stereolabs technical drawing (rev. 1, 26/05/21):
 *   front 175.25 × 30.25 mm, rear 170.29 mm wide, lens bezels Ø19.25 mm,
 *   stereo baseline 120 mm, rear boss 28.2 mm wide carrying the USB-C port
 *   with 2 × M2.5 locking holes 18.5 mm apart, 4 × M3 rear holes 153.4 × 14 mm,
 *   ¼"-20 + 2 × M3 on the base.
 * Units: millimetres. Origin: body centre. Front faces +Z.
 */
export const ZED = {
  width: 175.25,
  height: 30.25,
  depth: 31.8,
  baseline: 120,
} as const;

function Lens({ x, z }: { x: number; z: number }) {
  // Spherical cap for the front element: base radius 6.2, sphere radius 16.
  const R = 16;
  const theta = Math.asin(6.2 / R);
  const capHeight = R * (1 - Math.cos(theta));
  return (
    <group position={[x, 0, z]}>
      {/* Outer bezel ring Ø19.25 */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.25]}>
        <cylinderGeometry args={[9.625, 9.625, 0.5, 72]} />
        <meshPhysicalMaterial color="#3f4247" metalness={0.9} roughness={0.32} />
      </mesh>
      {/* Black lens barrel face */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.55]}>
        <cylinderGeometry args={[8.1, 8.1, 0.5, 72]} />
        <meshStandardMaterial color="#0a0a0b" roughness={0.7} />
      </mesh>
      {/* Retaining ring */}
      <mesh position={[0, 0, 0.82]}>
        <torusGeometry args={[6.75, 0.4, 16, 72]} />
        <meshPhysicalMaterial color="#5b5f66" metalness={1} roughness={0.25} />
      </mesh>
      {/* Front element */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.8 - (R - capHeight)]}>
        <sphereGeometry args={[R, 64, 16, 0, Math.PI * 2, 0, theta]} />
        <meshPhysicalMaterial {...M.lens} />
      </mesh>
    </group>
  );
}

export function Zed2iModel() {
  const { width: W, height: H, depth: D } = ZED;
  // ExtrudeGeometry grows the outline by the bevel size, so draw it that much smaller.
  const body = useMemo(
    () => extrudeCentered(stadium(W - 3.6, H - 3.6), D, { bevel: 1.8, taper: 170.29 / 175.25 }),
    [W, H, D],
  );
  const glass = useMemo(() => extrudeCentered(stadium(170.4 - 0.9, 25.29 - 0.9), 1.2, { bevel: 0.45 }), []);
  const boss = useMemo(() => extrudeCentered(roundedRect(28.2 - 1.6, 11 - 1.6, 2.4), 6.6, { bevel: 0.8 }), []);
  const usb = useMemo(() => extrudeCentered(roundedRect(8.9, 3.2, 1.55), 0.3), []);
  const usbShell = useMemo(() => extrudeCentered(roundedFrame(9.9, 4.2, 2.05, 8.9, 3.2, 1.55), 0.5), []);
  const front = D / 2;
  const back = -D / 2;
  const bossZ = back - 2.9;
  const bossY = -4.6;

  return (
    <group>
      {/* Aluminium enclosure, tapering slightly towards the back */}
      <mesh geometry={body}>
        <meshPhysicalMaterial {...M.anodisedDark} />
      </mesh>

      {/* Front cover glass */}
      <mesh geometry={glass} position={[0, 0, front + 0.1]}>
        <meshPhysicalMaterial {...M.blackGlass} />
      </mesh>

      {/* Lens assemblies, 120 mm baseline */}
      <Lens x={-ZED.baseline / 2} z={front + 0.7} />
      <Lens x={ZED.baseline / 2} z={front + 0.7} />

      {/* Rear boss with USB-C receptacle and locking-screw holes */}
      <mesh geometry={boss} position={[0, bossY, bossZ]}>
        <meshPhysicalMaterial {...M.anodisedDark} />
      </mesh>
      <group position={[0, bossY, back - 6.2]} rotation-y={Math.PI}>
        {/* Steel shell rim, dark interior just behind it, centre tongue */}
        <mesh geometry={usbShell} position={[0, 0, 0.2]}>
          <meshPhysicalMaterial {...M.steel} roughness={0.35} />
        </mesh>
        <mesh geometry={usb} position={[0, 0, 0.05]}>
          <meshStandardMaterial color="#050506" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0, 0.25]}>
          <boxGeometry args={[6.6, 0.7, 0.2]} />
          <meshStandardMaterial color="#1a1b1d" roughness={0.6} />
        </mesh>
        <Hole position={[-9.25, 0, 0.08]} r={1.4} />
        <Hole position={[9.25, 0, 0.08]} r={1.4} />
      </group>

      {/* 4 × M3 rear mounting threads (153.4 × 14 mm pattern) */}
      {[
        [-76.7, 7],
        [76.7, 7],
        [-76.7, -7],
        [76.7, -7],
      ].map(([x, y]) => (
        <Hole key={`${x}${y}`} position={[x * 0.973, y, back - 0.05]} r={1.56} ring={0.5} />
      ))}

      {/* Base: ¼"-20 tripod thread and 2 × M3 */}
      <Hole position={[0, -H / 2 - 0.05, -2]} rotation={[Math.PI / 2, 0, 0]} r={3.06} ring={0.8} />
      <Hole position={[-18, -H / 2 - 0.05, -2]} rotation={[Math.PI / 2, 0, 0]} r={1.76} ring={0.4} />
      <Hole position={[18, -H / 2 - 0.05, -2]} rotation={[Math.PI / 2, 0, 0]} r={1.76} ring={0.4} />
    </group>
  );
}
