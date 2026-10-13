import '../diagram/diagram.css';
import { RobotTop } from '../diagram/glyphs';
import { sensors } from '../content/sensors';
import type { SensorId } from '../content/types';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const W = 1680;
const H = 648;
const CAR = { x: 470, y: 380 };
const PANEL_X = 1240;

type Health = 'ok' | 'weak' | 'lost';

function wedge(x: number, y: number, range: number, half: number, dir = 0) {
  const a0 = dir - half;
  const a1 = dir + half;
  return `M${x} ${y} L${x + Math.cos(a0) * range} ${y + Math.sin(a0) * range} A${range} ${range} 0 0 1 ${x + Math.cos(a1) * range} ${y + Math.sin(a1) * range} Z`;
}

function style(h: Health) {
  if (h === 'lost') return { fillOpacity: 0, strokeOpacity: 0.35, dash: '6 8', stroke: 'var(--muted)' };
  if (h === 'weak') return { fillOpacity: 0.05, strokeOpacity: 0.7, dash: '10 8', stroke: 'var(--c-orange)' };
  return { fillOpacity: 0.12, strokeOpacity: 0.9, dash: undefined, stroke: 'var(--c-orange)' };
}

/**
 * Slide 13. Top-down coverage of the five sensors around a vehicle. Clicker
 * steps change the operating condition; sensors that suffer fade or drop out.
 */
