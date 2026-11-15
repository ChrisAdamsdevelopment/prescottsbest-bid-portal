import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {request as httpRequest} from 'node:http';
import {createServer} from 'node:net';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {setTimeout as pause} from 'node:timers/promises';

const root=resolve(import.meta.dirname,'..');
async function freePort(){
 const server=createServer();
 await new Promise((ok,fail)=>server.once('error',fail).listen(0,'127.0.0.1',ok));
 const port=server.address().port;
 await new Promise(ok=>server.close(ok));
 return port;
}
function request(port,path,host){
 return new Promise((resolve,reject)=>{
  const req=httpRequest({hostname:'127.0.0.1',port,path,headers:{Host:host},timeout:4500},res=>{
   const chunks=[];
   res.on('data',b=>chunks.push(b));
   res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks).toString('utf8')}));
  });
  req.on('error',reject);req.end();
 });
}
test('legacy www and apex paths permanently redirect to live relevant pages with query preserved',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'pbc-gsc-legacy-'));
 const port=await freePort();
 const proc=spawn(process.execPath,['server.mjs'],{cwd:root,env:{
  ...process.env,PORT:String(port),DATA_DIR:dir,
  PORTAL_ADMIN_KEY:'local-only-pbc-test-admin-secret-123456789',
  NODE_ENV:'development',LEAD_FORM_ENABLED:'false',SITE_INDEXABLE:'false',
  PUBLIC_AI_ENABLED:'false',RESEND_API_KEY:''
 },stdio:'ignore'});
 try{
  let healthy=false;
  for(let i=0;i<100;i++){
   try{const r=await request(port,'/healthz','127.0.0.1');if(r.status===200){healthy=true;break}}catch{}
   await pause(90);
  }
  assert.ok(healthy,'local application server started');
  for(const host of ['www.prescottsbestconstruction.com','prescottsbestconstruction.com']){
   for(const [oldPath,expected] of [
    ['/concierge-maintenance','/concierge'],
    ['/services','/#services'],
    ['/concierge-maintenance?ref=old-wix','/concierge?ref=old-wix'],
    ['/services?ref=old-wix','/?ref=old-wix#services']
   ]){
    const response=await request(port,oldPath,host);
    assert.equal(response.status,301,host+oldPath);
    assert.equal(response.headers.location,'https://prescottsbestconstruction.com'+expected,host+oldPath);
    assert.match(response.headers['cache-control'],/max-age=300/);
    assert.equal(response.body,'');
   }
  }
  for(const [path,marker] of [['/','id="services"'],['/concierge','Smaller']]){
   const response=await request(port,path,'prescottsbestconstruction.com');
   assert.equal(response.status,200,path);
   assert.ok(response.body.includes(marker),path+' contains actual replacement content');
  }
  const verification=await request(port,'/google8f94b7995e1d2447.html','prescottsbestconstruction.com');
  assert.equal(verification.status,200,'canonical URL-prefix property proof is served at site root');
  assert.match(verification.headers['content-type'],/text\/html/);
  assert.equal(verification.body.trim(),'google-site-verification: google8f94b7995e1d2447.html');
  const preview=await request(port,'/services','localhost');
  assert.equal(preview.status,404,'private/nonmarketing hostname does not gain a redirect');
 }finally{
  proc.kill();
  await pause(200);
  await rm(dir,{recursive:true,force:true});
 }
});
