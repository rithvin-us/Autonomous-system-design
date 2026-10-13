import type { DiagramConfig } from './types';

/**
 * Block diagrams drawn by the FlowDiagram component.
 * Coordinates are in diagram units; the diagram scales to fit its slide area.
 * `step` sets the order in which the animated data pulse reaches each edge.
 */
export const diagrams: Record<string, DiagramConfig> = {
  architecture: {
    width: 1680,
    height: 640,
    columns: [
      { index: '01', label: 'Sensors', x: 0, w: 260 },
      { index: '02', label: 'Computing', x: 355, w: 300 },
      { index: '03', label: 'Planning', x: 750, w: 260 },
      { index: '04', label: 'Control', x: 1105, w: 240 },
      { index: '05', label: 'Hardware', x: 1440, w: 240 },
    ],
    nodes: [
      { id: 'camera', label: 'Stereo camera', x: 0, y: 92, w: 260, h: 70, tone: 'sensor' },
      { id: 'radar', label: 'Radar', x: 0, y: 184, w: 260, h: 70, tone: 'sensor' },
      { id: 'ultrasonic', label: 'Ultrasonic', x: 0, y: 276, w: 260, h: 70, tone: 'sensor' },
      { id: 'gnss', label: 'GNSS', x: 0, y: 368, w: 260, h: 70, tone: 'sensor' },
      { id: 'imu', label: 'IMU', x: 0, y: 460, w: 260, h: 70, tone: 'sensor' },

      { id: 'perception', label: 'Perception', x: 355, y: 92, w: 300, h: 254, tone: 'compute' },
      { id: 'localisation', label: 'Localisation', x: 355, y: 368, w: 300, h: 162, tone: 'compute' },

      { id: 'planning', label: 'Route + behaviour', x: 750, y: 212, w: 260, h: 220, tone: 'plan' },
      { id: 'control', label: 'Speed + steering', x: 1105, y: 212, w: 240, h: 220, tone: 'control' },

      { id: 'actuators', label: 'Actuators', x: 1440, y: 212, w: 240, h: 220, tone: 'hardware' },
      { id: 'vehicle', label: 'Vehicle motion', x: 1440, y: 470, w: 240, h: 60, tone: 'hardware' },
    ],
    edges: [
      { from: 'camera', to: 'perception', step: 0 },
      { from: 'radar', to: 'perception', step: 0 },
      { from: 'ultrasonic', to: 'perception', step: 0 },
      { from: 'gnss', to: 'localisation', step: 0 },
      { from: 'imu', to: 'localisation', step: 0 },
      { from: 'perception', to: 'planning', step: 1, points: [[655, 272], [750, 272]] },
      { from: 'localisation', to: 'planning', step: 1, points: [[655, 410], [750, 410]] },
      { from: 'localisation', to: 'control', step: 1, points: [[655, 494], [1225, 494], [1225, 432]] },
      { from: 'planning', to: 'control', step: 2, points: [[1010, 322], [1105, 322]] },
      { from: 'control', to: 'actuators', step: 3, points: [[1345, 322], [1440, 322]] },
      { from: 'actuators', to: 'vehicle', step: 4, points: [[1560, 432], [1560, 470]] },
      {
        from: 'vehicle',
        to: 'imu',
        step: 5,
        dashed: true,
        label: 'Physical world + vehicle motion',
        points: [[1560, 530], [1560, 600], [130, 600], [130, 530]],
      },
    ],
  },
};
