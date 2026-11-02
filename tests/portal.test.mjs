import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {setTimeout as pause} from 'node:timers/promises';
const root=resolve(import.meta.dirname,'..');
const demo=JSON.parse(await readFile(join(root,'examples','demo-proposal.json'),'utf8'));
const img='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==';
test('private proposal deployment flow and isolation',async()=>{
 const tmp=await mkdtemp(join(tmpdir(),'pbc-portal-test-'));
 const port=17000+Math.floor(Math.random()*1000);
 const url='http://127.0.0.1:'+port;
 const key='super-private-test-only-admin-key-123456789';
 let child;
 async function launch(){
  child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:String(port),DATA_DIR:tmp,PORTAL_ADMIN_KEY:key},stdio:'ignore'});
  for(let i=0;i<65;i++){try{const r=await fetch(url+'/healthz');if(r.ok)return;}catch{}await pause(80);}
  throw Error('Test server failed to start');
 }
 async function request(path,method='GET',payload=null,headers={}){
  const r=await fetch(url+path,{method,headers:{...(payload?{'Content-Type':'application/json'}:{}),...headers},
   ...(payload?{body:JSON.stringify(payload)}:{})});
  const contentType=r.headers.get('content-type')||'';
  return {status:r.status,body:contentType.includes('application/json')?await r.json():await r.arrayBuffer(),cookie:r.headers.get('set-cookie')};
 }
 const auth={'Authorization':'Bearer '+key};
 try{
  await launch();
  const anon=await request('/api/admin/proposals');
  assert.equal(anon.status,401);
  let current=await request('/api/current');assert.equal(current.status,401);
  let created=await request('/api/admin/publish','POST',{...demo,photos:[{kind:'after',label:'Realistic door concept',mimeType:'image/png',base64:img}]},auth);
  assert.equal(created.status,201,JSON.stringify(created.body));
  assert.ok(created.body.linkFragment.startsWith('#/invite/'));
  assert.ok(!JSON.stringify(created.body).includes('super-private'));
  const invalid=await request('/api/open','POST',{token:'random-wrong-token'});
  assert.equal(invalid.status,403);
  const opened=await request('/api/open','POST',{token:created.body.linkFragment.split('/').at(-1)});
  assert.equal(opened.status,200);
  assert.ok(opened.cookie.includes('HttpOnly'));
  const cookie=opened.cookie.split(';')[0];
  current=await request('/api/current','GET',null,{Cookie:cookie});
  assert.equal(current.body.proposal.total,3801.33);
  const visual=current.body.proposal.photos[0];
  const noauthImage=await request('/api/image/'+visual.id);
  assert.equal(noauthImage.status,401);
  const photo=await request('/api/image/'+visual.id,'GET',null,{Cookie:cookie});
  assert.equal(photo.status,200);
  const wrongCsrf=await request('/api/approve','POST',{name:'Synthetic Test',confirm:true},{Cookie:cookie,'X-CSRF-Token':'invalid'});
  assert.equal(wrongCsrf.status,403);
  const question=await request('/api/question','POST',{message:'Do the door finishes match?'},{Cookie:cookie,'X-CSRF-Token':current.body.csrf});
  assert.equal(question.status,200);
  const missingName=await request('/api/approve','POST',{name:'',confirm:true},{Cookie:cookie,'X-CSRF-Token':current.body.csrf});
  assert.equal(missingName.status,400);
  const accepted=await request('/api/approve','POST',{name:'Synthetic Test Reviewer',confirm:true},{Cookie:cookie,'X-CSRF-Token':current.body.csrf});
  assert.equal(accepted.status,200);
  assert.equal(accepted.body.status,'customer_reviewed');
  const repeat=await request('/api/approve','POST',{name:'Synthetic Test Reviewer',confirm:true},{Cookie:cookie,'X-CSRF-Token':current.body.csrf});
  assert.equal(repeat.body.alreadyRecorded,true);
  const staff=await request('/api/admin/proposals','GET',null,auth);
  assert.equal(staff.body.questions.length,1);
  assert.equal(staff.body.proposals[0].approval.name,'Synthetic Test Reviewer');
  child.kill();await pause(170);
  await launch();
  const persisted=await request('/api/current','GET',null,{Cookie:cookie});
  assert.equal(persisted.body.proposal.status,'customer_reviewed');
  const revoked=await request('/api/admin/revoke','POST',{id:created.body.id},auth);
  assert.equal(revoked.status,200);
  const invalidated=await request('/api/current','GET',null,{Cookie:cookie});
  assert.equal(invalidated.status,401);
  const badTotal=await request('/api/admin/publish','POST',{...demo,total:1},auth);
  assert.equal(badTotal.status,400);
 }finally{if(child)child.kill();await rm(tmp,{recursive:true,force:true});}
});
