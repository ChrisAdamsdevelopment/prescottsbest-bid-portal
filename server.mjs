import http from 'node:http';
import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,randomUUID,createHash,timingSafeEqual} from 'node:crypto';
import {maybeServeMarketing} from './marketing/routes.mjs';
import {publicApi} from './marketing/api.mjs';
import {pruneOldLeadPhotos} from './marketing/lead-images.mjs';
import {aiGuideApi} from './marketing/ai-guide.mjs';
import {aiGuideUsage} from './marketing/ai-usage.mjs';
const root=dirname(fileURLToPath(import.meta.url));
const dir=process.env.DATA_DIR||join(root,'.local-data');
const key=process.env.PORTAL_ADMIN_KEY||'';
if(process.env.NODE_ENV==='production'&&(!process.env.DATA_DIR||key.length<32)){
 console.error('Set persistent DATA_DIR and a 32+ character PORTAL_ADMIN_KEY on Render');process.exit(1);
}
const sha=s=>createHash('sha256').update(s).digest('hex');
const rand=()=>randomBytes(32).toString('base64url');
const bad=(msg,status=400)=>Object.assign(new Error(msg),{status});
const text=(v,n=200)=>{if(typeof v!=='string'||!v.trim()||v.length>n)throw bad('Invalid text field');return v.trim()};
const opt=(v,n=2000)=>v==null?'':typeof v==='string'&&v.length<=n?v.trim():(()=>{throw bad('Invalid optional text')})();
const amt=x=>{if(typeof x!=='number'||!Number.isFinite(x)||x<0||x>1e7)throw bad('Invalid cost');return Math.round(x*100)/100};
const eq=(a,b)=>{const x=Buffer.from(sha(String(a))),y=Buffer.from(sha(String(b)));return timingSafeEqual(x,y)};
const file=join(dir,'store.json');
let tail=Promise.resolve();
async function read(){try{const s=JSON.parse(await readFile(file,'utf8'));if(s.version!==1)throw Error('Store version');return s}catch(e){if(e.code==='ENOENT')return {version:1,proposals:{},invites:{},sessions:{},questions:[],audit:[]};throw e}}
async function change(fn){
 const prev=tail;let done;tail=new Promise(r=>done=r);await prev;
 try{const s=await read(),v=await fn(s);await mkdir(dir,{recursive:true});const tmp=file+'.'+randomUUID()+'.tmp';await writeFile(tmp,JSON.stringify(s),{mode:0o600});await rename(tmp,file);return v}finally{done()}
}
function reply(res,status,obj,extra={}){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store',...extra});res.end(JSON.stringify(obj))}
async function input(req,limit=9e6){
 let size=0,parts=[];for await(const b of req){size+=b.length;if(size>limit)throw bad('Request too large',413);parts.push(b)}
 try{return JSON.parse(Buffer.concat(parts).toString('utf8'))}catch{throw bad('Invalid JSON')}
}
function checkPost(req){
 if(!req.headers['content-type']?.startsWith('application/json'))throw bad('JSON content required',415);
 if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)throw bad('Origin not allowed',403);
 if(req.headers['sec-fetch-site']==='cross-site')throw bad('Cross-site request',403);
}
function admin(req){const supplied=(req.headers.authorization||'').replace(/^Bearer /,'');if(key.length<32||!eq(supplied,key))throw bad('Admin authentication required',401)}
function sess(s,req){
 const sid=/(?:^|;\s*)pbc_sid=([^;]+)/.exec(req.headers.cookie||'')?.[1]||'';
 const ss=s.sessions[sha(sid)],invite=ss&&s.invites[ss.invite],p=ss&&s.proposals[ss.id];
 if(!ss||ss.expires<Date.now()||!invite||invite.revoked||invite.expires<Date.now()||!p||p.revision!==ss.revision||p.status==='superseded'||p.status==='revoked')throw bad('Private link expired or unavailable',401);
 return {ss,p};
}
const limiter=new Map();
function limit(req){
 const now=Date.now(),ip=req.socket.remoteAddress+req.url.split('?')[0],r=limiter.get(ip)||{time:now,n:0};
 if(now-r.time>60000){r.n=0;r.time=now}if(++r.n>60)throw bad('Too many requests',429);
 limiter.set(ip,r);if(limiter.size>1000)for(const [k,v]of limiter)if(now-v.time>120000)limiter.delete(k);
}
function parseImage(i){
 const mime=i?.mimeType;
 if(!['image/png','image/jpeg','image/webp'].includes(mime)||!['before','after','reference'].includes(i.kind))throw bad('Unsupported image');
 const label=text(i.label,120),source=i.base64;
 if(typeof source!=='string'||source.length>5_500_000||!/^[A-Za-z0-9+/]+={0,2}$/.test(source))throw bad('Invalid image encoding');
 const data=Buffer.from(source,'base64');if(data.length<10||data.length>4e6)throw bad('Image size');
 const png=data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const jpg=data[0]===255&&data[1]===216&&data[2]===255;
 const webp=data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP';
 if((mime==='image/png'&&!png)||(mime==='image/jpeg'&&!jpg)||(mime==='image/webp'&&!webp))throw bad('Image format mismatch');
 return {id:randomUUID(),kind:i.kind,label,mimeType:mime,buf:data};
}
function validate(v){
 const title=text(v.title,160),revision=text(v.revision,60),scope=text(v.scope,3500),terms=text(v.terms,3500);
 const location=opt(v.location,180),customerName=opt(v.customerName,150),projectRef=opt(v.projectRef,100);
 if(!['cost_plus','fixed'].includes(v.mode))throw bad('Pricing mode');
 if(!Array.isArray(v.items)||!v.items.length||v.items.length>50)throw bad('Line items required');
 const items=v.items.map(x=>({label:text(x.label,160),amount:amt(x.amount)}));
 const direct=amt(v.direct),contingency=amt(v.contingency),fee=amt(v.fee),total=amt(v.total);
 if(Math.abs(direct+contingency+fee-total)>.02)throw bad('Cost totals do not reconcile');
 if(!Number.isInteger(v.expiresInDays)||v.expiresInDays<1||v.expiresInDays>90)throw bad('Expiration out of range');
 const photos=(v.photos||[]).map(parseImage);
 if(photos.length>4)throw bad('Maximum four images');
 return {title,revision,scope,terms,location,customerName,projectRef,mode:v.mode,items,direct,contingency,fee,total,photos,demo:v.demo===true,expiresInDays:v.expiresInDays};
}
function security(res){
 res.setHeader('X-Frame-Options','DENY');res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
 res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'");
}
async function route(req,res){
 security(res);const path=new URL(req.url,'http://localhost').pathname;
 if(path==='/healthz')return reply(res,200,{status:'ok',service:'pbc-private-portal'});
 if(await maybeServeMarketing(req,res,path,{root,readFile,bad}))return;
 if(req.method==='GET'&&['/','/proposal','/app.js','/style.css'].includes(path)){
  const fn=path==='/'||path==='/proposal'?'index.html':path.slice(1),type=path==='/'||path==='/proposal'?'text/html':path.endsWith('.js')?'application/javascript':'text/css';
  res.writeHead(200,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store',...(type==='text/html'?{'X-Robots-Tag':'noindex,nofollow'}:{})});return res.end(await readFile(join(root,'public',fn)));
 }
 if(!path.startsWith('/api/'))throw bad('Not found',404);
 limit(req);if(req.method==='POST')checkPost(req);
 if(path==='/api/public/ai-guide'||path==='/api/public/ai-guide/status')return aiGuideApi(req,res,path,{input,reply,bad});
 if(path.startsWith('/api/public/')||path==='/api/admin/leads'||path==='/api/admin/analytics'||path.startsWith('/api/admin/lead-photo/'))return publicApi(req,res,path,{input,read,change,reply,bad,admin});
 if(req.method==='POST'&&path==='/api/admin/publish'){
  admin(req);const v=validate(await input(req));
  const id=randomUUID(),now=Date.now(),expires=now+v.expiresInDays*86400000,invite=rand();
  const result=await change(async s=>{
   await mkdir(join(dir,'images'),{recursive:true});
   const photos=[];
   if(v.projectRef){for(const old of Object.values(s.proposals))if(old.projectRef===v.projectRef&&old.status!=='revoked'){
     if(old.revision===v.revision)throw bad('Revision already published',409);
     old.status='superseded';for(const invitation of Object.values(s.invites))if(invitation.id===old.id)invitation.revoked=true;
   }}
   for(const p of v.photos){
    const ext=p.mimeType==='image/png'?'.png':p.mimeType==='image/jpeg'?'.jpg':'.webp';
    await writeFile(join(dir,'images',p.id+ext),p.buf,{flag:'wx',mode:0o600});
    photos.push({id:p.id,kind:p.kind,label:p.label,mimeType:p.mimeType});
   }
   const {expiresInDays,...rest}=v;delete rest.photos;
   const proposal={id,...rest,photos,status:'sent',createdAt:new Date(now).toISOString(),
     expiresAt:new Date(expires).toISOString(),revisionHash:sha(JSON.stringify({...rest,photos}))};
   s.proposals[id]=proposal;s.invites[sha(invite)]={id,revision:proposal.revision,expires,revoked:false};
   s.audit.push({type:'publish',id,revision:proposal.revision,at:proposal.createdAt});
   return {id,revision:proposal.revision,expiresAt:proposal.expiresAt,linkFragment:'#/invite/'+invite};
  });
  return reply(res,201,result);
 }
 if(req.method==='GET'&&path==='/api/admin/proposals'){
  admin(req);const s=await read();return reply(res,200,{proposals:Object.values(s.proposals),questions:s.questions,audit:s.audit.slice(-100)});
 }
 if(req.method==='POST'&&path==='/api/admin/revoke'){
  admin(req);const b=await input(req,1000);
  const v=await change(s=>{
   if(!s.proposals[b.id])throw bad('Unknown proposal',404);
   s.proposals[b.id].status='revoked';
   for(const x of Object.values(s.invites))if(x.id===b.id)x.revoked=true;
   s.audit.push({type:'revoke',id:b.id,at:new Date().toISOString()});return {revoked:true};
  });return reply(res,200,v);
 }
 if(req.method==='POST'&&path==='/api/open'){
  const b=await input(req,1000),invHash=sha(text(b.token,150));
  const out=await change(s=>{
   const inv=s.invites[invHash],p=inv&&s.proposals[inv.id];
   if(!inv||!p||inv.revoked||inv.expires<Date.now()||p.status==='revoked')throw bad('Link not available',403);
   const sid=rand(),csrf=rand();
   s.sessions[sha(sid)]={id:p.id,revision:p.revision,invite:invHash,csrf,expires:Math.min(Date.now()+43200000,inv.expires)};
   return {sid,expiresAt:new Date(inv.expires).toISOString()};
  });
  const cookie='pbc_sid='+out.sid+'; HttpOnly; Path=/; SameSite=Strict'+(process.env.NODE_ENV==='production'?'; Secure':'');
  return reply(res,200,{ok:true,expiresAt:out.expiresAt},{'Set-Cookie':cookie});
 }
 if(req.method==='GET'&&path==='/api/current'){
  const s=await read(),{ss,p}=sess(s,req);
  return reply(res,200,{proposal:p,csrf:ss.csrf,questions:s.questions.filter(q=>q.id===p.id).map(q=>({message:q.message,at:q.at}))});
 }
 if(req.method==='GET'&&path.startsWith('/api/image/')){
  const s=await read(),{p}=sess(s,req),img=p.photos.find(x=>x.id===path.split('/')[3]);
  if(!img)throw bad('Photo unavailable',404);
  const ext=img.mimeType==='image/png'?'.png':img.mimeType==='image/jpeg'?'.jpg':'.webp';
  res.writeHead(200,{'Content-Type':img.mimeType,'Cache-Control':'private, no-store'});
  return res.end(await readFile(join(dir,'images',img.id+ext)));
 }
 if(req.method==='POST'&&(path==='/api/approve'||path==='/api/question')){
  const b=await input(req,1800);
  const out=await change(s=>{
   const {ss,p}=sess(s,req);
   if(!eq(req.headers['x-csrf-token']||'',ss.csrf))throw bad('CSRF token required',403);
   if(path==='/api/question'){
    const message=text(b.message,850);
    s.questions.push({id:p.id,at:new Date().toISOString(),message});
    s.audit.push({type:'question',id:p.id,at:new Date().toISOString()});
    return {ok:true};
   }
   if(b.confirm!==true)throw bad('Explicit confirmation required');
   const name=text(b.name,120);
   if(p.status==='customer_reviewed')return {status:p.status,alreadyRecorded:true};
   if(p.status!=='sent')throw bad('Revision unavailable',409);
   p.status='customer_reviewed';p.approval={name,at:new Date().toISOString(),revision:p.revision,
    notice:'Customer expressed review/approval intent; a signed agreement and contractor acceptance remain separate.'};
   s.audit.push({type:'customer_reviewed',id:p.id,at:p.approval.at});
   return {status:p.status,at:p.approval.at};
  });return reply(res,200,out);
 }
 throw bad('Not found',404);
}
const photoCleanup=setInterval(()=>pruneOldLeadPhotos().catch(()=>{}),6*60*60*1000);
photoCleanup.unref();
pruneOldLeadPhotos().catch(()=>{});
const server=http.createServer((req,res)=>route(req,res).catch(e=>{
 if(!res.headersSent)reply(res,e.status||500,{error:e.status?e.message:'Server error'});
 else res.end();
 if(!e.status)console.error('[portal]',e.message);
}));
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])server.listen(Number(process.env.PORT||10000),'0.0.0.0',()=>console.log('PBC portal ready'));
export {server};
