"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { zones, type Point2, type RecordId, type WorldArtifact } from "@/data/world";
import { timeline } from "@/data/timeline";

export interface EnvironmentProps {
  artifacts: WorldArtifact[];
  onNavigate: (point: Point2, record?: RecordId) => void;
  entered: boolean;
  reducedMotion: boolean;
  lowPower: boolean;
}

const palette = {
  stone: "#353b39", stoneLight: "#474e47", dark: "#171e1d", edge: "#647065",
  metal: "#69776f", brass: "#a18a62", pale: "#d7dccd", sage: "#a0c6af", cyan: "#91bdb7",
};
const rounded = new RoundedBoxGeometry(1, 1, 1, 2, 0.065);
const unitBox = new THREE.BoxGeometry(1, 1, 1);
const tileGeometry = new THREE.BoxGeometry(1, 0.025, 1);
const stoneMaterial = new THREE.MeshStandardMaterial({ color: palette.stone, roughness: 0.89, metalness: 0.14 });
const darkMaterial = new THREE.MeshStandardMaterial({ color: palette.dark, roughness: 0.73, metalness: 0.38 });
const metalMaterial = new THREE.MeshStandardMaterial({ color: palette.metal, roughness: 0.48, metalness: 0.67 });
const brassMaterial = new THREE.MeshStandardMaterial({ color: palette.brass, roughness: 0.54, metalness: 0.63 });
const edgeMaterial = new THREE.MeshStandardMaterial({ color: palette.edge, roughness: 0.78, metalness: 0.26 });

// These connecting slabs are disjoint from the six rooms. Keeping one surface
// at each coordinate prevents overlapping corridor faces from flickering.
const connections = [
  { x: -15, z: -1.75, width: 12, depth: 1.5 },
  { x: -7.5, z: 0, width: 3, depth: 5 },
  { x: 7.75, z: 0, width: 3.5, depth: 5 },
  { x: 15, z: -1.5, width: 11, depth: 2 },
  { x: 20.75, z: 0, width: 0.5, depth: 5 },
  { x: 0, z: -5.5, width: 6, depth: 3 },
  { x: -15, z: -4.5, width: 4, depth: 4 },
  { x: 15, z: -4.5, width: 4, depth: 4 },
];
const floorRectangles = [
  ...zones.map((zone) => ({ x: zone.position[0], z: zone.position[1], width: zone.size[0], depth: zone.size[1] })),
  ...connections,
];

type V3 = [number, number, number];
type BlockProps = { position: V3; scale: V3; color?: string; material?: THREE.Material; rotation?: V3; soft?: boolean; emissive?: boolean; };

function Block({ position, scale, color, material, rotation, soft = true, emissive = false }: BlockProps) {
  return <mesh position={position} scale={scale} rotation={rotation} geometry={soft ? rounded : unitBox} material={material} castShadow receiveShadow>
    {!material && <meshStandardMaterial color={color || palette.stone} roughness={0.72} metalness={0.25} emissive={emissive ? color : "#000000"} emissiveIntensity={emissive ? 0.38 : 0} />}
  </mesh>;
}

function Cylinder({ position, radius, height, color = palette.stone, top, segments = 32 }: { position: V3; radius: number; height: number; color?: string; top?: number; segments?: number; }) {
  return <mesh position={position} castShadow receiveShadow><cylinderGeometry args={[top ?? radius, radius, height, segments]} /><meshStandardMaterial color={color} roughness={0.68} metalness={0.34} /></mesh>;
}

function Ring({ position, radius, thickness = 0.025, color = palette.sage, rotation = [-Math.PI / 2, 0, 0] }: { position: V3; radius: number; thickness?: number; color?: string; rotation?: V3; }) {
  return <mesh position={position} rotation={rotation}><torusGeometry args={[radius, thickness, 6, 48]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.19} roughness={0.45} metalness={0.5} /></mesh>;
}

