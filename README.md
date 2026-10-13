# System Design & Architecture in Autonomous Systems

A 26-slide lecture deck for first-year engineering students, built as a
browser presentation: one 16:9 slide at a time, interactive 3D sensor
hardware, animated diagrams, and clicker-driven builds. It runs fully
offline.

## Run it

```bash
npm install        # once
npm run dev        # http://localhost:5173 — for preparing and presenting
npm run build      # production build into dist/
npm run preview    # serve dist/ locally (also offline)
```

Open the page, press **F** (or F5 on a clicker) for full screen.

## Presenting

Everything is driven by **Next / Previous**: a presentation clicker
(PageDown / PageUp), the arrow keys, Space, or the two on-screen arrows.
Many slides have *builds*: each Next press reveals the next step (a sensor
part, a demo, a stage of a diagram) before moving on to the next slide,
like PowerPoint animations. The small squares beside the slide counter show
how many builds the current slide has.

| Key | Action |
| --- | --- |
| → PgDn Space | Next build, then next slide |
| ← PgUp Backspace | Previous build, then previous slide |
| ↓ ↑ | Skip straight to the next / previous slide |
| Home End | First / last slide |
| O | All slides (Esc returns) |
| N | Presenter notes panel (hidden from the audience until opened) |
| P | Presenter window: notes, "next click", next slide, timer; stays in sync |
| R | Reset the 3D camera |
| F, F5 | Full screen |
| B, . | Black screen (any key returns) |
| ? | Keyboard help |

Add `?solo` to the URL to open a copy that does not follow or drive other
open windows (useful for rehearsing while the main deck is open).

## Speaking script

`script.md` is a full speaking script for all 26 slides (about 58 minutes),
built around one thread: an autonomous machine is a *designed system*. Each
slide has a **design lens** (requirements, architecture, interfaces,
trade-offs, failure handling, verification) and a **[click]** cue for every
build. The presenter notes (N, or the P window) carry each slide's design
lens in short.

## Changing the content

All text and slide order live in `src/content/`; components only decide how
things look.

| File | What it holds |
| --- | --- |
| `slides.ts` | The deck: order, titles, one-line descriptions, diagram labels, presenter notes |
| `sensors.ts` | Sensor names, asset status, camera framing, hotspots (part labels), part tour order, GLB paths |
| `diagrams.ts` | The architecture block diagram (slide 06): columns, nodes, connections |
| `steps.ts` | Which slides have clicker builds and what each build is called |
| `theme.ts` | Colour palette and fonts |
| `deck.ts` | Deck settings: asset tags on/off, transition, cursor hide, team vehicle GLB |

- **Edit text**: change strings in `slides.ts`. Use `\n` in a title for a
  deliberate line break; `titleSize` overrides the heading size.
- **Reorder / remove slides**: reorder or delete entries in the `slides`
  array. Each entry's `visual.kind` picks its visual from
  `src/visuals/registry.ts`.
- **Presenter notes**: the `notes` field. Placeholders are marked `[EDIT]`.
- **Shorten a sensor's part tour**: set `tour: ['left-lens', 'usb']` (hotspot
  ids) in `sensors.ts`; `tour: []` goes straight to the demo.
- **Colours and fonts**: `theme.ts`.
- **Hide the "illustrative / placeholder" tags**: `showAssetTags: false` in
  `deck.ts`.

## Replacing the sensor and vehicle models

Each sensor, and the Jetson computer on slide 14, has a built-in procedural model (all defined in `sensors.ts`). To use real CAD instead:

1. Export the part as **GLB** (glTF binary), in **millimetres**, front facing
   **+Z**, Y up, origin at the centre of the part.
2. Put it in `public/models/`, e.g. `public/models/starkenn-radar.glb`.
3. In `src/content/sensors.ts`, set `glb: 'models/starkenn-radar.glb'` on that
   sensor. Adjust `glbTransform` if the export uses other units or axes.
4. Update `status` to `'verified'` (hides the tag) and `statusNote`, and move
   the `hotspots` to match the real geometry.

If the file is missing or fails to load, the built-in model is shown
instead, and the browser console says so. Draco-compressed files work
offline: the decoder is bundled in `public/draco/`.

The team vehicle works the same way: `deck.ts` → `vehicle.glb`
(metres-scale content is fine; use `glbTransform.scale`).

### Model status today

| Sensor | Status |
| --- | --- |
| ZED 2i | Illustrative reconstruction from the Stereolabs technical drawing |
| Starkenn radar | **Placeholder** — exact unit not yet identified |
| GNSS | Illustrative generic antenna + receiver |
| IMU | Illustrative generic breakout board |
| HC-SR04 | Illustrative, typical vendor dimensions |
| Jetson Orin (computing) | Illustrative, after the Jetson Orin Nano Developer Kit layout |
| Vehicle | Illustrative buggy — team vehicle pending |

## Slide 04: types of autonomous system

Four 3D study models (`src/models/TypesModels.tsx`) built from the
presenter's reference photos, each photo shown beneath its model:
`public/images/types/autonomous-vehicle.png`, `mobile-robot.png`,
`drone.png`, `robotic-machine.png`. Photo crop (`focus`) is set per item in
`slides.ts`; the item `id` picks the model (`car`, `amr`, `drone`, `robot`).

## Project structure

```
src/
  content/   deck data (edit here)
  shell/     presentation frame: navigation, steps, overview, notes, presenter window
  layouts/   slide heading layouts, asset status tag
  visuals/   one component per slide visual (see registry.ts)
  three/     3D viewer: stage, studio lighting, orbit + reset, hotspots, GLB loader
  models/    procedural hardware models (sensors, vehicles)
  diagram/   shared SVG drawing vocabulary for 2D diagrams
public/
  draco/     offline glTF decoder
  models/    optional GLB replacements
  images/    photos
```

See `ASSETS.md` for asset sources and licences.
