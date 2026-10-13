import { useMemo } from 'react';
import '../diagram/diagram.css';
import { FovWedge, RobotTop } from '../diagram/glyphs';
import { arc, at, route, type Pt } from '../diagram/path';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

/* Simulation viewport (slide pixels) and world scale. */
const VIEW = { x: 900, y: 96, w: 900, h: 504 };
const PX = 45; // pixels per metre
const ORIGIN = { x: VIEW.x + PX * 0.5, y: VIEW.y + PX * 10 };
const toScreen = ([x, y]: Pt): Pt => [ORIGIN.x + x * PX, ORIGIN.y + y * PX];

const RUN = 7; // seconds simulated per scenario
const HOLD = 2.5; // seconds the result stays on screen
const LIMIT = 1.0; // metres: the safe-distance requirement
const DT = 0.02;

interface Run {
  path: Pt[];
  obstacle: Pt;
  /** Samples every DT: distance along path, speed, gap to obstacle, sensor ok. */
  samples: { s: number; gap: number; sensor: boolean; braking: boolean }[];
  result: 'pass' | 'fail';
}

function simulate(obstacleS: number, opts: { detectAt?: number; decel: number; dropoutAt?: number }): Omit<Run, 'path' | 'obstacle'> {
  let s = 0;
  let v = 2;
  let braking = false;
  const samples: Run['samples'] = [];
  for (let t = 0; t <= RUN + 1e-6; t += DT) {
    const gap = obstacleS - s - 0.8;
    const sensor = opts.dropoutAt === undefined || t < opts.dropoutAt;
    if (!braking && opts.detectAt !== undefined && sensor && gap <= opts.detectAt) braking = true;
    if (!sensor) braking = true; // safe reaction to a lost sensor
    if (braking) v = Math.max(0, v - opts.decel * DT);
    s += v * DT;
    samples.push({ s, gap: obstacleS - s - 0.8, sensor, braking });
  }
  const minGap = Math.min(...samples.map((x) => x.gap));
  return { samples, result: minGap >= LIMIT ? 'pass' : 'fail' };
}

function buildRuns(): Run[] {
  // 1 · Obstacle on a straight: seen early, gentle braking.
  const straight: Pt[] = [
    [0.5, 0],
    [17, 0],
  ];
  const a = simulate(9.5, { detectAt: 4, decel: 4 / (2 * (4 - 1.2)) });

  // 2 · Obstacle just after a bend: seen late, stops too close.
  const bend: Pt[] = [[0.5, 0], [4.5, 0], ...arc(4.5, -3, 3, Math.PI / 2, 0, 32).slice(1), [7.5, -9.5]];
  const obsAlong = 4 + (Math.PI * 3) / 2 + 2.2;
  const b = simulate(obsAlong, { detectAt: 1.7, decel: 2 });

  // 3 · Camera drops out: the robot treats it as a fault and stops early.
  const c = simulate(9.5, { dropoutAt: 2.5, decel: 1.5 });

  const pointAt = (path: Pt[], s: number): Pt => {
    const p = at(route(path), s);
    return [p.x, p.y];
  };
  return [
    { path: straight, obstacle: pointAt(straight, 9.5), ...a },
    { path: bend, obstacle: pointAt(bend, obsAlong), ...b },
    { path: straight, obstacle: pointAt(straight, 9.5), ...c },
  ];
}

/* Plot area (slide pixels). */
const PLOT = { x: 960, y: 690, w: 840, h: 250 };
const MAX_GAP = 9;

/**
 * Slide 22. A simulated robot runs three test scenarios; the run is plotted
 * live as distance to the obstacle against a safe limit and graded.
 * Clicker steps move to the next scenario.
 */
