import { useMemo } from 'react';
import '../diagram/diagram.css';
import { DiagramDefs, GoalMark, RobotTop, StartMark } from '../diagram/glyphs';
import { at, cubic, route, toD, upTo, type Pt } from '../diagram/path';
import { useSince, useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const W = 1680;
const H = 648;
const START: Pt = [150, 330];
const GOAL: Pt = [1530, 330];

/** Obstacle outline (an irregular block in the middle of the floor). */
const OBSTACLE: Pt[] = [
  [700, 190],
  [930, 170],
  [1000, 260],
  [980, 430],
  [860, 480],
  [690, 440],
  [650, 300],
];

/** Candidate routes the planner considers. */
const OPTIONS: { pts: Pt[]; blocked?: boolean; chosen?: boolean }[] = [
  {
    // Over the top: safe but long
    pts: [START, ...cubic(START, [420, 330], [520, 70], [820, 70], 20).slice(1), ...cubic([820, 70], [1120, 70], [1260, 330], GOAL, 20).slice(1)],
  },
  {
    // Straight through: blocked by the obstacle
    pts: [START, [646, 330]],
    blocked: true,
  },
  {
    // Below: short and clear of the obstacle
    pts: [START, ...cubic(START, [420, 330], [560, 570], [840, 570], 20).slice(1), ...cubic([840, 570], [1120, 570], [1260, 330], GOAL, 20).slice(1)],
    chosen: true,
  },
];

/**
 * Slide 15. Step 0: start, goal and obstacle. Step 1: the routes the planner
 * considers appear. Step 2: one is chosen. Step 3: the robot drives it.
 */
export default function Planning({ visual }: VisualProps<'planning'>) {
  const { step } = useSlide();
  const t = useTime(1.6);
  const chosen = OPTIONS.find((o) => o.chosen)!;
  const r = useMemo(() => route(chosen.pts), [chosen]);

  const showOptions = step >= 1;
  const pick = step >= 2;
  const drive = step >= 3;

  // Options draw in over a second when they appear; the drive loops every 6 s.
  const since = useSince(step, t);
  const reveal = !showOptions ? 0 : step === 1 ? Math.min(1, since / 1.2) : 1;
  const run = drive ? ((since % 6) / 5) * r.total : 0;
  const pose = drive ? at(r, Math.min(r.total, run)) : { x: START[0], y: START[1], angle: 0 };

  return (
    <svg className="dg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <DiagramDefs id="-pl" />

      {/* Floor grid */}
      <g opacity={0.6}>
        {Array.from({ length: 29 }, (_, i) => (
          <line key={`v${i}`} x1={i * 60} x2={i * 60} y1={10} y2={640} stroke="var(--line)" strokeWidth={1} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`h${i}`} x1={0} x2={W} y1={10 + i * 63} y2={10 + i * 63} stroke="var(--line)" strokeWidth={1} />
        ))}
      </g>

      <path d={toD(OBSTACLE) + ' Z'} fill="url(#hatch-pl)" stroke="var(--fg)" strokeWidth={3} />
      <text x={825} y={334} textAnchor="middle" className="dg-label" style={{ fontSize: 22 }}>
        {visual.labels.obstacle}
      </text>

      {/* Candidate routes */}
      {showOptions &&
        OPTIONS.map((o, i) => {
          const rr = route(o.pts);
          const pts = upTo(rr, rr.total * reveal);
          const isChosen = pick && o.chosen;
          return (
            <g key={i} opacity={pick && !o.chosen ? 0.35 : 1} className="dg-fade">
              <path
                d={toD(pts)}
                fill="none"
                stroke={isChosen ? 'var(--c-orange)' : 'var(--muted)'}
                strokeWidth={isChosen ? 6 : 3}
                strokeDasharray={isChosen ? undefined : '12 10'}
              />
              {o.blocked && reveal > 0.95 && <path d="M612 296 l40 40 M652 296 l-40 40" stroke="var(--c-fault)" strokeWidth={6} />}
            </g>
          );
        })}
      {drive && <path d={toD(upTo(r, run))} fill="none" stroke="var(--c-orange)" strokeWidth={10} opacity={0.35} />}

      {showOptions && !pick && (
        <text x={820} y={44} textAnchor="middle" className="dg-label is-muted" style={{ fontSize: 22 }}>
          {visual.labels.options}
        </text>
      )}
      {pick && (
        <text x={840} y={618} textAnchor="middle" className="dg-label is-accent" style={{ fontSize: 22 }}>
          {visual.labels.chosen}
        </text>
      )}

      <StartMark x={START[0]} y={START[1]} label={visual.labels.start} />
      <GoalMark x={GOAL[0]} y={GOAL[1]} label={visual.labels.goal} />
      <RobotTop x={pose.x} y={pose.y} angle={pose.angle} size={70} />
    </svg>
  );
}
