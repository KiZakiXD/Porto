'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { DestinationId } from '@/lib/portfolio';
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
  const host=useRef<HTMLDivElement>(null),engine=useRef<SpaceEngine|null>(null),queued=useRef<DestinationId|null>(null),callbacks=useRef(props);
  const [status,setStatus]=useState<'loading'|'ready'|'fallback'>('loading');
  callbacks.current=props;
  useImperativeHandle(ref,()=>({travelTo(id){if(engine.current)engine.current.travelTo(id);else queued.current=id;}}),[]);
  useEffect(()=>{
    let cancelled=false;
    import('@/lib/space-engine').then(({createSpaceEngine})=>{
      if(cancelled||!host.current)return;
      try{
        engine.current=createSpaceEngine(host.current,{
          onState:s=>callbacks.current.onState(s),
          onProjection:(...a)=>callbacks.current.onProjection(...a),
          onPosition:(...a)=>callbacks.current.onPosition(...a),
          onProject:(...a)=>callbacks.current.onProject(...a),
          onReady:()=>setStatus('ready'),onFailure:()=>setStatus('fallback'),
        });
        const p=callbacks.current;engine.current.setQuality(p.quality);engine.current.setLightMode(p.light);engine.current.setExploring(p.exploring);engine.current.setReducedMotion(p.reducedMotion);engine.current.setPaused(p.paused);
        if(queued.current){engine.current.travelTo(queued.current);queued.current=null;}
      }catch{setStatus('fallback');}
    }).catch(()=>setStatus('fallback'));
    return()=>{cancelled=true;engine.current?.dispose();engine.current=null;};
  },[]);
  useEffect(()=>engine.current?.setQuality(props.quality),[props.quality]);
  useEffect(()=>engine.current?.setLightMode(props.light),[props.light]);
  useEffect(()=>engine.current?.setExploring(props.exploring),[props.exploring]);
  useEffect(()=>engine.current?.setReducedMotion(props.reducedMotion),[props.reducedMotion]);
  useEffect(()=>engine.current?.setPaused(props.paused),[props.paused]);
  return <div className="space-scene" data-status={status}>
    <div ref={host} className="canvas-host" />
    {status==='loading'&&<div className="scene-loading" role="status"><span className="loading-orbit"/>Preparing your orbit</div>}
    {status==='fallback'&&<div className="scene-fallback"><div className="fallback-earth"/><p>Explore through the destination menu or browse the projects below.</p></div>}
  </div>;
});
export default SpaceScene;
