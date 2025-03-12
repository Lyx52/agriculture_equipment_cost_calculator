import{cs as a,ct as s}from"./index-Df3Kt0MY.js";/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/dev/LICENSE.md for details.
 * v2.13.2
 */const o=new WeakMap,t=new WeakMap;function c(e){t.set(e,new Promise(n=>o.set(e,n)))}function p(e){o.get(e)()}function r(e){return t.get(e)}async function m(e){if(await r(e),!!a())return s(e),new Promise(n=>requestAnimationFrame(()=>n()))}export{p as a,m as c,c as s};
