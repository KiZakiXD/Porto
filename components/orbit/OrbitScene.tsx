'use client'

import { Component, memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { CanvasTexture, Color, Group, Mesh, PerspectiveCamera, Sprite, SRGBColorSpace, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { projects } from '@/data/projects'
import { relationships } from '@/data/relationships'
import { signalSlots, systems, type OrbitSceneProps, type OrbitSignal, type SystemId } from '@/data/orbit'
import { advanceFlight, angularDistance, isOrbitPointVisible, manualFlight, orbitPosition, type FlightPoint } from '@/lib/orbit-flight'
import Planet from './Planet'

const FLIGHT_KEYS = new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'])
const NEAR_SIGNAL = 0.24
interface ProbeState { point: FlightPoint; moving: boolean; position: Vector3; heading: Vector3 }

function signalsFor(system: SystemId): OrbitSignal[] {
  const records = system === 'mimo'
    ? relationships.filter(record => record.id === 'xiaomi' || record.id === 'mimo-ai').map(record => ({id:record.id,label:record.name}))
    : projects.filter(project => project.system === system).map(project => ({id:project.id,label:project.title}))
  return records.slice(0,signalSlots.length).map((record,index) => ({...record,longitude:signalSlots[index][0],latitude:signalSlots[index][1]}))
}

class SceneBoundary extends Component<{ children:ReactNode; onError:()=>void },{ failed:boolean }> {
  state = {failed:false}
  static getDerivedStateFromError() { return {failed:true} }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

function Stars({lowPower}:{lowPower:boolean}) {
  const positions=useMemo(() => {
    const count=lowPower?280:620
    const array=new Float32Array(count*3)
    let seed=7919
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
    for(let i=0;i<count;i++) {
      const phi=random()*Math.PI*2, cosine=random()*2-1, sine=Math.sqrt(1-cosine*cosine),radius=34+random()*16
      array[i*3]=Math.cos(phi)*sine*radius;array[i*3+1]=cosine*radius;array[i*3+2]=Math.sin(phi)*sine*radius
    }
    return array
  },[lowPower])
  return <points frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]} /></bufferGeometry><pointsMaterial color="#bbccc5" size={0.026} sizeAttenuation transparent opacity={0.56} depthWrite={false} /></points>
}

function Signal({signal,index,accent,onNavigate,active}:{signal:OrbitSignal;index:number;accent:string;onNavigate:(id:string)=>void;active:React.MutableRefObject<string|null>}) {
  const [hovered,setHovered]=useState(false)
  const group=useRef<Group>(null)
  const ring=useRef<Mesh>(null)
  const label=useRef<Group>(null)
  const labelSprite=useRef<Sprite>(null)
  const {camera,gl}=useThree()
  const position=useMemo(()=>orbitPosition(signal),[signal])
  const cameraPoint=useMemo(()=>[0,0,0] as [number,number,number],[])
  const projected=useMemo(()=>new Vector3(),[])
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=92
    const ctx=canvas.getContext('2d')
    if(ctx){ctx.clearRect(0,0,512,92);ctx.font='500 28px Arial, sans-serif';ctx.textAlign='left';ctx.fillStyle='#becbc4';ctx.fillText(`${String(index+1).padStart(2,'0')}  ${signal.label}`,18,55)}
    const result=new CanvasTexture(canvas);result.colorSpace=SRGBColorSpace;return result
  },[signal.label,index])
  useEffect(()=>()=>{texture.dispose();gl.domElement.style.cursor=''},[texture,gl])
  useFrame(()=>{
    camera.position.toArray(cameraPoint)
    const visible=isOrbitPointVisible(signal,cameraPoint)
    if(group.current)group.current.visible=visible
    if(ring.current){ring.current.lookAt(camera.position);ring.current.scale.setScalar(hovered||active.current===signal.id?1.38:1)}
    if(label.current){
      label.current.visible=visible&&(hovered||active.current===signal.id)
      projected.set(...position).project(camera)
      const alignRight=projected.x>.35
      label.current.position.x=alignRight?-.22:.22
      labelSprite.current?.center.set(alignRight?1:0,.5)
    }
  })
  const click=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();camera.position.toArray(cameraPoint);if(event.delta<5&&isOrbitPointVisible(signal,cameraPoint))onNavigate(signal.id)}
  return <group ref={group} position={position} onClick={click} onPointerOver={event=>{camera.position.toArray(cameraPoint);if(!isOrbitPointVisible(signal,cameraPoint))return;event.stopPropagation();setHovered(true);gl.domElement.style.cursor='pointer'}} onPointerOut={()=>{setHovered(false);gl.domElement.style.cursor='grab'}}>
    {/* The hit surface is larger than the fine visual beacon, particularly on touch. */}
    <mesh><sphereGeometry args={[0.23,12,8]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    <mesh><icosahedronGeometry args={[0.095,1]} /><meshStandardMaterial color="#b7c4b7" metalness={0.8} roughness={0.27} emissive={accent} emissiveIntensity={hovered?0.35:0.09} /></mesh>
    <mesh ref={ring}><ringGeometry args={[0.135,0.145,36]} /><meshBasicMaterial color={accent} transparent opacity={hovered?0.9:0.57} depthWrite={false} /></mesh>
    <mesh position={[0.15,0,0]}><boxGeometry args={[0.11,0.035,0.07]} /><meshStandardMaterial color="#555e58" metalness={0.7} roughness={0.45} /></mesh>
    <mesh position={[-0.15,0,0]}><boxGeometry args={[0.11,0.035,0.07]} /><meshStandardMaterial color="#555e58" metalness={0.7} roughness={0.45} /></mesh>
    <group ref={label} position={[0.22,0.15,0]}><sprite ref={labelSprite} scale={[1.40,0.252,1]} center={[0,0.5]}><spriteMaterial map={texture} transparent opacity={hovered?1:0.73} depthWrite={false} /></sprite></group>
  </group>
}

