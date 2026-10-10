/** Flight math shared by the scene and the navigation tests. */
export const QUALITY = Object.freeze({
  low: { label: 'Low', pixelRatio: 1, stars: 1800, galaxy: 3200, asteroids: 24, bloom: false, octaves: 3 },
  normal: { label: 'Normal', pixelRatio: 1.5, stars: 4500, galaxy: 8000, asteroids: 65, bloom: false, octaves: 5 },
  ultra: { label: 'Ultra', pixelRatio: 2, stars: 9000, galaxy: 16000, asteroids: 120, bloom: true, octaves: 6 },
});
/** @param {number[]} current @param {number[]} target @param {number} speed @param {number} delta */
export function flightStep(current, target, speed, delta) {
  const diff = target.map((v, i) => v - current[i]);
  const distance = Math.hypot(...diff);
  const step = Math.min(distance, Math.max(0, speed) * Math.min(Math.max(delta, 0), 0.05));
  if (distance === 0) return [...target];
  return current.map((v, i) => v + diff[i] / distance * step);
}
/** @param {number} distance @param {number} radius @param {boolean} alreadyDocked */
export function isDocked(distance, radius, alreadyDocked = false) {
  return distance < radius + (alreadyDocked ? 9 : 7);
}
/** @param {string | null} value */
export function validQuality(value) { return value === 'low' || value === 'ultra' ? value : 'normal'; }
