import { RoundedBox } from '@react-three/drei';
import { M } from '../three/materials';

/**
 * Small generic wheeled vehicle for scenario scenes (slides 20, 24).
 * Not the team vehicle. Units: metres-ish scene units, forward +Z.
 * `steer` turns the front wheels (radians, + = towards +X).
 */
export function MiniRover({ steer = 0, highlightSensors = false }: { steer?: number; highlightSensors?: boolean }) {
  const wheel = (x: number, z: number, front: boolean) => (
    <group key={`${x}${z}`} position={[x, 0.32, z]} rotation-y={front ? steer : 0}>
      <mesh rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.32, 0.32, 0.26, 32]} />
        <meshPhysicalMaterial {...M.rubber} />
      </mesh>
      <mesh rotation-z={Math.PI / 2} position={[x > 0 ? 0.135 : -0.135, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
        <meshPhysicalMaterial {...M.aluminium} />
      </mesh>
    </group>
  );
  const sensorEmissive = highlightSensors ? 0.8 : 0;
  return (
    <group>
      <RoundedBox args={[1.3, 0.42, 2.3]} radius={0.12} smoothness={4} position={[0, 0.58, 0]}>
        <meshPhysicalMaterial color="#d8d4cc" roughness={0.55} />
      </RoundedBox>
      <RoundedBox args={[1.08, 0.34, 1.25]} radius={0.1} smoothness={4} position={[0, 0.95, -0.2]}>
        <meshPhysicalMaterial color="#2a2d31" roughness={0.35} metalness={0.2} clearcoat={0.6} />
      </RoundedBox>
      {/* Roof sensor bar and front radar (orange = sensors) */}
      <mesh position={[0, 1.16, 0.05]}>
        <boxGeometry args={[0.8, 0.08, 0.16]} />
        <meshStandardMaterial color="#ff6a13" emissive="#ff6a13" emissiveIntensity={sensorEmissive} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 1.17]}>
        <boxGeometry args={[0.42, 0.16, 0.06]} />
        <meshStandardMaterial color="#ff6a13" emissive="#ff6a13" emissiveIntensity={sensorEmissive} roughness={0.5} />
      </mesh>
      {wheel(0.72, 0.78, true)}
      {wheel(-0.72, 0.78, true)}
      {wheel(0.72, -0.78, false)}
      {wheel(-0.72, -0.78, false)}
    </group>
  );
}
