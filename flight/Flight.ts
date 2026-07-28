import * as THREE from 'three';
import { PATH_LEN, START_Z, pathAt, stationHalfWindow, stationT, structureT } from './path';

const PAPER = 0x121010;
const INK = 0xf4f2f0;

/** Scenery is built a little before the start and well past the finish. */
const OVERSHOOT_MIN = -0.04;
const OVERSHOOT_MAX = 1.16;

export interface FlightFrame {
  progress: number;
  velocity: number;
  time: number;
  dt: number;
  pointer: { x: number; y: number };
}

/**
 * The WebGL layer: a corridor of HUD brackets, drifting dust, velocity
 * streaks and one wireframe structure per section that the camera flies
 * straight through.
 */
export class Flight {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private sectionCount: number;

  private dust!: THREE.Points;
  private dustMat!: THREE.ShaderMaterial;
  private streaks!: THREE.LineSegments;
  private streakMat!: THREE.ShaderMaterial;
  private gates!: THREE.LineSegments;
  private stations: THREE.Group[] = [];

  private pos = new THREE.Vector3();
  private look = new THREE.Vector3();
  private prevX = 0;
  private roll = 0;
  private ro?: ResizeObserver;
  private lastW = 0;
  private lastH = 0;

  constructor(container: HTMLElement, sectionCount: number) {
    this.container = container;
    this.sectionCount = sectionCount;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(PAPER, 1);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(PAPER, 0.0085);

    this.camera = new THREE.PerspectiveCamera(64, 1, 0.1, 600);
    pathAt(0, this.pos);
    this.camera.position.copy(this.pos);

    this.buildGates();
    this.buildDust();
    this.buildStreaks();
    this.buildStations();

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
  }

  /* ---------------------------------------------------------- geometry */

