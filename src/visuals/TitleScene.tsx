import { deck } from '../content/deck';
import { AssetTag } from '../layouts/AssetTag';
import { BuggyModel } from '../models/Buggy';
import { useSlide } from '../shell/contexts';
import { ModelStage } from '../three/ModelStage';
import { SnapshotImage } from '../three/SnapshotImage';

const CANVAS = { inset: 0 } as const;

export default function TitleScene() {
  const { mode, slide } = useSlide();

  const camera = {
    position: [2.6, 1.3, 3.2] as [number, number, number],
    target: [0.3, 0.45, 0] as [number, number, number],
    fov: 34,
    minDistance: 2.2,
    maxDistance: 12,
  };

  return (
    <>
      {mode === 'thumb' ? (
        <SnapshotImage id={slide.id} style={CANVAS} />
      ) : (
        <ModelStage
          camera={camera}
          autoRotateSpeed={0.4}
          autoRotate={true}
          lighting="dark"
          shadow={{ y: -0.01, opacity: 0.55, scale: 9, blur: 2.5, far: 2.2, live: true }}
          snapshotId={slide.id}
          style={CANVAS}
        >
          <group position={[0.3, 0, 0]} scale={0.0016}>
            <BuggyModel />
          </group>
        </ModelStage>
      )}

      {/* Decorative subtitle accent badge */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 20px',
          borderRadius: 999,
          background: 'rgba(255, 106, 19, 0.08)',
          border: '1px solid rgba(255, 106, 19, 0.25)',
          color: 'var(--c-orange)',
          fontSize: 14,
          fontFamily: 'var(--f-head)',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--c-orange)',
            boxShadow: '0 0 10px var(--c-orange)',
          }}
        />
        Interactive Autonomous Systems Deck
      </div>

      <AssetTag status={deck.vehicle.status} note={deck.vehicle.statusNote} style={{ right: 120, bottom: 56 }} />
    </>
  );
}
