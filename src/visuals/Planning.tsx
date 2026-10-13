import { useEffect, useState } from 'react';
import type { VisualProps } from './registry';

export default function Planning({ visual }: VisualProps<'planning'>) {
  const [activePath, setActivePath] = useState<'chosen' | 'collision' | 'wide'>('chosen');
  const [progress, setProgress] = useState(0);

  // Animate robot traversing chosen path
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setProgress((p) => (p + 0.005) % 1);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Parametric spline for chosen path
  const px = 100 + progress * 800;
  let py = 200;
  if (px > 280 && px < 720) {
    py = 200 - Math.sin(((px - 280) / 440) * Math.PI) * 90;
  }

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
      {/* Trajectory Evaluation Arena */}
      <div
        style={{
          flex: 1,
          borderRadius: 12,
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg viewBox="0 0 1000 400" style={{ width: '100%', height: '100%' }}>
          {/* Background grid */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`pg-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={400} stroke="var(--line)" strokeWidth={1} opacity={0.25} />
          ))}

          {/* Obstacle 1 with Safety Buffer Zone */}
          <g transform="translate(500, 200)">
            {/* Safety buffer */}
            <circle r={60} fill="rgba(226, 59, 46, 0.12)" stroke="#e23b2e" strokeWidth={1.5} strokeDasharray="4,4" />
            {/* Solid obstacle */}
            <circle r={32} fill="#e23b2e" />
            <text x={0} y={-42} textAnchor="middle" fontSize={12} fontFamily="var(--f-head)" fontWeight={700} fill="#e23b2e">
              {visual.labels.obstacle.toUpperCase()}
            </text>
          </g>

          {/* Candidate Path 1: Direct path (Collides) */}
          <line
            x1={100}
            y1={200}
            x2={900}
            y2={200}
            stroke="#e23b2e"
            strokeWidth={activePath === 'collision' ? 3 : 1.5}
            strokeDasharray="6,6"
            opacity={activePath === 'collision' ? 1 : 0.4}
          />

          {/* Candidate Path 3: Wide detour (Suboptimal) */}
          <path
            d="M 100 200 C 350 340, 650 340, 900 200"
            fill="none"
            stroke="#8a9199"
            strokeWidth={activePath === 'wide' ? 3 : 1.5}
            strokeDasharray="6,6"
            opacity={activePath === 'wide' ? 1 : 0.45}
          />

          {/* Candidate Path 2: Optimal avoidance spline (Chosen) */}
          <path
            d="M 100 200 C 320 200, 360 110, 500 110 C 640 110, 680 200, 900 200"
            fill="none"
            stroke="var(--c-orange)"
            strokeWidth={activePath === 'chosen' ? 4 : 2}
          />

          {/* Start Point */}
          <g transform="translate(100, 200)">
            <circle r={14} fill="rgba(16, 185, 129, 0.2)" />
            <circle r={7} fill="#10b981" />
            <text x={0} y={-22} textAnchor="middle" fontSize={12} fontFamily="var(--f-head)" fontWeight={700} fill="#10b981">
              {visual.labels.start.toUpperCase()}
            </text>
          </g>

          {/* Goal Point */}
          <g transform="translate(900, 200)">
            <circle r={14} fill="rgba(59, 130, 246, 0.2)" />
            <circle r={7} fill="#3b82f6" />
            <text x={0} y={-22} textAnchor="middle" fontSize={12} fontFamily="var(--f-head)" fontWeight={700} fill="#3b82f6">
              {visual.labels.goal.toUpperCase()}
            </text>
          </g>

          {/* Simulated Driving Vehicle along chosen path */}
          <g transform={`translate(${px}, ${py})`}>
            <circle r={10} fill="var(--fg)" />
            <circle r={5} fill="var(--c-orange)" />
          </g>
        </svg>
      </div>

      {/* Trajectory Cost Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
        {[
          {
            id: 'collision' as const,
            label: 'Route A · Direct Vector',
            status: 'REJECTED',
            color: '#e23b2e',
            detail: 'Intersects obstacle collision envelope (High Risk)',
          },
          {
            id: 'chosen' as const,
            label: 'Route B · Clearance Spline',
            status: 'CHOSEN (OPTIMAL)',
            color: 'var(--c-orange)',
            detail: 'Clears safety buffer with minimal lateral jerk and path length',
          },
          {
            id: 'wide' as const,
            label: 'Route C · Wide Detour',
            status: 'SUBOPTIMAL',
            color: '#8a9199',
            detail: 'Safe clearance but 42% longer distance and execution time',
          },
        ].map((item) => {
          const isSelected = activePath === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActivePath(item.id)}
              style={{
                borderRadius: 8,
                background: isSelected ? 'var(--bg-3)' : 'var(--bg-2)',
                border: isSelected ? `2px solid ${item.color}` : '1px solid var(--line)',
                padding: '14px 18px',
                cursor: 'pointer',
                transition: 'all 160ms ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--f-head)', fontSize: 16, fontWeight: 700, color: 'var(--fg)' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 11, fontFamily: 'var(--f-head)', fontWeight: 800, color: item.color }}>
                  {item.status}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                {item.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
