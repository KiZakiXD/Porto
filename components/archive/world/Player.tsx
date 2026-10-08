'use client';

import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';

export interface PlayerMotion {
  position: Vector3;
  heading: number;
  moving: boolean;
  interactionUntil: number;
}

interface PlayerProps {
  motion: MutableRefObject<PlayerMotion>;
  entered: boolean;
  reducedMotion: boolean;
}

const JACKET = '#242e31';
const JACKET_LIGHT = '#303b3e';
const TROUSERS = '#151c20';
const SKIN = '#c49a7e';

/** A deliberately quiet, human-proportioned developer, animated as one small rig. */
export default function Player({ motion, entered, reducedMotion }: PlayerProps) {
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftKnee = useRef<Group>(null);
  const rightKnee = useRef<Group>(null);
  const phase = useRef(0);
  const stride = useRef(0);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const player = motion.current;
    if (!root.current || !body.current) return;
    root.current.position.copy(player.position);
    const turn = Math.atan2(Math.sin(player.heading - root.current.rotation.y), Math.cos(player.heading - root.current.rotation.y));
    root.current.rotation.y += turn * (1 - Math.exp(-dt * 14));
    stride.current = MathUtils.damp(stride.current, player.moving ? 1 : 0, 12, dt);
    if (player.moving) phase.current += dt * 9.5;
    const walk = Math.sin(phase.current) * stride.current;
    const interaction = clock.elapsedTime < player.interactionUntil;
    const breath = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.9) * 0.008;
    body.current.position.y = breath + (reducedMotion ? 0 : Math.abs(Math.sin(phase.current)) * stride.current * 0.021);
    body.current.rotation.z = reducedMotion ? 0 : walk * 0.014;
    if (leftLeg.current) leftLeg.current.rotation.x = walk * 0.53;
    if (rightLeg.current) rightLeg.current.rotation.x = -walk * 0.53;
    if (leftKnee.current) leftKnee.current.rotation.x = Math.max(0, -walk) * 0.56;
    if (rightKnee.current) rightKnee.current.rotation.x = Math.max(0, walk) * 0.56;
    if (leftArm.current) leftArm.current.rotation.x = -walk * 0.38;
    if (rightArm.current) rightArm.current.rotation.x = MathUtils.damp(rightArm.current.rotation.x, interaction ? -1.14 : walk * 0.38, 12, dt);
  });

  return (
    <group ref={root} visible={entered} position={[0, 0.06, 5]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[0.43, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.016, 0]}>
        <ringGeometry args={[0.52, 0.54, 48]} />
        <meshBasicMaterial color="#9bcab8" transparent opacity={0.48} depthWrite={false} />
      </mesh>
      <group ref={body}>
        <mesh position={[0, 1.18, 0]} castShadow>
          <capsuleGeometry args={[0.235, 0.34, 8, 16]} />
          <meshStandardMaterial color={JACKET} roughness={0.94} />
        </mesh>
        <mesh position={[0, 1.40, -0.02]} scale={[1.21, 0.49, 0.78]} castShadow>
          <sphereGeometry args={[0.26, 20, 14]} />
          <meshStandardMaterial color={JACKET_LIGHT} roughness={0.94} />
        </mesh>
        <mesh position={[0, 0.935, 0]} scale={[1.03, 0.43, 0.9]} castShadow>
          <sphereGeometry args={[0.232, 18, 12]} />
          <meshStandardMaterial color={TROUSERS} roughness={1} />
        </mesh>
        {/* Zipper, stitched pockets and a small archive key on the chest. */}
        <mesh position={[0, 1.205, 0.236]}>
          <boxGeometry args={[0.012, 0.42, 0.009]} />
          <meshStandardMaterial color="#566060" metalness={0.35} roughness={0.6} />
        </mesh>
        <mesh position={[-0.117, 1.081, 0.21]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[0.13, 0.015, 0.012]} />
          <meshStandardMaterial color="#566060" roughness={0.92} />
        </mesh>
        <mesh position={[0.117, 1.081, 0.21]} rotation={[0, 0, 0.22]}>
          <boxGeometry args={[0.13, 0.015, 0.012]} />
          <meshStandardMaterial color="#566060" roughness={0.92} />
        </mesh>
        <mesh position={[-0.126, 1.365, 0.20]} rotation={[0.05, -0.10, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.026]} />
          <meshStandardMaterial color="#94c7b4" emissive="#628d7c" emissiveIntensity={0.35} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.49, 0.015]} castShadow>
          <cylinderGeometry args={[0.075, 0.08, 0.15, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.88} />
        </mesh>
        {/* The hood is a soft silhouette behind the head, with a restrained face. */}
        <mesh position={[0, 1.54, -0.075]} scale={[1, 0.86, 1]} castShadow>
          <sphereGeometry args={[0.20, 20, 16]} />
          <meshStandardMaterial color={JACKET} roughness={1} />
        </mesh>
        <mesh position={[0, 1.704, 0.021]} scale={[0.88, 1.14, 0.91]} castShadow>
          <sphereGeometry args={[0.17, 24, 18]} />
          <meshStandardMaterial color={SKIN} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.738, -0.017]} scale={[0.94, 1, 0.92]} castShadow>
          <sphereGeometry args={[0.172, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.59]} />
          <meshStandardMaterial color="#202626" roughness={1} />
        </mesh>
        <mesh position={[0, 1.696, 0.17]} scale={[0.7, 1, 1]}>
          <sphereGeometry args={[0.023, 8, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.94} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={`eye-${side}`} position={[side * 0.054, 1.731, 0.161]}>
            <sphereGeometry args={[0.010, 6, 6]} />
            <meshStandardMaterial color="#292d2a" roughness={1} />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <group key={`arm-${side}`} ref={side < 0 ? leftArm : rightArm} position={[side * 0.30, 1.408, 0]} rotation={[0, 0, side * 0.085]}>
            <mesh position={[0, -0.164, 0]} castShadow>
              <capsuleGeometry args={[0.088, 0.205, 6, 12]} />
              <meshStandardMaterial color={JACKET_LIGHT} roughness={0.96} />
            </mesh>
            <group position={[0, -0.336, 0]} rotation={[-0.09, 0, 0]}>
              <mesh position={[0, -0.124, 0]} castShadow>
                <capsuleGeometry args={[0.073, 0.19, 6, 12]} />
                <meshStandardMaterial color={JACKET} roughness={0.97} />
              </mesh>
              <mesh position={[0, -0.269, 0.007]} scale={[0.78, 1, 0.65]} castShadow>
                <capsuleGeometry args={[0.069, 0.055, 6, 12]} />
                <meshStandardMaterial color={SKIN} roughness={0.92} />
              </mesh>
              {side > 0 && (
                <mesh position={[0, -0.215, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.077, 0.077, 0.04, 12]} />
                  <meshStandardMaterial color="#719989" metalness={0.7} roughness={0.35} />
                </mesh>
              )}
            </group>
          </group>
        ))}
        {[-1, 1].map((side) => (
          <group key={`leg-${side}`} ref={side < 0 ? leftLeg : rightLeg} position={[side * 0.12, 0.947, 0]}>
            <mesh position={[0, -0.185, 0]} castShadow>
              <capsuleGeometry args={[0.103, 0.25, 6, 12]} />
              <meshStandardMaterial color={TROUSERS} roughness={0.97} />
            </mesh>
            <group ref={side < 0 ? leftKnee : rightKnee} position={[0, -0.395, 0]}>
              <mesh position={[0, -0.19, -0.005]} castShadow>
                <capsuleGeometry args={[0.080, 0.27, 6, 12]} />
                <meshStandardMaterial color="#1d2528" roughness={0.97} />
              </mesh>
              <mesh position={[0, -0.469, 0.060]} rotation={[Math.PI / 2, 0, 0]} scale={[1.04, 1, 0.62]} castShadow>
                <capsuleGeometry args={[0.091, 0.12, 6, 12]} />
                <meshStandardMaterial color="#353f3f" roughness={0.86} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
