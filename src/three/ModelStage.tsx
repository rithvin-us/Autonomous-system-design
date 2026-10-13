import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { PerspectiveCamera, Spherical, Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Vec3 } from '../content/types';
import { useStageScale } from '../shell/contexts';
import { RESET_VIEW_EVENT } from '../shell/events';
import { hasSnapshot, saveSnapshot } from '../shell/snapshots';
import { StudioLighting, type LightingTone } from './StudioLighting';
import './three.css';

export interface CameraSetup {
  position: Vec3;
  target: Vec3;
  fov: number;
  minDistance: number;
  maxDistance: number;
}

export interface StageApi {
  /** Change the default view (and glide to it unless `glide` is false). Reset returns here. */
  setHome: (position: Vec3, target: Vec3, glide?: boolean) => void;
  /** Restore the view given in props (and glide to it unless `glide` is false). */
  restoreHome: (glide?: boolean) => void;
  /** Glide back to the current home view. */
  reset: () => void;
  /** Glide to look at a world point from the direction of a world normal. */
  focus: (point: Vector3, normal: Vector3) => void;
  /** Hold auto-rotation off for a named reason (e.g. an open label). */
  hold: (reason: string, on: boolean) => void;
}

const StageApiContext = createContext<StageApi | null>(null);

export function useStageApi() {
  const api = useContext(StageApiContext);
  if (!api) throw new Error('useStageApi must be used inside ModelStage');
  return api;
}

const RESUME_AFTER_MS = 3500;
const GLIDE_MS = 900;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Orbit controls, auto-rotation, glides and reset handling. */
function Rig({
  camera: setup,
  autoRotateSpeed,
  autoRotate,
  enableZoom,
  children,
}: {
  camera: CameraSetup;
  autoRotateSpeed: number;
  autoRotate: boolean;
  enableZoom: boolean;
  children: ReactNode;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const home = useRef({ position: new Vector3(...setup.position), target: new Vector3(...setup.target) });
  const holds = useRef(new Set<string>());
  const userIdle = useRef(true);
  const resumeTimer = useRef(0);
  const glide = useRef<{
    start: number;
    fromTarget: Vector3;
    toTarget: Vector3;
    from: Spherical;
    to: Spherical;
  } | null>(null);

  const syncAutoRotate = useCallback(() => {
    const c = controls.current;
    if (!c) return;
    c.autoRotate = autoRotate && userIdle.current && holds.current.size === 0 && !glide.current;
    c.autoRotateSpeed = autoRotateSpeed;
  }, [autoRotate, autoRotateSpeed]);

  const glideTo = useCallback(
    (position: Vector3, target: Vector3) => {
      const c = controls.current;
      if (!c) return;
      const from = new Spherical().setFromVector3(camera.position.clone().sub(c.target));
      const to = new Spherical().setFromVector3(position.clone().sub(target));
      // Take the short way round.
      let d = to.theta - from.theta;
      d = ((d + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      to.theta = from.theta + d;
      glide.current = { start: performance.now(), fromTarget: c.target.clone(), toTarget: target.clone(), from, to };
      syncAutoRotate();
    },
    [camera, syncAutoRotate],
  );

  const api = useMemo<StageApi>(
    () => ({
      setHome: (position, target, glide = true) => {
        home.current = { position: new Vector3(...position), target: new Vector3(...target) };
        if (glide) glideTo(home.current.position, home.current.target);
      },
      restoreHome: (glide = true) => {
        home.current = { position: new Vector3(...setup.position), target: new Vector3(...setup.target) };
        if (glide) glideTo(home.current.position, home.current.target);
      },
      reset: () => glideTo(home.current.position, home.current.target),
      focus: (point, normal) => {
        // Framed from the home view so every part is shown the same way,
        // whatever the audience last saw.
        const { position, target: homeTarget } = home.current;
        const dist = position.distanceTo(homeTarget);
        const homeDir = position.clone().sub(homeTarget).normalize();
        const dir = normal
          .clone()
          .multiplyScalar(0.8)
          .add(homeDir.multiplyScalar(0.4))
          .add(new Vector3(0, 0.22, 0))
          .normalize();
        const target = homeTarget.clone().lerp(point, 0.3);
        glideTo(target.clone().add(dir.multiplyScalar(dist)), target);
      },
      hold: (reason, on) => {
        if (on) holds.current.add(reason);
        else holds.current.delete(reason);
        syncAutoRotate();
      },
    }),
    [camera, glideTo, setup, syncAutoRotate],
  );

  useEffect(() => {
    const onReset = () => api.reset();
    window.addEventListener(RESET_VIEW_EVENT, onReset);
    return () => window.removeEventListener(RESET_VIEW_EVENT, onReset);
  }, [api]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const onStart = () => {
      userIdle.current = false;
      glide.current = null;
      window.clearTimeout(resumeTimer.current);
      syncAutoRotate();
    };
    const onEnd = () => {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => {
        userIdle.current = true;
        syncAutoRotate();
      }, RESUME_AFTER_MS);
    };
    c.addEventListener('start', onStart);
    c.addEventListener('end', onEnd);
    syncAutoRotate();
    return () => {
      c.removeEventListener('start', onStart);
      c.removeEventListener('end', onEnd);
      window.clearTimeout(resumeTimer.current);
    };
  }, [syncAutoRotate]);

  useFrame(() => {
    const g = glide.current;
    const c = controls.current;
    if (!g || !c) return;
    const t = Math.min(1, (performance.now() - g.start) / GLIDE_MS);
    const e = ease(t);
    c.target.lerpVectors(g.fromTarget, g.toTarget, e);
    const s = new Spherical(
      g.from.radius + (g.to.radius - g.from.radius) * e,
      g.from.phi + (g.to.phi - g.from.phi) * e,
      g.from.theta + (g.to.theta - g.from.theta) * e,
    );
    camera.position.setFromSpherical(s).add(c.target);
    camera.lookAt(c.target);
    if (t >= 1) {
      glide.current = null;
      syncAutoRotate();
    }
  }, -2);

  return (
    <StageApiContext.Provider value={api}>
      <OrbitControls
        ref={controls}
        makeDefault
        target={setup.target}
        enablePan={false}
        enableZoom={enableZoom}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
        zoomSpeed={0.6}
        minDistance={setup.minDistance}
        maxDistance={setup.maxDistance}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI - 0.05}
      />
      {children}
    </StageApiContext.Provider>
  );
}

