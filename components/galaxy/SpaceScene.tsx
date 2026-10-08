"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  Color,
  Group,
  Mesh,
  ShaderMaterial,
} from "three";

export type World = "mars" | "jupiter";
export interface SpaceSceneProps {
  world: World;
  paused: boolean;
  lowDetail: boolean;
  interactive: boolean;
  onReady: () => void;
  onError: () => void;
}

const terrain = `
float hash(vec3 q) { q=fract(q*vec3(.1031,.11369,.13787)); q+=dot(q,q.yxz+19.19); return fract((q.x+q.y)*q.z); }
float noise(vec3 q) {
 vec3 cell=floor(q), f=fract(q); f=f*f*(3.-2.*f);
 return mix(mix(mix(hash(cell),hash(cell+vec3(1,0,0)),f.x),mix(hash(cell+vec3(0,1,0)),hash(cell+vec3(1,1,0)),f.x),f.y),mix(mix(hash(cell+vec3(0,0,1)),hash(cell+vec3(1,0,1)),f.x),mix(hash(cell+vec3(0,1,1)),hash(cell+vec3(1,1,1)),f.x),f.y),f.z);
}
float landscape(vec3 q) {
 float sum=0.,weight=.5;
 for(int i=0;i<DETAIL;i++){sum+=noise(q)*weight;q=q*2.03+vec3(9.3,4.6,3.1);weight*=.5;}
 return sum;
}
`;
const vertex = `varying vec3 vPoint; varying vec3 vNormal; varying vec3 vWorld;
void main(){vPoint=position;vec4 w=modelMatrix*vec4(position,1.);vWorld=w.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
const fragment = `
uniform float uKind;
varying vec3 vPoint; varying vec3 vNormal; varying vec3 vWorld;
${terrain}
void main(){
 vec3 p=normalize(vPoint); float broad=landscape(p*4.1+2.7);float detail=landscape(p*27.+broad*2.);
 float erosion=abs(noise(p*13.+broad*5.)-.52);
 vec3 rust=mix(vec3(.065,.013,.007),vec3(.40,.105,.038),smoothstep(.23,.68,broad));
 rust=mix(rust,vec3(.52,.24,.10),smoothstep(.5,.8,detail)*.4);
 rust*=.67+detail*.62;
 float craterA=length(p-normalize(vec3(.3,.18,1.)));
 float craterB=length(p-normalize(vec3(-.41,-.28,1.)));
 float bowl=(1.-smoothstep(.035,.11,craterA))+(1.-smoothstep(.025,.075,craterB));
 float lip=exp(-pow((craterA-.11)*85.,2.))+exp(-pow((craterB-.075)*105.,2.));
 rust*=1.-bowl*.18;rust+=vec3(.09,.035,.014)*lip;
 float cap=smoothstep(.88,.98,abs(p.y)+broad*.025);rust=mix(rust,vec3(.55,.52,.49),cap*.6);
 float band=sin(p.y*38.+landscape(p*5.)*9.);
 float smallBand=sin(p.y*94.+noise(p*16.)*5.);
 vec3 gas=mix(vec3(.17,.09,.059),vec3(.81,.69,.51),smoothstep(-.7,.75,band));
 gas=mix(gas,vec3(.91,.84,.72),smoothstep(.2,.9,smallBand)*.25);
 float spot=length(vec2((p.x-.32)*4.4,(p.y+.21)*11.));
 gas=mix(gas,vec3(.44,.13,.07),(1.-smoothstep(.25,1.,spot))*smoothstep(.1,.4,p.z)*.78);
 vec3 albedo=mix(rust,gas,uKind);
 float height=mix(broad*.16+detail*.035+erosion*.025-bowl*.015+lip*.005,detail*.018,uKind);
 vec3 N=normalize(vNormal),dx=dFdx(vWorld),dy=dFdy(vWorld),cx=cross(dy,N),cy=cross(N,dx);
 float d=dot(dx,cx);N=normalize(abs(d)*N-sign(d)*(dFdx(height)*cx+dFdy(height)*cy)*.22);
 vec3 L=normalize(vec3(-.85,.7,1.2)),V=normalize(cameraPosition-vWorld);
 float diffuse=max(dot(N,L),0.),rim=pow(1.-max(dot(normalize(vNormal),V),0.),4.2);
 float spec=pow(max(dot(N,normalize(L+V)),0.),50.);
 vec3 color=albedo*(.07+diffuse*1.9)+vec3(.48,.67,1.)*rim*.44;
 color+=vec3(.96,.73,.5)*spec*.13;
 color+=vec3(.13,.21,.39)*pow(max(dot(N,normalize(vec3(1.,-.2,-1.))),0.),2.)*.17;
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const halo = `varying vec3 vPoint; varying vec3 vNormal; varying vec3 vWorld;
void main(){float edge=pow(1.-abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld))),4.8);float side=.4+.6*max(dot(normalize(vNormal),normalize(vec3(-1.,1.,1.))),0.);gl_FragColor=vec4(.35,.51,1.,edge*side*.5);}`;

function Planet({
  kind,
  radius,
  lowDetail,
}: {
  kind: World;
  radius: number;
  lowDetail: boolean;
}) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uKind: { value: kind === "mars" ? 0 : 1 } },
        defines: { DETAIL: lowDetail ? 3 : 5 },
      }),
    [kind, lowDetail],
  );
  const atmosphere = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: halo,
        transparent: true,
        side: BackSide,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => atmosphere.dispose(), [atmosphere]);
  return (
    <>
      <mesh material={material}>
        <sphereGeometry
          args={[radius, lowDetail ? 64 : 120, lowDetail ? 48 : 88]}
        />
      </mesh>
      <mesh material={atmosphere}>
        <sphereGeometry args={[radius * 1.023, 64, 48]} />
      </mesh>
    </>
  );
}

