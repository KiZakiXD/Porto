export type ZoneId = 'central-hall' | 'archive-corridor' | 'ai-lab' | 'onchain' | 'project-forge' | 'communication';
export type Point2 = [number, number];
export type RecordId = 'profile' | 'timeline' | 'ai-lab' | 'onchain' | 'contact' | `project:${string}`;
export interface ArchiveZone { id: ZoneId; number: string; name: string; shortName: string; subtitle: string; position: Point2; size: Point2; accent: string; record: RecordId; }
export const zones: ArchiveZone[] = [
 {id:'central-hall',number:'00',name:'Central Hall',shortName:'The Hall',subtitle:'An introduction',position:[0,2],size:[12,12],accent:'#9dcbbb',record:'profile'},
 {id:'archive-corridor',number:'01',name:'Archive Corridor',shortName:'The Archive',subtitle:'Chapters in the making',position:[0,-13],size:[8,12],accent:'#c6a57a',record:'timeline'},
 {id:'ai-lab',number:'02',name:'AI Laboratory',shortName:'AI Laboratory',subtitle:'Systems that work together',position:[-15,-12],size:[11,11],accent:'#80bbb4',record:'ai-lab'},
 {id:'onchain',number:'03',name:'Onchain Chamber',shortName:'Onchain Chamber',subtitle:'Connected ecosystems',position:[15,-12],size:[11,11],accent:'#a6c58f',record:'onchain'},
 {id:'project-forge',number:'04',name:'Project Forge',shortName:'Project Forge',subtitle:'Ideas made tangible',position:[-15,5],size:[12,12],accent:'#d4ab79',record:'project:office-ai'},
 {id:'communication',number:'05',name:'Communication Terminal',shortName:'Contact',subtitle:'Start a conversation',position:[15,5],size:[11,11],accent:'#98becb',record:'contact'},
];
export interface WorldArtifact {id:RecordId;zone:ZoneId;label:string;position:Point2;accent:string;kind:'identity'|'archive'|'ai'|'chain'|'project'|'terminal';}
export const fixedArtifacts:WorldArtifact[]=[
 {id:'profile',zone:'central-hall',label:'THE DEVELOPER',position:[0,0],accent:'#9dcbbb',kind:'identity'},
 {id:'timeline',zone:'archive-corridor',label:'CHAPTERS',position:[0,-16],accent:'#c6a57a',kind:'archive'},
 {id:'ai-lab',zone:'ai-lab',label:'AI & AUTOMATION',position:[-15,-14],accent:'#80bbb4',kind:'ai'},
 {id:'onchain',zone:'onchain',label:'ECOSYSTEM RECORDS',position:[15,-14],accent:'#a6c58f',kind:'chain'},
 {id:'contact',zone:'communication',label:'OPEN A CHANNEL',position:[15,3],accent:'#98becb',kind:'terminal'},
];
export const projectSlots:Point2[]=[[-18,3],[-12,3],[-18,7],[-12,7],[-18,10],[-12,10]];

/** Solid footprints from Environment.tsx. Sizes are full X/Z dimensions, before player clearance. */
export interface WorldObstacle { id: string; position: Point2; size: Point2; }
export const worldObstacles: WorldObstacle[] = [
  ...[-1, 1].flatMap((side): WorldObstacle[] => [
    { id: `hall-column-${side}`, position: [side * 4.9, -3.15], size: [0.94, 0.94] },
    { id: `hall-bench-${side}`, position: [side * 4.9, 3.8], size: [1.02, 1.65] },
    { id: `gate-column-${side}`, position: [side * 3.55, 7.2], size: [0.94, 0.94] },
    { id: `archive-shelves-${side}`, position: [side * 3.3, -12.85], size: [0.82, 7.08] },
    { id: `corridor-lantern-near-${side}`, position: [side * 2.55, -6.5], size: [0.32, 0.32] },
    { id: `corridor-lantern-far-${side}`, position: [side * 2.55, -9], size: [0.32, 0.32] },
    { id: `lab-column-${side}`, position: [-15 + side * 5, -16.5], size: [0.94, 0.94] },
    { id: `onchain-column-${side}`, position: [15 + side * 5, -16.5], size: [0.94, 0.94] },
    { id: `onchain-pedestal-${side}`, position: [15 + side * 3.8, -15.1], size: [1.35, 1.65] },
  ]),
  { id: 'archive-back-wall', position: [0, -18.79], size: [8.14, 0.66] },
  { id: 'lab-back-wall', position: [-15, -17.29], size: [10.99, 0.66] },
  { id: 'onchain-back-wall', position: [15, -17.29], size: [10.99, 0.66] },
  { id: 'lab-server-left', position: [-18.8, -16.08], size: [1.12, 0.83] },
  { id: 'lab-server-right', position: [-17.35, -16.08], size: [1.12, 0.83] },
  { id: 'lab-workbench', position: [-11.78, -15.5], size: [3.04, 1.26] },
  { id: 'forge-side-wall', position: [-20.86, 5], size: [0.66, 12.04] },
  { id: 'communication-side-wall', position: [20.34, 5], size: [0.66, 10.99] },
  { id: 'communication-bench', position: [19.65, 6.05], size: [0.84, 6.1] },
  { id: 'communication-cabinet', position: [10.38, 6.8], size: [0.78, 2.1] },
];
export interface NavigationRequest {point:Point2; record?:RecordId; nonce:number;}
export interface WorldSnapshot {zone:ZoneId;position:Point2;nearest:RecordId|null;moving:boolean;}
export interface ArchiveWorldProps {
 entered:boolean; paused:boolean; reducedMotion:boolean; lowPower:boolean;
 destination:NavigationRequest|null;
 onSnapshot:(snapshot:WorldSnapshot)=>void;
 onInspect:(record:RecordId)=>void;
 onReady:()=>void;
 onError:()=>void;
}
