import * as THREE from 'three';

/** World length of the whole flight, in scene units. */
export const PATH_LEN = 880;
export const START_Z = 40;

/**
 * The camera track. `t` runs 0..1 across the whole scroll.
 * Two out-of-phase sine pairs keep the flight from ever feeling like a
 * straight tube without needing a hand-authored spline.
 */
export function pathAt(t: number, out: THREE.Vector3): THREE.Vector3 {
  const x = Math.sin(t * Math.PI * 2.4) * 7.5 + Math.sin(t * Math.PI * 5.7 + 1.2) * 1.9;
  const y = Math.sin(t * Math.PI * 1.9 + 0.5) * 3.6 + Math.cos(t * Math.PI * 4.3) * 1.2;
  const z = START_Z - t * PATH_LEN;
  return out.set(x, y, z);
}

/**
 * Normalised station for section `i` of `n` — where its content lives on the
 * track. The first sits at 0 and the last at 1, so the hero is already on
 * screen when the loader lifts and the closing panel lands on the last pixel
 * of scroll.
 */
export function stationT(i: number, n: number): number {
  return n <= 1 ? 0 : i / (n - 1);
}

/** Half the gap between two stations — the reach of one panel's fade. */
export function stationHalfWindow(n: number): number {
  return n <= 1 ? 1 : 0.5 / (n - 1);
}

/**
 * Where the wireframe structures sit: halfway between two stations, so the
 * camera punches through one on every transition and the text always reads
 * against open space.
 */
export function structureT(i: number, n: number): number {
  return stationT(i, n) + stationHalfWindow(n);
}