  /** Corner brackets strung along the track — the corridor you fly down. */
  private buildGates() {
    const COUNT = 330;
    const positions: number[] = [];
    const colors: number[] = [];

    const p = new THREE.Vector3();
    const next = new THREE.Vector3();
    const dummy = new THREE.Object3D();
    const v = new THREE.Vector3();
    const ink = new THREE.Color(INK);

    for (let i = 0; i < COUNT; i++) {
      // Overshoots both ends of the track so the corridor still stretches
      // ahead when the last panel lands, instead of dropping into a void.
      const t = OVERSHOOT_MIN + (i / (COUNT - 1)) * (OVERSHOOT_MAX - OVERSHOOT_MIN);
      pathAt(t, p);
      pathAt(t + 0.004, next);

      dummy.position.copy(p);
      dummy.lookAt(next);
      dummy.rotation.z = t * 26 + Math.sin(t * 12) * 0.6;
      dummy.updateMatrix();

      // Brackets breathe in size, and open up at each station.
      const nearStation = this.stationProximity(t);
      const size = 12 + Math.sin(t * 47) * 2.2 + nearStation * 7;
      const arm = size * (0.2 + Math.sin(t * 31) * 0.05);
      const bright = 0.14 + nearStation * 0.34 + (i % 8 === 0 ? 0.15 : 0);

      for (const [sx, sy] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ] as const) {
        const cx = sx * size;
        const cy = sy * size;
        const seg: [number, number, number][][] = [
          [
            [cx, cy, 0],
            [cx - sx * arm, cy, 0],
          ],
          [
            [cx, cy, 0],
            [cx, cy - sy * arm, 0],
          ],
        ];
        for (const [a, b] of seg) {
          for (const pt of [a, b]) {
            v.set(pt[0], pt[1], pt[2]).applyMatrix4(dummy.matrix);
            positions.push(v.x, v.y, v.z);
            colors.push(ink.r * bright, ink.g * bright, ink.b * bright);
          }
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    this.gates = new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 })
    );
    this.scene.add(this.gates);
  }

  /** 0..1 — how close `t` sits to the nearest section station. */
  private stationProximity(t: number) {
    let best = 1;
    for (let i = 0; i < this.sectionCount; i++) {
      best = Math.min(best, Math.abs(t - stationT(i, this.sectionCount)));
    }
    return Math.max(0, 1 - best / stationHalfWindow(this.sectionCount));
  }

  /** Slow-drifting motes filling the tube around the track. */
  private buildDust() {
    const COUNT = 8000;
    const position = new Float32Array(COUNT * 3);
    const scale = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    const p = new THREE.Vector3();

    for (let i = 0; i < COUNT; i++) {
      const t = OVERSHOOT_MIN + Math.random() * (OVERSHOOT_MAX - OVERSHOOT_MIN);
      pathAt(t, p);
      const a = Math.random() * Math.PI * 2;
      const r = 4 + Math.pow(Math.random(), 0.6) * 44;
      position[i * 3] = p.x + Math.cos(a) * r;
      position[i * 3 + 1] = p.y + Math.sin(a) * r * 0.7;
      position[i * 3 + 2] = p.z + (Math.random() - 0.5) * 24;
      scale[i] = 0.5 + Math.random() * 1.5;
      phase[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));

    this.dustMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(INK) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        attribute float aScale;
        attribute float aPhase;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;

        void main() {
          vec3 p = position;
          p.x += sin(uTime * 0.22 + aPhase) * 0.7;
          p.y += cos(uTime * 0.18 + aPhase * 1.7) * 0.7;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float dist = -mv.z;
          // Capped hard: without this the motes nearest the camera blow up
          // into bokeh blobs and swallow the scene.
          gl_PointSize = clamp(
            aScale * uPixelRatio * (46.0 / max(dist, 6.0)),
            0.5,
            3.6 * uPixelRatio
          );
          gl_Position = projectionMatrix * mv;

          float twinkle = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.5 + aPhase * 3.0));
          float near = smoothstep(8.0, 42.0, dist);
          float far = 1.0 - smoothstep(180.0, 400.0, dist);
          vAlpha = twinkle * near * far;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.1, d) * vAlpha * 0.85;
          gl_FragColor = vec4(uColor, a);
        }
      `,
    });

    this.dust = new THREE.Points(geo, this.dustMat);
    this.dust.frustumCulled = false;
    this.scene.add(this.dust);
  }

  /** Short dashes that stretch into light-streaks the faster you scroll. */
  private buildStreaks() {
    const COUNT = 900;
    const position = new Float32Array(COUNT * 2 * 3);
    const side = new Float32Array(COUNT * 2);
    const seed = new Float32Array(COUNT * 2);
    const p = new THREE.Vector3();

    for (let i = 0; i < COUNT; i++) {
      const t = OVERSHOOT_MIN + Math.random() * (OVERSHOOT_MAX - OVERSHOOT_MIN);
      pathAt(t, p);
      const a = Math.random() * Math.PI * 2;
      const r = 6 + Math.pow(Math.random(), 0.7) * 30;
      const x = p.x + Math.cos(a) * r;
      const y = p.y + Math.sin(a) * r * 0.75;
      const z = p.z + (Math.random() - 0.5) * 20;
      const s = Math.random();

      for (let v = 0; v < 2; v++) {
        position[(i * 2 + v) * 3] = x;
        position[(i * 2 + v) * 3 + 1] = y;
        position[(i * 2 + v) * 3 + 2] = z;
        side[i * 2 + v] = v;
        seed[i * 2 + v] = s;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('aSide', new THREE.BufferAttribute(side, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

    this.streakMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uStretch: { value: 0 },
        uColor: { value: new THREE.Color(INK) },
      },
      vertexShader: /* glsl */ `
        attribute float aSide;
        attribute float aSeed;
        uniform float uStretch;
        varying float vAlpha;

        void main() {
          vec3 p = position;
          p.z += aSide * (0.6 + uStretch * (14.0 + aSeed * 26.0));

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float dist = -mv.z;
          gl_Position = projectionMatrix * mv;

          float near = smoothstep(3.0, 22.0, dist);
          float far = 1.0 - smoothstep(90.0, 240.0, dist);
          vAlpha = near * far * uStretch * (0.35 + aSeed * 0.65);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(uColor, vAlpha * 0.55);
        }
      `,
    });

    this.streaks = new THREE.LineSegments(geo, this.streakMat);
    this.streaks.frustumCulled = false;
    this.scene.add(this.streaks);
  }

  /** One wireframe structure per section, sitting on the track. */
  private buildStations() {
    const geos: THREE.BufferGeometry[] = [
      new THREE.IcosahedronGeometry(19, 1),
      new THREE.TorusGeometry(20, 5.5, 8, 26),
      new THREE.OctahedronGeometry(21, 1),
      new THREE.TorusKnotGeometry(15, 3.2, 90, 8),
      new THREE.DodecahedronGeometry(20, 0),
      new THREE.BoxGeometry(28, 28, 28, 2, 2, 2),
      new THREE.CylinderGeometry(19, 19, 34, 14, 2, true),
      new THREE.SphereGeometry(20, 16, 10),
    ];

    const p = new THREE.Vector3();
    const ahead = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const right = new THREE.Vector3();
    const UP = new THREE.Vector3(0, 1, 0);

    // One per gap between sections, plus a trailing one past the finish so
    // there is still something ahead when the last panel lands.
    for (let i = 0; i < this.sectionCount; i++) {
      const t = structureT(i, this.sectionCount);
      pathAt(t, p);
      pathAt(t + 0.004, ahead);
      tangent.subVectors(ahead, p).normalize();
      right.crossVectors(tangent, UP).normalize();

      // Pushed off the track, alternating sides, so the camera flies past
      // rather than through. Keeps the middle of frame clear for the text.
      const side = i % 2 === 0 ? 1 : -1;
      const lateral = 52 + (i % 3) * 7;
      const lift = ((i % 4) - 1.5) * 11;

      const group = new THREE.Group();
      group.position.copy(p).addScaledVector(right, side * lateral).addScaledVector(UP, lift);

      const src = geos[i % geos.length];
      const core = new THREE.LineSegments(
        new THREE.WireframeGeometry(src),
        new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0 })
      );
      core.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      group.add(core);

      // Outer reticle: a clean ring with ticks stepping outward from it.
      const ticks: number[] = [];
      const R = 22;

      const SEGS = 160;
      for (let k = 0; k < SEGS; k++) {
        const a0 = (k / SEGS) * Math.PI * 2;
        const a1 = ((k + 1) / SEGS) * Math.PI * 2;
        ticks.push(Math.cos(a0) * R, Math.sin(a0) * R, 0);
        ticks.push(Math.cos(a1) * R, Math.sin(a1) * R, 0);
      }

      const TICKS = 48;
      for (let k = 0; k < TICKS; k++) {
        const a = (k / TICKS) * Math.PI * 2;
        const r1 = R + (k % 6 === 0 ? 4.2 : 1.8);
        ticks.push(Math.cos(a) * R, Math.sin(a) * R, 0);
        ticks.push(Math.cos(a) * r1, Math.sin(a) * r1, 0);
      }

      const tickGeo = new THREE.BufferGeometry();
      tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3));
      const reticle = new THREE.LineSegments(
        tickGeo,
        new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0 })
      );
      group.add(reticle);

      group.userData = { core, reticle, t };
      this.stations.push(group);
      this.scene.add(group);
    }

    geos.forEach((g) => g.dispose());
  }

  /* ------------------------------------------------------------ runtime */

  update(f: FlightFrame) {
    const { progress, velocity, time, dt, pointer } = f;

    // The stylesheet can land after mount, and ResizeObserver is throttled
    // with the rest of the pipeline while the tab is hidden. Reconcile here
    // so the drawing buffer can never be left stale.
    if (
      this.container.clientWidth !== this.lastW ||
      this.container.clientHeight !== this.lastH
    ) {
      this.resize();
    }

    // Camera rides the track, aimed a little further down it.
    pathAt(progress, this.pos);
    pathAt(Math.min(progress + 0.008, 1.0001), this.look);

    const drift = 0.55;
    this.camera.position.set(
      this.pos.x + pointer.x * drift,
      this.pos.y - pointer.y * drift,
      this.pos.z
    );
    this.camera.lookAt(
      this.look.x + pointer.x * 2.4,
      this.look.y - pointer.y * 2.4,
      this.look.z
    );

    // Bank into the turns.
    const dx = this.pos.x - this.prevX;
    this.prevX = this.pos.x;
    const targetRoll = THREE.MathUtils.clamp(-dx * 0.55, -0.32, 0.32);
    this.roll += (targetRoll - this.roll) * Math.min(1, dt * 3);
    this.camera.rotateZ(this.roll + Math.sin(time * 0.35) * 0.012);

    const speed = Math.min(1, Math.abs(velocity) * 190);
    this.camera.fov = 64 + speed * 11;
    this.camera.updateProjectionMatrix();

    this.dustMat.uniforms.uTime.value = time;
    this.streakMat.uniforms.uStretch.value = speed;

    // The scene breathes with the reading rhythm: it settles down while a
    // panel is on screen so the type stays legible, and opens back up in the
    // gaps between sections where the flight is the only thing to look at.
    const calm = this.stationProximity(progress);
    const energy = 1 - calm * 0.62;
    (this.gates.material as THREE.LineBasicMaterial).opacity = 0.25 + 0.65 * energy;

    // Stations spin, and fade in as the camera closes on them.
    for (const g of this.stations) {
      const { core, reticle } = g.userData as {
        core: THREE.LineSegments;
        reticle: THREE.LineSegments;
      };
      core.rotation.x += dt * 0.06;
      core.rotation.y += dt * 0.085;
      reticle.rotation.z += dt * 0.12;

      const dist = this.camera.position.distanceTo(g.position);
      // Brightest on approach, thinned out while passing through so it never
      // fights the text sitting on top of it.
      const approach = 1 - THREE.MathUtils.smoothstep(dist, 70, 340);
      const inside = THREE.MathUtils.smoothstep(dist, 6, 60);
      const vis = approach * (0.22 + 0.78 * inside) * energy;
      (core.material as THREE.LineBasicMaterial).opacity = vis * 0.42;
      (reticle.material as THREE.LineBasicMaterial).opacity = vis * 0.62;
      reticle.lookAt(this.camera.position);
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
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.ro?.disconnect();
    this.scene.traverse((o) => {
      const any = o as THREE.Mesh;
      any.geometry?.dispose?.();
      const m = any.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m?.dispose?.();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

export { PATH_LEN, START_Z };
