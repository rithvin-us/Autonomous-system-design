import { useRef } from 'react';
import '../diagram/diagram.css';
import { DiagramDefs, FovWedge, RobotTop } from '../diagram/glyphs';
import { useSlide } from '../shell/contexts';
import { useTime } from '../lib/useTime';
import { PhaseStrip } from './PhaseStrip';
import type { VisualProps } from './registry';
import './scenario.css';

const W = 1680;
const H = 400;
const ROBOT_X = 520;
const LANE_HALF = 82;
const SCROLL = 150; // px per second
const LOOKAHEAD = 260;

/** Lane centre line (y) at world position x. */
const centre = (x: number) => 200 + 62 * Math.sin(x / 270) + 26 * Math.sin(x / 101 + 1.3);

/**
 * Slide 23. The road scrolls under the robot while it follows the lane.
 * Clicker steps highlight each subsystem in order; the matching overlay
 * appears in the scene: camera view → lane offset → target path →
 * steering correction → actual motion.
 */
export default function LaneFollowing({ visual }: VisualProps<'laneFollowing'>) {
  const { step } = useSlide();
  const t = useTime(3.2);
  const stage = step - 1; // -1 = plain driving
  const sim = useRef({ t: 0, y: centre(ROBOT_X), heading: 0, trail: [] as [number, number][] });

  // Simple follower: the robot steers towards a point on the lane centre ahead.
  const s = sim.current;
  let remaining = Math.min(0.5, Math.max(0, t - s.t));
  const fresh = s.t === 0 && s.trail.length === 0;
  s.t = t;
  const scroll = t * SCROLL;
  const xw = ROBOT_X + scroll;
  if (fresh) s.y = centre(xw) + 18;
  let steer = 0;
  let simX = xw - remaining * SCROLL;
  while (remaining > 1e-6) {
    const h = Math.min(0.02, remaining);
    simX += SCROLL * h;
    steer = Math.max(-0.5, Math.min(0.5, Math.atan2(centre(simX + LOOKAHEAD) - s.y, LOOKAHEAD) - s.heading));
    s.heading += steer * 1.1 * h;
    s.y += Math.sin(s.heading) * SCROLL * h;
    remaining -= h;
  }
  const aheadY = centre(xw + LOOKAHEAD);
  s.trail.push([xw, s.y]);
  if (s.trail.length > 240) s.trail.shift();

  const pts = Array.from({ length: 70 }, (_, i) => {
    const x = -40 + (i * (W + 80)) / 69;
    return [x, centre(x + scroll)] as [number, number];
  });
  const line = (dy: number) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${(y + dy).toFixed(1)}`).join(' ');

  const fovRange = 330;
  const fovHalf = 0.42;
  const inView = (x: number) => x > ROBOT_X + 30 && x < ROBOT_X + fovRange;
  const seen = (dy: number) =>
    pts
      .filter(([x]) => inView(x))
      .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${(y + dy).toFixed(1)}`)
      .join(' ');

  const target = Array.from({ length: 14 }, (_, i) => {
    const x = ROBOT_X + (i * LOOKAHEAD) / 13;
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${centre(x + scroll).toFixed(1)}`;
  }).join(' ');

  const trail = s.trail
    .map(([wx, y]) => [wx - scroll, y] as const)
    .filter(([x]) => x > -20)
    .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');

  const show = (k: number) => stage === k;
  const steerDeg = Math.round((steer * 180) / Math.PI);

  return (
    <>
      <svg className="dg" viewBox={`0 0 ${W} ${H}`} style={{ height: H, bottom: 'auto', overflow: 'hidden' }} aria-hidden>
        <DiagramDefs id="-lf" />
        {/* Road */}
        <path d={line(0)} fill="none" stroke="var(--bg-3)" strokeWidth={LANE_HALF * 2 + 24} />
        <path d={line(-LANE_HALF)} fill="none" stroke="var(--fg)" strokeWidth={4} />
        <path d={line(LANE_HALF)} fill="none" stroke="var(--fg)" strokeWidth={4} />
        <path d={line(0)} fill="none" stroke="var(--muted)" strokeWidth={2} strokeDasharray="4 14" opacity={0.6} />

        {/* 5 · Actuate: the path actually driven */}
        {show(4) && <path d={trail} fill="none" stroke="var(--c-orange)" strokeWidth={5} />}

        {/* 1 · Sense: camera view and the lane lines it sees */}
        <FovWedge x={ROBOT_X} y={s.y} angle={s.heading} range={fovRange} half={fovHalf} active={show(0)} offset={26} />
        {show(0) && (
          <>
            <path d={seen(-LANE_HALF)} fill="none" stroke="var(--c-orange)" strokeWidth={9} strokeLinecap="round" />
            <path d={seen(LANE_HALF)} fill="none" stroke="var(--c-orange)" strokeWidth={9} strokeLinecap="round" />
            <text x={ROBOT_X + 190} y={s.y - 150} className="dg-label is-accent">
              Lane lines seen
            </text>
          </>
        )}

        {/* 3 · Plan: target path along the lane centre */}
        {show(2) && (
          <>
            <path d={target} fill="none" stroke="var(--c-orange)" strokeWidth={5} strokeDasharray="14 10" markerEnd="url(#arrow-accent-lf)" />
            <circle cx={ROBOT_X + LOOKAHEAD} cy={aheadY} r={10} fill="var(--c-orange)" />
            <text x={ROBOT_X + LOOKAHEAD + 22} y={aheadY - 18} className="dg-label is-accent">
              Target point
            </text>
          </>
        )}

        <RobotTop x={ROBOT_X} y={s.y} angle={s.heading} size={78} />

        {/* 2 · Estimate: offset from the lane centre */}
        {show(1) && (
          <g>
            <line x1={ROBOT_X - 70} x2={ROBOT_X + 70} y1={centre(xw)} y2={centre(xw)} stroke="var(--c-orange)" strokeWidth={3} strokeDasharray="8 6" />
            <line x1={ROBOT_X - 60} x2={ROBOT_X - 60} y1={s.y} y2={centre(xw)} stroke="var(--c-orange)" strokeWidth={4} markerEnd="url(#arrow-accent-lf)" markerStart="url(#arrow-accent-lf)" />
            <text x={ROBOT_X - 80} y={Math.min(s.y, centre(xw)) - 34} textAnchor="end" className="dg-label is-accent">
              Offset from centre
            </text>
          </g>
        )}

        {/* 4 · Control: steering correction */}
        {show(3) && (
          <g transform={`translate(${ROBOT_X} ${s.y}) rotate(${(s.heading * 180) / Math.PI})`}>
            <path
              d={`M 60 0 A 60 60 0 0 ${steer >= 0 ? 1 : 0} ${60 * Math.cos(steer * 2.4)} ${60 * Math.sin(steer * 2.4)}`}
              fill="none"
              stroke="var(--c-orange)"
              strokeWidth={6}
              markerEnd="url(#arrow-accent-lf)"
            />
          </g>
        )}
        {show(3) && (
          <text x={ROBOT_X - 50} y={s.y + 96} className="dg-label is-accent">
            Steer {steerDeg >= 0 ? 'right' : 'left'} {Math.abs(steerDeg)}°
          </text>
        )}
      </svg>

      <PhaseStrip items={visual.stages} active={stage} style={{ left: 0, right: 0, bottom: 0 }} />
    </>
  );
}
