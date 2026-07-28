import * as THREE from 'three';
import {
  BLOG,
  BLOG_HEAD,
  CASES,
  CASES_HEAD,
  CREDENTIALS,
  HALL,
  INTRO,
  MANIFESTO,
  NUMBERS,
  PITCH,
  PROFILE,
  STORY,
  TALK,
} from '../content';
import {
  BODY,
  DISPLAY,
  INK,
  INK_DIM,
  INK_FAINT,
  cloudTexture,
  galaxyTexture,
  lineStarTexture,
  markTexture,
  orbTexture,
  sparkleTexture,
  starTexture,
  textTexture,
  type BuiltTexture,
} from './textures';
import { PATH_LEN, READ_DIST, SECTION_COUNT, STATION_GAP, pathAt, stationAnchor, stationT } from './path';

/** Deep space: near-black with just enough cool cast to read as sky. */
const PAPER = 0x0b0a11;

/** Scenery extends past both ends of the camera track. */
const OVER_MIN = -0.06;
const OVER_MAX = 1.0 + (READ_DIST * 2.2) / PATH_LEN;

export interface FlightFrame {
  progress: number;
  velocity: number;
  time: number;
  dt: number;
  pointer: { x: number; y: number };
}

interface Twinkler {
  sprite: THREE.Sprite;
  base: number;
  speed: number;
  phase: number;
}

/**
 * The whole experience lives in this scene: a starfield flown straight
 * through, with every section's content mounted as textured planes along
 * the track, dungyov.com-style.
 */
export class Flight {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;

  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private clickables: THREE.Object3D[] = [];
  private hovering = false;

  private twinklers: Twinkler[] = [];
  /** Every section material, faded per-object by its own world z. */
  private fadeItems: {
    obj: THREE.Object3D;
    mat: THREE.Material & { opacity: number };
    base: number;
    z: number;
    tw?: { speed: number; phase: number };
  }[] = [];
  private fadeGroups: { group: THREE.Group; z: number }[] = [];
  private spinners: { obj: THREE.Object3D; speed: number }[] = [];

  private pos = new THREE.Vector3();
  private ahead = new THREE.Vector3();
  private ro?: ResizeObserver;
  private lastW = 0;
  private lastH = 0;
  private disposed = false;

  onCaseClick?: (index: number) => void;
  onEmailClick?: () => void;
  onPostClick?: (url: string) => void;

  constructor(container: HTMLElement) {
    this.container = container;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(PAPER, 1);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(PAPER, 0.006);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.4, 620);
    pathAt(0, this.pos);
    this.camera.position.copy(this.pos);

