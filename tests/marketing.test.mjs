import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {setTimeout as pause} from 'node:timers/promises';
const root=resolve(import.meta.dirname,'..');
test('senior-friendly preview, deterministic budget and company lead routing',async()=>{
 const tmp=await mkdtemp(join(tmpdir(),'pbc-web-preview-test-'));
 const port=18700+Math.floor(Math.random()*200);
 const rootURL='http://127.0.0.1:'+port;
 const key='demo-admin-secret-not-real-abcdef1234567890';
 const proc=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:String(port),
  NODE_ENV:'development',DATA_DIR:tmp,PORTAL_ADMIN_KEY:key,LEAD_FORM_ENABLED:'true',SITE_INDEXABLE:'false',
  RESEND_API_KEY:'',LEAD_FROM_EMAIL:''},stdio:'ignore'});
 async function call(url,method='GET',payload=null,auth=false){
  const response=await fetch(rootURL+url,{method,headers:{
   ...(payload?{'Content-Type':'application/json'}:{}),
   ...(auth?{Authorization:'Bearer '+key}:{})},...(payload?{body:JSON.stringify(payload)}:{})});
  const type=response.headers.get('content-type')||'';
  return {status:response.status,headers:response.headers,
    body:type.includes('application/json')?await response.json():await response.text()};
 }
 try{
  for(let i=0;i<65;i++){try{if((await fetch(rootURL+'/healthz')).ok)break;}catch{}await pause(75);}
  const home=await call('/remodeling-preview');
  assert.equal(home.status,200);
  assert.match(home.body,/Prescott.*Best/);
  assert.match(home.body,/Bathroom remodeling/i);
  assert.match(home.body,/site-assets\/pbc-logo.webp/);
  assert.match(home.headers.get('x-robots-tag'),/noindex/);
  const logo=await fetch(rootURL+'/site-assets/pbc-logo.webp');
  assert.equal(logo.status,200);
  assert.equal(logo.headers.get('content-type'),'image/webp');
  const pricePage=await call('/remodeling-preview/estimate');
  assert.equal(pricePage.status,200);
  assert.match(pricePage.body,/RESEARCH DEMONSTRATION/i);
  const sample={project:'bath-full',size:'medium',finish:'standard',condition:'straightforward'};
  const one=await call('/api/public/budget','POST',sample);
  const two=await call('/api/public/budget','POST',sample);
  assert.deepEqual(one.body,two.body);
  assert.equal(one.body.planningDirectCosts.low,14000);
  assert.equal(one.body.costPlus.low,16100);
  assert.equal(one.body.fixed.high,43800);
  assert.match(one.body.disclaimer,/NOT PRESCOTT/);
  const invalid=await call('/api/public/budget','POST',{project:'unknown'});
  assert.equal(invalid.status,400);
  const noConsent=await call('/api/public/inquiry','POST',{name:'Test User',email:'test@example.org',project:'Bathroom remodeling',consent:false});
  assert.equal(noConsent.status,400);
  const lead={name:'TEST PERSON',email:'demo@example.org',phone:'',project:'Bathroom remodeling',
   notes:'SYNTHETIC QA ONLY',consent:true,requestId:'synthetic-unique-request-00000001'};
  const added=await call('/api/public/inquiry','POST',lead);
  assert.equal(added.status,202);
  assert.match(added.body.reference,/^PBC-/);
  const repeated=await call('/api/public/inquiry','POST',lead);
  assert.equal(repeated.body.reference,added.body.reference);
  assert.equal((await call('/api/admin/leads')).status,401);
  const staff=await call('/api/admin/leads','GET',null,true);
  assert.equal(staff.body.leads.length,1);
  assert.equal(staff.body.notificationTo,'chris@prescottsbestconstruction.com');
  assert.equal(staff.body.leads[0].notification.status,'pending');
  assert.equal((await call('/')).status,200);
  assert.match((await call('/')).body,/Private Proposal/);
  assert.equal((await call('/robots.txt')).body,'User-agent: *\nDisallow: /\n');
  console.log('PASS: noindex marketing preview + logo, deterministic budget, fixed-vs-costplus, consent, dedupe, staff-only lead storage and Chris destination');
 }finally{proc.kill();await pause(130);await rm(tmp,{force:true,recursive:true});}
});