export default function SensorChoice({ visual }: VisualProps<'sensorChoice'>) {
  const { step } = useSlide();
  const t = useTime(1.2);
  const condition = visual.conditions[Math.min(step, visual.conditions.length - 1)];
  const health = (id: SensorId): Health => {
    const s = visual.sensors.find((x) => x.id === id);
    if (!s) return 'ok';
    if (s.lostIn.includes(condition.id)) return 'lost';
    if (s.degradedIn.includes(condition.id)) return 'weak';
    return 'ok';
  };
  const name = (id: SensorId) => sensors[id].shortName;
  const radarR = ((t * 330) % 540) + 40;
  const pingR = ((t * 160) % 120) + 10;

  const cam = style(health('zed2i'));
  const rad = style(health('radar'));
  const uso = style(health('ultrasonic'));
  const gnss = health('gnss');
  const imu = health('imu');

  return (
    <svg className="dg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      {/* Condition backdrops */}
      {condition.id === 'night' && <rect x={0} y={0} width={PANEL_X - 60} height={H} fill="#000" opacity={0.45} />}
      {condition.id === 'fog' &&
        Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={((i * 260 + t * 40) % (PANEL_X + 200)) - 200} y={60 + (i % 3) * 170} width={420} height={150} fill="var(--fg)" opacity={0.06} rx={75} />
        ))}
      {condition.id === 'covered' && (
        <g>
          <rect x={CAR.x - 330} y={40} width={660} height={90} fill="var(--bg-3)" stroke="var(--line)" strokeWidth={2} />
          <text x={CAR.x} y={96} textAnchor="middle" className="dg-label is-muted" style={{ fontSize: 20 }}>
            Roof · tunnel · trees
          </text>
        </g>
      )}

      {/* Radar: long, narrow */}
      <path d={wedge(CAR.x + 70, CAR.y, 560, 0.16)} fill="var(--c-orange)" fillOpacity={rad.fillOpacity * 0.7} stroke={rad.stroke} strokeOpacity={rad.strokeOpacity} strokeWidth={2.5} strokeDasharray={rad.dash} />
      {health('radar') !== 'lost' && (
        <path d={`M${CAR.x + 70 + Math.cos(-0.16) * radarR} ${CAR.y + Math.sin(-0.16) * radarR} A${radarR} ${radarR} 0 0 1 ${CAR.x + 70 + Math.cos(0.16) * radarR} ${CAR.y + Math.sin(0.16) * radarR}`} fill="none" stroke="var(--c-orange)" strokeWidth={3} opacity={1 - radarR / 600} />
      )}
      <text x={CAR.x + 600} y={CAR.y - 112} textAnchor="middle" className="dg-label" style={{ textTransform: 'none', fontSize: 24 }}>
        {name('radar')}
      </text>

      {/* Stereo camera: medium, wide */}
      <path d={wedge(CAR.x + 70, CAR.y, 380, 0.62)} fill="var(--c-orange)" fillOpacity={cam.fillOpacity} stroke={cam.stroke} strokeOpacity={cam.strokeOpacity} strokeWidth={2.5} strokeDasharray={cam.dash} />
      <text x={CAR.x + 70 + Math.cos(-0.62) * 390} y={CAR.y + Math.sin(-0.62) * 390 - 14} className="dg-label" style={{ textTransform: 'none', fontSize: 24, opacity: health('zed2i') === 'lost' ? 0.45 : 1 }}>
        {name('zed2i')}
        {health('zed2i') !== 'ok' && ` · ${health('zed2i')}`}
      </text>

      {/* Ultrasonic: short fans front and rear */}
      {[
        [CAR.x + 70, CAR.y + 34, 0.35],
        [CAR.x + 70, CAR.y - 34, -0.35],
        [CAR.x - 70, CAR.y + 34, Math.PI - 0.35],
        [CAR.x - 70, CAR.y - 34, Math.PI + 0.35],
      ].map(([x, y, d], i) => (
        <g key={i}>
          <path d={wedge(x, y, 120, 0.42, d)} fill="var(--c-orange)" fillOpacity={uso.fillOpacity * 1.6} stroke={uso.stroke} strokeOpacity={uso.strokeOpacity} strokeWidth={2} strokeDasharray={uso.dash} />
          <path
            d={`M${x + Math.cos(d - 0.42) * pingR} ${y + Math.sin(d - 0.42) * pingR} A${pingR} ${pingR} 0 0 1 ${x + Math.cos(d + 0.42) * pingR} ${y + Math.sin(d + 0.42) * pingR}`}
            fill="none"
            stroke="var(--c-orange)"
            strokeWidth={2.5}
            opacity={1 - pingR / 140}
          />
        </g>
      ))}
      <text x={CAR.x - 210} y={CAR.y + 140} textAnchor="middle" className="dg-label" style={{ textTransform: 'none', fontSize: 24 }}>
        {name('ultrasonic')}
      </text>

      {/* GNSS: link to the sky */}
      <g opacity={gnss === 'lost' ? 0.35 : 1}>
        <line x1={CAR.x - 20} y1={CAR.y - 40} x2={CAR.x - 120} y2={150} stroke={gnss === 'lost' ? 'var(--muted)' : 'var(--fg)'} strokeWidth={2.5} strokeDasharray="8 8" strokeDashoffset={-t * 30} />
        <g transform={`translate(${CAR.x - 130} 140)`}>
          <rect x={-14} y={-10} width={28} height={20} fill="var(--fg)" />
          <rect x={-46} y={-5} width={28} height={10} fill="var(--muted)" />
          <rect x={18} y={-5} width={28} height={10} fill="var(--muted)" />
        </g>
        <text x={CAR.x - 182} y={150} textAnchor="end" className="dg-label" style={{ textTransform: 'none', fontSize: 24 }}>
          {name('gnss')}
          {gnss === 'lost' && ' · lost'}
        </text>
        {gnss === 'lost' && <path d={`M${CAR.x - 92} 222 l28 28 M${CAR.x - 64} 222 l-28 28`} stroke="var(--c-fault)" strokeWidth={5} />}
      </g>

      <RobotTop x={CAR.x} y={CAR.y} size={150} />

      {/* IMU: inside the vehicle, measuring its own motion */}
      <g transform={`translate(${CAR.x - 20} ${CAR.y})`} opacity={imu === 'ok' ? 1 : 0.4}>
        <line x1={0} y1={0} x2={34} y2={0} stroke="var(--c-orange)" strokeWidth={3} />
        <line x1={0} y1={0} x2={0} y2={-34} stroke="var(--c-orange)" strokeWidth={3} />
      </g>
      <text x={CAR.x} y={CAR.y + 104} textAnchor="middle" className="dg-label" style={{ textTransform: 'none', fontSize: 24 }}>
        {name('imu')}
      </text>

      {/* Conditions (clicker steps) */}
      <line x1={PANEL_X - 40} x2={PANEL_X - 40} y1={0} y2={H} stroke="var(--line)" strokeWidth={2} />
      <text x={PANEL_X} y={30} className="dg-label is-muted" style={{ fontSize: 20 }}>
        Condition
      </text>
      {visual.conditions.map((c, i) => {
        const active = c.id === condition.id;
        return (
          <g key={c.id}>
            <rect x={PANEL_X} y={66 + i * 92} width={8} height={60} fill={active ? 'var(--c-orange)' : 'var(--line)'} />
            <text x={PANEL_X + 32} y={108 + i * 92} className="dg-title" style={{ fontSize: 32, fill: active ? 'var(--fg)' : 'var(--muted)' }}>
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
