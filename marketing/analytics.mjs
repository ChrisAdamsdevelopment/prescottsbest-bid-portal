// First-party, consent-based website telemetry. No IP addresses, email addresses, form contents,
// exact geolocation, URL query strings, or full referrer URLs are persisted.
import {appendFile,mkdir,readFile,readdir,stat,rm} from 'node:fs/promises';
import {join} from 'node:path';
const types=new Set(['page_view','scroll','engagement','cta_click','form_start','form_submit','form_error','budget_complete','storm_checklist','photo_select','ai_question']);
const sessionPattern=/^[a-f0-9-]{36}$/i;
const clean=(value,max=90)=>typeof value==='string'?value.slice(0,max).replace(/[^a-zA-Z0-9._:/-]/g,''):'';
const pathValue=value=>typeof value==='string'&&value.startsWith('/')&&!value.startsWith('//')?clean(value.split(/[?#]/)[0],160):'/';
const base=()=>join(process.env.DATA_DIR||join(process.cwd(),'.local-data'),'analytics');
let pending=Promise.resolve();
let lastCleanup=0;
const DAY=86_400_000;
const dateStamp=at=>new Date(at).toISOString().slice(0,10);
const safeDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(s);
const ageDays=(days)=>Math.max(1,Math.min(30,Number(days)||7));
function normalize(e,serverTime){
 if(!e||typeof e!=='object'||!types.has(e.type)||!sessionPattern.test(e.session||''))return null;
 const output={
  at:serverTime,type:e.type,session:e.session.toLowerCase(),path:pathValue(e.path),
  source:clean(e.source,60).toLowerCase(),ref:clean(e.ref,90).toLowerCase(),
  device:['mobile','tablet','desktop'].includes(e.device)?e.device:'unknown',
  tz:clean(e.tz,65),locale:clean(e.locale,12),
  ms:e.type==='engagement'&&Number.isFinite(e.ms)?Math.max(0,Math.min(60_000,Math.round(e.ms))):0,
  depth:e.type==='scroll'&&[25,50,75,90].includes(e.depth)?e.depth:0,
  action:['contact','phone','email','external','budget','other'].includes(e.action)?e.action:'other'
 };
 return output;
}
async function cleanup(root){
 if(Date.now()-lastCleanup<DAY)return;
 lastCleanup=Date.now();
 try{
  for(const f of await readdir(root)){
   const match=/^events-(\d{4}-\d{2}-\d{2})\.jsonl$/.exec(f);
   if(!match||!safeDay(match[1]))continue;
   if(Date.now()-new Date(match[1]+'T00:00:00Z').getTime()>45*DAY)await rm(join(root,f),{force:true});
  }
 }catch{}
}
export async function recordAnalytics(body){
 if(body?.consent!==true||!Array.isArray(body.events)||body.events.length>15)return {accepted:0};
 const now=Date.now();
 const events=body.events.map(e=>normalize(e,now)).filter(Boolean);
 if(!events.length)return {accepted:0};
 const work=async()=>{
  const root=base();await mkdir(root,{recursive:true,mode:0o700});
  const file=join(root,'events-'+dateStamp(now)+'.jsonl');
  let bytes=0;try{bytes=(await stat(file)).size;}catch(e){if(e.code!=='ENOENT')throw e;}
  if(bytes>3_000_000)return;
  await appendFile(file,events.map(e=>JSON.stringify(e)).join('\n')+'\n',{encoding:'utf8',mode:0o600});
  await cleanup(root);
 };
 const task=pending.then(work,work);pending=task.catch(()=>{});await task;
 return {accepted:events.length};
}
async function readEvents(days){
 await pending;
 const root=base(),now=Date.now(),cutoff=now-ageDays(days)*DAY;
 const events=[];
 for(let offset=0;offset<=ageDays(days);offset++){
  const day=dateStamp(now-offset*DAY);
  let contents;
  try{contents=await readFile(join(root,'events-'+day+'.jsonl'),'utf8');}catch(e){if(e.code==='ENOENT')continue;throw e;}
  // Do not hold unlimited traffic data in RAM. One day's file is bounded by upload rate limits.
  for(const line of contents.split('\n')){
   if(!line)continue;
   try{const e=JSON.parse(line);if(e.at>=cutoff&&e.at<=now+1000)events.push(e);}catch{}
  }
 }
 return events;
}
export async function analyticsSummary({days=7,leads=[]}={}){
 days=ageDays(days);const events=await readEvents(days),now=Date.now(),cutoff=now-days*DAY;
 const sessions=new Set(),active=new Set(),byPage=new Map(),bySource=new Map(),byDevice=new Map(),byZone=new Map(),byDay=new Map(),byEvent=new Map();
 const initPage=path=>({path,views:0,engagedSeconds:0,scroll75:0,contactClicks:0});
 const inc=(map,key,amount=1)=>map.set(key,(map.get(key)||0)+amount);
 let viewCount=0,activeSeconds=0;
 for(const e of events){
  sessions.add(e.session);
  if(e.at>now-5*60*1000)active.add(e.session);
  inc(byEvent,e.type);
  const page=byPage.get(e.path)||initPage(e.path);
  if(e.type==='page_view'){
   viewCount++;page.views++;inc(bySource,e.source||e.ref||'direct / unknown');inc(byDevice,e.device);inc(byZone,e.tz||'unknown');
   const d=dateStamp(e.at),current=byDay.get(d)||{day:d,views:0,engagedSeconds:0};current.views++;byDay.set(d,current);
  }
  if(e.type==='engagement'){
   const secs=e.ms/1000;activeSeconds+=secs;page.engagedSeconds+=secs;
   const d=dateStamp(e.at),current=byDay.get(d)||{day:d,views:0,engagedSeconds:0};current.engagedSeconds+=secs;byDay.set(d,current);
  }
  if(e.type==='scroll'&&e.depth===75)page.scroll75++;
  if(e.type==='cta_click'&&(e.action==='contact'||e.action==='phone'||e.action==='email'))page.contactClicks++;
  byPage.set(e.path,page);
 }
 const lastLeads=leads.filter(l=>Date.parse(l.createdAt||'')>=cutoff);
 const leadsBySource=new Map(),leadsByProject=new Map(),leadsByArea=new Map();
 for(const lead of lastLeads){
  inc(leadsBySource,clean(lead.referral?.source,60).toLowerCase()||'direct / unknown');
  inc(leadsByProject,clean(lead.project,90)||'other');inc(leadsByArea,clean(lead.area,70)||'not supplied');
 }
 const top=(map,limit)=>[...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([name,count])=>({name,count}));
 return {
  generatedAt:new Date(now).toISOString(),days,
  scope:'Consent-based first-party browser events; lead counts include all recorded contact inquiries.',
  privacy:{exactLocationTracked:false,anonymousEmailTracking:false,anonymousIPStored:false,consentRequired:true},
  totals:{pageViews:viewCount,observedSessions:sessions.size,activeSessions5m:active.size,
   engagedSeconds:Math.round(activeSeconds),avgEngagedSecondsPerView:viewCount?Math.round(activeSeconds/viewCount):0,
   leadRequests:lastLeads.length,formStarts:byEvent.get('form_start')||0,formSubmits:byEvent.get('form_submit')||0,
   budgetCompletions:byEvent.get('budget_complete')||0,stormChecklists:byEvent.get('storm_checklist')||0,
   contactClicks:[...byPage.values()].reduce((s,x)=>s+x.contactClicks,0)},
  pages:[...byPage.values()].sort((a,b)=>b.views-a.views).slice(0,30).map(p=>({...p,engagedSeconds:Math.round(p.engagedSeconds),avgEngagedSeconds:p.views?Math.round(p.engagedSeconds/p.views):0})),
  sources:top(bySource,20),devices:top(byDevice,10),browserTimezones:top(byZone,15),events:top(byEvent,25),
  daily:[...byDay.values()].sort((a,b)=>a.day.localeCompare(b.day)).map(x=>({...x,engagedSeconds:Math.round(x.engagedSeconds)})),
  leadSources:top(leadsBySource,20),leadProjects:top(leadsByProject,15),leadAreas:top(leadsByArea,15)
 };
}
