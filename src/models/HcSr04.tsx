import { RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import { extrudeCentered, plateWithHoles } from '../three/geometry';
import { M } from '../three/materials';
import { Pin, PlatedRing, Silk, useMeshTexture } from './parts';

/**
 * HC-SR04 ultrasonic module — illustrative reconstruction from typical
 * vendor data: 45 × 20 mm board, two ~16 mm transducers marked T and R,
 * crystal between them, 4-pin header (Vcc, Trig, Echo, Gnd) at the bottom
 * edge, a mounting hole in each corner, driver ICs on the back.
 * Units: millimetres. Origin: board centre. Transducers face +Z.
 */
export const HCSR04 = {
  width: 45,
  height: 20,
  thickness: 1.6,
  canRadius: 8,
  canLength: 12,
  /** Transducer centres. */
  tx: [-13, 1.5] as const,
  rx: [13, 1.5] as const,
} as const;

const FRONT = HCSR04.thickness / 2;
const BACK = -FRONT;
const PIN_Y = -9;
const PIN_X = [-3.81, -1.27, 1.27, 3.81];
const HOLES: [number, number][] = [
  [-20.2, 7.8],
  [20.2, 7.8],
  [-20.2, -7.8],
  [20.2, -7.8],
];

function Transducer({ x, y, mesh }: { x: number; y: number; mesh: ReturnType<typeof useMeshTexture> }) {
  const { canRadius: r, canLength: L } = HCSR04;
  return (
    <group position={[x, y, FRONT]}>
      <mesh rotation-x={Math.PI / 2} position={[0, 0, L / 2]}>
        <cylinderGeometry args={[r, r, L, 72, 1, true]} />
        <meshPhysicalMaterial {...M.aluminium} color="#b8bcc1" roughness={0.32} side={2} />
      </mesh>
      {/* Rolled front lip */}
      <mesh position={[0, 0, L - 0.35]}>
        <torusGeometry args={[r - 0.35, 0.38, 14, 72]} />
        <meshPhysicalMaterial {...M.aluminium} color="#c4c8cc" roughness={0.28} />
      </mesh>
      {/* Protective mesh, set slightly back */}
      <mesh position={[0, 0, L - 0.9]}>
        <circleGeometry args={[r - 0.55, 64]} />
        <meshStandardMaterial map={mesh} metalness={0.55} roughness={0.5} />
      </mesh>
      {/* Base ring where the can meets the board */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.5]}>
        <cylinderGeometry args={[r + 0.25, r + 0.25, 1, 72]} />
        <meshPhysicalMaterial {...M.aluminium} color="#a9adb2" roughness={0.4} />
      </mesh>
    </group>
  );
}

function SoIc({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const leads = Math.round(w / 1.27);
  return (
    <group position={[x, y, BACK]}>
      <mesh position={[0, 0, -0.75]}>
        <boxGeometry args={[w, h, 1.5]} />
        <meshPhysicalMaterial {...M.epoxy} />
      </mesh>
      {Array.from({ length: leads }, (_, i) => -w / 2 + 0.64 + i * 1.27).flatMap((lx) =>
        [-1, 1].map((side) => (
          <mesh key={`${lx}${side}`} position={[lx, side * (h / 2 + 0.45), -0.3]}>
            <boxGeometry args={[0.42, 0.9, 0.25]} />
            <meshPhysicalMaterial {...M.steel} />
          </mesh>
        )),
      )}
    </group>
  );
}

export function HcSr04Model() {
  const mesh = useMeshTexture(13);
  const pcb = useMemo(
    () =>
      extrudeCentered(
        plateWithHoles(HCSR04.width, HCSR04.height, 0.8, [
          ...HOLES.map(([x, y]) => [x, y, 0.95] as [number, number, number]),
          ...PIN_X.map((x) => [x, PIN_Y, 0.5] as [number, number, number]),
        ]),
        HCSR04.thickness,
        { crease: 0.5, curveSegments: 16 },
      ),
    [],
  );

  return (
    <group>
      <mesh geometry={pcb}>
        <meshPhysicalMaterial {...M.pcbBlue} />
      </mesh>

      <Transducer x={HCSR04.tx[0]} y={HCSR04.tx[1]} mesh={mesh} />
      <Transducer x={HCSR04.rx[0]} y={HCSR04.rx[1]} mesh={mesh} />

      {/* Crystal oscillator (HC-49/S), lying flat between the transducers */}
      <RoundedBox args={[10.5, 4, 3.5]} radius={1.6} smoothness={6} position={[0, 6.6, FRONT + 1.75]}>
        <meshPhysicalMaterial {...M.steel} roughness={0.22} />
      </RoundedBox>

      {/* Mounting holes */}
      {HOLES.map(([x, y]) => (
        <group key={`${x}${y}`}>
          <PlatedRing position={[x, y, FRONT + 0.01]} r={0.95} ring={0.7} rotation={[0, 0, 0]} />
          <PlatedRing position={[x, y, BACK - 0.01]} r={0.95} ring={0.7} rotation={[Math.PI, 0, 0]} />
        </group>
      ))}

      {/* Silkscreen */}
      <Silk text="T" position={[-3.4, -2.6, FRONT + 0.02]} width={2.6} height={2.4} />
      <Silk text="R" position={[3.4, -2.6, FRONT + 0.02]} width={2.6} height={2.4} />
      <Silk text="Vcc  Trig  Echo  Gnd" position={[0, -6.9, FRONT + 0.02]} width={11} height={1.5} />

      {/* Header: solder joints on the front, right-angle pins on the back */}
      {PIN_X.map((x) => (
        <group key={x}>
          <PlatedRing position={[x, PIN_Y, FRONT + 0.01]} r={0.5} ring={0.45} rotation={[0, 0, 0]} />
          <mesh position={[x, PIN_Y, FRONT + 0.3]} rotation-x={Math.PI / 2}>
            <coneGeometry args={[0.75, 0.6, 16]} />
            <meshPhysicalMaterial {...M.steel} roughness={0.2} />
          </mesh>
          <Pin position={[x, PIN_Y, BACK - 1.25]} length={2.5} rotation={[Math.PI / 2, 0, 0]} />
          <Pin position={[x, PIN_Y - 3.6, BACK - 2.05]} length={7.6} />
        </group>
      ))}
      <mesh position={[0, PIN_Y + 0.2, BACK - 2.05]}>
        <boxGeometry args={[10.16, 2.5, 2.5]} />
        <meshPhysicalMaterial {...M.plasticBlack} />
      </mesh>

      {/* Driver and receiver ICs on the back */}
      <SoIc x={-11} y={-1} w={5} h={4} />
      <SoIc x={0} y={1.2} w={8.7} h={4} />
      <SoIc x={11} y={-1} w={5} h={4} />
      {[
        [-15.5, 5.5],
        [-6, -6],
        [6, -6],
        [15.5, 5.5],
        [-4.5, 6.5],
        [4.5, 6.5],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, BACK - 0.25]}>
          <boxGeometry args={[1.6, 0.8, 0.5]} />
          {i % 2 ? <meshPhysicalMaterial {...M.ceramic} /> : <meshPhysicalMaterial {...M.epoxy} />}
        </mesh>
      ))}
    </group>
  );
}

/** Lowest point of the model (pin tips), for floor and shadow placement. */
export const HCSR04_FLOOR_Y = PIN_Y - 3.6 - 3.8;
