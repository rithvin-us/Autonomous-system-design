import{a as e,c as t,d as n,g as r,o as i,r as a,y as o}from"./index-D3HS9oRd.js";import{$ as s,$t as c,A as l,At as u,Bt as d,C as f,Ct as p,E as m,F as h,Ft as g,Gt as _,It as v,J as y,Jt as b,Kt as x,Lt as S,M as C,Mt as w,Nt as T,O as E,P as D,Pt as O,Q as k,Qt as A,R as ee,S as j,T as te,U as ne,Ut as M,V as N,Vt as re,Xt as P,Yt as F,a as ie,at as ae,b as oe,bt as se,c as I,ct as ce,d as le,dt as ue,en as L,f as de,g as fe,h as pe,i as me,j as he,jt as ge,k as _e,l as R,lt as z,n as ve,nt as ye,o as B,qt as V,r as be,rt as H,s as xe,st as Se,t as Ce,u as we,ut as Te,v as Ee,w as De,x as Oe,xt as ke,y as Ae,z as je}from"./OrbitControls-BgyLq4Ul.js";var U=o(r(),1);function Me(e,t=Math.PI/3){let n=e.index?e.toNonIndexed():e,r=n.attributes.position,i=r.count,a;if(r.isBufferAttribute===!0&&r.itemSize===3&&r.normalized===!1)a=r.array;else{a=new Float64Array(i*3);for(let e=0;e<i;e++)a[3*e+0]=r.getX(e),a[3*e+1]=r.getY(e),a[3*e+2]=r.getZ(e)}let o=Math.cos(t),s=(1+1e-10)*100,c=i/3,l=new Float64Array(c*3);for(let e=0;e<c;e++){let t=9*e,n=a[t+0],r=a[t+1],i=a[t+2],o=a[t+3],s=a[t+4],c=a[t+5],u=a[t+6],d=a[t+7],f=a[t+8],p=u-o,m=d-s,h=f-c,g=n-o,_=r-s,v=i-c,y=m*v-h*_,b=h*g-p*v,x=p*_-m*g,S=1/(Math.sqrt(y*y+b*b+x*x)||1);l[3*e+0]=y*S,l[3*e+1]=b*S,l[3*e+2]=x*S}let u=new Int32Array(i),d=new Float64Array(i*3),f=1;for(;f<i*2;)f<<=1;let p=f-1,m=new Int32Array(f),h=0;for(let e=0;e<i;e++){let t=3*e,n=Math.trunc(a[t+0]*s),r=Math.trunc(a[t+1]*s),i=Math.trunc(a[t+2]*s),o=(Math.imul(n,73856093)^Math.imul(r,19349663)^Math.imul(i,83492791))&p;for(;;){let t=m[o];if(t===0){let t=3*h;d[t+0]=n,d[t+1]=r,d[t+2]=i,m[o]=h+1,u[e]=h++;break}let a=3*(t-1);if(d[a+0]===n&&d[a+1]===r&&d[a+2]===i){u[e]=t-1;break}o=o+1&p}}let g=new Int32Array(h+1);for(let e=0;e<i;e++)g[u[e]+1]++;for(let e=0;e<h;e++)g[e+1]+=g[e];let _=new Int32Array(i),v=g.slice(0,h);for(let e=0;e<c;e++){let t=3*e;_[v[u[t+0]]++]=e,_[v[u[t+1]]++]=e,_[v[u[t+2]]++]=e}let y=new Float32Array(i*3);for(let e=0;e<c;e++){let t=3*e,n=l[t+0],r=l[t+1],i=l[t+2];for(let e=0;e<3;e++){let a=t+e,s=u[a],c=0,d=0,f=0;for(let e=g[s],t=g[s+1];e<t;e++){let t=3*_[e],a=l[t+0],s=l[t+1],u=l[t+2];n*a+r*s+i*u>o&&(c+=a,d+=s,f+=u)}let p=1/(Math.sqrt(c*c+d*d+f*f)||1);y[3*a+0]=c*p,y[3*a+1]=d*p,y[3*a+2]=f*p}}return n.setAttribute(`normal`,new fe(y,3,!1)),n}function Ne(e,t,n){let r=new v,i=-e/2,a=-t/2,o=Math.min(n,e/2,t/2);return r.moveTo(i+o,a),r.lineTo(i+e-o,a),r.absarc(i+e-o,a+o,o,-Math.PI/2,0,!1),r.lineTo(i+e,a+t-o),r.absarc(i+e-o,a+t-o,o,0,Math.PI/2,!1),r.lineTo(i+o,a+t),r.absarc(i+o,a+t-o,o,Math.PI/2,Math.PI,!1),r.lineTo(i,a+o),r.absarc(i+o,a+o,o,Math.PI,Math.PI*1.5,!1),r}var Pe=(e,t)=>Ne(e,t,t/2-.001);function W(e,t,n={}){let{bevel:r=0,curveSegments:i=40,taper:a,crease:o=Math.PI/5}=n,s=new _e(e,{depth:Math.max(.001,t-r*2),bevelEnabled:r>0,bevelThickness:r,bevelSize:r,bevelSegments:5,curveSegments:i});if(s.translate(0,0,-t/2+r),a!==void 0&&a!==1){let e=s.attributes.position,n=t/2;for(let r=0;r<e.count;r++){let i=Math.min(1,Math.max(0,(n-e.getZ(r))/t));e.setX(r,e.getX(r)*(1+(a-1)*i))}}return Me(s,o)}function G(e,t,n,r,i,a){let o=Ne(e,t,n);return o.holes.push(Ne(r,i,a)),o}function Fe(e,t,n,r){let i=Ne(e,t,n);for(let[e,t,n]of r){let r=new ke;r.absarc(e,t,n,0,Math.PI*2,!0),i.holes.push(r)}return i}var K=n();function Ie(e,t,n,r=700){let i=(0,U.useMemo)(()=>{let i=Math.round(128*t),a=document.createElement(`canvas`);a.width=i,a.height=128;let o=a.getContext(`2d`);o.fillStyle=n,o.textAlign=`center`,o.textBaseline=`middle`;let s=104;for(o.font=`${r} ${s}px Arial, Helvetica, sans-serif`;o.measureText(e).width>i*.96&&s>10;)s-=4,o.font=`${r} ${s}px Arial, Helvetica, sans-serif`;o.fillText(e,i/2,68);let c=new Ae(a);return c.colorSpace=T,c.anisotropy=8,c},[e,t,n,r]);return(0,U.useEffect)(()=>()=>i.dispose(),[i]),i}function Le({text:e,position:t,rotation:n=[0,0,0],width:r,height:i,color:a=`#f1f1ec`}){let o=Ie(e,r/i,a);return(0,K.jsxs)(`mesh`,{position:t,rotation:n,children:[(0,K.jsx)(`planeGeometry`,{args:[r,i]}),(0,K.jsx)(`meshStandardMaterial`,{map:o,transparent:!0,roughness:.6,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})]})}function Re(e=6){let t=(0,U.useMemo)(()=>{let t=document.createElement(`canvas`);t.width=64,t.height=64;let n=t.getContext(`2d`);n.fillStyle=`#1a1b1d`,n.fillRect(0,0,64,64),n.strokeStyle=`#8e939a`,n.lineWidth=6;for(let e=0;e<=2;e++)n.beginPath(),n.moveTo(0,e*32),n.lineTo(64,e*32),n.stroke(),n.beginPath(),n.moveTo(e*32,0),n.lineTo(e*32,64),n.stroke();let r=new Ae(t);return r.wrapS=r.wrapT=w,r.repeat.set(e,e),r.colorSpace=T,r.anisotropy=8,r},[e]);return(0,U.useEffect)(()=>()=>t.dispose(),[t]),t}function ze({position:e,rotation:t=[0,0,0],r:n,ring:r=0}){return(0,K.jsxs)(`group`,{position:e,rotation:t,children:[(0,K.jsxs)(`mesh`,{"rotation-x":Math.PI/2,children:[(0,K.jsx)(`cylinderGeometry`,{args:[n,n,.3,32]}),(0,K.jsx)(`meshStandardMaterial`,{color:`#050505`,roughness:.9})]}),r>0&&(0,K.jsxs)(`mesh`,{"rotation-x":Math.PI/2,position:[0,0,-.02],children:[(0,K.jsx)(`cylinderGeometry`,{args:[n+r,n+r,.26,32]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel,roughness:.45})]})]})}function Be({position:e,length:t,rotation:n=[0,0,0]}){return(0,K.jsxs)(`mesh`,{position:e,rotation:n,children:[(0,K.jsx)(`boxGeometry`,{args:[.64,t,.64]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.gold})]})}function Ve({draw:e,position:t,rotation:n=[0,0,0],width:r,height:i,px:a=256}){let o=(0,U.useMemo)(()=>{let t=document.createElement(`canvas`);t.width=a,t.height=Math.round(a*i/r),e(t.getContext(`2d`),t.width,t.height);let n=new Ae(t);return n.colorSpace=T,n.anisotropy=8,n},[a,r,i]);return(0,U.useEffect)(()=>()=>o.dispose(),[o]),(0,K.jsxs)(`mesh`,{position:t,rotation:n,children:[(0,K.jsx)(`planeGeometry`,{args:[r,i]}),(0,K.jsx)(`meshStandardMaterial`,{map:o,transparent:!0,roughness:.6,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})]})}function He({position:e,r:t,ring:n,rotation:r=[-Math.PI/2,0,0]}){return(0,K.jsxs)(`mesh`,{position:e,rotation:r,children:[(0,K.jsx)(`ringGeometry`,{args:[t,t+n,40]}),(0,K.jsx)(`meshPhysicalMaterial`,{color:`#dcb25e`,metalness:.85,roughness:.4,polygonOffset:!0,polygonOffsetFactor:-1})]})}var Ue={antenna:[-39,0,0],board:[50,0,-6]};function We(){let e=(0,U.useMemo)(()=>W(Fe(46,34,2.5,[[-19.5,-13.5,1.6],[19.5,-13.5,1.6],[-19.5,13.5,1.6],[19.5,13.5,1.6]]),1.6,{crease:.5}),[]);return(0,K.jsxs)(`group`,{position:[Ue.board[0],0,Ue.board[2]],children:[(0,K.jsx)(`mesh`,{geometry:e,"rotation-x":-Math.PI/2,position:[0,.8,0],children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.pcbBlack})}),(0,K.jsxs)(`mesh`,{position:[0,2.8,0],children:[(0,K.jsx)(`boxGeometry`,{args:[17,2.4,17]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel,roughness:.42})]}),[[-14,-6],[-14,-2],[-14,2],[13,9],[13,12],[6,-12.5],[-4,12.5]].map(([e,t],n)=>(0,K.jsxs)(`mesh`,{position:[e,1.6+.3,t],children:[(0,K.jsx)(`boxGeometry`,{args:[1.6,.6,.8]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.ceramic})]},n)),(0,K.jsxs)(`mesh`,{position:[12,2,-10],children:[(0,K.jsx)(`boxGeometry`,{args:[3,.8,1.6]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.epoxy})]}),(0,K.jsxs)(`group`,{position:[-23,1.6,0],children:[(0,K.jsxs)(`mesh`,{position:[1.5,3.2,0],children:[(0,K.jsx)(`boxGeometry`,{args:[6.4,6.4,6.4]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.gold})]}),(0,K.jsxs)(`mesh`,{position:[-3,3.2,0],"rotation-z":Math.PI/2,children:[(0,K.jsx)(`cylinderGeometry`,{args:[3.1,3.1,6,32]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.gold,roughness:.22})]})]}),(0,K.jsxs)(`group`,{position:[20.5,1.6,0],children:[(0,K.jsxs)(`mesh`,{position:[0,1.25,0],children:[(0,K.jsx)(`boxGeometry`,{args:[2.5,2.5,15.24]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticBlack})]}),Array.from({length:6},(e,t)=>(0,K.jsx)(Be,{position:[0,4.2,-6.35+t*2.54],length:6},t))]})]})}function Ge(){return(0,K.jsxs)(`group`,{position:[Ue.antenna[0],0,Ue.antenna[2]],children:[(0,K.jsxs)(`mesh`,{position:[0,3,0],children:[(0,K.jsx)(`cylinderGeometry`,{args:[37,37.6,6,96]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticBlack,roughness:.5})]}),(0,K.jsxs)(`mesh`,{position:[0,6.02,0],"rotation-x":-Math.PI/2,children:[(0,K.jsx)(`ringGeometry`,{args:[33.6,37,96]}),(0,K.jsx)(`meshPhysicalMaterial`,{color:`#2a2c2f`,roughness:.45})]}),(0,K.jsxs)(`mesh`,{position:[0,6,0],scale:[1,.58,1],children:[(0,K.jsx)(`sphereGeometry`,{args:[34,96,48,0,Math.PI*2,0,Math.PI/2]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticLight})]}),(0,K.jsxs)(`mesh`,{position:[34.5,3.2,8],"rotation-z":Math.PI/2,children:[(0,K.jsx)(`cylinderGeometry`,{args:[2.6,3,7,24]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticBlack})]})]})}function Ke(){let e=(0,U.useMemo)(()=>new oe([new F(-1.5,3.2,8),new F(8,2.2,18),new F(17,2.2,8),new F(14,2.4,-4),new F(17,4.8,-6),new F(19,4.8,-6)],!1,`centripetal`),[]);return(0,K.jsxs)(`group`,{children:[(0,K.jsxs)(`mesh`,{children:[(0,K.jsx)(`tubeGeometry`,{args:[e,96,1.5,16,!1]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.rubber,roughness:.7})]}),(0,K.jsxs)(`mesh`,{position:[21,4.8,-6],"rotation-z":Math.PI/2,children:[(0,K.jsx)(`cylinderGeometry`,{args:[4,4,5,6]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.gold})]})]})}function qe(){return(0,K.jsxs)(`group`,{children:[(0,K.jsx)(Ge,{}),(0,K.jsx)(Ke,{}),(0,K.jsx)(We,{})]})}var Je=parseInt(`186`.replace(/\D+/g,``)),Ye=Je>=125?`uv1`:`uv2`;function Xe(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(n){if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)))}i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`);let a=e.clone();return a.setIndex(i),a.clearGroups(),a}return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}function Ze(e,t=Math.PI/3){let n=Math.cos(t),r=(1+1e-10)*100,i=[new F,new F,new F],a=new F,o=new F,s=new F,c=new F;function l(e){return`${~~(e.x*r)},${~~(e.y*r)},${~~(e.z*r)}`}let u=e.index?e.toNonIndexed():e,d=u.attributes.position,f={};for(let e=0,t=d.count/3;e<t;e++){let t=3*e,n=i[0].fromBufferAttribute(d,t+0),r=i[1].fromBufferAttribute(d,t+1),s=i[2].fromBufferAttribute(d,t+2);a.subVectors(s,r),o.subVectors(n,r);let c=new F().crossVectors(a,o).normalize();for(let e=0;e<3;e++){let t=i[e],n=l(t);n in f||(f[n]=[]),f[n].push(c)}}let p=new Float32Array(d.count*3),m=new fe(p,3,!1);for(let e=0,t=d.count/3;e<t;e++){let t=3*e,r=i[0].fromBufferAttribute(d,t+0),u=i[1].fromBufferAttribute(d,t+1),p=i[2].fromBufferAttribute(d,t+2);a.subVectors(p,u),o.subVectors(r,u),s.crossVectors(a,o).normalize();for(let e=0;e<3;e++){let r=i[e],a=f[l(r)];c.set(0,0,0);for(let e=0,t=a.length;e<t;e++){let t=a[e];s.dot(t)>n&&c.add(t)}c.normalize(),m.setXYZ(t+e,c.x,c.y,c.z)}}return u.setAttribute(`normal`,m),u}var q=Uint8Array,Qe=Uint16Array,$e=Uint32Array,et=new q([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),tt=new q([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),nt=new q([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),rt=function(e,t){for(var n=new Qe(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var i=new $e(n[30]),r=1;r<30;++r)for(var a=n[r];a<n[r+1];++a)i[a]=a-n[r]<<5|r;return[n,i]},it=rt(et,2),at=it[0],ot=it[1];at[28]=258,ot[258]=28;var st=rt(tt,0),ct=st[0];st[1];for(var lt=new Qe(32768),J=0;J<32768;++J){var ut=(J&43690)>>>1|(J&21845)<<1;ut=(ut&52428)>>>2|(ut&13107)<<2,ut=(ut&61680)>>>4|(ut&3855)<<4,lt[J]=((ut&65280)>>>8|(ut&255)<<8)>>>1}for(var dt=(function(e,t,n){for(var r=e.length,i=0,a=new Qe(t);i<r;++i)++a[e[i]-1];var o=new Qe(t);for(i=0;i<t;++i)o[i]=o[i-1]+a[i-1]<<1;var s;if(n){s=new Qe(1<<t);var c=15-t;for(i=0;i<r;++i)if(e[i])for(var l=i<<4|e[i],u=t-e[i],d=o[e[i]-1]++<<u,f=d|(1<<u)-1;d<=f;++d)s[lt[d]>>>c]=l}else for(s=new Qe(r),i=0;i<r;++i)e[i]&&(s[i]=lt[o[e[i]-1]++]>>>15-e[i]);return s}),ft=new q(288),J=0;J<144;++J)ft[J]=8;for(var J=144;J<256;++J)ft[J]=9;for(var J=256;J<280;++J)ft[J]=7;for(var J=280;J<288;++J)ft[J]=8;for(var pt=new q(32),J=0;J<32;++J)pt[J]=5;var mt=dt(ft,9,1),ht=dt(pt,5,1),gt=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},Y=function(e,t,n){var r=t/8|0;return(e[r]|e[r+1]<<8)>>(t&7)&n},_t=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},vt=function(e){return(e/8|0)+(e&7&&1)},yt=function(e,t,n){(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length);var r=new(e instanceof Qe?Qe:e instanceof $e?$e:q)(n-t);return r.set(e.subarray(t,n)),r},bt=function(e,t,n){var r=e.length;if(!r||n&&!n.l&&r<5)return t||new q(0);var i=!t||n,a=!n||n.i;n||={},t||=new q(r*3);var o=function(e){var n=t.length;if(e>n){var r=new q(Math.max(n*2,e));r.set(t),t=r}},s=n.f||0,c=n.p||0,l=n.b||0,u=n.l,d=n.d,f=n.m,p=n.n,m=r*8;do{if(!u){n.f=s=Y(e,c,1);var h=Y(e,c+1,3);if(c+=3,!h){var g=vt(c)+4,_=e[g-4]|e[g-3]<<8,v=g+_;if(v>r){if(a)throw`unexpected EOF`;break}i&&o(l+_),t.set(e.subarray(g,v),l),n.b=l+=_,n.p=c=v*8;continue}if(h==1)u=mt,d=ht,f=9,p=5;else if(h==2){var y=Y(e,c,31)+257,b=Y(e,c+10,15)+4,x=y+Y(e,c+5,31)+1;c+=14;for(var S=new q(x),C=new q(19),w=0;w<b;++w)C[nt[w]]=Y(e,c+w*3,7);c+=b*3;for(var T=gt(C),E=(1<<T)-1,D=dt(C,T,1),w=0;w<x;){var O=D[Y(e,c,E)];c+=O&15;var g=O>>>4;if(g<16)S[w++]=g;else{var k=0,A=0;for(g==16?(A=3+Y(e,c,3),c+=2,k=S[w-1]):g==17?(A=3+Y(e,c,7),c+=3):g==18&&(A=11+Y(e,c,127),c+=7);A--;)S[w++]=k}}var ee=S.subarray(0,y),j=S.subarray(y);f=gt(ee),p=gt(j),u=dt(ee,f,1),d=dt(j,p,1)}else throw`invalid block type`;if(c>m){if(a)throw`unexpected EOF`;break}}i&&o(l+131072);for(var te=(1<<f)-1,ne=(1<<p)-1,M=c;;M=c){var k=u[_t(e,c)&te],N=k>>>4;if(c+=k&15,c>m){if(a)throw`unexpected EOF`;break}if(!k)throw`invalid length/literal`;if(N<256)t[l++]=N;else if(N==256){M=c,u=null;break}else{var re=N-254;if(N>264){var w=N-257,P=et[w];re=Y(e,c,(1<<P)-1)+at[w],c+=P}var F=d[_t(e,c)&ne],ie=F>>>4;if(!F)throw`invalid distance`;c+=F&15;var j=ct[ie];if(ie>3){var P=tt[ie];j+=_t(e,c)&(1<<P)-1,c+=P}if(c>m){if(a)throw`unexpected EOF`;break}i&&o(l+131072);for(var ae=l+re;l<ae;l+=4)t[l]=t[l-j],t[l+1]=t[l+1-j],t[l+2]=t[l+2-j],t[l+3]=t[l+3-j];l=ae}}n.l=u,n.p=M,n.b=l,u&&(s=1,n.m=f,n.d=d,n.n=p)}while(!s);return l==t.length?t:yt(t,0,l)},xt=new q(0),St=function(e){if((e[0]&15)!=8||e[0]>>>4>7||(e[0]<<8|e[1])%31)throw`invalid zlib data`;if(e[1]&32)throw`invalid zlib data: preset dictionaries not supported`};function Ct(e,t){return bt((St(e),e.subarray(2,-4)),t)}var wt=typeof TextDecoder<`u`&&new TextDecoder;try{wt.decode(xt,{stream:!0})}catch{}var Tt=e=>e&&e.isCubeTexture,Et=class extends z{constructor(e,t){let n=Tt(e),r=((n?e.image[0]?.width:e.image.width)??1024)/4,i=Math.floor(Math.log2(r)),a=2**i,o=3*Math.max(a,112),s=4*a,c=[n?`#define ENVMAP_TYPE_CUBE`:``,`#define CUBEUV_TEXEL_WIDTH ${1/o}`,`#define CUBEUV_TEXEL_HEIGHT ${1/s}`,`#define CUBEUV_MAX_MIP ${i}.0`].join(`
`)+`
        #define ENVMAP_TYPE_CUBE_UV
        varying vec3 vWorldPosition;
        uniform float radius;
        uniform float height;
        uniform float angle;
        #ifdef ENVMAP_TYPE_CUBE
            uniform samplerCube map;
        #else
            uniform sampler2D map;
        #endif
        // From: https://www.shadertoy.com/view/4tsBD7
        float diskIntersectWithBackFaceCulling( vec3 ro, vec3 rd, vec3 c, vec3 n, float r ) 
        {
            float d = dot ( rd, n );
            
            if( d > 0.0 ) { return 1e6; }
            
            vec3  o = ro - c;
            float t = - dot( n, o ) / d;
            vec3  q = o + rd * t;
            
            return ( dot( q, q ) < r * r ) ? t : 1e6;
        }
        // From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm
        float sphereIntersect( vec3 ro, vec3 rd, vec3 ce, float ra ) 
        {
            vec3 oc = ro - ce;
            float b = dot( oc, rd );
            float c = dot( oc, oc ) - ra * ra;
            float h = b * b - c;
            
            if( h < 0.0 ) { return -1.0; }
            
            h = sqrt( h );
            
            return - b + h;
        }
        vec3 project() 
        {
            vec3 p = normalize( vWorldPosition );
            vec3 camPos = cameraPosition;
            camPos.y -= height;
            float intersection = sphereIntersect( camPos, p, vec3( 0.0 ), radius );
            if( intersection > 0.0 ) {
                
                vec3 h = vec3( 0.0, - height, 0.0 );
                float intersection2 = diskIntersectWithBackFaceCulling( camPos, p, h, vec3( 0.0, 1.0, 0.0 ), radius );
                p = ( camPos + min( intersection, intersection2 ) * p ) / radius;
            } else {
                p = vec3( 0.0, 1.0, 0.0 );
            }
            return p;
        }
        #include <common>
        #include <cube_uv_reflection_fragment>
        void main() 
        {
            vec3 projectedWorldPosition = project();
            
            #ifdef ENVMAP_TYPE_CUBE
                vec3 outcolor = textureCube( map, projectedWorldPosition ).rgb;
            #else
                vec3 direction = normalize( projectedWorldPosition );
                vec2 uv = equirectUv( direction );
                vec3 outcolor = texture2D( map, uv ).rgb;
            #endif
            gl_FragColor = vec4( outcolor, 1.0 );
            #include <tonemapping_fragment>
            #include <${Je>=154?`colorspace_fragment`:`encodings_fragment`}>
        }
        `,l={map:{value:e},height:{value:t?.height||15},radius:{value:t?.radius||100}},u=new h(1,16),d=new g({uniforms:l,fragmentShader:c,vertexShader:`
        varying vec3 vWorldPosition;
        void main() 
        {
            vec4 worldPosition = ( modelMatrix * vec4( position, 1.0 ) );
            vWorldPosition = worldPosition.xyz;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `,side:2});super(u,d)}set radius(e){this.material.uniforms.radius.value=e}get radius(){return this.material.uniforms.radius.value}set height(e){this.material.uniforms.height.value=e}get height(){return this.material.uniforms.height.value}},Dt={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},Ot={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},kt=class extends te{constructor(e){super(e),this.type=D}parse(e){let t=function(e,t){switch(e){case 1:throw Error(`THREE.RGBELoader: Read Error: `+(t||``));case 2:throw Error(`THREE.RGBELoader: Write Error: `+(t||``));case 3:throw Error(`THREE.RGBELoader: Bad File Format: `+(t||``));default:case 4:throw Error(`THREE.RGBELoader: Memory Error: `+(t||``))}},n=function(e,t,n){t||=1024;let r=e.pos,i=-1,a=0,o=``,s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));for(;0>(i=s.indexOf(`
`))&&a<t&&r<e.byteLength;)o+=s,a+=s.length,r+=128,s+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));return-1<i&&(!1!==n&&(e.pos+=a+i+1),o+s.slice(0,i))},r=function(e){let r=/^#\?(\S+)/,i=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,a=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,o=/^\s*FORMAT=(\S+)\s*$/,s=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:``,comments:``,programtype:`RGBE`,format:``,gamma:1,exposure:1,width:0,height:0},l,u;for((e.pos>=e.byteLength||!(l=n(e)))&&t(1,`no header found`),(u=l.match(r))||t(3,`bad initial token`),c.valid|=1,c.programtype=u[1],c.string+=l+`
`;l=n(e),!1!==l;)if(c.string+=l+`
`,l.charAt(0)===`#`)c.comments+=l+`
`;else if((u=l.match(i))&&(c.gamma=parseFloat(u[1])),(u=l.match(a))&&(c.exposure=parseFloat(u[1])),(u=l.match(o))&&(c.valid|=2,c.format=u[1]),(u=l.match(s))&&(c.valid|=4,c.height=parseInt(u[1],10),c.width=parseInt(u[2],10)),c.valid&2&&c.valid&4)break;return c.valid&2||t(3,`missing format specifier`),c.valid&4||t(3,`missing image size specifier`),c},i=function(e,n,r){let i=n;if(i<8||i>32767||e[0]!==2||e[1]!==2||e[2]&128)return new Uint8Array(e);i!==(e[2]<<8|e[3])&&t(3,`wrong scanline width`);let a=new Uint8Array(4*n*r);a.length||t(4,`unable to allocate buffer space`);let o=0,s=0,c=4*i,l=new Uint8Array(4),u=new Uint8Array(c),d=r;for(;d>0&&s<e.byteLength;){s+4>e.byteLength&&t(1),l[0]=e[s++],l[1]=e[s++],l[2]=e[s++],l[3]=e[s++],(l[0]!=2||l[1]!=2||(l[2]<<8|l[3])!=i)&&t(3,`bad rgbe scanline format`);let n=0,r;for(;n<c&&s<e.byteLength;){r=e[s++];let i=r>128;if(i&&(r-=128),(r===0||n+r>c)&&t(3,`bad scanline data`),i){let t=e[s++];for(let e=0;e<r;e++)u[n++]=t}else u.set(e.subarray(s,s+r),n),n+=r,s+=r}let f=i;for(let e=0;e<f;e++){let t=0;a[o]=u[e+t],t+=i,a[o+1]=u[e+t],t+=i,a[o+2]=u[e+t],t+=i,a[o+3]=u[e+t],o+=4}d--}return a},a=function(e,t,n,r){let i=2**(e[t+3]-128)/255;n[r+0]=e[t+0]*i,n[r+1]=e[t+1]*i,n[r+2]=e[t+2]*i,n[r+3]=1},o=function(e,t,n,r){let i=2**(e[t+3]-128)/255;n[r+0]=m.toHalfFloat(Math.min(e[t+0]*i,65504)),n[r+1]=m.toHalfFloat(Math.min(e[t+1]*i,65504)),n[r+2]=m.toHalfFloat(Math.min(e[t+2]*i,65504)),n[r+3]=m.toHalfFloat(1)},s=new Uint8Array(e);s.pos=0;let c=r(s),l=c.width,u=c.height,d=i(s.subarray(s.pos),l,u),f,p,h;switch(this.type){case C:h=d.length/4;let e=new Float32Array(h*4);for(let t=0;t<h;t++)a(d,t*4,e,t*4);f=e,p=C;break;case D:h=d.length/4;let t=new Uint16Array(h*4);for(let e=0;e<h;e++)o(d,e*4,t,e*4);f=t,p=D;break;default:throw Error(`THREE.RGBELoader: Unsupported type: `+this.type)}return{width:l,height:u,data:f,header:c.string,gamma:c.gamma,exposure:c.exposure,type:p}}setDataType(e){return this.type=e,this}load(e,t,n,r){function i(e,n){switch(e.type){case C:case D:`colorSpace`in e?e.colorSpace=`srgb-linear`:e.encoding=3e3,e.minFilter=k,e.magFilter=k,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,n)}return super.load(e,i,n,r)}},At=Je>=152,jt=class extends te{constructor(e){super(e),this.type=D}parse(e){let t=65536,n=8192,r=65537,i=16384,a=16383,o=65535,s=2.7182818**2.2;function c(e,n){for(var r=0,i=0;i<t;++i)(i==0||e[i>>3]&1<<(i&7))&&(n[r++]=i);for(var a=r-1;r<t;)n[r++]=0;return a}function l(e){for(var t=0;t<i;t++)e[t]={},e[t].len=0,e[t].lit=0,e[t].p=null}let d={l:0,c:0,lc:0};function f(e,t,n,r,i){for(;n<e;)t=t<<8|ve(r,i),n+=8;n-=e,d.l=t>>n&(1<<e)-1,d.c=t,d.lc=n}let p=Array(59);function h(e){for(var t=0;t<=58;++t)p[t]=0;for(var t=0;t<r;++t)p[e[t]]+=1;for(var n=0,t=58;t>0;--t){var i=n+p[t]>>1;p[t]=n,n=i}for(var t=0;t<r;++t){var a=e[t];a>0&&(e[t]=a|p[a]++<<6)}}function g(e,t,n,r,i,a,o){for(var s=n,c=0,l=0;i<=a;i++){if(s.value-n.value>r)return!1;f(6,c,l,e,s);var u=d.l;if(c=d.c,l=d.lc,o[i]=u,u==63){if(s.value-n.value>r)throw`Something wrong with hufUnpackEncTable`;f(8,c,l,e,s);var p=d.l+6;if(c=d.c,l=d.lc,i+p>a+1)throw`Something wrong with hufUnpackEncTable`;for(;p--;)o[i++]=0;i--}else if(u>=59){var p=u-59+2;if(i+p>a+1)throw`Something wrong with hufUnpackEncTable`;for(;p--;)o[i++]=0;i--}}h(o)}function _(e){return e&63}function v(e){return e>>6}function y(e,t,n,r){for(;t<=n;t++){var i=v(e[t]),a=_(e[t]);if(i>>a)throw`Invalid table entry`;if(a>14){var o=r[i>>a-14];if(o.len)throw`Invalid table entry`;if(o.lit++,o.p){var s=o.p;o.p=Array(o.lit);for(var c=0;c<o.lit-1;++c)o.p[c]=s[c]}else o.p=[,];o.p[o.lit-1]=t}else if(a)for(var l=0,c=1<<14-a;c>0;c--){var o=r[(i<<14-a)+l];if(o.len||o.p)throw`Invalid table entry`;o.len=a,o.lit=t,l++}}return!0}let b={c:0,lc:0};function x(e,t,n,r){e=e<<8|ve(n,r),t+=8,b.c=e,b.lc=t}let S={c:0,lc:0};function w(e,t,n,r,i,a,o,s,c,l){if(e==t){r<8&&(x(n,r,i,o),n=b.c,r=b.lc),r-=8;var u=n>>r,u=new Uint8Array([u])[0];if(c.value+u>l)return!1;for(var d=s[c.value-1];u-->0;)s[c.value++]=d}else if(c.value<l)s[c.value++]=e;else return!1;S.c=n,S.lc=r}function T(e){return e&65535}function E(e){var t=T(e);return t>32767?t-65536:t}let O={a:0,b:0};function k(e,t){var n=E(e),r=E(t),i=n+(r&1)+(r>>1),a=i,o=i-r;O.a=a,O.b=o}function A(e,t){var n=T(e),r=T(t),i=n-(r>>1)&o,a=r+i-32768&o;O.a=a,O.b=i}function ee(e,t,n,r,i,a,o){for(var s=o<16384,c=n>i?i:n,l=1,u;l<=c;)l<<=1;for(l>>=1,u=l,l>>=1;l>=1;){for(var d=0,f=d+a*(i-u),p=a*l,m=a*u,h=r*l,g=r*u,_,v,y,b;d<=f;d+=m){for(var x=d,S=d+r*(n-u);x<=S;x+=g){var C=x+h,w=x+p,T=w+h;s?(k(e[x+t],e[w+t]),_=O.a,y=O.b,k(e[C+t],e[T+t]),v=O.a,b=O.b,k(_,v),e[x+t]=O.a,e[C+t]=O.b,k(y,b),e[w+t]=O.a,e[T+t]=O.b):(A(e[x+t],e[w+t]),_=O.a,y=O.b,A(e[C+t],e[T+t]),v=O.a,b=O.b,A(_,v),e[x+t]=O.a,e[C+t]=O.b,A(y,b),e[w+t]=O.a,e[T+t]=O.b)}if(n&l){var w=x+p;s?k(e[x+t],e[w+t]):A(e[x+t],e[w+t]),_=O.a,e[w+t]=O.b,e[x+t]=_}}if(i&l)for(var x=d,S=d+r*(n-u);x<=S;x+=g){var C=x+h;s?k(e[x+t],e[C+t]):A(e[x+t],e[C+t]),_=O.a,e[C+t]=O.b,e[x+t]=_}u=l,l>>=1}return d}function j(e,t,n,r,i,o,s,c,l,u){for(var d=0,f=0,p=c,m=Math.trunc(i.value+(o+7)/8);i.value<m;)for(x(d,f,n,i),d=b.c,f=b.lc;f>=14;){var h=t[d>>f-14&a];if(h.len)f-=h.len,w(h.lit,s,d,f,n,r,i,l,u,p),d=S.c,f=S.lc;else{if(!h.p)throw`hufDecode issues`;for(var g=0;g<h.lit;g++){for(var y=_(e[h.p[g]]);f<y&&i.value<m;)x(d,f,n,i),d=b.c,f=b.lc;if(f>=y&&v(e[h.p[g]])==(d>>f-y&(1<<y)-1)){f-=y,w(h.p[g],s,d,f,n,r,i,l,u,p),d=S.c,f=S.lc;break}}if(g==h.lit)throw`hufDecode issues`}}var C=8-o&7;for(d>>=C,f-=C;f>0;){var h=t[d<<14-f&a];if(h.len)f-=h.len,w(h.lit,s,d,f,n,r,i,l,u,p),d=S.c,f=S.lc;else throw`hufDecode issues`}return!0}function te(e,t,n,a,o,s){var c={value:0},u=n.value,d=z(t,n),f=z(t,n);n.value+=4;var p=z(t,n);if(n.value+=4,d<0||d>=r||f<0||f>=r)throw`Something wrong with HUF_ENCSIZE`;var m=Array(r),h=Array(i);if(l(h),g(e,t,n,a-(n.value-u),d,f,m),p>8*(a-(n.value-u)))throw`Something wrong with hufUncompress`;y(m,d,f,h),j(m,h,e,t,n,p,f,s,o,c)}function ne(e,t,n){for(var r=0;r<n;++r)t[r]=e[t[r]]}function M(e){for(var t=1;t<e.length;t++){var n=e[t-1]+e[t]-128;e[t]=n}}function N(e,t){for(var n=0,r=Math.floor((e.length+1)/2),i=0,a=e.length-1;!(i>a||(t[i++]=e[n++],i>a));)t[i++]=e[r++]}function re(e){for(var t=e.byteLength,n=[],r=0,i=new DataView(e);t>0;){var a=i.getInt8(r++);if(a<0){var o=-a;t-=o+1;for(var s=0;s<o;s++)n.push(i.getUint8(r++))}else{var o=a;t-=2;for(var c=i.getUint8(r++),s=0;s<o+1;s++)n.push(c)}}return n}function P(e,t,n,r,i,a){var o=new DataView(a.buffer),s=n[e.idx[0]].width,c=n[e.idx[0]].height,l=3,u=Math.floor(s/8),d=Math.ceil(s/8),f=Math.ceil(c/8),p=s-(d-1)*8,m=c-(f-1)*8,h={value:0},g=Array(l),_=Array(l),v=Array(l),y=Array(l),b=Array(l);for(let n=0;n<l;++n)b[n]=t[e.idx[n]],g[n]=n<1?0:g[n-1]+d*f,_[n]=new Float32Array(64),v[n]=new Uint16Array(64),y[n]=new Uint16Array(d*64);for(let t=0;t<f;++t){var x=8;t==f-1&&(x=m);var S=8;for(let e=0;e<d;++e){e==d-1&&(S=p);for(let e=0;e<l;++e)v[e].fill(0),v[e][0]=i[g[e]++],F(h,r,v[e]),ie(v[e],_[e]),ae(_[e]);oe(_);for(let t=0;t<l;++t)se(_[t],y[t],e*64)}let a=0;for(let r=0;r<l;++r){let i=n[e.idx[r]].type;for(let e=8*t;e<8*t+x;++e){a=b[r][e];for(let t=0;t<u;++t){let n=t*64+(e&7)*8;o.setUint16(a+0*i,y[r][n+0],!0),o.setUint16(a+2*i,y[r][n+1],!0),o.setUint16(a+4*i,y[r][n+2],!0),o.setUint16(a+6*i,y[r][n+3],!0),o.setUint16(a+8*i,y[r][n+4],!0),o.setUint16(a+10*i,y[r][n+5],!0),o.setUint16(a+12*i,y[r][n+6],!0),o.setUint16(a+14*i,y[r][n+7],!0),a+=16*i}}if(u!=d)for(let e=8*t;e<8*t+x;++e){let t=b[r][e]+8*u*2*i,n=u*64+(e&7)*8;for(let e=0;e<S;++e)o.setUint16(t+e*2*i,y[r][n+e],!0)}}}for(var C=new Uint16Array(s),o=new DataView(a.buffer),w=0;w<l;++w){n[e.idx[w]].decoded=!0;var T=n[e.idx[w]].type;if(n[w].type==2)for(var E=0;E<c;++E){let e=b[w][E];for(var D=0;D<s;++D)C[D]=o.getUint16(e+D*2*T,!0);for(var D=0;D<s;++D)o.setFloat32(e+D*2*T,H(C[D]),!0)}}}function F(e,t,n){for(var r,i=1;i<64;)r=t[e.value],r==65280?i=64:r>>8==255?i+=r&255:(n[i]=r,i++),e.value++}function ie(e,t){t[0]=H(e[0]),t[1]=H(e[1]),t[2]=H(e[5]),t[3]=H(e[6]),t[4]=H(e[14]),t[5]=H(e[15]),t[6]=H(e[27]),t[7]=H(e[28]),t[8]=H(e[2]),t[9]=H(e[4]),t[10]=H(e[7]),t[11]=H(e[13]),t[12]=H(e[16]),t[13]=H(e[26]),t[14]=H(e[29]),t[15]=H(e[42]),t[16]=H(e[3]),t[17]=H(e[8]),t[18]=H(e[12]),t[19]=H(e[17]),t[20]=H(e[25]),t[21]=H(e[30]),t[22]=H(e[41]),t[23]=H(e[43]),t[24]=H(e[9]),t[25]=H(e[11]),t[26]=H(e[18]),t[27]=H(e[24]),t[28]=H(e[31]),t[29]=H(e[40]),t[30]=H(e[44]),t[31]=H(e[53]),t[32]=H(e[10]),t[33]=H(e[19]),t[34]=H(e[23]),t[35]=H(e[32]),t[36]=H(e[39]),t[37]=H(e[45]),t[38]=H(e[52]),t[39]=H(e[54]),t[40]=H(e[20]),t[41]=H(e[22]),t[42]=H(e[33]),t[43]=H(e[38]),t[44]=H(e[46]),t[45]=H(e[51]),t[46]=H(e[55]),t[47]=H(e[60]),t[48]=H(e[21]),t[49]=H(e[34]),t[50]=H(e[37]),t[51]=H(e[47]),t[52]=H(e[50]),t[53]=H(e[56]),t[54]=H(e[59]),t[55]=H(e[61]),t[56]=H(e[35]),t[57]=H(e[36]),t[58]=H(e[48]),t[59]=H(e[49]),t[60]=H(e[57]),t[61]=H(e[58]),t[62]=H(e[62]),t[63]=H(e[63])}function ae(e){let t=.5*Math.cos(3.14159/4),n=.5*Math.cos(3.14159/16),r=.5*Math.cos(3.14159/8),i=.5*Math.cos(3*3.14159/16),a=.5*Math.cos(15.70795/16),o=.5*Math.cos(3*3.14159/8),s=.5*Math.cos(21.99113/16);for(var c=[,,,,],l=[,,,,],u=[,,,,],d=[,,,,],f=0;f<8;++f){var p=f*8;c[0]=r*e[p+2],c[1]=o*e[p+2],c[2]=r*e[p+6],c[3]=o*e[p+6],l[0]=n*e[p+1]+i*e[p+3]+a*e[p+5]+s*e[p+7],l[1]=i*e[p+1]-s*e[p+3]-n*e[p+5]-a*e[p+7],l[2]=a*e[p+1]-n*e[p+3]+s*e[p+5]+i*e[p+7],l[3]=s*e[p+1]-a*e[p+3]+i*e[p+5]-n*e[p+7],u[0]=t*(e[p+0]+e[p+4]),u[3]=t*(e[p+0]-e[p+4]),u[1]=c[0]+c[3],u[2]=c[1]-c[2],d[0]=u[0]+u[1],d[1]=u[3]+u[2],d[2]=u[3]-u[2],d[3]=u[0]-u[1],e[p+0]=d[0]+l[0],e[p+1]=d[1]+l[1],e[p+2]=d[2]+l[2],e[p+3]=d[3]+l[3],e[p+4]=d[3]-l[3],e[p+5]=d[2]-l[2],e[p+6]=d[1]-l[1],e[p+7]=d[0]-l[0]}for(var m=0;m<8;++m)c[0]=r*e[16+m],c[1]=o*e[16+m],c[2]=r*e[48+m],c[3]=o*e[48+m],l[0]=n*e[8+m]+i*e[24+m]+a*e[40+m]+s*e[56+m],l[1]=i*e[8+m]-s*e[24+m]-n*e[40+m]-a*e[56+m],l[2]=a*e[8+m]-n*e[24+m]+s*e[40+m]+i*e[56+m],l[3]=s*e[8+m]-a*e[24+m]+i*e[40+m]-n*e[56+m],u[0]=t*(e[m]+e[32+m]),u[3]=t*(e[m]-e[32+m]),u[1]=c[0]+c[3],u[2]=c[1]-c[2],d[0]=u[0]+u[1],d[1]=u[3]+u[2],d[2]=u[3]-u[2],d[3]=u[0]-u[1],e[0+m]=d[0]+l[0],e[8+m]=d[1]+l[1],e[16+m]=d[2]+l[2],e[24+m]=d[3]+l[3],e[32+m]=d[3]-l[3],e[40+m]=d[2]-l[2],e[48+m]=d[1]-l[1],e[56+m]=d[0]-l[0]}function oe(e){for(var t=0;t<64;++t){var n=e[0][t],r=e[1][t],i=e[2][t];e[0][t]=n+1.5747*i,e[1][t]=n-.1873*r-.4682*i,e[2][t]=n+1.8556*r}}function se(e,t,n){for(var r=0;r<64;++r)t[n+r]=m.toHalfFloat(I(e[r]))}function I(e){return e<=1?Math.sign(e)*Math.abs(e)**2.2:Math.sign(e)*s**(Math.abs(e)-1)}function ce(e){return new DataView(e.array.buffer,e.offset.value,e.size)}function le(e){var t=e.viewer.buffer.slice(e.offset.value,e.offset.value+e.size),n=new Uint8Array(re(t)),r=new Uint8Array(n.length);return M(n),N(n,r),new DataView(r.buffer)}function ue(e){var t=Ct(e.array.slice(e.offset.value,e.offset.value+e.size)),n=new Uint8Array(t.length);return M(t),N(t,n),new DataView(n.buffer)}function L(e){for(var r=e.viewer,i={value:e.offset.value},a=new Uint16Array(e.width*e.scanlineBlockSize*(e.channels*e.type)),o=new Uint8Array(n),s=0,l=Array(e.channels),u=0;u<e.channels;u++)l[u]={},l[u].start=s,l[u].end=l[u].start,l[u].nx=e.width,l[u].ny=e.lines,l[u].size=e.type,s+=l[u].nx*l[u].ny*l[u].size;var d=xe(r,i),f=xe(r,i);if(f>=n)throw`Something is wrong with PIZ_COMPRESSION BITMAP_SIZE`;if(d<=f)for(var u=0;u<f-d+1;u++)o[u+d]=ye(r,i);var p=new Uint16Array(t),m=c(o,p),h=z(r,i);te(e.array,r,i,h,a,s);for(var u=0;u<e.channels;++u)for(var g=l[u],_=0;_<l[u].size;++_)ee(a,g.start+_,g.nx,g.size,g.ny,g.nx*g.size,m);ne(p,a,s);for(var v=0,y=new Uint8Array(a.buffer.byteLength),b=0;b<e.lines;b++)for(var x=0;x<e.channels;x++){var g=l[x],S=g.nx*g.size,C=new Uint8Array(a.buffer,g.end*2,S*2);y.set(C,v),v+=S*2,g.end+=S}return new DataView(y.buffer)}function de(e){var t=Ct(e.array.slice(e.offset.value,e.offset.value+e.size));let n=e.lines*e.channels*e.width,r=e.type==1?new Uint16Array(n):new Uint32Array(n),i=0,a=0,o=[,,,,];for(let n=0;n<e.lines;n++)for(let n=0;n<e.channels;n++){let n=0;switch(e.type){case 1:o[0]=i,o[1]=o[0]+e.width,i=o[1]+e.width;for(let i=0;i<e.width;++i){let e=t[o[0]++]<<8|t[o[1]++];n+=e,r[a]=n,a++}break;case 2:o[0]=i,o[1]=o[0]+e.width,o[2]=o[1]+e.width,i=o[2]+e.width;for(let i=0;i<e.width;++i){let e=t[o[0]++]<<24|t[o[1]++]<<16|t[o[2]++]<<8;n+=e,r[a]=n,a++}}}return new DataView(r.buffer)}function fe(e){var t=e.viewer,n={value:e.offset.value},r=new Uint8Array(e.width*e.lines*(e.channels*e.type*2)),i={version:B(t,n),unknownUncompressedSize:B(t,n),unknownCompressedSize:B(t,n),acCompressedSize:B(t,n),dcCompressedSize:B(t,n),rleCompressedSize:B(t,n),rleUncompressedSize:B(t,n),rleRawSize:B(t,n),totalAcUncompressedCount:B(t,n),totalDcUncompressedCount:B(t,n),acCompression:B(t,n)};if(i.version<2)throw`EXRLoader.parse: `+W.compression+` version `+i.version+` is unsupported`;for(var a=[],o=xe(t,n)-2;o>0;){var s=pe(t.buffer,n),c=ye(t,n),l=c>>2&3,u=(c>>4)-1,d=new Int8Array([u])[0],f=ye(t,n);a.push({name:s,index:d,type:f,compression:l}),o-=s.length+3}for(var p=W.channels,m=Array(e.channels),h=0;h<e.channels;++h){var g=m[h]={},_=p[h];g.name=_.name,g.compression=0,g.decoded=!1,g.type=_.pixelType,g.pLinear=_.pLinear,g.width=e.width,g.height=e.lines}for(var v={idx:[,,,]},y=0;y<e.channels;++y)for(var g=m[y],h=0;h<a.length;++h){var b=a[h];g.name==b.name&&(g.compression=b.compression,b.index>=0&&(v.idx[b.index]=y),g.offset=y)}if(i.acCompressedSize>0)switch(i.acCompression){case 0:var x=new Uint16Array(i.totalAcUncompressedCount);te(e.array,t,n,i.acCompressedSize,x,i.totalAcUncompressedCount);break;case 1:var S=e.array.slice(n.value,n.value+i.totalAcUncompressedCount),C=Ct(S),x=new Uint16Array(C.buffer);n.value+=i.totalAcUncompressedCount}if(i.dcCompressedSize>0){var w={array:e.array,offset:n,size:i.dcCompressedSize},T=new Uint16Array(ue(w).buffer);n.value+=i.dcCompressedSize}if(i.rleRawSize>0){var S=e.array.slice(n.value,n.value+i.rleCompressedSize),C=Ct(S),E=re(C.buffer);n.value+=i.rleCompressedSize}for(var D=0,O=Array(m.length),h=0;h<O.length;++h)O[h]=[];for(var k=0;k<e.lines;++k)for(var A=0;A<m.length;++A)O[A].push(D),D+=m[A].width*e.type*2;P(v,O,m,x,T,r);for(var h=0;h<m.length;++h){var g=m[h];if(!g.decoded)switch(g.compression){case 2:for(var ee=0,j=0,k=0;k<e.lines;++k){for(var ne=O[h][ee],M=0;M<g.width;++M){for(var N=0;N<2*g.type;++N)r[ne++]=E[j+N*g.width*g.height];j++}ee++}break;default:throw`EXRLoader.parse: unsupported channel compression`}}return new DataView(r.buffer)}function pe(e,t){for(var n=new Uint8Array(e),r=0;n[t.value+r]!=0;)r+=1;var i=new TextDecoder().decode(n.slice(t.value,t.value+r));return t.value=t.value+r+1,i}function me(e,t,n){var r=new TextDecoder().decode(new Uint8Array(e).slice(t.value,t.value+n));return t.value+=n,r}function he(e,t){return[R(e,t),z(e,t)]}function _e(e,t){return[z(e,t),z(e,t)]}function R(e,t){var n=e.getInt32(t.value,!0);return t.value+=4,n}function z(e,t){var n=e.getUint32(t.value,!0);return t.value+=4,n}function ve(e,t){var n=e[t.value];return t.value+=1,n}function ye(e,t){var n=e.getUint8(t.value);return t.value+=1,n}let B=function(e,t){let n;return n=`getBigInt64`in DataView.prototype?Number(e.getBigInt64(t.value,!0)):e.getUint32(t.value+4,!0)+Number(e.getUint32(t.value,!0)<<32),t.value+=8,n};function V(e,t){var n=e.getFloat32(t.value,!0);return t.value+=4,n}function be(e,t){return m.toHalfFloat(V(e,t))}function H(e){var t=(e&31744)>>10,n=e&1023;return(e>>15?-1:1)*(t?t===31?n?NaN:1/0:2**(t-15)*(1+n/1024):n/1024*6103515625e-14)}function xe(e,t){var n=e.getUint16(t.value,!0);return t.value+=2,n}function Se(e,t){return H(xe(e,t))}function Ce(e,t,n,r){for(var i=n.value,a=[];n.value<i+r-1;){var o=pe(t,n),s=R(e,n),c=ye(e,n);n.value+=3;var l=R(e,n),u=R(e,n);a.push({name:o,pixelType:s,pLinear:c,xSampling:l,ySampling:u})}return n.value+=1,a}function we(e,t){return{redX:V(e,t),redY:V(e,t),greenX:V(e,t),greenY:V(e,t),blueX:V(e,t),blueY:V(e,t),whiteX:V(e,t),whiteY:V(e,t)}}function Te(e,t){return[`NO_COMPRESSION`,`RLE_COMPRESSION`,`ZIPS_COMPRESSION`,`ZIP_COMPRESSION`,`PIZ_COMPRESSION`,`PXR24_COMPRESSION`,`B44_COMPRESSION`,`B44A_COMPRESSION`,`DWAA_COMPRESSION`,`DWAB_COMPRESSION`][ye(e,t)]}function Ee(e,t){return{xMin:z(e,t),yMin:z(e,t),xMax:z(e,t),yMax:z(e,t)}}function De(e,t){return[`INCREASING_Y`][ye(e,t)]}function Oe(e,t){return[V(e,t),V(e,t)]}function ke(e,t){return[V(e,t),V(e,t),V(e,t)]}function Ae(e,t,n,r,i){if(r===`string`||r===`stringvector`||r===`iccProfile`)return me(t,n,i);if(r===`chlist`)return Ce(e,t,n,i);if(r===`chromaticities`)return we(e,n);if(r===`compression`)return Te(e,n);if(r===`box2i`)return Ee(e,n);if(r===`lineOrder`)return De(e,n);if(r===`float`)return V(e,n);if(r===`v2f`)return Oe(e,n);if(r===`v3f`)return ke(e,n);if(r===`int`)return R(e,n);if(r===`rational`)return he(e,n);if(r===`timecode`)return _e(e,n);if(r===`preview`)return n.value+=i,`skipped`;n.value+=i}function je(e,t,n){let r={};if(e.getUint32(0,!0)!=20000630)throw`THREE.EXRLoader: provided file doesn't appear to be in OpenEXR format.`;r.version=e.getUint8(4);let i=e.getUint8(5);r.spec={singleTile:!!(i&2),longName:!!(i&4),deepFormat:!!(i&8),multiPart:!!(i&16)},n.value=8;for(var a=!0;a;){var o=pe(t,n);if(o==0)a=!1;else{var s=pe(t,n),c=Ae(e,t,n,s,z(e,n));c===void 0?console.warn(`EXRLoader.parse: skipped unknown header attribute type '${s}'.`):r[o]=c}}if(i&-5)throw console.error(`EXRHeader:`,r),`THREE.EXRLoader: provided file is currently unsupported.`;return r}function U(e,t,n,r,i){let a={size:0,viewer:t,array:n,offset:r,width:e.dataWindow.xMax-e.dataWindow.xMin+1,height:e.dataWindow.yMax-e.dataWindow.yMin+1,channels:e.channels.length,bytesPerLine:null,lines:null,inputSize:null,type:e.channels[0].pixelType,uncompress:null,getter:null,format:null,[At?`colorSpace`:`encoding`]:null};switch(e.compression){case`NO_COMPRESSION`:a.lines=1,a.uncompress=ce;break;case`RLE_COMPRESSION`:a.lines=1,a.uncompress=le;break;case`ZIPS_COMPRESSION`:a.lines=1,a.uncompress=ue;break;case`ZIP_COMPRESSION`:a.lines=16,a.uncompress=ue;break;case`PIZ_COMPRESSION`:a.lines=32,a.uncompress=L;break;case`PXR24_COMPRESSION`:a.lines=16,a.uncompress=de;break;case`DWAA_COMPRESSION`:a.lines=32,a.uncompress=fe;break;case`DWAB_COMPRESSION`:a.lines=256,a.uncompress=fe;break;default:throw`EXRLoader.parse: `+e.compression+` is unsupported`}if(a.scanlineBlockSize=a.lines,a.type==1)switch(i){case C:a.getter=Se,a.inputSize=2;break;case D:a.getter=xe,a.inputSize=2}else if(a.type==2)switch(i){case C:a.getter=V,a.inputSize=4;break;case D:a.getter=be,a.inputSize=4}else throw`EXRLoader.parse: unsupported pixelType `+a.type+` for `+e.compression+`.`;a.blockCount=(e.dataWindow.yMax+1)/a.scanlineBlockSize;for(var o=0;o<a.blockCount;o++)B(t,r);a.outputChannels=a.channels==3?4:a.channels;let s=a.width*a.height*a.outputChannels;switch(i){case C:a.byteArray=new Float32Array(s),a.channels<a.outputChannels&&a.byteArray.fill(1,0,s);break;case D:a.byteArray=new Uint16Array(s),a.channels<a.outputChannels&&a.byteArray.fill(15360,0,s);break;default:console.error(`THREE.EXRLoader: unsupported type: `,i)}return a.bytesPerLine=a.width*a.inputSize*a.channels,a.format=a.outputChannels==4?u:ge,At?a.colorSpace=`srgb-linear`:a.encoding=3e3,a}let Me=new DataView(e),Ne=new Uint8Array(e),Pe={value:0},W=je(Me,e,Pe),G=U(W,Me,Ne,Pe,this.type),Fe={value:0},K={R:0,G:1,B:2,A:3,Y:0};for(let e=0;e<G.height/G.scanlineBlockSize;e++){let t=z(Me,Pe);G.size=z(Me,Pe),G.lines=t+G.scanlineBlockSize>G.height?G.height-t:G.scanlineBlockSize;let n=G.size<G.lines*G.bytesPerLine?G.uncompress(G):ce(G);Pe.value+=G.size;for(let t=0;t<G.scanlineBlockSize;t++){let r=t+e*G.scanlineBlockSize;if(r>=G.height)break;for(let e=0;e<G.channels;e++){let i=K[W.channels[e].name];for(let a=0;a<G.width;a++){Fe.value=(t*(G.channels*G.width)+e*G.width+a)*G.inputSize;let o=(G.height-1-r)*(G.width*G.outputChannels)+a*G.outputChannels+i;G.byteArray[o]=G.getter(n,Fe)}}}}return{header:W,width:G.width,height:G.height,data:G.byteArray,format:G.format,[At?`colorSpace`:`encoding`]:G[At?`colorSpace`:`encoding`],type:this.type}}setDataType(e){return this.type=e,this}load(e,t,n,r){function i(e,n){At?e.colorSpace=n.colorSpace:e.encoding=n.encoding,e.minFilter=k,e.magFilter=k,e.generateMipmaps=!1,e.flipY=!1,t&&t(e,n)}return super.load(e,i,n,r)}},Mt=new pe,Nt=new F,Pt=class extends ee{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new he([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new he([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new je(t,6,1);return this.setAttribute(`instanceStart`,new ne(n,3,0)),this.setAttribute(`instanceEnd`,new ne(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new je(n,t*2,1);return this.setAttribute(`instanceColorStart`,new ne(r,t,0)),this.setAttribute(`instanceColorEnd`,new ne(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new c(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pe);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Mt.setFromBufferAttribute(t),this.boundingBox.union(Mt))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new d),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)Nt.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(Nt)),Nt.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(Nt));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}applyMatrix(e){return console.warn(`THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().`),this.applyMatrix4(e)}},Ft=class extends Pt{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(t===3)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},It=class extends g{constructor(e){super({type:`LineMaterial`,uniforms:_.clone(_.merge([we.common,we.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new b(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${Je>=154?`colorspace_fragment`:`encodings_fragment`}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA=`1`:delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return`WORLD_UNITS`in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return`USE_DASH`in this.defines},set(e){!!e!=`USE_DASH`in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return`USE_ALPHA_TO_COVERAGE`in this.defines},set:function(e){!!e!=`USE_ALPHA_TO_COVERAGE`in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE=``,this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}},Lt=new P,Rt=new F,zt=new F,X=new P,Z=new P,Bt=new P,Vt=new F,Ht=new ce,Q=new y,Ut=new F,Wt=new pe,Gt=new d,Kt=new P,qt,Jt;function Yt(e,t,n){return Kt.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),Kt.multiplyScalar(1/Kt.w),Kt.x=Jt/n.width,Kt.y=Jt/n.height,Kt.applyMatrix4(e.projectionMatrixInverse),Kt.multiplyScalar(1/Kt.w),Math.abs(Math.max(Kt.x,Kt.y))}function Xt(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){Q.start.fromBufferAttribute(i,r),Q.end.fromBufferAttribute(a,r),Q.applyMatrix4(n);let o=new F,s=new F;qt.distanceSqToSegment(Q.start,Q.end,s,o),s.distanceTo(o)<Jt*.5&&t.push({point:s,pointOnLine:o,distance:qt.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[Ye]:null})}}function Zt(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),u=-t.near;qt.at(1,Bt),Bt.w=1,Bt.applyMatrix4(t.matrixWorldInverse),Bt.applyMatrix4(r),Bt.multiplyScalar(1/Bt.w),Bt.x*=i.x/2,Bt.y*=i.y/2,Bt.z=0,Vt.copy(Bt),Ht.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(X.fromBufferAttribute(s,t),Z.fromBufferAttribute(c,t),X.w=1,Z.w=1,X.applyMatrix4(Ht),Z.applyMatrix4(Ht),X.z>u&&Z.z>u)continue;if(X.z>u){let e=X.z-Z.z,t=(X.z-u)/e;X.lerp(Z,t)}else if(Z.z>u){let e=Z.z-X.z,t=(Z.z-u)/e;Z.lerp(X,t)}X.applyMatrix4(r),Z.applyMatrix4(r),X.multiplyScalar(1/X.w),Z.multiplyScalar(1/Z.w),X.x*=i.x/2,X.y*=i.y/2,Z.x*=i.x/2,Z.y*=i.y/2,Q.start.copy(X),Q.start.z=0,Q.end.copy(Z),Q.end.z=0;let o=Q.closestPointToPointParameter(Vt,!0);Q.at(o,Ut);let l=Se.lerp(X.z,Z.z,o),d=l>=-1&&l<=1,f=Vt.distanceTo(Ut)<Jt*.5;if(d&&f){Q.start.fromBufferAttribute(s,t),Q.end.fromBufferAttribute(c,t),Q.start.applyMatrix4(a),Q.end.applyMatrix4(a);let r=new F,i=new F;qt.distanceSqToSegment(Q.start,Q.end,i,r),n.push({point:i,pointOnLine:r,distance:qt.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,[Ye]:null})}}}var Qt=class extends z{constructor(e=new Pt,t=new It({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)Rt.fromBufferAttribute(t,e),zt.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+Rt.distanceTo(zt);let i=new je(r,2,1);return e.setAttribute(`instanceDistanceStart`,new ne(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new ne(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;qt=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;Jt=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),Gt.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?Jt*.5:Yt(r,Math.max(r.near,Gt.distanceToPoint(qt.origin)),s.resolution),Gt.radius+=c,qt.intersectsSphere(Gt)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Wt.copy(o.boundingBox).applyMatrix4(a);let l;l=n?Jt*.5:Yt(r,Math.max(r.near,Wt.distanceToPoint(qt.origin)),s.resolution),Wt.expandByScalar(l),qt.intersectsBox(Wt)!==!1&&(n?Xt(this,t):Zt(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(Lt),this.material.uniforms.resolution.value.set(Lt.z,Lt.w))}},$t=class extends Qt{constructor(e=new Ft,t=new It({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},en=U.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:r,lineWidth:i,segments:a,dashed:o,...s},c){var l;let u=I(e=>e.size),d=U.useMemo(()=>a?new Qt:new $t,[a]),[f]=U.useState(()=>new It),p=(n==null||(l=n[0])==null?void 0:l.length)===4?4:3,m=U.useMemo(()=>{let r=a?new Pt:new Ft,i=e.map(e=>{let t=Array.isArray(e);return e instanceof F||e instanceof P?[e.x,e.y,e.z]:e instanceof b?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=16777215;let e=n.map(e=>e instanceof j?e.toArray():e);r.setColors(e.flat(),p)}return r},[e,a,n,p]);return U.useLayoutEffect(()=>{d.computeLineDistances()},[e,d]),U.useLayoutEffect(()=>{o?f.defines.USE_DASH=``:delete f.defines.USE_DASH,f.needsUpdate=!0},[o,f]),U.useEffect(()=>()=>{m.dispose(),f.dispose()},[m]),U.createElement(`primitive`,R({object:d,ref:c},s),U.createElement(`primitive`,{object:m,attach:`geometry`}),U.createElement(`primitive`,R({object:f,attach:`material`,color:t,vertexColors:!!n,resolution:[u.width,u.height],linewidth:r??i??1,dashed:o,transparent:p===4},s)))}),tn=U.forwardRef(({threshold:e=15,geometry:t,...n},r)=>{let i=U.useRef(null);U.useImperativeHandle(r,()=>i.current,[]);let a=U.useMemo(()=>[0,0,0,1,0,0],[]),o=U.useRef(null),s=U.useRef(null);return U.useLayoutEffect(()=>{let n=i.current.parent,r=t??n?.geometry;if(!r||o.current===r&&s.current===e)return;o.current=r,s.current=e;let a=new E(r,e).attributes.position.array;i.current.geometry.setPositions(a),i.current.geometry.attributes.instanceStart.needsUpdate=!0,i.current.geometry.attributes.instanceEnd.needsUpdate=!0,i.current.computeLineDistances()}),U.createElement(en,R({segments:!0,points:a,ref:i,raycast:()=>null},n))}),nn=1e-5;function rn(e,t,n){let r=new v,i=n-nn;return r.absarc(nn,nn,nn,-Math.PI/2,-Math.PI,!0),r.absarc(nn,t-i*2,nn,Math.PI,Math.PI/2,!0),r.absarc(e-i*2,t-i*2,nn,Math.PI/2,0,!0),r.absarc(e-i*2,nn,nn,0,-Math.PI/2,!0),r}var an=U.forwardRef(function({args:[e=1,t=1,n=1]=[],radius:r=.05,steps:i=1,smoothness:a=4,bevelSegments:o=4,creaseAngle:s=.4,children:c,...l},u){return U.createElement(`mesh`,R({ref:u},l),U.createElement(on,{args:[e,t,n],radius:r,steps:i,smoothness:a,bevelSegments:o,creaseAngle:s}),c)}),on=U.forwardRef(function({args:[e=1,t=1,n=1]=[],radius:r=.05,steps:i=1,smoothness:a=4,bevelSegments:o=4,creaseAngle:s=.4,...c},l){let u=U.useMemo(()=>rn(e,t,r),[e,t,r]),d=U.useMemo(()=>({depth:n-r*2,bevelEnabled:!0,bevelSegments:o*2,steps:i,bevelSize:r-nn,bevelThickness:r,curveSegments:a}),[n,r,a,o,i]),f=U.useRef(null);return U.useLayoutEffect(()=>{f.current&&(f.current.center(),Ze(f.current,s))},[u,d,s]),U.useImperativeHandle(l,()=>f.current),U.createElement(`extrudeGeometry`,R({ref:f,args:[u,d]},c))}),sn=(e,t,n)=>{let r;switch(e){case x:r=new Uint8ClampedArray(t*n*4);break;case D:r=new Uint16Array(t*n*4);break;case V:r=new Uint32Array(t*n*4);break;case Ee:r=new Int8Array(t*n*4);break;case S:r=new Int16Array(t*n*4);break;case N:r=new Int32Array(t*n*4);break;case C:r=new Float32Array(t*n*4);break;default:throw Error(`Unsupported data type`)}return r},cn,ln=(e,t,n,r)=>{if(cn!==void 0)return cn;let i=new A(1,1,r);t.setRenderTarget(i);let a=new z(new p,new Te({color:16777215}));t.render(a,n),t.setRenderTarget(null);let o=sn(e,i.width,i.height);return t.readRenderTargetPixels(i,0,0,i.width,i.height,o),i.dispose(),a.geometry.dispose(),a.material.dispose(),cn=o[0]!==0,cn},un=class e{_renderer;_rendererIsDisposable=!1;_material;_scene;_camera;_quad;_renderTarget;_width;_height;_type;_colorSpace;_supportsReadPixels=!0;constructor(t){this._width=t.width,this._height=t.height,this._type=t.type,this._colorSpace=t.colorSpace;let n={format:u,depthBuffer:!1,stencilBuffer:!1,type:this._type,colorSpace:this._colorSpace,anisotropy:t.renderTargetOptions?.anisotropy===void 0?1:t.renderTargetOptions?.anisotropy,generateMipmaps:t.renderTargetOptions?.generateMipmaps!==void 0&&t.renderTargetOptions?.generateMipmaps,magFilter:t.renderTargetOptions?.magFilter===void 0?k:t.renderTargetOptions?.magFilter,minFilter:t.renderTargetOptions?.minFilter===void 0?k:t.renderTargetOptions?.minFilter,samples:t.renderTargetOptions?.samples===void 0?void 0:t.renderTargetOptions?.samples,wrapS:t.renderTargetOptions?.wrapS===void 0?Oe:t.renderTargetOptions?.wrapS,wrapT:t.renderTargetOptions?.wrapT===void 0?Oe:t.renderTargetOptions?.wrapT};if(this._material=t.material,t.renderer?this._renderer=t.renderer:(this._renderer=e.instantiateRenderer(),this._rendererIsDisposable=!0),this._scene=new O,this._camera=new se,this._camera.position.set(0,0,10),this._camera.left=-.5,this._camera.right=.5,this._camera.top=.5,this._camera.bottom=-.5,this._camera.updateProjectionMatrix(),!ln(this._type,this._renderer,this._camera,n)){let e;switch(this._type){case D:e=this._renderer.extensions.has(`EXT_color_buffer_float`)?C:void 0}e===void 0?(this._supportsReadPixels=!1,console.warn(`This browser dos not support toArray or toDataTexture, calls to those methods will result in an error thrown`)):(console.warn(`This browser does not support reading pixels from ${this._type} RenderTargets, switching to ${C}`),this._type=e)}this._quad=new z(new p,this._material),this._quad.geometry.computeBoundingBox(),this._scene.add(this._quad),this._renderTarget=new A(this.width,this.height,n),this._renderTarget.texture.mapping=t.renderTargetOptions?.mapping===void 0?300:t.renderTargetOptions?.mapping}static instantiateRenderer(){let e=new de;return e.setSize(128,128),e}render=()=>{this._renderer.setRenderTarget(this._renderTarget);try{this._renderer.render(this._scene,this._camera)}catch(e){throw this._renderer.setRenderTarget(null),e}this._renderer.setRenderTarget(null)};toArray(){if(!this._supportsReadPixels)throw Error(`Can't read pixels in this browser`);let e=sn(this._type,this._width,this._height);return this._renderer.readRenderTargetPixels(this._renderTarget,0,0,this._width,this._height,e),e}toDataTexture(e){let t=new De(this.toArray(),this.width,this.height,u,this._type,e?.mapping||300,e?.wrapS||1001,e?.wrapT||1001,e?.magFilter||1006,e?.minFilter||1006,e?.anisotropy||1,ye);return t.generateMipmaps=e?.generateMipmaps!==void 0&&e?.generateMipmaps,t}disposeOnDemandRenderer(){this._renderer.setRenderTarget(null),this._rendererIsDisposable&&(this._renderer.dispose(),this._renderer.forceContextLoss())}dispose(e){this.disposeOnDemandRenderer(),e&&this.renderTarget.dispose(),this.material instanceof g&&Object.values(this.material.uniforms).forEach(e=>{e.value instanceof M&&e.value.dispose()}),Object.values(this.material).forEach(e=>{e instanceof M&&e.dispose()}),this.material.dispose(),this._quad.geometry.dispose()}get width(){return this._width}set width(e){this._width=e,this._renderTarget.setSize(this._width,this._height)}get height(){return this._height}set height(e){this._height=e,this._renderTarget.setSize(this._width,this._height)}get renderer(){return this._renderer}get renderTarget(){return this._renderTarget}set renderTarget(e){this._renderTarget=e,this._width=e.width,this._height=e.height}get material(){return this._material}get type(){return this._type}get colorSpace(){return this._colorSpace}},dn=class extends Error{},fn=class extends Error{},pn=(e,t,n)=>{let r=RegExp(`${t}="([^"]*)"`,`i`).exec(e);if(r)return r[1];let i=RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`,`i`).exec(e);if(i){let e=i[1].match(/<rdf:li>([^<]*)<\/rdf:li>/g);return e&&e.length===3?e.map(e=>e.replace(/<\/?rdf:li>/g,``)):i[1].trim()}if(n!==void 0)return n;throw Error(`Can't find ${t} in gainmap metadata`)},mn=e=>{let t;t=typeof TextDecoder<`u`?new TextDecoder().decode(e):e.toString();let n=t.indexOf(`<x:xmpmeta`);for(;n!==-1;){let e=t.indexOf(`x:xmpmeta>`,n),r=t.slice(n,e+10);try{let e=pn(r,`hdrgm:GainMapMin`,`0`),t=pn(r,`hdrgm:GainMapMax`),n=pn(r,`hdrgm:Gamma`,`1`),i=pn(r,`hdrgm:OffsetSDR`,`0.015625`),a=pn(r,`hdrgm:OffsetHDR`,`0.015625`),o=/hdrgm:HDRCapacityMin="([^"]*)"/.exec(r),s=o?o[1]:`0`,c=/hdrgm:HDRCapacityMax="([^"]*)"/.exec(r);if(!c)throw Error(`Incomplete gainmap metadata`);let l=c[1];return{gainMapMin:Array.isArray(e)?e.map(e=>parseFloat(e)):[parseFloat(e),parseFloat(e),parseFloat(e)],gainMapMax:Array.isArray(t)?t.map(e=>parseFloat(e)):[parseFloat(t),parseFloat(t),parseFloat(t)],gamma:Array.isArray(n)?n.map(e=>parseFloat(e)):[parseFloat(n),parseFloat(n),parseFloat(n)],offsetSdr:Array.isArray(i)?i.map(e=>parseFloat(e)):[parseFloat(i),parseFloat(i),parseFloat(i)],offsetHdr:Array.isArray(a)?a.map(e=>parseFloat(e)):[parseFloat(a),parseFloat(a),parseFloat(a)],hdrCapacityMin:parseFloat(s),hdrCapacityMax:parseFloat(l)}}catch{}n=t.indexOf(`<x:xmpmeta`,e)}},hn=class{options;constructor(e){this.options={debug:e&&e.debug!==void 0?e.debug:!1,extractFII:e&&e.extractFII!==void 0?e.extractFII:!0,extractNonFII:e&&e.extractNonFII!==void 0?e.extractNonFII:!0}}extract(e){return new Promise((t,n)=>{let r=this.options.debug,i=new DataView(e.buffer);if(i.getUint16(0)!==65496){n(Error(`Not a valid jpeg`));return}let a=i.byteLength,o=2,s=0,c;for(;o<a;){if(++s>250){n(Error(`Found no marker after ${s} loops 😵`));return}if(i.getUint8(o)!==255){n(Error(`Not a valid marker at offset 0x${o.toString(16)}, found: 0x${i.getUint8(o).toString(16)}`));return}if(c=i.getUint8(o+1),r&&console.log(`Marker: ${c.toString(16)}`),c===226){r&&console.log(`Found APP2 marker (0xffe2)`);let e=o+4;if(i.getUint32(e)===1297106432){let r=e+4,a;if(i.getUint16(r)===18761)a=!1;else if(i.getUint16(r)===19789)a=!0;else{n(Error(`No valid endianness marker found in TIFF header`));return}if(i.getUint16(r+2,!a)!==42){n(Error(`Not valid TIFF data! (no 0x002A marker)`));return}let o=i.getUint32(r+4,!a);if(o<8){n(Error(`Not valid TIFF data! (First offset less than 8)`));return}let s=r+o,c=i.getUint16(s,!a),l=s+2,u=0;for(let e=l;e<l+12*c;e+=12)i.getUint16(e,!a)===45057&&(u=i.getUint32(e+8,!a));let d=s+2+c*12+4,f=[];for(let e=d;e<d+u*16;e+=16){let t={MPType:i.getUint32(e,!a),size:i.getUint32(e+4,!a),dataOffset:i.getUint32(e+8,!a),dependantImages:i.getUint32(e+12,!a),start:-1,end:-1,isFII:!1};t.dataOffset?(t.start=r+t.dataOffset,t.isFII=!1):(t.start=0,t.isFII=!0),t.end=t.start+t.size,f.push(t)}if(this.options.extractNonFII&&f.length){let e=new Blob([i]),n=[];for(let t of f){if(t.isFII&&!this.options.extractFII)continue;let r=e.slice(t.start,t.end+1,`image/jpeg`);n.push(r)}t(n)}}}o+=2+i.getUint16(o+2)}})}},gn=async e=>{let t=mn(e);if(!t)throw new fn(`Gain map XMP metadata not found`);let n=await new hn({extractFII:!0,extractNonFII:!0}).extract(e);if(n.length!==2)throw new dn(`Gain map recovery image not found`);return{sdr:new Uint8Array(await n[0].arrayBuffer()),gainMap:new Uint8Array(await n[1].arrayBuffer()),metadata:t}},_n=e=>new Promise((t,n)=>{let r=document.createElement(`img`);r.onload=()=>{t(r)},r.onerror=e=>{n(e)},r.src=URL.createObjectURL(e)}),vn=class extends H{_renderer;_renderTargetOptions;_internalLoadingManager;_config;constructor(e,t){super(t),this._config=e,e.renderer&&(this._renderer=e.renderer),this._internalLoadingManager=new ae}setRenderer(e){return this._renderer=e,this}setRenderTargetOptions(e){return this._renderTargetOptions=e,this}prepareQuadRenderer(){this._renderer||console.warn(`WARNING: A Renderer was not passed to this Loader constructor or in setRenderer, the result of this Loader will need to be converted to a Data Texture with toDataTexture() before you can use it in your renderer.`);let e=this._config.createMaterial({gainMapMax:[1,1,1],gainMapMin:[0,0,0],gamma:[1,1,1],offsetHdr:[1,1,1],offsetSdr:[1,1,1],hdrCapacityMax:1,hdrCapacityMin:0,maxDisplayBoost:1,gainMap:new M,sdr:new M});return this._config.createQuadRenderer({width:16,height:16,type:D,colorSpace:ye,material:e,renderer:this._renderer,renderTargetOptions:this._renderTargetOptions})}async processImages(e,t,n){let r=t?new Blob([t],{type:`image/jpeg`}):void 0,i=new Blob([e],{type:`image/jpeg`}),a,o,s=!1;if(typeof createImageBitmap>`u`){let e=await Promise.all([r?_n(r):Promise.resolve(void 0),_n(i)]);o=e[0],a=e[1],s=n===`flipY`}else{let e=await Promise.all([r?createImageBitmap(r,{imageOrientation:n||`flipY`}):Promise.resolve(void 0),createImageBitmap(i,{imageOrientation:n||`flipY`})]);o=e[0],a=e[1]}return{sdrImage:a,gainMapImage:o,needsFlip:s}}createTextures(e,t,n){let r=new M(t||new ImageData(2,2),300,Oe,Oe,k,s,u,x,1,ye);r.flipY=n,r.needsUpdate=!0;let i=new M(e,300,Oe,Oe,k,s,u,x,1,T);return i.flipY=n,i.needsUpdate=!0,{gainMap:r,sdr:i}}updateQuadRenderer(e,t,n,r,i){e.width=t.width,e.height=t.height,e.material.gainMap=n,e.material.sdr=r,e.material.gainMapMin=i.gainMapMin,e.material.gainMapMax=i.gainMapMax,e.material.offsetHdr=i.offsetHdr,e.material.offsetSdr=i.offsetSdr,e.material.gamma=i.gamma,e.material.hdrCapacityMin=i.hdrCapacityMin,e.material.hdrCapacityMax=i.hdrCapacityMax,e.material.maxDisplayBoost=2**i.hdrCapacityMax,e.material.needsUpdate=!0}},yn=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,bn=`
// min half float value
#define HALF_FLOAT_MIN vec3( -65504, -65504, -65504 )
// max half float value
#define HALF_FLOAT_MAX vec3( 65504, 65504, 65504 )

