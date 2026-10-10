import test from 'node:test';
import assert from 'node:assert/strict';
import { flightStep, isDocked, validQuality, QUALITY } from '../lib/flight.mjs';
test('autopilot arrives without overshooting a close destination', () => {
  assert.deepEqual(flightStep([0,0,0], [0.01,0,0], 30, 0.05), [0.01,0,0]);
  assert.deepEqual(flightStep([1,2,3], [1,2,3], 30, 1), [1,2,3]);
});
test('a long frame after a hidden tab does not teleport the ship', () => {
  assert.ok(Math.hypot(...flightStep([0,0,0], [50,0,0], 20, 10)) <= 1);
});
test('docking hysteresis prevents panel flickering at an orbit boundary', () => {
  assert.equal(isDocked(12.5, 6, false), true);
  assert.equal(isDocked(14, 6, true), true);
  assert.equal(isDocked(14, 6, false), false);
  assert.equal(isDocked(16, 6, true), false);
});
test('graphics modes change actual rendering budgets', () => {
  assert.ok(QUALITY.low.stars < QUALITY.normal.stars);
  assert.ok(QUALITY.normal.galaxy < QUALITY.ultra.galaxy);
  assert.ok(QUALITY.low.asteroids < QUALITY.ultra.asteroids);
  assert.equal(QUALITY.ultra.bloom, true);
  assert.equal(QUALITY.low.bloom, false);
  assert.equal(validQuality('unknown'), 'normal');
});
