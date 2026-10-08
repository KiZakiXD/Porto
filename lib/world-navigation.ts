import { worldObstacles, zones, type Point2, type WorldArtifact, type ZoneId } from '@/data/world';

const GRID = 0.5;
const PLAYER_RADIUS = 0.28;
const MIN_X = -22;
const MAX_X = 22;
const MIN_Z = -20;
const MAX_Z = 12;
const WIDTH = Math.round((MAX_X - MIN_X) / GRID) + 1;
const HEIGHT = Math.round((MAX_Z - MIN_Z) / GRID) + 1;
const INTERACTION_DISTANCE = 2.8;
const FOOTPRINT_SAMPLES = Array.from({ length: 16 }, (_, index): Point2 => [
  Math.cos(index * Math.PI / 8) * PLAYER_RADIUS,
  Math.sin(index * Math.PI / 8) * PLAYER_RADIUS,
]);

type Floor = { minX: number; maxX: number; minZ: number; maxZ: number };
const floors: Floor[] = [
  ...zones.map(({ position, size }) => ({
    minX: position[0] - size[0] / 2, maxX: position[0] + size[0] / 2,
    minZ: position[1] - size[1] / 2, maxZ: position[1] + size[1] / 2,
  })),
  { minX: -21, maxX: 21, minZ: -2.5, maxZ: 2.5 },
  { minX: -17, maxX: -13, minZ: -12, maxZ: 0 },
  { minX: 13, maxX: 17, minZ: -12, maxZ: 0 },
  { minX: -3, maxX: 3, minZ: -13, maxZ: 2 },
];

export const distance2 = (a: Point2, b: Point2) => Math.hypot(a[0] - b[0], a[1] - b[1]);

function insideFloor(x: number, z: number) {
  return floors.some((f) => x >= f.minX && x <= f.maxX && z >= f.minZ && z <= f.maxZ);
}

function supportedByFloor([x, z]: Point2) {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
  // Most points fit on one slab. Only joined floor edges need the circular check.
  if (floors.some((f) => x >= f.minX + PLAYER_RADIUS && x <= f.maxX - PLAYER_RADIUS &&
      z >= f.minZ + PLAYER_RADIUS && z <= f.maxZ - PLAYER_RADIUS)) return true;
  return insideFloor(x, z) && FOOTPRINT_SAMPLES.every(([dx, dz]) => insideFloor(x + dx, z + dz));
}

type BoxBlocker = { position: Point2; halfSize: Point2 };
type CircleBlocker = { position: Point2; radius: number };

function pointBoxDistanceSquared(point: Point2, box: BoxBlocker) {
  const dx = Math.max(0, Math.abs(point[0] - box.position[0]) - box.halfSize[0]);
  const dz = Math.max(0, Math.abs(point[1] - box.position[1]) - box.halfSize[1]);
  return dx * dx + dz * dz;
}

function pointSegmentDistanceSquared(point: Point2, start: Point2, end: Point2) {
  const dx = end[0] - start[0], dz = end[1] - start[1];
  const length = dx * dx + dz * dz;
  const t = length ? Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dz) / length)) : 0;
  return (point[0] - start[0] - t * dx) ** 2 + (point[1] - start[1] - t * dz) ** 2;
}

/** Continuous clearance avoids cutting through plinth corners between sample points. */
function segmentBoxDistanceSquared(start: Point2, end: Point2, box: BoxBlocker) {
  // Skip distant furniture before evaluating rounded-corner clearance.
  if (Math.min(start[0], end[0]) > box.position[0] + box.halfSize[0] + PLAYER_RADIUS ||
      Math.max(start[0], end[0]) < box.position[0] - box.halfSize[0] - PLAYER_RADIUS ||
      Math.min(start[1], end[1]) > box.position[1] + box.halfSize[1] + PLAYER_RADIUS ||
      Math.max(start[1], end[1]) < box.position[1] - box.halfSize[1] - PLAYER_RADIUS) return Infinity;
  let enter = 0, exit = 1;
  for (const axis of [0, 1]) {
    const delta = end[axis] - start[axis];
    const min = box.position[axis] - box.halfSize[axis];
    const max = box.position[axis] + box.halfSize[axis];
    if (Math.abs(delta) < 1e-10) {
      if (start[axis] < min || start[axis] > max) { enter = Infinity; break; }
    } else {
      const a = (min - start[axis]) / delta, b = (max - start[axis]) / delta;
      enter = Math.max(enter, Math.min(a, b));
      exit = Math.min(exit, Math.max(a, b));
    }
  }
  if (enter <= exit) return 0;
  let closest = Math.min(pointBoxDistanceSquared(start, box), pointBoxDistanceSquared(end, box));
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    closest = Math.min(closest, pointSegmentDistanceSquared([
      box.position[0] + x * box.halfSize[0], box.position[1] + z * box.halfSize[1],
    ], start, end));
  }
  return closest;
}

