import * as THREE from 'three';
import { MOBILE, COARSE } from '../modules/env.js';

/*
  Morphing shader-particle field.
  Cycle: network sphere (+ orbital rings) → "AnGrY" → padlock.
  Particles assemble from scatter on load, twinkle continuously,
  dissolve as the hero scrolls away, and repel from the cursor in 3D.
*/
export async function initHeroParticles() {
  await document.fonts.ready.catch(() => {});

  const canvas = document.getElementById('hero-canvas');
  const hero = document.getElementById('hero');
  const N = MOBILE ? 2600 : 6000;

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: false, powerPreference: 'high-performance',
  });
  const DPR = Math.min(devicePixelRatio, MOBILE ? 1.5 : 2);
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 2000);
  camera.position.z = 340;

  const R = MOBILE ? 105 : 135;

  /* ── shape targets ── */

  /* fibonacci sphere with two tilted orbital rings — a network globe */
  function networkSphere(n, r) {
    const a = new Float32Array(n * 3);
    const ringN = Math.floor(n * 0.16);
    const sphereN = n - ringN;
    for (let i = 0; i < sphereN; i++) {
      const y = 1 - (i / (sphereN - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = i * 2.39996323;
      a[i * 3] = Math.cos(th) * rad * r;
      a[i * 3 + 1] = y * r;
      a[i * 3 + 2] = Math.sin(th) * rad * r;
    }
    for (let i = 0; i < ringN; i++) {
      const k = sphereN + i;
      const second = i % 2 === 0;
      const rr = r * (second ? 1.45 : 1.62);
      const tilt = second ? 0.5 : -0.32;
      const t = Math.random() * Math.PI * 2;
      const x = Math.cos(t) * rr;
      const z = Math.sin(t) * rr;
      a[k * 3] = x;
      a[k * 3 + 1] = z * Math.sin(tilt) + (Math.random() - 0.5) * 3;
      a[k * 3 + 2] = z * Math.cos(tilt);
    }
    return a;
  }

  /* sample any 2D canvas drawing into particle positions */
  function sampleCanvas(draw, n, scale) {
    const c = document.createElement('canvas');
    c.width = 900; c.height = 600;
    const x = c.getContext('2d');
    x.fillStyle = '#fff';
    x.strokeStyle = '#fff';
    draw(x, c.width, c.height);
    const data = x.getImageData(0, 0, c.width, c.height).data;
    const pts = [];
    for (let py = 0; py < c.height; py += 3) {
      for (let px = 0; px < c.width; px += 3) {
        if (data[(py * c.width + px) * 4 + 3] > 128) pts.push([px, py]);
      }
    }
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const p = pts[(Math.random() * pts.length) | 0] || [450, 300];
      a[i * 3] = (p[0] - 450) * scale + (Math.random() - 0.5) * 2;
      a[i * 3 + 1] = -(p[1] - 300) * scale + (Math.random() - 0.5) * 2;
      a[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return a;
  }

  const textShape = (n) =>
    sampleCanvas((x) => {
      x.font = '700 190px "Clash Display", "Arial Black", sans-serif';
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText('AnGrY', 450, 300);
    }, n, MOBILE ? 0.42 : 0.52);

  const padlockShape = (n) =>
    sampleCanvas((x) => {
      // shackle
      x.lineWidth = 44;
      x.beginPath();
      x.arc(450, 250, 115, Math.PI, Math.PI * 2);
      x.stroke();
      // body
      if (typeof x.roundRect === 'function') {
        x.beginPath();
        x.roundRect(295, 250, 310, 240, 34);
        x.fill();
      } else {
        x.fillRect(295, 250, 310, 240);
      }
      // keyhole cutout
      x.globalCompositeOperation = 'destination-out';
      x.beginPath();
      x.arc(450, 340, 36, 0, Math.PI * 2);
      x.fill();
      x.fillRect(434, 340, 32, 90);
      x.globalCompositeOperation = 'source-over';
    }, n, MOBILE ? 0.4 : 0.5);

  const targets = [networkSphere(N, R), textShape(N), padlockShape(N)];

  /* ── geometry + attributes ── */
  const pos = new Float32Array(targets[0]);
  const aColor = new Float32Array(N * 3);
  const aSize = new Float32Array(N);
  const aSeed = new Float32Array(N);
  const cA = new THREE.Color(0xc6ff4a);
  const cB = new THREE.Color(0xeceee5);
  for (let i = 0; i < N; i++) {
    const m = Math.random();
    const c = cA.clone().lerp(cB, m * m * 0.6);
    aColor[i * 3] = c.r; aColor[i * 3 + 1] = c.g; aColor[i * 3 + 2] = c.b;
    aSize[i] = 0.7 + Math.random();
    aSeed[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));

  /* per-point displacement from cursor repulsion (decays back) */
  const offs = new Float32Array(N * 3);

  /* ── shader material: soft core + halo, twinkle, scatter dissolve ── */
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uScatter: { value: 1 },
      uDpr: { value: DPR },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aSeed;
      uniform float uTime;
      uniform float uScatter;
      uniform float uDpr;
      varying vec3 vColor;
      varying float vTw;
      void main() {
        vColor = aColor;
        vec3 p = position * (1.0 + uScatter * (0.6 + aSeed * 1.1));
        p.y += uScatter * (aSeed - 0.5) * 120.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float tw = 0.72 + 0.38 * sin(uTime * 2.1 + aSeed * 43.0);
        vTw = tw;
        gl_PointSize = aSize * tw * uDpr * (300.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vTw;
      uniform float uScatter;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float core = smoothstep(0.42, 0.1, d);
        float halo = smoothstep(0.5, 0.0, d) * 0.4;
        float a = (core + halo) * vTw * (1.0 - uScatter * 0.9);
        if (a < 0.003) discard;
        gl_FragColor = vec4(vColor, a);
      }`,
  });

  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  /* ── sizing ── */
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  /* ── mouse parallax ── */
  let tx = 0, ty = 0, px = 0, py = 0;
  if (!COARSE) {
    addEventListener('mousemove', (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  let inView = true;
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0 }).observe(hero);

  /* ── morph state machine ── */
  let from = 0, to = 0, morphT = 1, holdT = 2.8;
  const HOLD = 3.6, MORPH = 2.0;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smooth = (t) => t * t * (3 - 2 * t);

  const clock = new THREE.Clock();
  let elapsed = 0;
  (function tick() {
    requestAnimationFrame(tick);
    if (!inView || document.hidden) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;

    if (morphT >= 1) {
      holdT -= dt;
      if (holdT <= 0) {
        from = to;
        to = (to + 1) % targets.length;
        morphT = 0;
        holdT = HOLD;
      }
    } else {
      morphT = Math.min(morphT + dt / MORPH, 1);
    }

    const e = ease(morphT);
    const A = targets[from], B = targets[to];
    const p = geo.attributes.position.array;
    const wob = Math.sin(elapsed * 1.1) * 0.5;
    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      p[i3] = A[i3] + (B[i3] - A[i3]) * e + Math.sin(elapsed * 1.4 + i * 0.13) * 0.7;
      p[i3 + 1] = A[i3 + 1] + (B[i3 + 1] - A[i3 + 1]) * e + Math.cos(elapsed * 1.2 + i * 0.17) * 0.7 + wob;
      p[i3 + 2] = A[i3 + 2] + (B[i3 + 2] - A[i3 + 2]) * e;
    }

    /* cursor repulsion: push nearby points away, then let them spring back */
    if (!COARSE) {
      const halfH = Math.tan((50 * Math.PI) / 360) * 340;
      const halfW = halfH * camera.aspect;
      const rot = -group.rotation.y;
      const wx = tx * halfW, wy = -ty * halfH;
      const lmx = wx * Math.cos(rot);
      const lmz = wx * Math.sin(rot);
      const RAD = 60, RAD2 = RAD * RAD, STR = 3.2;
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        offs[i3] *= 0.88; offs[i3 + 1] *= 0.88; offs[i3 + 2] *= 0.88;
        const dx = p[i3] - lmx, dy = p[i3 + 1] - wy, dz = p[i3 + 2] - lmz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < RAD2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = ((RAD - d) / RAD) * STR;
          offs[i3] += (dx / d) * f;
          offs[i3 + 1] += (dy / d) * f;
          offs[i3 + 2] += (dz / d) * f;
        }
        p[i3] += offs[i3];
        p[i3 + 1] += offs[i3 + 1];
        p[i3 + 2] += offs[i3 + 2];
      }
    }
    geo.attributes.position.needsUpdate = true;

    /* flat shapes (text, padlock) face the camera; the globe rotates */
    if (to === 0) {
      group.rotation.y += dt * 0.16;
      group.rotation.x = Math.sin(elapsed * 0.18) * 0.12;
    } else {
      group.rotation.y = ((group.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
      group.rotation.y *= 0.93;
      group.rotation.x *= 0.93;
    }

    /* scatter: assemble on load, dissolve on scroll-out */
    const introScatter = 1 - Math.min(Math.max((elapsed - 1.4) / 1.7, 0), 1);
    const scrollScatter = Math.min(scrollY / (hero.clientHeight * 0.85), 1) * 1.1;
    mat.uniforms.uScatter.value = Math.min(Math.max(smooth(introScatter), scrollScatter), 1);
    mat.uniforms.uTime.value = elapsed;

    px += (tx - px) * 0.04;
    py += (ty - py) * 0.04;
    camera.position.x = px * 34;
    camera.position.y = -py * 24;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  })();
}