uniform sampler2D sdr;
uniform sampler2D gainMap;
uniform vec3 gamma;
uniform vec3 offsetHdr;
uniform vec3 offsetSdr;
uniform vec3 gainMapMin;
uniform vec3 gainMapMax;
uniform float weightFactor;

varying vec2 vUv;

void main() {
  vec3 rgb = texture2D( sdr, vUv ).rgb;
  vec3 recovery = texture2D( gainMap, vUv ).rgb;
  vec3 logRecovery = pow( recovery, gamma );
  vec3 logBoost = gainMapMin * ( 1.0 - logRecovery ) + gainMapMax * logRecovery;
  vec3 hdrColor = (rgb + offsetSdr) * exp2( logBoost * weightFactor ) - offsetHdr;
  vec3 clampedHdrColor = max( HALF_FLOAT_MIN, min( HALF_FLOAT_MAX, hdrColor ));
  gl_FragColor = vec4( clampedHdrColor , 1.0 );
}
`,xn=class extends g{_maxDisplayBoost;_hdrCapacityMin;_hdrCapacityMax;constructor({gamma:e,offsetHdr:t,offsetSdr:n,gainMapMin:r,gainMapMax:i,maxDisplayBoost:a,hdrCapacityMin:o,hdrCapacityMax:s,sdr:c,gainMap:l}){super({name:`GainMapDecoderMaterial`,vertexShader:yn,fragmentShader:bn,uniforms:{sdr:{value:c},gainMap:{value:l},gamma:{value:new F(1/e[0],1/e[1],1/e[2])},offsetHdr:{value:new F().fromArray(t)},offsetSdr:{value:new F().fromArray(n)},gainMapMin:{value:new F().fromArray(r)},gainMapMax:{value:new F().fromArray(i)},weightFactor:{value:(Math.log2(a)-o)/(s-o)}},blending:0,depthTest:!1,depthWrite:!1}),this._maxDisplayBoost=a,this._hdrCapacityMin=o,this._hdrCapacityMax=s,this.needsUpdate=!0,this.uniformsNeedUpdate=!0}get sdr(){return this.uniforms.sdr.value}set sdr(e){this.uniforms.sdr.value=e}get gainMap(){return this.uniforms.gainMap.value}set gainMap(e){this.uniforms.gainMap.value=e}get offsetHdr(){return this.uniforms.offsetHdr.value.toArray()}set offsetHdr(e){this.uniforms.offsetHdr.value.fromArray(e)}get offsetSdr(){return this.uniforms.offsetSdr.value.toArray()}set offsetSdr(e){this.uniforms.offsetSdr.value.fromArray(e)}get gainMapMin(){return this.uniforms.gainMapMin.value.toArray()}set gainMapMin(e){this.uniforms.gainMapMin.value.fromArray(e)}get gainMapMax(){return this.uniforms.gainMapMax.value.toArray()}set gainMapMax(e){this.uniforms.gainMapMax.value.fromArray(e)}get gamma(){let e=this.uniforms.gamma.value;return[1/e.x,1/e.y,1/e.z]}set gamma(e){let t=this.uniforms.gamma.value;t.x=1/e[0],t.y=1/e[1],t.z=1/e[2]}get hdrCapacityMin(){return this._hdrCapacityMin}set hdrCapacityMin(e){this._hdrCapacityMin=e,this.calculateWeight()}get hdrCapacityMax(){return this._hdrCapacityMax}set hdrCapacityMax(e){this._hdrCapacityMax=e,this.calculateWeight()}get maxDisplayBoost(){return this._maxDisplayBoost}set maxDisplayBoost(e){this._maxDisplayBoost=Math.max(1,Math.min(65504,e)),this.calculateWeight()}calculateWeight(){let e=(Math.log2(this._maxDisplayBoost)-this._hdrCapacityMin)/(this._hdrCapacityMax-this._hdrCapacityMin);this.uniforms.weightFactor.value=Math.max(0,Math.min(1,e))}},Sn=class extends vn{constructor(e,t){super({renderer:e,createMaterial:e=>new xn(e),createQuadRenderer:e=>new un(e)},t)}async render(e,t,n,r){let{sdrImage:i,gainMapImage:a,needsFlip:o}=await this.processImages(n,r,`flipY`),{gainMap:s,sdr:c}=this.createTextures(i,a,o);this.updateQuadRenderer(e,i,s,c,t),e.render()}},Cn=class extends Sn{load([e,t,n],r,i,a){let o=this.prepareQuadRenderer(),s,c,u,d=async()=>{if(s&&c&&u){try{await this.render(o,u,s,c)}catch(r){this.manager.itemError(e),this.manager.itemError(t),this.manager.itemError(n),typeof a==`function`&&a(r),o.disposeOnDemandRenderer();return}typeof r==`function`&&r(o),this.manager.itemEnd(e),this.manager.itemEnd(t),this.manager.itemEnd(n),o.disposeOnDemandRenderer()}},f=!0,p=0,m=0,h=!0,g=0,_=0,v=!0,y=0,b=0,x=()=>{if(typeof i==`function`){let e=p+g+y,t=m+_+b;i(new ProgressEvent(`progress`,{lengthComputable:f&&h&&v,loaded:t,total:e}))}};this.manager.itemStart(e),this.manager.itemStart(t),this.manager.itemStart(n);let S=new l(this._internalLoadingManager);S.setResponseType(`arraybuffer`),S.setRequestHeader(this.requestHeader),S.setPath(this.path),S.setWithCredentials(this.withCredentials),S.load(e,async e=>{if(typeof e==`string`)throw Error(`Invalid sdr buffer`);s=e,await d()},e=>{f=e.lengthComputable,m=e.loaded,p=e.total,x()},t=>{this.manager.itemError(e),typeof a==`function`&&a(t)});let C=new l(this._internalLoadingManager);C.setResponseType(`arraybuffer`),C.setRequestHeader(this.requestHeader),C.setPath(this.path),C.setWithCredentials(this.withCredentials),C.load(t,async e=>{if(typeof e==`string`)throw Error(`Invalid gainmap buffer`);c=e,await d()},e=>{h=e.lengthComputable,_=e.loaded,g=e.total,x()},e=>{this.manager.itemError(t),typeof a==`function`&&a(e)});let w=new l(this._internalLoadingManager);return w.setRequestHeader(this.requestHeader),w.setPath(this.path),w.setWithCredentials(this.withCredentials),w.load(n,async e=>{if(typeof e!=`string`)throw Error(`Invalid metadata string`);u=JSON.parse(e),await d()},e=>{v=e.lengthComputable,b=e.loaded,y=e.total,x()},e=>{this.manager.itemError(n),typeof a==`function`&&a(e)}),o}},wn=class extends Sn{load(e,t,n,r){let i=this.prepareQuadRenderer(),a=new l(this._internalLoadingManager);return a.setResponseType(`arraybuffer`),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(this.withCredentials),this.manager.itemStart(e),a.load(e,async n=>{if(typeof n==`string`)throw Error(`Invalid buffer, received [string], was expecting [ArrayBuffer]`);let a=new Uint8Array(n),o,s,c;try{let e=await gn(a);o=e.sdr,s=e.gainMap,c=e.metadata}catch(t){if(t instanceof fn||t instanceof dn)console.warn(`Failure to reconstruct an HDR image from ${e}: Gain map metadata not found in the file, HDRJPGLoader will render the SDR jpeg`),c={gainMapMin:[0,0,0],gainMapMax:[1,1,1],gamma:[1,1,1],hdrCapacityMin:0,hdrCapacityMax:1,offsetHdr:[0,0,0],offsetSdr:[0,0,0]},o=a;else throw t}try{await this.render(i,c,o.buffer,s?.buffer)}catch(t){this.manager.itemError(e),typeof r==`function`&&r(t),i.disposeOnDemandRenderer();return}typeof t==`function`&&t(i),this.manager.itemEnd(e),i.disposeOnDemandRenderer()},n,t=>{this.manager.itemError(e),typeof r==`function`&&r(t)}),i}},Tn={apartment:`lebombo_1k.hdr`,city:`potsdamer_platz_1k.hdr`,dawn:`kiara_1_dawn_1k.hdr`,forest:`forest_slope_1k.hdr`,lobby:`st_fagans_interior_1k.hdr`,night:`dikhololo_night_1k.hdr`,park:`rooitou_park_1k.hdr`,studio:`studio_small_03_1k.hdr`,sunset:`venice_sunset_1k.hdr`,warehouse:`empty_warehouse_01_1k.hdr`},En=`https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/`,Dn=e=>Array.isArray(e),On=[`/px.png`,`/nx.png`,`/py.png`,`/ny.png`,`/pz.png`,`/nz.png`];function kn({files:e=On,path:t=``,preset:n=void 0,colorSpace:r=void 0,extensions:i}={}){n&&(Mn(n),e=Tn[n],t=En);let a=Dn(e),{extension:o,isCubemap:s}=Nn(e),c=Pn(o);if(!c)throw Error(`useEnvironment: Unrecognized file extension: `+e);let l=I(e=>e.gl);(0,U.useLayoutEffect)(()=>{if(o!==`webp`&&o!==`jpg`&&o!==`jpeg`)return;function t(){xe.clear(c,a?[e]:e)}l.domElement.addEventListener(`webglcontextlost`,t,{once:!0})},[e,l.domElement]);let u=xe(c,a?[e]:e,e=>{(o===`webp`||o===`jpg`||o===`jpeg`)&&e.setRenderer(l),e.setPath==null||e.setPath(t),i&&i(e)}),d=a?u[0]:u;return(o===`jpg`||o===`jpeg`||o===`webp`)&&(d=d.renderTarget?.texture),d.mapping=s?301:303,d.colorSpace=r??(s?`srgb`:`srgb-linear`),d}var An={files:On,path:``,preset:void 0,extensions:void 0};kn.preload=e=>{let t={...An,...e},{files:n,path:r=``}=t,{preset:i,extensions:a}=t;i&&(Mn(i),n=Tn[i],r=En);let{extension:o}=Nn(n);if(o===`webp`||o===`jpg`||o===`jpeg`)throw Error(`useEnvironment: Preloading gainmaps is not supported`);let s=Pn(o);if(!s)throw Error(`useEnvironment: Unrecognized file extension: `+n);xe.preload(s,Dn(n)?[n]:n,e=>{e.setPath==null||e.setPath(r),a&&a(e)})};var jn={files:On,preset:void 0};kn.clear=e=>{let t={...jn,...e},{files:n}=t,{preset:r}=t;r&&(Mn(r),n=Tn[r]);let{extension:i}=Nn(n),a=Pn(i);if(!a)throw Error(`useEnvironment: Unrecognized file extension: `+n);xe.clear(a,Dn(n)?[n]:n)};function Mn(e){if(!(e in Tn))throw Error(`Preset must be one of: `+Object.keys(Tn).join(`, `))}function Nn(e){var t;let n=Dn(e)&&e.length===6,r=Dn(e)&&e.length===3&&e.some(e=>e.endsWith(`json`)),i=Dn(e)?e[0]:e;return{extension:n?`cube`:r?`webp`:i.startsWith(`data:application/exr`)?`exr`:i.startsWith(`data:application/hdr`)?`hdr`:i.startsWith(`data:image/jpeg`)?`jpg`:(t=i.split(`.`).pop())==null||(t=t.split(`?`))==null||(t=t.shift())==null?void 0:t.toLowerCase(),isCubemap:n,isGainmap:r}}function Pn(e){return e===`cube`?f:e===`hdr`?kt:e===`exr`?jt:e===`jpg`||e===`jpeg`?wn:e===`webp`?Cn:null}var Fn=e=>e.current&&e.current.isScene,In=e=>Fn(e)?e.current:e;function Ln(e,t,n,r,i={}){var a,o;i={backgroundBlurriness:0,backgroundIntensity:1,backgroundRotation:[0,0,0],environmentIntensity:1,environmentRotation:[0,0,0],...i};let s=In(t||n),c=s.background,l=s.environment,u={backgroundBlurriness:s.backgroundBlurriness,backgroundIntensity:s.backgroundIntensity,backgroundRotation:((a=s.backgroundRotation)==null||a.clone==null?void 0:a.clone())??[0,0,0],environmentIntensity:s.environmentIntensity,environmentRotation:((o=s.environmentRotation)==null||o.clone==null?void 0:o.clone())??[0,0,0]};return e!==`only`&&(s.environment=r),e&&(s.background=r),be(s,i),()=>{e!==`only`&&(s.environment=l),e&&(s.background=c),be(s,u)}}function Rn({scene:e,background:t=!1,map:n,...r}){let i=I(e=>e.scene);return U.useLayoutEffect(()=>{if(n)return Ln(t,e,i,n,r)}),null}function zn({background:e=!1,scene:t,blur:n,backgroundBlurriness:r,backgroundIntensity:i,backgroundRotation:a,environmentIntensity:o,environmentRotation:s,...c}){let l=kn(c),u=I(e=>e.scene);return U.useLayoutEffect(()=>Ln(e,t,u,l,{backgroundBlurriness:n??r,backgroundIntensity:i,backgroundRotation:a,environmentIntensity:o,environmentRotation:s})),U.useEffect(()=>()=>{l.dispose()},[l]),null}function Bn({children:e,near:t=.1,far:n=1e3,resolution:r=256,frames:i=1,map:a,background:o=!1,blur:s,backgroundBlurriness:c,backgroundIntensity:l,backgroundRotation:u,environmentIntensity:d,environmentRotation:f,scene:p,files:m,path:h,preset:g=void 0,extensions:_}){let v=I(e=>e.gl),y=I(e=>e.scene),b=U.useRef(null),[x]=U.useState(()=>new O),S=U.useMemo(()=>{let e=new le(r);return e.texture.type=D,e},[r]);U.useEffect(()=>()=>{S.dispose()},[S]),U.useLayoutEffect(()=>{if(i===1){let e=v.autoClear;v.autoClear=!0,b.current.update(v,x),v.autoClear=e}return Ln(o,p,y,S.texture,{backgroundBlurriness:s??c,backgroundIntensity:l,backgroundRotation:u,environmentIntensity:d,environmentRotation:f})},[e,x,S.texture,p,y,o,i,v]);let C=1;return B(()=>{if(i===1/0||C<i){let e=v.autoClear;v.autoClear=!0,b.current.update(v,x),v.autoClear=e,C++}}),U.createElement(U.Fragment,null,me(U.createElement(U.Fragment,null,e,U.createElement(`cubeCamera`,{ref:b,args:[t,n,S]}),m||g?U.createElement(zn,{background:!0,files:m,preset:g,path:h,extensions:_}):a?U.createElement(Rn,{background:!0,map:a,extensions:_}):null),x))}function Vn(e){let t=kn(e),n=e.map||t;U.useMemo(()=>ie({GroundProjectedEnvImpl:Et}),[]),U.useEffect(()=>()=>{t.dispose()},[t]);let r=U.useMemo(()=>[n],[n]),i=e.ground?.height,a=e.ground?.radius,o=e.ground?.scale??1e3;return U.createElement(U.Fragment,null,U.createElement(Rn,R({},e,{map:n})),U.createElement(`groundProjectedEnvImpl`,{args:r,scale:o,height:i,radius:a}))}function Hn(e){return e.ground?U.createElement(Vn,e):e.map?U.createElement(Rn,e):e.children?U.createElement(Bn,e):U.createElement(zn,e)}var Un=U.forwardRef(({scale:e=10,frames:t=1/0,opacity:n=1,width:r=1,height:i=1,blur:a=1,near:o=0,far:s=10,resolution:c=512,smooth:l=!0,color:u=`#000000`,depthWrite:d=!1,renderOrder:f,...m},h)=>{let _=U.useRef(null),v=I(e=>e.scene),y=I(e=>e.gl),b=U.useRef(null);r*=Array.isArray(e)?e[0]:e||1,i*=Array.isArray(e)?e[1]:e||1;let[x,S,C,w,T,E,D]=U.useMemo(()=>{let e=new A(c,c),t=new A(c,c);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let n=new p(r,i).rotateX(Math.PI/2),a=new z(n),o=new ue;o.depthTest=o.depthWrite=!1,o.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new j(u)}},e.fragmentShader=e.fragmentShader.replace(`void main() {`,`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace(`vec4( vec3( 1.0 - fragCoordZ ), opacity );`,`vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );`)};let s=new g(Dt),l=new g(Ot);return l.depthTest=s.depthTest=!1,[e,n,o,a,s,l,t]},[c,r,i,e,u]),O=e=>{w.visible=!0,w.material=T,T.uniforms.tDiffuse.value=x.texture,T.uniforms.h.value=e*1/256,y.setRenderTarget(D),y.render(w,b.current),w.material=E,E.uniforms.tDiffuse.value=D.texture,E.uniforms.v.value=e*1/256,y.setRenderTarget(x),y.render(w,b.current),w.visible=!1},k=0,ee,te;return B(()=>{b.current&&(t===1/0||k<t)&&(k++,ee=v.background,te=v.overrideMaterial,_.current.visible=!1,v.background=null,v.overrideMaterial=C,y.setRenderTarget(x),y.render(v,b.current),O(a),l&&O(a*.4),y.setRenderTarget(null),_.current.visible=!0,v.overrideMaterial=te,v.background=ee)}),U.useImperativeHandle(h,()=>_.current,[]),U.createElement(`group`,R({"rotation-x":Math.PI/2},m,{ref:_}),U.createElement(`mesh`,{renderOrder:f,geometry:S,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},U.createElement(`meshBasicMaterial`,{transparent:!0,map:x.texture,opacity:n,depthWrite:d})),U.createElement(`orthographicCamera`,{ref:b,args:[-r/2,r/2,i/2,-i/2,o,s]}))}),Wn=U.forwardRef(({light:e,args:t,map:n,toneMapped:r=!1,color:i=`white`,form:a=`rect`,intensity:o=1,scale:s=1,target:c=[0,0,0],children:l,...u},d)=>{let f=U.useRef(null);return U.useImperativeHandle(d,()=>f.current,[]),U.useLayoutEffect(()=>{!l&&!u.material&&(be(f.current.material,{color:i}),f.current.material.color.multiplyScalar(o))},[i,o,l,u.material]),U.useLayoutEffect(()=>{u.rotation||f.current.quaternion.identity(),c&&!u.rotation&&(typeof c==`boolean`?f.current.lookAt(0,0,0):f.current.lookAt(Array.isArray(c)?new F(...c):c))},[c,u.rotation]),s=Array.isArray(s)&&s.length===2?[s[0],s[1],1]:s,U.createElement(`mesh`,R({ref:f,scale:s},u),a===`circle`?U.createElement(`ringGeometry`,{args:t||[0,.5,64]}):a===`ring`?U.createElement(`ringGeometry`,{args:t||[.25,.5,64]}):a===`rect`||a===`plane`?U.createElement(`planeGeometry`,{args:t||[1,1]}):a===`box`?U.createElement(`boxGeometry`,{args:t||[1,1,1]}):U.createElement(a,{args:t}),l||U.createElement(`meshBasicMaterial`,{toneMapped:r,map:n,side:2}),e&&U.createElement(`pointLight`,R({castShadow:!0},e)))}),Gn={width:45,height:20,thickness:1.6,canRadius:8,canLength:12,tx:[-13,1.5],rx:[13,1.5]},Kn=Gn.thickness/2,qn=-Kn,Jn=-9,Yn=[-3.81,-1.27,1.27,3.81],Xn=[[-20.2,7.8],[20.2,7.8],[-20.2,-7.8],[20.2,-7.8]];function Zn({x:e,y:t,mesh:n}){let{canRadius:r,canLength:i}=Gn;return(0,K.jsxs)(`group`,{position:[e,t,Kn],children:[(0,K.jsxs)(`mesh`,{"rotation-x":Math.PI/2,position:[0,0,i/2],children:[(0,K.jsx)(`cylinderGeometry`,{args:[r,r,i,72,1,!0]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.aluminium,color:`#b8bcc1`,roughness:.32,side:2})]}),(0,K.jsxs)(`mesh`,{position:[0,0,i-.35],children:[(0,K.jsx)(`torusGeometry`,{args:[r-.35,.38,14,72]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.aluminium,color:`#c4c8cc`,roughness:.28})]}),(0,K.jsxs)(`mesh`,{position:[0,0,i-.9],children:[(0,K.jsx)(`circleGeometry`,{args:[r-.55,64]}),(0,K.jsx)(`meshStandardMaterial`,{map:n,metalness:.55,roughness:.5})]}),(0,K.jsxs)(`mesh`,{"rotation-x":Math.PI/2,position:[0,0,.5],children:[(0,K.jsx)(`cylinderGeometry`,{args:[r+.25,r+.25,1,72]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.aluminium,color:`#a9adb2`,roughness:.4})]})]})}function Qn({x:e,y:t,w:n,h:r}){let i=Math.round(n/1.27);return(0,K.jsxs)(`group`,{position:[e,t,qn],children:[(0,K.jsxs)(`mesh`,{position:[0,0,-.75],children:[(0,K.jsx)(`boxGeometry`,{args:[n,r,1.5]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.epoxy})]}),Array.from({length:i},(e,t)=>-n/2+.64+t*1.27).flatMap(e=>[-1,1].map(t=>(0,K.jsxs)(`mesh`,{position:[e,t*(r/2+.45),-.3],children:[(0,K.jsx)(`boxGeometry`,{args:[.42,.9,.25]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel})]},`${e}${t}`)))]})}function $n(){let e=Re(13),t=(0,U.useMemo)(()=>W(Fe(Gn.width,Gn.height,.8,[...Xn.map(([e,t])=>[e,t,.95]),...Yn.map(e=>[e,Jn,.5])]),Gn.thickness,{crease:.5,curveSegments:16}),[]);return(0,K.jsxs)(`group`,{children:[(0,K.jsx)(`mesh`,{geometry:t,children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.pcbBlue})}),(0,K.jsx)(Zn,{x:Gn.tx[0],y:Gn.tx[1],mesh:e}),(0,K.jsx)(Zn,{x:Gn.rx[0],y:Gn.rx[1],mesh:e}),(0,K.jsx)(an,{args:[10.5,4,3.5],radius:1.6,smoothness:6,position:[0,6.6,Kn+1.75],children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel,roughness:.22})}),Xn.map(([e,t])=>(0,K.jsxs)(`group`,{children:[(0,K.jsx)(He,{position:[e,t,Kn+.01],r:.95,ring:.7,rotation:[0,0,0]}),(0,K.jsx)(He,{position:[e,t,qn-.01],r:.95,ring:.7,rotation:[Math.PI,0,0]})]},`${e}${t}`)),(0,K.jsx)(Le,{text:`T`,position:[-3.4,-2.6,Kn+.02],width:2.6,height:2.4}),(0,K.jsx)(Le,{text:`R`,position:[3.4,-2.6,Kn+.02],width:2.6,height:2.4}),(0,K.jsx)(Le,{text:`Vcc  Trig  Echo  Gnd`,position:[0,-6.9,Kn+.02],width:11,height:1.5}),Yn.map(e=>(0,K.jsxs)(`group`,{children:[(0,K.jsx)(He,{position:[e,Jn,Kn+.01],r:.5,ring:.45,rotation:[0,0,0]}),(0,K.jsxs)(`mesh`,{position:[e,Jn,Kn+.3],"rotation-x":Math.PI/2,children:[(0,K.jsx)(`coneGeometry`,{args:[.75,.6,16]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel,roughness:.2})]}),(0,K.jsx)(Be,{position:[e,Jn,qn-1.25],length:2.5,rotation:[Math.PI/2,0,0]}),(0,K.jsx)(Be,{position:[e,-12.6,qn-2.05],length:7.6})]},e)),(0,K.jsxs)(`mesh`,{position:[0,-8.8,qn-2.05],children:[(0,K.jsx)(`boxGeometry`,{args:[10.16,2.5,2.5]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticBlack})]}),(0,K.jsx)(Qn,{x:-11,y:-1,w:5,h:4}),(0,K.jsx)(Qn,{x:0,y:1.2,w:8.7,h:4}),(0,K.jsx)(Qn,{x:11,y:-1,w:5,h:4}),[[-15.5,5.5],[-6,-6],[6,-6],[15.5,5.5],[-4.5,6.5],[4.5,6.5]].map(([e,t],n)=>(0,K.jsxs)(`mesh`,{position:[e,t,qn-.25],children:[(0,K.jsx)(`boxGeometry`,{args:[1.6,.8,.5]}),n%2?(0,K.jsx)(`meshPhysicalMaterial`,{...L.ceramic}):(0,K.jsx)(`meshPhysicalMaterial`,{...L.epoxy})]},n))]})}var er=-16.4,tr={width:25,depth:20,thickness:1.6},$=tr.thickness/2,nr=8,rr=Array.from({length:6},(e,t)=>-6.35+t*2.54),ir=[[-9.5,-7],[9.5,-7]];function ar(e,t,n){let r=t/100;e.strokeStyle=e.fillStyle=`#f1f1ec`,e.lineWidth=3.2*r,e.lineCap=`square`;let i=26*r,a=n-26*r,o=(t,n,i,a)=>{e.beginPath(),e.moveTo(t,n),e.lineTo(i,a),e.stroke();let o=Math.atan2(a-n,i-t);e.beginPath(),e.moveTo(i+Math.cos(o)*6*r,a+Math.sin(o)*6*r),e.lineTo(i+Math.cos(o+2.4)*9*r,a+Math.sin(o+2.4)*9*r),e.lineTo(i+Math.cos(o-2.4)*9*r,a+Math.sin(o-2.4)*9*r),e.fill()};o(i,a,i+46*r,a),o(i,a,i,a-46*r),e.beginPath(),e.arc(i,a,7*r,0,Math.PI*2),e.stroke(),e.beginPath(),e.arc(i,a,2.2*r,0,Math.PI*2),e.fill(),e.font=`700 ${17*r}px Arial, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(`X`,i+66*r,a),e.fillText(`Y`,i,a-64*r),e.fillText(`Z`,i-15*r,a+15*r)}function or(){let e=(0,U.useMemo)(()=>W(Fe(tr.width,tr.depth,1.2,[...ir.map(([e,t])=>[e,-t,1.5]),...rr.map(e=>[e,-8,.5])]),tr.thickness,{crease:.5,curveSegments:16}),[]);return(0,K.jsxs)(`group`,{children:[(0,K.jsx)(`mesh`,{geometry:e,"rotation-x":-Math.PI/2,children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.pcbPurple})}),(0,K.jsxs)(`mesh`,{position:[0,$+.45,0],children:[(0,K.jsx)(`boxGeometry`,{args:[4,.9,4]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.epoxy})]}),(0,K.jsxs)(`mesh`,{position:[-1.35,$+.91,-1.35],"rotation-x":-Math.PI/2,children:[(0,K.jsx)(`circleGeometry`,{args:[.28,20]}),(0,K.jsx)(`meshStandardMaterial`,{color:`#3a3c40`,roughness:.4})]}),[-1,1].flatMap(e=>[-1.25,-.75,-.25,.25,.75,1.25].flatMap(t=>[(0,K.jsxs)(`mesh`,{position:[e*2.15,$+.08,t],children:[(0,K.jsx)(`boxGeometry`,{args:[.35,.16,.22]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel})]},`a${e}${t}`),(0,K.jsxs)(`mesh`,{position:[t,$+.08,e*2.15],children:[(0,K.jsx)(`boxGeometry`,{args:[.22,.16,.35]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel})]},`b${e}${t}`)])),(0,K.jsxs)(`group`,{position:[-7.5,$,1.5],children:[(0,K.jsxs)(`mesh`,{position:[0,.55,0],children:[(0,K.jsx)(`boxGeometry`,{args:[2.9,1.1,1.6]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.epoxy})]}),[-.95,0,.95].map(e=>(0,K.jsxs)(`mesh`,{position:[e,.15,-1.05],children:[(0,K.jsx)(`boxGeometry`,{args:[.4,.3,.6]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel})]},e)),[-.95,.95].map(e=>(0,K.jsxs)(`mesh`,{position:[e,.15,1.05],children:[(0,K.jsx)(`boxGeometry`,{args:[.4,.3,.6]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel})]},e))]}),[[3.4,-2.4,`c`],[3.4,2.4,`c`],[-3.4,2.4,`c`],[-4.8,-3.4,`c`],[-7.5,-2.2,`c`],[-7.5,4.6,`c`],[-1.2,-4.6,`r`],[1.2,-4.6,`r`],[6.2,-1.6,`r`]].map(([e,t,n],r)=>(0,K.jsxs)(`group`,{position:[e,$,t],children:[(0,K.jsxs)(`mesh`,{position:[0,.25,0],children:[(0,K.jsx)(`boxGeometry`,{args:[1,.5,.5]}),n===`c`?(0,K.jsx)(`meshPhysicalMaterial`,{...L.ceramic}):(0,K.jsx)(`meshPhysicalMaterial`,{...L.epoxy})]}),[-.42,.42].map(e=>(0,K.jsxs)(`mesh`,{position:[e,.25,0],children:[(0,K.jsx)(`boxGeometry`,{args:[.18,.52,.52]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel})]},e))]},r)),(0,K.jsxs)(`mesh`,{position:[4.6,$+.3,-6.8],children:[(0,K.jsx)(`boxGeometry`,{args:[1.6,.6,.8]}),(0,K.jsx)(`meshPhysicalMaterial`,{color:`#f4f1e6`,roughness:.2,transmission:.4,thickness:.5})]}),ir.map(([e,t])=>(0,K.jsxs)(`group`,{children:[(0,K.jsx)(He,{position:[e,$+.01,t],r:1.5,ring:.9}),(0,K.jsx)(He,{position:[e,-$-.01,t],r:1.5,ring:.9,rotation:[Math.PI/2,0,0]})]},e)),rr.map(e=>(0,K.jsxs)(`group`,{children:[(0,K.jsx)(He,{position:[e,$+.01,nr],r:.5,ring:.45}),(0,K.jsxs)(`mesh`,{position:[e,$,nr],scale:[1,.55,1],children:[(0,K.jsx)(`sphereGeometry`,{args:[.6,20,10,0,Math.PI*2,0,Math.PI/2]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel,roughness:.38})]}),(0,K.jsx)(Be,{position:[e,-4.2,nr],length:9})]},e)),(0,K.jsxs)(`mesh`,{position:[0,-$-1.25,nr],children:[(0,K.jsx)(`boxGeometry`,{args:[15.24,2.5,2.5]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticBlack})]}),(0,K.jsx)(Ve,{draw:ar,position:[8.4,$+.02,2.2],rotation:[-Math.PI/2,0,0],width:8,height:8})]})}var sr=-8.7,cr={width:92,height:76,depth:24};function lr(){let{width:e,height:t,depth:n}=cr,r=(0,U.useMemo)(()=>W(Ne(e-4,t-4,8),n,{bevel:2}),[e,t,n]),i=(0,U.useMemo)(()=>W(Ne(e-10,t-10,6),3,{bevel:1.2}),[e,t]);return(0,K.jsxs)(`group`,{children:[(0,K.jsx)(`mesh`,{geometry:r,children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticGrey})}),(0,K.jsx)(`mesh`,{geometry:i,position:[0,0,n/2+.6],children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticLight})}),(0,K.jsxs)(`group`,{children:[(0,K.jsxs)(`mesh`,{position:[0,-t/2-3,-2],children:[(0,K.jsx)(`boxGeometry`,{args:[60,4,30]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.aluminium})]}),(0,K.jsxs)(`mesh`,{position:[0,-t/2+6,-n/2-3],children:[(0,K.jsx)(`boxGeometry`,{args:[60,22,4]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.aluminium})]}),[-20,20].map(e=>(0,K.jsxs)(`mesh`,{position:[e,-t/2+6,-n/2-5.4],"rotation-x":Math.PI/2,children:[(0,K.jsx)(`cylinderGeometry`,{args:[3.2,3.2,1.2,6]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel})]},e))]}),(0,K.jsxs)(`group`,{position:[36,-14,-n/2],children:[(0,K.jsxs)(`mesh`,{"rotation-x":Math.PI/2,position:[0,0,-6],children:[(0,K.jsx)(`cylinderGeometry`,{args:[6.5,6.5,12,32]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticBlack})]}),(0,K.jsxs)(`mesh`,{"rotation-x":Math.PI/2,position:[0,0,-9],children:[(0,K.jsx)(`cylinderGeometry`,{args:[7.1,7.1,2,32]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.plasticBlack})]})]}),(0,K.jsxs)(`mesh`,{position:[0,0,-3],children:[(0,K.jsx)(`boxGeometry`,{args:[e+10,t+10,n+30]}),(0,K.jsx)(`meshBasicMaterial`,{transparent:!0,opacity:0,depthWrite:!1}),(0,K.jsx)(tn,{color:`#ff6a13`,lineWidth:1.5,dashed:!0,dashSize:4,gapSize:3})]})]})}var ur={width:175.25,height:30.25,depth:31.8,baseline:120};function dr({x:e,z:t}){let n=Math.asin(6.2/16),r=16*(1-Math.cos(n));return(0,K.jsxs)(`group`,{position:[e,0,t],children:[(0,K.jsxs)(`mesh`,{"rotation-x":Math.PI/2,position:[0,0,.25],children:[(0,K.jsx)(`cylinderGeometry`,{args:[9.625,9.625,.5,72]}),(0,K.jsx)(`meshPhysicalMaterial`,{color:`#3f4247`,metalness:.9,roughness:.32})]}),(0,K.jsxs)(`mesh`,{"rotation-x":Math.PI/2,position:[0,0,.55],children:[(0,K.jsx)(`cylinderGeometry`,{args:[8.1,8.1,.5,72]}),(0,K.jsx)(`meshStandardMaterial`,{color:`#0a0a0b`,roughness:.7})]}),(0,K.jsxs)(`mesh`,{position:[0,0,.82],children:[(0,K.jsx)(`torusGeometry`,{args:[6.75,.4,16,72]}),(0,K.jsx)(`meshPhysicalMaterial`,{color:`#5b5f66`,metalness:1,roughness:.25})]}),(0,K.jsxs)(`mesh`,{"rotation-x":Math.PI/2,position:[0,0,.8-(16-r)],children:[(0,K.jsx)(`sphereGeometry`,{args:[16,64,16,0,Math.PI*2,0,n]}),(0,K.jsx)(`meshPhysicalMaterial`,{...L.lens})]})]})}function fr(){let{width:e,height:t,depth:n}=ur,r=(0,U.useMemo)(()=>W(Pe(e-3.6,t-3.6),n,{bevel:1.8,taper:170.29/175.25}),[e,t,n]),i=(0,U.useMemo)(()=>W(Pe(169.5,24.39),1.2,{bevel:.45}),[]),a=(0,U.useMemo)(()=>W(Ne(28.2-1.6,9.4,2.4),6.6,{bevel:.8}),[]),o=(0,U.useMemo)(()=>W(Ne(8.9,3.2,1.55),.3),[]),s=(0,U.useMemo)(()=>W(G(9.9,4.2,2.05,8.9,3.2,1.55),.5),[]),c=n/2,l=-n/2,u=l-2.9,d=-4.6;return(0,K.jsxs)(`group`,{children:[(0,K.jsx)(`mesh`,{geometry:r,children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.anodisedDark})}),(0,K.jsx)(`mesh`,{geometry:i,position:[0,0,c+.1],children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.blackGlass})}),(0,K.jsx)(dr,{x:-ur.baseline/2,z:c+.7}),(0,K.jsx)(dr,{x:ur.baseline/2,z:c+.7}),(0,K.jsx)(`mesh`,{geometry:a,position:[0,d,u],children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.anodisedDark})}),(0,K.jsxs)(`group`,{position:[0,d,l-6.2],"rotation-y":Math.PI,children:[(0,K.jsx)(`mesh`,{geometry:s,position:[0,0,.2],children:(0,K.jsx)(`meshPhysicalMaterial`,{...L.steel,roughness:.35})}),(0,K.jsx)(`mesh`,{geometry:o,position:[0,0,.05],children:(0,K.jsx)(`meshStandardMaterial`,{color:`#050506`,roughness:.95})}),(0,K.jsxs)(`mesh`,{position:[0,0,.25],children:[(0,K.jsx)(`boxGeometry`,{args:[6.6,.7,.2]}),(0,K.jsx)(`meshStandardMaterial`,{color:`#1a1b1d`,roughness:.6})]}),(0,K.jsx)(ze,{position:[-9.25,0,.08],r:1.4}),(0,K.jsx)(ze,{position:[9.25,0,.08],r:1.4})]}),[[-76.7,7],[76.7,7],[-76.7,-7],[76.7,-7]].map(([e,t])=>(0,K.jsx)(ze,{position:[e*.973,t,l-.05],r:1.56,ring:.5},`${e}${t}`)),(0,K.jsx)(ze,{position:[0,-t/2-.05,-2],rotation:[Math.PI/2,0,0],r:3.06,ring:.8}),(0,K.jsx)(ze,{position:[-18,-t/2-.05,-2],rotation:[Math.PI/2,0,0],r:1.76,ring:.4}),(0,K.jsx)(ze,{position:[18,-t/2-.05,-2],rotation:[Math.PI/2,0,0],r:1.76,ring:.4})]})}var pr=new Map,mr=new Set;function hr(){for(let e of mr)e()}function gr(e,t,n=!0){pr.set(e,t),hr(),n&&i({type:`snapshot`,id:e,url:t})}function _r(e){return pr.has(e)}e(e=>{if(e.type===`snapshot`&&gr(e.id,e.url,!1),e.type===`hello`)for(let[e,t]of pr)i({type:`snapshot`,id:e,url:t})});function vr(e){return(0,U.useSyncExternalStore)(e=>(mr.add(e),()=>mr.delete(e)),()=>pr.get(e))}function yr({tone:e}){let t=e===`dark`;return(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(`ambientLight`,{intensity:t?.12:.28}),(0,K.jsx)(`directionalLight`,{position:[3,6,4],intensity:t?1.2:1.5}),(0,K.jsx)(`directionalLight`,{position:[-5,2.5,-4],intensity:t?.9:.5,color:`#d5dde8`}),(0,K.jsxs)(Hn,{resolution:256,frames:1,environmentIntensity:t?.75:1,children:[(0,K.jsx)(`color`,{attach:`background`,args:[t?`#1c1d20`:`#6b6a68`]}),(0,K.jsx)(Wn,{form:`rect`,intensity:2.6,position:[0,6,1],"rotation-x":Math.PI/2,scale:[10,5,1]}),(0,K.jsx)(Wn,{form:`rect`,intensity:1.8,position:[-6,2,4],"rotation-y":Math.PI/3,scale:[4,3,1]}),(0,K.jsx)(Wn,{form:`rect`,intensity:1.2,position:[6,1.5,-3],"rotation-y":-Math.PI/1.6,scale:[3,4,1],color:`#e6edf7`}),(0,K.jsx)(Wn,{form:`rect`,intensity:1.4,position:[0,2.2,7],scale:[12,.6,1]}),(0,K.jsx)(Wn,{form:`rect`,intensity:.5,position:[0,-4,0],"rotation-x":-Math.PI/2,scale:[10,10,1]})]})]})}var br=(0,U.createContext)(null);function xr(){let e=(0,U.useContext)(br);if(!e)throw Error(`useStageApi must be used inside ModelStage`);return e}var Sr=3500,Cr=900,wr=e=>1-(1-e)**3;function Tr({camera:e,autoRotateSpeed:t,autoRotate:n,enableZoom:r,children:i}){let o=(0,U.useRef)(null),{camera:s}=I(),c=(0,U.useRef)({position:new F(...e.position),target:new F(...e.target)}),l=(0,U.useRef)(new Set),u=(0,U.useRef)(!0),d=(0,U.useRef)(0),f=(0,U.useRef)(null),p=(0,U.useCallback)(()=>{let e=o.current;e&&(e.autoRotate=n&&u.current&&l.current.size===0&&!f.current,e.autoRotateSpeed=t)},[n,t]),m=(0,U.useCallback)((e,t)=>{let n=o.current;if(!n)return;let r=new re().setFromVector3(s.position.clone().sub(n.target)),i=new re().setFromVector3(e.clone().sub(t)),a=i.theta-r.theta;a=((a+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI,i.theta=r.theta+a,f.current={start:performance.now(),fromTarget:n.target.clone(),toTarget:t.clone(),from:r,to:i},p()},[s,p]),h=(0,U.useMemo)(()=>({setHome:(e,t,n=!0)=>{c.current={position:new F(...e),target:new F(...t)},n&&m(c.current.position,c.current.target)},restoreHome:(t=!0)=>{c.current={position:new F(...e.position),target:new F(...e.target)},t&&m(c.current.position,c.current.target)},reset:()=>m(c.current.position,c.current.target),focus:(e,t)=>{let{position:n,target:r}=c.current,i=n.distanceTo(r),a=n.clone().sub(r).normalize(),o=t.clone().multiplyScalar(.8).add(a.multiplyScalar(.4)).add(new F(0,.22,0)).normalize(),s=r.clone().lerp(e,.3);m(s.clone().add(o.multiplyScalar(i)),s)},hold:(e,t)=>{t?l.current.add(e):l.current.delete(e),p()}}),[s,m,e,p]);return(0,U.useEffect)(()=>{let e=()=>h.reset();return window.addEventListener(a,e),()=>window.removeEventListener(a,e)},[h]),(0,U.useEffect)(()=>{let e=o.current;if(!e)return;let t=()=>{u.current=!1,f.current=null,window.clearTimeout(d.current),p()},n=()=>{window.clearTimeout(d.current),d.current=window.setTimeout(()=>{u.current=!0,p()},Sr)};return e.addEventListener(`start`,t),e.addEventListener(`end`,n),p(),()=>{e.removeEventListener(`start`,t),e.removeEventListener(`end`,n),window.clearTimeout(d.current)}},[p]),B(()=>{let e=f.current,t=o.current;if(!e||!t)return;let n=Math.min(1,(performance.now()-e.start)/Cr),r=wr(n);t.target.lerpVectors(e.fromTarget,e.toTarget,r);let i=new re(e.from.radius+(e.to.radius-e.from.radius)*r,e.from.phi+(e.to.phi-e.from.phi)*r,e.from.theta+(e.to.theta-e.from.theta)*r);s.position.setFromSpherical(i).add(t.target),s.lookAt(t.target),n>=1&&(f.current=null,p())},-2),(0,K.jsxs)(br.Provider,{value:h,children:[(0,K.jsx)(Ce,{ref:o,makeDefault:!0,target:e.target,enablePan:!1,enableZoom:r,enableDamping:!0,dampingFactor:.08,rotateSpeed:.7,zoomSpeed:.6,minDistance:e.minDistance,maxDistance:e.maxDistance,minPolarAngle:.05,maxPolarAngle:Math.PI-.05}),i]})}function Er({cx:e}){let{camera:t,size:n}=I();return(0,U.useLayoutEffect)(()=>{let r=t;e===.5?r.clearViewOffset():r.setViewOffset(n.width,n.height,-(e-.5)*n.width,0,n.width,n.height),r.updateProjectionMatrix()},[t,n.width,n.height,e]),null}function Dr({id:e,delay:t}){let n=(0,U.useRef)(_r(e)),r=(0,U.useRef)(0);return B(({gl:i,scene:a,camera:o},s)=>{if(!n.current&&(r.current+=s,!(r.current<t))){n.current=!0;try{i.render(a,o);let t=i.domElement,n=Math.round(720*t.height/t.width),r=document.createElement(`canvas`);r.width=720,r.height=n,r.getContext(`2d`)?.drawImage(t,0,0,720,n),gr(e,r.toDataURL(`image/webp`,.85))}catch(e){console.warn(`[deck] snapshot failed`,e)}}}),null}function Or({camera:e,autoRotateSpeed:n=.55,autoRotate:r=!0,enableZoom:i=!0,lighting:a=`light`,shadow:o,snapshotId:s,snapshotDelay:c=1.4,viewCenterX:l=.5,style:u,className:d,children:f}){let p=t(),m=Math.min(2,Math.max(.75,window.devicePixelRatio*p));return(0,K.jsx)(`div`,{className:`model-stage ${d??``}`,style:u,children:(0,K.jsxs)(ve,{dpr:m,resize:{offsetSize:!0},gl:{antialias:!0,alpha:!0,powerPreference:`high-performance`},camera:{position:e.position,fov:e.fov,near:.02,far:400},children:[(0,K.jsx)(Er,{cx:l}),(0,K.jsx)(yr,{tone:a}),(0,K.jsx)(Tr,{camera:e,autoRotate:r,autoRotateSpeed:n,enableZoom:i,children:f}),o&&(0,K.jsx)(Un,{position:[0,o.y,0],opacity:o.opacity??.42,scale:o.scale??6,blur:o.blur??2.2,far:o.far??2,resolution:512,frames:o.live?1/0:90,color:`#000000`}),s&&(0,K.jsx)(Dr,{id:s,delay:c})]})})}function kr({id:e,style:t}){let n=vr(e);return(0,K.jsx)(`div`,{className:`model-stage`,style:t,children:n?(0,K.jsx)(`img`,{className:`snapshot-img`,src:n,alt:``}):(0,K.jsx)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 100 100`,preserveAspectRatio:`xMidYMid meet`,"aria-hidden":!0,children:(0,K.jsxs)(`g`,{fill:`none`,stroke:`var(--line)`,strokeWidth:`0.6`,children:[(0,K.jsx)(`path`,{d:`M50 28 L72 40 L72 62 L50 74 L28 62 L28 40 Z`}),(0,K.jsx)(`path`,{d:`M28 40 L50 52 L72 40 M50 52 L50 74`})]})})})}export{qe as _,fr as a,sr as c,er as d,$n as f,Je as g,Xe as h,ur as i,or as l,en as m,Or as n,cr as o,an as p,xr as r,lr as s,kr as t,Gn as u};