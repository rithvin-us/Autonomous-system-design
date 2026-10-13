import { useState } from 'react';
import { deck } from '../content/deck';
import { AssetTag } from '../layouts/AssetTag';
import { BuggyModel } from '../models/Buggy';
import { useSlide } from '../shell/contexts';
import { requestResetView } from '../shell/events';
import { IconReset } from '../shell/icons';
import { ModelStage } from '../three/ModelStage';
import { SnapshotImage } from '../three/SnapshotImage';
import type { VisualProps } from './registry';

const CANVAS = { inset: 0 } as const;

export default function VehicleOverview({ visual }: VisualProps<'vehicleOverview'>) {
  const { mode, slide } = useSlide();
  const [active, setActive] = useState<'sensors' | 'computing' | 'actuators' | null>(null);

  const camera = {
    position: [3.2, 1.8, 3.8] as [number, number, number],
    target: [0.2, 0.4, 0] as [number, number, number],
    fov: 34,
    minDistance: 2,
    maxDistance: 12,
  };

  return (
    <>
      {mode === 'thumb' ? (
        <SnapshotImage id={slide.id} style={CANVAS} />
      ) : (
        <ModelStage
          camera={camera}
          autoRotateSpeed={0.5}
          autoRotate={active === null}
          lighting="dark"
          shadow={{ y: -0.01, opacity: 0.55, scale: 9, blur: 2.5, far: 2.2, live: true }}
          snapshotId={slide.id}
          style={CANVAS}
        >
          <group position={[0.4, 0, 0]} scale={0.0016}>
            <BuggyModel highlight={active} />
          </group>
        </ModelStage>
      )}

      {/* Interactive Subsystem Inspector Bar */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          bottom: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 16,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          {visual.groups.map((g) => {
            const isSelected = active === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActive((cur) => (cur === g.id ? null : g.id))}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '14px 22px',
                  borderRadius: 8,
                  background: isSelected ? 'var(--c-orange)' : 'rgba(26, 28, 31, 0.85)',
                  color: isSelected ? '#ffffff' : 'var(--c-text-dark)',
                  border: isSelected ? '1px solid var(--c-orange)' : '1px solid var(--c-line-dark)',
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  transition: 'all 180ms ease',
                  boxShadow: isSelected ? '0 0 24px rgba(255, 106, 19, 0.45)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--f-head)',
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: '0.02em',
                  }}
                >
                  {g.label}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    opacity: isSelected ? 0.92 : 0.65,
                    marginTop: 2,
                  }}
                >
                  {g.detail}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => {
              setActive(null);
              requestResetView();
            }}
            title="Reset view (R)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 20px',
              borderRadius: 8,
              background: 'rgba(26, 28, 31, 0.85)',
              color: 'var(--c-muted-dark)',
              border: '1px solid var(--c-line-dark)',
              cursor: 'pointer',
              fontFamily: 'var(--f-head)',
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            <IconReset />
            Reset
          </button>
        </div>

        <div style={{ fontSize: 13, color: 'var(--c-muted-dark)', letterSpacing: '0.04em' }}>
          Drag to rotate · Click a subsystem to isolate
        </div>
      </div>

      <AssetTag status={deck.vehicle.status} note={deck.vehicle.statusNote} style={{ left: 120, bottom: 56 }} />
    </>
  );
}
