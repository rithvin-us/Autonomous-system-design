import { useMemo } from 'react';
import { CatmullRomCurve3, Vector3 } from 'three';
import { extrudeCentered, plateWithHoles } from '../three/geometry';
import { M } from '../three/materials';
import { Pin } from './parts';

/**
 * Illustrative GNSS hardware: a puck-style antenna under a radome, a coaxial
 * cable, and a receiver board with an SMA input and a data header.
 * Not a specific product; proportions are generic.
 * Units: millimetres. Origin: centre of the pair, at floor level.
 */
export const GNSS_LAYOUT = {
  antenna: [-39, 0, 0] as const,
  board: [50, 0, -6] as const,
};

function Board() {
  const pcb = useMemo(
    () =>
      extrudeCentered(
        plateWithHoles(46, 34, 2.5, [
          [-19.5, -13.5, 1.6],
          [19.5, -13.5, 1.6],
          [-19.5, 13.5, 1.6],
          [19.5, 13.5, 1.6],
        ]),
        1.6,
        { crease: 0.5 },
      ),
    [],
  );

  return (
    <group position={[GNSS_LAYOUT.board[0], 0, GNSS_LAYOUT.board[2]]}>
      <mesh geometry={pcb} rotation-x={-Math.PI / 2} position={[0, 0.8, 0]}>
        <meshPhysicalMaterial {...M.pcbBlack} />
      </mesh>
      {/* Receiver module under a metal shield */}
      <mesh position={[0, 1.6 + 1.2, 0]}>
        <boxGeometry args={[17, 2.4, 17]} />
        <meshPhysicalMaterial {...M.steel} roughness={0.42} />
      </mesh>
      {/* Support parts */}
      {[
        [-14, -6],
        [-14, -2],
        [-14, 2],
        [13, 9],
        [13, 12],
        [6, -12.5],
        [-4, 12.5],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.6 + 0.3, z]}>
          <boxGeometry args={[1.6, 0.6, 0.8]} />
          <meshPhysicalMaterial {...M.ceramic} />
        </mesh>
      ))}
      <mesh position={[12, 1.6 + 0.4, -10]}>
        <boxGeometry args={[3, 0.8, 1.6]} />
        <meshPhysicalMaterial {...M.epoxy} />
      </mesh>

      {/* Edge-mounted SMA jack */}
      <group position={[-23, 1.6, 0]}>
        <mesh position={[1.5, 3.2, 0]}>
          <boxGeometry args={[6.4, 6.4, 6.4]} />
          <meshPhysicalMaterial {...M.gold} />
        </mesh>
        <mesh position={[-3, 3.2, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[3.1, 3.1, 6, 32]} />
          <meshPhysicalMaterial {...M.gold} roughness={0.22} />
        </mesh>
      </group>

      {/* Data header (6 pins) */}
      <group position={[20.5, 1.6, 0]}>
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[2.5, 2.5, 15.24]} />
          <meshPhysicalMaterial {...M.plasticBlack} />
        </mesh>
        {Array.from({ length: 6 }, (_, i) => (
          <Pin key={i} position={[0, 4.2, -6.35 + i * 2.54]} length={6} />
        ))}
      </group>
    </group>
  );
}

function Antenna() {
  return (
    <group position={[GNSS_LAYOUT.antenna[0], 0, GNSS_LAYOUT.antenna[2]]}>
      {/* Base / ground plane housing */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[37, 37.6, 6, 96]} />
        <meshPhysicalMaterial {...M.plasticBlack} roughness={0.5} />
      </mesh>
      <mesh position={[0, 6.02, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[33.6, 37, 96]} />
        <meshPhysicalMaterial color="#2a2c2f" roughness={0.45} />
      </mesh>
      {/* Radome */}
      <mesh position={[0, 6, 0]} scale={[1, 0.58, 1]}>
        <sphereGeometry args={[34, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...M.plasticLight} />
      </mesh>
      {/* Cable gland */}
      <mesh position={[34.5, 3.2, 8]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[2.6, 3, 7, 24]} />
        <meshPhysicalMaterial {...M.plasticBlack} />
      </mesh>
    </group>
  );
}

function Cable() {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(-1.5, 3.2, 8),
          new Vector3(8, 2.2, 18),
          new Vector3(17, 2.2, 8),
          new Vector3(14, 2.4, -4),
          new Vector3(17, 4.8, -6),
          new Vector3(19, 4.8, -6),
        ],
        false,
        'centripetal',
      ),
    [],
  );
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 96, 1.5, 16, false]} />
        <meshPhysicalMaterial {...M.rubber} roughness={0.7} />
      </mesh>
      {/* SMA plug coupling nut on the cable end */}
      <mesh position={[21, 4.8, -6]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[4, 4, 5, 6]} />
        <meshPhysicalMaterial {...M.gold} />
      </mesh>
    </group>
  );
}

export function GnssModel() {
  return (
    <group>
      <Antenna />
      <Cable />
      <Board />
    </group>
  );
}
