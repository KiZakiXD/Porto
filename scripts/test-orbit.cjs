/* Exercise the same spherical-navigation module used by the live WebGL scene. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const filename = path.join(__dirname, '../lib/orbit-flight.ts');
const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const moduleUnderTest = { exports: {} };
vm.runInNewContext(outputText, { module: moduleUnderTest, exports: moduleUnderTest.exports }, { filename });
const { wrapLongitude, orbitPosition, angularDistance, advanceFlight, manualFlight, isOrbitPointVisible, ORBIT_RADIUS, PLANET_RADIUS, TAU } = moduleUnderTest.exports;
const close = (actual, expected, message, tolerance = 1e-8) => assert(Math.abs(actual - expected) < tolerance, `${message}: ${actual} vs ${expected}`);
const point = (longitude, latitude = 0) => ({ longitude, latitude });

for (const value of [-TAU * 3 - 0.25, -0.01, 0, 0.25, TAU, TAU * 4 + 0.25]) {
  const wrapped = wrapLongitude(value);
  assert(wrapped >= 0 && wrapped < TAU, 'Longitude must remain in the coordinate display range');
  close(Math.sin(wrapped), Math.sin(value), 'Wrapping must retain position');
}
close(angularDistance(point(TAU - 0.03), point(0.03)), 0.06, 'Autopilot must cross the short seam');
close(angularDistance(point(0, Math.PI / 2), point(3.2, Math.PI / 2)), 0, 'All longitudes meet at the north pole');
close(angularDistance(point(0, -Math.PI / 2), point(2.9, -Math.PI / 2)), 0, 'All longitudes meet at the south pole');
assert(ORBIT_RADIUS > PLANET_RADIUS, 'Probe flight must stay outside the planet');

let testedSteps = 0;
function verifyRoute(start, target, label) {
  let current = start;
  for (let step = 0; step < 500; step++) {
    const before = angularDistance(current, target);
    if (before < 1e-7) return;
    const next = advanceFlight(current, target, 0.017);
    const after = angularDistance(next, target);
    assert(Number.isFinite(next.longitude) && Number.isFinite(next.latitude), `${label}: coordinates must remain finite`);
    assert(after < before, `${label}: every step must approach its destination`);
    assert(angularDistance(current, next) <= 0.017 + 1e-7, `${label}: speed cannot exceed the frame budget`);
    close(Math.hypot(...orbitPosition(next)), ORBIT_RADIUS, `${label}: the path cannot cut through the planet`);
    current = next;
    testedSteps++;
  }
  assert.fail(`${label}: autopilot did not arrive`);
}
verifyRoute(point(TAU - 0.15, 0.1), point(0.15, -0.1), 'Longitude seam');
verifyRoute(point(0, 1.2), point(Math.PI, 1.2), 'North polar route');
verifyRoute(point(0, -1.2), point(Math.PI, -1.2), 'South polar route');
verifyRoute(point(0), point(Math.PI), 'Exact antipodes');
verifyRoute(point(0, Math.PI / 2), point(0, -Math.PI / 2), 'Pole to pole');
verifyRoute(point(1.2, 0.4), point(1.2 + Math.PI - 1e-6, -0.4), 'Near-antipodal route');
const slots = [point(0.35, 0.22), point(1.55, -0.28), point(2.9, 0.48), point(4.45, -0.15), point(5.55, 0.35)];
for (const destination of slots) verifyRoute(point(5.94, -0.35), destination, 'Spawn to a signal');
for (const from of slots) for (const to of slots) verifyRoute(from, to, 'Signal to signal');
for (const budget of [0, -1, NaN, Infinity]) {
  const stopped = advanceFlight(point(0.4, 0.2), point(2.4, -0.1), budget);
  close(stopped.longitude, 0.4, 'An invalid frame budget cannot move the probe');
  close(stopped.latitude, 0.2, 'An invalid frame budget cannot change altitude');
}
const landed = advanceFlight(point(0.1), point(TAU + 0.2, 0.1), 1);
close(landed.longitude, 0.2, 'Arrival must normalize longitude');
close(landed.latitude, 0.1, 'Arrival must use the exact destination');

const origin = point(0.8, 0);
const horizontal = manualFlight(origin, 1, 0, 0.02);
const diagonal = manualFlight(origin, 1, 1, 0.02);
assert(angularDistance(origin, diagonal) <= angularDistance(origin, horizontal) * 1.001, 'Diagonal keyboard input cannot boost speed');
const bounded = manualFlight(point(0.4, 1.11), 1, 1, 60);
assert(bounded.latitude <= 1.12, 'Keyboard input must stop before the pole');
assert(angularDistance(point(0.4, 1.11), bounded) < 0.04, 'Returning from a suspended tab cannot teleport the probe');
close(manualFlight(origin, 1, 1, -1).longitude, origin.longitude, 'Negative delta cannot move the probe');
const stationary = manualFlight(origin, 0, 0, 0.02);
close(stationary.longitude, origin.longitude, 'Idle input cannot drift');
close(stationary.latitude, origin.latitude, 'Idle input cannot drift');

assert(isOrbitPointVisible(point(0), [0, 0, 11]), 'Near-side signal must accept taps');
assert(!isOrbitPointVisible(point(Math.PI), [0, 0, 11]), 'Far-side signal must not accept taps through the planet');
assert(isOrbitPointVisible(point(Math.PI / 2), [0, 0, 11]), 'A signal beyond the visible limb must remain tappable');
assert(isOrbitPointVisible(point(Math.PI), [0, 0, -11]), 'Orbiting the camera must reveal the opposite signal');
assert(!isOrbitPointVisible(point(0), [0, 0, -11]), 'Occlusion must follow the camera');
assert(isOrbitPointVisible(point(0, Math.PI / 2), [0, 11, 0]), 'Top-down views must reveal polar signals');
console.log(`Orbital navigation passed: ${testedSteps} safe spherical steps, shortest seam crossings, poles, antipodes, keyboard limits, arrival, and satellite occlusion.`);
