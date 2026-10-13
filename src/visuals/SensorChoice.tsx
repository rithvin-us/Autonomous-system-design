import { useState } from 'react';
import { sensors } from '../content/sensors';
import type { VisualProps } from './registry';

export default function SensorChoice({ visual }: VisualProps<'sensorChoice'>) {
  const [activeCondition, setActiveCondition] = useState('clear');

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
      {/* Condition Selector Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            fontFamily: 'var(--f-head)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--c-orange)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginRight: 6,
          }}
        >
          Operating Condition:
        </span>
        {visual.conditions.map((cond) => {
          const isSelected = activeCondition === cond.id;
          return (
            <button
              key={cond.id}
              onClick={() => setActiveCondition(cond.id)}
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                background: isSelected ? 'var(--c-orange)' : 'var(--bg-2)',
                color: isSelected ? '#ffffff' : 'var(--c-text-dark)',
                border: isSelected ? '1px solid var(--c-orange)' : '1px solid var(--line)',
                cursor: 'pointer',
                fontFamily: 'var(--f-head)',
                fontSize: 15,
                fontWeight: 700,
                transition: 'all 160ms ease',
                boxShadow: isSelected ? '0 4px 16px rgba(255, 106, 19, 0.4)' : 'none',
              }}
            >
              {cond.label}
            </button>
          );
        })}
      </div>

      {/* 5 Sensor Comparison Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 18,
          flex: 1,
          margin: '20px 0',
        }}
      >
        {visual.sensors.map((s) => {
          const cfg = sensors[s.id];
          const isLost = s.lostIn.includes(activeCondition);
          const isDegraded = s.degradedIn.includes(activeCondition);

          const statusBadge = isLost
            ? { label: 'LOST / BLIND', bg: 'rgba(226, 59, 46, 0.2)', color: '#e23b2e', border: '#e23b2e' }
            : isDegraded
              ? { label: 'DEGRADED', bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '#f59e0b' }
              : { label: 'OPERATIONAL', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '#10b981' };

          return (
            <div
              key={s.id}
              style={{
                borderRadius: 12,
                background: isLost ? 'rgba(26, 28, 31, 0.5)' : 'var(--bg-2)',
                border: `1.5px solid ${statusBadge.border}`,
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isLost ? 0.65 : 1,
                transition: 'all 200ms ease',
                boxShadow: !isLost && !isDegraded ? '0 8px 24px rgba(0,0,0,0.18)' : 'none',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--f-head)',
                      fontSize: 20,
                      fontWeight: 800,
                      color: 'var(--fg)',
                    }}
                  >
                    {cfg?.shortName || s.id}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'var(--f-head)',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: statusBadge.bg,
                      color: statusBadge.color,
                      border: `1px solid ${statusBadge.color}`,
                    }}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--c-orange)',
                    fontWeight: 600,
                    marginTop: 6,
                    marginBottom: 16,
                  }}
                >
                  {s.measures}
                </div>

                {/* Strength */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.06em' }}>
                    Key Strength
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg)', marginTop: 2, lineHeight: 1.35 }}>
                    {s.strength}
                  </div>
                </div>

                {/* Limitation */}
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.06em' }}>
                    Limitation
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2, lineHeight: 1.35 }}>
                    {s.limit}
                  </div>
                </div>
              </div>

              {/* Status explanation note */}
              <div
                style={{
                  marginTop: 16,
                  padding: '10px 12px',
                  borderRadius: 6,
                  background: 'var(--bg-3)',
                  fontSize: 12,
                  color: isLost || isDegraded ? statusBadge.color : 'var(--muted)',
                  fontWeight: 500,
                }}
              >
                {isLost
                  ? 'Sensor signal unavailable under this condition'
                  : isDegraded
                    ? 'Performance attenuated by environmental scattering'
                    : 'Optimal signal-to-noise ratio'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthesis Insight Banner */}
      <div
        style={{
          padding: '14px 24px',
          borderRadius: 8,
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, color: 'var(--muted)' }}>
          Autonomous safety requires <strong>sensor fusion</strong>: combining complementary sensor modalities guarantees perception across all weather conditions.
        </span>
        <span
          style={{
            fontSize: 13,
            fontFamily: 'var(--f-head)',
            fontWeight: 700,
            color: 'var(--c-orange)',
          }}
        >
          Active condition: {visual.conditions.find((c) => c.id === activeCondition)?.label}
        </span>
      </div>
    </div>
  );
}
