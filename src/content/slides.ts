import type { Slide } from './types';

/**
 * THE DECK.
 *
 * Slide order = array order. Edit titles, descriptions, diagram labels and
 * presenter notes here. Visual components read their labels from `visual`.
 *
 * Notes give the slide's system-design point and what each click does; script.md has the full words.
 */
export const slides: Slide[] = [
  {
    id: 'title',
    title: 'SYSTEM DESIGN\n& ARCHITECTURE',
    titleSize: 156,
    subtitle: 'IN AUTONOMOUS SYSTEMS',
    theme: 'dark',
    layout: 'title',
    visual: { kind: 'titleScene' },
    notes: 'Design lens: An autonomous machine is a designed system: sensors, computing, software and motors made to work as one.\n\nVehicle shown is an illustrative buggy until the team vehicle model is supplied.\n\nFull words: script.md.',
  },
  {
    id: 'what-are-autonomous-systems',
    kicker: 'The system view',
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
      'Design lens: Decompose into subsystems (sensors, computing, actuators) joined by clear interfaces.\n\nClicker: outlines the sensors, then the computing, then the actuators, naming each part.\n\nFull words: script.md.',
  },
  {
    id: 'automation-vs-autonomy',
    kicker: 'Design requirement',
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
      'Design lens: The requirement "must cope with a changing environment" is what forces sensing, decisions and feedback into the design.\n\nStep 0: both run normally. Click: an unexpected object appears on both sides. The press keeps its timer and jams; the robot sees the obstacle and goes round it, choosing a different way each run as the obstacle moves.\n\nFull words: script.md.',
  },
  {
    id: 'types',
    kicker: 'One architecture, many machines',
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
          image: 'images/types/robotic-machine.png',
          focus: '50% 30%',
        },
      ],
      shared: 'Sense · Decide · Act',
    },
    notes: 'Design lens: Different machines, same architecture: learn the structure once, apply it everywhere.\n\n3D study models built from the reference photos (shown beneath each). Clicker steps spotlight each type in turn. Photos are third-party; check rights before sharing the deck publicly (see ASSETS.md).\n\nFull words: script.md.',
  },
  {
    id: 'autonomy-loop',
    kicker: 'Closed-loop design',
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
    notes: 'Design lens: A closed loop; its rate is a requirement and its time budget is shared across the stages.\n\nStep 0: a pulse circles the loop. Each click stops on one stage.\n\nFull words: script.md.',
  },
  {
    id: 'architecture',
    kicker: 'System architecture',
    title: 'AUTONOMOUS SYSTEM\nARCHITECTURE',
    description: 'Sensors, computing, planning, control, and hardware work together as one system.',
    theme: 'light',
    layout: 'top',
    visual: { kind: 'flowDiagram', diagram: 'architecture' },
    notes:
      'Design lens: Every arrow is an interface contract; loose coupling lets one block change without redesigning the rest.\n\nStep 0: data moves through every stage. Each click holds on one column. The dashed line along the bottom is the physical world feeding back into the sensors.\n\nFull words: script.md.',
  },
  {
    id: 'sensors-and-data',
    kicker: 'System inputs',
    title: 'SENSORS\nAND DATA',
    description:
      'Sensors provide the information an autonomous system needs to understand its surroundings and motion.',
    theme: 'dark',
    layout: 'overlay',
    visual: { kind: 'sensorLineup', sensors: ['zed2i', 'radar', 'gnss', 'imu', 'ultrasonic'] },
    notes:
      'Design lens: Choose sensors from requirements; each answers a different question.\n\nEach click spotlights one sensor with what it measures. Models are scaled for visibility, not to true relative size.\n\nFull words: script.md.',
  },
  {
    id: 'zed2i',
    kicker: 'System input 01',
    title: 'ZED 2i\nSTEREO\nCAMERA',
    description:
      'Stereo vision provides visual information and depth estimates of the surrounding environment.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'zed2i' },
    notes:
      'Design lens: Locking connector = robust interface; baseline width is a trade-off between far accuracy, size and near range.\n\nClicks visit each part, then the depth demo: two lenses 120 mm apart view the same point; nearer objects make a wider angle between the two sight lines.\n\nFull words: script.md.',
  },
  {
    id: 'radar',
    kicker: 'System input 02',
    title: 'STARKENN\nRADAR',
    description:
      'Radar detects objects and provides information about their distance and relative motion.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'radar' },
    notes:
      'Design lens: Works in rain, fog and dark but gives little detail: one reason systems combine sensors.\n\nPLACEHOLDER MODEL: replace with the exact Starkenn unit (see README → Replacing sensor models). Targets and range rings are representative only, not product specifications.\n\nFull words: script.md.',
  },
  {
    id: 'gnss',
    kicker: 'System input 03',
    title: 'GNSS',
    description:
      'GNSS estimates geographic position using signals received from navigation satellites.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'gnss' },
    notes:
      'Design lens: Absolute position, but it depends on something outside the system (sky view); never rely on one position source.\n\nIllustrative antenna and receiver. Signals: one satellite is blocked by a building to show that accuracy depends on sky view.\n\nFull words: script.md.',
  },
  {
    id: 'imu',
    kicker: 'System input 04',
    title: 'IMU',
    description:
      'An IMU measures acceleration and angular velocity to help estimate the movement of a robot.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'imu' },
    notes:
      'Design lens: Fast and self-contained but drifts when integrated; pairing IMU with GNSS is a classic design pattern.\n\nIllustrative breakout board. Motion: the board tilts and accelerates; the arrows show the two quantities an IMU measures.\n\nFull words: script.md.',
  },
  {
    id: 'ultrasonic',
    kicker: 'System input 05',
    title: 'ULTRASONIC\nSENSOR',
    description:
      'Ultrasonic sensors estimate short-range distances by transmitting sound pulses and receiving echoes.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'ultrasonic' },
    notes:
      'Design lens: Cheap and reliable for the last metre: fit-for-purpose beats most powerful.\n\nEcho: the pulse leaves the T transducer, reflects off the wall, returns to R. Distance = half the round trip at the speed of sound (≈343 m/s in air at 20 °C).\n\nFull words: script.md.',
  },
  {
    id: 'choosing-sensors',
    kicker: 'Design trade-offs',
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
      'Design lens: Redundancy by design: pick sensors whose weaknesses do not overlap across the required conditions.\n\nEach click changes the condition (night, fog / heavy rain, no open sky). Camera: rich detail, needs light and clear air. Radar: distance and relative speed, works in dark and bad weather, little shape detail. GNSS: position on Earth, needs a view of the sky. IMU: own motion, works anywhere, errors build up over time. Ultrasonic: short distances, simple and low cost. Coverage shapes are schematic, not to scale.\n\nFull words: script.md.',
  },
  {
    id: 'jetson',
    kicker: 'Computing hardware',
    title: 'JETSON\nORIN',
    description:
      'The onboard computer turns sensor data into decisions, then sends commands to the low-level controller.',
    theme: 'light',
    layout: 'showcase',
    visual: { kind: 'sensorShowcase', sensor: 'jetson' },
    notes:
      'Design lens: Computing is a subsystem with its own requirements: enough processing for every input, predictable heat and power, and the right interfaces to sensors and to the microcontroller.\n\nClicks visit each part (module, cooling, USB, Ethernet, CSI, 40-pin header, power, storage), then the data-flow demo: sensor data in through the ports, commands out through the header. Illustrative layout after the Jetson Orin Nano Developer Kit.\n\nFull words: script.md.',
  },
  {
    id: 'localisation',
    kicker: 'State estimation',
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
      'Design lens: Pass uncertainty across interfaces, not just a number; planners should act more cautiously when unsure.\n\nThe shaded ring is uncertainty: it grows while the robot moves on its own motion estimate and shrinks when it recognises a landmark. Grey cells appear as the map is built.\n\nFull words: script.md.',
  },
  {
    id: 'planning',
    kicker: 'Decision layer',
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
    notes: 'Design lens: The cost function encodes priorities that come from the requirements.\n\nClick 1: candidate routes. Click 2: the safe, short one is chosen. Click 3: the robot drives it.\n\nFull words: script.md.',
  },
  {
    id: 'control',
    kicker: 'Feedback design',
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
      'Design lens: Feedback absorbs what you cannot model, but is only as good as its measurements and their timing.\n\nStep 0: feedback on, the robot settles onto the path. Click 1: feedback cut, it drifts away. Click 2: feedback back on, it corrects.\n\nFull words: script.md.',
  },
  {
    id: 'hardware',
    kicker: 'Hardware partitioning',
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
      'Design lens: Partition by timing and power: thinking on the computer, timing on the microcontroller, energy through the driver, e-stop in hardware.\n\nThe Jetson plans; the microcontroller handles fast, timing-critical signals; the driver switches motor power. Neither board alone is the vehicle controller. Clicks light each connection in turn, then the emergency stop cuts actuator power.\n\nFull words: script.md.',
  },
  {
    id: 'software',
    kicker: 'Modular design',
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
    notes: 'Design lens: Modularity: components meet only through ROS 2, so each can be replaced, restarted or tested alone.\n\nEach block is a separate program. None talks to another directly; all exchange data through ROS 2. Clicks highlight the components, ROS 2, then the layers underneath.\n\nFull words: script.md.',
  },
  {
    id: 'communication',
    kicker: 'Interfaces',
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
      'Design lens: Each channel is an interface contract: name, message format, rate. Agree it first.\n\nEach node sends messages on a named channel; any node that needs them listens. The last channel leaves the software and goes to the motor hardware. Clicker steps light one channel at a time.\n\nFull words: script.md.',
  },
  {
    id: 'integration',
    kicker: 'Integration',
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
    notes: 'Design lens: Integration is where teams\' assumptions meet; integrate early, one interface at a time.\n\nClick 1: the layers separate and are named. Click 2: they come back together with the connections between them lit.\n\nFull words: script.md.',
  },
  {
    id: 'safety',
    kicker: 'Designing for failure',
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
      'Design lens: List failure modes early; detect, reach a safe state, and keep the last line of defence independent of software.\n\nClick 1: the camera fails and the fault is detected. Click 2: safe state, the robot slows and stops with hazard lights. Click 3: the independent hardware e-stop opens the motor power circuit. Software handles the detected fault; the hardware stop exists for failures software cannot handle.\n\nFull words: script.md.',
  },
  {
    id: 'simulation',
    kicker: 'Verification',
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
    notes: 'Design lens: Verification: every requirement gets a pass/fail test; scenarios try to break the design.\n\nThe log and graph come from the simulated run on screen. Scenario 2 fails on purpose: the obstacle is seen late after the bend. Each click runs the next scenario.\n\nFull words: script.md.',
  },
  {
    id: 'lane-following',
    kicker: 'Case study · end to end',
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
    notes: 'Design lens: One requirement ("stay in lane at this speed") flows down into the design of every block.\n\nEach click highlights the next subsystem and shows its contribution in the scene.\n\nFull words: script.md.',
  },
  {
    id: 'obstacle-avoidance',
    kicker: 'Case study · end to end',
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
    notes: 'Design lens: End-to-end behaviour is a property of the whole system, not of any single part.\n\nStep 0 plays the whole manoeuvre. Each click holds the scene at one phase.\n\nFull words: script.md.',
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
    notes: 'Design lens: Autonomy emerges from interfaces, timing, failure handling and testing of the whole.\n\nFull words: script.md.',
  },
];
