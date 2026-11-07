
// Website interactions are optional; core content and phone/email links work without JavaScript.
// No visitor data is transmitted by the planning worksheet.
const siteBase=['prescottsbestremodeling.com','www.prescottsbestremodeling.com']
 .includes(window.location.hostname.toLowerCase())?'':'/remodeling-preview';
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const element=document.querySelector('#budget-form');
if(element){
 const calculate=async()=>{
  const values=Object.fromEntries(new FormData(element).entries());
  const target=document.getElementById('budget-result');
  target.replaceChildren();
  const status=document.createElement('p');status.textContent='Calculating your budget range…';target.append(status);
  try{
   const response=await fetch('/api/public/budget',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
   const data=await response.json();
   if(!response.ok)throw Error(data.error||'Please check the project selections.');
   const head=document.createElement('div');head.className='budget-results';
   const title=document.createElement('h2');title.textContent=data.project;
   const range=document.createElement('strong');range.textContent=money(data.homeownerRange.low)+' – '+money(data.homeownerRange.high);
   const caption=document.createElement('p');caption.textContent='A starting budget range for your whole project. Adjust the options to see what changes the estimate.';
   head.append(title,range,caption);
   const modes=document.createElement('details');modes.className='budget-breakdown';
   const summary=document.createElement('summary');summary.textContent='See how fixed-price and cost-plus examples compare';modes.append(summary);
   const modeWrap=document.createElement('div');modeWrap.className='budget-modes';modes.append(modeWrap);
   for(const [key,label] of [['fixed','Fixed price example'],['costPlus','Cost-plus example']]){
    const card=document.createElement('div');card.className='budget-mode';
    const h=document.createElement('h3');h.textContent=label;
    const amount=document.createElement('span');amount.textContent=money(data[key].low)+' – '+money(data[key].high);
    card.append(h,amount);modeWrap.append(card);
   }
   const expl=document.createElement('p');expl.textContent=data.explanation;
   const warning=document.createElement('p');warning.className='preview-warning';warning.textContent=data.disclaimer;
   try{sessionStorage.setItem('pbc_budget_draft',JSON.stringify({project:data.project,range:money(data.homeownerRange.low)+' – '+money(data.homeownerRange.high),inputs:data.inputs,version:data.version}));}catch{}
   const next=document.createElement('a');next.className='site-button primary';next.href=siteBase+'/schedule';
   next.textContent='Discuss my project with a contractor';
   const tools=document.createElement('div');tools.className='budget-tools site-actions';
   const printable=document.createElement('button');printable.className='site-button outline';printable.type='button';
   printable.textContent='Print / save this example';
   printable.addEventListener('click',()=>window.print());
   const copy=document.createElement('button');copy.className='site-button outline';copy.type='button';copy.textContent='Copy budget summary';
   copy.addEventListener('click',async()=>{
    const summary=[data.project,'Direct-cost example: '+range.textContent,'Fixed-price example: '+money(data.fixed.low)+' – '+money(data.fixed.high),'Cost-plus example: '+money(data.costPlus.low)+' – '+money(data.costPlus.high),data.disclaimer].join('\n');
    try{await navigator.clipboard.writeText(summary);copy.textContent='Copied';}
    catch{copy.textContent='Use Print / save instead';}
   });
   tools.append(printable,copy);
   target.replaceChildren(head,modes,expl,warning,tools,next);
   window.pbcAnalytics?.track('budget_complete');
  }catch(err){status.textContent='Could not calculate this example: '+err.message;}
 };
 element.addEventListener('submit',event=>{event.preventDefault();calculate();});
 element.querySelectorAll('select').forEach(select=>select.addEventListener('change',calculate));
 calculate(); // A real example appears without the visitor completing a form.
}
// Only explicit campaign tags and a landing path are retained in this browser session.
try{
 const key='pbc_entry';
 const query=new URLSearchParams(location.search);
 const campaign=(query.get('utm_source')||'').slice(0,80).replace(/[^a-zA-Z0-9._-]/g,'');
 if(!sessionStorage.getItem(key))sessionStorage.setItem(key,JSON.stringify({path:location.pathname.slice(0,180),source:campaign}));
 else if(campaign){const x=JSON.parse(sessionStorage.getItem(key));x.source=campaign;sessionStorage.setItem(key,JSON.stringify(x));}
}catch{}
const lead=document.querySelector('#inquiry-form');
if(lead){
 const fallback=document.querySelector('#lead-unavailable');
 let liveDelivery=false;
 const sendButton=lead.querySelector('button[type=submit]');
 const photoSection=lead.querySelector('#lead-photo-section');
 const photoInput=lead.querySelector('#lead-photos');
  const previewBox=lead.querySelector('#lead-visual-preview');
 // The form remains usable in email-draft mode until verified server delivery is enabled.
 fetch('/api/public/site-status',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()}).then(config=>{
  liveDelivery=config.inquiryEnabled===true;
  const photoReady=liveDelivery&&config.photoUploadEnabled===true;
  if(photoSection)photoSection.hidden=!photoReady;
  if(photoInput)photoInput.disabled=!photoReady;
  sendButton.textContent=liveDelivery?'Send project request':'Open email draft to Chris';
  if(fallback)fallback.hidden=liveDelivery;
 }).catch(()=>{liveDelivery=false;if(fallback)fallback.hidden=false;sendButton.textContent='Open email draft to Chris';});
 let requestId=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString().slice(2);
 try{
  const saved=JSON.parse(sessionStorage.getItem('pbc_budget_draft')||'null');
  const plan=JSON.parse(sessionStorage.getItem('pbc_planning_draft')||'null');
  const note=lead.querySelector('#lead-notes');
  const storm=JSON.parse(sessionStorage.getItem('pbc_storm_draft')||'null');
  const qs=new URLSearchParams(location.search);
  if(qs.get('preview')==='1'&&previewBox)previewBox.checked=true;
  const requestedProject=qs.get('project');
  if(requestedProject&&qs.get('preview')==='1'){
   const select=lead.querySelector('#lead-project');
   if(select&&[...select.options].some(o=>o.value===requestedProject))select.value=requestedProject;
  }
  const savedVisual=qs.get('preview')==='1'?sessionStorage.getItem('pbc_visual_preview_draft'):null;
  if(savedVisual){note.value=('Visual style preferences: '+savedVisual+'\n').slice(0,1600);}
  if(storm){
   const category=lead.querySelector('#lead-project');
   if(category)category.value='Storm or flood damage reconstruction';
   note.value='Storm recovery worksheet — area: '+storm.location+'; affected: '+storm.affected+'; water entry: '+storm.source+'; insurance status: '+storm.claim+'; safe entry: '+storm.safe+'.\n'+(storm.notes?'Notes: '+storm.notes:'');
   note.value=note.value.slice(0,1600);
  }
  if(saved&&!storm&&!savedVisual&&qs.get('preview')!=='1')note.value='I explored a RESEARCH-ONLY budget for '+saved.project+' ('+saved.range+'). Please discuss actual project conditions and pricing.\n';
  if(plan)note.value+=(note.value?'\n':'')+'My planning worksheet: '+plan.project+'; priority: '+plan.priority+'; timing: '+plan.timing+'; conditions: '+plan.condition+'.\n';
  const holiday=new URLSearchParams(location.search).get('from')==='holiday'?
   JSON.parse(sessionStorage.getItem('pbc_holiday_draft')||'null'):null;
  if(holiday){
   const category=lead.querySelector('#lead-project');if(category)category.value='Holiday lighting design and installation';
   note.value=('Holiday lighting design preferences — package: '+String(holiday.package||'not sure')+
    '; colors: '+String(holiday.colors||'unsure')+'; light type: '+String(holiday.product||'unsure')+
    '; approximate length: '+(holiday.feet?holiday.feet+' feet':'not measured')+
    '; access: '+String(holiday.access||'unknown')+
    '; accents: '+(Array.isArray(holiday.accents)?holiday.accents.join(', '):'none')+
    '. Please contact me about a site-reviewed quote. My preview photo stays on my device; I can choose to upload a separate photo.').slice(0,1600);
   sessionStorage.removeItem('pbc_holiday_draft');
  }
 }catch{}
 const draft=()=>{
  const data=Object.fromEntries(new FormData(lead).entries());
  return ['Hello Chris, I would like to discuss a project with Prescott’s Best Construction.',
   'Name: '+(data.name||''),'Email: '+(data.email||''),'Phone: '+(data.phone||''),
   'Project: '+(data.project||''),'Visual design preview requested: '+(previewBox?.checked?'Yes — please confirm availability and scope':'No'),
   'Details: '+(data.notes||''),
   window.pbcInspirationList?.plainText()||'No design inspiration selections attached.',
   'Please contact me about the next step.'].join('\n');
 };
 document.getElementById('lead-copy')?.addEventListener('click',async()=>{
  const info=document.getElementById('lead-message');
  try{await navigator.clipboard.writeText(draft());info.textContent='Project details copied. Paste them into an email to chris@prescottsbestconstruction.com.';}
  catch{info.textContent='Copy was not available. You can select your form details or call us.';}
 });
 lead.addEventListener('submit',async ev=>{
  ev.preventDefault();
  const submit=lead.querySelector('button[type=submit]'),info=document.getElementById('lead-message');
  if(!lead.reportValidity())return;
  if(!liveDelivery){
   const p=Object.fromEntries(new FormData(lead).entries());
   const subject='Prescott’s Best website request — '+(p.project||'remodeling');
   info.textContent='Opening your email app. Please press Send there; this website has not yet submitted your request.';
   window.location.href='mailto:chris@prescottsbestconstruction.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(draft());
   return;
  }
  submit.disabled=true;info.textContent='Submitting your request…';
  const data=Object.fromEntries(new FormData(lead).entries());
  data.consent=document.getElementById('lead-consent').checked;
  data.visualPreview=previewBox?.checked?'requested':'';
  data.inspirations=window.pbcInspirationList?.payload()||[];
  data.requestId=requestId;
  try{
   const referral=JSON.parse(sessionStorage.getItem('pbc_entry')||'null');
   data.utmSource=referral?.source||'';
   data.entryPath=referral?.path||'';
   const files=photoInput?.files?.length||0;
   if(files)info.textContent='Preparing '+files+' photo'+(files===1?'':'s')+' securely before sending…';
   data.photos=window.pbcPreparePhotos?await window.pbcPreparePhotos():[];
   const result=await fetch('/api/public/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
   const json=await result.json();
   if(!result.ok){window.pbcAnalytics?.track('form_error');throw Error(json.error||'Request could not be sent.');}
   window.pbcAnalytics?.track('form_submit');
   info.textContent=json.notificationStatus==='sent'?
    'Request received and notification accepted for Chris. Reference: '+json.reference+'. '+(json.photosReceived?'Photos attached: '+json.photosReceived+'. ':'')+'We will follow up; this is not a confirmed appointment.':
    'Your request was saved as '+json.reference+', but an email notification has not been confirmed. To make sure Chris knows right away, please call (928) 350-0940. Your details are still saved for staff review.';
   lead.reset();window.pbcResetPhotoSelection?.();requestId=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString().slice(2);
  }catch(err){info.textContent=err.message+' Please email chris@prescottsbestconstruction.com or call (928) 350-0940.';}
  finally{submit.disabled=false;}
 });
}
const planner=document.querySelector('#planning-form');
if(planner){
 const checklist={
  bathroom:['Note the room dimensions and bathroom use during construction','List shower, storage, floor and ventilation priorities'],
  kitchen:['List which cabinets, counters and appliances stay or change','Think through how meals will work during the remodel'],
  shower:['Check current tub/shower dimensions and entry height','Ask about waterproofing, drainage and slip-resistant options'],
  conversion:['Clarify the intended legal use of the finished space','Ask the jurisdiction about egress, insulation and occupancy rules'],
  carpentry:['List rooms, doors, trim profiles and finish preferences','Photograph existing transitions and damaged surfaces'],
  small:['Group tasks by room and urgency','Ask about minimum job scope, availability and trade needs']
 };
 planner.addEventListener('submit',event=>{
  event.preventDefault();
  if(!planner.reportValidity())return;
  const data=Object.fromEntries(new FormData(planner).entries());
  const result=document.querySelector('#planning-result');
  const checklistItems=[...(checklist[data.project]||[]),'Clarify what must stay in place and what can change',
   data.condition==='changes'?'Ask what trade coordination or permits the new layout requires':
    data.condition==='unknown'?'Ask which site conditions could change the project scope':
     'Confirm whether the existing layout can stay unchanged',
   'Gather photos and basic measurements before the visit',
   'Discuss expected budget, availability and written scope before committing'];
  const h=document.createElement('h2');h.textContent='Your personalized starting checklist';
  const intro=document.createElement('p');intro.textContent='Priority: '+planner.elements.priority.selectedOptions[0].text+'. Timing: '+planner.elements.timing.selectedOptions[0].text+'.';
  const ul=document.createElement('ul');ul.className='check-list';
  for(const x of checklistItems){const li=document.createElement('li');li.textContent=x;ul.append(li)}
  const disclaimer=document.createElement('p');disclaimer.className='micro';
  disclaimer.textContent='Planning help only. Not a permit decision, price quote or confirmed booking.';
  const copy=document.createElement('button');copy.type='button';copy.className='site-button outline';copy.textContent='Copy my checklist';
  copy.addEventListener('click',()=>{
   const text='Remodeling plan\n'+intro.textContent+'\n'+checklistItems.map(x=>'• '+x).join('\n');
   if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>copy.textContent='Checklist copied').catch(()=>copy.textContent='Select and copy the checklist above');
   else copy.textContent='Select and copy the checklist above';
  });
  const button=document.createElement('a');button.className='site-button primary';button.href=siteBase+'/schedule';button.textContent='Talk with us about this plan';
  result.replaceChildren(h,intro,ul,disclaimer,copy,button);
  try{sessionStorage.setItem('pbc_planning_draft',JSON.stringify(data));}catch{}
 });
}
