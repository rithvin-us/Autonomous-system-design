import { useMemo } from 'react';
import '../diagram/diagram.css';
import { RobotTop } from '../diagram/glyphs';
import { at, route, upTo, toD, type Pt } from '../diagram/path';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const W = 1080;
const H = 940;
const CELL = 34;
const COLS = 27;
const ROWS = 20;
const VIEW_R = 4.2; // cells the robot can see around it
const SPEED = 2.4; // cells per second
const LOOP_HOLD = 2;

/** Floor plan: '#' wall, '.' free. Rows top to bottom. */
const PLAN = [
  '###########################',
  '#.........#...............#',
  '#.........................#',
  '#.........#.......#########',
  '#.........#.......#.......#',
  '#.........................#',
  '#.........................#',
  '#######...........#.......#',
  '#.....#...................#',
  '#.....#...................#',
  '#.....#######.....#########',
  '#.................#.......#',
  '#.................#.......#',
  '#.....######......#.......#',
  '#.....#....#..............#',
  '#.....#....#..............#',
  '#..........#......#.......#',
  '#..........#......#.......#',
  '#..........#......#.......#',
  '###########################',
];

/** Route through the plan, in cell coordinates. */
const ROUTE: Pt[] = [
  [3, 17],
  [3, 11.5],
  [8.5, 11.5],
  [14, 11.5],
  [14, 8.5],
  [22.5, 8.5],
  [22.5, 4.5],
  [22.5, 5.5],
  [14, 5.5],
  [14, 2],
  [4, 2],
  [4, 5.5],
];

/** Landmarks the robot can recognise (cell coords, on walls). */
const LANDMARKS: Pt[] = [
  [7, 10.2],
  [18.6, 3.6],
  [10.6, 3.6],
];

const px = ([x, y]: Pt): Pt => [x * CELL, y * CELL];

/**
 * Slide 14. The robot drives through a building it is mapping. Grey cells
 * appear as its sensors see them (mapping). The ring shows how unsure it is
 * of its own position: it grows as it drives on motion estimates alone and
 * snaps small when it recognises a landmark (localisation).
 * Clicker steps emphasise localisation, then mapping.
 */