export function zoneAt(point: Point2): ZoneId {
  const containing = zones.find((zone) => (
    Math.abs(point[0] - zone.position[0]) <= zone.size[0] / 2 &&
    Math.abs(point[1] - zone.position[1]) <= zone.size[1] / 2
  ));
  if (containing) return containing.id;
  return zones.reduce((closest, zone) => (
    distance2(point, zone.position) < distance2(point, closest.position) ? zone : closest
  ), zones[0]).id;
}

export function nearestArtifact(point: Point2, artifacts: WorldArtifact[]) {
  let nearest: WorldArtifact | null = null;
  let distance = INTERACTION_DISTANCE;
  for (const artifact of artifacts) {
    const candidate = distance2(point, artifact.position);
    if (candidate <= distance) { nearest = artifact; distance = candidate; }
  }
  return nearest;
}

/** A tiny binary queue keeps tap-to-walk pathfinding off the rendering hot path. */
class MinHeap {
  private values: { id: number; priority: number }[] = [];
  get size() { return this.values.length; }
  push(id: number, priority: number) {
    const entry = { id, priority };
    let index = this.values.length;
    this.values.push(entry);
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.values[parent].priority <= priority) break;
      this.values[index] = this.values[parent];
      index = parent;
    }
    this.values[index] = entry;
  }
  pop(): number {
    const first = this.values[0];
    const last = this.values.pop()!;
    if (this.values.length) {
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        if (left >= this.values.length) break;
        const right = left + 1;
        const child = right < this.values.length && this.values[right].priority < this.values[left].priority ? right : left;
        if (this.values[child].priority >= last.priority) break;
        this.values[index] = this.values[child];
        index = child;
      }
      this.values[index] = last;
    }
    return first.id;
  }
}

export interface WorldNavigator {
  isWalkable: (point: Point2) => boolean;
  lineIsClear: (start: Point2, end: Point2) => boolean;
  pathTo: (start: Point2, end: Point2) => Point2[];
  approach: (start: Point2, artifact: WorldArtifact) => Point2[];
}

