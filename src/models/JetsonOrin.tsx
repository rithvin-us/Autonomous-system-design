import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DoubleSide, type Group, type MeshStandardMaterial } from 'three';
import { extrudeCentered, plateWithHoles } from '../three/geometry';
import { M } from '../three/materials';
import { Pin } from './parts';

/**
 * NVIDIA Jetson Orin Nano Developer Kit — illustrative reconstruction.
 * Connector set from NVIDIA's hardware layout page: 4 × USB 3.2 Type-A
 * (two stacks), Gigabit Ethernet, DisplayPort, USB-C, 5.5 mm DC jack,
 * 2 × 22-pin CSI camera connectors, 40-pin header, M.2 slots underneath,
 * microSD on the module. Board footprint ~100 × 79 mm (retailer figure).
 * Exact connector positions are approximate.
 * Units: millimetres. Origin: board centre, top face of carrier at y = 0.
 * Rear I/O edge faces +Z.
 */
export const JETSON = { width: 100, depth: 79, standoff: 12 } as const;
export const JETSON_FLOOR_Y = -JETSON.standoff - 1.6;

const BOARD_T = 1.6;
const EDGE = JETSON.depth / 2; // I/O edge at +Z

/** The module glows faintly while it processes (driven by the demo). */
export const jetsonActivity = { level: 0 };

