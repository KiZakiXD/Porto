"use client";

import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  ExtrudeGeometry,
  Group,
  MathUtils,
  Mesh,
  PMREMGenerator,
  Shape,
  Vector3,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Quality = "low" | "normal" | "ultra";
export type WorldProps = {
  progress: RefObject<number>;
  pointer: RefObject<[number, number]>;
  exploded: boolean;
  paused: boolean;
  quality: Quality;
  network: number;
  selected: number;
  onReady: () => void;
  onFailure: () => void;
  renderRef: RefObject<(() => void) | null>;
};

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const map = generator.fromScene(room, 0.04);
    scene.environment = map.texture;
    return () => {
      scene.environment = null;
      map.dispose();
      room.dispose();
      generator.dispose();
    };
  }, [gl, scene]);
  return null;
}

function arcGeometry(
  radius: number,
  thickness: number,
  start: number,
  end: number,
  quality: Quality,
) {
  const shape = new Shape();
  shape.absarc(0, 0, radius + thickness, start, end, false);
  shape.lineTo(
    Math.cos(end) * (radius - thickness),
    Math.sin(end) * (radius - thickness),
  );
  shape.absarc(0, 0, radius - thickness, end, start, true);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.055,
    bevelSegments: quality === "low" ? 1 : 3,
    curveSegments: quality === "ultra" ? 36 : quality === "normal" ? 22 : 12,
    steps: 1,
  });
  return geometry;
}

