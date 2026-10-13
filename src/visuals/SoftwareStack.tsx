import '../diagram/diagram.css';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const W = 1680;
const H = 648;
const NODE_W = 180;
const NODE_H = 104;
const NODE_Y = 24;
const BAND_Y = 250;
const BAND_H = 96;
const PITCH = 200;
const X0 = 40;

/** Who sends to whom (indices into the node list); one message every 0.45 s. */
const ROUTES: [number, number][] = [
  [0, 3],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [5, 6],
  [6, 7],
];
const HOP = 1.7; // seconds for one message to travel
const GAP = 0.45;

function split(label: string): string[] {
  if (label.length <= 10 || !label.includes(' ')) return [label];
  const plus = label.indexOf(' + ');
  if (plus > 0) return [label.slice(0, plus + 2), label.slice(plus + 3)];
  const cut = label.lastIndexOf(' ');
  return cut > 0 ? [label.slice(0, cut), label.slice(cut + 1)] : [label];
}

/**
 * Slide 18. Separate programs (top row) never call each other directly:
 * every message drops into the ROS 2 layer and rises to whoever needs it.
 * Clicker steps highlight the components, ROS 2, then the layers beneath.
 */
export default function SoftwareStack({ visual }: VisualProps<'softwareStack'>) {
  const { step } = useSlide();
  const t = useTime(1.2);
  const focus = step; // 0 = all, 1 = nodes, 2 = ROS 2, 3+ = layers below
  const cx = (i: number) => X0 + i * PITCH + NODE_W / 2;
  const dimNodes = focus > 1;
  const dimBand = focus === 1 || focus > 2;

  const n = ROUTES.length;
  const messages = Array.from({ length: n * 2 }, (_, k) => {
    const start = k * GAP;
    const age = (((t - start) % (n * 2 * GAP)) + n * 2 * GAP) % (n * 2 * GAP);
    if (age > HOP) return null;
    const [from, to] = ROUTES[k % n];
    const p = age / HOP;
    const down = 0.28;
    const up = 0.72;
    const bandMid = BAND_Y + 20; // messages run along the top edge of the band
    let x: number;
    let y: number;
    if (p < down) {
      x = cx(from);
      y = NODE_Y + NODE_H + (bandMid - NODE_Y - NODE_H) * (p / down);
    } else if (p < up) {
      x = cx(from) + (cx(to) - cx(from)) * ((p - down) / (up - down));
      y = bandMid;
    } else {
      x = cx(to);
      y = bandMid - (bandMid - NODE_Y - NODE_H) * ((p - up) / (1 - up));
    }
    return { k, x, y, to, arriving: p > 0.92 };
  }).filter((m): m is NonNullable<typeof m> => m !== null);
  const receiving = new Set(messages.filter((m) => m.arriving).map((m) => m.to));

  return (
    <svg className="dg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      {/* Components */}
      <g opacity={dimNodes ? 0.3 : 1} className="dg-fade">
        {visual.nodes.map((label, i) => {
          const x = X0 + i * PITCH;
          const lit = receiving.has(i);
          const ls = split(label);
          return (
            <g key={label}>
              <line x1={cx(i)} x2={cx(i)} y1={NODE_Y + NODE_H} y2={BAND_Y} stroke="var(--line)" strokeWidth={3} />
              <rect
                x={x}
                y={NODE_Y}
                width={NODE_W}
                height={NODE_H}
                fill="var(--bg)"
                stroke={lit || focus === 1 ? 'var(--c-orange)' : 'var(--fg)'}
                strokeWidth={lit || focus === 1 ? 5 : 3}
              />
              {ls.map((l, k) => (
                <text
                  key={k}
                  x={cx(i)}
                  y={NODE_Y + NODE_H / 2 + 8 + (k - (ls.length - 1) / 2) * 26}
                  textAnchor="middle"
                  className="dg-label"
                  style={{ fontSize: 19 }}
                >
                  {l}
                </text>
              ))}
            </g>
          );
        })}
      </g>

      {/* ROS 2 communication layer */}
      <g opacity={dimBand ? 0.3 : 1} className="dg-fade">
        <rect x={X0} y={BAND_Y} width={W - X0 * 2} height={BAND_H} fill="var(--fg)" />
        {focus === 2 && <rect x={X0 - 6} y={BAND_Y - 6} width={W - X0 * 2 + 12} height={BAND_H + 12} fill="none" stroke="var(--c-orange)" strokeWidth={4} />}
        <text x={X0 + 32} y={BAND_Y + 80} className="dg-title" style={{ fontSize: 50, fill: 'var(--bg)' }}>
          {visual.middleware.label}
        </text>
        {visual.middleware.detail && (
 <text x={W - X0 - 32} y={BAND_Y + 76} textAnchor="end" className="dg-small" style={{ fontSize: 24, fill: 'var(--bg)', opacity: 0.8 }}>
            {visual.middleware.detail}
          </text>
        )}
      </g>

      {/* Messages */}
      {messages.map((m) => (
        <rect key={m.k} x={m.x - 9} y={m.y - 9} width={18} height={18} fill="var(--c-orange)" />
      ))}

      {/* Layers underneath */}
      {visual.layers.map((label, i) => {
        const y = BAND_Y + BAND_H + 40 + i * 104;
        const active = focus === 3 + i;
        const dim = focus > 0 && !active;
        return (
          <g key={label} opacity={dim ? 0.3 : 1} className="dg-fade">
            <rect x={X0} y={y} width={W - X0 * 2} height={80} fill="var(--bg-2)" stroke={active ? 'var(--c-orange)' : 'var(--line)'} strokeWidth={active ? 4 : 2} />
            <text x={X0 + 32} y={y + 50} className="dg-title" style={{ fontSize: 30 }}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