    this.buildStars();
    this.buildOrbs();
    this.buildSparkles();
    this.buildNebula();
    this.buildSections();
    this.scene.updateMatrixWorld(true);
    for (const fg of this.fadeGroups) this.registerFades(fg.group);

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);

    this.renderer.domElement.addEventListener('click', this.handleClick);
    window.addEventListener('pointermove', this.trackPointer, { passive: true });
  }

  /* ================================================== environment */

  private buildStars() {
    const isSmall = window.innerWidth < 720;
    const COUNT = isSmall ? 3200 : 6400;
    const position = new Float32Array(COUNT * 3);
    const scale = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    const color = new Float32Array(COUNT * 3);
    const p = new THREE.Vector3();

    // Cluster seeds: a third of the stars gather into loose clouds around
    // these, which is what separates a galaxy from uniform white noise.
    const CLUSTERS = 26;
    const seeds: [number, number, number][] = [];
    for (let k = 0; k < CLUSTERS; k++) {
      const t = OVER_MIN + Math.random() * (OVER_MAX - OVER_MIN);
      pathAt(Math.min(t, 1), p);
      const a = Math.random() * Math.PI * 2;
      const r = 14 + Math.random() * 40;
      seeds.push([p.x + Math.cos(a) * r, p.y + Math.sin(a) * r * 0.8, -t * PATH_LEN]);
    }

    for (let i = 0; i < COUNT; i++) {
      if (i % 3 === 0) {
        const [sx, sy, sz] = seeds[Math.floor(Math.random() * CLUSTERS)];
        const spread = 6 + Math.random() * 13;
        position[i * 3] = sx + (Math.random() - 0.5) * spread * 2;
        position[i * 3 + 1] = sy + (Math.random() - 0.5) * spread * 1.6;
        position[i * 3 + 2] = sz + (Math.random() - 0.5) * spread * 4;
      } else {
        const t = OVER_MIN + Math.random() * (OVER_MAX - OVER_MIN);
        pathAt(Math.min(t, 1), p);
        p.z = -t * PATH_LEN;
        const a = Math.random() * Math.PI * 2;
        const r = 3 + Math.pow(Math.random(), 0.55) * 56;
        position[i * 3] = p.x + Math.cos(a) * r * 1.25;
        position[i * 3 + 1] = p.y + Math.sin(a) * r * 0.8;
        position[i * 3 + 2] = p.z + (Math.random() - 0.5) * STATION_GAP;
      }

      scale[i] = Math.pow(Math.random(), 2.2) * 3 + 0.5;
      phase[i] = Math.random() * Math.PI * 2;

      // Faint stellar colour: mostly white, a few cool and a few warm.
      const hue = Math.random();
      if (hue < 0.16) color.set([0.72, 0.8, 1.0], i * 3);
      else if (hue < 0.28) color.set([1.0, 0.87, 0.74], i * 3);
      else color.set([1, 1, 1], i * 3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        attribute float aScale;
        attribute float aPhase;
        attribute vec3 aColor;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;
        varying vec3 vColor;

        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float dist = -mv.z;
          gl_PointSize = clamp(aScale * uPixelRatio * (60.0 / max(dist, 4.0)), 0.6, 26.0);
          gl_Position = projectionMatrix * mv;

          float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase * 0.25) + aPhase * 7.0);
          float near = smoothstep(2.0, 14.0, dist);
          float far = 1.0 - smoothstep(160.0, 330.0, dist);
          vAlpha = tw * near * far;
          vColor = aColor;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float core = smoothstep(0.42, 0.0, d);
          float halo = smoothstep(1.0, 0.2, d) * 0.28;
          float a = (core + halo) * vAlpha;
          if (a < 0.004) discard;
          // Cores burn toward white, haloes keep the star's colour.
          gl_FragColor = vec4(mix(vColor, vec3(1.0), core * 0.7), a);
        }
      `,
    });

    const stars = new THREE.Points(geo, mat);
    stars.frustumCulled = false;
    this.scene.add(stars);
    this.starMat = mat;
  }
  private starMat!: THREE.ShaderMaterial;

  /** A handful of big glowing orbs — the "planets" drifting past. */
  private buildOrbs() {
    const tex = orbTexture();
    const p = new THREE.Vector3();
    const N = 14;
    for (let i = 0; i < N; i++) {
      const t = OVER_MIN + ((i + 0.5) / N) * (OVER_MAX - OVER_MIN);
      pathAt(Math.min(t, 1), p);
      p.z = -t * PATH_LEN;
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      });
      const s = new THREE.Sprite(mat);
      const side = i % 2 === 0 ? 1 : -1;
      s.position.set(
        p.x + side * (13 + Math.sin(i * 3.7) * 9),
        p.y + Math.cos(i * 2.9) * 7,
        p.z - Math.sin(i * 5.1) * STATION_GAP * 0.35
      );
      const size = 3.2 + ((i * 37) % 10) * 0.55;
      s.scale.setScalar(size);
      this.scene.add(s);
      this.twinklers.push({ sprite: s, base: 0.85, speed: 0.35 + (i % 5) * 0.1, phase: i * 1.7 });
    }
  }

  /** Four-point sparkles that slowly twinkle. */
  private buildSparkles() {
    const tex = sparkleTexture();
    const p = new THREE.Vector3();
    const N = 26;
    for (let i = 0; i < N; i++) {
      const t = OVER_MIN + Math.random() * (OVER_MAX - OVER_MIN);
      pathAt(Math.min(t, 1), p);
      p.z = -t * PATH_LEN;
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const s = new THREE.Sprite(mat);
      s.position.set(
        p.x + (Math.random() - 0.5) * 34,
        p.y + (Math.random() - 0.5) * 22,
        p.z + (Math.random() - 0.5) * STATION_GAP
      );
      s.scale.setScalar(0.55 + Math.random() * 0.9);
      this.scene.add(s);
      this.twinklers.push({
        sprite: s,
        base: 0.75,
        speed: 0.5 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  /**
   * Deep-space colour: nebula clouds the whole way down, a hazy band running
   * alongside the track, distant galaxies, and the dense fog bank that the
   * finale sits inside.
   */
  private buildNebula() {
    const p = new THREE.Vector3();
    const clouds = [0, 1, 2, 3, 4].map((k) => cloudTexture(256, 17 + k * 137));
    // Barely-saturated deep-space tints — colour you feel more than see.
    const TINTS = [0x6b78a8, 0x8a7fb0, 0x5f8fa0, 0xa08698, 0x7d7f9c];

    const cloud = (
      t: number,
      opts: { w: number; h: number; x: number; y: number; alpha: number; tint?: number }
    ) => {
      pathAt(Math.min(t, 1), p);
      p.z = -t * PATH_LEN;
      const mat = new THREE.SpriteMaterial({
        map: clouds[Math.floor(Math.random() * clouds.length)],
        transparent: true,
        depthWrite: false,
        opacity: opts.alpha,
      });
      mat.color.setHex(opts.tint ?? TINTS[Math.floor(Math.random() * TINTS.length)]);
      const s = new THREE.Sprite(mat);
      s.position.set(p.x + opts.x, p.y + opts.y, p.z + (Math.random() - 0.5) * STATION_GAP * 0.7);
      s.scale.set(opts.w, opts.h, 1);
      this.scene.add(s);
      this.twinklers.push({
        sprite: s,
        base: opts.alpha,
        speed: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
      });
      return s;
    };

    // Drifting nebulae along the whole flight, held off-axis so they colour
    // the void without washing out the type in the middle of frame.
    for (let i = 0; i < 54; i++) {
      const t = OVER_MIN + Math.random() * (OVER_MAX - OVER_MIN);
      const side = Math.random() < 0.5 ? -1 : 1;
      cloud(t, {
        w: 44 + Math.random() * 50,
        h: 24 + Math.random() * 28,
        x: side * (24 + Math.random() * 38),
        y: (Math.random() - 0.5) * 46,
        alpha: 0.2 + Math.random() * 0.22,
      });
    }

    // A faint band of haze running roughly parallel to the track — the
    // galactic plane you are flying alongside.
    for (let i = 0; i < 16; i++) {
      const t = OVER_MIN + (i / 15) * (OVER_MAX - OVER_MIN);
      cloud(t, {
        w: 150 + Math.random() * 90,
        h: 32 + Math.random() * 24,
        x: (Math.random() - 0.5) * 30,
        y: -26 - Math.random() * 22,
        alpha: 0.14 + Math.random() * 0.12,
      });
    }

    // Distant galaxies, small and far off-axis.
    for (let i = 0; i < 7; i++) {
      const t = OVER_MIN + Math.random() * (OVER_MAX - OVER_MIN);
      pathAt(Math.min(t, 1), p);
      p.z = -t * PATH_LEN;
      const mat = new THREE.SpriteMaterial({
        map: galaxyTexture(256, 31 + i * 97),
        transparent: true,
        depthWrite: false,
        opacity: 0.6,
      });
      mat.color.setHex(TINTS[i % TINTS.length]);
      const s = new THREE.Sprite(mat);
      const side = i % 2 === 0 ? 1 : -1;
      s.position.set(
        p.x + side * (34 + Math.random() * 30),
        p.y + (Math.random() - 0.5) * 40,
        p.z + (Math.random() - 0.5) * STATION_GAP
      );
      s.scale.setScalar(16 + Math.random() * 20);
      this.scene.add(s);
      this.twinklers.push({
        sprite: s,
        base: 0.6,
        speed: 0.06 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // The finale fog bank: brighter, low, and close enough to sit behind the
    // closing type — plus a few pillars rising out of it.
    for (let i = 0; i < 26; i++) {
      const t = 0.84 + Math.random() * (OVER_MAX - 0.84);
      const pillar = i % 4 === 0;
      cloud(t, {
        w: pillar ? 14 + Math.random() * 10 : 34 + Math.random() * 30,
        h: pillar ? 26 + Math.random() * 16 : 12 + Math.random() * 9,
        x: (Math.random() - 0.5) * 46,
        y: -8 - Math.random() * 8 + (pillar ? 6 : 0),
        alpha: 0.28 + Math.random() * 0.2,
        tint: 0x9aa0b4,
      });
    }
  }

  /* ================================================== content helpers */

  private plane(built: BuiltTexture, opts: { opacity?: number } = {}): THREE.Mesh {
    const mat = new THREE.MeshBasicMaterial({
      map: built.texture,
      transparent: true,
      depthWrite: false,
      opacity: opts.opacity ?? 1,
      fog: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(built.w, built.h), mat);
    mesh.userData.w = built.w;
    mesh.userData.h = built.h;
    return mesh;
  }

  /** Mount a group at section `i`'s anchor, registered for distance fading. */
  private mount(i: number, group: THREE.Group) {
    const anchor = new THREE.Vector3();
    stationAnchor(i, anchor);
    group.position.copy(anchor);
    this.scene.add(group);
    this.fadeGroups.push({ group, z: anchor.z });
  }

  /**
   * Register every material under `root` for per-object distance fading.
   * Each element appears as the camera closes on *its own* depth and is cut
   * just before the camera crosses it, so deep-staggered children (cards,
   * the manifesto answer) behave independently of their group anchor.
   */
  private registerFades(root: THREE.Object3D) {
    const wp = new THREE.Vector3();
    root.updateWorldMatrix(true, true);
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as (THREE.Material & { opacity: number }) | undefined;
      if (!mat || Array.isArray(mat) || !('opacity' in mat)) return;
      child.getWorldPosition(wp);
      this.fadeItems.push({
        obj: child,
        mat,
        base: mat.opacity,
        z: wp.z,
        tw: child.userData.twinkle,
      });
    });
  }

  private buildSections() {
    this.buildIntro(0);
    this.buildPitch(1);
    this.buildHall(2);
    this.buildStory(3);
    this.buildNumbers(4);
    this.buildCases(5);
    this.buildCredentials(6);
    this.buildBlog(7);
    this.buildManifesto(8);
    this.buildTalk(9);
  }

  /** 08 — writing: dated post rows, clickable when a URL is set. */
  private buildBlog(i: number) {
    const g = new THREE.Group();

    const title = this.plane(
      textTexture({ text: BLOG_HEAD.title, font: BODY, size: 1.6, weight: 400, color: 'rgba(244,242,240,0.92)' })
    );
    title.position.set(0, 4.6, 0);
    g.add(title);

    const hasLinks = BLOG.some((b) => b.url);
    if (hasLinks) {
      const hint = this.plane(
        textTexture({ text: BLOG_HEAD.hint, font: BODY, size: 0.56, weight: 400, color: INK_FAINT, letterSpacing: 0.4 })
      );
      hint.position.set(0, 3.5, 0);
      g.add(hint);
    }

    // Build every row first, then lay the three columns out from the widest
    // title — otherwise a long headline runs straight into its tag.
    const rows = BLOG.map((post) => ({
      post,
      date: this.plane(
        textTexture({ text: post.date, font: BODY, size: 0.6, weight: 400, color: INK_FAINT, letterSpacing: 0.2 })
      ),
      label: this.plane(
        textTexture({ text: post.title, font: BODY, size: 0.95, weight: 300, color: 'rgba(244,242,240,0.88)' })
      ),
      tag: this.plane(
        textTexture({ text: post.tag, font: BODY, size: 0.48, weight: 400, color: INK_FAINT, letterSpacing: 0.26 })
      ),
    }));

    const w = (m: THREE.Mesh) => m.userData.w as number;
    const dateColW = Math.max(...rows.map((r) => w(r.date))) + 1.4;
    const titleColW = Math.max(...rows.map((r) => w(r.label)));
    const tagColW = Math.max(...rows.map((r) => w(r.tag)));
    const GAP = 1.8;

    const total = dateColW + titleColW + GAP + tagColW;
    const left = -total / 2;
    const titleX = left + dateColW;
    const tagX = titleX + titleColW + GAP;

    rows.forEach((r, k) => {
      const y = 1.6 - k * 1.9;
      const z = -k * 3;

      r.date.position.set(left + w(r.date) / 2, y, z);
      r.label.position.set(titleX + w(r.label) / 2, y, z);
      r.tag.position.set(tagX + w(r.tag) / 2, y, z);
      g.add(r.date, r.label, r.tag);

      // Only wire a hit-area when there is somewhere to go, so an unfilled
      // list never offers a pointer cursor that leads nowhere.
      if (r.post.url) {
        const hit = new THREE.Mesh(
          new THREE.PlaneGeometry(titleColW + 2, 1.6),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        hit.position.set(titleX + titleColW / 2, y, z - 0.01);
        hit.userData.postUrl = r.post.url;
        g.add(hit);
        this.clickables.push(hit);
      }
    });

    this.mount(i, g);
  }

  /** 01 — name block left, framed photo right. */
  private buildIntro(i: number) {
    const g = new THREE.Group();

    const first = this.plane(
      textTexture({ text: INTRO.first, font: DISPLAY, size: 3.05, weight: 900, outline: true, outlineWidth: 0.028 })
    );
    const last = this.plane(textTexture({ text: INTRO.last, font: DISPLAY, size: 3.15, weight: 900 }));
    const paren = this.plane(
      textTexture({ text: INTRO.paren, font: BODY, size: 0.95, weight: 500, color: INK_DIM, letterSpacing: 0.3 })
    );
    const roles = INTRO.roles.map((r) =>
      this.plane(
        textTexture({ text: `✦   ${r}`, font: BODY, size: 0.82, weight: 300, color: 'rgba(244,242,240,0.85)' })
      )
    );

    // The photo gets its own column to the right of the widest name line, so
    // a longer surname can never end up printed across the portrait.
    const PHOTO_SLOT_W = 6.4;
    const PHOTO_SLOT_H = 8.2;
    const GAP = 2.6;

    const nameW = Math.max(first.userData.w as number, last.userData.w as number);
    const totalW = nameW + GAP + PHOTO_SLOT_W;
    const leftX = -totalW / 2;
    const photoCx = leftX + nameW + GAP + PHOTO_SLOT_W / 2;

    const put = (mesh: THREE.Mesh, y: number, indent = 0) => {
      mesh.position.set(leftX + indent + (mesh.userData.w as number) / 2, y, 0);
      g.add(mesh);
    };

    put(first, 3.5);
    put(last, 0.7);
    put(paren, -1.7, 0.15);
    roles.forEach((row, k) => put(row, -3.5 - k * 1.32, 1.1));

    // Photo, grayscaled through canvas, inside a slightly offset thin frame.
    const img = new Image();
    img.onload = () => {
      if (this.disposed) return;
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d')!;
      ctx.filter = 'grayscale(1) contrast(1.04)';
      ctx.drawImage(img, 0, 0);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;

      // Fit inside the reserved slot whatever the asset's real proportions.
      const aspect = img.naturalWidth / img.naturalHeight || 1;
      let ph = PHOTO_SLOT_H;
      let pw = ph * aspect;
      if (pw > PHOTO_SLOT_W) {
        pw = PHOTO_SLOT_W;
        ph = pw / aspect;
      }

      const photo = new THREE.Mesh(
        new THREE.PlaneGeometry(pw, ph),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false })
      );
      photo.position.set(photoCx, 0.5, 0);
      g.add(photo);

      const fw = pw / 2 + 0.4;
      const fh = ph / 2 + 0.4;
      const frameGeo = new THREE.BufferGeometry();
      frameGeo.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          [-fw, -fh, 0, fw, -fh, 0, fw, -fh, 0, fw, fh, 0, fw, fh, 0, -fw, fh, 0, -fw, fh, 0, -fw, -fh, 0],
          3
        )
      );
      const frame = new THREE.LineSegments(
        frameGeo,
        new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.7, fog: false })
      );
      frame.position.set(photoCx + 0.15, 0.65, 0.01);
      g.add(frame);

      // Late additions register themselves for fading.
      this.scene.updateMatrixWorld(true);
      this.registerFades(photo);
      this.registerFades(frame);
    };
    img.src = PROFILE.photo;

    this.mount(i, g);
  }

  /** 02 — elevator pitch, centred, flanked by sparkles. */
  private buildPitch(i: number) {
    const g = new THREE.Group();

    const eyebrow = this.plane(
      textTexture({ text: PITCH.eyebrow, font: BODY, size: 0.68, weight: 400, color: INK_FAINT, letterSpacing: 0.42 })
    );
    eyebrow.position.set(0, 5.3, 0);
    g.add(eyebrow);

    const body = this.plane(
      textTexture({
        text: PITCH.lines,
        font: BODY,
        size: 1.68,
        weight: 300,
        color: 'rgba(244,242,240,0.92)',
        align: 'center',
        lineHeight: 1.32,
      })
    );
    body.position.set(0, 0.1, 0);
    g.add(body);

    const spark = sparkleTexture();
    for (const sx of [-14.5, 14.5]) {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: spark, transparent: true, depthWrite: false, opacity: 0.85 })
      );
      s.position.set(sx, 0.3, -2);
      s.scale.setScalar(1.1);
      s.userData.twinkle = { speed: 0.7, phase: sx };
      g.add(s);
    }

    this.mount(i, g);
  }

  /** 03 — wordmark cloud at scattered depths. */
  private buildHall(i: number) {
    const g = new THREE.Group();
    const seats: [number, number, number][] = [
      [-8.2, 0.9, 0],
      [7.8, 1.4, -4],
      [-0.6, -2.4, -8],
      [-10.4, -3.6, -14],
      [5.2, -4.2, -12],
      [2.2, -0.2, -18],
      [-5.4, 3.8, -22],
      [9.6, 3.4, -26],
      [-1.8, 1.8, -30],
    ];
    HALL.forEach((h, k) => {
      const seat = seats[k % seats.length];
      const depth = -seat[2] / 30;
      const alpha = 0.68 - depth * 0.26;
      const word = this.plane(
        textTexture({
          text: h.name,
          font: BODY,
          size: 2.1 * h.scale,
          weight: 500,
          color: `rgba(244,242,240,${alpha.toFixed(2)})`,
        })
      );
      word.position.set(seat[0], seat[1], seat[2]);
      g.add(word);
    });
    this.mount(i, g);
  }

  /** 04 — about-me bullets with rule and meta, plus a nearby orb. */
  private buildStory(i: number) {
    const g = new THREE.Group();

    const leftX = -5.6;

    const title = this.plane(
      textTexture({ text: STORY.title, font: BODY, size: 1.5, weight: 400, color: 'rgba(244,242,240,0.9)' })
    );
    const titleW = title.userData.w as number;
    title.position.set(leftX + titleW / 2, 3.1, 0);
    g.add(title);

    const rule = new THREE.Mesh(
      new THREE.PlaneGeometry(6.5, 0.02),
      new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.22, depthWrite: false, fog: false })
    );
    rule.position.set(leftX + titleW + 3.9, 2.85, 0);
    g.add(rule);

    STORY.bullets.forEach((b, k) => {
      const row = this.plane(
        textTexture({ text: `·   ${b}`, font: BODY, size: 0.78, weight: 300, color: 'rgba(244,242,240,0.7)' })
      );
      row.position.set(leftX + 0.2 + (row.userData.w as number) / 2, 1.5 - k * 1.06, 0);
      g.add(row);
    });

    const meta = this.plane(
      textTexture({ text: STORY.meta, font: BODY, size: 0.62, weight: 400, color: INK_FAINT, letterSpacing: 0.18 })
    );
    meta.position.set(leftX + 0.2 + (meta.userData.w as number) / 2, -4.7, 0);
    g.add(meta);

    const orb = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: orbTexture(), transparent: true, depthWrite: false, opacity: 0.9 })
    );
    orb.position.set(12.4, -4.6, -6);
    orb.scale.setScalar(5);
    orb.userData.twinkle = { speed: 0.3, phase: 2.2 };
    g.add(orb);

    this.mount(i, g);
  }

  /** 05 — giant outlined numerals with small captions, spread in depth. */
  private buildNumbers(i: number) {
    const g = new THREE.Group();

    const items = NUMBERS.filter((n) => !n.giant);
    const seats: [number, number, number][] = [
      [-8.6, 1.6, 0],
      [4.8, 2.4, -10],
      [-6.2, -3.4, -20],
      [7.2, -2.6, -30],
    ];

    items.forEach((item, k) => {
      const seat = seats[k % seats.length];
      const num = this.plane(
        textTexture({
          text: item.n,
          font: DISPLAY,
          size: 3.4 - k * 0.3,
          weight: 900,
          outline: true,
          outlineWidth: 0.026,
          color: 'rgba(244,242,240,0.85)',
        })
      );
      num.position.set(seat[0], seat[1], seat[2]);
      g.add(num);

      const cap = this.plane(
        textTexture({ text: item.caption, font: BODY, size: 0.72, weight: 300, color: INK_DIM })
      );
      const numW = num.userData.w as number;
      const capW = cap.userData.w as number;
      cap.position.set(seat[0] + numW / 2 + capW / 2 + 0.7, seat[1] - 1.1, seat[2]);
      g.add(cap);
    });

    // The giant one looms past the right edge as you fly through.
    const giant = NUMBERS.find((n) => n.giant);
    if (giant) {
      const num = this.plane(
        textTexture({
          text: giant.n.replace('+', ''),
          font: DISPLAY,
          size: 22,
          weight: 900,
          outline: true,
          outlineWidth: 0.02,
          color: 'rgba(244,242,240,0.8)',
        })
      );
      num.position.set(21, -1, -13);
      g.add(num);
      const cap = this.plane(
        textTexture({ text: giant.caption, font: BODY, size: 0.72, weight: 300, color: INK_DIM })
      );
      cap.position.set(12.5, -6.5, -12.9);
      g.add(cap);
    }

    this.mount(i, g);
  }

  /** 06 — experience as a click-to-expand case list. */
  private buildCases(i: number) {
    const g = new THREE.Group();

    const title = this.plane(
      textTexture({ text: CASES_HEAD.title, font: BODY, size: 1.6, weight: 400, color: 'rgba(244,242,240,0.92)' })
    );
    title.position.set(0, 4.6, 0);
    g.add(title);

    const hint = this.plane(
      textTexture({ text: CASES_HEAD.hint, font: BODY, size: 0.56, weight: 400, color: INK_FAINT, letterSpacing: 0.4 })
    );
    hint.position.set(0, 3.5, 0);
    g.add(hint);

    CASES.forEach((c, k) => {
      const y = 1.7 - k * 2.15;

      const num = this.plane(
        textTexture({
          text: `${k + 1}.`,
          font: DISPLAY,
          size: 1.35,
          weight: 900,
          outline: true,
          outlineWidth: 0.035,
          color: 'rgba(244,242,240,0.75)',
        })
      );
      num.position.set(-8.6, y, 0);
      g.add(num);

      const label = this.plane(
        textTexture({ text: c.title, font: BODY, size: 1.15, weight: 300, color: 'rgba(244,242,240,0.88)' })
      );
      const lw = label.userData.w as number;
      label.position.set(-6.6 + lw / 2, y, 0);
      label.userData.caseIndex = k;
      // A generous invisible hit-area behind the text keeps clicking easy.
      const hit = new THREE.Mesh(
        new THREE.PlaneGeometry(lw + 2.5, 1.9),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      );
      hit.position.copy(label.position);
      hit.position.z -= 0.01;
      hit.userData.caseIndex = k;
      g.add(label, hit);
      this.clickables.push(hit);
    });

    this.mount(i, g);
  }

  /** 07 — credential cards floating like the talks. */
  private buildCredentials(i: number) {
    const g = new THREE.Group();
    const star = lineStarTexture();

    CREDENTIALS.forEach((c, k) => {
      const card = new THREE.Group();
      const w = 10.5;
      const h = 5.9;

      const bg = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: 0x0b0a0a, transparent: true, opacity: 0.92, depthWrite: false, fog: false })
      );
      card.add(bg);

      const border = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h)),
        new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.3, fog: false })
      );
      border.position.z = 0.01;
      card.add(border);

      const deco = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: star, transparent: true, opacity: 0.5, depthWrite: false })
      );
      deco.position.set(w / 2 - 1.6, 0.4, 0.02);
      deco.scale.setScalar(3);
      card.add(deco);

      const code = this.plane(
        textTexture({ text: c.code, font: DISPLAY, size: 1.7, weight: 900, color: 'rgba(240,238,232,0.95)' })
      );
      const cw = code.userData.w as number;
      code.position.set(-w / 2 + 0.9 + cw / 2, -0.6, 0.02);
      card.add(code);

      const eyebrow = this.plane(
        textTexture({ text: c.meta, font: BODY, size: 0.42, weight: 400, color: INK_FAINT, letterSpacing: 0.3 })
      );
      const ew = eyebrow.userData.w as number;
      eyebrow.position.set(-w / 2 + 0.9 + ew / 2, 0.7, 0.02);
      card.add(eyebrow);

      const caption = this.plane(
        textTexture({ text: c.title, font: BODY, size: 0.66, weight: 300, color: 'rgba(244,242,240,0.8)' })
      );
      const capw = caption.userData.w as number;
      caption.position.set(-w / 2 + capw / 2, -h / 2 - 0.85, 0.02);
      card.add(caption);

      const side = k % 2 === 0 ? -1 : 1;
      card.position.set(side * (3.4 + (k % 3) * 1.2), (k % 3) * 1.8 - 1.6, -k * 12);
      card.rotation.y = side * -0.06;
      g.add(card);
    });

    this.mount(i, g);
  }

  /** 08 — question deep in space, answer by the nebula. */
  private buildManifesto(i: number) {
    const g = new THREE.Group();

    const q = this.plane(
      textTexture({
        text: MANIFESTO.question,
        font: BODY,
        size: 1.6,
        weight: 300,
        color: 'rgba(244,242,240,0.9)',
        align: 'center',
        lineHeight: 1.35,
      })
    );
    q.position.set(0, 0.6, 0);
    g.add(q);

    const spark = sparkleTexture();
    for (const sx of [-16, 16]) {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: spark, transparent: true, depthWrite: false, opacity: 0.9 })
      );
      s.position.set(sx, 0.2, -1);
      s.scale.setScalar(1.35);
      s.userData.twinkle = { speed: 0.6, phase: sx * 0.3 };
      g.add(s);
    }

    const a = this.plane(
      textTexture({
        text: MANIFESTO.answer,
        font: BODY,
        size: 1.45,
        weight: 300,
        color: 'rgba(244,242,240,0.88)',
        align: 'center',
        lineHeight: 1.35,
      })
    );
    a.position.set(0.4, -0.4, -STATION_GAP * 0.52);
    g.add(a);

    this.mount(i, g);
  }

  /** 09 — the LET'S TALK finale with watermark mark and email. */
  private buildTalk(i: number) {
    const g = new THREE.Group();

    const mark = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: markTexture(512, 0.28), transparent: true, depthWrite: false, opacity: 0.9 })
    );
    mark.position.set(0, 0.6, -3);
    mark.scale.setScalar(13);
    g.add(mark);

    const title = this.plane(
      textTexture({ text: TALK.title, font: DISPLAY, size: 3.9, weight: 900, color: 'rgba(244,242,240,0.97)' })
    );
    title.position.set(0, 1.6, 0);
    g.add(title);

    const email = this.plane(
      textTexture({ text: TALK.email, font: BODY, size: 1.05, weight: 300, color: 'rgba(244,242,240,0.6)' })
    );
    email.position.set(0, -1.5, 0);
    g.add(email);
    const ew = email.userData.w as number;
    const rule = new THREE.Mesh(
      new THREE.PlaneGeometry(ew + 1.6, 0.02),
      new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.3, depthWrite: false, fog: false })
    );
    rule.position.set(0, -2.15, 0);
    g.add(rule);
    const hit = new THREE.Mesh(
      new THREE.PlaneGeometry(ew + 2, 1.8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    hit.position.copy(email.position);
    hit.userData.email = true;
    g.add(hit);
    this.clickables.push(hit);

    const meta = this.plane(
      textTexture({ text: TALK.meta, font: BODY, size: 0.58, weight: 400, color: INK_FAINT, letterSpacing: 0.4 })
    );
    meta.position.set(0, -3.6, 0);
    g.add(meta);

    const name = this.plane(
      textTexture({ text: TALK.name, font: DISPLAY, size: 1.25, weight: 700, color: 'rgba(244,242,240,0.65)', letterSpacing: 0.06 })
    );
    name.position.set(0, -4.75, 0);
    g.add(name);

    this.mount(i, g);
  }

  /* ================================================== interaction */

  private trackPointer = (e: PointerEvent) => {
    this.ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.clickables, false);
    const hovering = hits.length > 0 && this.groupOpacityAt(hits[0].object) > 0.35;
    if (hovering !== this.hovering) {
      this.hovering = hovering;
      this.renderer.domElement.style.cursor = hovering ? 'pointer' : '';
    }
  };

  private handleClick = () => {
    if (!this.hovering) return;
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.clickables, false);
    if (!hits.length) return;
    const data = hits[0].object.userData;
    if (typeof data.caseIndex === 'number') this.onCaseClick?.(data.caseIndex);
    else if (typeof data.postUrl === 'string') this.onPostClick?.(data.postUrl);
    else if (data.email) this.onEmailClick?.();
  };

  /** Opacity of the fade-group an object belongs to (0 when far away). */
  private groupOpacityAt(obj: THREE.Object3D): number {
    let p: THREE.Object3D | null = obj;
    while (p) {
      const found = this.fadeGroups.find((f) => f.group === p);
      if (found) {
        const dz = this.camera.position.z - found.z;
        const appear = 1 - Math.min(1, Math.max(0, (dz - READ_DIST) / (STATION_GAP * 0.8)));
        const vanish = Math.min(1, Math.max(0, (dz - 1.5) / 5));
        return appear * vanish;
      }
      p = p.parent;
    }
    return 1;
  }

  /* ================================================== frame loop */

  update(f: FlightFrame) {
    const { progress, time, dt, pointer } = f;

    if (this.container.clientWidth !== this.lastW || this.container.clientHeight !== this.lastH) {
      this.resize();
    }

    pathAt(progress, this.pos);
    pathAt(Math.min(progress + 0.01, 1.02), this.ahead);

    this.camera.position.set(this.pos.x + pointer.x * 0.9, this.pos.y - pointer.y * 0.7, this.pos.z);
    this.camera.lookAt(this.ahead.x + pointer.x * 2.2, this.ahead.y - pointer.y * 1.8, this.ahead.z);

    this.starMat.uniforms.uTime.value = time;

    const camZ = this.camera.position.z;

    // Environment sprites twinkle, and cut out as the camera crosses them
    // so nothing smears across the lens.
    for (const t of this.twinklers) {
      const dz = camZ - t.sprite.position.z;
      const vanish = Math.min(1, Math.max(0, (dz - 1) / 6));
      t.sprite.material.opacity =
        t.base * (0.6 + 0.4 * Math.sin(time * t.speed + t.phase)) * vanish;
    }
    for (const s of this.spinners) s.obj.rotation.z += s.speed * dt;

    // Section content: each element materialises as the camera closes on its
    // own depth — readable at READ_DIST — and is cut just before impact.
    for (const it of this.fadeItems) {
      const dz = camZ - it.z;
      const appear = 1 - Math.min(1, Math.max(0, (dz - READ_DIST) / (STATION_GAP * 0.8)));
      const vanish = Math.min(1, Math.max(0, (dz - 1.5) / 5));
      let o = appear * vanish * it.base;
      if (it.tw) o *= 0.6 + 0.4 * Math.sin(time * it.tw.speed + it.tw.phase);
      it.mat.opacity = o;
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    if (!w || !h) return;
    this.lastW = this.container.clientWidth;
    this.lastH = this.container.clientHeight;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;

    // Landscape keeps the reference 60-degree vertical fov. Portrait holds
    // the horizontal fov steady instead (capped against fisheye) and shrinks
    // the content a step, so wide compositions still fit a phone.
    const halfH = (46 * Math.PI) / 180;
    this.camera.fov =
      aspect >= 1.15
        ? 60
        : Math.min(92, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(halfH) / aspect)));
    this.camera.updateProjectionMatrix();

    const scale = aspect < 0.9 ? 0.85 : 1;
    let changed = false;
    for (const fg of this.fadeGroups) {
      if (fg.group.scale.x !== scale) {
        fg.group.scale.setScalar(scale);
        changed = true;
      }
    }
    if (changed) {
      this.scene.updateMatrixWorld(true);
      const wp = new THREE.Vector3();
      for (const it of this.fadeItems) it.z = it.obj.getWorldPosition(wp).z;
    }
  }

  dispose() {
    this.disposed = true;
    this.ro?.disconnect();
    this.renderer.domElement.removeEventListener('click', this.handleClick);
    window.removeEventListener('pointermove', this.trackPointer);
    this.scene.traverse((o) => {
      const any = o as THREE.Mesh;
      any.geometry?.dispose?.();
      const m = any.material as (THREE.Material & { map?: THREE.Texture }) | THREE.Material[] | undefined;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else if (m) {
        m.map?.dispose?.();
        m.dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

export { SECTION_COUNT, stationT };
