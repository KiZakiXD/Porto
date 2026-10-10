import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { destinations, type DestinationId } from './portfolio';
import { QUALITY, flightStep, isDocked } from './flight.mjs';
import { worldVertex, planetFragment, atmosphereFragment, ringFragment, nebulaFragment, starVertex, starFragment } from './space-shaders';

export type Quality = 'low' | 'normal' | 'ultra';
export type FlightState = { dock: DestinationId | null; target: DestinationId | null; moving: boolean };
export type EngineOptions = {
  onState: (state: FlightState) => void;
  onProjection: (id: DestinationId, x: number, y: number, visible: boolean) => void;
  onPosition: (x: number, z: number) => void;
  onProject: (id: DestinationId, index: number) => void;
  onReady: () => void;
  onFailure: () => void;
};
export type SpaceEngine = ReturnType<typeof createSpaceEngine>;
function rng(seed: number) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

export function createSpaceEngine(host: HTMLDivElement, options: EngineOptions) {
  let disposed = false, frame = 0, exploring = false, reducedMotion = false, paused = false, inView = true;
  let quality: Quality = 'normal', light = false, elapsed = 0, lastTime = 0, lastState = '', mapTime = 0;
  let flightTarget: DestinationId | null = null, dock: DestinationId | null = null;
  let manualDestination: THREE.Vector3 | null = null;
  let pendingProject: { id: DestinationId; index: number } | null = null;
  const keys = new Set<string>();
  const random = rng(7319);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#030710');
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 1500);
  camera.position.set(20, 39, 108);
  camera.lookAt(9, 0, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  renderer.setClearColor('#030710');
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D space: planets, rocket, satellites, and a black hole');
  renderer.domElement.setAttribute('role', 'img');
  host.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight('#c4d8ff', 1.8);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight('#f5ece2', 4.5);
  sun.position.set(-60, 45, 70); scene.add(sun);
  const fill = new THREE.DirectionalLight('#6486ff', 1.3);
  fill.position.set(40, -15, -20); scene.add(fill);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .38, .45, 1.2);
  composer.addPass(bloom); composer.addPass(new OutputPass());

  const whitePixel = new THREE.DataTexture(new Uint8Array([40, 89, 153, 255]), 1, 1);
  whitePixel.needsUpdate = true;
  const blackPixel = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  blackPixel.needsUpdate = true;
  const textures: THREE.Texture[] = [whitePixel, blackPixel];
  const shaders: THREE.ShaderMaterial[] = [];
  const meshes: THREE.Mesh[] = [];
  const planetGroups = new Map<DestinationId, THREE.Group>();
  const materials = new Map<DestinationId, THREE.ShaderMaterial>();
  const satelliteGroups: { group: THREE.Group; center: THREE.Vector3; radius: number; phase: number; speed: number }[] = [];

  function shader(fragmentShader: string, uniforms: Record<string, THREE.IUniform>, extra: THREE.ShaderMaterialParameters = {}) {
    const m = new THREE.ShaderMaterial({ vertexShader: worldVertex, fragmentShader, uniforms, ...extra }); shaders.push(m); return m;
  }
  function standard(color: string, metalness = .65, roughness = .38) { return new THREE.MeshStandardMaterial({ color, metalness, roughness }); }
  function part(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, position: [number, number, number] = [0,0,0]) {
    const m = new THREE.Mesh(geometry, material);m.position.set(...position);parent.add(m);return m;
  }
  function makeSatellite(scale: number, tint: string) {
    const g = new THREE.Group();
    const silver = standard('#c6cbd0', .85, .28), gold = standard('#bda176', .68, .43);
    part(g, new THREE.BoxGeometry(.65,.55,.7), gold);
    part(g, new THREE.CylinderGeometry(.12,.12,3,8), silver).rotation.z = Math.PI/2;
    for(const sign of [-1,1]) {
      part(g, new THREE.BoxGeometry(1.25,.045,1.75), standard('#143450',.48,.38), [sign*1.4,0,0]);
      for(let i=0;i<4;i++) part(g, new THREE.BoxGeometry(1.22,.055,.012), gold,[sign*1.4,0,-.65+i*.43]);
      for(let i=0;i<3;i++) part(g, new THREE.BoxGeometry(.012,.055,1.72), gold,[sign*1.4-.42+i*.42,0,0]);
    }
    const dish=part(g,new THREE.SphereGeometry(.32,16,12,0,Math.PI*2,0,Math.PI*.46),silver,[0,.46,0]);dish.rotation.x=.6;
    part(g,new THREE.SphereGeometry(.055,8,8),new THREE.MeshBasicMaterial({color:tint}),[0,.58,.1]);
    g.scale.setScalar(scale);return g;
  }

  for(const d of destinations){
    const g=new THREE.Group();g.position.set(...d.position);g.rotation.z = d.id === 'earth' ? .21 : .13;scene.add(g);planetGroups.set(d.id,g);
    const m=shader(planetFragment,{uDay:{value:whitePixel},uNight:{value:blackPixel},uClouds:{value:blackPixel},uKind:{value:d.kind},uTime:{value:0},uOctaves:{value:5}});
    const body=part(g,new THREE.SphereGeometry(d.radius,80,64),m);body.rotation.y=2.45;body.userData.destination=d.id;meshes.push(body);materials.set(d.id,m);
    part(g,new THREE.SphereGeometry(d.radius*1.028,64,48),shader(atmosphereFragment,{uColor:{value:new THREE.Color(d.color)}},{transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
    if(d.id==='solana'||d.id==='robinhood'){
      const ring=part(g,new THREE.PlaneGeometry(d.radius*4.4,d.radius*4.4),shader(ringFragment,{uTime:{value:0},uHole:{value:0},uColor:{value:new THREE.Color(d.id==='solana'?'#ac9bae':'#b1b790')}},{transparent:true,side:THREE.DoubleSide,depthWrite:false}));
      ring.rotation.x=Math.PI/2;ring.rotation.y=.1;
    }
    const count = d.id==='earth' ? 2 : 5;
    for(let i=0;i<count;i++){
      const sat=makeSatellite(d.id==='earth'?.67:.48,d.color);scene.add(sat);
      satelliteGroups.push({group:sat,center:g.position.clone(),radius:d.radius+3.8+i*.25,phase:i/count*Math.PI*2,speed:.026+i*.006});
      sat.traverse(o=>{if(o instanceof THREE.Mesh){o.userData.destination=d.id;if(d.id!=='earth')o.userData.project=i;meshes.push(o);}});
    }
  }

  const loader=new THREE.TextureLoader();
  const earthMaterial=materials.get('earth')!;
  for(const [url,uniform,srgb] of [['/space/earth-day.jpg','uDay',true],['/space/earth-night.png','uNight',true],['/space/earth-clouds.png','uClouds',false]] as const){
    loader.load(url,t=>{if(disposed){t.dispose();return;}if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(t);earthMaterial.uniforms[uniform].value=t;},undefined,()=>{/* The fallback material keeps the scene navigable if an asset fails. */});
  }

  const blackHole=new THREE.Group();blackHole.position.set(1,8,-63);blackHole.rotation.set(.52,0,-.25);scene.add(blackHole);
  part(blackHole,new THREE.SphereGeometry(4.5,64,48),new THREE.MeshBasicMaterial({color:'#000105'}));
  const accretion=part(blackHole,new THREE.PlaneGeometry(31,31),shader(ringFragment,{uTime:{value:0},uHole:{value:1},uColor:{value:new THREE.Color('#ffd09a')}},{transparent:true,side:THREE.DoubleSide,depthWrite:false}));accretion.rotation.x=Math.PI/2;
  const photon=part(blackHole,new THREE.TorusGeometry(4.6,.047,8,160),new THREE.MeshBasicMaterial({color:new THREE.Color(2.4,1.3,.58)}));photon.rotation.x=.15;
  const lens=part(blackHole,new THREE.TorusGeometry(7,.075,8,120,Math.PI),new THREE.MeshBasicMaterial({color:new THREE.Color(1.1,.63,.31),transparent:true,opacity:.52}));lens.rotation.z=.1;
  const halo=part(blackHole,new THREE.SphereGeometry(4.7,48,32),shader(atmosphereFragment,{uColor:{value:new THREE.Color('#eec698')}},{transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));halo.scale.set(1,1,1);

  function makeStars(count: number, galaxy: boolean){
    const geometry=new THREE.BufferGeometry();const positions=new Float32Array(count*3),colors=new Float32Array(count*3),sizes=new Float32Array(count),phases=new Float32Array(count);
    const color=new THREE.Color();
    for(let i=0;i<count;i++){
      if(galaxy){
        const r=8+Math.pow(random(),.7)*130;const arm=i%4;const angle=r*.052+arm*Math.PI/2+(random()-.5)*(.35+35/r);
        positions[i*3]=Math.cos(angle)*r;positions[i*3+1]=(random()-.5)*(2+r*.05);positions[i*3+2]=Math.sin(angle)*r;
        color.setHSL(.58-r/130*.09,.25+random()*.3,.32+random()*.5);sizes[i]=.65+random()*1.4;
      }else{
        const r=180+random()*400,theta=random()*Math.PI*2,phi=Math.acos(2*random()-1);
        positions[i*3]=r*Math.sin(phi)*Math.cos(theta);positions[i*3+1]=r*Math.cos(phi);positions[i*3+2]=r*Math.sin(phi)*Math.sin(theta);
        color.setHSL(random()>.75?.1:.59,.1+random()*.2,.5+random()*.5);sizes[i]=.8+Math.pow(random(),4)*3;
      }
      color.toArray(colors,i*3);phases[i]=random()*Math.PI*2;
    }
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));geometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));geometry.setAttribute('aPhase',new THREE.BufferAttribute(phases,1));
    const m=new THREE.ShaderMaterial({vertexShader:starVertex,fragmentShader:starFragment,uniforms:{uTime:{value:0},uRatio:{value:1},uMotion:{value:1}},transparent:true,depthWrite:false,vertexColors:true,blending:THREE.AdditiveBlending});shaders.push(m);
    const points=new THREE.Points(geometry,m);scene.add(points);return points;
  }
  const stars=makeStars(9000,false),galaxy=makeStars(16000,true);galaxy.position.set(-16,20,-190);galaxy.rotation.set(1.18,.12,.45);
  const nebulaMaterial=shader(nebulaFragment,{uTime:{value:0},uOctaves:{value:5},uLight:{value:0}},{transparent:true,depthWrite:false});
  const nebula=part(scene,new THREE.PlaneGeometry(700,350),nebulaMaterial);nebula.position.set(0,20,-330);

  const asteroidGeometry=new THREE.IcosahedronGeometry(1,1);
  const attr=asteroidGeometry.attributes.position;
  for(let i=0;i<attr.count;i++){const v=new THREE.Vector3().fromBufferAttribute(attr,i);const h=Math.sin(v.x*12.8+v.y*78.2+v.z*37.7)*43758.54;v.multiplyScalar(.85+(h-Math.floor(h))*.32);attr.setXYZ(i,v.x,v.y,v.z);}asteroidGeometry.computeVertexNormals();
  const asteroids=new THREE.InstancedMesh(asteroidGeometry,standard('#67615b',.09,.97),120);scene.add(asteroids);
  const rocks: {p:THREE.Vector3;s:number;phase:number}[]=[];const dummy=new THREE.Object3D();
  for(let i=0;i<120;i++){const angle=random()*Math.PI*2,r=62+random()*20;rocks.push({p:new THREE.Vector3(Math.cos(angle)*r,(random()-.5)*12,Math.sin(angle)*r-8),s:.22+random()*1.15,phase:random()*6.3});}

  const station=new THREE.Group();station.position.set(1,4,31);station.rotation.z=.3;scene.add(station);
  const steel=standard('#ced3d5',.82,.32),darkMetal=standard('#28333e',.76,.5);
  const stationRing=part(station,new THREE.TorusGeometry(1.7,.14,10,48),steel);stationRing.rotation.x=Math.PI/2;
  const core=part(station,new THREE.CylinderGeometry(.35,.35,3.5,12),darkMetal);core.rotation.z=Math.PI/2;
  for(let i=0;i<4;i++){const a=i*Math.PI/2;part(station,new THREE.BoxGeometry(.7,.45,1.05),steel,[Math.cos(a)*1.7,0,Math.sin(a)*1.7]);}
  const stationSat=makeSatellite(.95,'#8bd9ff');stationSat.position.set(0,.6,0);station.add(stationSat);
  station.traverse(o=>{if(o instanceof THREE.Mesh){o.userData.destination='earth';meshes.push(o);}});

  const rocket=new THREE.Group();scene.add(rocket);rocket.position.set(14,1.5,29);
  const rocketBody=new THREE.Group();rocket.add(rocketBody);
  const silver=standard('#e0e4e5',.68,.27),charcoal=standard('#192632',.72,.39),gold=standard('#e1b98a',.7,.33);
  part(rocketBody,new THREE.CylinderGeometry(.38,.48,2.4,24),silver,[0,.1,0]);
  part(rocketBody,new THREE.ConeGeometry(.38,1.2,24),silver,[0,1.9,0]);
  part(rocketBody,new THREE.CylinderGeometry(.5,.5,.16,24),charcoal,[0,-.73,0]);
  part(rocketBody,new THREE.CylinderGeometry(.23,.36,.46,16),charcoal,[0,-1.26,0]);
  part(rocketBody,new THREE.SphereGeometry(.24,20,16),standard('#1c6c89',.42,.18),[0,.7,.31]).scale.set(1,1,.35);
  part(rocketBody,new THREE.TorusGeometry(.24,.035,8,24),gold,[0,.7,.39]);
  for(let i=0;i<3;i++){
    const finGroup=new THREE.Group();finGroup.rotation.y=i*Math.PI*2/3;rocketBody.add(finGroup);
    const shape=new THREE.Shape();shape.moveTo(.32,-.25);shape.lineTo(1.01,-1.23);shape.lineTo(.4,-1.09);shape.closePath();
    const fin=part(finGroup,new THREE.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1}),charcoal);fin.position.z=-.04;
  }
  const flameMaterial=new THREE.MeshBasicMaterial({color:new THREE.Color(.4,1.4,2.6),transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending});
  const flame=part(rocketBody,new THREE.ConeGeometry(.21,2.5,16),flameMaterial,[0,-2.5,0]);flame.rotation.z=Math.PI;
  const outerFlame=part(rocketBody,new THREE.ConeGeometry(.36,3.3,16),new THREE.MeshBasicMaterial({color:'#527dff',transparent:true,opacity:.2,depthWrite:false,blending:THREE.AdditiveBlending}),[0,-2.7,0]);outerFlame.rotation.z=Math.PI;
  const plumeGeometry=new THREE.BufferGeometry();const plumePositions=new Float32Array(70*3);plumeGeometry.setAttribute('position',new THREE.BufferAttribute(plumePositions,3));
  const plume=new THREE.Points(plumeGeometry,new THREE.PointsMaterial({color:'#a0d5ff',size:.095,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(plume);
  const history=Array.from({length:70},()=>rocket.position.clone());
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),intersection=new THREE.Vector3();
  const velocity=new THREE.Vector3(),direction=new THREE.Vector3(),targetQuaternion=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0);
  rocketBody.quaternion.setFromUnitVectors(up,new THREE.Vector3(-.25,.2,-1).normalize());
  const look=new THREE.Vector3(9,0,0),projection=new THREE.Vector3();

  function setQuality(next: Quality){quality=next;const q=QUALITY[next];const ratio=Math.min(window.devicePixelRatio||1,q.pixelRatio);renderer.setPixelRatio(ratio);composer.setPixelRatio(ratio);bloom.enabled=q.bloom&&!light;stars.geometry.setDrawRange(0,q.stars);galaxy.geometry.setDrawRange(0,q.galaxy);asteroids.count=q.asteroids;for(const m of shaders){if(m.uniforms.uOctaves)m.uniforms.uOctaves.value=q.octaves;if(m.uniforms.uRatio)m.uniforms.uRatio.value=ratio;}resize();}
  function setLightMode(next: boolean){light=next;scene.background=new THREE.Color(light?'#dbe3eb':'#030710');bloom.enabled=QUALITY[quality].bloom&&!light;renderer.toneMappingExposure=light?1.3:1.16;nebulaMaterial.uniforms.uLight.value=light?1:0;}
  function dockPoint(id: DestinationId){const d=destinations.find(d=>d.id===id)!;return new THREE.Vector3(d.position[0]+d.radius*.7,d.position[1]+.6,d.position[2]+d.radius+5.2);}
  function travelTo(id: DestinationId){flightTarget=id;pendingProject=null;manualDestination=null;keys.clear();if(reducedMotion)rocket.position.copy(dockPoint(id));}
  function setExploring(next: boolean){exploring=next;if(!next){keys.clear();flightTarget=null;pendingProject=null;manualDestination=null;velocity.set(0,0,0);rocket.position.set(14,1.5,29);}}
  function setReducedMotion(next:boolean){reducedMotion=next;for(const m of shaders)if(m.uniforms.uMotion)m.uniforms.uMotion.value=next?0:1;}
  function setPaused(next:boolean){paused=next;if(next)keys.clear();}
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.fov=w<650?56:42;camera.updateProjectionMatrix();renderer.setSize(w,h);composer.setSize(w,h);}
  const observer=new ResizeObserver(resize);observer.observe(host);
  const visibilityObserver=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??true;if(!inView)keys.clear();},{threshold:.02});visibilityObserver.observe(host);
  function isInput(event:KeyboardEvent){return event.target instanceof HTMLElement && !!event.target.closest('input,textarea,select,button,a,[role="dialog"]');}
  function keyDown(e:KeyboardEvent){if(!exploring||paused||isInput(e))return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright','shift'].includes(k)){e.preventDefault();keys.add(k);flightTarget=null;manualDestination=null;}}
  function keyUp(e:KeyboardEvent){keys.delete(e.key.toLowerCase());}
  function blur(){keys.clear();velocity.set(0,0,0);}
  function click(e:MouseEvent){if(!exploring||paused)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(meshes,false)[0];if(hit?.object.userData.destination){const id=hit.object.userData.destination as DestinationId;travelTo(id);if(typeof hit.object.userData.project==='number')pendingProject={id,index:hit.object.userData.project};return;}if(raycaster.ray.intersectPlane(plane,intersection)){pendingProject=null;flightTarget=null;manualDestination=intersection.clone();manualDestination.x=THREE.MathUtils.clamp(manualDestination.x,-78,78);manualDestination.z=THREE.MathUtils.clamp(manualDestination.z,-60,70);}}
  function contextLost(e:Event){e.preventDefault();paused=true;options.onFailure();}
  renderer.domElement.addEventListener('click',click);renderer.domElement.addEventListener('webglcontextlost',contextLost);
  window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('blur',blur);

  function animate(now:number){
    if(disposed)return;frame=requestAnimationFrame(animate);const delta=Math.min((now-lastTime)/1000||.016,.05);lastTime=now;
    if(document.hidden||!inView)return;
    if(!reducedMotion)elapsed+=delta;
    for(const m of shaders)if(m.uniforms.uTime)m.uniforms.uTime.value=elapsed;
    for(const d of destinations){const g=planetGroups.get(d.id)!;(g.children[0] as THREE.Mesh).rotation.y=2.45+elapsed*(d.id==='earth'?.022:.017);}
    satelliteGroups.forEach(s=>{const a=s.phase+elapsed*s.speed;s.group.position.set(s.center.x+Math.cos(a)*s.radius,s.center.y+Math.sin(a*1.3)*1.6,s.center.z+Math.sin(a)*s.radius);s.group.rotation.set(.2,a,.12);});
    station.rotation.y=elapsed*.014;
    for(let i=0;i<asteroids.count;i++){const rock=rocks[i];dummy.position.copy(rock.p);dummy.rotation.set(rock.phase+elapsed*.035,rock.phase+elapsed*.02,rock.phase);dummy.scale.setScalar(rock.s);dummy.updateMatrix();asteroids.setMatrixAt(i,dummy.matrix);}asteroids.instanceMatrix.needsUpdate=true;
    let moving=false;
    if(exploring&&!paused){
      const goal=flightTarget?dockPoint(flightTarget):manualDestination;
      if(goal){direction.copy(goal).sub(rocket.position);moving=direction.length()>.2;const p=flightStep(rocket.position.toArray(),goal.toArray(),24,delta);rocket.position.fromArray(p);if(!moving){flightTarget=null;manualDestination=null;}else{direction.normalize();targetQuaternion.setFromUnitVectors(up,direction);rocketBody.quaternion.slerp(targetQuaternion,1-Math.exp(-delta*5));}}
      else{
        direction.set((keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),0,(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0));
        if(direction.lengthSq()>0)direction.normalize();velocity.lerp(direction.clone().multiplyScalar(keys.has('shift')?32:19),1-Math.exp(-delta*4));moving=velocity.length()>.3;rocket.position.addScaledVector(velocity,delta);
        rocket.position.x=THREE.MathUtils.clamp(rocket.position.x,-78,78);rocket.position.z=THREE.MathUtils.clamp(rocket.position.z,-60,70);
        if(moving){targetQuaternion.setFromUnitVectors(up,velocity.clone().normalize());rocketBody.quaternion.slerp(targetQuaternion,1-Math.exp(-delta*5));}
      }
      // Keep the rocket outside planet surfaces, including during manual flight.
      for(const d of destinations){const center=new THREE.Vector3(...d.position);const outward=rocket.position.clone().sub(center);if(outward.length()<d.radius+1.7){if(outward.lengthSq()<.001)outward.set(1,0,1);rocket.position.copy(center).add(outward.normalize().multiplyScalar(d.radius+1.7));}}
    }
    rocket.position.y=THREE.MathUtils.lerp(rocket.position.y,(flightTarget?dockPoint(flightTarget).y:1.5)+Math.sin(elapsed*1.4)*.14,delta*.8);
    flame.scale.y=(moving?1.5:.38)*(1+Math.sin(elapsed*32)*.08);outerFlame.scale.y=flame.scale.y;flameMaterial.opacity=moving?.9:.45;
    history.unshift(rocket.position.clone());history.pop();for(let i=0;i<70;i++)history[i].toArray(plumePositions,i*3);plumeGeometry.attributes.position.needsUpdate=true;plume.visible=moving&&!reducedMotion;

    let closest:DestinationId|null=null,best=Infinity;
    if(exploring){for(const d of destinations){const distance=rocket.position.distanceTo(new THREE.Vector3(...d.position));if(isDocked(distance,d.radius,dock===d.id)&&distance<best){closest=d.id;best=distance;}}}
    dock=closest;
    if(pendingProject&&dock===pendingProject.id&&!flightTarget&&!moving){const p=pendingProject;pendingProject=null;options.onProject(p.id,p.index);}
    const state={dock,target:flightTarget,moving};const signature=JSON.stringify(state);if(signature!==lastState){lastState=signature;options.onState(state);}
    const desiredLook=exploring?rocket.position.clone().multiplyScalar(.35).add(new THREE.Vector3(2,0,-4)):new THREE.Vector3(9,0,0);
    look.lerp(desiredLook,1-Math.exp(-delta*1.6));const mobile=host.clientWidth<650;
    const desiredCamera=look.clone().add(new THREE.Vector3(exploring?5:11,mobile?48:39,mobile?113:108));camera.position.lerp(desiredCamera,1-Math.exp(-delta*1.4));camera.lookAt(look);
    for(const d of destinations){projection.set(...d.position);projection.y+=d.radius+2.2;projection.project(camera);options.onProjection(d.id,(projection.x*.5+.5)*host.clientWidth,(-projection.y*.5+.5)*host.clientHeight,projection.z<1&&Math.abs(projection.x)<1.15&&Math.abs(projection.y)<1.1);}
    mapTime+=delta;if(mapTime>.1){mapTime=0;options.onPosition(rocket.position.x,rocket.position.z);}
    if(bloom.enabled)composer.render();else renderer.render(scene,camera);
  }
  resize();setQuality('normal');frame=requestAnimationFrame(animate);options.onReady();

  function dispose(){
    disposed=true;cancelAnimationFrame(frame);observer.disconnect();visibilityObserver.disconnect();window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',blur);renderer.domElement.removeEventListener('click',click);renderer.domElement.removeEventListener('webglcontextlost',contextLost);
    const geometries=new Set<THREE.BufferGeometry>(),allMaterials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points){geometries.add(o.geometry);const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>allMaterials.add(m));}});geometries.forEach(g=>g.dispose());allMaterials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());bloom.dispose();composer.dispose();renderer.dispose();renderer.domElement.remove();
  }
  return {setQuality,setLightMode,setExploring,setReducedMotion,setPaused,travelTo,dispose};
}