function Inscription({ text, subtitle, position, color = "#d8e0d1", width = 4.2, height = 0.95 }: { text: string; subtitle?: string; position: V3; color?: string; width?: number; height?: number; }) {
  const sprite = useRef<THREE.Sprite>(null);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024; canvas.height = Math.round(1024 * height / width);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#030a06"; ctx.shadowBlur = 9;
    if (subtitle) {
      ctx.font = "500 32px Arial, sans-serif"; ctx.fillStyle = color;
      ctx.fillText(subtitle.toUpperCase(), 512, canvas.height * 0.19, 970);
    }
    let fontSize = subtitle ? Math.min(104, canvas.height * 0.5) : Math.min(122, canvas.height * 0.67);
    ctx.font = `500 ${fontSize}px Arial, sans-serif`;
    const measured = ctx.measureText(text.toUpperCase()).width;
    if (measured > 970) fontSize *= 970 / measured;
    ctx.font = `500 ${fontSize}px Arial, sans-serif`; ctx.fillStyle = "#e7e9df";
    ctx.fillText(text.toUpperCase(), 512, canvas.height * (subtitle ? 0.64 : 0.5));
    const result = new THREE.CanvasTexture(canvas); result.colorSpace = THREE.SRGBColorSpace;
    result.minFilter = THREE.LinearFilter; result.magFilter = THREE.LinearFilter;
    return result;
  }, [text, subtitle, color, width, height]);
  useEffect(() => () => texture?.dispose(), [texture]);
  useFrame(({ camera, size }) => {
    if (!sprite.current) return;
    const labelScale = size.width < 600 ? 0.6 : 1;
    sprite.current.scale.set(width * labelScale, height * labelScale, 1);
    sprite.current.getWorldPosition(worldPosition);
    // Distant labels are visual noise; room names resolve naturally as the
    // player approaches instead of becoming unreadable pixels in the overview.
    const distance = camera.position.distanceTo(worldPosition);
    sprite.current.material.opacity = 0.96 * (1 - THREE.MathUtils.smoothstep(distance, 26, 43));
    sprite.current.visible = distance < 43;
  });
  if (!texture) return null;
  return <sprite ref={sprite} position={position} scale={[width, height, 1]} renderOrder={2}><spriteMaterial map={texture} transparent depthWrite={false} opacity={0.95} toneMapped={false} /></sprite>;
}

