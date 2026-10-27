import {createGazeAnimator} from './motion-runtime.js';
const dialog=document.querySelector('#skillsDialog'),button=document.querySelector('#skills');
button.addEventListener('click',()=>{dialog.showModal();document.body.classList.add('dialog-open')});
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');button.focus()});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const stage=document.querySelector('#avatarStage'),sprite=document.querySelector('#avatarSprite'),fallback=document.querySelector('#avatarFallback'),hint=document.querySelector('#motionHint');
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
let animator,visible=true;
function preferences(){const active=!reduce.matches&&fine.matches;if(animator){animator.pause(!active||!visible||document.hidden);sprite.hidden=!active;fallback.hidden=active}hint.textContent=active?'移动鼠标，和我打个招呼':'从下面的入口认识我'}
const atlas=new Image();atlas.src=new URL('assets/chester-cartoon-gaze.webp',import.meta.url).href;
atlas.decode().then(()=>{sprite.style.backgroundImage='url('+atlas.src+')';animator=createGazeAnimator(sprite);preferences()}).catch(()=>{hint.textContent='从四个入口认识我'});
window.addEventListener('pointermove',e=>{if(!animator||!fine.matches||reduce.matches||!visible||document.hidden)return;const r=stage.getBoundingClientRect();animator.target(1+(e.clientX-r.left-r.width/2)/Math.max(innerWidth*.3,150),1+(e.clientY-r.top-140)/Math.max(innerHeight*.3,150))},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>animator?.target(1,1));
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;preferences()}).observe(stage);
document.addEventListener('visibilitychange',preferences);reduce.addEventListener('change',preferences);fine.addEventListener('change',preferences);preferences();
window.addEventListener('pagehide',()=>animator?.destroy());