function Heatsink() {
  const fan = useRef<Group>(null);
  useFrame((_, dt) => {
    if (fan.current) fan.current.rotation.y += dt * 9;
  });
  return (
    <group position={[-6, 0, -6]}>
      {/* Base plate and fins */}
      <mesh position={[0, 6 + 2, 0]}>
        <boxGeometry args={[72, 4, 50]} />
        <meshPhysicalMaterial color="#17181a" metalness={0.75} roughness={0.42} />
      </mesh>
      {Array.from({ length: 17 }, (_, i) => (
        <mesh key={i} position={[-34 + i * 4.25, 6 + 4 + 9, 0]}>
          <boxGeometry args={[1.4, 18, 50]} />
          <meshPhysicalMaterial color="#1b1c1f" metalness={0.75} roughness={0.38} />
        </mesh>
      ))}
      {/* Fan shroud with grille opening and spinning blades */}
      <RoundedBox args={[58, 9, 50]} radius={3} smoothness={4} position={[0, 6 + 4 + 18 + 4.5, 0]}>
        <meshPhysicalMaterial color="#111214" metalness={0.3} roughness={0.5} />
      </RoundedBox>
      <group position={[0, 6 + 4 + 18 + 9.2, 0]}>
        <mesh rotation-x={-Math.PI / 2}>
          <ringGeometry args={[18, 21.5, 64]} />
          <meshPhysicalMaterial color="#2a2c30" metalness={0.5} roughness={0.4} />
        </mesh>
        <group ref={fan}>
          {Array.from({ length: 9 }, (_, i) => (
            <group key={i} rotation-y={(i * Math.PI * 2) / 9} position={[0, -0.4, 0]}>
              <mesh position={[10, 0, 0]} rotation-x={0.45}>
                <boxGeometry args={[15, 0.6, 6]} />
                <meshPhysicalMaterial color="#25272b" roughness={0.6} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[6, 6, 1.2, 32]} />
            <meshPhysicalMaterial color="#2f3236" roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function UsbStack({ x }: { x: number }) {
  return (
    <group position={[x, 0, EDGE - 7]}>
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[14.5, 16, 17]} />
        <meshPhysicalMaterial {...M.steel} roughness={0.32} />
      </mesh>
      {[4, 12].map((y) => (
        <group key={y}>
          <mesh position={[0, y, 8.6]}>
            <boxGeometry args={[12.2, 5.2, 0.6]} />
            <meshStandardMaterial color="#08090a" roughness={0.9} />
          </mesh>
          <mesh position={[0, y + 1, 8.8]}>
            <boxGeometry args={[10.5, 1.6, 0.4]} />
            <meshStandardMaterial color="#1f5fd1" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function JetsonOrinModel() {
  const pcb = useMemo(
    () =>
      extrudeCentered(
        plateWithHoles(JETSON.width, JETSON.depth, 2.5, [
          [-45, -35.5, 1.6],
          [45, -35.5, 1.6],
          [-45, 35.5, 1.6],
          [45, 35.5, 1.6],
        ]),
        BOARD_T,
        { crease: 0.5, curveSegments: 16 },
      ),
    [],
  );
  const moduleMat = useRef<MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const m = moduleMat.current;
    if (m) m.emissiveIntensity = jetsonActivity.level * (0.55 + 0.45 * Math.sin(clock.elapsedTime * 9));
  });

  return (
    <group>
      {/* Carrier board on standoffs */}
      <mesh geometry={pcb} rotation-x={-Math.PI / 2} position={[0, -BOARD_T / 2, 0]}>
        <meshPhysicalMaterial {...M.pcbBlack} />
      </mesh>
      {[
        [-45, -35.5],
        [45, -35.5],
        [-45, 35.5],
        [45, 35.5],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -BOARD_T - JETSON.standoff / 2, z]}>
          <cylinderGeometry args={[2.6, 3, JETSON.standoff, 16]} />
          <meshPhysicalMaterial {...M.plasticBlack} />
        </mesh>
      ))}

      {/* Module (under the heatsink), its edge visible, with microSD slot */}
      <mesh position={[-6, 3.2, -6]}>
        <boxGeometry args={[69.6, 1.2, 45]} />
        <meshStandardMaterial ref={moduleMat} color="#24402e" roughness={0.45} emissive="#ff6a13" emissiveIntensity={0} />
      </mesh>
      <mesh position={[-6, 1.5, -6]}>
        <boxGeometry args={[66, 2.8, 8]} />
        <meshPhysicalMaterial {...M.plasticBlack} />
      </mesh>
      <mesh position={[-42.5, 2.6, -14]}>
        <boxGeometry args={[4, 1.4, 12]} />
        <meshPhysicalMaterial {...M.steel} />
      </mesh>
      <Heatsink />

      {/* Rear I/O edge (+Z): DC jack, DisplayPort, 2 × USB stacks, Ethernet, USB-C */}
      <group>
        <mesh position={[-40, 5.5, EDGE - 6]}>
          <boxGeometry args={[9, 11, 13]} />
          <meshPhysicalMaterial {...M.plasticBlack} />
        </mesh>
        <mesh position={[-40, 6, EDGE + 0.6]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[3.2, 3.2, 1.2, 24]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
        <mesh position={[-25, 3, EDGE - 6]}>
          <boxGeometry args={[16, 6, 13]} />
          <meshPhysicalMaterial {...M.steel} roughness={0.3} />
        </mesh>
        <mesh position={[-25, 3, EDGE + 0.55]}>
          <boxGeometry args={[13.5, 3.6, 0.4]} />
          <meshStandardMaterial color="#08090a" />
        </mesh>
        <UsbStack x={-8} />
        <UsbStack x={9} />
        <mesh position={[28, 7, EDGE - 8]}>
          <boxGeometry args={[16, 14, 21]} />
          <meshPhysicalMaterial {...M.steel} roughness={0.32} />
        </mesh>
        <mesh position={[28, 6, EDGE + 2.6]}>
          <boxGeometry args={[11.5, 9.5, 0.4]} />
          <meshStandardMaterial color="#08090a" />
        </mesh>
        {[-5, 5].map((x) => (
          <mesh key={x} position={[28 + x, 12.6, EDGE + 2.62]}>
            <boxGeometry args={[2.5, 1.2, 0.4]} />
            <meshStandardMaterial color={x < 0 ? '#3bd16f' : '#f2c230'} emissive={x < 0 ? '#3bd16f' : '#f2c230'} emissiveIntensity={0.6} />
          </mesh>
        ))}
        <mesh position={[43, 1.8, EDGE - 3.5]}>
          <boxGeometry args={[9, 3.4, 7.5]} />
          <meshPhysicalMaterial {...M.steel} roughness={0.3} />
        </mesh>
      </group>

      {/* 40-pin expansion header along the back edge (-Z) */}
      <group position={[-6, 0, -EDGE + 5]}>
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[50.8, 2.5, 5.1]} />
          <meshPhysicalMaterial {...M.plasticBlack} />
        </mesh>
        {Array.from({ length: 20 }, (_, i) =>
          [-1.27, 1.27].map((z) => <Pin key={`${i}${z}`} position={[-24.13 + i * 2.54, 5.5, z]} length={6} />),
        )}
      </group>
      {/* Power LED */}
      <mesh position={[24, 0.6, -EDGE + 5]}>
        <boxGeometry args={[1.6, 0.6, 0.8]} />
        <meshStandardMaterial color="#3bd16f" emissive="#3bd16f" emissiveIntensity={0.9} />
      </mesh>

      {/* Two 22-pin CSI camera connectors on the left edge (-X) */}
      {[-14, 8].map((z) => (
        <group key={z} position={[-JETSON.width / 2 + 5, 0, z]}>
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[5, 2.8, 15]} />
            <meshStandardMaterial color="#e8e0cc" roughness={0.6} />
          </mesh>
          <mesh position={[-1.6, 2.9, 0]}>
            <boxGeometry args={[1.6, 0.6, 14]} />
            <meshStandardMaterial color="#2b2b2b" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Underside: NVMe SSD in the M.2 2280 slot */}
      <group position={[4, -BOARD_T - 3.5, 4]}>
        <mesh>
          <boxGeometry args={[80, 1.2, 22]} />
          <meshPhysicalMaterial {...M.pcbBlack} color="#0f3b2a" />
        </mesh>
        <mesh position={[-14, -1.2, 0]}>
          <boxGeometry args={[30, 1.2, 15]} />
          <meshPhysicalMaterial {...M.epoxy} />
        </mesh>
        <mesh position={[22, -1.0, 0]}>
          <boxGeometry args={[18, 1, 12]} />
          <meshPhysicalMaterial color="#2a2c30" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>

      {/* Wireless module antenna leads */}
      <mesh position={[38, 1.5, -18]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.9, 0.9, 16, 10]} />
        <meshPhysicalMaterial color="#1a1a1a" side={DoubleSide} />
      </mesh>
    </group>
  );
}
