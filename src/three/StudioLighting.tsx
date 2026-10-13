import { Environment, Lightformer } from '@react-three/drei';

export type LightingTone = 'light' | 'dark';

/**
 * Photographic studio: large overhead softbox, key from front-left, cool rim
 * from behind. The environment is generated on the GPU (no HDR download),
 * so it works offline.
 */
export function StudioLighting({ tone }: { tone: LightingTone }) {
  const dark = tone === 'dark';
  return (
    <>
      <ambientLight intensity={dark ? 0.12 : 0.28} />
      <directionalLight position={[3, 6, 4]} intensity={dark ? 1.2 : 1.5} />
      <directionalLight position={[-5, 2.5, -4]} intensity={dark ? 0.9 : 0.5} color="#d5dde8" />
      <Environment resolution={256} frames={1} environmentIntensity={dark ? 0.75 : 1}>
        {/* Base tone of the surrounding studio, so metals never reflect pure black */}
        <color attach="background" args={[dark ? '#1c1d20' : '#6b6a68']} />
        <Lightformer form="rect" intensity={2.6} position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[10, 5, 1]} />
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[-6, 2, 4]}
          rotation-y={Math.PI / 3}
          scale={[4, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[6, 1.5, -3]}
          rotation-y={-Math.PI / 1.6}
          scale={[3, 4, 1]}
          color="#e6edf7"
        />
        {/* Long strip in front: gives glossy faces a clean highlight line */}
        <Lightformer form="rect" intensity={1.4} position={[0, 2.2, 7]} scale={[12, 0.6, 1]} />
        <Lightformer form="rect" intensity={0.5} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>
    </>
  );
}
