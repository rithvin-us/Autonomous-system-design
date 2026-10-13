import '../diagram/diagram.css';
import { DiagramDefs, FovWedge, GoalMark, Obstacle, RobotTop, StartMark } from '../diagram/glyphs';
import { at, cubic, route, toD, type Pt } from '../diagram/path';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

/* ---------- Left: conveyor with a press on a fixed timer ---------- */
const BELT_Y = 400; // top surface
const BELT_X0 = 20;
const BELT_X1 = 780;
const STATION_X = 400;
const SPACING = 190;
const SPEED = 95; // px per second → one press every 2 s
const LOOP = SPACING * 5;
const BOX_W = 64;
const BOX_H = 56;
const ODD_H = 92; // the unexpected tall object
const HEAD_UP = 286; // press head bottom when raised
const HEAD_DOWN = BELT_Y - BOX_H; // press head bottom when pressing a normal box

/* ---------- Right: robot that senses and re-plans ---------- */
const LANE_Y = 400;
const START: Pt = [950, LANE_Y];
const GOAL: Pt = [1620, LANE_Y];
const OBS_X = 1290;
const RUN = 6.5; // seconds per run
const OFFSETS = [0, -48, 46]; // obstacle moves between runs: conditions change

function detour(obsY: number): Pt[] {
  const side = obsY - LANE_Y >= 0 ? -1 : 1; // pass on the side with more room
  const y = obsY + side * 128;
  return [
    START,
    [OBS_X - 230, LANE_Y],
    ...cubic([OBS_X - 230, LANE_Y], [OBS_X - 150, LANE_Y], [OBS_X - 130, y], [OBS_X - 60, y], 16).slice(1),
    [OBS_X + 60, y],
    ...cubic([OBS_X + 60, y], [OBS_X + 130, y], [OBS_X + 150, LANE_Y], [OBS_X + 230, LANE_Y], 16).slice(1),
    GOAL,
  ];
}

/**
 * Slide 03. Left: a conveyor press that fires every 2 s whatever is under it.
 * Right: a mobile robot driving to a goal. Clicker step 1 puts an unexpected
 * object in both: the press jams on it; the robot sees it and goes round,
 * choosing a different way each run as the obstacle moves.
 */
