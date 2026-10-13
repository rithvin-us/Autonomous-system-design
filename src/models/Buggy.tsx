import { M } from '../three/materials';
import { GnssModel } from './GnssAntenna';
import { HcSr04Model } from './HcSr04';
import { ImuBoardModel } from './ImuBoard';
import { RadarPlaceholderModel } from './RadarPlaceholder';
import { Zed2iModel } from './Zed2i';

export interface BuggyProps {
  /** Optional subsystem to highlight: 'sensors', 'computing', 'actuators'. */
  highlight?: 'sensors' | 'computing' | 'actuators' | null;
  /** Exploded layers factor (0 = assembled, 1 = fully exploded). */
  explodeFactor?: number;
}

export const BUGGY_DIMS = {
  length: 1600, // mm
  width: 950,
  height: 720,
  wheelbase: 1100,
  track: 820,
  tireRadius: 170,
  tireWidth: 90,
};

/** A detailed procedural off-road autonomous buggy */
export function BuggyModel({ highlight, explodeFactor = 0 }: BuggyProps) {
  // Highlight emission helpers
  const isSensors = highlight === 'sensors';
  const isComputing = highlight === 'computing';
  const isActuators = highlight === 'actuators';
  const anyHighlight = highlight !== null && highlight !== undefined;

  const sensorMat = isSensors
    ? { ...M.orange, emissive: '#ff6a13', emissiveIntensity: 0.55 }
    : anyHighlight
      ? { ...M.plasticGrey, roughness: 0.7 }
      : M.orange;

  const computeMat = isComputing
    ? { ...M.anodisedDark, emissive: '#ff6a13', emissiveIntensity: 0.6 }
    : anyHighlight
      ? { ...M.plasticGrey, roughness: 0.7 }
      : M.anodisedDark;

  const actuatorMat = isActuators
    ? { ...M.steel, emissive: '#ff6a13', emissiveIntensity: 0.6 }
    : anyHighlight
      ? { ...M.plasticGrey, roughness: 0.7 }
      : M.steel;

  // Layer vertical offsets when exploded
  const ySensors = explodeFactor * 320;
  const yCompute = explodeFactor * 100;
  const yInterfaces = explodeFactor * 10;
  const yChassis = explodeFactor * -90;

  return (
    <group position={[0, 0, 0]}>
      {/* ---------------- LAYER: CHASSIS & WHEELS (BASE) ---------------- */}
      <group position={[0, yChassis, 0]}>
        {/* Main tubular spaceframe chassis */}
        <group>
          {/* Lower frame rails */}
          <mesh position={[-260, 100, 0]}>
            <boxGeometry args={[40, 40, BUGGY_DIMS.wheelbase + 200]} />
            <meshPhysicalMaterial {...M.frame} roughness={0.4} />
          </mesh>
          <mesh position={[260, 100, 0]}>
            <boxGeometry args={[40, 40, BUGGY_DIMS.wheelbase + 200]} />
            <meshPhysicalMaterial {...M.frame} roughness={0.4} />
          </mesh>
          {/* Crossmembers */}
          {[-500, -200, 100, 400, 600].map((z) => (
            <mesh key={`cross-${z}`} position={[0, 100, z]}>
              <boxGeometry args={[520, 36, 36]} />
              <meshPhysicalMaterial {...M.frame} roughness={0.4} />
            </mesh>
          ))}
          {/* Underbody skid plate */}
          <mesh position={[0, 80, 0]}>
            <boxGeometry args={[540, 12, BUGGY_DIMS.wheelbase + 120]} />
            <meshPhysicalMaterial {...M.plasticBlack} roughness={0.7} />
          </mesh>

          {/* Roll cage struts & roof hoop */}
          {/* Front uprights */}
          <mesh position={[-250, 270, 200]} rotation={[0.4, 0, -0.15]}>
            <cylinderGeometry args={[18, 18, 380, 12]} />
            <meshPhysicalMaterial {...M.frame} />
          </mesh>
          <mesh position={[250, 270, 200]} rotation={[0.4, 0, 0.15]}>
            <cylinderGeometry args={[18, 18, 380, 12]} />
            <meshPhysicalMaterial {...M.frame} />
          </mesh>
          {/* Rear uprights */}
          <mesh position={[-250, 270, -350]} rotation={[-0.2, 0, -0.1]}>
            <cylinderGeometry args={[18, 18, 380, 12]} />
            <meshPhysicalMaterial {...M.frame} />
          </mesh>
          <mesh position={[250, 270, -350]} rotation={[-0.2, 0, 0.1]}>
            <cylinderGeometry args={[18, 18, 380, 12]} />
            <meshPhysicalMaterial {...M.frame} />
          </mesh>
          {/* Roof halo rails */}
          <mesh position={[-200, 440, -80]}>
            <boxGeometry args={[32, 32, 560]} />
            <meshPhysicalMaterial {...M.frame} />
          </mesh>
          <mesh position={[200, 440, -80]}>
            <boxGeometry args={[32, 32, 560]} />
            <meshPhysicalMaterial {...M.frame} />
          </mesh>
          <mesh position={[0, 440, 190]}>
            <boxGeometry args={[420, 32, 32]} />
            <meshPhysicalMaterial {...M.frame} />
          </mesh>
          <mesh position={[0, 440, -350]}>
            <boxGeometry args={[420, 32, 32]} />
            <meshPhysicalMaterial {...M.frame} />
          </mesh>

          {/* Front bumper bar */}
          <mesh position={[0, 120, 720]}>
            <boxGeometry args={[680, 42, 42]} />
            <meshPhysicalMaterial {...M.orange} />
          </mesh>
          {/* Rear bumper bar */}
          <mesh position={[0, 120, -680]}>
            <boxGeometry args={[680, 42, 42]} />
            <meshPhysicalMaterial {...M.orange} />
          </mesh>
        </group>

        {/* Suspension A-arms and 4 Wheels */}
        <group>
          {[
            { id: 'FL', x: -BUGGY_DIMS.track / 2, z: BUGGY_DIMS.wheelbase / 2, steer: 0.12 },
            { id: 'FR', x: BUGGY_DIMS.track / 2, z: BUGGY_DIMS.wheelbase / 2, steer: 0.12 },
            { id: 'RL', x: -BUGGY_DIMS.track / 2, z: -BUGGY_DIMS.wheelbase / 2, steer: 0 },
            { id: 'RR', x: BUGGY_DIMS.track / 2, z: -BUGGY_DIMS.wheelbase / 2, steer: 0 },
          ].map((w) => (
            <group key={w.id} position={[w.x, 0, w.z]}>
              {/* Suspension A-arm */}
              <mesh position={[w.x > 0 ? -90 : 90, 110, 0]} rotation={[0, 0, w.x > 0 ? 0.2 : -0.2]}>
                <boxGeometry args={[140, 18, 120]} />
                <meshPhysicalMaterial {...M.steel} />
              </mesh>
              {/* Coil spring shock */}
              <mesh position={[w.x > 0 ? -60 : 60, 160, 0]} rotation={[0, 0, w.x > 0 ? -0.4 : 0.4]}>
                <cylinderGeometry args={[22, 22, 160, 12]} />
                <meshPhysicalMaterial {...M.orange} />
              </mesh>
              {/* Wheel knuckle & tire */}
              <group position={[0, BUGGY_DIMS.tireRadius, 0]} rotation={[0, w.steer, 0]}>
                {/* Rubber tire */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[BUGGY_DIMS.tireRadius, BUGGY_DIMS.tireRadius, BUGGY_DIMS.tireWidth, 24]} />
                  <meshPhysicalMaterial {...M.rubber} />
                </mesh>
                {/* Tire tread blocks */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <mesh
                    key={`tread-${i}`}
                    rotation={[(i * Math.PI) / 6, 0, 0]}
                    position={[0, 0, BUGGY_DIMS.tireRadius - 2]}
                  >
                    <boxGeometry args={[BUGGY_DIMS.tireWidth - 8, 14, 12]} />
                    <meshPhysicalMaterial {...M.rubber} roughness={0.98} />
                  </mesh>
                ))}
                {/* Steel rim */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[BUGGY_DIMS.tireRadius * 0.58, BUGGY_DIMS.tireRadius * 0.58, BUGGY_DIMS.tireWidth + 4, 16]} />
                  <meshPhysicalMaterial {...M.steel} />
                </mesh>
                {/* Hub hex & bolts */}
                <mesh position={[w.x > 0 ? 48 : -48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[32, 32, 12, 6]} />
                  <meshPhysicalMaterial {...M.aluminium} />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      </group>

      {/* ---------------- LAYER: ACTUATORS (MOTORS & STEERING) ---------------- */}
      <group position={[0, yInterfaces + (isActuators ? 30 : 0), 0]}>
        {/* Front Steering Rack & Servo Linkage */}
        <mesh position={[0, 130, BUGGY_DIMS.wheelbase / 2]}>
          <boxGeometry args={[380, 40, 50]} />
          <meshPhysicalMaterial {...actuatorMat} />
        </mesh>
        <mesh position={[0, 175, BUGGY_DIMS.wheelbase / 2]}>
          <boxGeometry args={[110, 80, 90]} />
          <meshPhysicalMaterial {...actuatorMat} />
        </mesh>
        {/* Steering tie rods */}
        <mesh position={[-240, 130, BUGGY_DIMS.wheelbase / 2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[10, 10, 200, 12]} />
          <meshPhysicalMaterial {...actuatorMat} />
        </mesh>
        <mesh position={[240, 130, BUGGY_DIMS.wheelbase / 2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[10, 10, 200, 12]} />
          <meshPhysicalMaterial {...actuatorMat} />
        </mesh>

        {/* Rear Drive Electric Motor & Differential */}
        <mesh position={[0, 130, -BUGGY_DIMS.wheelbase / 2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[65, 65, 260, 20]} />
          <meshPhysicalMaterial {...actuatorMat} />
        </mesh>
        {/* Motor power stage / dual H-bridge driver heatsink */}
        <mesh position={[0, 190, -BUGGY_DIMS.wheelbase / 2 + 100]}>
          <boxGeometry args={[200, 48, 140]} />
          <meshPhysicalMaterial {...actuatorMat} />
        </mesh>
      </group>

      {/* ---------------- LAYER: COMPUTING (JETSON ORIN + MCU) ---------------- */}
      <group position={[0, yCompute + (isComputing ? 50 : 0), 0]}>
        {/* Electronics mounting tray */}
        <mesh position={[0, 150, 0]}>
          <boxGeometry args={[440, 14, 520]} />
          <meshPhysicalMaterial {...M.plasticBlack} />
        </mesh>
        {/* NVIDIA Jetson Orin Enclosure with cooling heatsink fins */}
        <mesh position={[0, 200, 40]}>
          <boxGeometry args={[220, 68, 180]} />
          <meshPhysicalMaterial {...computeMat} />
        </mesh>
        {/* Jetson heatsink fins */}
        {[-80, -50, -20, 10, 40, 70].map((x) => (
          <mesh key={`fin-${x}`} position={[x, 240, 40]}>
            <boxGeometry args={[8, 16, 170]} />
            <meshPhysicalMaterial {...computeMat} />
          </mesh>
        ))}
        {/* Microcontroller real-time board (MCU) */}
        <mesh position={[0, 180, -150]}>
          <boxGeometry args={[130, 28, 90]} />
          <meshPhysicalMaterial {...M.pcbBlue} />
        </mesh>
        {/* Compute status LEDs */}
        <mesh position={[90, 202, 132]}>
          <boxGeometry args={[14, 6, 6]} />
          <meshBasicMaterial color={isComputing ? '#ff6a13' : '#34d399'} />
        </mesh>
        <mesh position={[70, 202, 132]}>
          <boxGeometry args={[14, 6, 6]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
      </group>

      {/* ---------------- LAYER: SENSORS (ROOF MAST & MOUNTS) ---------------- */}
      <group position={[0, ySensors + (isSensors ? 60 : 0), 0]}>
        {/* Roof Camera & Sensor Mast */}
        <mesh position={[0, 480, 160]}>
          <cylinderGeometry args={[16, 20, 90, 12]} />
          <meshPhysicalMaterial {...M.frame} />
        </mesh>
        <mesh position={[0, 525, 160]}>
          <boxGeometry args={[190, 14, 60]} />
          <meshPhysicalMaterial {...sensorMat} />
        </mesh>

        {/* 1. Stereo Camera (ZED 2i) mounted on mast */}
        <group position={[0, 545, 160]} scale={0.9}>
          <Zed2iModel />
        </group>

        {/* 2. Front Radar (Starkenn) on front bumper */}
        <group position={[0, 150, 735]} rotation={[0, 0, 0]} scale={0.85}>
          <RadarPlaceholderModel />
        </group>

        {/* 3. GNSS Antenna dome on elevated rear mast */}
        <mesh position={[140, 490, -320]}>
          <cylinderGeometry args={[12, 14, 110, 12]} />
          <meshPhysicalMaterial {...M.frame} />
        </mesh>
        <group position={[140, 550, -320]} scale={0.85}>
          <GnssModel />
        </group>

        {/* 4. IMU Board inside chassis center */}
        <group position={[0, 168, -40]} scale={0.75}>
          <ImuBoardModel />
        </group>

        {/* 5. Ultrasonic sensors on front corners */}
        <group position={[-250, 120, 715]} rotation={[0, 0.25, 0]} scale={0.7}>
          <HcSr04Model />
        </group>
        <group position={[250, 120, 715]} rotation={[0, -0.25, 0]} scale={0.7}>
          <HcSr04Model />
        </group>
      </group>

      {/* Highlighting Halo Rings when a subsystem is selected */}
      {isSensors && (
        <group position={[0, 360, 200]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[560, 12, 16, 48]} />
            <meshBasicMaterial color="#ff6a13" wireframe />
          </mesh>
        </group>
      )}
      {isComputing && (
        <group position={[0, 200, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[360, 10, 16, 48]} />
            <meshBasicMaterial color="#ff6a13" wireframe />
          </mesh>
        </group>
      )}
      {isActuators && (
        <group position={[0, 120, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[650, 12, 16, 48]} />
            <meshBasicMaterial color="#ff6a13" wireframe />
          </mesh>
        </group>
      )}
    </group>
  );
}
