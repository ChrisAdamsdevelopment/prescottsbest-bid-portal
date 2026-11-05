// Small opt-in Scotty chat. No storage, no autosend, no hidden transcript collection.
(()=>{
 const root=document.getElementById('scotty-widget');if(!root)return;
 const $=id=>document.getElementById(id);
 const open=$('scotty-open'),close=$('scotty-close'),panel=$('scotty-panel');
 const form=$('scotty-form'),question=$('scotty-question'),consent=$('scotty-consent');
 const send=$('scotty-send'),status=$('scotty-status'),log=$('scotty-chat-log');
 let active=false,busy=false,ready=false,checked=false,history=[];
 const update=()=>{send.disabled=!ready||busy||!consent.checked||question.value.trim().length<4;};
 async function checkAvailability(){
  if(checked)return;checked=true;
  try{
   const response=await fetch('/api/public/ai-guide/status',{cache:'no-store'});
   if(!response.ok)throw Error('Not available');
   const data=await response.json();ready=data.available===true;
   status.textContent=ready?'Scotty is ready when you are. Questions go to Google Gemini only after you agree and press Ask.':'Scotty is temporarily unavailable. You can still use our project tools or call (928) 350-0940.';
  }catch{ready=false;status.textContent='AI help is offline. Call our team at (928) 350-0940 instead.';}
  update();
 }
 function toggle(show){
  active=show;panel.hidden=!show;open.setAttribute('aria-expanded',String(show));
  if(show){void checkAvailability();question.focus();}
  else{open.focus();}
 }
 open.addEventListener('click',()=>toggle(!active));
 close.addEventListener('click',()=>toggle(false));
 document.addEventListener('keydown',e=>{if(active&&e.key==='Escape')toggle(false);});
 question.addEventListener('input',update);consent.addEventListener('change',update);
 function turn(who,text){
  const row=document.createElement('p');row.className=who==='you'?'scotty-user':'scotty-reply';
  const label=document.createElement('strong');label.textContent=who==='you'?'You':'Scotty (AI)';
  const body=document.createElement('span');body.textContent=text;
  row.append(label,body);log.append(row);log.scrollTop=log.scrollHeight;return row;
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!ready||busy||!consent.checked)return;
  const text=question.value.trim().slice(0,600);if(text.length<4)return;
  busy=true;update();status.textContent='Scotty is preparing an answer…';
  try{
   const response=await fetch('/api/public/ai-guide',{method:'POST',
    headers:{'Content-Type':'application/json'},body:JSON.stringify({question:text,consent:true,history}),cache:'no-store'});
   const data=await response.json();if(!response.ok)throw Error(data.error||'Please try again.');
   turn('you',text);const reply=turn('ai',String(data.answer||''));
   history.push({role:'user',text},{role:'model',text:String(data.answer||'').slice(0,650)});
   history=history.slice(-4);question.value='';
   const actions=Array.isArray(data.actions)?data.actions:[];
   const links=document.createElement('div');links.className='scotty-answer-links';
   for(const action of actions){
    if(!['/start-here','/estimate','/blog','/schedule'].includes(action.href)||typeof action.label!=='string')continue;
    const a=document.createElement('a');a.href=action.href;a.textContent=action.label;links.append(a);
   }
   if(links.childElementCount)reply.append(links);
   status.textContent='You can ask a follow-up or contact our team directly. This chat is not a quote request.';
  }catch(e){status.textContent=(e instanceof Error?e.message:'AI temporarily unavailable')+' You can call (928) 350-0940.';}
  finally{busy=false;update();}
 });
 update();
})();
