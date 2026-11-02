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
 current=d;const p=d.proposal,root=el('div');
 const intro=el('div','hero'),left=el('div'),right=el('div','details');
 add(left,el('div','eyebrow','PROJECT PROPOSAL • '+p.revision),el('h1','',p.title),
    el('p','lead',p.location||'Prescott Valley and the Quad Cities'));
 add(right,el('small','',''+(p.mode==='cost_plus'?'OPEN-BOOK COST PLUS':'FIXED-PRICE PROPOSAL')),
    el('div','stat',money(p.total)),el('small','','Proposal valid until '+new Date(p.expiresAt).toLocaleDateString()));
 add(intro,left,right);root.append(intro);
 const photoCard=section('Your space. Your proposed transformation.');
 add(photoCard,el('p','small','Realistic AI design concepts based on site conditions. Product details, measurements, engineering and code compliance must be confirmed.'));
 const photos=el('div','photos');
 for(const photo of p.photos||[]){
  const fig=el('figure','photo'),image=el('img'),caption=el('figcaption');
  image.src='/api/image/'+encodeURIComponent(photo.id);
  image.alt=photo.label;
  image.loading='lazy';
  add(caption,document.createTextNode((photo.kind==='after'?'PROPOSED · ':'SITE · ')+photo.label),
     el('div','captionnote',photo.kind==='after'?'AI-generated illustration • not built yet':'Reference condition'));
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
 add(columns,scope,cost);root.append(columns);
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
