'use client';

import { Component, memo, useCallback, useEffect, useMemo, useRef, type ErrorInfo, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Group, PCFSoftShadowMap, SRGBColorSpace, Vector3 } from 'three';
import { projects } from '@/data/projects';
import { fixedArtifacts, projectSlots, type ArchiveWorldProps, type Point2, type RecordId, type WorldArtifact } from '@/data/world';
import { createWorldNavigator, distance2, nearestArtifact, zoneAt } from '@/lib/world-navigation';
import Environment from './Environment';
import Player, { type PlayerMotion } from './Player';

const artifacts: WorldArtifact[] = [
  ...fixedArtifacts,
  ...projects.slice(0, projectSlots.length).map((project, index): WorldArtifact => ({
    id: `project:${project.id}`, zone: 'project-forge', label: project.title,
    position: projectSlots[index], accent: '#d4ab79', kind: 'project',
  })),
];
const movementKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']);

class WorldErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function RuntimeScene(props: ArchiveWorldProps) {
  const { entered, paused, reducedMotion, lowPower, destination } = props;
  const { camera, gl, clock, size } = useThree();
  const callbacks = useRef(props);
  callbacks.current = props;
  const navigator = useMemo(() => createWorldNavigator(artifacts), []);
  const motion = useRef<PlayerMotion>({ position: new Vector3(0, 0.06, 5), heading: Math.PI, moving: false, interactionUntil: 0 });
  const keys = useRef(new Set<string>());
  const route = useRef<Point2[]>([]);
  const pendingRecord = useRef<RecordId | null>(null);
  const handledNonce = useRef<number | null>(null);
  const marker = useRef<Group>(null);
  const destinationPoint = useRef<Point2 | null>(null);
  const initialized = useRef(false);
  const visible = useRef(true);
  const snapshotElapsed = useRef(0);
  const lookAt = useRef(new Vector3(0, 0, -4));
  const desiredCamera = useMemo(() => new Vector3(), []);
  const desiredLookAt = useMemo(() => new Vector3(), []);

  const stop = useCallback(() => {
    keys.current.clear();
    route.current = [];
    pendingRecord.current = null;
    destinationPoint.current = null;
    motion.current.moving = false;
  }, []);

  const inspect = useCallback((record: RecordId) => {
    const artifact = artifacts.find((item) => item.id === record);
    if (artifact) {
      motion.current.heading = Math.atan2(artifact.position[0] - motion.current.position.x, artifact.position[1] - motion.current.position.z);
    }
    stop();
    motion.current.interactionUntil = clock.elapsedTime + 0.85;
    callbacks.current.onInspect(record);
  }, [clock, stop]);

  const navigate = useCallback((point: Point2, record?: RecordId) => {
    if (!callbacks.current.entered || callbacks.current.paused) return;
    const start: Point2 = [motion.current.position.x, motion.current.position.z];
    const artifact = record ? artifacts.find((item) => item.id === record) : null;
    keys.current.clear();
    if (artifact && distance2(start, artifact.position) <= 2.8) { inspect(artifact.id); return; }
    route.current = artifact ? navigator.approach(start, artifact) : navigator.pathTo(start, point);
    pendingRecord.current = artifact?.id ?? null;
    destinationPoint.current = route.current.length ? route.current[route.current.length - 1] : null;
    if (!route.current.length) pendingRecord.current = null;
  }, [inspect, navigator]);

  useEffect(() => {
    if (!entered || paused) stop();
  }, [entered, paused, stop]);

