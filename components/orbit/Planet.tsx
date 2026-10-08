'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BackSide, Color, DoubleSide, Group, Mesh, ShaderMaterial } from 'three'
import type { OrbitalSystem } from '@/data/orbit'
import { PLANET_RADIUS } from '@/lib/orbit-flight'

const noiseGLSL = `
#ifndef ORBIT_NOISE_OCTAVES
#define ORBIT_NOISE_OCTAVES 4
#endif
float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) {
  float value = 0.0, amplitude = 0.533;
  mat3 turn = mat3(0.0,0.8,0.6,-0.8,0.36,-0.48,-0.6,-0.48,0.64);
  for(int i=0; i<ORBIT_NOISE_OCTAVES; i++) {
    value += amplitude * noise3(p);
    p = turn * p * 2.04 + vec3(3.1,7.4,2.3);
    amplitude *= 0.48;
  }
  // Preserve the overall surface brightness when lower-power rendering uses fewer layers.
  return value * (1.0-pow(0.48,4.0)) / (1.0-pow(0.48,float(ORBIT_NOISE_OCTAVES)));
}
`

const surfaceVertex = `
uniform float uSeed;
varying vec3 vLocal;
varying vec3 vWorld;
varying vec3 vNormal;
${noiseGLSL}
void main() {
  vLocal = normalize(position);
  float elevation = noise3(vLocal * 18.0 + uSeed) * 0.012 + noise3(vLocal * 6.0 + uSeed) * 0.024;
  vec3 displaced = position + normal * elevation;
  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const surfaceFragment = `
uniform vec3 uSurface;
uniform vec3 uAccent;
uniform float uSeed;
varying vec3 vLocal;
varying vec3 vWorld;
varying vec3 vNormal;
${noiseGLSL}
void main() {
  vec3 p = normalize(vLocal);
  float tectonic = fbm(p * 3.45 + vec3(uSeed,1.7,9.2));
  float relief = fbm(p * 12.5 + tectonic * 3.0 + vec3(2.3,uSeed,1.7));
  float fine = noise3(p * 154.0 + uSeed);
  float ridges = 1.0 - abs(noise3(p * 45.0 + relief * 3.5) * 2.0 - 1.0);
  // Fine grain belongs in the matte color, not in the lighting normal: a
  // high-frequency derivative becomes glitter at ordinary screen resolutions.
  float height = tectonic * 0.30 + relief * 0.25 + ridges * 0.006;
  // Screen-space derivatives give the geology actual, sharply lit surface relief.
  vec3 N = normalize(vNormal);
  vec3 px = dFdx(vWorld), py = dFdy(vWorld);
  vec3 rx = cross(py,N), ry = cross(N,px);
  float determinant = dot(px,rx);
  vec3 gradient = sign(determinant) * (dFdx(height)*rx + dFdy(height)*ry);
  N = normalize(abs(determinant)*N - gradient * 0.11);
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 L = normalize(vec3(-0.65,0.85,1.1));
  vec3 rimLight = normalize(vec3(0.8,0.1,-0.8));
  float land = smoothstep(0.34,0.70,tectonic);
  float strata = smoothstep(0.70,0.94,fract(relief*10.0+tectonic*3.0));
  vec3 albedo = mix(vec3(0.016,0.024,0.025),uSurface*1.30,land);
  albedo *= 0.68 + relief*0.65 + fine*0.035;
  albedo += uAccent * strata * land * 0.030;
  float diffuse = max(dot(N,L),0.0);
  float day = smoothstep(-0.15,0.44,dot(normalize(vNormal),L));
  float broadSpec = pow(max(dot(N,normalize(L+V)),0.0),28.0);
  float sharpSpec = pow(max(dot(N,normalize(L+V)),0.0),128.0);
  float fresnel = pow(1.0-max(dot(N,V),0.0),4.0);
  vec3 color = albedo * (0.16 + diffuse*2.25);
  color += vec3(0.81,0.84,0.73)*broadSpec*0.028*day;
  color += uAccent*sharpSpec*0.020*day;
  color += vec3(0.56,0.39,0.21)*pow(max(dot(N,rimLight),0.0),2.0)*0.15;
  color += uAccent*fresnel*0.034*day;
  // Thin, mineral seams; light stays in the material rather than blooming outward.
  float seam = smoothstep(0.986,0.999, ridges) * smoothstep(0.57,0.73,tectonic);
  color += uAccent*seam*0.018;
  gl_FragColor = vec4(color,1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

const atmosphereVertex = `
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position,1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix)*normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`
const atmosphereFragment = `
uniform vec3 uAccent;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec3 normal = normalize(vNormal);
  vec3 view = normalize(cameraPosition-vWorld);
  float edge = pow(1.0-abs(dot(normal,view)),4.2);
  float daylight = 0.30+0.70*max(dot(normal,normalize(vec3(-0.65,0.85,1.1))),0.0);
  gl_FragColor = vec4(uAccent, edge*daylight*0.30);
  #include <colorspace_fragment>
}
`
const ringVertex = `
varying vec2 vPosition;
void main() {
  vPosition = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`
const ringFragment = `
uniform vec3 uAccent;
varying vec2 vPosition;
void main() {
  float radius = length(vPosition);
  float edge = smoothstep(3.02,3.18,radius)*(1.0-smoothstep(4.20,4.38,radius));
  float thin = pow(0.5+0.5*sin(radius*310.0),15.0);
  float bands = 0.20 + 0.30*sin(radius*28.0) + thin*0.22;
  float variation = 0.60+0.40*cos(atan(vPosition.y,vPosition.x)-0.7);
  float alpha = edge*max(bands,0.02)*variation*0.26;
  gl_FragColor = vec4(mix(vec3(0.43,0.47,0.42),uAccent,0.35),alpha);
  #include <colorspace_fragment>
}
`

interface PlanetProps { system: OrbitalSystem; paused: boolean; reducedMotion: boolean; lowPower: boolean }

function OrbitWire({ radius, rotation, opacity, color }: { radius: number; rotation: [number,number,number]; opacity: number; color: string }) {
  const points = useMemo(() => {
    const array = new Float32Array(240*3)
    for (let i=0;i<240;i++) { const a=i/240*Math.PI*2; array[i*3]=Math.cos(a)*radius; array[i*3+2]=Math.sin(a)*radius }
    return array
  }, [radius])
  return <group rotation={rotation}><lineLoop><bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]} /></bufferGeometry><lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} /></lineLoop></group>
}