// Individual stones share one draw call. The seams are geometry, not a blurry image.
function Paving() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const tiles = useMemo(() => {
    const output: { x: number; z: number; width: number; depth: number; shade: number }[] = [];
    for (const rect of floorRectangles) for (let x = -21; x < 21; x += 2) for (let z = -19; z < 11; z += 2) {
      const left = Math.max(x, rect.x - rect.width / 2), right = Math.min(x + 2, rect.x + rect.width / 2);
      const back = Math.max(z, rect.z - rect.depth / 2), front = Math.min(z + 2, rect.z + rect.depth / 2);
      if (right - left < 0.05 || front - back < 0.05) continue;
      output.push({ x: (left + right) / 2, z: (back + front) / 2, width: right - left - 0.025, depth: front - back - 0.025, shade: 0.94 + Math.abs((x * 7 + z * 13) % 7) * 0.01 });
    }
    return output;
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D(); const color = new THREE.Color();
    tiles.forEach((tile, index) => {
      dummy.position.set(tile.x, 0.04, tile.z); dummy.scale.set(tile.width, 1, tile.depth); dummy.updateMatrix();
      ref.current!.setMatrixAt(index, dummy.matrix);
      color.set(palette.stoneLight).multiplyScalar(tile.shade); ref.current!.setColorAt(index, color);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [tiles]);
  return <instancedMesh ref={ref} args={[tileGeometry, undefined, tiles.length]} receiveShadow><meshStandardMaterial roughness={0.91} metalness={0.09} /></instancedMesh>;
}

function Floor({ onNavigate }: Pick<EnvironmentProps, "onNavigate">) {
  const walk = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onNavigate([event.point.x, event.point.z]); };
  return <group onClick={walk}>
    {zones.map((zone) => <group key={zone.id} position={[zone.position[0], 0, zone.position[1]]}>
      <Block position={[0, -0.28, 0]} scale={[zone.size[0] + 0.35, 0.5, zone.size[1] + 0.35]} material={darkMaterial} />
      <Block position={[0, -0.045, 0]} scale={[zone.size[0], 0.15, zone.size[1]]} material={stoneMaterial} />
      {/* Continuous stone coping makes each area read as architecture. */}
      <Block position={[0, 0.043, -zone.size[1] / 2 + 0.16]} scale={[zone.size[0] - 0.35, 0.085, 0.19]} material={edgeMaterial} />
      <Block position={[-zone.size[0] / 2 + 0.15, 0.043, 0]} scale={[0.19, 0.085, zone.size[1] - 0.35]} material={edgeMaterial} />
      <Block position={[zone.size[0] / 2 - 0.15, 0.043, 0]} scale={[0.19, 0.085, zone.size[1] - 0.35]} material={edgeMaterial} />
      <Block position={[0, -0.12, zone.size[1] / 2 + 0.035]} scale={[zone.size[0] - 0.5, 0.07, 0.075]} color={zone.accent} emissive />
    </group>)}
    {connections.map((slab, index) => <group key={index}>
      <Block position={[slab.x, -0.28, slab.z]} scale={[slab.width, 0.5, slab.depth]} material={darkMaterial} />
      <Block position={[slab.x, -0.045, slab.z]} scale={[slab.width, 0.15, slab.depth]} material={stoneMaterial} />
    </group>)}
    <Paving />
    {[-2.1, 2.1].map((z) => <Block key={z} position={[0, 0.063, z]} scale={[40, 0.014, 0.035]} material={brassMaterial} soft={false} />)}
    {[-2.55, 2.55].map((x) => <Block key={x} position={[x, 0.063, -7.5]} scale={[0.035, 0.014, 16]} material={brassMaterial} soft={false} />)}
    {[-15, 15].map((x) => [-1.55, 1.55].map((dx) => <Block key={`${x}-${dx}`} position={[x + dx, 0.063, -7]} scale={[0.035, 0.014, 10]} material={brassMaterial} soft={false} />))}
    <mesh position={[0, 0.061, 1]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[4.32, 4.36, 96]} /><meshStandardMaterial color={palette.brass} metalness={0.5} roughness={0.6} /></mesh>
    <mesh position={[0, 0.061, 1]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[4.6, 4.62, 96]} /><meshStandardMaterial color={palette.edge} metalness={0.4} roughness={0.7} /></mesh>
  </group>;
}

function Pillar({ position, height = 4.8 }: { position: V3; height?: number; }) {
  return <group position={position}>
    <Block position={[0, 0.2, 0]} scale={[0.94, 0.4, 0.94]} material={stoneMaterial} />
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[0.26, 0.36, height - 0.5, 12]} /><meshStandardMaterial color={palette.stoneLight} roughness={0.86} metalness={0.12} /></mesh>
    <Block position={[0, height - 0.25, 0]} scale={[0.76, 0.26, 0.76]} material={edgeMaterial} />
    <Block position={[0, height - 0.05, 0]} scale={[0.88, 0.13, 0.88]} material={stoneMaterial} />
    <Block position={[0, height * 0.56, 0.33]} scale={[0.035, height * 0.46, 0.035]} color={palette.brass} emissive />
  </group>;
}

function Gate({ entered, reducedMotion }: Pick<EnvironmentProps, "entered" | "reducedMotion">) {
  const left = useRef<THREE.Group>(null); const right = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const headMaterials = useMemo(() => [stoneMaterial.clone(), edgeMaterial.clone(), new THREE.MeshStandardMaterial({ color: palette.sage, emissive: palette.sage, emissiveIntensity: 0.38 })], []);
  useEffect(() => { headMaterials.forEach((material) => { material.transparent = true; }); return () => headMaterials.forEach((material) => material.dispose()); }, [headMaterials]);
  const open = useRef(entered ? 1 : 0);
  useFrame((_, delta) => {
    open.current = reducedMotion ? Number(entered) : THREE.MathUtils.damp(open.current, Number(entered), 3.1, delta);
    const retract = THREE.MathUtils.smoothstep(open.current, 0.42, 0.96);
    if (left.current) { left.current.position.set(-1.04 - open.current * 1.52, -4.7 * retract, 0); left.current.rotation.y = -open.current * 1.15; left.current.visible = retract < 0.999; }
    if (right.current) { right.current.position.set(1.04 + open.current * 1.52, -4.7 * retract, 0); right.current.rotation.y = open.current * 1.15; right.current.visible = retract < 0.999; }
    const headOpacity = 1 - THREE.MathUtils.smoothstep(open.current, 0.2, 0.75);
    headMaterials.forEach((material) => { material.opacity = headOpacity; });
    if (head.current) { head.current.visible = headOpacity > 0.01; head.current.position.y = open.current * 0.45; }
  });
  return <group position={[0, 0, 7.2]}>
    <Pillar position={[-3.55, 0, 0]} height={5.2} /><Pillar position={[3.55, 0, 0]} height={5.2} />
    <group ref={head}>
      <Block position={[0, 5.05, 0]} scale={[7.9, 0.55, 1]} material={headMaterials[0]} />
      <Block position={[0, 4.72, 0.35]} scale={[6.65, 0.055, 0.06]} material={headMaterials[2]} />
      <Block position={[0, 5.47, 0]} scale={[6.2, 0.25, 0.76]} material={headMaterials[1]} />
    </group>
    {[-1, 1].map((side) => <group key={side} ref={side < 0 ? left : right} position={[side * 1.04, 0, 0]}>
      <Block position={[0, 2.26, 0]} scale={[2.05, 4.35, 0.27]} material={darkMaterial} />
      <Block position={[0, 2.26, 0.16]} scale={[1.75, 3.98, 0.11]} material={stoneMaterial} />
      <Block position={[-side * 0.64, 2.26, 0.25]} scale={[0.038, 3.43, 0.04]} color={palette.sage} emissive />
      <Block position={[0, 2.2, 0.24]} scale={[1.26, 0.04, 0.035]} material={brassMaterial} />
    </group>)}
  </group>;
}

