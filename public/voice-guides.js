// Accessible on-demand spoken instructions. No microphone, no automatic playback.
// Once approved M4A recordings are available, set data-guide-audio on the guide panel.
(() => {
 'use strict';
 const cards=[...document.querySelectorAll('[data-voice-guide]')];
 if(!cards.length)return;
 const synthesis=('speechSynthesis' in window)?window.speechSynthesis:null;
 let current=null,voice=null,media=null,version=0,paused=false;
 function status(card,message){
  const target=card?.querySelector('[data-guide-status]');
  if(target)target.textContent=message;
 }
 function resetButtons(card){
  if(!card)return;
  const pause=card.querySelector('[data-guide-pause]');
  pause.disabled=true;pause.textContent='Pause';
 }
 function stop(message){
  version++;
  if(synthesis)synthesis.cancel();
  if(media){media.pause();media.currentTime=0;media=null;}
  if(current){
   resetButtons(current);
   if(message)status(current,message);
  }
  current=null;voice=null;paused=false;
 }
 function finished(card,stamp){
  if(stamp!==version||current!==card)return;
  status(card,'Finished. Press Start again to hear the instructions once more.');
  resetButtons(card);current=null;voice=null;media=null;paused=false;
 }
 function readWithDevice(card,stamp){
  if(!synthesis||typeof window.SpeechSynthesisUtterance!=='function'){
   status(card,'Your browser cannot read aloud. Open the written instructions below instead.');
   const details=card.querySelector('details');if(details)details.open=true;
   resetButtons(card);current=null;return;
  }
  const u=new SpeechSynthesisUtterance(card.dataset.guideSpeech||'');
  u.lang='en-US';u.rate=0.90;u.pitch=1;u.volume=1;
  u.onend=()=>finished(card,stamp);
  u.onerror=e=>{
   if(stamp!==version||current!==card)return;
   if(e.error==='canceled'||e.error==='interrupted')return;
   status(card,'Audio stopped. Press Start again, or read the instructions below.');
   resetButtons(card);current=null;
  };
  voice=u;
  try{
   synthesis.cancel();
   synthesis.speak(u);
   card.querySelector('[data-guide-pause]').disabled=false;
   status(card,'Playing spoken instructions. Press Pause whenever you like.');
  }catch{
   status(card,'Read-aloud is unavailable. Use the written instructions below.');
   card.querySelector('details').open=true;resetButtons(card);current=null;
  }
 }
 function begin(card){
  stop();
  current=card;
  const stamp=version;
  // Stop any decorative video so there are never two narrators talking at once.
  document.querySelectorAll('video[data-brand-video]').forEach(v=>v.pause());
  const path=(card.dataset.guideAudio||'').trim();
  if(path){
   const a=new Audio(path);a.preload='none';media=a;
   a.onended=()=>finished(card,stamp);
   a.onerror=()=>{
    if(stamp!==version||current!==card)return;
    media=null;readWithDevice(card,stamp);
   };
   a.play().then(()=>{
    if(stamp!==version||current!==card){a.pause();return;}
    card.querySelector('[data-guide-pause]').disabled=false;
    status(card,'Playing recorded instructions. Press Pause whenever you like.');
   }).catch(()=>{
    if(stamp===version&&current===card){media=null;readWithDevice(card,stamp);}
   });
  }else readWithDevice(card,stamp);
 }
 cards.forEach(card=>{
  const open=card.querySelector('[data-guide-open]');
  const panel=card.querySelector('.voice-guide-panel');
  const pause=card.querySelector('[data-guide-pause]');
  const replay=card.querySelector('[data-guide-restart]');
  const close=card.querySelector('[data-guide-close]');
  const hide=()=>{
   if(current===card)stop('Stopped.');
   panel.hidden=true;open.setAttribute('aria-expanded','false');
   open.innerHTML='<span aria-hidden="true">▶</span> Listen to instructions';
   open.focus();
  };
  open.addEventListener('click',()=>{
   if(!panel.hidden){hide();return;}
   panel.hidden=false;open.setAttribute('aria-expanded','true');
   open.innerHTML='<span aria-hidden="true">■</span> Close audio guide';
   begin(card);
  });
  close.addEventListener('click',hide);
  replay.addEventListener('click',()=>begin(card));
  pause.addEventListener('click',()=>{
   if(current!==card)return;
   if(!paused){
    if(media)media.pause();
    else if(synthesis)synthesis.pause();
    paused=true;pause.textContent='Resume';
    status(card,'Paused. Press Resume to continue.');
   }else{
    if(media)media.play().catch(()=>status(card,'Could not resume. Press Start again.'));
    else if(synthesis)synthesis.resume();
    paused=false;pause.textContent='Pause';
    status(card,'Playing spoken instructions.');
   }
  });
 });
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&current)stop('Stopped when you left the page. Press Start again to resume.');
 });
 window.addEventListener('pagehide',()=>stop());
})();
