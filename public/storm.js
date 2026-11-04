// Browser-only storm recovery worksheet; no automatic file upload, geolocation or network request.
const form=document.querySelector('#storm-planner');
if(form){
 const result=document.getElementById('storm-plan-result');
 const base=['prescottsbestremodeling.com','www.prescottsbestremodeling.com'].includes(location.hostname.toLowerCase())?'':'/remodeling-preview';
 const make=(tag,content,cls)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(content!==undefined)el.textContent=content;return el;};
 form.addEventListener('submit',ev=>{
  ev.preventDefault();
  if(!form.reportValidity())return;
  const input=Object.fromEntries(new FormData(form).entries());
  const steps=[];
  const add=(t)=>steps.push(t);
  if(input.safe!=='yes')add('SAFETY FIRST: Do not enter flooded, restricted or potentially unsafe areas. Follow local officials and seek qualified utility, structural or mitigation help; call 911 for immediate danger.');
  else add('If new hazards appear—unstable walls, wet electrical gear, gas odors or contaminated water—stop and seek qualified safety advice.');
  add('When safe, document every affected room with wide and close photographs before disposal or permanent repairs. Keep dated notes, samples where appropriate and all invoices.');
  if(input.location==='Prescott')add('City of Prescott: report private-property flood damage to Community Development, (928) 777-1405, option 1. Check the city’s current notices for closures and additional guidance.');
  else add('Check the applicable city or county emergency-management page for official damage reporting and assistance. Reporting procedures vary by jurisdiction.');
  if(input.source==='surface')add('Ask whether a separate flood insurance policy applies. Surface flooding is generally not covered by standard homeowners policies. Your insurer must determine the actual coverage.');
  else if(input.source==='roof')add('Record any visible wind, roof or wall damage and water-entry path without climbing onto the roof. Ask your homeowners insurer how the policy addresses this cause of loss.');
  else if(input.source==='plumbing')add('Tell your insurer whether this involved a plumbing leak or backup; ask about any exclusions or optional drain or sewer endorsements.');
  else add('The source of moisture may be uncertain. Record where and when water appeared and ask qualified professionals to help identify causes safely.');
  if(input.claim==='not-started')add('Contact your insurer promptly, ask how to file a claim, what photographs and receipts are needed, and whether temporary work requires advance coordination.');
  else if(input.claim==='filed')add('Keep your claim reference and a written log of contacts. Ask the adjuster what to preserve and document before repairs or disposal.');
  else if(input.claim==='inspected')add('Ask for an itemized estimate and coverage explanation. Make note of any damaged areas that were missed or could not be inspected.');
  else if(input.claim==='denied')add('Request the insurer’s written explanation and review it against your policy. Arizona DIFI can explain complaint options; independent licensed claims help is separate from construction work.');
  else add('Ask an insurance professional about available coverage, and check official local resources without assuming disaster assistance is guaranteed.');
  if(input.affected==='structural')add('Potential structural distress: consult a qualified building inspector or structural engineer before entering or authorizing work.');
  else if(input.affected==='contents')add('Photograph damaged belongings and appliance model or serial numbers; request itemization instructions from the insurer.');
  else if(input.affected==='exterior')add('Use ground-level images of roof edges, windows, siding and exterior materials. Do not climb damaged roofs or ladders.');
  else add('List each room and each building element affected, including hidden materials that may need professional inspection.');
  add('Distinguish emergency water mitigation and contamination cleanup from later remodeling or reconstruction. Confirm relevant licensing, permits and specialties.');
  add('Before committing, obtain a detailed construction scope, written pricing, exclusions and documented changes. A contractor cannot promise insurance coverage or negotiate the claim as your adjuster.');
  const title=make('h3','Your storm-recovery first-step checklist');
  const intro=make('p','Area: '+input.location+' • Damage: '+form.elements.affected.selectedOptions[0].text+' • Claim stage: '+form.elements.claim.selectedOptions[0].text);
  const list=make('ol',undefined,'storm-result-list');
  for(const item of steps)list.append(make('li',item));
  const caption=make('p','Save this summary or use it to prepare a request. This is an educational worksheet, not a safety inspection, insurance determination or repair estimate.','micro');
  const summary=['Storm recovery preparation','Area: '+input.location,'Affected: '+input.affected,'Possible water source: '+input.source,'Insurance stage: '+input.claim,'Safe entry: '+input.safe,'Notes: '+(input.notes||'(not provided)'),'Next steps:',...steps.map((x,i)=>(i+1)+'. '+x)].join('\n');
  const actions=make('div',undefined,'site-actions');
  const copy=make('button','Copy my checklist','site-button outline');copy.type='button';
  copy.addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(summary);copy.textContent='Copied to clipboard';}catch{copy.textContent='Copy unavailable; use Print / save';}
  });
  const print=make('button','Print / save as PDF','site-button outline');print.type='button';print.addEventListener('click',()=>window.print());
  const next=make('a','Send written project details','site-button primary');next.href=base+'/schedule';
  const clear=make('button','Clear my saved worksheet','site-button outline');clear.type='button';
  clear.addEventListener('click',()=>{
   try{sessionStorage.removeItem('pbc_storm_draft');}catch{}
   result.replaceChildren(make('p','Saved worksheet cleared. Your answers remain in the fields above until you reset the page.'));
  });
  const legal=make('p','If you continue, the separate contact form asks for your name and email and requires consent. This worksheet does not attach or transmit photos.','micro');
  actions.append(copy,print,next,clear);
  result.replaceChildren(title,intro,list,caption,actions,legal);
  window.pbcAnalytics?.track('storm_checklist');
  try{sessionStorage.setItem('pbc_storm_draft',JSON.stringify({location:input.location,affected:input.affected,source:input.source,claim:input.claim,safe:input.safe,notes:(input.notes||'').slice(0,600)}));}catch{}
  result.scrollIntoView({behavior:'smooth',block:'start'});
 });
}