export default function Simulation({ visual }: VisualProps<'simulation'>) {
  const { step } = useSlide();
  const t = useTime(5.5);
  const runs = useMemo(buildRuns, []);
  const current = Math.min(step, runs.length - 1);
  const run = runs[current];
  const local = t % (RUN + HOLD);
  const idx = Math.min(run.samples.length - 1, Math.floor(local / DT));
  const sample = run.samples[idx];
  const done = local >= RUN;

  const r = route(run.path);
  const pose = at(r, sample.s);
  const [rx, ry] = toScreen([pose.x, pose.y]);
  const [ox, oy] = toScreen(run.obstacle);
  const sensorSees = sample.sensor && sample.gap < 4.5;

  const plotX = (time: number) => PLOT.x + (time / RUN) * PLOT.w;
  const plotY = (gap: number) => PLOT.y + PLOT.h - (Math.max(0, Math.min(MAX_GAP, gap)) / MAX_GAP) * PLOT.h;
  const curve = run.samples
    .slice(0, idx + 1)
    .filter((_, i) => i % 3 === 0 || i === idx)
    .map((smp, i) => `${i ? 'L' : 'M'}${plotX(run.samples.indexOf(smp) * DT).toFixed(1)} ${plotY(smp.gap).toFixed(1)}`)
    .join(' ');

  return (
    <svg className="dg" viewBox="0 0 1920 1080" aria-hidden>
      <defs>
        <clipPath id="sim-view">
          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} />
        </clipPath>
      </defs>

      {/* ---------- Simulation viewport ---------- */}
      <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="var(--bg-2)" stroke="var(--line)" strokeWidth={2} />
      <g clipPath="url(#sim-view)">
        {Array.from({ length: 21 }, (_, i) => (
          <line key={`gx${i}`} x1={VIEW.x + i * PX} x2={VIEW.x + i * PX} y1={VIEW.y} y2={VIEW.y + VIEW.h} stroke="var(--line)" strokeWidth={1} opacity={0.5} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`gy${i}`} x1={VIEW.x} x2={VIEW.x + VIEW.w} y1={VIEW.y + i * PX} y2={VIEW.y + i * PX} stroke="var(--line)" strokeWidth={1} opacity={0.5} />
        ))}
        {/* Route */}
        <path
          d={run.path.map((p, i) => `${i ? 'L' : 'M'}${toScreen(p)[0]} ${toScreen(p)[1]}`).join(' ')}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={34}
          strokeLinejoin="round"
          opacity={0.25}
        />
        {/* Obstacle with detection box */}
        <rect x={ox - 18} y={oy - 18} width={36} height={36} fill="var(--fg)" opacity={0.85} />
        {sensorSees && <rect x={ox - 28} y={oy - 28} width={56} height={56} fill="none" stroke="var(--c-orange)" strokeWidth={3} strokeDasharray="8 5" />}
        {sample.sensor && <FovWedge x={rx} y={ry} angle={pose.angle} range={200} half={0.4} offset={18} active={sensorSees} />}
        <RobotTop x={rx} y={ry} angle={pose.angle} size={46} />
      </g>
      {/* Coordinate gizmo */}
      <g transform={`translate(${VIEW.x + 24} ${VIEW.y + VIEW.h - 24})`}>
        <line x1={0} y1={0} x2={44} y2={0} stroke="var(--c-orange)" strokeWidth={3} />
        <line x1={0} y1={0} x2={0} y2={-44} stroke="var(--fg)" strokeWidth={3} />
      </g>
      <text x={VIEW.x + 20} y={VIEW.y - 18} className="dg-label is-muted" style={{ fontSize: 19 }}>
        {visual.simLabel}
      </text>
      <text x={VIEW.x + VIEW.w} y={VIEW.y - 18} textAnchor="end" className="dg-label is-muted" style={{ fontSize: 19 }}>
        t = {(Math.min(local, RUN)).toFixed(1)} s
      </text>
      {!sample.sensor && (
        <text x={VIEW.x + VIEW.w - 20} y={VIEW.y + 44} textAnchor="end" className="dg-label" style={{ fontSize: 22, fill: 'var(--c-fault)' }}>
          Camera dropout
        </text>
      )}

      {/* ---------- Test log ---------- */}
      <text x={120} y={668} className="dg-label is-muted" style={{ fontSize: 19 }}>
        {visual.testLabel}
      </text>
      {visual.scenarios.map((name, i) => {
        const y = 724 + i * 88;
        const status = i < current ? runs[i].result : i === current ? (done ? run.result : 'running') : 'queued';
        const isFail = status === 'fail';
        const chip = status === 'pass' ? 'PASS' : status === 'fail' ? 'FAIL' : status === 'running' ? 'RUNNING' : '—';
        return (
          <g key={name} opacity={i === current ? 1 : 0.55}>
            <text x={120} y={y + 10} className="dg-num" style={{ fontSize: 24 }}>
              {String(i + 1).padStart(2, '0')}
            </text>
            <text x={170} y={y + 12} className="dg-title" style={{ fontSize: 30 }}>
              {name}
            </text>
            <rect x={640} y={y - 22} width={160} height={44} fill={isFail ? 'var(--c-fault)' : status === 'pass' ? 'var(--fg)' : 'none'} stroke={status === 'running' ? 'var(--c-orange)' : 'var(--line)'} strokeWidth={2} />
            <text x={720} y={y + 8} textAnchor="middle" className="dg-label" style={{ fontSize: 20, fill: isFail ? '#fff' : status === 'pass' ? 'var(--bg)' : status === 'running' ? 'var(--c-orange)' : 'var(--muted)' }}>
              {chip}
            </text>
          </g>
        );
      })}

      {/* ---------- Plot: distance to obstacle over time ---------- */}
      <line x1={PLOT.x} x2={PLOT.x} y1={PLOT.y} y2={PLOT.y + PLOT.h} stroke="var(--fg)" strokeWidth={2} />
      <line x1={PLOT.x} x2={PLOT.x + PLOT.w} y1={PLOT.y + PLOT.h} y2={PLOT.y + PLOT.h} stroke="var(--fg)" strokeWidth={2} />
      <text x={PLOT.x} y={PLOT.y - 22} className="dg-label is-muted" style={{ fontSize: 19 }}>
        {visual.metric}
      </text>
      <text x={PLOT.x + PLOT.w} y={PLOT.y + PLOT.h + 36} textAnchor="end" className="dg-label is-muted" style={{ fontSize: 19 }}>
        Time
      </text>
      <line x1={PLOT.x} x2={PLOT.x + PLOT.w} y1={plotY(LIMIT)} y2={plotY(LIMIT)} stroke="var(--c-fault)" strokeWidth={2.5} strokeDasharray="10 8" />
      <text x={PLOT.x + PLOT.w} y={plotY(LIMIT) - 12} textAnchor="end" className="dg-label" style={{ fontSize: 19, fill: 'var(--c-fault)' }}>
        {visual.threshold}
      </text>
      <path d={curve} fill="none" stroke="var(--c-orange)" strokeWidth={4} />
      <circle cx={plotX(idx * DT)} cy={plotY(sample.gap)} r={7} fill="var(--c-orange)" />
    </svg>
  );
}
