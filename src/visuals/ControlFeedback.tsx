import { useEffect, useState } from 'react';
import type { VisualProps } from './registry';

export default function ControlFeedback({ visual }: VisualProps<'control'>) {
  const [feedbackOn, setFeedbackOn] = useState(true);
  const [t, setT] = useState(0);

  useEffect(() => {
    let animId: number;
    const animate = () => {
      setT((cur) => cur + 0.012);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const progress = (t % 4) / 4;
  const currentX = 60 + progress * 560;

  // Desired S-curve path
  const desiredY = 180 + Math.sin(progress * Math.PI * 2) * 55;

  // Actual vehicle path: converges when feedback on, drifts away when feedback off
  let actualY = desiredY;
  if (!feedbackOn) {
    actualY = desiredY + progress * 110; // Drifts outward
  } else {
    // Small realistic controller oscillation converging
    actualY = desiredY + Math.sin(t * 8) * Math.max(2, 16 * (1 - progress * 0.8));
  }

  const error = Math.abs(actualY - desiredY);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 12,
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        padding: 24,
      }}
    >
      {/* Header and Feedback Toggle Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--f-head)', fontSize: 20, fontWeight: 800, color: 'var(--fg)' }}>
          Closed-Loop Error Correction
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => setFeedbackOn((cur) => !cur)}
            style={{
              padding: '8px 20px',
              borderRadius: 6,
              background: feedbackOn ? 'var(--c-orange)' : '#4a4d52',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--f-head)',
              fontSize: 13,
              fontWeight: 700,
              transition: 'all 160ms ease',
            }}
          >
            {feedbackOn ? visual.labels.on : visual.labels.off}
          </button>
        </div>
      </div>

      {/* Path Tracking Canvas */}
      <div style={{ flex: 1, position: 'relative', margin: '14px 0' }}>
        <svg viewBox="0 0 680 340" style={{ width: '100%', height: '100%' }}>
          {/* Track corridor boundaries */}
          <path
            d={Array.from({ length: 40 })
              .map((_, i) => {
                const p = i / 39;
                const x = 60 + p * 560;
                const y = 180 + Math.sin(p * Math.PI * 2) * 55 - 45;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="var(--line)"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          <path
            d={Array.from({ length: 40 })
              .map((_, i) => {
                const p = i / 39;
                const x = 60 + p * 560;
                const y = 180 + Math.sin(p * Math.PI * 2) * 55 + 45;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="var(--line)"
            strokeWidth={1}
            strokeDasharray="4,4"
          />

          {/* Desired reference trajectory */}
          <path
            d={Array.from({ length: 40 })
              .map((_, i) => {
                const p = i / 39;
                const x = 60 + p * 560;
                const y = 180 + Math.sin(p * Math.PI * 2) * 55;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="var(--line)"
            strokeWidth={3}
          />

          {/* Actual Vehicle Trajectory */}
          <path
            d={Array.from({ length: Math.round(progress * 40) + 1 })
              .map((_, i) => {
                const p = i / 39;
                const x = 60 + p * 560;
                const dY = 180 + Math.sin(p * Math.PI * 2) * 55;
                const aY = feedbackOn ? dY : dY + p * 110;
                return `${i === 0 ? 'M' : 'L'} ${x} ${aY}`;
              })
              .join(' ')}
            fill="none"
            stroke={feedbackOn ? 'var(--c-orange)' : '#e23b2e'}
            strokeWidth={3}
            strokeDasharray={feedbackOn ? undefined : '6,4'}
          />

          {/* Error Vector Line between Desired and Actual */}
          {error > 4 && (
            <line
              x1={currentX}
              y1={desiredY}
              x2={currentX}
              y2={actualY}
              stroke="#e23b2e"
              strokeWidth={2}
            />
          )}

          {/* Current Vehicle Position */}
          <g transform={`translate(${currentX}, ${actualY})`}>
            <circle r={10} fill="var(--fg)" />
            <circle r={5} fill={feedbackOn ? 'var(--c-orange)' : '#e23b2e'} />
          </g>
        </svg>
      </div>

      {/* Control Loop Block Diagram at Bottom */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderRadius: 8,
          background: 'var(--bg-3)',
          border: '1px solid var(--line)',
        }}
      >
        {visual.loop.map((item, idx) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontFamily: 'var(--f-head)',
                fontSize: 13,
                fontWeight: 700,
                color: idx === 1 ? 'var(--c-orange)' : 'var(--fg)',
              }}
            >
              {item}
            </span>
            {idx < visual.loop.length - 1 && (
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>→</span>
            )}
          </div>
        ))}

        <div style={{ fontSize: 12, fontFamily: 'monospace', color: feedbackOn ? 'var(--c-orange)' : '#e23b2e' }}>
          Error e(t): {error.toFixed(1)} px {feedbackOn ? '(Correcting)' : '(Diverging)'}
        </div>
      </div>
    </div>
  );
}