function Stars({ lowDetail }: { lowDetail: boolean }) {
  const points = useMemo(() => {
    let seed = 1827;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const vertices = new Float32Array((lowDetail ? 400 : 850) * 3);
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i] = (random() - 0.5) * 62;
      vertices[i + 1] = (random() - 0.5) * 38;
      vertices[i + 2] = -4 - random() * 30;
    }
    return vertices;
  }, [lowDetail]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c6d5f7"
        size={0.025}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function OrbitPath({
  radius,
  rotation,
}: {
  radius: number;
  rotation: [number, number, number];
}) {
  const vertices = useMemo(
    () =>
      new Float32Array(
        Array.from({ length: 240 }, (_, i) => {
          const a = (i / 240) * Math.PI * 2;
          return [Math.cos(a) * radius, Math.sin(a) * radius, 0];
        }).flat(),
      ),
    [radius],
  );
  return (
    <group rotation={rotation}>
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[vertices, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#7a9cff"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </lineLoop>
    </group>
  );
}

function Universe(props: SpaceSceneProps) {
  const { world, paused, lowDetail, interactive } = props;
  const main = useRef<Group>(null),
    secondary = useRef<Group>(null),
    ready = useRef(false);
  const { size, gl, invalidate } = useThree();
  const small = size.width < 900;
  const input = useRef({
    x: 0,
    y: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    spin: 0,
    tilt: 0,
  });
  const callback = useRef(props);
  callback.current = props;
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.cursor = interactive ? "grab" : "";
    const down = (event: PointerEvent) => {
      if (!interactive) return;
      input.current.dragging = true;
      input.current.lastX = event.clientX;
      input.current.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const move = (event: PointerEvent) => {
      if (!input.current.dragging || !interactive) return;
      input.current.spin += (event.clientX - input.current.lastX) * 0.006;
      input.current.tilt = Math.max(
        -0.7,
        Math.min(
          0.7,
          input.current.tilt + (event.clientY - input.current.lastY) * 0.004,
        ),
      );
      input.current.lastX = event.clientX;
      input.current.lastY = event.clientY;
      invalidate();
    };
    const up = () => {
      input.current.dragging = false;
      canvas.style.cursor = interactive ? "grab" : "";
    };
    const lost = (event: Event) => {
      event.preventDefault();
      callback.current.onError();
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("webglcontextlost", lost);
    };
  }, [gl, interactive, invalidate]);
  useFrame((state, delta) => {
    if (!ready.current) {
      ready.current = true;
      callback.current.onReady();
    }
    if (!paused && !input.current.dragging)
      input.current.spin += Math.min(delta, 0.05) * 0.045;
    if (main.current) {
      main.current.rotation.y = input.current.spin;
      main.current.rotation.x = input.current.tilt + 0.12;
      main.current.position.y =
        (small ? 1.7 : -0.1) +
        (paused ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.055);
    }
    if (secondary.current && !paused)
      secondary.current.rotation.y += Math.min(delta, 0.05) * 0.08;
  });
  return (
    <>
      <Stars lowDetail={lowDetail} />
      <group position={small ? [0.65, 1.7, -3] : [3.25, -0.1, 0]} ref={main}>
        <Planet
          kind={world}
          radius={small ? 2.65 : 3.05}
          lowDetail={lowDetail}
        />
      </group>
      <group
        position={small ? [-2.2, 3.4, -9] : [-1.25, 2.65, -5]}
        ref={secondary}
        rotation={[0.18, 0.7, -0.12]}
      >
        <Planet
          kind={world === "mars" ? "jupiter" : "mars"}
          radius={1.04}
          lowDetail
        />
      </group>
      <group position={small ? [0.65, 1.7, -3] : [3.25, -0.1, 0]}>
        <OrbitPath radius={4.15} rotation={[0.8, 0.45, -0.45]} />
        <OrbitPath radius={4.5} rotation={[-0.9, 0.3, 0.6]} />
      </group>
      <mesh position={small ? [-1.55, -0.45, -2] : [0.2, -2.9, 0]}>
        <sphereGeometry args={[0.18, 24, 16]} />
        <meshStandardMaterial
          color="#9fa9c4"
          metalness={0.4}
          roughness={0.44}
        />
      </mesh>
      <ambientLight intensity={0.4} />
      <directionalLight position={[-5, 7, 8]} intensity={3} color="#bed1ff" />
    </>
  );
}

export default function SpaceScene(props: SpaceSceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 12], fov: 42, near: 0.1, far: 70 }}
      dpr={props.lowDetail ? 1 : [1, 1.5]}
      frameloop={props.paused ? "demand" : "always"}
      gl={{
        alpha: true,
        antialias: !props.lowDetail,
        powerPreference: "low-power",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new Color("#04060b"), 0);
        gl.debug.onShaderError = props.onError;
      }}
    >
      <Universe {...props} />
    </Canvas>
  );
}
