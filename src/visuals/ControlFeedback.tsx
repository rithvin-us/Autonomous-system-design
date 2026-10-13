import { useRef } from 'react';
import '../diagram/diagram.css';
import { DiagramDefs, RobotTop } from '../diagram/glyphs';
import { useSince, useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const W = 1080;
const H = 940;
const X0 = 60;
const X1 = 1020;
const SPEED = 150; // px per second along X
const MID = 250;

const reference = (x: number) => MID + 90 * Math.sin((x - X0) / 150);
const slope = (x: number) => (90 / 150) * Math.cos((x - X0) / 150);

/**
 * Slide 16. Top: the desired path (dashed) and the path the robot actually
 * drives (orange). Bottom: the feedback loop. Step 0 and step 2: feedback on,
 * the robot settles onto the path. Step 1: feedback cut, it drifts away.
 */
export default function ControlFeedback({ visual }: VisualProps<'control'>) {
  const { step } = useSlide();
  const t = useTime(4);
  const feedback = step !== 1;
  const since = useSince(step, t);
  const sim = useRef({ key: -1, last: 0, x: X0, y: MID + 70, trail: [] as [number, number][] });

  // Restart the run whenever the step changes or the robot reaches the end.
  const s = sim.current;
  if (s.key !== step || s.x >= X1) {
    s.key = step;
    s.x = X0;
    s.y = MID + 70;
    s.trail = [];
    s.last = since;
  }
  // Integrate in fixed 20 ms steps so the motion is the same at any frame rate.
  let remaining = Math.min(0.5, Math.max(0, since - s.last));
  s.last = since;
  const rate = (x: number, y: number) =>
    feedback
      ? SPEED * slope(x) + 2.2 * (reference(x) - y) // compare and correct
      : SPEED * slope(x) * 0.9 + 26; // follows the plan blindly; a small disturbance builds up
  while (remaining > 1e-6 && s.x < X1) {
    const h = Math.min(0.02, remaining);
    s.y += rate(s.x, s.y) * h;
    s.x += SPEED * h;
    s.trail.push([s.x, s.y]);
    remaining -= h;
  }
  const vy = rate(s.x, s.y);
  const heading = Math.atan2(vy, SPEED);
  const error = reference(s.x) - s.y;

  const refPath = Array.from({ length: 80 }, (_, i) => {
    const x = X0 + (i * (X1 - X0)) / 79;
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${reference(x).toFixed(1)}`;
  }).join(' ');
  const trail = s.trail.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

  /* Feedback loop diagram */
  const L = visual.loop; // Desired, Compare, Controller, Robot, Measured
  const loopY = 640;
  const boxes = [
    { x: 60, w: 180, label: L[0] },
    { x: 330, w: 110, label: L[1], round: true },
    { x: 520, w: 200, label: L[2] },
    { x: 800, w: 200, label: L[3] },
  ];
  const pulse = (t * 0.5) % 1;

  return (
    <svg className="dg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <DiagramDefs id="-cf" />

      {/* Paths */}
      <path d={refPath} fill="none" stroke="var(--fg)" strokeWidth={4} strokeDasharray="14 10" />
      <path d={trail} fill="none" stroke="var(--c-orange)" strokeWidth={5} />
      {Math.abs(error) > 6 && (
        <g>
          <line x1={s.x} x2={s.x} y1={s.y} y2={reference(s.x)} stroke={feedback ? 'var(--fg)' : 'var(--c-fault)'} strokeWidth={3} markerEnd="url(#arrow-cf)" />
          <text x={s.x + 16} y={(s.y + reference(s.x)) / 2 + 8} className="dg-label" style={{ fontSize: 20 }}>
            {visual.labels.error}
          </text>
        </g>
      )}
      <RobotTop x={s.x} y={s.y} angle={heading} size={60} />

      {/* Legend */}
      <g transform="translate(60 470)">
        <line x1={0} x2={44} y1={-6} y2={-6} stroke="var(--fg)" strokeWidth={4} strokeDasharray="10 7" />
        <text x={58} y={2} className="dg-label" style={{ fontSize: 20 }}>
          {visual.labels.desired}
        </text>
        <line x1={330} x2={374} y1={-6} y2={-6} stroke="var(--c-orange)" strokeWidth={5} />
        <text x={388} y={2} className="dg-label" style={{ fontSize: 20 }}>
          {visual.labels.actual}
        </text>
        <text x={960} y={2} textAnchor="end" className={`dg-label ${feedback ? 'is-accent' : ''}`} style={{ fontSize: 22, fill: feedback ? undefined : 'var(--c-fault)' }}>
          {feedback ? visual.labels.on : visual.labels.off}
        </text>
      </g>

      {/* Feedback loop */}
      {boxes.map((b) =>
        b.round ? (
          <g key={b.label}>
            <circle cx={b.x + b.w / 2} cy={loopY} r={b.w / 2} fill="var(--bg)" stroke="var(--fg)" strokeWidth={3} />
            <text x={b.x + b.w / 2} y={loopY + 7} textAnchor="middle" className="dg-label" style={{ fontSize: 17 }}>
              {b.label}
            </text>
          </g>
        ) : (
          <g key={b.label}>
            <rect x={b.x} y={loopY - 44} width={b.w} height={88} fill="var(--bg)" stroke="var(--fg)" strokeWidth={3} />
            <text x={b.x + b.w / 2} y={loopY + 8} textAnchor="middle" className="dg-label" style={{ fontSize: 20 }}>
              {b.label}
            </text>
          </g>
        ),
      )}
      {[
        [240, 330],
        [440, 520],
        [720, 800],
      ].map(([a, b]) => (
        <line key={a} x1={a} x2={b - 6} y1={loopY} y2={loopY} stroke="var(--fg)" strokeWidth={3} markerEnd="url(#arrow-cf)" />
      ))}
      {/* Measurement fed back from the robot to the comparison */}
      <path
        d={`M900 ${loopY + 44} L900 ${loopY + 150} L385 ${loopY + 150} L385 ${loopY + 61}`}
        fill="none"
        stroke={feedback ? 'var(--c-orange)' : 'var(--line)'}
        strokeWidth={feedback ? 4 : 3}
        strokeDasharray={feedback ? undefined : '10 8'}
        markerEnd={feedback ? 'url(#arrow-accent-cf)' : undefined}
      />
      <text x={640} y={loopY + 186} textAnchor="middle" className="dg-label is-muted" style={{ fontSize: 20 }}>
        {L[4]}
      </text>
      {!feedback && <path d={`M620 ${loopY + 132} l36 36 M656 ${loopY + 132} l-36 36`} stroke="var(--c-fault)" strokeWidth={6} />}
      {feedback && (
        <rect
          x={pulse < 0.2 ? 900 - 6 : pulse < 0.8 ? 900 - ((pulse - 0.2) / 0.6) * 515 - 6 : 385 - 6}
          y={pulse < 0.2 ? loopY + 44 + (pulse / 0.2) * 106 - 6 : pulse < 0.8 ? loopY + 150 - 6 : loopY + 150 - ((pulse - 0.8) / 0.2) * 89 - 6}
          width={12}
          height={12}
          fill="var(--c-orange)"
        />
      )}
    </svg>
  );
}