/** Collision geometry matches the floors, solid room furnishings and artifact plinths. */
export function createWorldNavigator(artifacts: WorldArtifact[]): WorldNavigator {
  const boxes: BoxBlocker[] = worldObstacles.map((obstacle) => ({
    position: obstacle.position, halfSize: [obstacle.size[0] / 2, obstacle.size[1] / 2],
  }));
  const circles: CircleBlocker[] = [];
  for (const artifact of artifacts) {
    if (artifact.kind === 'project') boxes.push({ position: artifact.position, halfSize: [0.81, 0.81] });
    else if (artifact.kind === 'archive') boxes.push({ position: artifact.position, halfSize: [0.88, 0.7] });
    else if (artifact.kind === 'terminal') boxes.push({ position: artifact.position, halfSize: [0.96, 0.76] });
    else circles.push({ position: artifact.position, radius: (artifact.kind === 'ai' ? 0.93 : 1.06) + PLAYER_RADIUS });
  }
  const clearanceSquared = PLAYER_RADIUS ** 2;
  const isWalkable = (point: Point2) => {
    if (!supportedByFloor(point)) return false;
    return boxes.every((box) => pointBoxDistanceSquared(point, box) >= clearanceSquared) &&
      circles.every((circle) => (point[0] - circle.position[0]) ** 2 + (point[1] - circle.position[1]) ** 2 >= circle.radius ** 2);
  };
  const lineIsClear = (start: Point2, end: Point2) => {
    if (!isWalkable(start) || !isWalkable(end)) return false;
    if (boxes.some((box) => segmentBoxDistanceSquared(start, end, box) < clearanceSquared) ||
        circles.some((circle) => pointSegmentDistanceSquared(circle.position, start, end) < circle.radius ** 2)) return false;
    const steps = Math.max(1, Math.ceil(distance2(start, end) / 0.1));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      if (!supportedByFloor([start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t])) return false;
    }
    return true;
  };
  const points: Point2[] = Array.from({ length: WIDTH * HEIGHT }, (_, id) => [
    MIN_X + (id % WIDTH) * GRID, MIN_Z + Math.floor(id / WIDTH) * GRID,
  ]);
  const valid = points.map(isWalkable);
  const validIds = points.map((_, id) => id).filter((id) => valid[id]);
  const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
  const opposite = [1, 0, 3, 2, 7, 6, 5, 4];
  // Static room geometry never changes while walking; share these edge checks
  // across all tap-to-walk requests instead of re-testing each wall for every route.
  const edgeClearance = new Uint8Array(points.length * offsets.length);
  const closestNode = (point: Point2, requireClear: boolean) => {
    let best = -1;
    let bestDistance = Infinity;
    for (const id of validIds) {
      const distance = distance2(point, points[id]);
      if (distance < bestDistance) {
        best = id; bestDistance = distance;
      }
    }
    if (!requireClear || best < 0 || lineIsClear(point, points[best])) return best;
    const nearby = validIds.map((id) => ({ id, distance: distance2(point, points[id]) })).sort((a, b) => a.distance - b.distance);
    return nearby.find(({ id }) => lineIsClear(point, points[id]))?.id ?? -1;
  };

  const pathTo = (start: Point2, requested: Point2): Point2[] => {
    if (!isWalkable(start) || !requested.every(Number.isFinite)) return [];
    const goalId = closestNode(requested, false);
    if (goalId < 0) return [];
    const end: Point2 = isWalkable(requested) ? requested : points[goalId];
    if (lineIsClear(start, end)) return distance2(start, end) < 0.05 ? [] : [end];
    const startId = closestNode(start, true);
    const targetId = isWalkable(requested) ? closestNode(end, true) : goalId;
    if (startId < 0 || targetId < 0) return [];
    const open = new MinHeap();
    const closed = new Uint8Array(points.length);
    const score = new Float64Array(points.length); score.fill(Infinity);
    const previous = new Int32Array(points.length); previous.fill(-1);
    score[startId] = 0;
    open.push(startId, distance2(points[startId], points[targetId]));
    while (open.size) {
      const current = open.pop();
      if (closed[current]) continue;
      if (current === targetId) {
        const reversed: Point2[] = [end];
        let id = current;
        while (id !== -1) { reversed.push(points[id]); id = previous[id]; }
        const route = reversed.reverse();
        const simplified: Point2[] = [];
        let anchor = start;
        let cursor = 0;
        while (cursor < route.length) {
          let farthest = cursor;
          while (farthest + 1 < route.length && lineIsClear(anchor, route[farthest + 1])) farthest++;
          const next = route[farthest];
          if (distance2(anchor, next) > 0.04) simplified.push(next);
          anchor = next; cursor = farthest + 1;
        }
        return simplified;
      }
      closed[current] = 1;
      const x = current % WIDTH;
      const z = Math.floor(current / WIDTH);
      for (let direction = 0; direction < offsets.length; direction++) {
        const [dx, dz] = offsets[direction];
        const nx = x + dx, nz = z + dz;
        if (nx < 0 || nx >= WIDTH || nz < 0 || nz >= HEIGHT) continue;
        const id = nz * WIDTH + nx;
        if (!valid[id] || closed[id]) continue;
        if (dx && dz && (!valid[z * WIDTH + nx] || !valid[nz * WIDTH + x])) continue;
        const edge = current * offsets.length + direction;
        if (!edgeClearance[edge]) {
          const clear = lineIsClear(points[current], points[id]) ? 2 : 1;
          edgeClearance[edge] = clear;
          edgeClearance[id * offsets.length + opposite[direction]] = clear;
        }
        if (edgeClearance[edge] !== 2) continue;
        const cost = score[current] + GRID * (dx && dz ? Math.SQRT2 : 1);
        if (cost >= score[id]) continue;
        score[id] = cost; previous[id] = current;
        open.push(id, cost + distance2(points[id], points[targetId]));
      }
    }
    return [];
  };

  const approach = (start: Point2, artifact: WorldArtifact) => {
    if (distance2(start, artifact.position) <= INTERACTION_DISTANCE && lineIsClear(start, start)) return [];
    const options = Array.from({ length: 20 }, (_, index): Point2 => {
      const angle = index / 20 * Math.PI * 2;
      return [artifact.position[0] + Math.sin(angle) * 2.05, artifact.position[1] + Math.cos(angle) * 2.05];
    }).filter(isWalkable).sort((a, b) => distance2(a, start) - distance2(b, start));
    let shortest: Point2[] = [];
    let shortestLength = Infinity;
    for (const option of options.slice(0, 5)) {
      const route = pathTo(start, option);
      if (!route.length) continue;
      let previous = start;
      const length = route.reduce((sum, point) => { const next = sum + distance2(previous, point); previous = point; return next; }, 0);
      if (length < shortestLength) { shortest = route; shortestLength = length; }
    }
    return shortest;
  };
  return { isWalkable, lineIsClear, pathTo, approach };
}
