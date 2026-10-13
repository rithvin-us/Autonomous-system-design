import { useGLTF } from '@react-three/drei';
import { Suspense, useMemo, type ReactNode } from 'react';
import type { Vec3 } from '../content/types';
import { ErrorBoundary } from '../lib/ErrorBoundary';

const base = import.meta.env.BASE_URL;
const DRACO_PATH = `${base}draco/`;

function resolve(path: string) {
  return /^(https?:)?\//.test(path) ? path : `${base}${path.replace(/^\.?\//, '')}`;
}

function Gltf({ url, scale = 1, rotation, position }: { url: string; scale?: number; rotation?: Vec3; position?: Vec3 }) {
  const gltf = useGLTF(url, DRACO_PATH);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf]);
  return <primitive object={scene} scale={scale} rotation={rotation} position={position} />;
}

/**
 * Shows a GLB/glTF file when one is configured and loads; otherwise (or if
 * the file is missing or broken) shows the built-in procedural model.
 */
export function ModelSource({
  glb,
  transform,
  fallback,
}: {
  glb?: string;
  transform?: { scale?: number; rotation?: Vec3; position?: Vec3 };
  fallback: ReactNode;
}) {
  if (!glb) return <>{fallback}</>;
  return (
    <ErrorBoundary fallback={fallback}>
      <Suspense fallback={null}>
        <Gltf url={resolve(glb)} {...transform} />
      </Suspense>
    </ErrorBoundary>
  );
}
