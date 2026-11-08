// The optional commercial film player avoids unnecessary offscreen downloads.
// Autoplay is muted and only runs when visible, on capable connections, respecting reduced motion.
(()=>{
 const items=Array.from(document.querySelectorAll('[data-brand-film]'));
 if(!items.length)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const slow=Boolean(navigator.connection?.saveData);
 const players=[];
 for(const figure of items){
  const video=figure.querySelector('[data-brand-video]');
  const toolbar=figure.querySelector('[data-film-controls]');
  const play=figure.querySelector('[data-film-toggle]');
  const sound=figure.querySelector('[data-film-sound]');
  if(!video||!toolbar||!play||!sound)continue;
  toolbar.hidden=false;
  video.controls=false; // Keep native controls as the no-JavaScript fallback.
  let visible=false;
  let chosenPause=false;
  let userPlayed=false;
  let autoplayStarted=false;
  const refresh=()=>{
   play.textContent=video.paused?'Play video':'Pause video';
   play.setAttribute('aria-pressed',String(!video.paused));
   play.setAttribute('aria-label',(video.paused?'Play ':'Pause ')+video.getAttribute('aria-label'));
   sound.textContent=video.muted?'Sound on':'Sound off';
   sound.setAttribute('aria-pressed',String(!video.muted));
   sound.setAttribute('aria-label',(video.muted?'Turn on':'Turn off')+' sound for '+video.getAttribute('aria-label'));
   figure.dataset.playing=String(!video.paused);
  };
  const autoAllowed=()=>!reduced.matches&&!slow&&!chosenPause&&!document.hidden;
  async function start(manual=false){
   if(!manual&&!autoAllowed())return;
   try{
    if(manual){chosenPause=false;userPlayed=true}
    await video.play();
    if(!manual)autoplayStarted=true;
   }catch{ /* Browser declined autoplay; keep poster and functional Play control. */ }
   refresh();
  }
  const stop=()=>{
   if(!video.paused)video.pause();
   refresh();
  };
  play.addEventListener('click',()=>{
   if(video.paused){start(true)}
   else{chosenPause=true;stop()}
  });
  sound.addEventListener('click',async()=>{
   video.muted=!video.muted;
   // Starting or resuming playback after clicking sound requires a user gesture.
   if(!video.muted&&video.paused)await start(true);
   refresh();
  });
  video.addEventListener('play',refresh);
  video.addEventListener('pause',refresh);
  video.addEventListener('volumechange',refresh);
  const entry={figure,video,refresh,setVisible(value){
   visible=value;
   if(visible&&autoAllowed()&&!userPlayed&&!autoplayStarted)start();
   else if(!visible)stop();
  },stop};
  players.push(entry);
  refresh();
 }
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    const item=players.find(p=>p.figure===entry.target);
    item?.setVisible(entry.isIntersecting&&entry.intersectionRatio>=.22);
   }
  },{threshold:[0,.22,.5]});
  players.forEach(p=>observer.observe(p.figure));
 }else{
  // In older browsers, manual playback remains available through an explicit button.
  players.forEach(p=>p.setVisible(true));
 }
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden)players.forEach(p=>p.stop());
  // Avoid surprising restarts on returning to a hidden tab.
 });
 reduced.addEventListener?.('change',()=>{
  if(reduced.matches)players.forEach(p=>p.stop());
 });
})();
