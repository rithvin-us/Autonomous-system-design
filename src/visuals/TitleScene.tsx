import { Grid } from '@react-three/drei';
import { deck } from '../content/deck';
import { AssetTag } from '../layouts/AssetTag';
import { VehicleModel } from '../models/Vehicle';
import { useSlide } from '../shell/contexts';
import { ModelSource } from '../three/GlbModel';
import { ModelStage } from '../three/ModelStage';
import { SnapshotImage } from '../three/SnapshotImage';
import type { VisualProps } from './registry';

/**
 * Slide 01: the vehicle in a dark studio, slowly turning, on an engineering
 * grid. Title sits bottom-left over the open floor.
 */
export default function TitleScene(_props: VisualProps<'titleScene'>) {
  const { mode, slide } = useSlide();
  return (
    <>
      {mode === 'thumb' ? (
        <SnapshotImage id={slide.id} style={{ inset: 0 }} />
      ) : (
        <ModelStage
          camera={{ position: [4.6, 2.0, 4.4], target: [0, 0.22, 0], fov: 30, minDistance: 3, maxDistance: 12 }}
          autoRotateSpeed={0.25}
          lighting="dark"
          shadow={{ y: 0.001, opacity: 0.65, scale: 3.6, blur: 2.0, far: 1.6 }}
          snapshotId={slide.id}
          viewCenterX={0.64}
          viewCenterY={0.70}
          style={{ inset: 0 }}
        >
          {/* Warm rim light from behind */}
          <pointLight position={[-2.5, 2.2, -3]} intensity={18} color="#ff7a2e" distance={9} />
          <Grid
            position={[0, 0, 0]}
            args={[20, 20]}
            cellSize={0.25}
            cellThickness={0.6}
            cellColor="#24272b"
            sectionSize={1}
            sectionThickness={1}
            sectionColor="#3a3e44"
            fadeDistance={10}
            fadeStrength={2}
            infiniteGrid
          />
          <group scale={0.52}>
            <ModelSource glb={deck.vehicle.glb} transform={deck.vehicle.glbTransform} fallback={<VehicleModel />} />
          </group>
        </ModelStage>
      )}
      <AssetTag status={deck.vehicle.status} note={deck.vehicle.statusNote} style={{ left: 120, bottom: 56 }} />
    </>
  );
}
