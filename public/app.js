const main=document.getElementById('main');
let current=null;
const el=(tag,cls='',text='')=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e};
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
async function api(path,body,csrf){
 const r=await fetch('/api/'+path,{method:body?'POST':'GET',credentials:'same-origin',
  headers:{...(body?{'Content-Type':'application/json'}:{}),...(csrf?{'X-CSRF-Token':csrf}:{})},
  ...(body?{body:JSON.stringify(body)}:{})});
 const d=await r.json();if(!r.ok)throw Error(d.error||'Request failed');return d;
}
function add(parent,...children){for(const c of children)parent.append(c);return parent}
function row(label,amount,cls=''){const tr=el('tr',cls);add(tr,el('td','',label),el('td','',money(amount)));return tr}
function section(title,tag='section'){const card=el(tag,'card');add(card,el('h2','',title));return card}
function description(title,txt){const wrap=el('div');add(wrap,el('h3','',title),el('p','scope',txt));return wrap}
function inputText(place){const v=el('input');v.type='text';v.placeholder=place;v.maxLength=120;return v}
function formStatus(parent,t,bad=false){const line=el('p',bad?'message':'status',t);parent.append(line);}
function display(d){
 current=d;if(window.renderRoom1Proposal?.(d,api,refresh))return;
 const p=d.proposal,root=el('div');
 const intro=el('div','hero'),left=el('div'),right=el('div','details');
 add(left,el('div','eyebrow','PROJECT PROPOSAL • '+p.revision),el('h1','',p.title),
    el('p','lead',p.location||'Prescott Valley and the Quad Cities'));
 add(right,el('small','',''+(p.mode==='cost_plus'?'OPEN-BOOK COST PLUS':'FIXED-PRICE PROPOSAL')),
    el('div','stat',money(p.total)),el('small','','Proposal valid until '+new Date(p.expiresAt).toLocaleDateString()));
 add(intro,left,right);root.append(intro);
 const photoCard=section('Your space. Your proposed transformation.');
 add(photoCard,el('p','small','Design concepts informed by site conditions. Product details, measurements, engineering and code compliance must be confirmed.'));
 const photos=el('div','photos');
 for(const photo of p.photos||[]){
  const fig=el('figure','photo'),image=el('img'),caption=el('figcaption');
  image.src='/api/image/'+encodeURIComponent(photo.id);
  image.alt=photo.label;
  image.loading='lazy';
  add(caption,document.createTextNode((photo.kind==='after'?'PROPOSED · ':'SITE · ')+photo.label),
     el('div','captionnote',photo.kind==='after'?'Design illustration • not built yet':'Reference condition'));
  add(fig,image,caption);photos.append(fig);
 }
 if(!p.photos?.length)photos.append(el('p','muted','Site visuals will appear in this project revision.'));
 photoCard.append(photos);root.append(photoCard);
 const columns=el('div','two'),scope=section('Project scope'),cost=section('Your estimate');
 add(scope,el('p','scope',p.scope),el('h3','','Important terms and assumptions'),el('p','scope',p.terms));
 const table=el('table','lines'),body=el('tbody');for(const item of p.items)add(body,row(item.label,item.amount));
 add(body,row('Direct costs',p.direct),row('Planning contingency',p.contingency),row('Contractor fee',p.fee));
 table.append(body);add(cost,table);
 const total=el('div','total');add(total,el('span','','Estimated total'),el('span','',money(p.total)));cost.append(total);
 if(p.mode==='cost_plus')cost.append(el('p','small','Actual cost-plus billing is governed by the signed agreement and documented costs. This is the current planning estimate.'));
 add(columns,scope,cost);root.append(columns);const pilot=garagePilot(d);if(pilot)root.append(pilot);
 const response=section('Questions and approval'),badge=el('p','chip','Status: '+p.status.replaceAll('_',' '));
 add(response,badge,el('p','small','Ask questions or request a clarification. Any change to scope or price requires a new proposal revision.'));
 const question=el('textarea');question.maxLength=850;question.placeholder='Your question or requested change...';
 const ask=el('button','','Send question');ask.onclick=async()=>{
  ask.disabled=true;try{await api('question',{message:question.value},d.csrf);question.value='';formStatus(response,'Question recorded for contractor review.');}
  catch(e){formStatus(response,e.message,true)}finally{ask.disabled=false}
 };
 add(response,question,ask,el('hr'),el('h3','','Review this exact revision'));
 const legal=el('p','notice',p.demo?'DEMONSTRATION ONLY: This is not a binding bid or construction authorization.':'Confirming indicates review and intent only. A signed contract and contractor acceptance remain separate requirements.');
 response.append(legal);
 if(p.status==='customer_reviewed'){
  response.append(el('p','status','Your review has been recorded. The contractor will follow up about next steps.'));
 }else if(p.status==='sent'){
  const name=inputText('Your full name'),check=el('input');check.type='checkbox';
  const label=el('label','check');add(label,check,document.createTextNode(' I have reviewed the scope, costs, terms and exclusions for revision '+p.revision+'.'));
  const submit=el('button','','Record my approval intent');
  submit.onclick=async()=>{
   submit.disabled=true;
   try{await api('approve',{name:name.value,confirm:check.checked},d.csrf);
    formStatus(response,'Recorded. This does not start work or sign a construction contract.');await refresh();
   }catch(e){formStatus(response,e.message,true)}finally{submit.disabled=false}
  };
  add(response,el('p','small','Please enter your name and check the statement to record your review.'),name,label,submit);
 }
 root.append(response);main.replaceChildren(root);
}
async function refresh(){try{display(await api('current'))}catch(e){if(current)formStatus(main,e.message,true)}}
async function start(){
 const match=location.hash.match(/^#\/invite\/([A-Za-z0-9_-]{30,100})$/);
 if(match){
  try{await api('open',{token:match[1]});history.replaceState(null,'',location.pathname);await refresh();}
  catch(e){document.getElementById('message').textContent=e.message;}
 }else{try{await refresh()}catch{}}
 setInterval(async()=>{if(current)try{const updated=await api('current');if(updated.proposal.status!==current.proposal.status)display(updated)}catch{}},12000);
}
start();

// Next pilot: interactive options for the original garage door REV 2 test.

function garagePilot(d){
 const p=d.proposal;
 if(!p.demo||p.projectRef!=='synthetic-garage-rev2-interactive-pilot')return null;
 const groups=[
  {title:'Exterior door',choices:[['Original six-panel steel door',0],['Smooth insulated steel door — hypothetical upgrade',240]]},
  {title:'Entry hardware',choices:[['Original keyed lockset and deadbolt',0],['Keypad entry lock — hypothetical upgrade',175]]}
 ];
 const panel=section('Compare your garage door options');
 panel.classList.add('configurator');
 panel.append(el('p','scope','This starts with the same 11-line REV 2 garage door and light-switch test proposal and its original finished-view concept.'));
 panel.append(el('p','notice','REV 2 base estimate: $3,801.33. Alternative upgrade prices are NEW SYNTHETIC test assumptions, not approved product prices or the emailed proposal.'));
 const columns=el('div','config-layout'),left=el('div','config-choices'),right=el('aside','config-summary');
 const selected=[0,0];
 for(let gi=0;gi<groups.length;gi++){
  const g=groups[gi],field=el('fieldset','option-group');field.append(el('legend','',g.title));
  g.choices.forEach(([name,cost],ci)=>{
   const label=el('label','option-tile'),radio=el('input'),words=el('span','option-text');
   radio.type='radio';radio.name='garage-'+gi;radio.checked=ci===0;
   words.append(el('strong','',name),el('small','',cost?'Test direct-cost change: +'+money(cost):'Already included'));
   label.append(radio,words);field.append(label);
   radio.addEventListener('change',()=>{selected[gi]=ci;recompute()});
  });left.append(field);
 }
 const summary=el('div','config-totals'),button=el('button','','Send my preferred choices for review'),status=el('p','status');
 right.append(el('p','eyebrow','COST-PLUS COMPARISON'),summary,button,status);

 function recompute(){
  const direct=groups.reduce((sum,g,i)=>sum+g.choices[selected[i]][1],0);
  const reserve=Math.round(direct*10)/100;
  const fee=Math.round((direct+reserve)*15)/100;
  const delta=Math.round((direct+reserve+fee)*100)/100;
  const projected=Math.round((p.total+delta)*100)/100;
  summary.replaceChildren();
  for(const [label,value] of [
   ['Original emailed REV 2',p.total],['Optional direct-cost change',direct],
   ['10% additional planning reserve',reserve],['15% additional fee',fee],['Demo projected total',projected]]){
   const line=el('div','config-row');line.append(el('span','',label),el('strong','',money(value)));summary.append(line);
  }
  summary.append(el('p','small','Illustrative forecast only—not a fixed bid, supplier quote, purchase authorization, or final cost-plus invoice.'));
  return {direct,reserve,fee,delta,projected};
 }
 button.disabled=p.status!=='sent';
 button.onclick=async()=>{
  const values=recompute();
  const selections=groups.map((g,i)=>g.title+': '+g.choices[selected[i]][0]).join('; ');
  const message='REV 2 INTERACTIVE TEST — preferred choices: '+selections+
   '. Demo direct-cost difference '+money(values.direct)+
   ', reserve '+money(values.reserve)+', fee '+money(values.fee)+
   ', projected total '+money(values.projected)+
   '. Please review before issuing a new revision; original REV 2 remains unchanged.';
  button.disabled=true;status.textContent='Recording selection request…';
  try{
   await api('question',{message},d.csrf);
   status.textContent='Saved for contractor review. Your original REV 2 is unchanged.';
  }catch(e){status.textContent='Could not save preferences: '+e.message}
  finally{button.disabled=p.status!=='sent'}
 };
 recompute();
 columns.append(left,right);panel.append(columns);
 return panel;
}
