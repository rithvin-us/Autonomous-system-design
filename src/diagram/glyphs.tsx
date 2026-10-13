/**
 * Shared drawing vocabulary for the 2D diagrams, so robots, sensors and
 * arrows look the same on every slide. Colours come from the slide theme.
 */

export const STROKE = 3;

/** Arrowhead marker definitions; reference with markerEnd="url(#arrow)" etc. */
export function DiagramDefs({ id = '' }: { id?: string }) {
  return (
    <defs>
      <marker id={`arrow${id}`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
        <path d="M1 1 L11 6 L1 11 Z" fill="var(--fg)" />
      </marker>
      <marker id={`arrow-accent${id}`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="14" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
        <path d="M1 1 L11 6 L1 11 Z" fill="var(--c-orange)" />
      </marker>
      <marker id={`arrow-muted${id}`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
        <path d="M1 1 L11 6 L1 11 Z" fill="var(--muted)" />
      </marker>
      <pattern id={`hatch${id}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="10" height="10" fill="var(--bg-2)" />
        <line x1="0" y1="0" x2="0" y2="10" stroke="var(--line)" strokeWidth="3" />
      </pattern>
    </defs>
  );
}

/**
 * Top-down mobile robot, centred on (0,0), facing +X. `size` is body length.
 * The orange bar marks its forward sensor.
 */
export function RobotTop({
  x,
  y,
  angle = 0,
  size = 70,
  tone = 'fg',
  sensor = true,
}: {
  x: number;
  y: number;
  angle?: number;
  size?: number;
  tone?: 'fg' | 'muted';
  sensor?: boolean;
}) {
  const L = size;
  const W = size * 0.74;
  const ink = tone === 'fg' ? 'var(--fg)' : 'var(--muted)';
  return (
    <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI})`}>
      {/* wheels */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sy) => (
          <rect
            key={`${sx}${sy}`}
            x={sx * L * 0.27 - L * 0.13}
            y={sy * (W / 2) - W * 0.1}
            width={L * 0.26}
            height={W * 0.2}
            rx={2}
            fill={ink}
          />
        )),
      )}
      <rect x={-L / 2} y={-W / 2} width={L} height={W} rx={L * 0.12} fill="var(--bg)" stroke={ink} strokeWidth={STROKE} />
      {sensor && <rect x={L / 2 - L * 0.16} y={-W * 0.28} width={L * 0.09} height={W * 0.56} fill="var(--c-orange)" />}
      <circle cx={-L * 0.08} cy={0} r={W * 0.14} fill="none" stroke={ink} strokeWidth={2} />
    </g>
  );
}

/** Sensor field of view wedge in front of a robot (same transform as RobotTop). */
export function FovWedge({
  x,
  y,
  angle = 0,
  range,
  half,
  active = false,
  offset = 0,
}: {
  x: number;
  y: number;
  angle?: number;
  range: number;
  half: number;
  active?: boolean;
  offset?: number;
}) {
  const ax = offset;
  const p1 = [ax + Math.cos(-half) * range, Math.sin(-half) * range];
  const p2 = [ax + Math.cos(half) * range, Math.sin(half) * range];
  return (
    <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI})`}>
      <path
        d={`M${ax} 0 L${p1[0]} ${p1[1]} A${range} ${range} 0 0 1 ${p2[0]} ${p2[1]} Z`}
        fill="var(--c-orange)"
        fillOpacity={active ? 0.32 : 0.12}
        stroke="var(--c-orange)"
        strokeOpacity={active ? 0.9 : 0.4}
        strokeWidth={2}
      />
    </g>
  );
}

/** Flag-style goal marker. */
export function GoalMark({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={18} fill="none" stroke="var(--fg)" strokeWidth={STROKE} />
      <circle r={6} fill="var(--fg)" />
      {label && (
        <text y={50} textAnchor="middle" className="dg-label">
          {label}
        </text>
      )}
    </g>
  );
}

/** Start marker: hollow square. */
export function StartMark({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-14} y={-14} width={28} height={28} fill="none" stroke="var(--muted)" strokeWidth={STROKE} />
      {label && (
        <text y={50} textAnchor="middle" className="dg-label is-muted">
          {label}
        </text>
      )}
    </g>
  );
}

/** Hatched obstacle block. */
export function Obstacle({ x, y, w, h, hatchId = '' }: { x: number; y: number; w: number; h: number; hatchId?: string }) {
  return <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill={`url(#hatch${hatchId})`} stroke="var(--fg)" strokeWidth={STROKE} />;
}
