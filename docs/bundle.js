!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.myLib=t():e.myLib=t()}(this,(()=>(()=>{var e={739:(e,t)=>{t.G=(e,t=.25)=>{let r={w:0,h:0,img:null},o=e,a=e.width,l=e.height,n=1/t,d=Math.ceil(t*a),i=Math.ceil(t*l),f=document.createElement("canvas").getContext("2d").createImageData(d,i);for(let e=0;e<d*i;e++){let r=e%d>>0,i=e/d>>0,c=r/t,p=i/t,u=0,b=0,y=0,m=0,s=0;for(let e=p;e<p+n;){let t=e>>0;if(t>=l)break;let r=t+1;r>p+n&&(r=p+n);let d=r-e;for(let e=c;e<c+n;){let r=e>>0;if(r>=a)break;let l=r+1;l>c+n&&(l=c+n);let i=(l-e)*d,f=4*(r+t*a),p=o.data[f+0],g=o.data[f+1],v=o.data[f+2],x=o.data[f+3];b+=p*i,y+=g*i,m+=v*i,s+=x*i,u+=i,e=l}e=r}b/=u,y/=u,m/=u,s/=u,b>>=0,y>>=0,m>>=0,s>>=0;let g=4*(r+i*d);f.data[g+0]=b,f.data[g+1]=y,f.data[g+2]=m,f.data[g+3]=s}return r.w=d,r.h=i,r.img=f,r}}},t={};function r(o){var a=t[o];if(void 0!==a)return a.exports;var l=t[o]={exports:{}};return e[o](l,l.exports,r),l.exports}r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};return(()=>{"use strict";r.r(o),r.d(o,{exec:()=>e.G});var e=r(739)})(),o})()));
//# sourceMappingURL=bundle.js.map