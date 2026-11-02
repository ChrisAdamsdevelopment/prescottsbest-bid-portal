// Site interactions: plain-language, accessible, opt-in. No inference-model API calls.
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const element=document.querySelector('#budget-form');
if(element){
 element.addEventListener('submit',async ev=>{
  ev.preventDefault();
  const values=Object.fromEntries(new FormData(element).entries());
  const target=document.getElementById('budget-result');
  target.replaceChildren();
  const status=document.createElement('p');status.textContent='Calculating an illustrative range…';target.append(status);
  try{
   const response=await fetch('/api/public/budget',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
   const data=await response.json();
   if(!response.ok)throw Error(data.error||'Please check the project selections.');
   const head=document.createElement('div');head.className='budget-results';
   const title=document.createElement('h2');title.textContent=data.project;
   const range=document.createElement('strong');range.textContent=money(data.planningDirectCosts.low)+' – '+money(data.planningDirectCosts.high);
   const caption=document.createElement('p');caption.textContent='Illustrative base project-cost range, before the hypothetical pricing provisions below.';
   head.append(title,range,caption);
   const modes=document.createElement('div');modes.className='budget-modes';
   for(const [key,label] of [['fixed','Fixed price example'],['costPlus','Cost-plus example']]){
    const card=document.createElement('div');card.className='budget-mode';
    const h=document.createElement('h3');h.textContent=label;
    const amount=document.createElement('span');amount.textContent=money(data[key].low)+' – '+money(data[key].high);
    card.append(h,amount);modes.append(card);
   }
   const expl=document.createElement('p');expl.textContent=data.explanation;
   const warning=document.createElement('p');warning.className='preview-warning';warning.textContent=data.disclaimer;
   try{sessionStorage.setItem('pbc_budget_draft',JSON.stringify({project:data.project,range:money(data.costPlus.low)+' – '+money(data.costPlus.high),inputs:data.inputs,version:data.version}));}catch{}
   const next=document.createElement('a');next.className='site-button primary';next.href='/remodeling-preview/schedule';
   next.textContent='Talk with a contractor about my home';
   target.replaceChildren(head,modes,expl,warning,next);
  }catch(err){status.textContent='Could not calculate this example: '+err.message;}
 });
}
const lead=document.querySelector('#inquiry-form');
if(lead){
 let requestId=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString().slice(2);
 try{const saved=JSON.parse(sessionStorage.getItem('pbc_budget_draft')||'null');
   if(saved){const note=lead.querySelector('#lead-notes');
     note.value='I explored a research-only budget for '+saved.project+' ('+saved.range+'). Please discuss my actual site conditions and pricing.\n';
   }
 }catch{}
 lead.addEventListener('submit',async ev=>{
  ev.preventDefault();
  const submit=lead.querySelector('button[type=submit]'),info=document.getElementById('lead-message');
  if(!lead.reportValidity())return;
  submit.disabled=true;
  info.textContent='Submitting the request…';
  const data=Object.fromEntries(new FormData(lead).entries());
  data.consent=document.getElementById('lead-consent').checked;
  data.requestId=requestId;
  try{
   const result=await fetch('/api/public/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
   const json=await result.json();
   if(!result.ok)throw Error(json.error||'Request could not be sent.');
   info.textContent='Your project request was recorded. Reference: '+json.reference+'. For urgent scheduling, please call (928) 350-0940.';
   lead.reset();requestId=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString().slice(2);
  }catch(err){info.textContent=err.message+' You can email chris@prescottsbestconstruction.com or call (928) 350-0940.';}
  finally{submit.disabled=false}
 });
}