export default function AutomationVsAutonomy({ visual }: VisualProps<'automationVsAutonomy'>) {
  const { step } = useSlide();
  const t = useTime(1.4);
  const disturbed = step >= 1;

  /* Left */
  const u = t * SPEED;
  const phase = ((u % SPACING) + SPACING) % SPACING;
  const nearest = Math.min(phase, SPACING - phase);
  const pressAmt = Math.max(0, 1 - nearest / 24);
  const boxes = Array.from({ length: 5 }, (_, i) => {
    const cx = (((u + i * SPACING + 115) % LOOP) + LOOP) % LOOP - 95;
    const odd = disturbed && i === 1;
    return { cx, odd, h: odd ? ODD_H : BOX_H };
  });
  const under = boxes.find((b) => Math.abs(b.cx - STATION_X) < 30);
  const floor = under ? BELT_Y - under.h : BELT_Y;
  const headBottom = Math.min(HEAD_UP + (HEAD_DOWN - HEAD_UP) * pressAmt, floor);
  const jam = !!under?.odd && pressAmt > 0.2 && headBottom >= floor - 0.5;

  /* Right */
  const run = Math.floor(t / RUN);
  const obsY = LANE_Y + OFFSETS[run % OFFSETS.length];
  const pts = disturbed ? detour(obsY) : [START, GOAL];
  const r = route(pts);
  const p = (t % RUN) / RUN;
  const travel = Math.min(1, p / 0.88);
  const pos = at(r, travel * r.total);
  const sees = disturbed && pos.x > OBS_X - 250 && pos.x < OBS_X + 40;
  const replanned = disturbed && pos.x > OBS_X - 250;

  return (
    <svg className="dg" viewBox="0 0 1680 648" aria-hidden>
      <DiagramDefs id="-avs" />

      {/* ================= AUTOMATION ================= */}
      <text x={0} y={36} className="dg-title" style={{ fontSize: 44 }}>
        {visual.automation.label}
      </text>
      {visual.automation.detail && (
        <text x={0} y={78} className="dg-small" style={{ fontSize: 24 }}>
          {visual.automation.detail}
        </text>
      )}

      {/* Press gantry */}
      <rect x={300} y={176} width={200} height={20} fill="var(--fg)" />
      <rect x={306} y={196} width={12} height={BELT_Y - 196} fill="var(--muted)" />
      <rect x={482} y={196} width={12} height={BELT_Y - 196} fill="var(--muted)" />
      <rect x={368} y={196} width={64} height={54} fill="var(--bg-3)" stroke="var(--fg)" strokeWidth={3} />
      <rect x={393} y={250} width={14} height={Math.max(0, headBottom - 22 - 250)} fill="var(--muted)" />
      <rect x={344} y={headBottom - 22} width={112} height={22} fill="var(--c-orange)" />
      <text x={520} y={226} className="dg-label is-muted">
        Fixed timer: 2 seconds
      </text>

      {/* Belt */}
      <rect x={BELT_X0} y={BELT_Y} width={BELT_X1 - BELT_X0} height={34} fill="var(--fg)" />
      <line
        x1={BELT_X0 + 18}
        x2={BELT_X1 - 18}
        y1={BELT_Y + 17}
        y2={BELT_Y + 17}
        stroke="var(--bg)"
        strokeWidth={3}
        strokeDasharray="10 22"
        strokeDashoffset={-u}
      />
      {[BELT_X0 + 17, BELT_X1 - 17].map((x) => (
        <circle key={x} cx={x} cy={BELT_Y + 17} r={10} fill="var(--bg)" />
      ))}

      {/* Items */}
      <clipPath id="avs-belt-clip">
        <rect x={BELT_X0} y={0} width={BELT_X1 - BELT_X0} height={BELT_Y} />
      </clipPath>
      <g clipPath="url(#avs-belt-clip)">
        {boxes.map((b, i) =>
          b.odd ? (
            <g key={i}>
              <rect x={b.cx - 30} y={BELT_Y - b.h} width={60} height={b.h} fill="url(#hatch-avs)" stroke="var(--fg)" strokeWidth={3} />
            </g>
          ) : (
            <rect key={i} x={b.cx - BOX_W / 2} y={BELT_Y - BOX_H} width={BOX_W} height={BOX_H} fill="var(--bg-3)" stroke="var(--fg)" strokeWidth={3} />
          ),
        )}
      </g>

      {disturbed && (
        <text x={BELT_X0} y={BELT_Y + 92} className="dg-label is-muted">
          Unexpected object on the belt
        </text>
      )}
      {jam && (
        <g transform={`translate(${STATION_X} ${floor - 30})`}>
          {[-60, -30, 0, 30, 60].map((a) => (
            <line
              key={a}
              x1={Math.sin((a * Math.PI) / 180) * 70}
              y1={-Math.cos((a * Math.PI) / 180) * 40}
              x2={Math.sin((a * Math.PI) / 180) * 104}
              y2={-Math.cos((a * Math.PI) / 180) * 64}
              stroke="var(--c-fault)"
              strokeWidth={5}
            />
          ))}
          <text x={130} y={-50} className="dg-title" style={{ fill: 'var(--c-fault)', fontSize: 34 }}>
            Jam
          </text>
        </g>
      )}

      {/* Divider */}
      <line x1={840} x2={840} y1={0} y2={648} stroke="var(--line)" strokeWidth={2} />

      {/* ================= AUTONOMY ================= */}
      <text x={890} y={36} className="dg-title" style={{ fontSize: 44 }}>
        {visual.autonomy.label}
      </text>
      {visual.autonomy.detail && (
        <text x={890} y={78} className="dg-small" style={{ fontSize: 24 }}>
          {visual.autonomy.detail}
        </text>
      )}

      {/* Floor grid */}
      <g opacity={0.55}>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={900 + i * 60} x2={900 + i * 60} y1={160} y2={640} stroke="var(--line)" strokeWidth={1.5} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1={900} x2={1620} y1={160 + i * 60} y2={160 + i * 60} stroke="var(--line)" strokeWidth={1.5} />
        ))}
      </g>

      <StartMark x={START[0]} y={START[1]} label="Start" />
      <GoalMark x={GOAL[0]} y={GOAL[1]} label="Goal" />

      {/* Planned route: straight until the robot sees something */}
      {!replanned && (
        <line x1={pos.x} y1={pos.y} x2={GOAL[0] - 26} y2={GOAL[1]} stroke="var(--muted)" strokeWidth={3} strokeDasharray="10 10" />
      )}
      {replanned && <path d={toD(pts.slice(1))} fill="none" stroke="var(--c-orange)" strokeWidth={4} strokeDasharray="12 9" />}

      {disturbed && <Obstacle x={OBS_X} y={obsY} w={92} h={92} hatchId="-avs" />}

      <FovWedge x={pos.x} y={pos.y} angle={pos.angle} range={210} half={0.48} active={sees} offset={26} />
      <RobotTop x={pos.x} y={pos.y} angle={pos.angle} size={74} />

      {replanned && (
        <text x={OBS_X} y={obsY + (obsY >= LANE_Y ? 98 : -76)} textAnchor="middle" className="dg-label is-accent">
          New route
        </text>
      )}
    </svg>
  );
}
