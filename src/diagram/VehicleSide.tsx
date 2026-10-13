/**
 * Side elevation of a small off-road autonomous vehicle, drawn in the diagram
 * line style. Orange marks sensors. Origin: centre of the wheelbase on the
 * ground line; the vehicle faces +X. About 360 units long.
 */
export function VehicleSide({ x = 0, y = 0, scale = 1, dim = false }: { x?: number; y?: number; scale?: number; dim?: boolean }) {
  const ink = dim ? 'var(--muted)' : 'var(--fg)';
  const wheel = (cx: number) => (
    <g key={cx}>
      <circle cx={cx} cy={-46} r={46} fill="var(--bg)" stroke={ink} strokeWidth={5} />
      <circle cx={cx} cy={-46} r={30} fill="none" stroke={ink} strokeWidth={2} opacity={0.6} />
      <circle cx={cx} cy={-46} r={9} fill={ink} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinejoin="round" strokeLinecap="round">
      {/* Ground line */}
      <line x1={-210} x2={210} y1={0} y2={0} stroke="var(--line)" strokeWidth={3} />
      {/* Chassis and body */}
      <path d="M-170 -62 L-150 -96 L150 -96 L178 -70 L178 -58 L-170 -58 Z" fill="var(--bg-2)" stroke={ink} strokeWidth={4} />
      {/* Roll cage */}
      <path d="M-120 -96 L-92 -176 L40 -176 L96 -96" fill="none" stroke={ink} strokeWidth={5} />
      <path d="M-30 -96 L-14 -176" fill="none" stroke={ink} strokeWidth={4} />
      {/* Suspension arms */}
      <path d="M-120 -58 L-118 -46 M120 -58 L118 -46" stroke={ink} strokeWidth={4} />
      {/* Compute box */}
      <rect x={-96} y={-90} width={56} height={26} fill="var(--bg)" stroke={ink} strokeWidth={3} />
      {wheel(-118)}
      {wheel(118)}
      {/* Sensors: camera on the cage front, GNSS on the roof, radar and ultrasonic at the bumper */}
      <rect x={24} y={-194} width={40} height={16} fill="var(--c-orange)" />
      <rect x={-78} y={-190} width={34} height={10} rx={5} fill="var(--c-orange)" />
      <line x1={-61} x2={-61} y1={-180} y2={-176} stroke={ink} strokeWidth={3} />
      <rect x={176} y={-90} width={10} height={20} fill="var(--c-orange)" />
      <rect x={176} y={-64} width={8} height={8} fill="var(--c-orange)" />
    </g>
  );
}
