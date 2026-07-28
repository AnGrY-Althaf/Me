import * as THREE from 'three';
import { SECTIONS } from '../content';

/** Distance between neighbouring stations, world units. */
export const STATION_GAP = 90;

/** How far ahead of the camera a station's content rests when arrived. */
export const READ_DIST = 26;

export const SECTION_COUNT = SECTIONS.length;

/** Total camera travel: first station at t=0, last at t=1. */
export const PATH_LEN = STATION_GAP * (SECTION_COUNT - 1);

/**
 * The flight is a near-straight dive down -Z with a gentle lateral sway, so
 * content approached off-centre drifts into place as you arrive.
 */
export function pathAt(t: number, out: THREE.Vector3): THREE.Vector3 {
  const z = -t * PATH_LEN;
  const x = Math.sin(t * Math.PI * 1.7) * 2.2;
  const y = Math.cos(t * Math.PI * 1.3 + 0.6) * 1.4;
  return out.set(x, y, z);
}

export function stationT(i: number): number {
  return SECTION_COUNT <= 1 ? 0 : i / (SECTION_COUNT - 1);
}

/** World anchor where section `i`'s content sits (READ_DIST past the camera's rest). */
export function stationAnchor(i: number, out: THREE.Vector3): THREE.Vector3 {
  pathAt(stationT(i), out);
  out.z -= READ_DIST;
  return out;
}
