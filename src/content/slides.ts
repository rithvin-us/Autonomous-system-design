import type { Slide } from './types';

/**
 * THE DECK.
 *
 * Slide order = array order. Edit titles, descriptions, diagram labels and
 * presenter notes here. Visual components read their labels from `visual`.
 *
 * Notes marked [EDIT] are placeholders for the presenter's own material.
 */
export const slides: Slide[] = [
  {
    id: 'title',
    title: 'SYSTEM DESIGN\n& ARCHITECTURE',
    titleSize: 118,
    subtitle: 'IN AUTONOMOUS SYSTEMS',
    theme: 'dark',
    layout: 'title',
    visual: { kind: 'titleScene' },
    notes: '[EDIT] Opening remarks.\n\nVehicle shown is an illustrative buggy until the team vehicle model is supplied.',
  },
  {
    id: 'what-are-autonomous-systems',
    title: 'WHAT ARE\nAUTONOMOUS\nSYSTEMS?',
    description:
      'Machines that perceive their surroundings, make decisions, and act with limited human intervention.',
    theme: 'dark',
    layout: 'overlay',
    visual: {
      kind: 'vehicleOverview',
      groups: [
        { id: 'sensors', label: 'Sensors', detail: 'Perceive' },
        { id: 'computing', label: 'Computing', detail: 'Decide' },
        { id: 'actuators', label: 'Actuators', detail: 'Act' },
      ],
    },
    notes:
      '[EDIT] Presenter notes.\n\nClicker: outlines the sensors, then the computing, then the actuators, naming each part.',
  },
  {
    id: 'automation-vs-autonomy',
    title: 'AUTOMATION VS. AUTONOMY',
    description: 'Fixed instructions versus decisions guided by changing environmental conditions.',
    theme: 'light',
    layout: 'top',
    visual: {
      kind: 'automationVsAutonomy',
      automation: { label: 'Automation', detail: 'Same sequence every cycle' },
      autonomy: { label: 'Autonomy', detail: 'Senses, then decides' },
    },
    notes:
      '[EDIT] Presenter notes.\n\nStep 0: both run normally. Click: an unexpected object appears on both sides. The press keeps its timer and jams; the robot sees the obstacle and goes round it, choosing a different way each run as the obstacle moves.',
  },
  {
    id: 'types',
    title: 'TYPES OF\nAUTONOMOUS SYSTEMS',
    description:
      'Autonomous vehicles, mobile robots, drones, and robotic machines share common engineering principles.',
    theme: 'light',
    layout: 'top',
    visual: {
      kind: 'systemTypes',
      items: [
        { id: 'car', label: 'Autonomous vehicles', image: 'images/types/autonomous-vehicle.png', focus: '32% 55%' },
        { id: 'amr', label: 'Mobile robots', image: 'images/types/mobile-robot.png', focus: '30% 66%' },
        { id: 'drone', label: 'Drones', image: 'images/types/drone.png', focus: '50% 22%' },
        {
          id: 'robot',
          label: 'Robotic machines',
          detail: 'Film character',
          image: 'images/types/robotic-machine.png',
          focus: '50% 30%',
        },
      ],
      shared: 'Sense · Decide · Act',
    },
    notes: '[EDIT] Presenter notes.\n\n3D study models built from the reference photos (shown beneath each). Clicker steps spotlight each type in turn. Photos are third-party; check rights before sharing the deck publicly (see ASSETS.md).',
  },
  {
    id: 'autonomy-loop',
    title: 'THE AUTONOMY\nLOOP',
    description: 'Sense → Perceive → Decide → Act → Repeat.',
    theme: 'dark',
    layout: 'left',
    visual: {
      kind: 'autonomyLoop',
      stages: [
        { label: 'Sense', detail: 'Measure the world' },
        { label: 'Perceive', detail: 'Make sense of it' },
        { label: 'Decide', detail: 'Choose what to do' },
        { label: 'Act', detail: 'Move the machine' },
      ],
      centre: 'Repeat',
    },
    notes: '[EDIT] Presenter notes.\n\nStep 0: a pulse circles the loop. Each click stops on one stage.',
  },
  {
    id: 'architecture',
    title: 'AUTONOMOUS SYSTEM\nARCHITECTURE',
    titleSize: 78,
    description: 'Sensors, computing, planning, control, and hardware work together as one system.',
    theme: 'light',
    layout: 'top',
    visual: { kind: 'flowDiagram', diagram: 'architecture' },
    notes:
      '[EDIT] Presenter notes.\n\nStep 0: data moves through every stage. Each click holds on one column. The dashed line along the bottom is the physical world feeding back into the sensors.',
  },
  {
    id: 'sensors-and-data',
    title: 'SENSORS\nAND DATA',
    description:
      'Sensors provide the information an autonomous system needs to understand its surroundings and motion.',
    theme: 'dark',
    layout: 'overlay',
    visual: { kind: 'sensorLineup', sensors: ['zed2i', 'radar', 'gnss', 'imu', 'ultrasonic'] },
    notes:
      '[EDIT] Presenter notes.\n\nEach click spotlights one sensor with what it measures. Models are scaled for visibility, not to true relative size.',
  },
  {
    id: 'zed2i',
    kicker: 'Sensor 01',
    title: 'ZED 2i\nSTEREO\nCAMERA',
    description:
      'Stereo vision provides visual information and depth estimates of the surrounding environment.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'zed2i' },
    notes:
      '[EDIT] Presenter notes.\n\nClicks visit each part, then the depth demo: two lenses 120 mm apart view the same point; nearer objects make a wider angle between the two sight lines.',
  },
  {
    id: 'radar',
    kicker: 'Sensor 02',
    title: 'STARKENN\nRADAR',
    description:
      'Radar detects objects and provides information about their distance and relative motion.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'radar' },
    notes:
      '[EDIT] Presenter notes.\n\nPLACEHOLDER MODEL: replace with the exact Starkenn unit (see README → Replacing sensor models). Targets and range rings are representative only, not product specifications.',
  },
  {
    id: 'gnss',
    kicker: 'Sensor 03',
    title: 'GNSS',
    description:
      'GNSS estimates geographic position using signals received from navigation satellites.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'gnss' },
    notes:
      '[EDIT] Presenter notes.\n\nIllustrative antenna and receiver. Signals: one satellite is blocked by a building to show that accuracy depends on sky view.',
  },
  {
    id: 'imu',
    kicker: 'Sensor 04',
    title: 'IMU',
    description:
      'An IMU measures acceleration and angular velocity to help estimate the movement of a robot.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'imu' },
    notes:
      '[EDIT] Presenter notes.\n\nIllustrative breakout board. Motion: the board tilts and accelerates; the arrows show the two quantities an IMU measures.',
  },
  {
    id: 'ultrasonic',
    kicker: 'Sensor 05',
    title: 'ULTRASONIC\nSENSOR',
    description:
      'Ultrasonic sensors estimate short-range distances by transmitting sound pulses and receiving echoes.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'ultrasonic' },
    notes:
      '[EDIT] Presenter notes.\n\nEcho: the pulse leaves the T transducer, reflects off the wall, returns to R. Distance = half the round trip at the speed of sound (≈343 m/s in air at 20 °C).',
  },
  {
    id: 'choosing-sensors',
    title: 'CHOOSING THE\nRIGHT SENSOR',
    description: 'Every sensor has different strengths, limitations, and operating conditions.',
    theme: 'dark',
    layout: 'top',
    visual: {
      kind: 'sensorChoice',
      conditions: [
        { id: 'clear', label: 'Clear day' },
        { id: 'night', label: 'Night' },
        { id: 'fog', label: 'Fog / heavy rain' },
        { id: 'covered', label: 'No open sky' },
      ],
      sensors: [
        {
          id: 'zed2i',
          degradedIn: ['fog'],
          lostIn: ['night'],
        },
        {
          id: 'radar',
          degradedIn: [],
          lostIn: [],
        },
        {
          id: 'gnss',
          degradedIn: [],
          lostIn: ['covered'],
        },
        {
          id: 'imu',
          degradedIn: [],
          lostIn: [],
        },
        {
          id: 'ultrasonic',
          degradedIn: [],
          lostIn: [],
        },
      ],
    },
    notes:
      '[EDIT] Presenter notes.\n\nEach click changes the condition (night, fog / heavy rain, no open sky). Camera: rich detail, needs light and clear air. Radar: distance and relative speed, works in dark and bad weather, little shape detail. GNSS: position on Earth, needs a view of the sky. IMU: own motion, works anywhere, errors build up over time. Ultrasonic: short distances, simple and low cost. Coverage shapes are schematic, not to scale.',
  },
  {
    id: 'localisation',
    title: 'LOCALISATION\nAND MAPPING',
    titleSize: 80,
    description:
      'Localisation estimates where a robot is, while mapping represents its environment.',
    theme: 'light',
    layout: 'left',
    visual: {
      kind: 'localisation',
      labels: {
        map: 'Map',
        estimate: 'Estimated position',
        route: 'Route travelled',
        landmark: 'Landmark',
        uncertainty: 'Uncertainty',
      },
    },
    notes:
      '[EDIT] Presenter notes.\n\nThe shaded ring is uncertainty: it grows while the robot moves on its own motion estimate and shrinks when it recognises a landmark. Grey cells appear as the map is built.',
  },
  {
    id: 'planning',
    title: 'DECISION-MAKING\nAND PLANNING',
    description:
      'Planning determines where a robot should move and how it should navigate toward its goal.',
    theme: 'dark',
    layout: 'top',
    visual: {
      kind: 'planning',
      labels: {
        start: 'Start',
        goal: 'Goal',
        obstacle: 'Obstacle',
        options: 'Possible routes',
        chosen: 'Chosen route',
      },
    },
    notes: '[EDIT] Presenter notes.\n\nClick 1: candidate routes. Click 2: the safe, short one is chosen. Click 3: the robot drives it.',
  },
  {
    id: 'control',
    title: 'CONTROL\nSYSTEMS',
    description:
      'Feedback helps a robot compare its actual movement with its desired movement and correct errors.',
    theme: 'light',
    layout: 'left',
    visual: {
      kind: 'control',
      labels: {
        desired: 'Desired path',
        actual: 'Actual path',
        error: 'Error',
        on: 'Feedback on',
        off: 'Feedback off',
      },
      loop: ['Desired', 'Compare', 'Controller', 'Robot', 'Measured'],
    },
    notes:
      '[EDIT] Presenter notes.\n\nStep 0: feedback on, the robot settles onto the path. Click 1: feedback cut, it drifts away. Click 2: feedback back on, it corrects.',
  },
  {
    id: 'hardware',
    title: 'HARDWARE\nAND COMPUTING',
    description:
      'Computing hardware processes sensor information and communicates commands to the physical system.',
    theme: 'dark',
    layout: 'top',
    visual: {
      kind: 'hardwareChain',
      stages: [
        { id: 'sensor', label: 'Sensor', detail: 'ZED 2i camera' },
        { id: 'computer', label: 'Onboard computer', detail: 'NVIDIA Jetson Orin' },
        { id: 'mcu', label: 'Low-level controller', detail: 'Microcontroller' },
        { id: 'driver', label: 'Motor driver', detail: 'Power stage' },
        { id: 'actuator', label: 'Actuators', detail: 'Steering + drive motors' },
      ],
      links: ['USB 3.0', 'Serial / CAN', 'PWM', 'Power'],
      estop: 'Emergency stop cuts actuator power',
    },
    notes:
      '[EDIT] Presenter notes.\n\nThe Jetson plans; the microcontroller handles fast, timing-critical signals; the driver switches motor power. Neither board alone is the vehicle controller. Clicks light each connection in turn, then the emergency stop cuts actuator power.',
  },
  {
    id: 'software',
    title: 'SOFTWARE ARCHITECTURE\nAND ROS 2',
    description:
      'Software components communicate through defined interfaces to operate the complete robot.',
    theme: 'light',
    layout: 'top',
    visual: {
      kind: 'softwareStack',
      nodes: ['Camera driver', 'Radar driver', 'GNSS + IMU driver', 'Perception', 'Localisation', 'Planning', 'Control', 'Motor interface'],
      middleware: { label: 'ROS 2', detail: 'Communication layer shared by every component' },
      layers: ['Linux operating system', 'Onboard computer'],
    },
    notes: '[EDIT] Presenter notes.\n\nEach block is a separate program. None talks to another directly; all exchange data through ROS 2. Clicks highlight the components, ROS 2, then the layers underneath.',
  },
  {
    id: 'communication',
    title: 'HOW COMPONENTS\nCOMMUNICATE',
    description: 'Data travels between software components through defined communication mechanisms.',
    theme: 'dark',
    layout: 'top',
    visual: {
      kind: 'componentFlow',
      nodes: [
        { label: 'Sensor node', detail: 'Camera' },
        { label: 'Processing node', detail: 'Perception' },
        { label: 'Planning node', detail: 'Route' },
        { label: 'Control node', detail: 'Motion' },
      ],
      messages: ['Images', 'Detected obstacles', 'Planned path', 'Speed + steering'],
    },
    notes:
      '[EDIT] Presenter notes.\n\nEach node sends messages on a named channel; any node that needs them listens. The last channel leaves the software and goes to the motor hardware. Clicker steps light one channel at a time.',
  },
  {
    id: 'integration',
    title: 'SYSTEM\nINTEGRATION',
    description:
      'Integration connects separately developed hardware and software components into one functioning system.',
    theme: 'dark',
    layout: 'overlay',
    visual: {
      kind: 'integration',
      layers: [
        { label: 'Sensors' },
        { label: 'Software' },
        { label: 'Computing' },
        { label: 'Communication interfaces' },
        { label: 'Actuators + vehicle' },
      ],
      assemble: 'Assemble',
      explode: 'Explode',
    },
    notes: '[EDIT] Presenter notes.\n\nClick 1: the layers separate and are named. Click 2: they come back together with the connections between them lit.',
  },
  {
    id: 'safety',
    title: 'SAFETY AND\nFAILURE HANDLING',
    description:
      'Autonomous systems must recognise failures and respond through appropriate safety mechanisms.',
    theme: 'light',
    layout: 'top',
    visual: {
      kind: 'safety',
      states: [
        { label: 'Normal', detail: 'All sensors healthy' },
        { label: 'Fault detected', detail: 'Camera signal lost' },
        { label: 'Safe state', detail: 'Slow down, stop, alert' },
      ],
      hardwareStop: {
        label: 'Independent emergency stop',
        detail: 'Hardware circuit removes motor power',
      },
    },
    notes:
      '[EDIT] Presenter notes.\n\nClick 1: the camera fails and the fault is detected. Click 2: safe state, the robot slows and stops with hazard lights. Click 3: the independent hardware e-stop opens the motor power circuit. Software handles the detected fault; the hardware stop exists for failures software cannot handle.',
  },
  {
    id: 'simulation',
    title: 'SIMULATION\nAND TESTING',
    description:
      'Simulation and structured testing help engineers evaluate system behaviour before and during hardware trials.',
    theme: 'dark',
    layout: 'overlay',
    visual: {
      kind: 'simulation',
      simLabel: 'Simulation',
      testLabel: 'Test log',
      scenarios: ['Obstacle on straight', 'Obstacle on bend', 'Camera dropout'],
      metric: 'Distance to obstacle',
      threshold: 'Safe limit',
    },
    notes: '[EDIT] Presenter notes.\n\nThe log and graph come from the simulated run on screen. Scenario 2 fails on purpose: the obstacle is seen late after the bend. Each click runs the next scenario.',
  },
  {
    id: 'lane-following',
    kicker: 'Case study',
    title: 'LANE-FOLLOWING\nROBOT',
    description:
      'Lane following combines sensing, localisation or relative-position estimation, planning, control, and vehicle actuation.',
    theme: 'light',
    layout: 'top',
    visual: {
      kind: 'laneFollowing',
      stages: [
        { label: 'Sense', detail: 'Camera sees lane lines' },
        { label: 'Estimate', detail: 'Offset from lane centre' },
        { label: 'Plan', detail: 'Target path along centre' },
        { label: 'Control', detail: 'Steering correction' },
        { label: 'Actuate', detail: 'Steering turns the wheels' },
      ],
    },
    notes: '[EDIT] Presenter notes.\n\nEach click highlights the next subsystem and shows its contribution in the scene.',
  },
  {
    id: 'obstacle-avoidance',
    kicker: 'Case study',
    title: 'OBSTACLE\nAVOIDANCE',
    description:
      'A robot detects an obstacle, evaluates its surroundings, selects a suitable response, and adjusts its movement.',
    theme: 'dark',
    layout: 'overlay',
    visual: {
      kind: 'obstacleAvoidance',
      phases: [
        { label: 'Sense', detail: 'Radar detects an object' },
        { label: 'Understand', detail: 'Lane blocked, space on the left' },
        { label: 'Decide', detail: 'Pass on the left' },
        { label: 'Control', detail: 'Steer and slow down' },
        { label: 'Move', detail: 'Vehicle follows the new path' },
      ],
    },
    notes: '[EDIT] Presenter notes.\n\nStep 0 plays the whole manoeuvre. Each click holds the scene at one phase.',
  },
  {
    id: 'complete-picture',
    kicker: 'The complete picture',
    title: 'ONE SYSTEM.\nMANY\nCOMPONENTS.',
    titleSize: 108,
    description:
      'Autonomy emerges when sensing, computing, planning, control, and hardware work together.',
    theme: 'dark',
    layout: 'statement',
    visual: {
      kind: 'completePicture',
      nodes: ['Sensing', 'Computing', 'Planning', 'Control', 'Hardware'],
    },
    notes: '[EDIT] Closing remarks.',
  },
];
