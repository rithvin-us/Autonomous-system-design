/**
 * Content schema. Everything the audience reads lives in data files typed by
 * these interfaces; components only decide how it looks.
 */

export type Theme = 'dark' | 'light';

/**
 * Where the heading sits and how much room the visual gets.
 * - title:     opening slide, full-bleed scene, heading bottom-left
 * - top:       heading across the top, visual below
 * - left:      heading in a left column, visual on the right
 * - overlay:   full-bleed visual, heading floats top-left
 * - showcase:  sensor hardware slide (3D model + controls)
 * - statement: closing slide
 */
export type Layout = 'title' | 'top' | 'left' | 'overlay' | 'showcase' | 'statement';

export type SensorId = 'zed2i' | 'radar' | 'gnss' | 'imu' | 'ultrasonic';

export type Vec3 = [number, number, number];

export interface Slide {
  /** Stable slug; used for thumbnails and links. */
  id: string;
  /** Small label above the title (optional). */
  kicker?: string;
  /** Use \n for a deliberate line break. Written exactly as displayed. */
  title: string;
  subtitle?: string;
  /** One short sentence. */
  description?: string;
  theme: Theme;
  layout: Layout;
  /** Optional heading size override in px (at 1920x1080). */
  titleSize?: number;
  visual: Visual;
  /** Presenter-only notes. Never shown to the audience unless opened. */
  notes: string;
}

/* ------------------------------------------------------------------ */
/* Visual configurations                                               */
/* ------------------------------------------------------------------ */

export interface Labelled {
  label: string;
  detail?: string;
}

export type Visual =
  | { kind: 'titleScene' }
  | {
      kind: 'vehicleOverview';
      groups: (Labelled & { id: 'sensors' | 'computing' | 'actuators' })[];
    }
  | {
      kind: 'automationVsAutonomy';
      automation: Labelled;
      autonomy: Labelled;
    }
  | {
      kind: 'systemTypes';
      items: (Labelled & {
        /** Picks the 3D model: 'car' | 'amr' | 'drone' | 'robot'. */
        id: string;
        /** Reference photo in /public (e.g. 'images/types/drone.png'). */
        image: string;
        /** CSS object-position for the photo crop, e.g. '30% 50%'. */
        focus?: string;
        /** Photo credit, shown small under the label (optional). */
        credit?: string;
      })[];
      shared: string;
    }
  | { kind: 'autonomyLoop'; stages: Labelled[]; centre: string }
  | { kind: 'flowDiagram'; diagram: string }
  | { kind: 'sensorLineup'; sensors: SensorId[] }
  | { kind: 'sensorShowcase'; sensor: SensorId }
  | {
      kind: 'sensorChoice';
      conditions: { id: string; label: string }[];
      sensors: {
        id: SensorId;
        /** Condition ids in which this sensor is weakened. */
        degradedIn: string[];
        /** Condition ids in which this sensor stops working. */
        lostIn: string[];
      }[];
    }
  | {
      kind: 'localisation';
      labels: { map: string; estimate: string; route: string; landmark: string; uncertainty: string };
    }
  | {
      kind: 'planning';
      labels: { start: string; goal: string; obstacle: string; options: string; chosen: string };
    }
  | {
      kind: 'control';
      labels: { desired: string; actual: string; error: string; on: string; off: string };
      loop: string[];
    }
  | {
      kind: 'hardwareChain';
      stages: (Labelled & { id: 'sensor' | 'computer' | 'mcu' | 'driver' | 'actuator' })[];
      links: string[];
      estop: string;
    }
  | {
      kind: 'softwareStack';
      nodes: string[];
      middleware: Labelled;
      layers: string[];
    }
  | {
      kind: 'componentFlow';
      nodes: Labelled[];
      /** One label per channel leaving each node (the last one goes to the motors). */
      messages: string[];
    }
  | { kind: 'integration'; layers: Labelled[]; assemble: string; explode: string }
  | {
      kind: 'safety';
      states: Labelled[];
      hardwareStop: Labelled;
    }
  | {
      kind: 'simulation';
      simLabel: string;
      testLabel: string;
      scenarios: string[];
      metric: string;
      threshold: string;
    }
  | { kind: 'laneFollowing'; stages: Labelled[] }
  | { kind: 'obstacleAvoidance'; phases: Labelled[] }
  | { kind: 'completePicture'; nodes: string[] };

export type VisualKind = Visual['kind'];

/* ------------------------------------------------------------------ */
/* Sensors                                                             */
/* ------------------------------------------------------------------ */

/**
 * - verified:     geometry checked against manufacturer data
 * - illustrative: built from public references; proportions approximate
 * - placeholder:  stand-in only; the exact hardware is not yet known
 */
export type AssetStatus = 'verified' | 'illustrative' | 'placeholder';

export interface Hotspot {
  id: string;
  label: string;
  detail?: string;
  /** Position in the model's own units (millimetres). */
  position: Vec3;
  /** Outward surface direction; the marker hides when facing away. */
  normal: Vec3;
}

export interface SensorConfig {
  id: SensorId;
  name: string;
  shortName: string;
  /** What it tells the robot, in a few words (line-up and comparison slides). */
  measures: string;
  status: AssetStatus;
  statusNote: string;
  /**
   * Optional GLB/glTF file in /public/models. When set and loadable it
   * replaces the procedural model. Units should be millimetres.
   */
  glb?: string;
  glbTransform?: { scale?: number; rotation?: Vec3; position?: Vec3 };
  /** Scene units per millimetre for this sensor's showcase. */
  displayScale: number;
  camera: { position: Vec3; target: Vec3; fov: number; minDistance: number; maxDistance: number };
  /** OrbitControls autoRotateSpeed; 0.5 is one turn every ~2 minutes. */
  autoRotateSpeed: number;
  hotspots: Hotspot[];
  /**
   * Hotspot ids visited, in order, by the clicker (one press each) before the
   * demo step. Omit to visit every hotspot; use [] to skip straight to the demo.
   */
  tour?: string[];
  demoLabel: string;
  /** Reference notes for ASSETS.md and the presenter. */
  sources: string[];
}

/* ------------------------------------------------------------------ */
/* Diagrams                                                            */
/* ------------------------------------------------------------------ */

export type NodeTone = 'sensor' | 'compute' | 'plan' | 'control' | 'hardware';

export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: NodeTone;
}

export interface DiagramColumn {
  label: string;
  index: string;
  x: number;
  w: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  /** Explicit route in diagram units; otherwise an elbow is drawn. */
  points?: [number, number][];
  /** Order in which data reaches this edge (drives the animation). */
  step: number;
  dashed?: boolean;
  label?: string;
}

export interface DiagramConfig {
  width: number;
  height: number;
  columns: DiagramColumn[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}
