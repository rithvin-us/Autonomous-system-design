import '../diagram/diagram.css';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const W = 1680;
const H = 648;
const NODE = 200;
const NODE_Y = 150;
const PIPE_H = 40;
const SPEED = 230; // px per second
const SPACING = 120; // px between messages in a channel

/** Two short lines for long channel names (keeps "+" with the first word). */
function wrap(label: string): string[] {
  if (label.length <= 10) return [label];
  const words = label.split(' ');
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

/** Small envelope glyph, centred on (x, y). */
function Message({ x, y, bright }: { x: number; y: number; bright: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={bright ? 1 : 0.55}>
      <rect x={-17} y={-12} width={34} height={24} fill="var(--c-orange)" />
      <path d="M-17 -12 L0 2 L17 -12" fill="none" stroke="var(--bg)" strokeWidth={2.5} />
    </g>
  );
}

/**
 * Slide 19. Four software nodes joined by named channels; messages travel
 * continuously left to right. Clicker steps light one channel at a time.
 */
export default function ComponentFlow({ visual }: VisualProps<'componentFlow'>) {
  const { step } = useSlide();
  const t = useTime(1.5);
  const n = visual.nodes.length;
  // Each node is followed by its outgoing channel; the last runs off to the motors.
  const gap = (W - n * NODE) / n;
  const nx = (i: number) => i * (NODE + gap);
  const cy = NODE_Y + NODE / 2;
  const held = step - 1; // channel index or -1

  return (
    <svg className="dg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      {/* Channels */}
      {visual.messages.slice(0, n).map((label, i) => {
        const x0 = nx(i) + NODE;
        const x1 = i < n - 1 ? nx(i + 1) : W - 24;
        const active = held === i;
        const dim = held >= 0 && !active;
        const len = x1 - x0;
        const count = Math.ceil(len / SPACING) + 1;
        const offset = (t * SPEED) % SPACING;
        return (
          <g key={label} opacity={dim ? 0.3 : 1} className="dg-fade">
            <rect x={x0} y={cy - PIPE_H / 2} width={len} height={PIPE_H} fill="var(--bg-2)" stroke={active ? 'var(--c-orange)' : 'var(--line)'} strokeWidth={active ? 3 : 2} />
            <clipPath id={`cf-pipe-${i}`}>
              <rect x={x0} y={cy - PIPE_H} width={len} height={PIPE_H * 2} />
            </clipPath>
            <g clipPath={`url(#cf-pipe-${i})`}>
              {Array.from({ length: count }, (_, k) => (
                <Message key={k} x={x0 - SPACING + offset + k * SPACING} y={cy} bright={held < 0 || active} />
              ))}
            </g>
            {i === n - 1 && <path d={`M${W - 30} ${cy - 30} L${W} ${cy} L${W - 30} ${cy + 30} Z`} fill={active ? 'var(--c-orange)' : 'var(--fg)'} />}
            {wrap(label).map((l, k, all) => (
              <text
                key={k}
                x={(x0 + x1) / 2}
                y={cy - PIPE_H / 2 - 20 - (all.length - 1 - k) * 26}
                textAnchor="middle"
                className={`dg-label${active ? ' is-accent' : ' is-muted'}`}
                style={{ fontSize: 20 }}
              >
                {l}
              </text>
            ))}
          </g>
        );
      })}

      <text x={W} y={cy + PIPE_H / 2 + 46} textAnchor="end" className="dg-label is-muted" style={{ fontSize: 19 }}>
        To motors
      </text>

      {/* Nodes */}
      {visual.nodes.map((node, i) => {
        const x = nx(i);
        const lit = held >= 0 && (held === i || held === i - 1);
        const dim = held >= 0 && !lit;
        return (
          <g key={node.label} opacity={dim ? 0.3 : 1} className="dg-fade">
            <circle cx={x + NODE / 2} cy={cy} r={NODE / 2} fill="var(--bg)" stroke={lit ? 'var(--c-orange)' : 'var(--fg)'} strokeWidth={lit ? 6 : 4} />
            <text x={x + NODE / 2} y={cy - 2} textAnchor="middle" className="dg-title" style={{ fontSize: 26 }}>
              {node.label.replace(/ node$/i, '')}
            </text>
            <text x={x + NODE / 2} y={cy + 30} textAnchor="middle" className="dg-label is-muted" style={{ fontSize: 19 }}>
              Node
            </text>
            {node.detail && (
              <text x={x + NODE / 2} y={NODE_Y + NODE + 52} textAnchor="middle" className="dg-small" style={{ fontSize: 24 }}>
                {node.detail}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
