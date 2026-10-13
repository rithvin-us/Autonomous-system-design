import '../diagram/diagram.css';
import { VehicleSide } from '../diagram/VehicleSide';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const W = 1080;
const H = 940;
const CX = 480;
const CY = 470;
const R = 300;
const LAP = 6; // seconds per loop

/**
 * Slide 05: Sense → Perceive → Decide → Act around the vehicle that runs it.
 * At step 0 a pulse circles continuously; each clicker step stops on one
 * stage and lights it.
 */
export default function AutonomyLoop({ visual }: VisualProps<'autonomyLoop'>) {
  const { step } = useSlide();
  const t = useTime(LAP * 0.1);
  const n = visual.stages.length;
  const held = step - 1; // -1 = running
  const nodeAngle = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;

  const head = held >= 0 ? nodeAngle(held) : -Math.PI / 2 + ((t / LAP) % 1) * Math.PI * 2;
  const phase = ((head + Math.PI / 2) / (Math.PI * 2) + 1) % 1;
  const tail = held >= 0 ? 0 : Math.PI * 0.7;

  const pt = (a: number, r = R) => [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const;
  const arc = (a0: number, a1: number) => {
    const [x0, y0] = pt(a0);
    const [x1, y1] = pt(a1);
    return `M${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`;
  };

  return (
    <svg className="dg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <defs>
        <linearGradient
          id="loop-tail"
          gradientUnits="userSpaceOnUse"
          x1={pt(head - tail)[0]}
          y1={pt(head - tail)[1]}
          x2={pt(head)[0]}
          y2={pt(head)[1]}
        >
          <stop offset="0" stopColor="var(--c-orange)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--c-orange)" stopOpacity="1" />
        </linearGradient>
      </defs>

      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth={3} />
      {tail > 0 && <path d={arc(head - tail, head)} fill="none" stroke="url(#loop-tail)" strokeWidth={7} strokeLinecap="round" />}

      {/* Direction arrows between stages */}
      {visual.stages.map((_, i) => {
        const a = nodeAngle(i) + Math.PI / n;
        const [x, y] = pt(a);
        return (
          <path
            key={i}
            d="M-9 -12 L7 0 L-9 12"
            fill="none"
            stroke="var(--muted)"
            strokeWidth={3}
            transform={`translate(${x} ${y}) rotate(${((a + Math.PI / 2) * 180) / Math.PI})`}
          />
        );
      })}

      {/* "Repeat" sits on the arc that closes the loop (Act → Sense) */}
      {(() => {
        const a = nodeAngle(n - 1) + Math.PI / n;
        const [x, y] = pt(a, R + 46);
        return (
          <text x={x - 10} y={y} textAnchor="end" className="dg-label is-accent" style={{ fontSize: 26 }}>
            {visual.centre}
          </text>
        );
      })()}

      {/* Stages */}
      {visual.stages.map((s, i) => {
        const a = nodeAngle(i);
        const [x, y] = pt(a);
        const since = (((phase - i / n) % 1) + 1) % 1;
        const lit = held >= 0 ? held === i : since < 0.22;
        const dim = held >= 0 && held !== i;
        // Top and bottom labels sit above/below their node; side labels sit outside it.
        const side = Math.abs(Math.cos(a)) > 0.5;
        const anchor = side ? (Math.cos(a) > 0 ? 'start' : 'end') : 'middle';
        const lx = side ? x + Math.sign(Math.cos(a)) * 80 : x;
        const ly = side ? y - 2 : Math.sin(a) < 0 ? y - 132 : y + 112;
        return (
          <g key={s.label} opacity={dim ? 0.4 : 1} className="dg-fade">
            <circle cx={x} cy={y} r={60} fill={lit ? 'var(--c-orange)' : 'var(--bg)'} stroke={lit ? 'var(--c-orange)' : 'var(--fg)'} strokeWidth={4} />
            <text x={x} y={y + 12} textAnchor="middle" className="dg-title" style={{ fontSize: 34, fill: lit ? '#111' : 'var(--fg)' }}>
              {String(i + 1).padStart(2, '0')}
            </text>
            <text x={lx} y={ly} textAnchor={anchor} className="dg-title" style={{ fontSize: 36 }}>
              {s.label}
            </text>
            {s.detail && (
              <text x={lx} y={ly + 36} textAnchor={anchor} className="dg-small" style={{ fontSize: 24, fill: lit ? 'var(--fg)' : 'var(--muted)' }}>
                {s.detail}
              </text>
            )}
          </g>
        );
      })}

      <VehicleSide x={CX - 12} y={CY + 92} scale={0.82} />
    </svg>
  );
}
