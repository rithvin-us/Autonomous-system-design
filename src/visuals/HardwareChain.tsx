import type { ReactNode } from 'react';
import '../diagram/diagram.css';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const W = 1680;
const H = 648;
const CELL = 336;
const ART_Y = 260; // vertical centre of the drawings
const INK = 'var(--fg)';

/** Two lines for long stage names. */
function wrap(label: string): string[] {
  if (label.length <= 12) return [label];
  const cut = label.indexOf(' ');
  return cut > 0 ? [label.slice(0, cut), label.slice(cut + 1)] : [label];
}

/* ---------- Line drawings of each piece of hardware (centred on 0,0) ---------- */

function CameraArt() {
  return (
    <g>
      <rect x={-120} y={-30} width={240} height={60} rx={30} fill="var(--bg-2)" stroke={INK} strokeWidth={4} />
      {[-72, 72].map((x) => (
        <g key={x}>
          <circle cx={x} cy={0} r={19} fill="var(--bg)" stroke={INK} strokeWidth={3} />
          <circle cx={x} cy={0} r={9} fill="var(--c-orange)" />
        </g>
      ))}
    </g>
  );
}

function ComputerArt() {
  return (
    <g>
      <rect x={-110} y={-70} width={220} height={140} fill="var(--bg-2)" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={-80 + i * 20} x2={-80 + i * 20} y1={-52} y2={22} stroke={INK} strokeWidth={3} />
      ))}
      {[-80, -40, 0, 40].map((x) => (
        <rect key={x} x={x} y={40} width={28} height={16} fill="none" stroke={INK} strokeWidth={2.5} />
      ))}
    </g>
  );
}

function McuArt() {
  return (
    <g>
      <rect x={-90} y={-58} width={180} height={116} fill="var(--bg-2)" stroke={INK} strokeWidth={4} />
      <rect x={-28} y={-28} width={56} height={56} fill="var(--bg)" stroke={INK} strokeWidth={3} />
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={-72 + i * 16} cy={-44} r={4} fill={INK} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={-72 + i * 16} cy={44} r={4} fill={INK} />
      ))}
    </g>
  );
}

function DriverArt() {
  return (
    <g>
      <rect x={-90} y={-50} width={180} height={100} fill="var(--bg-2)" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={-70 + i * 18} y={-80} width={10} height={40} fill={INK} />
      ))}
      {[-60, -20, 20, 60].map((x) => (
        <g key={x}>
          <rect x={x - 14} y={18} width={28} height={22} fill="var(--bg)" stroke={INK} strokeWidth={2.5} />
          <circle cx={x} cy={29} r={5} fill={INK} />
        </g>
      ))}
    </g>
  );
}

function ActuatorArt({ spin }: { spin: number }) {
  return (
    <g>
      <rect x={-118} y={-34} width={110} height={68} fill="var(--bg-2)" stroke={INK} strokeWidth={4} />
      <rect x={-8} y={-8} width={30} height={16} fill={INK} />
      <g transform={`translate(70 0) rotate(${spin})`}>
        <circle r={58} fill="var(--bg)" stroke={INK} strokeWidth={10} />
        <circle r={14} fill={INK} />
        {[0, 72, 144, 216, 288].map((a) => (
          <line key={a} x1={0} y1={0} x2={Math.cos((a * Math.PI) / 180) * 44} y2={Math.sin((a * Math.PI) / 180) * 44} stroke={INK} strokeWidth={4} />
        ))}
      </g>
    </g>
  );
}

/**
 * Slide 17: sensor → onboard computer → low-level controller → motor driver
 * → actuators, with the kind of connection between each. Data moves along
 * the chain. Clicker steps light one connection at a time, then the
 * emergency stop cuts actuator power.
 */
