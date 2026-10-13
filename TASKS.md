# Build tasks

Working list for the presentation build. Each task is finished and checked before the next one starts.

## Decisions (from intake)

- Radar: editable placeholder, tagged "exact Starkenn unit pending".
- GNSS, IMU: illustrative generic hardware, labelled as such.
- Ultrasonic: HC-SR04 (illustrative reconstruction from typical vendor dimensions).
- ZED 2i: procedural reconstruction from the Stereolabs technical drawing (rev. 1, 26/05/21), labelled illustrative.
- Vehicle: generic off-road buggy now; GLB slot for the team buggy later.
- Slide 04: consistent 3D clay models (car, mobile robot, drone, robot arm).
- Compute chain: NVIDIA Jetson Orin → microcontroller → motor driver → actuators.
- Notes: `P` opens synced presenter window, `N` toggles overlay panel.
- Fonts: Archivo (headings) + Inter (body), bundled locally.
- Delivery: local and fully offline.
- ROS 2 diagrams: plain-English labels, no topic names.
- No credit line on title slide. British spelling. Generic simulation view.

## Tasks

- [x] T01 Scaffold Vite + React + TypeScript + R3F, bundle fonts, copy Draco decoder
- [x] T02 Design tokens, global CSS, fixed 1920×1080 stage with scaling, no page scroll
- [x] T03 Content model: types, deck settings, slides, sensors, diagrams
- [x] T04 Shell: navigation (keys, buttons, hash), counter, progress, overview, notes overlay, presenter window sync, fullscreen
- [x] T05 Slide frame layouts, heading block, asset status tag
- [x] T06 3D core: model stage, studio lighting, orbit + auto-rotate pause/resume, zoom limits, animated reset, hotspots, GLB override with procedural fallback
- [x] T07 Procedural sensor models: ZED 2i, radar placeholder, GNSS antenna + receiver, IMU board, HC-SR04
- [x] T08 Sensor showcase slides 08–12 with demos (stereo depth, radar returns, satellites, IMU motion, ultrasonic echo)
- [x] T09 Slide 07 sensor line-up (click a sensor to open its slide)
- [x] T10 Buggy model + slide 01 title scene + slide 02 system overview
- [x] T11 Slides 03 automation vs autonomy, 04 types (clay models), 05 autonomy loop
- [x] T12 Flow diagram engine + slides 06 architecture, 18 software/ROS 2, 19 communication
- [x] T13 Slides 13 sensor choice, 14 localisation & mapping, 15 planning, 16 control
- [x] T14 Slides 17 hardware chain, 20 integration (exploded 3D), 21 safety, 22 simulation
- [x] T15 Slides 23 lane following, 24 obstacle avoidance, 25 complete picture
- [x] T16 Overview thumbnails for 3D slides, presenter view polish
- [x] T17 README, ASSETS.md (sources and licences), notes placeholders
- [x] T18 Verify: typecheck, build, slide-by-slide visual review, console, keyboard, scroll

## Added during build

Note (13:36): a second editor wrote slides 01–07, 13–22, 24, 25 in parallel with mouse-only controls,
sub-19 px text and off-palette colours. It has been stopped; every slide is being rewritten to the
deck's rules: clicker-driven (no mouse), orange/steel palette, projector-legible text.

- [x] T21 Restore slides 24 and 25 after the overwrite
- [ ] T22 Rewrite slides 03, 04, 05, 06 (clicker steps, no mouse)
- [ ] T23 Rewrite slides 13–22 (clicker steps, no mouse)

- [x] T19 Clicker-driven builds: PgDn/PgUp step through each slide's builds (sensor parts tour → demo) before changing slide; ↓/↑ skip; step dots in chrome; "next click" in notes and presenter window
- [x] T20 `?solo` URL flag: open a copy that does not sync with other windows
