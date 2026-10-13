import{d as e,h as t,s as n,u as r,v as i}from"./index-CWPKO4ol.js";import{At as a,Dt as o,Ot as s,Pt as c,Y as l,c as u,l as d,n as f,t as p,ut as m,x as h,yt as g}from"./SnapshotImage-DO2kkdS2.js";import{t as _}from"./GlbModel-CjjmKzy-.js";import{t as v}from"./AssetTag-ASbfPsxn.js";import{n as y}from"./Vehicle-Dc9yNMWX.js";function b(e,t,n,r){var i=class extends g{constructor(i){super({vertexShader:t,fragmentShader:n,...i});for(let t in e)this.uniforms[t]=new o(e[t]),Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(e){this.uniforms[t].value=e}});this.uniforms=s.clone(this.uniforms),r?.(this)}};return i.key=l.generateUUID(),i}var x=parseInt(`186`.replace(/\D+/g,``)),S=i(t()),C=b({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new h,sectionColor:new h,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new a,worldPlanePosition:new a},`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${x>=154?`colorspace_fragment`:`encodings_fragment`}>
    }
  `),w=S.forwardRef(({args:e,cellColor:t=`#000000`,sectionColor:n=`#2080ff`,cellSize:r=.5,sectionSize:i=1,followCamera:o=!1,infiniteGrid:s=!1,fadeDistance:l=100,fadeStrength:f=1,fadeFrom:p=1,cellThickness:h=.5,sectionThickness:g=1,side:_=1,...v},y)=>{u({GridMaterial:C});let b=S.useRef(null);S.useImperativeHandle(y,()=>b.current,[]);let x=new m,w=new a(0,1,0),T=new a(0,0,0);d(e=>{x.setFromNormalAndCoplanarPoint(w,T).applyMatrix4(b.current.matrixWorld);let t=b.current.material,n=t.uniforms.worldCamProjPosition,r=t.uniforms.worldPlanePosition;x.projectPoint(e.camera.position,n.value),r.value.set(0,0,0).applyMatrix4(b.current.matrixWorld)});let E={cellSize:r,sectionSize:i,cellColor:t,sectionColor:n,cellThickness:h,sectionThickness:g},D={fadeDistance:l,fadeStrength:f,fadeFrom:p,infiniteGrid:s,followCamera:o};return S.createElement(`mesh`,c({ref:b,frustumCulled:!1},v),S.createElement(`gridMaterial`,c({transparent:!0,"extensions-derivatives":!0,side:_},E,D)),S.createElement(`planeGeometry`,{args:e}))}),T=r();function E(t){let{mode:r,slide:i}=n();return(0,T.jsxs)(T.Fragment,{children:[r===`thumb`?(0,T.jsx)(p,{id:i.id,style:{inset:0}}):(0,T.jsxs)(f,{camera:{position:[4.8,1.8,4.6],target:[0,.2,0],fov:32,minDistance:3,maxDistance:12},autoRotateSpeed:.25,lighting:`dark`,shadow:{y:.001,opacity:.6,scale:3.8,blur:2,far:1.6},snapshotId:i.id,viewCenterX:.72,viewCenterY:.34,style:{inset:0},children:[(0,T.jsx)(`pointLight`,{position:[-2.5,2.2,-3],intensity:18,color:`#ff7a2e`,distance:9}),(0,T.jsx)(w,{position:[0,0,0],args:[20,20],cellSize:.25,cellThickness:.6,cellColor:`#24272b`,sectionSize:1,sectionThickness:1,sectionColor:`#3a3e44`,fadeDistance:10,fadeStrength:2,infiniteGrid:!0}),(0,T.jsx)(`group`,{scale:.55,children:(0,T.jsx)(_,{glb:e.vehicle.glb,transform:e.vehicle.glbTransform,fallback:(0,T.jsx)(y,{})})})]}),(0,T.jsx)(v,{status:e.vehicle.status,note:e.vehicle.statusNote,style:{right:120,top:72}})]})}export{E as default};