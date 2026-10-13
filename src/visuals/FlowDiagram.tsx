import { diagrams } from '../content/diagrams';
import type { DiagramConfig, DiagramEdge, DiagramNode } from '../content/types';
import '../diagram/diagram.css';
import { DiagramDefs } from '../diagram/glyphs';
import { at, route, toD, type Pt } from '../diagram/path';
import { useTime } from '../lib/useTime';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';

const STEP_SECONDS = 1.1;

function edgePoints(e: DiagramEdge, nodes: Map<string, DiagramNode>): Pt[] {
  if (e.points) return e.points;
  const a = nodes.get(e.from)!;
  const b = nodes.get(e.to)!;
  const y = a.y + a.h / 2;
  if (y >= b.y && y <= b.y + b.h) return [[a.x + a.w, y], [b.x, y]];
  const mx = (a.x + a.w + b.x) / 2;
  return [[a.x + a.w, y], [mx, y], [mx, b.y + b.h / 2], [b.x, b.y + b.h / 2]];
}

/** Split long labels onto two lines at " + " or the last space. */
function lines(label: string, max: number): string[] {
  if (label.length <= max) return [label];
  const plus = label.indexOf(' + ');
  if (plus > 0) return [label.slice(0, plus + 2), label.slice(plus + 3)];
  const cut = label.lastIndexOf(' ', max);
  return cut > 0 ? [label.slice(0, cut), label.slice(cut + 1)] : [label];
}

function columnOf(n: DiagramNode, cfg: DiagramConfig) {
  return cfg.columns.findIndex((c) => n.x >= c.x - 1 && n.x < c.x + c.w);
}

/**
 * Block diagram from content/diagrams.ts. At step 0 a data pulse moves
 * through every stage in turn; clicker steps hold on one column and show
 * only the data leaving it.
 */
export default function FlowDiagram({ visual }: VisualProps<'flowDiagram'>) {
  const cfg = diagrams[visual.diagram];
  const { step } = useSlide();
  const t = useTime(STEP_SECONDS * 0.6);
  if (!cfg) return null;

  const nodes = new Map(cfg.nodes.map((n) => [n.id, n]));
  const maxStep = Math.max(...cfg.edges.map((e) => e.step));
  const held = step - 1; // column index, -1 = auto
  const lastCol = cfg.columns.length - 1;

  // Which edge step is carrying data right now, and how far along it is.
  const cycle = (t / STEP_SECONDS) % (maxStep + 1);
  const autoStep = Math.floor(cycle);
  const progress = held >= 0 ? (t / STEP_SECONDS) % 1 : cycle - autoStep;
  const edgeActive = (e: DiagramEdge) =>
    held >= 0 ? e.step === held || (held === lastCol && e.step > lastCol) : e.step === autoStep;
  const nodeLit = (n: DiagramNode) => {
    if (held >= 0) return columnOf(n, cfg) === held;
    return cfg.edges.some((e) => e.step === autoStep - 1 && e.to === n.id) || (autoStep === 0 && columnOf(n, cfg) === 0);
  };

  return (
    <svg className="dg" viewBox={`0 0 ${cfg.width} ${cfg.height}`} aria-hidden>
      <DiagramDefs id="-fd" />

      {/* Column headers */}
      {cfg.columns.map((c, i) => {
        const dim = held >= 0 && held !== i;
        return (
          <g key={c.label} opacity={dim ? 0.35 : 1} className="dg-fade">
            <text x={c.x} y={22} className="dg-num">
              {c.index}
            </text>
            <text x={c.x + 40} y={24} className="dg-title" style={{ fontSize: 30 }}>
              {c.label}
            </text>
            <line x1={c.x} x2={c.x + c.w} y1={48} y2={48} stroke={held === i ? 'var(--c-orange)' : 'var(--fg)'} strokeWidth={held === i ? 5 : 2} />
          </g>
        );
      })}

      {/* Edges */}
      {cfg.edges.map((e, i) => {
        const pts = edgePoints(e, nodes);
        const active = edgeActive(e);
        const dim = held >= 0 && !active;
        return (
          <g key={i} opacity={dim ? 0.3 : 1} className="dg-fade">
            <path
              d={toD(pts)}
              fill="none"
              stroke={active ? 'var(--c-orange)' : 'var(--fg)'}
              strokeWidth={active ? 4 : 2.5}
              strokeDasharray={e.dashed ? '10 8' : undefined}
              markerEnd={`url(#${active ? 'arrow-accent' : 'arrow'}-fd)`}
            />
            {e.label && (
              <text x={(pts[1][0] + pts[2][0]) / 2} y={pts[1][1] + 34} textAnchor="middle" className="dg-label is-muted">
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Data packets on the active edges */}
      {cfg.edges.filter(edgeActive).map((e, i) => {
        const r = route(edgePoints(e, nodes));
        const p = at(r, progress * (r.total - 10));
        return <rect key={`p${i}`} x={p.x - 7} y={p.y - 7} width={14} height={14} fill="var(--c-orange)" />;
      })}

      {/* Nodes */}
      {cfg.nodes.map((n) => {
        const lit = nodeLit(n);
        const dim = held >= 0 && !lit;
        const big = n.h > 100;
        const ls = lines(n.label, big ? 11 : 16);
        const size = big ? 30 : 22;
        const lh = size * 1.1;
        return (
          <g key={n.id} opacity={dim ? 0.35 : 1} className="dg-fade">
            <rect x={n.x} y={n.y} width={n.w} height={n.h} fill="var(--bg)" stroke={lit ? 'var(--c-orange)' : 'var(--fg)'} strokeWidth={lit ? 5 : 3} />
            {ls.map((l, k) => (
              <text
                key={k}
                x={n.x + n.w / 2}
                y={n.y + n.h / 2 + size * 0.36 + (k - (ls.length - 1) / 2) * lh}
                textAnchor="middle"
                className={big ? 'dg-title' : 'dg-label'}
                style={{ fontSize: size }}
              >
                {l}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