export default function Localisation({ visual }: VisualProps<'localisation'>) {
  const { step } = useSlide();
  const t = useTime(5);
  const r = useMemo(() => route(ROUTE.map((p) => [p[0] + 0.5, p[1] + 0.5] as Pt)), []);
  const duration = r.total / SPEED;
  const local = t % (duration + LOOP_HOLD);
  const s = Math.min(r.total, local * SPEED);
  const pose = at(r, s);

  // First distance along the route at which each cell comes into view.
  const seenAt = useMemo(() => {
    const out = new Map<string, number>();
    for (let d = 0; d <= r.total; d += 0.25) {
      const p = at(r, d);
      for (let y = Math.floor(p.y - VIEW_R); y <= p.y + VIEW_R; y++)
        for (let x = Math.floor(p.x - VIEW_R); x <= p.x + VIEW_R; x++) {
          if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
          const k = `${x},${y}`;
          if (!out.has(k) && Math.hypot(x + 0.5 - p.x, y + 0.5 - p.y) <= VIEW_R) out.set(k, d);
        }
    }
    return out;
  }, [r]);

  // Uncertainty: grows with distance since the last landmark sighting.
  let lastFix = 0;
  let fixing: Pt | null = null;
  for (let d = 0; d <= s; d += 0.25) {
    const p = at(r, d);
    for (const lm of LANDMARKS) {
      if (Math.hypot(lm[0] - p.x, lm[1] - p.y) < 3.2) {
        lastFix = d;
        if (s - d < 1.2) fixing = lm;
      }
    }
  }
  const sinceFix = s - lastFix;
  const sigma = Math.min(1.9, 0.35 + sinceFix * 0.16); // cells
  const drift: Pt = [Math.sin(s * 0.7) * sinceFix * 0.06, Math.cos(s * 0.5) * sinceFix * 0.06];
  const est: Pt = [pose.x + drift[0], pose.y + drift[1]];

  const focusLoc = step === 1;
  const focusMap = step === 2;

  return (
    <svg className="dg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <g transform={`translate(${W - COLS * CELL} 40)`}>
        {/* Map: only cells seen so far */}
        <g opacity={focusLoc ? 0.35 : 1} className="dg-fade">
          {PLAN.flatMap((row, y) =>
            row.split('').map((c, x) => {
              const d = seenAt.get(`${x},${y}`);
              if (d === undefined || d > s) return null;
              return c === '#' ? (
                <rect key={`${x},${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} fill="var(--fg)" />
              ) : (
                <rect key={`${x},${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} fill="var(--bg-3)" stroke="var(--bg-2)" strokeWidth={1} />
              );
            }),
          )}
          {/* Unseen area outline */}
          <rect x={0} y={0} width={COLS * CELL} height={ROWS * CELL} fill="none" stroke="var(--line)" strokeWidth={2} strokeDasharray="6 8" />
        </g>

        {/* Route travelled */}
        <path d={toD(upTo(r, s).map(px))} fill="none" stroke="var(--muted)" strokeWidth={3} strokeDasharray="10 8" opacity={focusMap ? 0.4 : 1} />

        {/* Landmarks */}
        {LANDMARKS.map((lm, i) => {
          const seen = (seenAt.get(`${Math.floor(lm[0])},${Math.floor(lm[1])}`) ?? Infinity) <= s;
          const [x, y] = px(lm);
          if (!seen) return null;
          return (
            <path key={i} d={`M${x} ${y - 16} L${x + 15} ${y + 11} L${x - 15} ${y + 11} Z`} fill={seen ? 'var(--c-orange)' : 'none'} stroke="var(--c-orange)" strokeWidth={3} opacity={focusMap ? 0.4 : 1} />
          );
        })}
        {fixing && <line x1={px(est)[0]} y1={px(est)[1]} x2={px(fixing)[0]} y2={px(fixing)[1]} stroke="var(--c-orange)" strokeWidth={3} strokeDasharray="6 6" />}

        {/* True robot, estimated position and its uncertainty */}
        <RobotTop x={pose.x * CELL} y={pose.y * CELL} angle={pose.angle} size={46} />
        <g opacity={focusMap ? 0.35 : 1} className="dg-fade">
          <circle cx={px(est)[0]} cy={px(est)[1]} r={sigma * CELL * 2} fill="var(--c-orange)" fillOpacity={0.14} stroke="var(--c-orange)" strokeWidth={3} />
          <circle cx={px(est)[0]} cy={px(est)[1]} r={7} fill="var(--c-orange)" />
        </g>
      </g>

      {/* Legend */}
      <g transform={`translate(${W - COLS * CELL} ${ROWS * CELL + 100})`}>
        {[
          { key: 'map', label: visual.labels.map, swatch: <rect x={0} y={-16} width={22} height={22} fill="var(--fg)" /> },
          { key: 'est', label: visual.labels.estimate, swatch: <circle cx={11} cy={-5} r={11} fill="var(--c-orange)" fillOpacity={0.2} stroke="var(--c-orange)" strokeWidth={3} /> },
          { key: 'lm', label: visual.labels.landmark, swatch: <path d="M11 -18 L24 6 L-2 6 Z" fill="var(--c-orange)" /> },
          { key: 'route', label: visual.labels.route, swatch: <line x1={0} x2={24} y1={-5} y2={-5} stroke="var(--muted)" strokeWidth={3} strokeDasharray="6 5" /> },
        ].map((item, i) => (
          <g key={item.key} transform={`translate(${(i % 2) * 440} ${Math.floor(i / 2) * 44})`}>
            {item.swatch}
            <text x={38} y={2} className="dg-label" style={{ fontSize: 19 }}>
              {item.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
