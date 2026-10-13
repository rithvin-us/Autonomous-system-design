import { useMemo } from 'react';
import { extrudeCentered, plateWithHoles } from '../three/geometry';
import { M } from '../three/materials';
import { Pin, PlatedRing, SilkDrawing } from './parts';

/**
 * Illustrative IMU breakout board (not a specific product).
 * 25 × 20 mm board, one IMU chip (accelerometer + gyroscope), support parts,
 * two mounting holes and a 6-pin header underneath.
 * Units: millimetres. Origin: board centre. Board lies flat, top face +Y.
 */
export const IMU_BOARD = { width: 25, depth: 20, thickness: 1.6 } as const;

const TOP = IMU_BOARD.thickness / 2;
const HEADER_Z = 8;
const PIN_X = Array.from({ length: 6 }, (_, i) => -6.35 + i * 2.54);
const HOLES: [number, number][] = [
  [-9.5, -7],
  [9.5, -7],
];

function drawAxes(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // X to the right, Y towards the top edge, Z out of the board (dot in circle).
  const s = w / 100;
  ctx.strokeStyle = ctx.fillStyle = '#f1f1ec';
  ctx.lineWidth = 3.2 * s;
  ctx.lineCap = 'square';
  const ox = 26 * s;
  const oy = h - 26 * s;
  const arrow = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2 + Math.cos(a) * 6 * s, y2 + Math.sin(a) * 6 * s);
    ctx.lineTo(x2 + Math.cos(a + 2.4) * 9 * s, y2 + Math.sin(a + 2.4) * 9 * s);
    ctx.lineTo(x2 + Math.cos(a - 2.4) * 9 * s, y2 + Math.sin(a - 2.4) * 9 * s);
    ctx.fill();
  };
  arrow(ox, oy, ox + 46 * s, oy);
  arrow(ox, oy, ox, oy - 46 * s);
  ctx.beginPath();
  ctx.arc(ox, oy, 7 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ox, oy, 2.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `700 ${17 * s}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('X', ox + 66 * s, oy);
  ctx.fillText('Y', ox, oy - 64 * s);
  ctx.fillText('Z', ox - 15 * s, oy + 15 * s);
}

export function ImuBoardModel() {
  const pcb = useMemo(
    () =>
      extrudeCentered(
        plateWithHoles(
          IMU_BOARD.width,
          IMU_BOARD.depth,
          1.2,
          [
            ...HOLES.map(([x, z]) => [x, -z, 1.5] as [number, number, number]),
            ...PIN_X.map((x) => [x, -HEADER_Z, 0.5] as [number, number, number]),
          ],
        ),
        IMU_BOARD.thickness,
        { crease: 0.5, curveSegments: 16 },
      ),
    [],
  );

  return (
    <group>
      <mesh geometry={pcb} rotation-x={-Math.PI / 2}>
        <meshPhysicalMaterial {...M.pcbPurple} />
      </mesh>

      {/* IMU chip (QFN) with pin-1 mark and edge pads */}
      <mesh position={[0, TOP + 0.45, 0]}>
        <boxGeometry args={[4, 0.9, 4]} />
        <meshPhysicalMaterial {...M.epoxy} />
      </mesh>
      <mesh position={[-1.35, TOP + 0.91, -1.35]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.28, 20]} />
        <meshStandardMaterial color="#3a3c40" roughness={0.4} />
      </mesh>
      {[-1, 1].flatMap((side) =>
        [-1.25, -0.75, -0.25, 0.25, 0.75, 1.25].flatMap((o) => [
          <mesh key={`a${side}${o}`} position={[side * 2.15, TOP + 0.08, o]}>
            <boxGeometry args={[0.35, 0.16, 0.22]} />
            <meshPhysicalMaterial {...M.steel} />
          </mesh>,
          <mesh key={`b${side}${o}`} position={[o, TOP + 0.08, side * 2.15]}>
            <boxGeometry args={[0.22, 0.16, 0.35]} />
            <meshPhysicalMaterial {...M.steel} />
          </mesh>,
        ]),
      )}

      {/* Voltage regulator (SOT-23) */}
      <group position={[-7.5, TOP, 1.5]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[2.9, 1.1, 1.6]} />
          <meshPhysicalMaterial {...M.epoxy} />
        </mesh>
        {[-0.95, 0, 0.95].map((x) => (
          <mesh key={x} position={[x, 0.15, -1.05]}>
            <boxGeometry args={[0.4, 0.3, 0.6]} />
            <meshPhysicalMaterial {...M.steel} />
          </mesh>
        ))}
        {[-0.95, 0.95].map((x) => (
          <mesh key={x} position={[x, 0.15, 1.05]}>
            <boxGeometry args={[0.4, 0.3, 0.6]} />
            <meshPhysicalMaterial {...M.steel} />
          </mesh>
        ))}
      </group>

      {/* Capacitors and resistors (0402 / 0603) */}
      {[
        [3.4, -2.4, 'c'],
        [3.4, 2.4, 'c'],
        [-3.4, 2.4, 'c'],
        [-4.8, -3.4, 'c'],
        [-7.5, -2.2, 'c'],
        [-7.5, 4.6, 'c'],
        [-1.2, -4.6, 'r'],
        [1.2, -4.6, 'r'],
        [6.2, -1.6, 'r'],
      ].map(([x, z, kind], i) => (
        <group key={i} position={[x as number, TOP, z as number]}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[1.0, 0.5, 0.5]} />
            {kind === 'c' ? <meshPhysicalMaterial {...M.ceramic} /> : <meshPhysicalMaterial {...M.epoxy} />}
          </mesh>
          {[-0.42, 0.42].map((ex) => (
            <mesh key={ex} position={[ex, 0.25, 0]}>
              <boxGeometry args={[0.18, 0.52, 0.52]} />
              <meshPhysicalMaterial {...M.steel} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Power LED */}
      <mesh position={[4.6, TOP + 0.3, -6.8]}>
        <boxGeometry args={[1.6, 0.6, 0.8]} />
        <meshPhysicalMaterial color="#f4f1e6" roughness={0.2} transmission={0.4} thickness={0.5} />
      </mesh>

      {/* Mounting holes with plated rings */}
      {HOLES.map(([x, z]) => (
        <group key={x}>
          <PlatedRing position={[x, TOP + 0.01, z]} r={1.5} ring={0.9} />
          <PlatedRing position={[x, -TOP - 0.01, z]} r={1.5} ring={0.9} rotation={[Math.PI / 2, 0, 0]} />
        </group>
      ))}

      {/* Header: pads on top, plastic spacer and pins below */}
      {PIN_X.map((x) => (
        <group key={x}>
          <PlatedRing position={[x, TOP + 0.01, HEADER_Z]} r={0.5} ring={0.45} />
          <mesh position={[x, TOP, HEADER_Z]} scale={[1, 0.55, 1]}>
            <sphereGeometry args={[0.6, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial {...M.steel} roughness={0.38} />
          </mesh>
          <Pin position={[x, -4.2, HEADER_Z]} length={9} />
        </group>
      ))}
      <mesh position={[0, -TOP - 1.25, HEADER_Z]}>
        <boxGeometry args={[15.24, 2.5, 2.5]} />
        <meshPhysicalMaterial {...M.plasticBlack} />
      </mesh>

      {/* Axis markings */}
      <SilkDrawing draw={drawAxes} position={[8.4, TOP + 0.02, 2.2]} rotation={[-Math.PI / 2, 0, 0]} width={8} height={8} />
    </group>
  );
}

/** Lowest point of the model (pin tips), for floor and shadow placement. */
export const IMU_FLOOR_Y = -8.7;
