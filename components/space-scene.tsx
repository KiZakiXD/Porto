'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from 'react';
import { destinations, findDestination, type DestinationId } from '@/lib/portfolio';
import type { FlightState, Quality, SpaceEngine } from '@/lib/space-engine';

export type SceneHandle = { travelTo: (id: DestinationId) => void };
type Props = {
  quality: Quality; light: boolean; exploring: boolean; reducedMotion: boolean; paused: boolean;
  onState: (state: FlightState) => void;
  onProjection: (id: DestinationId,x:number,y:number,visible:boolean)=>void;
  onPosition: (x:number,z:number)=>void;
  onProject: (id:DestinationId,index:number)=>void;
};
const SpaceScene = forwardRef<SceneHandle,Props>(function SpaceScene(props,ref){
  const host=useRef<HTMLDivElement>(null),root=useRef<HTMLDivElement>(null),engine=useRef<SpaceEngine|null>(null),queued=useRef<DestinationId|null>(null),lastWorld=useRef<DestinationId>('earth'),callbacks=useRef(props),unavailable=useRef(false);
  const [status,setStatus]=useState<'loading'|'ready'|'fallback'>('loading');
  const [fallbackWorld,setFallbackWorld]=useState<DestinationId>('earth');
  callbacks.current=props;
  function visitFallback(id:DestinationId){
    lastWorld.current=id;
    setFallbackWorld(id);
    const d=findDestination(id);
    callbacks.current.onPosition(d.position[0],d.position[2]);
    callbacks.current.onState({dock:id,target:null,moving:false});
  }
  function useFallback(){
    unavailable.current=true;
    engine.current?.dispose();engine.current=null;
    setStatus('fallback');
    if(callbacks.current.exploring)visitFallback(queued.current||lastWorld.current);
    queued.current=null;
  }
  useImperativeHandle(ref,()=>({travelTo(id){
    if(unavailable.current)visitFallback(id);
    else if(engine.current)engine.current.travelTo(id);
    else queued.current=id;
  }}),[]);
  useEffect(()=>{
    let cancelled=false;
    import('@/lib/space-engine').then(({createSpaceEngine})=>{
      if(cancelled||!host.current)return;
      try{
        engine.current=createSpaceEngine(host.current,{
          onState:s=>{if(s.dock)lastWorld.current=s.dock;callbacks.current.onState(s);},
          onProjection:(...a)=>callbacks.current.onProjection(...a),
          onPosition:(...a)=>callbacks.current.onPosition(...a),
          onProject:(...a)=>callbacks.current.onProject(...a),
          onReady:()=>setStatus('ready'),onFailure:useFallback,
        });
        const p=callbacks.current;engine.current.setQuality(p.quality);engine.current.setLightMode(p.light);engine.current.setExploring(p.exploring);engine.current.setReducedMotion(p.reducedMotion);engine.current.setPaused(p.paused);
        if(queued.current){engine.current.travelTo(queued.current);queued.current=null;}
      }catch{if(!cancelled)useFallback();}
    }).catch(()=>{if(!cancelled)useFallback();});
    return()=>{cancelled=true;engine.current?.dispose();engine.current=null;};
  },[]);
  useEffect(()=>engine.current?.setQuality(props.quality),[props.quality]);
  useEffect(()=>engine.current?.setLightMode(props.light),[props.light]);
  useEffect(()=>engine.current?.setExploring(props.exploring),[props.exploring]);
  useEffect(()=>engine.current?.setReducedMotion(props.reducedMotion),[props.reducedMotion]);
  useEffect(()=>engine.current?.setPaused(props.paused),[props.paused]);
  useEffect(()=>{
    if(status!=='fallback'||!props.exploring||!root.current)return;
    const project=()=>{
      const bounds=root.current!.getBoundingClientRect();
      root.current!.querySelectorAll<HTMLElement>('[data-fallback-world]').forEach(world=>{
        const rect=world.getBoundingClientRect();
        callbacks.current.onProjection(world.dataset.fallbackWorld as DestinationId,rect.left-bounds.left+rect.width/2,rect.top-bounds.top-12,true);
      });
    };
    const observer=new ResizeObserver(project);observer.observe(root.current);project();
    return()=>observer.disconnect();
  },[status,props.exploring]);
  return <div ref={root} className="space-scene" data-status={status} data-quality={props.quality}>
    <div ref={host} className="canvas-host" />
    {status==='loading'&&<div className="scene-loading" role="status"><span className="loading-orbit"/>Preparing your orbit</div>}
    {status==='fallback'&&<div className={`scene-fallback ${props.exploring?'fallback-exploring':''}`}>
      <div className="fallback-nebula" aria-hidden="true"/>
      <div className="fallback-stars" aria-hidden="true">{Array.from({length:180},(_,i)=><i key={i} style={{left:`${((i*127.31+17.3)%100).toFixed(2)}%`,top:`${((i*71.87+13.1)%100).toFixed(2)}%`,width:i%13===0?3:1,height:i%13===0?3:1,opacity:.2+(i%7)*.1,animationDelay:`-${i%11}s`}}/>)}</div>
      <div className="fallback-blackhole" aria-hidden="true"><i/><span/></div>
      <div className="fallback-worlds" aria-hidden="true">{destinations.map(d=><div key={d.id} data-fallback-world={d.id} className={`fallback-world fallback-${d.id}`} style={{'--world-color':d.color} as CSSProperties}><div className="fallback-surface"/><div className="fallback-satellite"><i/><span/><i/></div></div>)}</div>
      <svg className={`fallback-rocket rocket-near-${fallbackWorld}`} viewBox="0 0 60 100" aria-hidden="true"><defs><linearGradient id="rocket-metal" x1="0" x2="1"><stop stopColor="#6d8090"/><stop offset=".5" stopColor="#edf1ed"/><stop offset="1" stopColor="#56626b"/></linearGradient></defs><path d="M21 65 8 82 10 62 21 49M39 65 52 82 50 62 39 49" fill="#3d556b"/><path d="M23 74 30 100 37 74" fill="#93d8fa"/><path d="M22 73 21 36Q21 18 30 4Q39 18 39 36L38 73Z" fill="url(#rocket-metal)"/><circle cx="30" cy="38" r="6" fill="#16465d" stroke="#c4b795" strokeWidth="2"/><path d="M22 64 38 64" stroke="#344654" strokeWidth="4"/></svg>
      <span className="fallback-caption">DESTINATION VIEW · Select a world to explore</span>
    </div>}
  </div>;
});
export default SpaceScene;
