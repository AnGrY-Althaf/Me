import * as THREE from 'three';

/**
 * Canvas-texture factories. All section text lives inside the WebGL scene,
 * so every string is rasterised here at high resolution and mounted on a
 * plane. World size is derived from the canvas aspect so type never squashes.
 */

export const INK = '#f4f2f0';
export const INK_DIM = 'rgba(244,242,240,0.55)';
export const INK_FAINT = 'rgba(244,242,240,0.34)';

export const DISPLAY = '"Unbounded", sans-serif';
export const BODY = '"Space Grotesk", sans-serif';

/** Pixels of canvas per world unit — one shared scale keeps type crisp. */
export const PX = 26;

export interface TextSpec {
  text: string | string[];
  font?: string;
  /** Font size in world units. */
  size: number;
  weight?: number | string;
  color?: string;
  /** Stroke-only text (the big outlined headlines). */
  outline?: boolean;
  outlineWidth?: number;
  letterSpacing?: number; // em
  lineHeight?: number; // multiple of size
  align?: 'left' | 'center' | 'right';
  uppercase?: boolean;
}

export interface BuiltTexture {
  texture: THREE.CanvasTexture;
  /** World size of the plane this texture expects. */
  w: number;
  h: number;
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = Math.max(2, Math.ceil(w));
  c.height = Math.max(2, Math.ceil(h));
  return c;
}

function finish(c: HTMLCanvasElement, worldW: number, worldH: number): BuiltTexture {
  const texture = new THREE.CanvasTexture(c);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  return { texture, w: worldW, h: worldH };
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  mode: 'fill' | 'stroke',
  align: 'left' | 'center' | 'right'
) {
  // Manual letter-spacing so tracked text still centres correctly.
  if (tracking === 0) {
    ctx.textAlign = align;
    if (mode === 'fill') ctx.fillText(text, x, y);
    else ctx.strokeText(text, x, y);
    return;
  }
  ctx.textAlign = 'left';
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + tracking * (text.length - 1);
  let cx = align === 'left' ? x : align === 'center' ? x - total / 2 : x - total;
  [...text].forEach((ch, i) => {
    if (mode === 'fill') ctx.fillText(ch, cx, y);
    else ctx.strokeText(ch, cx, y);
    cx += widths[i] + tracking;
  });
}

