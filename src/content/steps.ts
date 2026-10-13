import { diagrams } from './diagrams';
import { sensors } from './sensors';
import type { SensorConfig, Slide } from './types';

/**
 * Builds within a slide, advanced by the clicker before moving to the next
 * slide (like PowerPoint animations). Step 0 is the slide as it first appears;
 * this returns a label for each further step, in order.
 *
 * Only list steps for visuals whose component reads `useSlide().step`;
 * otherwise a clicker press would appear to do nothing.
 */
export function stepLabels(slide: Slide): string[] {
  const v = slide.visual;
  switch (v.kind) {
    case 'sensorShowcase': {
      const cfg = sensors[v.sensor];
      return [...tourOf(cfg).map((h) => h.label), cfg.demoLabel];
    }
    case 'automationVsAutonomy':
      return ['Add an obstacle'];
    case 'flowDiagram':
      return diagrams[v.diagram]?.columns.map((c) => c.label) ?? [];
    case 'softwareStack':
      return ['Components', v.middleware.label, ...v.layers];
    case 'componentFlow':
      return v.messages;
    case 'integration':
      return [v.explode, v.assemble];
    case 'safety':
      return [...v.states.slice(1).map((s) => s.label), v.hardwareStop.label];
    case 'simulation':
      return v.scenarios.slice(1);
    case 'systemTypes':
      return v.items.map((i) => i.label);
    case 'sensorLineup':
      return v.sensors.map((id) => sensors[id].shortName);
    case 'laneFollowing':
      return v.stages.map((s) => s.label);
    case 'obstacleAvoidance':
      return v.phases.map((p) => p.label);
    default:
      return [];
  }
}

export const stepCount = (slide: Slide) => stepLabels(slide).length;

/** Hotspots the clicker visits on a sensor slide, in order. */
export function tourOf(cfg: SensorConfig) {
  if (!cfg.tour) return cfg.hotspots;
  return cfg.tour
    .map((id) => cfg.hotspots.find((h) => h.id === id))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));
}
