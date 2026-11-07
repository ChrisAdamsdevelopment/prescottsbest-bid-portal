// Scotty: opt-in, accessible conversational overlay. No transcript persistence or autosend.
(()=>{
 const root=document.getElementById('scotty-widget');if(!root)return;
 const $=id=>document.getElementById(id);
 const open=$('scotty-open'),close=$('scotty-close'),panel=$('scotty-panel');
 const form=$('scotty-form'),question=$('scotty-question'),consent=$('scotty-consent');
 const send=$('scotty-send'),status=$('scotty-status'),log=$('scotty-chat-log');
 const notice=$('scotty-response-announcement'),noticeText=$('scotty-announce-text'),jump=$('scotty-jump');
 let active=false,busy=false,ready=false,checked=false,history=[],latestReply=null;
 const update=()=>{send.disabled=!ready||busy||!consent.checked||question.value.trim().length<4;send.textContent=busy?'Getting your answer…':'Ask Scotty';};
 async function checkAvailability(){
  if(checked)return;checked=true;
  try{
   const response=await fetch('/api/public/ai-guide/status',{cache:'no-store'});
   if(!response.ok)throw Error('Not available');
   const data=await response.json();ready=data.available===true;
   status.textContent=ready?'Scotty is ready. Your question goes to Google Gemini only after you agree and press Ask.':'Scotty is temporarily unavailable. You can use our project tools or call (928) 350-0940.';
  }catch{ready=false;status.textContent='AI help is offline. Call (928) 350-0940 instead.';}
  update();
 }
 function toggle(show){
  active=show;panel.hidden=!show;root.classList.toggle('scotty-active',show);
  document.body.classList.toggle('scotty-chat-open',show);
  open.setAttribute('aria-expanded',String(show));
  if(show){void checkAvailability();(latestReply||question).focus({preventScroll:true});}
  else{open.focus({preventScroll:true});}
 }
 open.addEventListener('click',()=>toggle(!active));
 close.addEventListener('click',()=>toggle(false));
 document.addEventListener('keydown',e=>{if(active&&e.key==='Escape')toggle(false);});
 // Keep keyboard navigation inside the visible modal; Escape always closes it.
 document.addEventListener('keydown',e=>{
  if(!active||e.key!=='Tab')return;
  const items=[...panel.querySelectorAll('button:not([disabled]):not([hidden]),a[href],textarea:not([disabled]),input:not([disabled])')]
   .filter(el=>el.getClientRects().length);
  if(!items.length)return;
  if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items[items.length-1].focus();}
  else if(!e.shiftKey&&document.activeElement===items[items.length-1]){e.preventDefault();items[0].focus();}
 });
 question.addEventListener('input',update);consent.addEventListener('change',update);
 const announce=(message,showJump=false)=>{
  notice.hidden=false;noticeText.textContent=message;jump.hidden=!showJump;
 };
 function moveToReply(reply){
  if(!reply)return;
  // Read from the beginning of the newest answer; the user can scroll down normally.
  requestAnimationFrame(()=>{
   log.scrollTop=Math.max(0,reply.offsetTop-log.offsetTop-10);
   reply.focus({preventScroll:true});
  });
 }
 jump.addEventListener('click',()=>moveToReply(latestReply));
 function turn(who,text){
  const row=document.createElement('div');row.className=who==='you'?'scotty-user':'scotty-reply';
  if(who!=='you')row.tabIndex=-1;
  const label=document.createElement('strong');label.textContent=who==='you'?'You':'Scotty (AI)';
  const body=document.createElement('span');body.textContent=text;
  row.append(label,body);log.append(row);
  log.scrollTop=log.scrollHeight;
  return row;
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!ready||busy||!consent.checked)return;
  const text=question.value.trim().slice(0,600);if(text.length<4)return;
  // Show a new turn immediately so there is no invisible loading interval.
  turn('you',text);question.value='';busy=true;update();
  const reply=turn('ai','Preparing your answer…');
  latestReply=reply;root.classList.add('scotty-has-turns');
  announce('Scotty is preparing an answer…');
  status.textContent='Please wait while Scotty prepares your answer.';
  try{
   const response=await fetch('/api/public/ai-guide',{method:'POST',
    headers:{'Content-Type':'application/json'},body:JSON.stringify({question:text,consent:true,history}),cache:'no-store'});
   const data=await response.json();if(!response.ok)throw Error(data.error||'Please try again.');
   const answer=String(data.answer||'No answer was returned. Please ask again.');
   reply.querySelector('span').textContent=answer;
   history.push({role:'user',text},{role:'model',text:answer.slice(0,650)});
   history=history.slice(-4);
   const actions=Array.isArray(data.actions)?data.actions:[];
   const links=document.createElement('div');links.className='scotty-answer-links';
   for(const action of actions){
    if(!['/start-here','/estimate','/blog','/schedule'].includes(action.href)||typeof action.label!=='string')continue;
    const a=document.createElement('a');a.href=action.href;a.textContent=action.label;links.append(a);
   }
   if(links.childElementCount)reply.append(links);
   announce('New answer from Scotty — shown below.',true);
   status.textContent='Answer received. You can ask a follow-up, read the answer, or contact the team.';
   moveToReply(reply);
  }catch(e){
   const problem=e instanceof Error?e.message:'AI temporarily unavailable';
   reply.querySelector('span').textContent=problem+' You can call (928) 350-0940 for help.';
   announce('Could not load an answer — explanation below.',true);
   status.textContent='Scotty could not answer. Please try again or call us.';
   moveToReply(reply);
  }finally{busy=false;update();}
 });
 update();
})();
