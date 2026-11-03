// Visitor-controlled AI guide. No cookies, analytics events or browser storage for conversation text.
(()=>{
 const form=document.getElementById('guide-form');if(!form)return;
 const q=document.getElementById('guide-question'),consent=document.getElementById('guide-consent'),
  send=document.getElementById('guide-submit'),status=document.getElementById('guide-status'),
  log=document.getElementById('guide-transcript'),read=document.getElementById('guide-read'),
  stop=document.getElementById('guide-stop'),clear=document.getElementById('guide-clear');
 let available=false,busy=false,history=[],lastAnswer='';
 const refresh=()=>{send.disabled=!available||busy||!consent.checked||q.value.trim().length<4;};
 const message=(who,txt)=>{
  const row=document.createElement('div');row.className='guide-turn '+(who==='you'?'guide-human':'guide-ai');
  const heading=document.createElement('strong');heading.textContent=who==='you'?'You asked':'AI Project Guide';
  const body=document.createElement('p');body.textContent=txt;row.append(heading,body);log.append(row);
  row.scrollIntoView({block:'nearest',behavior:'instant'});return row;
 };
 function endSpeech(){
  if('speechSynthesis' in window)window.speechSynthesis.cancel();
  stop.hidden=true;
 }
 const checked=async()=>{
  try{
   const r=await fetch('/api/public/ai-guide/status',{cache:'no-store'});
   if(!r.ok)throw Error('Unavailable');
   const data=await r.json();
   available=data.available===true;
   status.textContent=available?'Ready. Tell me about your project when you choose.':'The AI guide is being prepared. You can still use the project checklist, budget explorer, or call us.';
  }catch{available=false;status.textContent='The AI guide cannot connect. Our regular planning tools and phone contact still work.';}
  refresh();
 };
 document.querySelectorAll('.guide-prompt').forEach(button=>button.addEventListener('click',()=>{
  q.value=button.dataset.prompt||'';q.focus();refresh();
 }));
 q.addEventListener('input',refresh);consent.addEventListener('change',refresh);
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!available||busy||!consent.checked||q.value.trim().length<4)return;
  const question=q.value.trim().slice(0,650);
  busy=true;refresh();status.textContent='Preparing a clear answer…';
  endSpeech();
  try{
   const r=await fetch('/api/public/ai-guide',{method:'POST',
    headers:{'Content-Type':'application/json'},body:JSON.stringify({consent:true,question,history}),
    cache:'no-store'});
   const data=await r.json();
   if(!r.ok)throw Error(data.error||'AI assistance unavailable.');
   message('you',question);message('ai',data.answer);
   history.push({role:'user',text:question},{role:'model',text:data.answer.slice(0,650)});
   history=history.slice(-4);
   lastAnswer=data.answer;read.disabled=!('speechSynthesis' in window);
   q.value='';status.textContent='You can ask a follow-up question or use one of the homeowner tools. Answers are not sent to the contractor.';
  }catch(err){status.textContent=err.message+' Call (928) 350-0940 if you need personal help.';}
  finally{busy=false;refresh()}
 });
 read.addEventListener('click',()=>{
  if(!lastAnswer||!('speechSynthesis' in window))return;
  endSpeech();const utterance=new SpeechSynthesisUtterance(lastAnswer);utterance.rate=0.87;
  utterance.onend=utterance.onerror=()=>{stop.hidden=true};
  stop.hidden=false;window.speechSynthesis.speak(utterance);
 });
 stop.addEventListener('click',endSpeech);
 clear.addEventListener('click',()=>{
  endSpeech();history=[];lastAnswer='';read.disabled=true;q.value='';
  log.replaceChildren();
  const greeting=document.createElement('p');greeting.className='guide-greeting';
  greeting.textContent='Starting over. What would you like to change in your home?';
  log.append(greeting);status.textContent=available?'Ready for a fresh question.':'The AI guide is not enabled yet.';
  refresh();q.focus();
 });
 window.addEventListener('pagehide',endSpeech);
 checked();
})();