  useEffect(() => {
    if (!entered || paused || !destination || handledNonce.current === destination.nonce) return;
    handledNonce.current = destination.nonce;
    navigate(destination.point, destination.record);
  }, [destination, entered, paused, navigate]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!callbacks.current.entered || callbacks.current.paused || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, .settings-popover, .destination-menu'))) return;
      if (movementKeys.has(event.code)) {
        event.preventDefault();
        keys.current.add(event.code);
        route.current = []; pendingRecord.current = null; destinationPoint.current = null;
      } else if (event.code === 'KeyE' && !event.repeat) {
        const player = motion.current.position;
        const nearest = nearestArtifact([player.x, player.z], artifacts);
        if (nearest) { event.preventDefault(); inspect(nearest.id); }
      }
    };
    const onKeyUp = (event: KeyboardEvent) => { keys.current.delete(event.code); };
    const onVisibility = () => { visible.current = !document.hidden; if (document.hidden) stop(); };
    const onLost = (event: Event) => { event.preventDefault(); stop(); callbacks.current.onError(); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', onVisibility);
    gl.domElement.addEventListener('webglcontextlost', onLost);
    visible.current = !document.hidden;
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.domElement.removeEventListener('webglcontextlost', onLost);
      stop();
    };
  }, [gl, inspect, stop]);

  useFrame((_state, rawDelta) => {
    // A background tab or one expensive frame must never teleport the player.
    const dt = Math.min(rawDelta, 0.045);
    if (!initialized.current) { initialized.current = true; callbacks.current.onReady(); }
    const player = motion.current;
    player.moving = false;
    if (entered && !paused && visible.current) {
      let dx = 0, dz = 0;
      const held = keys.current;
      const horizontal = Number(held.has('KeyD') || held.has('ArrowRight')) - Number(held.has('KeyA') || held.has('ArrowLeft'));
      const forward = Number(held.has('KeyW') || held.has('ArrowUp')) - Number(held.has('KeyS') || held.has('ArrowDown'));
      if (horizontal || forward) {
        // The isometric camera has a fixed yaw, so these match screen directions.
        dx = horizontal * 12.5 - forward * 8.5;
        dz = -horizontal * 8.5 - forward * 12.5;
        const length = Math.hypot(dx, dz); dx /= length; dz /= length;
      } else if (route.current.length) {
        const next = route.current[0];
        const distance = Math.hypot(next[0] - player.position.x, next[1] - player.position.z);
        if (distance <= 0.09) route.current.shift();
        else { dx = (next[0] - player.position.x) / distance; dz = (next[1] - player.position.z) / distance; }
      }
      if (dx || dz) {
        const next = route.current[0];
        const remaining = next && !horizontal && !forward ? Math.hypot(next[0] - player.position.x, next[1] - player.position.z) : Infinity;
        const step = Math.min(4.1 * dt, remaining);
        const x = player.position.x, z = player.position.z;
        const full: Point2 = [x + dx * step, z + dz * step];
        if (navigator.isWalkable(full)) {
          player.position.x = full[0]; player.position.z = full[1];
        } else {
          // Manual input can slide along architecture instead of getting snagged.
          if (navigator.isWalkable([full[0], z])) player.position.x = full[0];
          if (navigator.isWalkable([player.position.x, full[1]])) player.position.z = full[1];
        }
        player.moving = Math.hypot(player.position.x - x, player.position.z - z) > 0.0005;
        if (player.moving) player.heading = Math.atan2(dx, dz);
        else if (route.current.length) { route.current = []; pendingRecord.current = null; destinationPoint.current = null; }
      }
      if (!route.current.length && pendingRecord.current) {
        const record = pendingRecord.current;
        pendingRecord.current = null; destinationPoint.current = null;
        const artifact = artifacts.find((item) => item.id === record);
        if (artifact && distance2([player.position.x, player.position.z], artifact.position) <= 2.9) inspect(record);
      } else if (!route.current.length) destinationPoint.current = null;
    }

    if (marker.current) {
      marker.current.visible = entered && !!destinationPoint.current && !paused;
      if (destinationPoint.current) marker.current.position.set(destinationPoint.current[0], 0.08, destinationPoint.current[1]);
      const scale = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 4) * 0.07;
      marker.current.scale.setScalar(scale);
    }

    if (entered) {
      const portrait = size.width < size.height;
      const multiplier = portrait ? 1.22 : 1;
      desiredLookAt.set(player.position.x, 0.85, player.position.z - 0.7);
      desiredCamera.set(player.position.x + 8.5 * multiplier, 11.8 * multiplier, player.position.z + 12.5 * multiplier);
    } else {
      // The full archive stays legible behind the left-aligned entry typography.
      desiredLookAt.set(-3.5, 0, -3.5);
      desiredCamera.set(31, 35, 40);
    }
    const cameraBlend = reducedMotion ? 1 : 1 - Math.exp(-dt * (entered ? 3.5 : 2));
    camera.position.lerp(desiredCamera, cameraBlend);
    lookAt.current.lerp(desiredLookAt, cameraBlend);
    camera.lookAt(lookAt.current);

    snapshotElapsed.current += dt;
    if (snapshotElapsed.current >= 0.1) {
      snapshotElapsed.current = 0;
      const point: Point2 = [player.position.x, player.position.z];
      callbacks.current.onSnapshot({ zone: zoneAt(point), position: point, nearest: entered ? nearestArtifact(point, artifacts)?.id ?? null : null, moving: player.moving });
    }
  });

  return (
    <>
      <color attach="background" args={['#090d0f']} />
      <ambientLight intensity={lowPower ? 0.66 : 0.54} color="#c5d4d5" />
      <hemisphereLight args={['#bccfd0', '#30302b', 0.95]} />
      <directionalLight position={[8, 20, 9]} intensity={2.4} color="#e2d8bd" castShadow={!lowPower}
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-left={-28} shadow-camera-right={28} shadow-camera-top={25} shadow-camera-bottom={-25}
        shadow-camera-near={1} shadow-camera-far={65} shadow-bias={-0.0004} shadow-normalBias={0.025} />
      <directionalLight position={[-12, 9, -18]} intensity={1.5} color="#85b8b2" />
      <Environment artifacts={artifacts} onNavigate={navigate} entered={entered} reducedMotion={reducedMotion} lowPower={lowPower} />
      <Player motion={motion} entered={entered} reducedMotion={reducedMotion} />
      <group ref={marker} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.31, 40]} />
          <meshBasicMaterial color="#a7d8c7" transparent opacity={0.8} depthWrite={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.075, 16]} />
          <meshBasicMaterial color="#a7d8c7" transparent opacity={0.55} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

function ArchiveWorld(props: ArchiveWorldProps) {
  return (
    <WorldErrorBoundary onError={props.onError}>
      <Canvas
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none' }}
        camera={{ position: [31, 35, 40], fov: 42, near: 0.1, far: 160 }}
        dpr={props.lowPower ? 1 : [1, 1.5]}
        shadows={props.lowPower ? false : { type: PCFSoftShadowMap }}
        gl={{ antialias: !props.lowPower, alpha: false, powerPreference: props.lowPower ? 'low-power' : 'high-performance' }}
        onCreated={({ gl }) => { gl.outputColorSpace = SRGBColorSpace; }}
        fallback={<p>WebGL is unavailable. <a href="/quick">Open Quick View</a></p>}
      >
        <RuntimeScene {...props} />
      </Canvas>
    </WorldErrorBoundary>
  );
}

export default memo(ArchiveWorld);
