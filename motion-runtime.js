/* Adapted from oil-motion interactive-motion.ts, MIT, Lin Zhihuang 2026. See assets/oil-motion-LICENSE.txt. */
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
function damp(c,t,v,dt){const w=2/.11,x=w*dt,e=1/(1+x+.48*x*x+.235*x*x*x),d=c-t,k=(v+w*d)*dt;let n=t+(d+k)*e,nv=(v-w*k)*e;if((t-c>0)===(n>t)){n=t;nv=0}return[n,nv]}
export function createGazeAnimator(element){let x=1,y=1,tx=1,ty=1,vx=0,vy=0,raf=0,last=0,frame=-1,paused=false;
 function draw(){const col=Math.round(x),row=Math.round(y),i=row*3+col;if(i!==frame){element.style.backgroundPosition=(col*50)+'% '+(row*50)+'%';element.dataset.frame=i;frame=i}}
 function tick(now){raf=0;if(paused)return;let dt=last?Math.min((now-last)/1000,.05):1/60;last=now;[x,vx]=damp(x,tx,vx,dt);[y,vy]=damp(y,ty,vy,dt);draw();if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(vx)+Math.abs(vy)>.002)raf=requestAnimationFrame(tick);else last=0}
 return{target(a,b){tx=clamp(a,0,2);ty=clamp(b,0,2);if(!raf&&!paused)raf=requestAnimationFrame(tick)},pause(p){paused=p;cancelAnimationFrame(raf);raf=0;last=0;if(!p)raf=requestAnimationFrame(tick)},destroy(){paused=true;cancelAnimationFrame(raf)}}}