function Probe({state,piloting,reducedMotion,accent}:{state:React.MutableRefObject<ProbeState>;piloting:boolean;reducedMotion:boolean;accent:string}) {
  const group=useRef<Group>(null),thruster=useRef<Mesh>(null)
  const target=useMemo(()=>new Vector3(),[])
  const wings=useMemo(()=>new Float32Array([-.045,0,.16,-.24,0,-.15,-.045,.022,-.11,.045,0,.16,.045,.022,-.11,.24,0,-.15]),[])
  useFrame(({clock})=>{
    const probe=state.current
    if(group.current){group.current.position.copy(probe.position);group.current.up.copy(probe.position).normalize();target.copy(probe.position).add(probe.heading);group.current.lookAt(target)}
    if(thruster.current){thruster.current.visible=probe.moving;thruster.current.scale.z=reducedMotion?1:1+Math.sin(clock.elapsedTime*24)*.22}
  })
  return <group ref={group} scale={piloting?1.12:1}>
    <mesh rotation={[Math.PI/2,0,0]}><capsuleGeometry args={[0.051,0.23,5,12]} /><meshStandardMaterial color="#c5cbc1" roughness={0.35} metalness={0.8} /></mesh>
    <mesh rotation={[Math.PI/2,0,0]} position={[0,0,0.18]}><coneGeometry args={[0.051,0.15,12]} /><meshStandardMaterial color="#cfb78c" roughness={0.37} metalness={0.76} /></mesh>
    <mesh><bufferGeometry><bufferAttribute attach="attributes-position" args={[wings,3]} /></bufferGeometry><meshStandardMaterial color="#8c9d97" metalness={0.78} roughness={0.38} side={2} /></mesh>
    <mesh position={[0,0.045,0.04]} scale={[1,.58,1.6]}><sphereGeometry args={[0.042,12,8]} /><meshStandardMaterial color="#263d3e" emissive={accent} emissiveIntensity={0.20} metalness={0.6} roughness={0.3} /></mesh>
    <mesh ref={thruster} position={[0,0,-0.22]} scale={[.035,.035,.12]}><sphereGeometry args={[1,10,8]} /><meshBasicMaterial color={accent} transparent opacity={0.65} depthWrite={false} /></mesh>
    {[-1,1].map(side=><mesh key={side} position={[side*.19,.007,-.13]}><sphereGeometry args={[.013,8,6]} /><meshBasicMaterial color={accent} /></mesh>)}
  </group>
}