export default function Planet({ system, paused, reducedMotion, lowPower }: PlanetProps) {
  const surface = useRef<Mesh>(null)
  const moons = useRef<Group>(null)
  const uniforms = useMemo(() => ({ uSeed: { value: system.seed }, uSurface: { value: new Color(system.surface) }, uAccent: { value: new Color(system.accent) } }), [system])
  const material = useMemo(() => new ShaderMaterial({ uniforms, vertexShader:surfaceVertex, fragmentShader:surfaceFragment, defines:{ORBIT_NOISE_OCTAVES:lowPower?2:4} }), [uniforms,lowPower])
  const atmosphere = useMemo(() => new ShaderMaterial({ uniforms:{uAccent:{value:new Color(system.accent)}}, vertexShader:atmosphereVertex, fragmentShader:atmosphereFragment, side:BackSide, transparent:true, depthWrite:false, blending:AdditiveBlending }), [system.accent])
  const rings = useMemo(() => new ShaderMaterial({ uniforms:{uAccent:{value:new Color(system.accent)}}, vertexShader:ringVertex, fragmentShader:ringFragment, side:DoubleSide, transparent:true, depthWrite:false }), [system.accent])
  useEffect(() => () => material.dispose(), [material])
  useEffect(() => () => atmosphere.dispose(), [atmosphere])
  useEffect(() => () => rings.dispose(), [rings])
  useFrame((_state,delta) => {
    if (paused || reducedMotion) return
    const dt=Math.min(delta,0.045)
    if (surface.current) surface.current.rotation.y += dt*0.026
    if (moons.current) moons.current.rotation.y += dt*0.041
  })
  return <group>
    <mesh ref={surface} rotation={[0.13,system.seed*0.36,-0.10]} material={material}>
      <sphereGeometry args={[PLANET_RADIUS,lowPower?88:144,lowPower?64:104]} />
    </mesh>
    <mesh material={atmosphere}><sphereGeometry args={[PLANET_RADIUS+0.075,72,48]} /></mesh>
    <mesh rotation={[-1.18,0.12,-0.39]} material={rings}><ringGeometry args={[3.02,4.38,192,1]} /></mesh>
    <OrbitWire radius={3.02} rotation={[0.37,0.12,-0.39]} opacity={0.20} color={system.accent} />
    <OrbitWire radius={4.40} rotation={[0.37,0.12,-0.39]} opacity={0.26} color={system.accent} />
    <OrbitWire radius={3.80} rotation={[1.15,-0.28,0.52]} opacity={0.16} color="#a8bdb3" />
    <group ref={moons} rotation={[0.10,system.seed,0.23]}>
      <mesh position={[4.34,0.25,-0.80]} rotation={[0.4,0.6,0.2]}>
        <icosahedronGeometry args={[0.24,2]} /><meshStandardMaterial color="#454b45" roughness={0.95} metalness={0.20} flatShading />
      </mesh>
      <mesh position={[-3.87,-0.65,1.72]} rotation={[0.9,0.1,0.7]}>
        <icosahedronGeometry args={[0.12,1]} /><meshStandardMaterial color="#4a4e48" roughness={0.90} metalness={0.12} flatShading />
      </mesh>
    </group>
  </group>
}
