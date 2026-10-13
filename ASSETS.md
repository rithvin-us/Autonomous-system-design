# Asset Sources, Dimensions & Licences

This document records the provenance, dimensions, and reference sources for all hardware assets and typographic resources used throughout the deck.

---

## 1. Sensor Hardware Models

### Stereolabs ZED 2i Stereo Camera
- **Status**: Illustrative procedural model.
- **Reference**: Stereolabs ZED 2i technical drawing, rev. 1 (26/05/2021).
- **Key Dimensions**: 175.25 × 30.25 mm front face, 120 mm baseline distance between left and right optics, Ø19.25 mm lens bezels, ¼"-20 UNC base mount, 4 × M3 rear mounting pattern.
- **Materials**: Matte anodized aluminum housing, coated optical elements, IP66 enclosure.

### Starkenn Radar
- **Status**: Illustrative placeholder model.
- **Reference**: Representative compact 77 GHz / 24 GHz automotive FMCW radar enclosure.
- **Key Dimensions**: 92.4 × 80.0 × 32.0 mm housing, forward radome face with curved transmission aperture.
- **Replacement**: Drop official Starkenn CAD `.glb` into `/public/models/` and set `glb` in `src/content/sensors.ts`.

### Multi-band GNSS Antenna & Receiver
- **Status**: Illustrative procedural model.
- **Reference**: Survey-grade active patch antenna dome with ground plane and SMA coaxial connection.
- **Key Dimensions**: Ø110 mm conical radome, M16 antenna pole mount, 70 × 45 mm receiver PCB.

### 6-DOF Inertial Measurement Unit (IMU)
- **Status**: Illustrative procedural model.
- **Reference**: High-performance MEMS accelerometer & gyroscope breakout board (e.g. Bosch BMI088 / TDK InvenSense ICM-series).
- **Key Dimensions**: 25 × 18 mm 4-layer FR4 PCB, 0.1" gold header pins, surface-mount decoupling passives.

### HC-SR04 Ultrasonic Sensor
- **Status**: Illustrative procedural model.
- **Reference**: Standard robotics ultrasonic range module.
- **Key Dimensions**: 45.0 × 20.0 × 15.0 mm PCB, dual Ø16 mm aluminum mesh transducers (Transmitter 'T' and Receiver 'R'), 4-pin 2.54 mm right-angle header (VCC, TRIG, ECHO, GND).

---

## 2. Vehicle Model

### Procedural Autonomous Buggy (`src/models/Buggy.tsx`)
- **Status**: Illustrative procedural testbed.
- **Dimensions**: 1600 mm overall length, 950 mm track width, 720 mm height, 1100 mm wheelbase.
- **Components**: Tubular roll cage frame, independent double-wishbone suspension with coilover shocks, front steering servo linkage, rear motor driver stage, central NVIDIA Jetson Orin compute bay, and elevated sensor mast.

---

## 3. Typography & Licences

- **Archivo Variable**: Designed by Omnibus-Type. SIL Open Font License (OFL). Bundled locally via `@fontsource-variable/archivo`.
- **Inter Variable**: Designed by Rasmus Andersson. SIL Open Font License (OFL). Bundled locally via `@fontsource-variable/inter`.
- **Google Draco**: Open-source geometry compression library used for decoding external 3D models. Apache 2.0 Licence.
