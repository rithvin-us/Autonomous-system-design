import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { Visual, VisualKind } from '../content/types';

export type VisualProps<K extends VisualKind = VisualKind> = { visual: Extract<Visual, { kind: K }> };

type Registry = { [K in VisualKind]: LazyExoticComponent<ComponentType<VisualProps<K>>> };

/** Maps each `visual.kind` in slides.ts to the component that draws it. */
export const visuals: Registry = {
  titleScene: lazy(() => import('./TitleScene')),
  vehicleOverview: lazy(() => import('./VehicleOverview')),
  automationVsAutonomy: lazy(() => import('./AutomationVsAutonomy')),
  systemTypes: lazy(() => import('./SystemTypes')),
  autonomyLoop: lazy(() => import('./AutonomyLoop')),
  flowDiagram: lazy(() => import('./FlowDiagram')),
  sensorLineup: lazy(() => import('./SensorLineup')),
  sensorShowcase: lazy(() => import('./SensorShowcase')),
  sensorChoice: lazy(() => import('./SensorChoice')),
  localisation: lazy(() => import('./Localisation')),
  planning: lazy(() => import('./Planning')),
  control: lazy(() => import('./ControlFeedback')),
  hardwareChain: lazy(() => import('./HardwareChain')),
  softwareStack: lazy(() => import('./SoftwareStack')),
  componentFlow: lazy(() => import('./ComponentFlow')),
  integration: lazy(() => import('./Integration')),
  safety: lazy(() => import('./Safety')),
  simulation: lazy(() => import('./Simulation')),
  laneFollowing: lazy(() => import('./LaneFollowing')),
  obstacleAvoidance: lazy(() => import('./ObstacleAvoidance')),
  completePicture: lazy(() => import('./CompletePicture')),
};
