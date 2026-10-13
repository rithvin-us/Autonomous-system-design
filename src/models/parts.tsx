import { useEffect, useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';
import type { Vec3 } from '../content/types';
import { M } from '../three/materials';

/** Text drawn to a transparent texture: used for silkscreen markings. */
function useTextTexture(text: string, aspect: number, color: string, weight = 700): Texture {
  const tex = useMemo(() => {
    const h = 128;
    const w = Math.round(h * aspect);
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let size = 104;
    ctx.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
    while (ctx.measureText(text).width > w * 0.96 && size > 10) {
      size -= 4;
      ctx.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
    }
    ctx.fillText(text, w / 2, h / 2 + 4);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [text, aspect, color, weight]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** Flat printed marking. Size is the box the text fits in (mm). */
export function Silk({
  text,
  position,
  rotation = [0, 0, 0],
  width,
  height,
  color = '#f1f1ec',
}: {
  text: string;
  position: Vec3;
  rotation?: Vec3;
  width: number;
  height: number;
  color?: string;
}) {
  const map = useTextTexture(text, width / height, color);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={map} transparent roughness={0.6} depthWrite={false} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}

/** Woven wire mesh texture for transducer faces and grilles. */
export function useMeshTexture(repeat = 6): Texture {
  const tex = useMemo(() => {
    const s = 64;
    const c = document.createElement('canvas');
    c.width = s;
    c.height = s;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#1a1b1d';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#8e939a';
    ctx.lineWidth = 6;
    for (let i = 0; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 32);
      ctx.lineTo(s, i * 32);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i * 32, 0);
      ctx.lineTo(i * 32, s);
      ctx.stroke();
    }
    const t = new CanvasTexture(c);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [repeat]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** Dark recess suggesting a threaded or plain hole on a surface. */
export function Hole({
  position,
  rotation = [0, 0, 0],
  r,
  ring = 0,
}: {
  position: Vec3;
  rotation?: Vec3;
  r: number;
  /** Width of a metallic ring around the hole (threaded insert or plated pad). */
  ring?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[r, r, 0.3, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      {ring > 0 && (
        <mesh rotation-x={Math.PI / 2} position={[0, 0, -0.02]}>
          <cylinderGeometry args={[r + ring, r + ring, 0.26, 32]} />
          <meshPhysicalMaterial {...M.steel} roughness={0.45} />
        </mesh>
      )}
    </group>
  );
}

/** Square header pin (0.64 mm), centred on `position`, running along local Y. */
export function Pin({ position, length, rotation = [0, 0, 0] }: { position: Vec3; length: number; rotation?: Vec3 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.64, length, 0.64]} />
      <meshPhysicalMaterial {...M.gold} />
    </mesh>
  );
}

/** Arbitrary 2D drawing on a transparent texture (silkscreen symbols). */
export function SilkDrawing({
  draw,
  position,
  rotation = [0, 0, 0],
  width,
  height,
  px = 256,
}: {
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  position: Vec3;
  rotation?: Vec3;
  width: number;
  height: number;
  px?: number;
}) {
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = px;
    c.height = Math.round((px * height) / width);
    const ctx = c.getContext('2d')!;
    draw(ctx, c.width, c.height);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
    // draw functions are static per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [px, width, height]);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={map} transparent roughness={0.6} depthWrite={false} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}

/** Plated ring around a through-hole (pad or mounting hole). */
export function PlatedRing({ position, r, ring, rotation = [-Math.PI / 2, 0, 0] }: { position: Vec3; r: number; ring: number; rotation?: Vec3 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <ringGeometry args={[r, r + ring, 40]} />
      <meshPhysicalMaterial color="#dcb25e" metalness={0.85} roughness={0.4} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
  );
}
