/**
 * Material presets for the procedural hardware. Spread into
 * <meshPhysicalMaterial {...M.x} /> so each mesh owns its material.
 */
export const M = {
  /** Dark anodised aluminium (camera body). */
  anodisedDark: { color: '#4a4e55', metalness: 0.62, roughness: 0.3, clearcoat: 0.25, clearcoatRoughness: 0.4 },
  /** Bead-blasted grey aluminium. */
  aluminium: { color: '#9aa0a6', metalness: 0.85, roughness: 0.38 },
  /** Bright machined steel / tin. */
  steel: { color: '#c9ccd0', metalness: 1, roughness: 0.28 },
  /** Gold-plated pads and pins. */
  gold: { color: '#d4a64a', metalness: 1, roughness: 0.3 },
  /** Glossy black cover glass. */
  blackGlass: { color: '#050506', metalness: 0.1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.04 },
  /** Coated lens element: dark with a faint iridescent reflection. */
  lens: {
    color: '#0a0c12',
    metalness: 0.2,
    roughness: 0.03,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    iridescence: 1,
    iridescenceIOR: 1.6,
    iridescenceThicknessRange: [260, 520] as [number, number],
  },
  /** Matte black plastic. */
  plasticBlack: { color: '#141517', metalness: 0, roughness: 0.62 },
  /** Mid-grey plastic. */
  plasticGrey: { color: '#5d6166', metalness: 0, roughness: 0.55 },
  /** Light grey plastic (radomes). */
  plasticLight: { color: '#d9dadb', metalness: 0, roughness: 0.48, clearcoat: 0.25, clearcoatRoughness: 0.6 },
  /** Neutral placeholder clay. */
  clay: { color: '#b9b4ab', metalness: 0, roughness: 0.78 },
  /** Solder mask colours. */
  pcbBlue: { color: '#1f4d8c', metalness: 0.05, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 },
  pcbBlack: { color: '#16181a', metalness: 0.05, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 },
  pcbPurple: { color: '#3a2f5b', metalness: 0.05, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 },
  /** Silkscreen white. */
  silk: { color: '#f2f2ee', metalness: 0, roughness: 0.6 },
  /** IC package epoxy. */
  epoxy: { color: '#1b1c1e', metalness: 0, roughness: 0.5 },
  /** Ceramic capacitor tan. */
  ceramic: { color: '#b89f7a', metalness: 0, roughness: 0.55 },
  /** Woven mesh (transducer fronts) — rendered dark with sheen. */
  mesh: { color: '#2b2d30', metalness: 0.6, roughness: 0.55 },
  /** Rubber / tyres. */
  rubber: { color: '#1a1a1b', metalness: 0, roughness: 0.92 },
  /** Powder-coated frame. */
  frame: { color: '#2b2e33', metalness: 0.45, roughness: 0.48 },
  /** Accent: safety orange paint. */
  orange: { color: '#ff6a13', metalness: 0.1, roughness: 0.5 },
} as const;