function FlightScene(props:OrbitSceneProps) {
  const {system,piloting,paused,reducedMotion,lowPower,destination}=props
  const callbacks=useRef(props);callbacks.current=props
  const config=useMemo(()=>systems.find(item=>item.id===system)??systems[0],[system])
  const signals=useMemo(()=>signalsFor(system),[system])
  const {camera,gl,size,clock}=useThree()
  const controls=useRef<OrbitControls|null>(null)
  const keys=useRef(new Set<string>())
  const active=useRef<string|null>(null)
  const scanned=useRef(new Set<string>())
  const visible=useRef(true)
  const ready=useRef(false)
  const previousSystem=useRef(system)
  const previousPiloting=useRef(piloting)
  const nonce=useRef<number|null>(null)
  const nextStatus=useRef(0)
  const focusCamera=useRef<Vector3|null>(null)
  const isDragging=useRef(false)
  const point:FlightPoint={longitude:5.94,latitude:-0.35}
  const probe=useRef<ProbeState>({point,moving:false,position:new Vector3(...orbitPosition(point)),heading:new Vector3(1,0,0)})
  const previousPosition=useMemo(()=>new Vector3(),[])
  const desiredPosition=useMemo(()=>new Vector3(),[])
  const normal=useMemo(()=>new Vector3(),[])

  const stop=useCallback(()=>{keys.current.clear();active.current=null;probe.current.moving=false;focusCamera.current=null},[])
  const inspect=useCallback((id:string)=>{scanned.current.add(id);stop();callbacks.current.onInspect(id)},[stop])
  const navigate=useCallback((id:string)=>{
    if(callbacks.current.paused)return
    const signal=signals.find(item=>item.id===id)
    if(!signal)return
    keys.current.clear();active.current=id
    focusCamera.current=new Vector3(...orbitPosition({longitude:signal.longitude,latitude:signal.latitude*.45},1)).normalize()
    if(angularDistance(probe.current.point,signal)<0.035)inspect(id)
  },[signals,inspect])

  useEffect(()=>{
    const orbit=new OrbitControls(camera,gl.domElement)
    orbit.enableDamping=true;orbit.dampingFactor=.065;orbit.enablePan=false
    orbit.minDistance=7.6;orbit.maxDistance=size.width<size.height?26:17
    orbit.rotateSpeed=.48;orbit.zoomSpeed=.65
    orbit.minPolarAngle=.45;orbit.maxPolarAngle=Math.PI-.45
    orbit.target.set(0,0,0)
    const start=()=>{isDragging.current=true;focusCamera.current=null}
    const end=()=>{isDragging.current=false}
    orbit.addEventListener('start',start);orbit.addEventListener('end',end)
    controls.current=orbit;gl.domElement.style.cursor='grab'
    return()=>{orbit.removeEventListener('start',start);orbit.removeEventListener('end',end);orbit.dispose();controls.current=null;gl.domElement.style.cursor=''}
  // Screen-dependent limits are updated by the framing effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[camera,gl])

  useEffect(()=>{
    if(!(camera instanceof PerspectiveCamera))return
    const portrait=size.width<size.height
    camera.setViewOffset(size.width,size.height,portrait?0:-size.width*.17,size.height*(portrait?.105:.015),size.width,size.height)
    camera.position.set(0,portrait?2.2:1.35,portrait?18:11)
    camera.updateProjectionMatrix()
    if(controls.current){controls.current.maxDistance=portrait?26:17;controls.current.update()}
  },[camera,size.width,size.height])

  useEffect(()=>{
    if(previousSystem.current===system)return
    previousSystem.current=system;stop();scanned.current.clear();nonce.current=null
    probe.current.point={longitude:5.94,latitude:-.35};probe.current.position.set(...orbitPosition(probe.current.point))
    nextStatus.current=0
  },[system,stop])

  useEffect(()=>{if(paused)stop();if(controls.current)controls.current.enabled=!paused},[paused,stop])
  useEffect(()=>{
    if(previousPiloting.current&&!piloting)stop()
    previousPiloting.current=piloting
  },[piloting,stop])
  useEffect(()=>{if(reducedMotion)focusCamera.current=null},[reducedMotion])
  useEffect(()=>{
    if(paused||!destination||nonce.current===destination.nonce)return
    nonce.current=destination.nonce;navigate(destination.id)
  },[destination,paused,navigate])

  useEffect(()=>{
    const keydown=(event:KeyboardEvent)=>{
      if(!callbacks.current.piloting||callbacks.current.paused||event.altKey||event.ctrlKey||event.metaKey)return
      const element=event.target
      if(element instanceof HTMLElement&&(element.isContentEditable||element.closest('input,textarea,select,[role="dialog"],[role="menu"],#orbit-settings')))return
      if(FLIGHT_KEYS.has(event.code)){event.preventDefault();keys.current.add(event.code);active.current=null}
      if(event.code==='KeyE'&&!event.repeat){
        const near=signals.reduce<OrbitSignal|null>((nearest,item)=>angularDistance(probe.current.point,item)<=NEAR_SIGNAL&&(!nearest||angularDistance(probe.current.point,item)<angularDistance(probe.current.point,nearest))?item:nearest,null)
        if(near){event.preventDefault();inspect(near.id)}
      }
    }
    const keyup=(event:KeyboardEvent)=>keys.current.delete(event.code)
    const hidden=()=>{visible.current=!document.hidden;if(document.hidden)stop()}
    const lost=(event:Event)=>{event.preventDefault();stop();callbacks.current.onError()}
    window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',stop)
    document.addEventListener('visibilitychange',hidden);gl.domElement.addEventListener('webglcontextlost',lost)
    visible.current=!document.hidden
    return()=>{window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',stop);document.removeEventListener('visibilitychange',hidden);gl.domElement.removeEventListener('webglcontextlost',lost);stop()}
  },[gl,signals,inspect,stop])

  useFrame((_state,rawDelta)=>{
    const dt=Math.min(rawDelta,.045)
    if(!ready.current){ready.current=true;callbacks.current.onReady()}
    const pilot=probe.current
    pilot.moving=false
    previousPosition.copy(pilot.position)
    if(!paused&&visible.current){
      const held=keys.current
      const horizontal=Number(held.has('KeyD')||held.has('ArrowRight'))-Number(held.has('KeyA')||held.has('ArrowLeft'))
      const vertical=Number(held.has('KeyW')||held.has('ArrowUp'))-Number(held.has('KeyS')||held.has('ArrowDown'))
      if(piloting&&(horizontal||vertical)){
        pilot.point=manualFlight(pilot.point,horizontal,vertical,dt);pilot.moving=true
        if(!isDragging.current&&!reducedMotion)focusCamera.current=new Vector3(...orbitPosition({longitude:pilot.point.longitude,latitude:pilot.point.latitude*.5},1)).normalize()
      }else if(active.current){
        const signal=signals.find(item=>item.id===active.current)
        if(signal){
          pilot.point=advanceFlight(pilot.point,signal,dt*1.02);pilot.moving=true
          if(angularDistance(pilot.point,signal)<.025){pilot.point={longitude:signal.longitude,latitude:signal.latitude};pilot.position.set(...orbitPosition(pilot.point));inspect(signal.id);pilot.moving=false}
        }
      }
    }
    pilot.position.set(...orbitPosition(pilot.point))
    if(pilot.moving){normal.copy(pilot.position).sub(previousPosition);if(normal.lengthSq()>.000001)pilot.heading.lerp(normal.normalize(),1-Math.exp(-dt*10)).normalize()}
    if(controls.current){
      controls.current.autoRotate=!piloting&&!paused&&!reducedMotion&&!active.current&&visible.current
      controls.current.autoRotateSpeed=.10
      if(focusCamera.current&&!isDragging.current&&!paused&&!reducedMotion){
        const radius=camera.position.length()
        desiredPosition.copy(focusCamera.current).multiplyScalar(radius)
        camera.position.lerp(desiredPosition,1-Math.exp(-dt*1.7))
        camera.position.normalize().multiplyScalar(radius)
      }
      controls.current.update(dt)
    }
    nextStatus.current+=dt
    if(nextStatus.current>=.125){
      nextStatus.current=0
      let nearest:OrbitSignal|null=null
      for(const signal of signals)if(angularDistance(pilot.point,signal)<NEAR_SIGNAL&&(!nearest||angularDistance(pilot.point,signal)<angularDistance(pilot.point,nearest)))nearest=signal
      callbacks.current.onStatus({longitude:Math.round(pilot.point.longitude*1000)/1000,latitude:Math.round(pilot.point.latitude*1000)/1000,nearest:nearest?.id??null,scanned:[...scanned.current],moving:pilot.moving})
    }
  })

  return <>
    <color attach="background" args={['#080b0d']} />
    <ambientLight intensity={.28} color="#879b99" />
    <directionalLight position={[-5,7,9]} intensity={3.1} color="#dfdfce" />
    <directionalLight position={[5,1,-6]} intensity={1.6} color="#bca681" />
    <Stars lowPower={lowPower} />
    <Planet system={config} paused={paused} reducedMotion={reducedMotion} lowPower={lowPower} />
    {signals.map((signal,index)=><Signal key={`${system}:${signal.id}`} signal={signal} index={index} accent={config.accent} onNavigate={navigate} active={active} />)}
    <Probe state={probe} piloting={piloting} reducedMotion={reducedMotion} accent={config.accent} />
  </>
}

function OrbitScene(props:OrbitSceneProps) {
  const callbacks=useRef(props);callbacks.current=props
  return <SceneBoundary onError={props.onError}>
    <Canvas aria-hidden="true" style={{position:'absolute',inset:0,width:'100%',height:'100%',touchAction:'none'}}
      dpr={props.lowPower?1:[1,1.5]} camera={{position:[0,1.35,11],fov:42,near:.08,far:100}}
      gl={{alpha:false,antialias:!props.lowPower,powerPreference:props.lowPower?'low-power':'high-performance'}}
      onCreated={({gl})=>{gl.outputColorSpace=SRGBColorSpace;gl.setClearColor(new Color('#080b0d'));gl.debug.onShaderError=()=>callbacks.current.onError()}}
      fallback={<span className="orbit-canvas-fallback">The portfolio is available in Quick View.</span>}>
      <FlightScene {...props} />
    </Canvas>
  </SceneBoundary>
}

export default memo(OrbitScene)