function BackWall({ position, width, height = 3.1 }: { position: V3; width: number; height?: number; }) {
  return <group position={position}>
    <Block position={[0, height / 2, 0]} scale={[width, height, 0.42]} material={stoneMaterial} />
    <Block position={[0, height, 0]} scale={[width + 0.24, 0.14, 0.64]} material={edgeMaterial} />
    <Block position={[0, 0.3, 0.25]} scale={[width, 0.35, 0.18]} material={darkMaterial} />
    <Block position={[0, height - 0.28, 0.25]} scale={[width - 0.6, 0.033, 0.04]} material={brassMaterial} />
  </group>;
}

function ArchiveShelves() {
  const bookRef = useRef<THREE.InstancedMesh>(null);
  const books = useMemo(() => {
    const list: { position: V3; scale: V3; color: string }[] = [];
    for (const side of [-1, 1]) for (let shelf = 0; shelf < 4; shelf++) for (let book = 0; book < 13; book++) {
      const height = 0.39 + ((book * 3 + shelf) % 4) * 0.065;
      list.push({ position: [side * 3.32, 0.64 + shelf * 0.61 + height / 2, -10.12 - book * 0.46], scale: [0.45, height, 0.29 + (book % 3) * 0.035], color: ["#6f796c", "#434e48", "#968773", "#52615d", "#a1a396"][(book + shelf) % 5] });
    }
    return list;
  }, []);
  useEffect(() => {
    if (!bookRef.current) return;
    const dummy = new THREE.Object3D();
    books.forEach((book, i) => { dummy.position.set(...book.position); dummy.scale.set(...book.scale); dummy.updateMatrix(); bookRef.current!.setMatrixAt(i, dummy.matrix); bookRef.current!.setColorAt(i, new THREE.Color(book.color)); });
    bookRef.current.instanceMatrix.needsUpdate = true;
    if (bookRef.current.instanceColor) bookRef.current.instanceColor.needsUpdate = true;
  }, [books]);
  return <group>
    <instancedMesh ref={bookRef} args={[unitBox, undefined, books.length]} castShadow><meshStandardMaterial roughness={0.82} metalness={0.06} /></instancedMesh>
    {[-1, 1].map((side) => <group key={side}>
      <Block position={[side * 3.63, 1.62, -12.85]} scale={[0.16, 3.08, 6.95]} material={darkMaterial} />
      {[0, 1, 2, 3, 4].map((level) => <Block key={level} position={[side * 3.3, 0.6 + level * 0.61, -12.85]} scale={[0.8, 0.085, 6.95]} material={metalMaterial} />)}
      {[-16.32, -9.38].map((z) => <Block key={z} position={[side * 3.32, 1.65, z]} scale={[0.8, 3.05, 0.14]} material={edgeMaterial} />)}
    </group>)}
    <BackWall position={[0, 0, -18.8]} width={7.9} height={3.9} />
    <Inscription text="Archive Corridor" subtitle="01 / Recorded chapters" position={[0, 4.5, -18.6]} color="#c6a57a" width={5.9} />
    {timeline.map((entry, i) => <group key={entry.id} position={[-2.35 + i * 1.56, 0, -18.5]}>
      <Block position={[0, 2.34, 0]} scale={[1.18, 1.42, 0.12]} material={darkMaterial} />
      <Block position={[0, 1.48, 0.05]} scale={[0.68, 0.035, 0.04]} color={palette.brass} emissive />
      <Inscription text={entry.year} position={[0, 2.34, 0.12]} width={1.18} height={0.55} />
    </group>)}
  </group>;
}

