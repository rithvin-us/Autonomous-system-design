import { useRef } from 'react';
import '../diagram/diagram.css';
import { DiagramDefs, FovWedge, RobotTop } from '../diagram/glyphs';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const W = 1680;
const H = 648;
const LANE_Y = 380;
const SENSORS = ['Camera', 'Radar', 'GNSS', 'IMU', 'Ultrasonic'];
const STATE_W = 300;
const STATE_GAP = 90;

/**
 * Slide 21. Clicker steps: 1 the camera fails and the fault is detected,
 * 2 the robot slows to a safe stop with hazard lights, 3 the independent
 * hardware emergency stop opens the motor power circuit.
 */
export default function Safety({ visual }: VisualProps<'safety'>) {
  const { step } = useSlide();
  const t = useTime(2);
  const sim = useRef({ t: 0, x: 260, v: 150 });

  const s = sim.current;
  const dt = Math.min(0.05, Math.max(0, t - s.t));
  s.t = t;
  const targetV = step === 0 ? 150 : step === 1 ? 110 : 0;
  s.v += (targetV - s.v) * Math.min(1, dt * (step >= 2 ? 1.4 : 2));
  if (s.v < 1 && step >= 2) s.v = 0;
  s.x += s.v * dt;
  if (s.x > W + 60) s.x = -60;

  const state = Math.min(step, 2); // 0 normal, 1 fault, 2 safe
  const cameraLost = step >= 1;
  const hazard = step >= 2 && Math.floor(t * 2.4) % 2 === 0;
  const estop = step >= 3;

  return (
    <svg className="dg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <DiagramDefs id="-sf" />
      <g transform="translate(0 22)">

      {/* State machine */}
      {visual.states.map((st, i) => {
        const x = i * (STATE_W + STATE_GAP);
        const active = state === i && !estop;
        const tone = i === 1 ? 'var(--c-fault)' : 'var(--c-orange)';
        return (
          <g key={st.label} className="dg-fade" opacity={active || (estop && i === 2) ? 1 : 0.4}>
            <rect x={x} y={0} width={STATE_W} height={96} fill={active ? tone : 'var(--bg)'} stroke={active ? tone : 'var(--fg)'} strokeWidth={3} />
            <text x={x + 24} y={44} className="dg-title" style={{ fontSize: 30, fill: active ? '#fff' : 'var(--fg)' }}>
              {st.label}
            </text>
            {st.detail && (
              <text x={x + 24} y={76} className="dg-small" style={{ fontSize: 20, fill: active ? '#fff' : 'var(--muted)' }}>
                {st.detail}
              </text>
            )}
            {i < visual.states.length - 1 && (
              <line x1={x + STATE_W + 10} x2={x + STATE_W + STATE_GAP - 14} y1={48} y2={48} stroke="var(--fg)" strokeWidth={3} markerEnd="url(#arrow-sf)" />
            )}
          </g>
        );
      })}

      {/* Independent hardware stop: battery → contactor → motors */}
      {(() => {
        const x0 = 1210;
        const y = 48;
        const open = estop;
        return (
          <g className="dg-fade" opacity={step >= 3 ? 1 : 0.45}>
            <line x1={x0 - 40} x2={x0 - 40} y1={-10} y2={110} stroke="var(--line)" strokeWidth={2} />
            <rect x={x0} y={y - 22} width={70} height={44} fill="var(--bg)" stroke="var(--fg)" strokeWidth={3} />
            <text x={x0 + 35} y={y + 8} textAnchor="middle" className="dg-label" style={{ fontSize: 18 }}>
              BATT
            </text>
            <line x1={x0 + 70} x2={x0 + 150} y1={y} y2={y} stroke="var(--fg)" strokeWidth={4} />
            {/* Switch contact */}
            <circle cx={x0 + 150} cy={y} r={6} fill="var(--fg)" />
            <line
              x1={x0 + 150}
              y1={y}
              x2={x0 + 214}
              y2={open ? y - 36 : y}
              stroke={open ? 'var(--c-fault)' : 'var(--fg)'}
              strokeWidth={4}
              className="dg-fade"
            />
            <circle cx={x0 + 220} cy={y} r={6} fill="var(--fg)" />
            <line x1={x0 + 226} x2={x0 + 300} y1={y} y2={y} stroke={open ? 'var(--line)' : 'var(--fg)'} strokeWidth={4} />
            <circle cx={x0 + 334} cy={y} r={32} fill="var(--bg)" stroke={open ? 'var(--line)' : 'var(--fg)'} strokeWidth={3} />
            <text x={x0 + 334} y={y + 8} textAnchor="middle" className="dg-title" style={{ fontSize: 26, fill: open ? 'var(--muted)' : 'var(--fg)' }}>
              M
            </text>
            {/* Emergency stop button */}
            <circle cx={x0 + 182} cy={y + 74} r={22} fill="var(--c-fault)" stroke="var(--fg)" strokeWidth={3} />
            <line x1={x0 + 182} x2={x0 + 182} y1={y + 52} y2={y + (open ? -14 : 0)} stroke="var(--fg)" strokeWidth={2} strokeDasharray="4 4" />
            <text x={x0} y={y + 124} className="dg-label" style={{ fontSize: 19 }}>
              {visual.hardwareStop.label}
            </text>
            {visual.hardwareStop.detail && (
              <text x={x0} y={y + 152} className="dg-small" style={{ fontSize: 19 }}>
                {visual.hardwareStop.detail}
              </text>
            )}
          </g>
        );
      })()}

      </g>

      {/* Track */}
      <rect x={0} y={LANE_Y - 90} width={W} height={180} fill="var(--bg-2)" />
      <line x1={0} x2={W} y1={LANE_Y - 90} y2={LANE_Y - 90} stroke="var(--fg)" strokeWidth={3} />
      <line x1={0} x2={W} y1={LANE_Y + 90} y2={LANE_Y + 90} stroke="var(--fg)" strokeWidth={3} />

      {/* Robot, its camera view, hazard lights */}
      {!cameraLost && <FovWedge x={s.x} y={LANE_Y} range={260} half={0.32} offset={30} />}
      {cameraLost && (
        <g transform={`translate(${s.x + 60} ${LANE_Y})`}>
          <path d="M0 0 L220 -72 L220 72 Z" fill="none" stroke="var(--c-fault)" strokeWidth={2.5} strokeDasharray="8 8" />
          <path d="M150 -22 L194 22 M194 -22 L150 22" stroke="var(--c-fault)" strokeWidth={6} />
        </g>
      )}
      <RobotTop x={s.x} y={LANE_Y} size={96} />
      {hazard &&
        [-1, 1].flatMap((sx) =>
          [-1, 1].map((sy) => <circle key={`${sx}${sy}`} cx={s.x + sx * 46} cy={LANE_Y + sy * 34} r={10} fill="var(--c-orange)" />),
        )}
      {step >= 2 && s.v === 0 && (
        <text x={s.x} y={LANE_Y - 110} textAnchor="middle" className="dg-label is-accent" style={{ fontSize: 22 }}>
          Stopped
        </text>
      )}

      {/* Sensor health */}
      {SENSORS.map((name, i) => {
        const failed = cameraLost && i === 0;
        const x = i * 220;
        return (
          <g key={name}>
            <circle cx={x + 12} cy={566} r={11} fill={failed ? 'var(--c-fault)' : 'var(--fg)'} />
            <text x={x + 34} y={574} className="dg-label" style={{ fontSize: 20, fill: failed ? 'var(--c-fault)' : 'var(--fg)' }}>
              {name}
            </text>
          </g>
        );
      })}

      {/* Speed */}
      <text x={1150} y={574} className="dg-label is-muted" style={{ fontSize: 20 }}>
        Speed
      </text>
      <rect x={1250} y={556} width={380} height={20} fill="var(--bg-2)" stroke="var(--line)" strokeWidth={2} />
      <rect x={1250} y={556} width={(380 * s.v) / 150} height={20} fill="var(--fg)" />
    </svg>
  );
}
