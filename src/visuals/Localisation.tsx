import { useEffect, useState } from 'react';
import type { VisualProps } from './registry';

const LANDMARKS = [
  { id: 'L1', x: 180, y: 120, label: 'Feature 01' },
  { id: 'L2', x: 500, y: 160, label: 'Feature 02' },
  { id: 'L3', x: 380, y: 420, label: 'Feature 03' },
];

export default function Localisation({ visual }: VisualProps<'localisation'>) {
  const [t, setT] = useState(0);

  // Auto-drive around the loop
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setT((cur) => cur + 0.008);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Winding parametric trajectory
  const angle = t % (Math.PI * 2);
  const robotX = 340 + Math.cos(angle) * 190;
  const robotY = 270 + Math.sin(angle * 2) * 110;

  // Measure distance to closest landmark
  let minLandmarkDist = 999;
  let activeLandmark: (typeof LANDMARKS)[0] | null = null;
  for (const lm of LANDMARKS) {
    const d = Math.hypot(robotX - lm.x, robotY - lm.y);
    if (d < minLandmarkDist) {
      minLandmarkDist = d;
      activeLandmark = lm;
    }
  }

  // Sighting condition: when within 140px of a landmark
  const isSighting = minLandmarkDist < 140 && activeLandmark !== null;

  // Uncertainty radius: grows over time with phase, drops during landmark update
  const rawGrowth = 22 + (Math.sin(angle * 4) + 1) * 24;
  const uncertaintyRadius = isSighting ? Math.max(16, rawGrowth * 0.4) : rawGrowth;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--f-head)', fontSize: 20, fontWeight: 800, color: 'var(--fg)' }}>
          SLAM (Simultaneous Localisation & Mapping)
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              background: isSighting ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 106, 19, 0.12)',
              color: isSighting ? '#10b981' : 'var(--c-orange)',
              fontFamily: 'var(--f-head)',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {isSighting ? 'LANDMARK RECOGNIZED (UNCERTAINTY CONTRACTS)' : 'DEAD RECKONING (UNCERTAINTY DRIFT)'}
          </span>
        </div>
      </div>

      {/* 2D SLAM Simulation Arena */}
      <div style={{ flex: 1, position: 'relative', margin: '14px 0' }}>
        <svg viewBox="0 0 680 480" style={{ width: '100%', height: '100%' }}>
          {/* Occupancy grid background tiles */}
          {Array.from({ length: 12 }).map((_, i) =>
            Array.from({ length: 9 }).map((_, j) => (
              <rect
                key={`tile-${i}-${j}`}
                x={i * 60}
                y={j * 55}
                width={56}
                height={51}
                rx={3}
                fill="var(--bg-3)"
                opacity={0.35}
              />
            ))
          )}

          {/* Wall Boundaries / Discovered map obstacles */}
          <rect x={40} y={40} width={600} height={400} fill="none" stroke="var(--line)" strokeWidth={2} strokeDasharray="8,8" />
          <line x1={40} y1={240} x2={160} y2={240} stroke="var(--line)" strokeWidth={4} />
          <line x1={520} y1={240} x2={640} y2={240} stroke="var(--line)" strokeWidth={4} />

          {/* Persistent Trajectory Ribbon */}
          <path
            d={Array.from({ length: 60 })
              .map((_, i) => {
                const a = ((t - i * 0.05) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
                const x = 340 + Math.cos(a) * 190;
                const y = 270 + Math.sin(a * 2) * 110;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="var(--c-orange)"
            strokeWidth={2}
            strokeDasharray="4,4"
            opacity={0.7}
          />

          {/* Fixed Landmarks */}
          {LANDMARKS.map((lm) => {
            const isTarget = isSighting && activeLandmark?.id === lm.id;
            return (
              <g key={lm.id} transform={`translate(${lm.x}, ${lm.y})`}>
                {/* Sighting ray */}
                {isTarget && (
                  <line
                    x1={0}
                    y1={0}
                    x2={robotX - lm.x}
                    y2={robotY - lm.y}
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="6,4"
                  />
                )}
                <circle r={14} fill={isTarget ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 106, 19, 0.15)'} />
                <polygon
                  points="0,-12 10,6 -10,6"
                  fill={isTarget ? '#10b981' : 'var(--c-orange)'}
                />
                <text
                  x={0}
                  y={22}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="var(--f-head)"
                  fontWeight={700}
                  fill="var(--fg)"
                >
                  {lm.label}
                </text>
              </g>
            );
          })}

          {/* Robot & Growing/Shrinking Uncertainty Covariance Ellipse */}
          <g transform={`translate(${robotX}, ${robotY})`}>
            {/* Uncertainty Ellipse */}
            <circle
              r={uncertaintyRadius}
              fill={isSighting ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.18)'}
              stroke={isSighting ? '#10b981' : '#3b82f6'}
              strokeWidth={1.5}
            />
            {/* Robot Heading vector */}
            <circle r={12} fill="var(--fg)" />
            <circle r={9} fill="var(--bg)" />
            <circle r={4} fill="var(--c-orange)" />
          </g>
        </svg>
      </div>

      {/* Legend & Telemetry Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          padding: '12px 18px',
          borderRadius: 8,
          background: 'var(--bg-3)',
          border: '1px solid var(--line)',
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{visual.labels.estimate}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--fg)', marginTop: 2 }}>
            x: {robotX.toFixed(1)}m, y: {robotY.toFixed(1)}m
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{visual.labels.uncertainty}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: isSighting ? '#10b981' : '#3b82f6', marginTop: 2 }}>
            σ: ±{uncertaintyRadius.toFixed(1)} cm
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{visual.labels.landmark}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: isSighting ? '#10b981' : 'var(--muted)', marginTop: 2 }}>
            {isSighting ? `${activeLandmark?.label} (Locked)` : 'Searching...'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{visual.labels.map}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--c-orange)', marginTop: 2 }}>
            Occupancy Grid 2D
          </div>
        </div>
      </div>
    </div>
  );
}