export default function HardwareChain({ visual }: VisualProps<'hardwareChain'>) {
  const { step } = useSlide();
  const t = useTime(1);
  const estop = step > visual.links.length;
  const heldLink = !estop && step > 0 ? step - 1 : -1;
  const spin = estop ? 0 : (t * 220) % 360;

  const art: Record<string, ReactNode> = {
    sensor: <CameraArt />,
    computer: <ComputerArt />,
    mcu: <McuArt />,
    driver: <DriverArt />,
    actuator: <ActuatorArt spin={spin} />,
  };
  const cx = (i: number) => i * CELL + CELL / 2;

  return (
    <svg className="dg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      {/* Connections */}
      {visual.links.map((label, i) => {
        const x0 = cx(i) + 100;
        const x1 = cx(i + 1) - 100;
        const isPower = i === visual.links.length - 1;
        const cut = isPower && estop;
        const active = heldLink === i;
        const dim = (heldLink >= 0 && !active) || (estop && !isPower);
        const p = ((t * 0.9 + i * 0.25) % 1 + 1) % 1;
        return (
          <g key={label} opacity={dim ? 0.3 : 1} className="dg-fade">
            {cut ? (
              <>
                <line x1={x0} x2={(x0 + x1) / 2 - 16} y1={ART_Y} y2={ART_Y} stroke="var(--c-fault)" strokeWidth={5} />
                <line x1={(x0 + x1) / 2 + 16} x2={x1} y1={ART_Y} y2={ART_Y} stroke="var(--line)" strokeWidth={5} />
              </>
            ) : (
              <line x1={x0} x2={x1} y1={ART_Y} y2={ART_Y} stroke={active ? 'var(--c-orange)' : INK} strokeWidth={isPower ? 7 : 4} />
            )}
            {!cut && <rect x={x0 + (x1 - x0) * p - 7} y={ART_Y - 7} width={14} height={14} fill="var(--c-orange)" />}
            <text x={(x0 + x1) / 2} y={ART_Y - 26} textAnchor="middle" className={`dg-label${active ? ' is-accent' : ''}`} style={{ fontSize: 18 }}>
              {label}
            </text>
          </g>
        );
      })}

      {/* Emergency stop on the power line */}
      {(() => {
        const i = visual.links.length - 1;
        const x = (cx(i) + cx(i + 1)) / 2;
        return (
          <g opacity={step === 0 || estop ? 1 : 0.4} className="dg-fade">
            <line x1={x} x2={x} y1={ART_Y - 82} y2={ART_Y - (estop ? 44 : 4)} stroke={INK} strokeWidth={2.5} strokeDasharray="5 5" />
            <circle cx={x} cy={ART_Y - 108} r={26} fill="var(--c-fault)" stroke={INK} strokeWidth={3} />
            <text x={x} y={ART_Y - 152} textAnchor="middle" className="dg-label" style={{ fontSize: 18, fill: estop ? 'var(--c-fault)' : 'var(--muted)' }}>
              E-stop
            </text>
          </g>
        );
      })()}

      {/* Hardware */}
      {visual.stages.map((stg, i) => {
        const lit = heldLink >= 0 && (heldLink === i || heldLink === i - 1);
        const dim = (heldLink >= 0 && !lit) || (estop && stg.id !== 'actuator' && stg.id !== 'driver');
        return (
          <g key={stg.id} opacity={dim ? 0.3 : 1} className="dg-fade">
            <g transform={`translate(${cx(i)} ${ART_Y}) scale(0.78)`}>{art[stg.id]}</g>
            {wrap(stg.label).map((l, k) => (
              <text key={k} x={cx(i)} y={ART_Y + 128 + k * 32} textAnchor="middle" className="dg-title" style={{ fontSize: 28, fill: lit ? 'var(--c-orange)' : 'var(--fg)' }}>
                {l}
              </text>
            ))}
            {stg.detail && (
              <text x={cx(i)} y={ART_Y + 136 + wrap(stg.label).length * 32} textAnchor="middle" className="dg-small" style={{ fontSize: 22 }}>
                {stg.detail}
              </text>
            )}
          </g>
        );
      })}

      {estop && (
        <text x={W / 2} y={H - 40} textAnchor="middle" className="dg-label" style={{ fontSize: 22, fill: 'var(--c-fault)' }}>
          {visual.estop}
        </text>
      )}
    </svg>
  );
}
