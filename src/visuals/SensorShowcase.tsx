import { useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { sensors } from '../content/sensors';
import { tourOf } from '../content/steps';
import type { SensorConfig, Vec3 } from '../content/types';
import { AssetTag } from '../layouts/AssetTag';
import { sensorModels } from '../models/sensorModels';
import { useSlide } from '../shell/contexts';
import { ModelSource } from '../three/GlbModel';
import { Hotspots } from '../three/Hotspots';
import { ModelStage, useStageApi } from '../three/ModelStage';
import { SnapshotImage } from '../three/SnapshotImage';
import type { VisualProps } from './registry';
import { createHud, DemoReadout, demoViews, sensorDemos } from './sensorDemos';
import './showcase.css';

const CANVAS = { left: 0, top: 0, right: 0, bottom: 0 } as const;
/** Hardware sits in the right part of the slide, clear of the heading. */
const VIEW_CENTER_X = 0.655;

/** Moves the camera when the build step changes: home, a part, or the demo view. */
function CameraDirector({
  cfg,
  focus,
  demoView,
}: {
  cfg: SensorConfig;
  focus: string | null;
  demoView: { position: Vec3; target: Vec3 } | null;
}) {
  const api = useStageApi();
  const key = demoView ? 'demo' : (focus ?? 'home');
  const first = useRef(true);

  useEffect(() => {
    const initial = first.current;
    first.current = false;
    if (initial && key === 'home') return;
    if (demoView) {
      api.setHome(demoView.position, demoView.target);
      return;
    }
    api.restoreHome(focus === null);
    const spot = focus ? cfg.hotspots.find((h) => h.id === focus) : undefined;
    if (spot) {
      api.focus(new Vector3(...spot.position).multiplyScalar(cfg.displayScale), new Vector3(...spot.normal).normalize());
    }
    // `key` captures every input that matters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, api]);

  return null;
}

/**
 * Sensor hardware slide, driven only by the clicker: overview → each part
 * in turn (camera turns to it, label opens) → sensing demo → next slide.
 */
export default function SensorShowcase({ visual }: VisualProps<'sensorShowcase'>) {
  const { mode, slide, step } = useSlide();
  const cfg = sensors[visual.sensor];
  const { Model, floorY } = sensorModels[cfg.id];
  const Demo = sensorDemos[cfg.id];
  const hud = useMemo(createHud, []);
  const tour = tourOf(cfg);
  const demoStep = tour.length + 1;

  const demo = step >= demoStep;
  const tourIndex = step >= 1 && step <= tour.length ? step - 1 : -1;
  const active = tourIndex >= 0 ? tour[tourIndex].id : null;
  const parts = tourIndex >= 0;

  const model = (
    <group scale={cfg.displayScale}>
      <ModelSource glb={cfg.glb} transform={cfg.glbTransform} fallback={<Model />} />
      {parts && (
        <Hotspots items={tour} active={active} />
      )}
    </group>
  );

  return (
    <>
      {mode === 'thumb' ? (
        <SnapshotImage id={slide.id} style={CANVAS} />
      ) : (
        <ModelStage
          camera={cfg.camera}
          autoRotateSpeed={cfg.autoRotateSpeed}
          autoRotate={!demo}
          lighting="light"
          shadow={{ y: floorY * cfg.displayScale - 0.004, opacity: 0.38, scale: 7, blur: 2.4, far: 1.5, live: demo }}
          snapshotId={slide.id}
          viewCenterX={VIEW_CENTER_X}
          style={CANVAS}
        >
          <CameraDirector cfg={cfg} focus={active} demoView={demo ? demoViews[cfg.id] : null} />
          <Demo on={demo} cfg={cfg} hud={hud}>
            {model}
          </Demo>
        </ModelStage>
      )}

      {demo && mode === 'live' && <DemoReadout sensor={cfg.id} hud={hud} />}

      <AssetTag status={cfg.status} note={cfg.statusNote} style={{ left: 120, bottom: 56 }} />
    </>
  );
}
