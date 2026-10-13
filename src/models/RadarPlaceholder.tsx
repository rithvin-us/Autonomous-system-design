import { Edges } from '@react-three/drei';
import { useMemo } from 'react';
import { extrudeCentered, roundedRect } from '../three/geometry';
import { M } from '../three/materials';

/**
 * PLACEHOLDER for the Starkenn radar.
 * The exact unit has not been identified, so this is a neutral stand-in:
 * a plain housing with a sensing face, a generic bracket and a connector stub.
 * Its size and details are NOT the product's. Replace via sensors.ts → glb.
 * Units: millimetres. Origin: housing centre. Sensing face points +Z.
 */
export const RADAR_PLACEHOLDER = { width: 92, height: 76, depth: 24 } as const;

export function RadarPlaceholderModel() {
  const { width: W, height: H, depth: D } = RADAR_PLACEHOLDER;
  const housing = useMemo(() => extrudeCentered(roundedRect(W - 4, H - 4, 8), D, { bevel: 2 }), [W, H, D]);
  const radome = useMemo(() => extrudeCentered(roundedRect(W - 10, H - 10, 6), 3, { bevel: 1.2 }), [W, H]);

  return (
    <group>
      <mesh geometry={housing}>
        <meshPhysicalMaterial {...M.plasticGrey} />
      </mesh>
      <mesh geometry={radome} position={[0, 0, D / 2 + 0.6]}>
        <meshPhysicalMaterial {...M.plasticLight} />
      </mesh>

      {/* Generic L-bracket under and behind the housing */}
      <group>
        <mesh position={[0, -H / 2 - 3, -2]}>
          <boxGeometry args={[60, 4, 30]} />
          <meshPhysicalMaterial {...M.aluminium} />
        </mesh>
        <mesh position={[0, -H / 2 + 6, -D / 2 - 3]}>
          <boxGeometry args={[60, 22, 4]} />
          <meshPhysicalMaterial {...M.aluminium} />
        </mesh>
        {[-20, 20].map((x) => (
          <mesh key={x} position={[x, -H / 2 + 6, -D / 2 - 5.4]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[3.2, 3.2, 1.2, 6]} />
            <meshPhysicalMaterial {...M.steel} />
          </mesh>
        ))}
      </group>

      {/* Connector stub (type and position unknown) */}
      <group position={[36, -14, -D / 2]}>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, -6]}>
          <cylinderGeometry args={[6.5, 6.5, 12, 32]} />
          <meshPhysicalMaterial {...M.plasticBlack} />
        </mesh>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, -9]}>
          <cylinderGeometry args={[7.1, 7.1, 2, 32]} />
          <meshPhysicalMaterial {...M.plasticBlack} />
        </mesh>
      </group>

      {/* Dashed envelope marks this as a stand-in, not real geometry */}
      <mesh position={[0, 0, -3]}>
        <boxGeometry args={[W + 10, H + 10, D + 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges color="#ff6a13" lineWidth={1.5} dashed dashSize={4} gapSize={3} />
      </mesh>
    </group>
  );
}
