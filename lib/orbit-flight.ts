export interface FlightPoint { longitude: number; latitude: number }
export type FlightVector = [number, number, number]
export const ORBIT_RADIUS = 3.48
export const PLANET_RADIUS = 2.55
export const TAU = Math.PI * 2

export function wrapLongitude(value: number) {
  return ((value % TAU) + TAU) % TAU
}

export function orbitPosition(point: FlightPoint, radius = ORBIT_RADIUS): FlightVector {
  const latitude = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, point.latitude))
  const horizontal = Math.cos(latitude) * radius
  return [Math.sin(point.longitude) * horizontal, Math.sin(latitude) * radius, Math.cos(point.longitude) * horizontal]
}

export function angularDistance(a: FlightPoint, b: FlightPoint) {
  const dot = Math.sin(a.latitude) * Math.sin(b.latitude) + Math.cos(a.latitude) * Math.cos(b.latitude) * Math.cos(a.longitude - b.longitude)
  return Math.acos(Math.max(-1, Math.min(1, dot)))
}

/** Prevent invisible satellites on the far side from receiving pointer input. */
export function isOrbitPointVisible(point: FlightPoint, camera: FlightVector, occluderRadius = PLANET_RADIUS) {
  const destination = orbitPosition(point)
  const ray: FlightVector = [destination[0] - camera[0], destination[1] - camera[1], destination[2] - camera[2]]
  const lengthSquared = ray[0] ** 2 + ray[1] ** 2 + ray[2] ** 2
  if (lengthSquared < 1e-12) return true
  const fraction = -(camera[0] * ray[0] + camera[1] * ray[1] + camera[2] * ray[2]) / lengthSquared
  if (fraction <= 0 || fraction >= 1) return true
  const closest: FlightVector = [camera[0] + ray[0] * fraction, camera[1] + ray[1] * fraction, camera[2] + ray[2] * fraction]
  return closest[0] ** 2 + closest[1] ** 2 + closest[2] ** 2 >= occluderRadius ** 2
}

/** Constant-angle slerp keeps the probe outside the planet, including seam crossings. */
export function advanceFlight(from: FlightPoint, to: FlightPoint, maximumAngle: number): FlightPoint {
  const angle = angularDistance(from, to)
  if (!Number.isFinite(angle) || !Number.isFinite(maximumAngle) || maximumAngle <= 0) return { ...from }
  if (angle <= maximumAngle || angle < 1e-6) return { longitude: wrapLongitude(to.longitude), latitude: to.latitude }
  const fraction = maximumAngle / angle
  const start = orbitPosition(from, 1)
  const end = orbitPosition(to, 1)
  let vector: FlightVector
  if (Math.PI - angle < 1e-5) {
    // Antipodes have no unique shortest arc. Choose a stable tangent through north.
    const axis: FlightVector = Math.abs(start[1]) < 0.85 ? [0, 1, 0] : [1, 0, 0]
    const projection = axis[0] * start[0] + axis[1] * start[1] + axis[2] * start[2]
    const tangent: FlightVector = [axis[0] - projection * start[0], axis[1] - projection * start[1], axis[2] - projection * start[2]]
    const length = Math.hypot(...tangent)
    vector = [0, 1, 2].map((i) => start[i] * Math.cos(maximumAngle) + tangent[i] / length * Math.sin(maximumAngle)) as FlightVector
  } else {
    const denominator = Math.sin(angle)
    const a = Math.sin((1 - fraction) * angle) / denominator
    const b = Math.sin(fraction * angle) / denominator
    vector = [start[0] * a + end[0] * b, start[1] * a + end[1] * b, start[2] * a + end[2] * b]
  }
  const length = Math.hypot(...vector)
  return { longitude: wrapLongitude(Math.atan2(vector[0], vector[2])), latitude: Math.asin(Math.max(-1, Math.min(1, vector[1] / length))) }
}

export function manualFlight(point: FlightPoint, horizontal: number, vertical: number, delta: number): FlightPoint {
  const length = Math.max(1, Math.hypot(horizontal, vertical))
  const step = Math.max(0, Math.min(delta, 0.05)) * 0.74
  return {
    longitude: wrapLongitude(point.longitude + horizontal / length * step / Math.max(0.5, Math.cos(point.latitude))),
    latitude: Math.max(-1.12, Math.min(1.12, point.latitude + vertical / length * step)),
  }
}
