export const worldVertex = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vUv = uv;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;
export const noiseGLSL = `
float hash(vec3 p){p=fract(p*0.3183099+vec3(.1,.2,.3));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<6;i++){if(float(i)>=uOctaves)break;s+=a*noise(p);p=p*2.04+13.5;a*=.49;}return s;}
`;
export const planetFragment = `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform float uKind;
uniform float uTime;
uniform float uOctaves;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorld;
${noiseGLSL}
void main(){
 vec3 n=normalize(vNormal),view=normalize(cameraPosition-vWorld);
 float sun=dot(n,normalize(vec3(-.8,.5,.65)));
 float light=smoothstep(-.18,.9,sun);
 float rim=pow(1.-max(dot(view,n),0.),3.5);
 vec3 color,glow;
 if(uKind<.5){
   color=texture2D(uDay,vUv).rgb;
   vec2 cuv=vec2(fract(vUv.x+uTime*.0015),vUv.y);
   float cloud=texture2D(uClouds,cuv).r;
   color=mix(color,vec3(.83,.9,1.),cloud*.78);
   vec3 cities=texture2D(uNight,vUv).rgb;
   color=color*(.05+light*1.03)+cities*(1.-smoothstep(-.15,.3,sun))*.85;
   glow=vec3(.12,.38,.85);
 }else{
   vec3 p=vec3(sin(vUv.x*6.283)*sin(vUv.y*3.1416),cos(vUv.y*3.1416),cos(vUv.x*6.283)*sin(vUv.y*3.1416));
   float f=fbm(p*7.);
   float detail=fbm(p*45.);
   if(uKind<1.5){
    float ridges=abs(fbm(p*18.)-.48)*2.;
    color=mix(vec3(.025,.07,.06),vec3(.43,.5,.29),smoothstep(.3,.67,f));
    color+=vec3(.23,.25,.16)*ridges+detail*.12;
    glow=vec3(.48,.68,.31);
   }else if(uKind<2.5){
    float ice=smoothstep(.38,.65,f+abs(p.y)*.1);
    color=mix(vec3(.025,.11,.23),vec3(.38,.62,.81),ice);
    color+=vec3(.1,.2,.24)*detail;
    glow=vec3(.15,.4,.95);
   }else if(uKind<3.5){
    float band=sin(vUv.y*80.+f*14.+sin(vUv.x*16.)*.5)*.5+.5;
    color=mix(vec3(.16,.09,.27),vec3(.5,.34,.62),band);
    color=mix(color,vec3(.68,.58,.76),smoothstep(.7,.95,band+detail*.15));
    glow=vec3(.52,.25,.78);
   }else{
    float dunes=sin(f*38.+p.y*14.)*.5+.5;
    color=mix(vec3(.18,.065,.035),vec3(.67,.37,.16),f*1.3);
    color+=vec3(.14,.09,.045)*dunes*detail;
    glow=vec3(.83,.38,.12);
   }
   color*=.07+light*.95;
 }
 color+=glow*rim*.4*smoothstep(-.5,.6,sun);
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const atmosphereFragment = `
uniform vec3 uColor;
varying vec3 vNormal;varying vec3 vWorld;
void main(){vec3 n=normalize(vNormal);vec3 v=normalize(cameraPosition-vWorld);
 float facing=max(dot(n,v),0.);
 float intensity=pow(1.-facing,4.5)*.45;
 float sun=smoothstep(-.7,.9,dot(n,normalize(vec3(-.8,.5,.65))));
 gl_FragColor=vec4(uColor,intensity*(.2+.8*sun));
}`;
export const ringFragment = `
uniform float uTime;uniform float uHole;uniform vec3 uColor;
varying vec2 vUv;varying vec3 vWorld;
void main(){
 float r=length(vUv-.5)*2.;
 float lines=sin(r*260.)*.15+sin(r*610.)*.08+.7;
 float edge=smoothstep(.34,.4,r)*(1.-smoothstep(.94,1.,r));
 float angle=atan(vUv.y-.5,vUv.x-.5);
 float filaments=sin(angle*7.-uTime*.24+r*56.)*.1+.9;
 vec3 color=uColor*(.32+lines*.6);
 float alpha=edge*lines*.7;
 if(uHole>.5){
  float hot=exp(-pow((r-.41)*9.,2.));
  color=mix(vec3(.8,.25,.065),vec3(2.8,1.7,.8),hot)*filaments;
  alpha=edge*(.4+hot*.6)*(1.-r*.3);
 }
 gl_FragColor=vec4(color,alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const nebulaFragment = `
uniform float uTime;uniform float uOctaves;uniform float uLight;
varying vec2 vUv;
${noiseGLSL}
void main(){vec2 p=(vUv-.5)*vec2(2.,1.);
 float f=fbm(vec3(p*5.,uTime*.001));
 float w=fbm(vec3(p*12.+f*2.,4.));
 float cloud=pow(max(f*w*2.5-.19,0.),2.)*exp(-abs(p.y-p.x*.28)*3.);
 vec3 c=mix(vec3(.12,.16,.32),vec3(.34,.2,.21),smoothstep(-.5,.5,p.x));
 gl_FragColor=vec4(c,clamp(cloud*(1.-uLight*.4),0.,.3));
}`;
export const starVertex = `
attribute float aSize;attribute float aPhase;
uniform float uTime;uniform float uRatio;uniform float uMotion;
varying vec3 vColor;varying float vAlpha;
void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.);
 float twinkle=.76+.24*sin(uTime*uMotion*.6+aPhase);
 vAlpha=twinkle;
 gl_PointSize=clamp(aSize*uRatio*(180./max(-mv.z,1.)),.6,5.);
 gl_Position=projectionMatrix*mv;
}`;
export const starFragment = `
varying vec3 vColor;varying float vAlpha;
void main(){float d=length(gl_PointCoord-.5)*2.;float a=exp(-d*d*5.);
 if(d>.95)discard;gl_FragColor=vec4(vColor,a*vAlpha);
}`;