/** Render a block of text (single- or multi-line) to a texture. */
export function textTexture(spec: TextSpec): BuiltTexture {
  const {
    font = BODY,
    size,
    weight = 400,
    color = INK,
    outline = false,
    outlineWidth = 0.045,
    letterSpacing = 0,
    lineHeight = 1.24,
    align = 'left',
    uppercase = false,
  } = spec;

  const lines = (Array.isArray(spec.text) ? spec.text : [spec.text]).map((l) =>
    uppercase ? l.toUpperCase() : l
  );

  const fpx = size * PX;
  const tracking = letterSpacing * fpx;
  const probe = makeCanvas(2, 2).getContext('2d')!;
  probe.font = `${weight} ${fpx}px ${font}`;

  let maxW = 0;
  for (const line of lines) {
    const w = probe.measureText(line).width + Math.max(0, line.length - 1) * tracking;
    maxW = Math.max(maxW, w);
  }

  const pad = fpx * 0.25;
  const lh = fpx * lineHeight;
  const cw = maxW + pad * 2;
  const ch = lh * (lines.length - 1) + fpx * 1.3 + pad * 2;

  const canvas = makeCanvas(cw, ch);
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${weight} ${fpx}px ${font}`;
  ctx.textBaseline = 'alphabetic';

  const anchorX = align === 'left' ? pad : align === 'center' ? cw / 2 : cw - pad;

  lines.forEach((line, i) => {
    const y = pad + fpx + i * lh;
    if (outline) {
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.5, fpx * outlineWidth);
      drawTracked(ctx, line, anchorX, y, tracking, 'stroke', align);
    } else {
      ctx.fillStyle = color;
      drawTracked(ctx, line, anchorX, y, tracking, 'fill', align);
    }
  });

  return finish(canvas, cw / PX, ch / PX);
}

/** Soft round star dot with gaussian-ish falloff. */
export function starTexture(size = 64): THREE.CanvasTexture {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.22, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  return t;
}

/** Bright orb — the occasional "planet" glow with hot core and wide halo. */
export function orbTexture(size = 256): THREE.CanvasTexture {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.08, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.2, 'rgba(255,255,255,0.35)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.08)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/** Four-point sparkle — thin star cross. */
export function sparkleTexture(size = 128): THREE.CanvasTexture {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d')!;
  const cx = size / 2;
  ctx.translate(cx, cx);
  const arm = size * 0.48;
  const waist = size * 0.028;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, -arm);
    ctx.quadraticCurveTo(waist, -waist, arm * 0.14, 0);
    ctx.quadraticCurveTo(waist, waist, 0, arm * 0.3);
    ctx.quadraticCurveTo(-waist, waist, -arm * 0.14, 0);
    ctx.quadraticCurveTo(-waist, -waist, 0, -arm);
    ctx.fill();
    ctx.rotate(Math.PI / 2);
  }
  return new THREE.CanvasTexture(c);
}

/** Soft irregular cloud blob for the nebula. */
export function cloudTexture(size = 256, seed = 1): THREE.CanvasTexture {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d')!;
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  // A pile of offset radial gradients reads as fog once layered and tinted.
  const blobs = 9;
  for (let i = 0; i < blobs; i++) {
    const bx = size * (0.28 + rnd() * 0.44);
    const by = size * (0.3 + rnd() * 0.4);
    const r = size * (0.14 + rnd() * 0.26);
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
    const a = 0.05 + rnd() * 0.1;
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(c);
}

/**
 * A distant galaxy: bright elliptical core wrapped in swept spiral haze.
 * Rendered white; tint comes from the sprite material so one texture can
 * serve several colours.
 */
export function galaxyTexture(size = 256, seed = 1): THREE.CanvasTexture {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d')!;
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };

  const cx = size / 2;
  ctx.translate(cx, cx);
  ctx.rotate(rnd() * Math.PI);
  // Squash it so most galaxies read as tilted discs rather than face-on.
  ctx.scale(1, 0.34 + rnd() * 0.5);

  // Spiral arms: wide, low-alpha strokes swept out from the core.
  const arms = 2 + Math.floor(rnd() * 2);
  for (let a = 0; a < arms; a++) {
    ctx.save();
    ctx.rotate((a / arms) * Math.PI * 2);
    ctx.beginPath();
    for (let k = 0; k <= 40; k++) {
      const t = k / 40;
      const ang = t * 2.5;
      const r = t * size * 0.46;
      const x = Math.cos(ang) * r;
      const y = Math.sin(ang) * r;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255,255,255,${0.05 + rnd() * 0.05})`;
    ctx.lineWidth = size * (0.07 + rnd() * 0.06);
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  // Halo, then core.
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.46);
  halo.addColorStop(0, 'rgba(255,255,255,0.3)');
  halo.addColorStop(0.35, 'rgba(255,255,255,0.09)');
  halo.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(-cx, -cx, size, size);

  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.13);
  core.addColorStop(0, 'rgba(255,255,255,0.85)');
  core.addColorStop(0.5, 'rgba(255,255,255,0.28)');
  core.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = core;
  ctx.fillRect(-cx, -cx, size, size);

  return new THREE.CanvasTexture(c);
}

/** The brand mark: square frame + oval + inner rule, echoing an ornate O. */
export function markTexture(size = 512, alpha = 1): THREE.CanvasTexture {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d')!;
  ctx.strokeStyle = `rgba(244,242,240,${alpha})`;
  ctx.lineWidth = size * 0.012;
  const m = size * 0.08;
  ctx.strokeRect(m, m, size - m * 2, size - m * 2);
  ctx.beginPath();
  ctx.ellipse(size / 2, size / 2, size * 0.26, size * 0.36, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(m, size * 0.5);
  ctx.lineTo(size - m, size * 0.5);
  ctx.globalAlpha = 0.45;
  ctx.stroke();
  return new THREE.CanvasTexture(c);
}

/** Eight-armed line star used on the case-study title slides. */
export function lineStarTexture(size = 512): THREE.CanvasTexture {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d')!;
  ctx.strokeStyle = 'rgba(240,238,232,0.9)';
  ctx.lineWidth = size * 0.004;
  ctx.translate(size / 2, size / 2);
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    const len = i % 2 === 0 ? size * 0.46 : size * 0.34;
    ctx.moveTo(0, -len);
    ctx.lineTo(0, len);
    ctx.stroke();
    ctx.rotate(Math.PI / 4);
  }
  return new THREE.CanvasTexture(c);
}
