import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {request as httpRequest} from 'node:http';
import {setTimeout as pause} from 'node:timers/promises';
import {canonicalMarketingRedirect,primaryOrigin} from '../marketing/domain-migration.mjs';

const r=(method,host,url)=>canonicalMarketingRedirect({method,headers:{host},url},new URL(url,'http://localhost').pathname);

test('old remodeling host 301s directly to matching primary host path and preserves query',()=>{
 assert.equal(primaryOrigin,'https://prescottsbestconstruction.com');
 for(const host of ['prescottsbestremodeling.com','www.prescottsbestremodeling.com']){
  assert.equal(r('GET',host,'/'),primaryOrigin+'/');
  assert.equal(r('GET',host,'/bathroom-remodeling?utm_source=yard-sign'),primaryOrigin+'/bathroom-remodeling?utm_source=yard-sign');
  assert.equal(r('HEAD',host,'/kitchen-remodeling'),primaryOrigin+'/kitchen-remodeling');
  assert.equal(r('GET',host,'/contact?source=email'),primaryOrigin+'/schedule?source=email');
  assert.equal(r('GET',host,'/remodeling-preview/room-conversions?q=garage'),primaryOrigin+'/room-conversions?q=garage');
  for(const p of ['/api/public/site-status','/api/admin/leads','/proposal','/healthz']){
   assert.equal(r('GET',host,p),null,'private/health route '+p);
  }
  assert.equal(r('POST',host,'/api/public/inquiry'),null);
 }
});
test('construction and Render origin never redirect into a loop',()=>{
 for(const host of ['prescottsbestconstruction.com','www.prescottsbestconstruction.com','spectracleanse-ai.onrender.com','127.0.0.1:18000']){
  for(const path of ['/','/bathroom-remodeling','/sitemap.xml','/schedule']){
   assert.equal(r('GET',host,path),null,host+path);
  }
 }
});

test('live-local host switching, canonicals, sitemap and private portal survive',async()=>{
 const root=resolve(import.meta.dirname,'..');
 const data=await mkdtemp(join(tmpdir(),'pbc-canonical-migration-'));
 const port=19500+Math.floor(Math.random()*350);
 const server=spawn(process.execPath,['server.mjs'],{cwd:root,env:{
  ...process.env,NODE_ENV:'development',PORT:String(port),DATA_DIR:data,SITE_INDEXABLE:'true',
  PORTAL_ADMIN_KEY:'TESTONLYlocaltoken-12345678901234567890',RESEND_API_KEY:'',LEAD_FORM_ENABLED:'false'
 },stdio:'ignore'});
 const request=(host,path,method='GET')=>new Promise((resolve,reject)=>{
  const req=httpRequest({hostname:'127.0.0.1',port,method,path,headers:{host}},res=>{
   const parts=[];res.on('data',c=>parts.push(c));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(parts).toString('utf8')}));
  });req.on('error',reject);req.end();
 });
 try{
  for(let i=0;i<80;i++){
   try{if((await request('127.0.0.1','/healthz')).status===200)break;}catch{}
   await pause(80);
  }
  const old=await request('prescottsbestremodeling.com','/bathroom-remodeling?source=old-link');
  assert.equal(old.status,301);assert.equal(old.headers.location,primaryOrigin+'/bathroom-remodeling?source=old-link');
  assert.match(old.headers['cache-control'],/max-age=300/);
  const oldWww=await request('www.prescottsbestremodeling.com','/');
  assert.equal(oldWww.status,301);assert.equal(oldWww.headers.location,primaryOrigin+'/');
  const oldAsset=await request('prescottsbestremodeling.com','/site-assets/pbc-logo.webp');
  assert.equal(oldAsset.status,301);assert.equal(oldAsset.headers.location,primaryOrigin+'/site-assets/pbc-logo.webp');
  // HEAD must reflect page availability for crawlers and uptime checks.
  for(const route of ['/', '/bathroom-remodeling', '/robots.txt', '/sitemap.xml', '/site-assets/pbc-logo.webp']){
   const response=await request('prescottsbestconstruction.com',route,'HEAD');
   assert.equal(response.status,200,'HEAD '+route);
   assert.equal(response.body,'','HEAD body '+route);
  }
  const privateHead=await request('spectracleanse-ai.onrender.com','/proposal','HEAD');
  assert.equal(privateHead.status,200);assert.equal(privateHead.body,'');
  const oldHead=await request('prescottsbestremodeling.com','/bathroom-remodeling','HEAD');
  assert.equal(oldHead.status,301);assert.equal(oldHead.headers.location,primaryOrigin+'/bathroom-remodeling');
  const home=await request('prescottsbestconstruction.com','/');
  assert.equal(home.status,200);assert.match(home.body,/Good remodeling starts with listening/);
  assert.match(home.body,/rel="canonical" href="https:\/\/prescottsbestconstruction\.com\/"/);
  assert.doesNotMatch(home.body,/rel="canonical" href="https:\/\/prescottsbestremodeling\.com/);
  const bath=await request('prescottsbestconstruction.com','/bathroom-remodeling');
  assert.equal(bath.status,200);
  assert.match(bath.body,/rel="canonical" href="https:\/\/prescottsbestconstruction\.com\/bathroom-remodeling"/);
  const www=await request('www.prescottsbestconstruction.com','/');
  assert.equal(www.status,200);
  assert.match(www.body,/rel="canonical" href="https:\/\/prescottsbestconstruction\.com\/"/);
  const sitemap=await request('prescottsbestconstruction.com','/sitemap.xml');
  assert.equal(sitemap.status,200);
  assert.match(sitemap.body,/<loc>https:\/\/prescottsbestconstruction\.com\/bathroom-remodeling<\/loc>/);
  assert.doesNotMatch(sitemap.body,/prescottsbestremodeling\.com/);
  const oldSitemap=await request('prescottsbestremodeling.com','/sitemap.xml');
  assert.equal(oldSitemap.status,301);assert.equal(oldSitemap.headers.location,primaryOrigin+'/sitemap.xml');
  const robots=await request('prescottsbestconstruction.com','/robots.txt');
  assert.equal(robots.status,200);assert.match(robots.body,/Sitemap: https:\/\/prescottsbestconstruction\.com\/sitemap\.xml/);
  const feed=await request('prescottsbestconstruction.com','/feed.xml');
  assert.equal(feed.status,200);assert.match(feed.body,/https:\/\/prescottsbestconstruction\.com\/blog/);
  const portal=await request('spectracleanse-ai.onrender.com','/');
  assert.equal(portal.status,200);assert.match(portal.body,/Private Proposal/);
  const proposal=await request('spectracleanse-ai.onrender.com','/proposal');
  assert.equal(proposal.status,200);assert.match(proposal.body,/Private Proposal/);
  const health=await request('prescottsbestremodeling.com','/healthz');
  assert.equal(health.status,200);
  const oldApi=await request('prescottsbestremodeling.com','/api/public/site-status');
  assert.equal(oldApi.status,200);
 }finally{
  server.kill();
  await rm(data,{recursive:true,force:true});
 }
});
