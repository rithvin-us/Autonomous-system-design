import { useState } from 'react';
import type { VisualProps } from './registry';

export default function HardwareChain({ visual }: VisualProps<'hardwareChain'>) {
  const [estopTripped, setEstopTripped] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px 0 20px',
      }}
    >
      {/* 5 Hardware Stages Pipeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
          alignItems: 'center',
          flex: 1,
          position: 'relative',
        }}
      >
        {visual.stages.map((stage, idx) => {
          const isActuatorStage = stage.id === 'driver' || stage.id === 'actuator';
          const isCut = estopTripped && isActuatorStage;

          return (
            <div key={stage.id} style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 12,
                  background: isCut ? 'rgba(226, 59, 46, 0.12)' : 'var(--bg-2)',
                  border: isCut ? '2px solid #e23b2e' : '1.5px solid var(--line)',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  transition: 'all 200ms ease',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--f-head)',
                    color: isCut ? '#e23b2e' : 'var(--c-orange)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Stage 0{idx + 1}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--f-head)',
                    fontSize: 20,
                    fontWeight: 800,
                    color: 'var(--fg)',
                  }}
                >
                  {stage.label}
                </div>

                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {stage.detail}
                </div>

                {/* Status indicator */}
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 11,
                    fontFamily: 'var(--f-head)',
                    fontWeight: 700,
                    color: isCut ? '#e23b2e' : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: isCut ? '#e23b2e' : '#10b981',
                    }}
                  />
                  {isCut ? 'POWER ISOLATED' : 'ACTIVE'}
                </div>
              </div>

              {/* Connecting Bus Label to next stage */}
              {idx < visual.links.length && (
                <div
                  style={{
                    position: 'absolute',
                    right: -14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 5,
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: 'var(--bg-3)',
                    border: '1px solid var(--line)',
                    fontSize: 10,
                    fontFamily: 'monospace',
                    color: 'var(--c-orange)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {visual.links[idx]} →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Emergency Stop Safety Circuit Banner */}
      <div
        style={{
          marginTop: 20,
          padding: '16px 28px',
          borderRadius: 12,
          background: estopTripped ? 'rgba(226, 59, 46, 0.15)' : 'var(--bg-2)',
          border: estopTripped ? '2px solid #e23b2e' : '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 200ms ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button
            onClick={() => setEstopTripped((cur) => !cur)}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              background: estopTripped ? '#e23b2e' : '#8a9199',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--f-head)',
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: estopTripped ? '0 0 20px rgba(226, 59, 46, 0.5)' : 'none',
            }}
          >
            <span style={{ fontSize: 16 }}>🛑</span>
            {estopTripped ? 'RESET E-STOP' : 'TRIP E-STOP'}
          </button>
          <div>
            <div style={{ fontFamily: 'var(--f-head)', fontSize: 16, fontWeight: 700, color: 'var(--fg)' }}>
              {visual.estop}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
              Independent hard-wired circuit disconnects motor driver power rail without relying on operating system or software logic.
            </div>
          </div>
        </div>

        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            color: estopTripped ? '#e23b2e' : '#10b981',
            fontWeight: 700,
          }}
        >
          CIRCUIT STATE: {estopTripped ? 'OPEN (DE-ENERGIZED)' : 'CLOSED (ENERGIZED)'}
        </span>
      </div>
    </div>
  );
}