/**
 * Shifts the projection so the orbit target appears at `cx` (0–1) across the
 * canvas instead of the centre. Lets a full-bleed canvas frame an object in
 * the right-hand part of the slide without clipping it at a hard edge.
 */
function ViewOffset({ cx }: { cx: number }) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as PerspectiveCamera;
    if (cx === 0.5) cam.clearViewOffset();
    else cam.setViewOffset(size.width, size.height, -(cx - 0.5) * size.width, 0, size.width, size.height);
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height, cx]);
  return null;
}

/** Captures a still of the canvas once, for overview and presenter thumbnails. */
function Snapshotter({ id, delay }: { id: string; delay: number }) {
  const done = useRef(hasSnapshot(id));
  const elapsed = useRef(0);
  useFrame(({ gl, scene, camera }, dt) => {
    if (done.current) return;
    elapsed.current += dt;
    if (elapsed.current < delay) return;
    done.current = true;
    try {
      gl.render(scene, camera);
      const src = gl.domElement;
      const w = 720;
      const h = Math.round((w * src.height) / src.width);
      const out = document.createElement('canvas');
      out.width = w;
      out.height = h;
      out.getContext('2d')?.drawImage(src, 0, 0, w, h);
      saveSnapshot(id, out.toDataURL('image/webp', 0.85));
    } catch (err) {
      console.warn('[deck] snapshot failed', err);
    }
  });
  return null;
}

export interface ShadowSetup {
  y: number;
  opacity?: number;
  scale?: number;
  blur?: number;
  far?: number;
  /** Re-render every frame (for moving objects). */
  live?: boolean;
}

/**
 * Interactive WebGL viewer: studio lighting, orbit + zoom, slow auto-rotation
 * that pauses while the user interacts, animated reset (R key or button).
 * Mount only while the slide is visible; unmounting frees the GPU context.
 */
export function ModelStage({
  camera,
  autoRotateSpeed = 0.55,
  autoRotate = true,
  enableZoom = true,
  lighting = 'light',
  shadow,
  snapshotId,
  snapshotDelay = 1.4,
  viewCenterX = 0.5,
  style,
  className,
  children,
}: {
  camera: CameraSetup;
  autoRotateSpeed?: number;
  autoRotate?: boolean;
  enableZoom?: boolean;
  lighting?: LightingTone;
  shadow?: ShadowSetup;
  snapshotId?: string;
  snapshotDelay?: number;
  /** Where the orbit target sits across the canvas (0 = left, 1 = right). */
  viewCenterX?: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  const scale = useStageScale();
  const dpr = Math.min(2, Math.max(0.75, window.devicePixelRatio * scale));
  return (
    <div className={`model-stage ${className ?? ''}`} style={style}>
      <Canvas
        dpr={dpr}
        resize={{ offsetSize: true }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: camera.position, fov: camera.fov, near: 0.02, far: 400 }}
      >
        <ViewOffset cx={viewCenterX} />
        <StudioLighting tone={lighting} />
        <Rig camera={camera} autoRotate={autoRotate} autoRotateSpeed={autoRotateSpeed} enableZoom={enableZoom}>
          {children}
        </Rig>
        {shadow && (
          <ContactShadows
            position={[0, shadow.y, 0]}
            opacity={shadow.opacity ?? 0.42}
            scale={shadow.scale ?? 6}
            blur={shadow.blur ?? 2.2}
            far={shadow.far ?? 2}
            resolution={512}
            frames={shadow.live ? Infinity : 90}
            color="#000000"
          />
        )}
        {snapshotId && <Snapshotter id={snapshotId} delay={snapshotDelay} />}
      </Canvas>
    </div>
  );
}