function Segment({
  radius,
  index,
  quality,
  expansion,
  warm,
}: {
  radius: number;
  index: number;
  quality: Quality;
  expansion: RefObject<number>;
  warm: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const middle = (index * Math.PI) / 3 + Math.PI / 6;
  const { geometry, original } = useMemo(() => {
    const geometry = arcGeometry(
      radius,
      warm ? 0.065 : 0.13,
      (index * Math.PI) / 3 + 0.045,
      ((index + 1) * Math.PI) / 3 - 0.045,
      quality,
    );
    geometry.computeBoundingBox();
    const center = geometry.boundingBox!.getCenter(new Vector3());
    geometry.translate(-center.x, -center.y, -center.z);
    return { geometry, original: [center.x, center.y] as const };
  }, [radius, index, quality, warm]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(() => {
    if (!mesh.current) return;
    const e = expansion.current;
    mesh.current.position.set(
      original[0] + Math.cos(middle) * e * 1.15,
      original[1] + Math.sin(middle) * e * 1.15,
      (index % 2 ? 1 : -1) * e * 0.45,
    );
    mesh.current.rotation.z = (index % 2 ? 1 : -1) * e * 0.16;
  });
  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      position={[original[0], original[1], 0]}
    >
      <meshPhysicalMaterial
        color={warm ? "#ff5936" : "#e6e5dc"}
        metalness={warm ? 0.55 : 1}
        roughness={warm ? 0.22 : 0.16}
        clearcoat={1}
        clearcoatRoughness={0.15}
        envMapIntensity={1.7}
        emissive={warm ? "#d82e10" : "#000000"}
        emissiveIntensity={warm ? 0.22 : 0}
      />
    </mesh>
  );
}

function Satellite({ quality }: { quality: Quality }) {
  const panels = useMemo(
    () => Array.from({ length: quality === "low" ? 4 : 8 }, (_, i) => i),
    [quality],
  );
  return (
    <group scale={0.35}>
      <mesh>
        <boxGeometry args={[0.75, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#aaa89c"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.7, 0]} rotation={[0.25, 0, 0]}>
        <coneGeometry args={[0.55, 0.18, 24]} />
        <meshStandardMaterial
          color="#e9e5dc"
          metalness={0.9}
          roughness={0.2}
          side={2}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 4.8, 8]} />
        <meshStandardMaterial color="#ccc7b5" metalness={1} roughness={0.25} />
      </mesh>
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 1.65, 0, 0]}
          rotation={[0.1, -0.2, 0]}
        >
          <mesh>
            <boxGeometry args={[1.8, 1.05, 0.035]} />
            <meshStandardMaterial
              color="#141c29"
              metalness={0.45}
              roughness={0.35}
            />
          </mesh>
          {panels.map((i) => (
            <mesh
              key={i}
              position={[
                -0.78 + (i * 1.56) / Math.max(1, panels.length - 1),
                0,
                0.025,
              ]}
            >
              <boxGeometry args={[0.01, 0.98, 0.01]} />
              <meshBasicMaterial color="#7a87a0" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Dust({ quality }: { quality: Quality }) {
  const positions = useMemo(() => {
    const count = quality === "low" ? 100 : quality === "normal" ? 240 : 500;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const hash = (n: number) => {
        const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
        return s - Math.floor(s);
      };
      array[i * 3] = (hash(i + 1) - 0.5) * 36;
      array[i * 3 + 1] = (hash(i + 200) - 0.5) * 22;
      array[i * 3 + 2] = -5 - hash(i + 400) * 15;
    }
    return array;
  }, [quality]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c4bba8"
        size={0.018}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function Machine({
  phase,
  pointer,
  paused,
  assembly,
}: {
  phase: RefObject<number>;
  pointer: RefObject<[number, number]>;
  paused: boolean;
  assembly: RefObject<Group | null>;
}) {
  const body = useRef<Group>(null),
    head = useRef<Group>(null),
    arm = useRef<Group>(null),
    time = useRef(0);
  const torso = useMemo(
    () => new RoundedBoxGeometry(0.88, 0.86, 0.46, 3, 0.14),
    [],
  );
  useEffect(() => () => torso.dispose(), [torso]);
  useFrame((_, delta) => {
    if (!body.current || !head.current || !arm.current) return;
    if (!paused) time.current += Math.min(delta, 0.06);
    body.current.visible = phase.current > 0.001;
    if (assembly.current)
      body.current.quaternion.copy(assembly.current.quaternion).invert();
    body.current.scale.setScalar(Math.max(0.001, phase.current * 1.6));
    body.current.position.set(0, Math.sin(time.current * 0.7) * 0.035, 4.0);
    if (assembly.current)
      body.current.position.applyQuaternion(body.current.quaternion);
    head.current.rotation.set(
      pointer.current[1] * -0.1,
      pointer.current[0] * 0.18,
      Math.sin(time.current * 0.5) * 0.025,
    );
    arm.current.rotation.z = -0.16 + Math.sin(time.current * 0.6) * 0.035;
  });
  return (
    <group ref={body} scale={0.001}>
      <group ref={head} position={[0, 0.77, 0]}>
        <mesh scale={[0.88, 1, 0.9]}>
          <sphereGeometry args={[0.43, 36, 24]} />
          <meshPhysicalMaterial
            color="#ded9cb"
            metalness={0.85}
            roughness={0.17}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0.01, 0.29]} scale={[1, 0.45, 0.48]}>
          <sphereGeometry args={[0.36, 32, 16]} />
          <meshPhysicalMaterial
            color="#080d10"
            metalness={0.65}
            roughness={0.08}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0, 0.464]}>
          <boxGeometry args={[0.25, 0.018, 0.016]} />
          <meshBasicMaterial color="#ff653d" />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.36, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.09, 0.09, 0.08, 16]} />
            <meshStandardMaterial
              color="#35332d"
              metalness={1}
              roughness={0.28}
            />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.25, 12]} />
        <meshStandardMaterial
          color="#383b3b"
          metalness={0.85}
          roughness={0.35}
        />
      </mesh>
      <mesh geometry={torso} position={[0, -0.03, 0]}>
        <meshPhysicalMaterial
          color="#d0c9bb"
          metalness={0.8}
          roughness={0.24}
          clearcoat={1}
        />
      </mesh>
      <mesh position={[0, 0.07, 0.237]}>
        <boxGeometry args={[0.33, 0.04, 0.025]} />
        <meshBasicMaterial color="#ff653d" />
      </mesh>
      <mesh position={[0, -0.64, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.34]} />
        <meshStandardMaterial color="#181b1c" metalness={0.8} roughness={0.3} />
      </mesh>
      {[-1, 1].map((side) => (
        <group
          key={side}
          ref={side === 1 ? arm : undefined}
          position={[side * 0.58, 0.13, 0]}
          rotation={[0, 0, side * 0.16]}
        >
          <mesh>
            <sphereGeometry args={[0.18, 20, 14]} />
            <meshStandardMaterial
              color="#3d3e38"
              metalness={1}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -0.29, 0]}>
            <capsuleGeometry args={[0.12, 0.3, 6, 12]} />
            <meshPhysicalMaterial
              color="#dad3c4"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
          <mesh position={[0, -0.54, 0]}>
            <sphereGeometry args={[0.13, 16, 12]} />
            <meshStandardMaterial
              color="#383b39"
              metalness={1}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -0.77, 0.1]} rotation={[-0.3, 0, 0]}>
            <capsuleGeometry args={[0.1, 0.25, 6, 12]} />
            <meshPhysicalMaterial
              color="#c1b9a7"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, -1, 0.16]} scale={[0.85, 1.2, 0.9]}>
            <sphereGeometry args={[0.12, 16, 12]} />
            <meshStandardMaterial
              color="#1c2122"
              metalness={0.8}
              roughness={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const poses = [
  { p: 0, x: 1.7, y: 0.2, s: 0.95, rx: -0.5, ry: -0.45, rz: 0.1, e: 0 },
  { p: 0.19, x: -1.65, y: 0, s: 0.83, rx: 0.5, ry: 0.6, rz: -0.35, e: 0.8 },
  { p: 0.38, x: 1.55, y: 0.05, s: 0.8, rx: 1.0, ry: -0.15, rz: 0.5, e: 0.15 },
  { p: 0.57, x: -2.35, y: 0.3, s: 0.67, rx: -0.35, ry: 0.9, rz: 0.1, e: 1.0 },
  { p: 0.79, x: 2.5, y: 0.3, s: 0.65, rx: 0.4, ry: 1.0, rz: -0.2, e: 0.25 },
  { p: 1, x: 0, y: 0.6, s: 0.85, rx: 0.2, ry: 0.25, rz: 0.5, e: 0.65 },
];

function Assembly(props: WorldProps) {
  const group = useRef<Group>(null),
    inner = useRef<Group>(null),
    middle = useRef<Group>(null),
    satellite = useRef<Group>(null),
    core = useRef<Mesh>(null);
  const expansion = useRef(0),
    spin = useRef(0),
    ready = useRef(false),
    machinePhase = useRef(0);
  const { size, camera, invalidate } = useThree();
  const target = useMemo(() => new Vector3(), []);
  useEffect(() => {
    const update = () => invalidate();
    props.renderRef.current = invalidate;
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("pointermove", update, { passive: true });
    invalidate();
    return () => {
      if (props.renderRef.current === invalidate)
        props.renderRef.current = null;
      window.removeEventListener("scroll", update);
      window.removeEventListener("pointermove", update);
    };
  }, [
    invalidate,
    props.paused,
    props.exploded,
    props.network,
    props.selected,
    props.quality,
    props.renderRef,
  ]);
  useFrame((_, delta) => {
    if (!ready.current) {
      ready.current = true;
      props.onReady();
    }
    if (
      !group.current ||
      !inner.current ||
      !middle.current ||
      !satellite.current ||
      !core.current
    )
      return;
    const progress = MathUtils.clamp(props.progress.current, 0, 1);
    const next = poses.findIndex((pose) => pose.p > progress);
    const n = next === -1 ? poses.length - 2 : Math.max(0, next - 1);
    const a = poses[n],
      b = poses[n + 1];
    const t = MathUtils.smoothstep(progress, a.p, b.p);
    const blend = (key: "x" | "y" | "s" | "rx" | "ry" | "rz" | "e") =>
      MathUtils.lerp(a[key], b[key], t);
    const mobile = size.width < 901;
    const ease = props.paused ? 1 : 1 - Math.exp(-Math.min(delta, 0.06) * 5);
    const ex = props.exploded ? 1.2 : blend("e");
    machinePhase.current =
      MathUtils.smoothstep(progress, 0.45, 0.53) *
      (1 - MathUtils.smoothstep(progress, 0.65, 0.73));
    expansion.current = MathUtils.lerp(expansion.current, ex, ease);
    if (!props.paused) spin.current += Math.min(delta, 0.06) * 0.11;
    target.set(
      mobile ? 0.05 : blend("x"),
      mobile
        ? 0.8 + MathUtils.smoothstep(progress, 0.1, 0.17) * 1.05
        : blend("y"),
      0,
    );
    group.current.position.lerp(target, ease);
    const scale = blend("s") * (mobile ? 0.53 : size.width < 1100 ? 0.8 : 1);
    group.current.scale.setScalar(scale);
    group.current.rotation.set(
      blend("rx") + props.pointer.current[1] * 0.08,
      blend("ry") + props.pointer.current[0] * 0.15,
      blend("rz"),
    );
    inner.current.rotation.set(
      0.75 + expansion.current * 0.3,
      -0.5 + spin.current * 0.65,
      spin.current + props.selected * 0.08,
    );
    middle.current.rotation.set(
      1.6 - expansion.current * 0.3,
      0.25 + props.network * 0.25,
      -spin.current * 0.5,
    );
    core.current.rotation.set(spin.current * 0.35, spin.current * 0.7, 0.15);
    core.current.scale.setScalar(Math.max(0.001, 1 - machinePhase.current));
    satellite.current.position.set(
      Math.cos(spin.current * 0.8 + 1) * 3.8,
      Math.sin(spin.current * 0.8 + 1) * 2.4,
      -0.8,
    );
    satellite.current.rotation.set(0.25, spin.current * 0.3, -0.15);
    camera.position.x = props.pointer.current[0] * 0.09;
    camera.position.y = props.pointer.current[1] * 0.05;
    camera.lookAt(0, 0, 0);
  }, -1);
  return (
    <group ref={group}>
      <group ref={inner}>
        {Array.from({ length: 6 }, (_, i) => (
          <Segment
            key={i}
            radius={1.55}
            index={i}
            quality={props.quality}
            expansion={expansion}
            warm={false}
          />
        ))}
      </group>
      <group ref={middle}>
        {Array.from({ length: 6 }, (_, i) => (
          <Segment
            key={i}
            radius={2.05}
            index={i}
            quality={props.quality}
            expansion={expansion}
            warm={false}
          />
        ))}
      </group>
      <group rotation={[0.35, -0.5, 0.5]}>
        {Array.from({ length: 6 }, (_, i) => (
          <Segment
            key={i}
            radius={2.45}
            index={i}
            quality={props.quality}
            expansion={expansion}
            warm
          />
        ))}
      </group>
      <mesh ref={core}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshPhysicalMaterial
          color="#ff633e"
          metalness={0.65}
          roughness={0.13}
          clearcoat={1}
          envMapIntensity={2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry
          args={[0.98, 0.018, 8, props.quality === "low" ? 40 : 80]}
        />
        <meshBasicMaterial color="#ff7149" />
      </mesh>
      <Machine
        phase={machinePhase}
        pointer={props.pointer}
        paused={props.paused}
        assembly={group}
      />
      <group ref={satellite}>
        <Satellite quality={props.quality} />
      </group>
      {[-1, 1].map((sign) => (
        <mesh
          key={sign}
          position={[sign * 3.8, sign * 1.65, -2.5]}
          rotation={[0.8, 0.4, 0.3]}
        >
          <icosahedronGeometry args={[0.18, 1]} />
          <meshStandardMaterial
            color="#655e53"
            metalness={0.2}
            roughness={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function KineticWorld(props: WorldProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return (
    <SceneBoundary onFailure={props.onFailure}>
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 43 }}
        dpr={
          props.quality === "low"
            ? 1
            : props.quality === "normal"
              ? [1, 1.5]
              : [1, 2]
        }
        frameloop={!visible ? "never" : props.paused ? "demand" : "always"}
        gl={{
          antialias: props.quality !== "low",
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new Color("#11100e"), 0);
          gl.domElement.addEventListener("webglcontextlost", props.onFailure, {
            once: true,
          });
        }}
        fallback={null}
      >
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[4, 5, 5]}
          intensity={2.7}
          color="#fff1d9"
        />
        <directionalLight
          position={[-4, -1, 3]}
          intensity={2.2}
          color="#ff6e43"
        />
        <pointLight position={[0, 3, -3]} intensity={30} color="#f9e8c6" />
        <Environment />
        <Dust quality={props.quality} />
        <Assembly {...props} />
      </Canvas>
    </SceneBoundary>
  );
}
