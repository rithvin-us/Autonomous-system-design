# Assets, sources and licences

## 3D models

All 3D models in this repository are procedural (built in code). None is a
manufacturer CAD file. Their status is shown on the slides unless
`showAssetTags` is turned off in `src/content/deck.ts`.

| Model | File | Status | Reference used |
| --- | --- | --- | --- |
| Stereolabs ZED 2i | `src/models/Zed2i.tsx` | Illustrative reconstruction | Stereolabs ZED 2i technical drawing, rev. 1 (26/05/21), distributed via Clearpath Robotics docs; stereolabs.com/zed-2i product page. Used for dimensions only: 175.25 × 30.25 mm front, 170.29 mm rear, Ø19.25 mm lens bezels, 120 mm baseline, rear boss with USB-C and 2 × M2.5 locking holes, 4 × M3 rear holes, ¼"-20 + 2 × M3 base. No logos reproduced. |
| Starkenn radar | `src/models/RadarPlaceholder.tsx` | **Placeholder** | None. Neutral stand-in; size and details are not the product's. |
| GNSS antenna + receiver | `src/models/GnssAntenna.tsx` | Illustrative generic | None (generic form). |
| IMU module | `src/models/ImuBoard.tsx` | Illustrative generic | None (generic form). |
| HC-SR04 | `src/models/HcSr04.tsx` | Illustrative | Typical vendor listings: 45 × 20 × 15 mm, ~16 mm transducers marked T/R, 4-pin header Vcc/Trig/Echo/Gnd. |
| NVIDIA Jetson Orin (dev kit) | `src/models/JetsonOrin.tsx` | Illustrative reconstruction | NVIDIA Jetson Orin Nano Developer Kit user guide, Hardware Layout (connector set); retailer listing for the 100 × 79 mm footprint. Connector positions approximate; no logos reproduced. |
| Autonomous buggy | `src/models/Vehicle.tsx` | Illustrative | None; stands in for the team vehicle. |
| Scenario rover | `src/models/MiniRover.tsx` | Generic | None. |
| Slide 04 robotaxi, warehouse AMRs, drone + dock, humanoid | `src/models/TypesModels.tsx` | Illustrative study models | The presenter's four reference photos (below). Shapes only; no logos, brand marks or likenesses reproduced. |

`src/models/Buggy.tsx` is an earlier vehicle model from a parallel edit; it
is not used by any slide.

## Photos (slide 04, shown as references under the 3D models)

Supplied by the presenter. Rights belong to their owners; they are used
here for classroom teaching. Check permission before publishing the deck or
sharing it outside the course.

| File | Content | Source / credit |
| --- | --- | --- |
| `public/images/types/autonomous-vehicle.png` | Waymo autonomous car | [EDIT] |
| `public/images/types/mobile-robot.png` | Europa Systems mobile robots | [EDIT] |
| `public/images/types/drone.png` | Drone with docking station | [EDIT] |
| `public/images/types/robotic-machine.png` | Chitti, *Enthiran* (2010), film still | [EDIT] |

## Fonts

Bundled through npm, served locally (no network needed):

- Archivo — SIL Open Font License 1.1 (`@fontsource-variable/archivo`)
- Inter — SIL Open Font License 1.1 (`@fontsource-variable/inter`)

## Libraries

React, three.js, @react-three/fiber, @react-three/drei (MIT). The Draco
decoder in `public/draco/` is copied from three.js (Apache 2.0).
