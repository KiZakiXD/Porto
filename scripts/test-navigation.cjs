/* Run with node scripts/test-navigation.cjs. Tests the same TS module the world uses. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const modules = new Map();
function load(relative) {
  if (modules.has(relative)) return modules.get(relative);
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const module = { exports: {} };
  vm.runInNewContext(outputText, { module, exports: module.exports, require: (name) => {
    if (name === '@/data/world') return load('data/world.ts');
    throw new Error(`Unexpected dependency ${name}`);
  } }, { filename: relative });
  modules.set(relative, module.exports);
  return module.exports;
}
const { fixedArtifacts, projectSlots, worldObstacles, zones } = load('data/world.ts');
const { createWorldNavigator, nearestArtifact, zoneAt, distance2 } = load('lib/world-navigation.ts');
const artifacts = [...fixedArtifacts, ...projectSlots.map((position, i) => ({
  id: `project:test-${i}`, zone: 'project-forge', label: 'Test', position, accent: '#fff', kind: 'project',
}))];
const navigator = createWorldNavigator(artifacts);
const spawn = [0, 5];
assert(navigator.isWalkable(spawn), 'Spawn must be safe');
assert(!navigator.isWalkable([100, 100]), 'Outside world must be blocked');
assert(!navigator.isWalkable([7, -6]), 'The gaps between rooms must not be walkable');
assert(!navigator.isWalkable([NaN, 0]), 'Invalid coordinates must be blocked');
assert(!navigator.isWalkable([0, 0]), 'The central artifact must have collision');
for (const artifact of artifacts) assert(!navigator.isWalkable(artifact.position), `${artifact.id} needs collision`);
for (const obstacle of worldObstacles) assert(!navigator.isWalkable(obstacle.position), `${obstacle.id} must remain solid`);
assert(!navigator.isWalkable([-17.1, 3.9]), 'A square project plinth must block its corners, not only its center');
const cornerStart = [-17.13, 4.14], cornerEnd = [-16.86, 3.87];
assert(navigator.isWalkable(cornerStart) && navigator.isWalkable(cornerEnd), 'Corner regression endpoints are clear');
assert(!navigator.lineIsClear(cornerStart, cornerEnd), 'A segment cannot graze through a solid plinth corner');
assert(!navigator.lineIsClear([2.5, -12], [3.72, -12]), 'Archive shelves cannot be traversed');
assert(!navigator.isWalkable([5.82, -2.32]), 'The player footprint cannot hang over an inside floor corner');
assert.equal(nearestArtifact([0, 2], artifacts)?.id, 'profile');
assert.equal(nearestArtifact(spawn, artifacts), null);
assert.equal(zoneAt(spawn), 'central-hall');
assert.equal(zoneAt([-15, -12]), 'ai-lab');

let verifiedSegments = 0;
function validatePath(start, route, label) {
  assert(route.length, `${label} must have a reachable route`);
  let previous = start;
  for (const waypoint of route) {
    assert(navigator.isWalkable(waypoint), `${label} waypoint lies on a floor`);
    assert(navigator.lineIsClear(previous, waypoint), `${label} segment cannot cut across a wall or plinth`);
    previous = waypoint;
    verifiedSegments++;
  }
  return previous;
}
const approaches = [];
for (const artifact of artifacts) {
  const finish = validatePath(spawn, navigator.approach(spawn, artifact), `Spawn → ${artifact.id}`);
  assert(distance2(finish, artifact.position) <= 2.8, `${artifact.id} must end within interaction distance`);
  approaches.push(finish);
}
for (let from = 0; from < approaches.length; from++) {
  for (let to = 0; to < approaches.length; to++) {
    if (from === to) continue;
    const start = approaches[from];
    const artifact = artifacts[to];
    const route = navigator.approach(start, artifact);
    const finish = distance2(start, artifact.position) <= 2.8 ? start : validatePath(start, route, `${artifacts[from].id} → ${artifact.id}`);
    assert(distance2(finish, artifact.position) <= 2.8, 'Every artifact must be reachable from every other artifact');
  }
}
for (const zone of zones) validatePath(spawn, navigator.pathTo(spawn, zone.position), `Direct navigation → ${zone.id}`);
for (const point of [[3.3, -12.85], [-11.78, -15.5], [19.65, 6.05]]) {
  validatePath(spawn, navigator.pathTo(spawn, point), 'A tap on solid furniture resolves to nearby walkable floor');
}
const edgePath = navigator.pathTo(spawn, [80, -80]);
validatePath(spawn, edgePath, 'An off-world tap resolves to the nearest valid floor');
assert.deepEqual(Array.from(navigator.pathTo(spawn, [NaN, 0])), []);
console.log(`Navigation passed: ${artifacts.length} artifacts, ${worldObstacles.length} solid furnishings, all room destinations, ${verifiedSegments} safe route segments.`);
