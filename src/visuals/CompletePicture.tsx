import '../diagram/diagram.css';
import { useTime } from '../lib/useTime';
import type { VisualProps } from './registry';

const CX = 1450;
const CY = 545;
const R = 280;
const LAP = 7.5; // seconds per loop

/**
 * Slide 25: the five parts of the system on one closed loop. A single pulse
 * travels the ring and lights each part in turn; the loop is the system.
 */
export default function CompletePicture({ visual }: VisualProps<'completePicture'>) {
  const t = useTime(LAP * 0.62);
  const n = visual.nodes.length;
  const phase = (t / LAP) % 1;
  const head = -Math.PI / 2 + phase * Math.PI * 2;
  const trail = Math.PI * 0.9;

  const nodes = visual.nodes.map((label, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    // How recently the pulse passed this node (0 = just now, 1 = a lap ago).
    const since = (((phase - i / n) % 1) + 1) % 1;
    return { label, a, x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R, glow: Math.max(0, 1 - since * 4) };
  });

  const tailStart = head - trail;
  const arcPath = (a0: number, a1: number) => {
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${CX + Math.cos(a0) * R} ${CY + Math.sin(a0) * R} A${R} ${R} 0 ${large} 1 ${CX + Math.cos(a1) * R} ${CY + Math.sin(a1) * R}`;
  };

  return (
    <svg className="dg" viewBox="0 0 1920 1080" aria-hidden>
      <defs>
        <linearGradient
          id="cp-tail"
          gradientUnits="userSpaceOnUse"
          x1={CX + Math.cos(tailStart) * R}
          y1={CY + Math.sin(tailStart) * R}
          x2={CX + Math.cos(head) * R}
          y2={CY + Math.sin(head) * R}
        >
          <stop offset="0" stopColor="var(--c-orange)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--c-orange)" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* The loop */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth={2} />
      <path d={arcPath(tailStart, head)} fill="none" stroke="url(#cp-tail)" strokeWidth={6} strokeLinecap="round" />
      <circle cx={CX + Math.cos(head) * R} cy={CY + Math.sin(head) * R} r={9} fill="var(--c-orange)" />

      {/* Direction ticks between nodes */}
      {nodes.map((nd, i) => {
        const a = nd.a + Math.PI / n;
        const x = CX + Math.cos(a) * R;
        const y = CY + Math.sin(a) * R;
        return (
          <path
            key={`tick${i}`}
            d="M-7 -9 L5 0 L-7 9"
            fill="none"
            stroke="var(--muted)"
            strokeWidth={2.5}
            transform={`translate(${x} ${y}) rotate(${((a + Math.PI / 2) * 180) / Math.PI})`}
          />
        );
      })}

      {/* Components */}
      {nodes.map((nd, i) => {
        // Labels sit centred above each node, except the two lowest which sit below.
        const below = Math.sin(nd.a) > 0.5;
        const lx = nd.x;
        const ly = below ? nd.y + 62 : nd.y - 74;
        const anchor = 'middle';
        return (
          <g key={nd.label}>
            <circle cx={nd.x} cy={nd.y} r={34} fill="var(--c-orange)" opacity={nd.glow * 0.18} />
            <circle cx={nd.x} cy={nd.y} r={15} fill={nd.glow > 0.3 ? 'var(--c-orange)' : 'var(--fg)'} />
            <text x={lx} y={ly - 4} textAnchor={anchor} className="dg-num">
              {String(i + 1).padStart(2, '0')}
            </text>
            <text x={lx} y={ly + 32} textAnchor={anchor} className="dg-title" style={{ fontSize: 36 }}>
              {nd.label}
            </text>
          </g>
        );
      })}

      {/* What emerges */}
      <text x={CX} y={CY + 14} textAnchor="middle" className="dg-title" style={{ fontSize: 46, letterSpacing: '0.12em' }}>
        AUTONOMY
      </text>
    </svg>
  );
}