function ServerRack({ position, height = 2.4 }: { position: V3; height?: number; }) {
  return <group position={position}>
    <Block position={[0, height / 2, 0]} scale={[1.12, height, 0.72]} material={darkMaterial} />
    <Block position={[0, height / 2, 0.39]} scale={[0.92, height - 0.24, 0.055]} color="#3b4945" />
    {[0, 1, 2, 3, 4].map((n) => <group key={n}>
      <Block position={[0, 0.35 + n * (height - 0.45) / 5, 0.43]} scale={[0.73, 0.12, 0.025]} material={darkMaterial} soft={false} />
      <Block position={[0.32, 0.35 + n * (height - 0.45) / 5, 0.455]} scale={[0.027, 0.036, 0.012]} color={palette.sage} emissive />
    </group>)}
  </group>;
}

function Rooms({ lowPower }: Pick<EnvironmentProps, "lowPower">) {
  return <group>
    {/* Atrium columns frame the routes without enclosing the camera. */}
    {[-4.9, 4.9].map((x) => <Pillar key={x} position={[x, 0, -3.15]} height={4.45} />)}
    {[-4.9, 4.9].map((x) => <group key={x}>
      <Block position={[x, 0.39, 3.8]} scale={[0.88, 0.65, 1.45]} material={stoneMaterial} />
      <Block position={[x, 0.76, 3.8]} scale={[1.02, 0.11, 1.65]} material={metalMaterial} />
    </group>)}
    <ArchiveShelves />
    <group position={[-15, 0, -12]}>
      <BackWall position={[0, 0, -5.3]} width={10.75} height={3.5} />
      <Pillar position={[-5, 0, -4.5]} height={4.15} /><Pillar position={[5, 0, -4.5]} height={4.15} />
      <Inscription text="AI Laboratory" subtitle="02 / Systems & automation" position={[0, 4.5, -5]} color="#80bbb4" width={6.15} />
      <ServerRack position={[-3.8, 0.13, -4.13]} /><ServerRack position={[-2.35, 0.13, -4.13]} height={2.05} />
      <Block position={[3.22, 0.71, -3.5]} scale={[3.04, 0.19, 1.26]} material={metalMaterial} />
      <Block position={[3.22, 0.35, -3.5]} scale={[2.75, 0.64, 0.9]} material={darkMaterial} />
      <Block position={[3.23, 1.26, -3.76]} scale={[2.2, 0.8, 0.1]} color="#73938b" rotation={[-0.18, 0, 0]} emissive />
      <Block position={[3.23, 1.27, -3.65]} scale={[1.95, 0.6, 0.02]} material={darkMaterial} />
      {[0, 1, 2].map((n) => <Block key={n} position={[2.7 + n * 0.5, 1.22, -3.61]} scale={[0.32, 0.025, 0.02]} color={palette.cyan} emissive />)}
    </group>
    <group position={[15, 0, -12]}>
      <BackWall position={[0, 0, -5.3]} width={10.75} height={3.5} />
      <Pillar position={[-5, 0, -4.5]} height={4.15} /><Pillar position={[5, 0, -4.5]} height={4.15} />
      <Inscription text="Onchain Chamber" subtitle="03 / Connected ecosystems" position={[0, 4.5, -5]} color="#a6c58f" width={6.35} />
      {[-3.8, 3.8].map((x) => <group key={x}>
        <Block position={[x, 0.42, -3.1]} scale={[1.35, 0.75, 1.65]} material={stoneMaterial} />
        <Cylinder position={[x, 0.87, -3.1]} radius={0.5} height={0.12} color={palette.brass} />
        <mesh position={[x, 1.49, -3.1]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.52, 0.085, 8, 40]} /><meshStandardMaterial color={palette.metal} metalness={0.78} roughness={0.42} /></mesh>
      </group>)}
    </group>
    <group position={[-15, 0, 5]}>
      <group position={[-5.87, 0, 0]} rotation={[0, Math.PI / 2, 0]}><BackWall position={[0, 0, 0]} width={11.8} height={2.25} /></group>
      <Inscription text="Project Forge" subtitle="04 / Selected work" position={[0, 3.25, -5.4]} color="#d4ab79" width={5.8} />
      <Block position={[-5.8, 0.44, 1.1]} scale={[0.28, 0.88, 7.8]} material={stoneMaterial} />
      <Block position={[-5.8, 0.89, 1.1]} scale={[0.35, 0.07, 7.8]} material={brassMaterial} />
    </group>
    <group position={[15, 0, 5]}>
      <group position={[5.35, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><BackWall position={[0, 0, 0]} width={10.75} height={2.25} /></group>
      <Inscription text="Communication Terminal" subtitle="05 / Open a channel" position={[0, 3.25, -5]} color="#98becb" width={6.6} />
      <Block position={[4.65, 0.42, 1.05]} scale={[0.75, 0.64, 5.9]} material={stoneMaterial} />
      <Block position={[4.65, 0.79, 1.05]} scale={[0.84, 0.12, 6.1]} material={metalMaterial} />
      <Block position={[-4.62, 0.67, 1.8]} scale={[0.72, 1.24, 2.0]} material={darkMaterial} />
      <Block position={[-4.62, 1.39, 1.8]} scale={[0.78, 0.1, 2.1]} material={metalMaterial} />
      <Cylinder position={[0, 0.065, 3.65]} radius={2} height={0.055} color="#394843" segments={64} />
      <Ring position={[0, 0.099, 3.65]} radius={1.86} color={palette.edge} thickness={0.013} />
    </group>
    {/* Small lanterns give scale and warm wayfinding, without particle effects. */}
    {[-1, 1].map((side) => [-6.5, -9].map((z) => <group key={`${side}-${z}`} position={[side * 2.55, 0, z]}>
      <Block position={[0, 0.22, 0]} scale={[0.32, 0.39, 0.32]} material={darkMaterial} />
      <Block position={[0, 0.47, 0]} scale={[0.2, 0.16, 0.2]} color="#d2ae78" emissive />
      <Block position={[0, 0.6, 0]} scale={[0.31, 0.09, 0.31]} material={metalMaterial} />
    </group>))}
    {!lowPower && <>
      <pointLight position={[-15, 3, -12]} color="#9bccc1" intensity={13} distance={11} decay={2} />
      <pointLight position={[15, 3, -12]} color="#c1cfa0" intensity={11} distance={11} decay={2} />
      <pointLight position={[0, 3, -16]} color="#dab584" intensity={10} distance={9} decay={2} />
      <pointLight position={[-15, 3, 5]} color="#d8b489" intensity={11} distance={10} decay={2} />
    </>}
  </group>;
}

function ProjectObject({ index, accent }: { index: number; accent: string }) {
  if (index % 3 === 0) return <group rotation={[0, -0.18, 0]}>
    <Block position={[0, 1.34, 0]} scale={[0.96, 1.18, 0.62]} material={darkMaterial} />
    <Block position={[0, 1.37, 0.335]} scale={[0.73, 0.76, 0.055]} color={accent} emissive />
    <Block position={[0, 1.37, 0.37]} scale={[0.61, 0.62, 0.025]} color="#273a34" />
    {[0, 1, 2].map((n) => <Block key={n} position={[-0.1 + n * 0.1, 1.24 + n * 0.11, 0.398]} scale={[0.3 - n * 0.05, 0.035, 0.017]} color={accent} emissive />)}
    <Block position={[0, 1.99, 0]} scale={[1.05, 0.1, 0.73]} material={metalMaterial} />
  </group>;
  if (index % 3 === 1) return <group>
    <Cylinder position={[0, 1.1, 0]} radius={0.52} height={0.32} color={palette.metal} />
    <Cylinder position={[0, 1.43, 0]} radius={0.43} height={0.22} color={palette.dark} />
    <Cylinder position={[0, 1.7, 0]} radius={0.52} height={0.12} color={palette.metal} />
    <Ring position={[0, 1.4, 0]} radius={0.52} color={accent} />
    <Ring position={[0, 1.73, 0]} radius={0.45} color={accent} thickness={0.017} />
    <Block position={[0, 2.01, 0]} scale={[0.34, 0.42, 0.34]} color={accent} rotation={[0, Math.PI / 4, 0]} />
  </group>;
  return <group rotation={[0.08, 0.24, 0]}>
    <Block position={[0, 1.34, -0.06]} scale={[1.15, 0.9, 0.16]} material={metalMaterial} rotation={[-0.25, 0, 0]} />
    <Block position={[0, 1.35, 0.065]} scale={[0.98, 0.7, 0.025]} color="#243b33" rotation={[-0.25, 0, 0]} />
    <Block position={[0, 0.96, 0.15]} scale={[1.12, 0.11, 0.61]} material={metalMaterial} />
    {[0, 1, 2, 3].map((n) => <Block key={n} position={[-0.31 + n * 0.2, 1.26 + (n % 3) * 0.08, 0.145]} scale={[0.09, 0.12 + (n % 3) * 0.17, 0.026]} color={accent} emissive />)}
  </group>;
}

function Relic({ artifact, index }: { artifact: WorldArtifact; index: number }) {
  const { kind, accent } = artifact;
  if (kind === "identity") return <>
    <Cylinder position={[0, 0.38, 0]} radius={0.91} height={0.63} color={palette.stoneLight} />
    <Cylinder position={[0, 0.73, 0]} radius={1.03} height={0.12} color={palette.metal} />
    <Block position={[0, 1.54, 0]} scale={[1.06, 1.57, 0.62]} material={darkMaterial} rotation={[0, -0.22, 0]} />
    <Block position={[0.07, 1.54, 0.34]} scale={[0.8, 1.27, 0.045]} color="#6b8376" rotation={[0, -0.22, 0]} />
    <Block position={[0.06, 1.54, 0.39]} scale={[0.57, 1.04, 0.045]} material={darkMaterial} rotation={[0, -0.22, 0]} />
    <Block position={[0.04, 1.53, 0.435]} scale={[0.065, 0.71, 0.028]} color={accent} emissive rotation={[0, -0.22, 0]} />
    <Block position={[0.17, 1.67, 0.46]} scale={[0.065, 0.44, 0.028]} color={accent} emissive rotation={[0, -0.22, -0.68]} />
    <Block position={[0.18, 1.36, 0.46]} scale={[0.065, 0.39, 0.028]} color={accent} emissive rotation={[0, -0.22, 0.68]} />
    <Block position={[0, 2.43, 0]} scale={[1.34, 0.1, 0.81]} material={brassMaterial} rotation={[0, -0.22, 0]} />
    <Ring position={[0, 0.81, 0]} radius={0.86} color={accent} thickness={0.018} />
  </>;
  if (kind === "archive") return <>
    <Block position={[0, 0.43, 0]} scale={[1.25, 0.75, 1.04]} material={stoneMaterial} />
    <Block position={[0, 0.89, 0]} scale={[1.65, 0.2, 1.25]} material={metalMaterial} rotation={[-0.18, 0, 0]} />
    {[-1, 1].map((side) => <group key={side} rotation={[0, 0, side * -0.13]}>
      <Block position={[side * 0.39, 1.13, 0]} scale={[0.76, 0.12, 0.93]} color="#b7b8a3" rotation={[-0.18, 0, 0]} />
      {[0, 1, 2].map((n) => <Block key={n} position={[side * 0.39, 1.2 + (n - 1) * 0.029, -0.22 + n * 0.19]} scale={[0.53, 0.012, 0.018]} material={brassMaterial} />)}
    </group>)}
    <Ring position={[0, 0.15, 0]} radius={0.95} thickness={0.017} color={accent} />
  </>;
  if (kind === "ai") return <>
    <Cylinder position={[0, 0.28, 0]} radius={0.93} height={0.45} color={palette.stoneLight} />
    <Cylinder position={[0, 0.54, 0]} radius={0.78} height={0.16} color={palette.metal} />
    <Cylinder position={[0, 1.21, 0]} radius={0.28} height={1.2} color="#8a9c90" />
    {[0, 1, 2, 3].map((n) => <group key={n}>
      <Cylinder position={[0, 0.81 + n * 0.31, 0]} radius={0.49} height={0.09} color={palette.dark} />
      <Ring position={[0, 0.84 + n * 0.31, 0]} radius={0.46} color={accent} thickness={0.017} />
    </group>)}
    <Cylinder position={[0, 2.06, 0]} radius={0.74} height={0.2} color={palette.metal} />
    {[-1, 1].map((side) => <Block key={side} position={[side * 0.63, 1.3, 0]} scale={[0.1, 1.59, 0.18]} material={brassMaterial} />)}
  </>;
  if (kind === "chain") return <>
    <Cylinder position={[0, 0.37, 0]} radius={0.91} height={0.62} color={palette.stoneLight} />
    <Cylinder position={[0, 0.72, 0]} radius={1.01} height={0.12} color={palette.metal} />
    {[0, 1, 2].map((n) => <mesh key={n} position={[(n - 1) * 0.36, 1.17 + n * 0.35, 0]} rotation={[n % 2 ? Math.PI / 2 : 0, 0, -0.65]} scale={[0.7, 1, 1]} castShadow>
      <torusGeometry args={[0.5, 0.12, 12, 48]} /><meshStandardMaterial color={n === 1 ? accent : palette.metal} metalness={0.75} roughness={0.35} />
    </mesh>)}
  </>;
  if (kind === "terminal") return <>
    <Block position={[0, 0.4, 0]} scale={[1.65, 0.69, 1.1]} material={stoneMaterial} />
    <Block position={[0, 0.86, 0.15]} scale={[1.8, 0.17, 1.12]} material={metalMaterial} />
    <Block position={[0, 1.54, -0.23]} scale={[1.66, 1.16, 0.2]} material={metalMaterial} rotation={[-0.2, 0, 0]} />
    <Block position={[0, 1.55, -0.09]} scale={[1.41, 0.9, 0.03]} color="#223a33" rotation={[-0.2, 0, 0]} />
    {[0, 1, 2].map((n) => <Block key={n} position={[-0.15, 1.35 + n * 0.19, -0.035 - n * 0.035]} scale={[0.81 - n * 0.18, 0.035, 0.035]} color={accent} emissive />)}
    <Block position={[0, 0.97, 0.37]} scale={[1.16, 0.035, 0.31]} material={darkMaterial} />
    <Block position={[0.61, 0.98, 0.37]} scale={[0.055, 0.035, 0.11]} color={accent} emissive />
  </>;
  return <>
    <Block position={[0, 0.4, 0]} scale={[1.37, 0.68, 1.37]} material={stoneMaterial} />
    <Block position={[0, 0.79, 0]} scale={[1.52, 0.13, 1.52]} material={metalMaterial} />
    <Block position={[0, 0.48, 0.701]} scale={[0.45, 0.035, 0.025]} color={accent} emissive />
    <ProjectObject index={index} accent={accent} />
  </>;
}

function Artifact({ artifact, index, onNavigate, reducedMotion }: { artifact: WorldArtifact; index: number } & Pick<EnvironmentProps, "onNavigate" | "reducedMotion">) {
  const [hovered, setHovered] = useState(false);
  const halo = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (halo.current) {
      const material = halo.current.material as THREE.MeshBasicMaterial;
      material.opacity = hovered ? 0.65 : reducedMotion ? 0.18 : 0.16 + Math.sin(clock.elapsedTime * 1.1 + index) * 0.045;
    }
  });
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onNavigate(artifact.position, artifact.id); };
  return <group position={[artifact.position[0], 0, artifact.position[1]]} onClick={click} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
    <Relic artifact={artifact} index={index} />
    <mesh ref={halo} position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[artifact.kind === "project" ? 0.99 : 1.16, artifact.kind === "project" ? 1.035 : 1.205, 64]} /><meshBasicMaterial color={artifact.accent} transparent opacity={0.2} depthWrite={false} /></mesh>
    <Inscription text={artifact.label} subtitle={hovered ? "Approach · inspect" : undefined} position={[0, artifact.kind === "identity" ? 3.18 : artifact.kind === "project" ? 2.64 : 2.9, 0]} color={artifact.accent} width={artifact.kind === "project" ? 3.7 : 4.7} height={0.9} />
  </group>;
}

export default function Environment({ artifacts, onNavigate, entered, reducedMotion, lowPower }: EnvironmentProps) {
  return <group>
    <Floor onNavigate={onNavigate} />
    <Rooms lowPower={lowPower} />
    <Gate entered={entered} reducedMotion={reducedMotion} />
    {artifacts.map((artifact, index) => <Artifact key={artifact.id} artifact={artifact} index={index} onNavigate={onNavigate} reducedMotion={reducedMotion} />)}
  </group>;
}
