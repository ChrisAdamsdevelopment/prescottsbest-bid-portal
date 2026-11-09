import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {request as httpRequest} from 'node:http';
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
  NODE_ENV:'development',DATA_DIR:tmp,PORTAL_ADMIN_KEY:key,LEAD_FORM_ENABLED:'true',SITE_INDEXABLE:'false',PUBLIC_AI_ENABLED:'false',
  RESEND_API_KEY:'',LEAD_FROM_EMAIL:''},stdio:'ignore'});
 async function call(url,method='GET',payload=null,auth=false){
  const response=await fetch(rootURL+url,{method,headers:{
   ...(payload?{'Content-Type':'application/json'}:{}),
   ...(auth?{Authorization:'Bearer '+key}:{})},...(payload?{body:JSON.stringify(payload)}:{})});
  const type=response.headers.get('content-type')||'';
  return {status:response.status,headers:response.headers,
    body:type.includes('application/json')?await response.json():await response.text()};
 }
 async function hostCall(path,host){
  return await new Promise((resolve,reject)=>{
   const req=httpRequest(rootURL+path,{headers:{Host:host}},res=>{
    let data='';res.setEncoding('utf8');
    res.on('data',s=>data+=s);
    res.on('end',()=>resolve({status:res.statusCode,body:data,headers:res.headers}));
   });req.on('error',reject);req.end();
  });
 }
 try{
  for(let i=0;i<65;i++){try{if((await fetch(rootURL+'/healthz')).ok)break;}catch{}await pause(75);}
  const home=await call('/remodeling-preview');
  assert.equal(home.status,200);
  assert.match(home.body,/Prescott.*Best/);
  assert.match(home.body,/Bathroom remodeling/i);
  assert.match(home.body,/site-assets\/pbc-logo.webp/);
  assert.match(home.headers.get('x-robots-tag'),/noindex/);
  const guide=await hostCall('/project-guide','prescottsbestremodeling.com');
  assert.equal(guide.status,200);
  assert.match(guide.body,/Chat with Scotty/);
  assert.match(guide.body,/scotty-widget/);
  assert.match(guide.body,/scotty-consent/);
  assert.match(guide.body,/Google Gemini/);
  assert.match(guide.body,/guide-consent/);
  assert.match(guide.body,/Read last answer aloud/);
  const guideJs=await fetch(rootURL+'/guide.js');
  assert.equal(guideJs.status,200);
  assert.match(await guideJs.text(),/speechSynthesis/);
  const guideStatus=await call('/api/public/ai-guide/status');
  assert.equal(guideStatus.status,200);
  assert.equal(guideStatus.body.available,false);
  const disabledGuide=await call('/api/public/ai-guide','POST',{consent:true,question:'How do I plan a bathroom?',history:[]});
  assert.equal(disabledGuide.status,503);
  const logo=await fetch(rootURL+'/site-assets/pbc-logo.webp');
  assert.equal(logo.status,200);
  assert.equal(logo.headers.get('content-type'),'image/webp');
  const brandAssets=[
   ['favicon.ico','image/x-icon'],['favicon-16x16.png','image/png'],
   ['favicon-32x32.png','image/png'],['apple-touch-icon.png','image/png'],
   ['icon-192.png','image/png'],['icon-512.png','image/png'],
   ['pbc-social-card.jpg','image/jpeg'],['site.webmanifest','application/manifest+json; charset=utf-8']];
  for(const [name,mime] of brandAssets){
   const response=await fetch(rootURL+'/site-assets/'+name);
   assert.equal(response.status,200,name+' is available');
   assert.equal(response.headers.get('content-type'),mime,name);
   assert.ok((await response.arrayBuffer()).byteLength>100,name+' has content');
  }
  assert.match(home.body,/site-assets\/favicon\.ico/);
  assert.match(home.body,/site-assets\/apple-touch-icon\.png/);
  assert.match(home.body,/property="og:image"/);
  assert.match(home.body,/site-assets\/brand-films\/prescotts-best-home-remodeling-poster\.webp/);
  assert.match(home.body,/class="mobile-menu"/);
  assert.match(home.body,/class="desktop-nav"/);
  assert.match(home.body,/class="site-hero concept-hero commercial-hero cinema-hero cinema-home"/);
  assert.match(home.body,/data-brand-film="home"/);
  assert.match(home.body,/prescotts-best-home-remodeling-custom-audio-720\.mp4/);
  for(const slug of ['kitchen-hero','bathroom-remodel','kitchen-remodel','shower-conversion','room-conversion','finish-carpentry','consultation','local-home']){
   for(const variant of ['card','detail']){
    const name=slug+'-'+variant+'.webp';
    const response=await fetch(rootURL+'/site-assets/concepts/'+name);
    assert.equal(response.status,200,name);
    assert.equal(response.headers.get('content-type'),'image/webp',name);
    assert.ok((await response.arrayBuffer()).byteLength>15_000,name+' has real pixels');
   }
  }
  for(const servicePath of ['/bathroom-remodeling','/kitchen-remodeling','/shower-conversions','/room-conversions','/finish-carpentry']){
   const page=await call('/remodeling-preview'+servicePath);
   assert.equal(page.status,200,servicePath);
   assert.match(page.body,/class="service-concept"/,servicePath);
   assert.match(page.body,/Design inspiration.*Remodeling visualization/,servicePath);
  }
  const about=await call('/remodeling-preview/about');
  assert.equal(about.status,200);
  assert.match(about.body,/local-home-detail.webp/);
  assert.match(about.body,/Regional home design inspiration/);
  const contactPage=await call('/remodeling-preview/schedule');
  assert.equal(contactPage.status,200);
  assert.match(contactPage.body,/consultation-detail.webp/);
  assert.match(contactPage.body,/Design illustration.*Planning the details together/);
  const process=await call('/remodeling-preview/process');
  assert.equal(process.status,200);
  assert.match(process.body,/STEP 01/);
  assert.match(process.body,/STEP 05/);
  assert.match(process.body,/cost-plus proposal/);
  assert.match(process.body,/consultation-measurements.webp/);
  assert.match(process.body,/Design illustration/);
  const pricePage=await call('/remodeling-preview/estimate');
  assert.equal(pricePage.status,200);
  assert.match(pricePage.body,/Useful starting numbers/i);
  assert.match(pricePage.body,/\$16,100/);
  const sample={project:'bath-full',size:'medium',finish:'standard',condition:'straightforward'};
  const one=await call('/api/public/budget','POST',sample);
  const two=await call('/api/public/budget','POST',sample);
  assert.deepEqual(one.body,two.body);
  assert.equal(one.body.planningDirectCosts.low,14000);
  assert.equal(one.body.costPlus.low,16100);
  assert.equal(one.body.fixed.high,43800);
  assert.equal(one.body.homeownerRange.low,16100);
  assert.equal(one.body.homeownerRange.high,43800);
  assert.match(one.body.disclaimer,/initial budget range/i);
  const invalid=await call('/api/public/budget','POST',{project:'unknown'});
  assert.equal(invalid.status,400);
  const noConsent=await call('/api/public/inquiry','POST',{name:'Test User',email:'test@example.org',project:'Bathroom remodeling',consent:false});
  assert.equal(noConsent.status,400);
  const lead={name:'TEST PERSON',email:'demo@example.org',phone:'',project:'Bathroom remodeling',
   notes:'SYNTHETIC QA ONLY',consent:true,requestId:'synthetic-unique-request-00000001'};
  const added=await call('/api/public/inquiry','POST',lead);
  assert.equal(added.status,202);
  assert.equal(added.body.recorded,true);
  assert.match(added.body.reference,/^PBC-/);
  const repeated=await call('/api/public/inquiry','POST',lead);
  assert.equal(repeated.body.reference,added.body.reference);
  assert.equal((await call('/api/admin/leads')).status,401);
  const staff=await call('/api/admin/leads','GET',null,true);
  assert.equal(staff.body.leads.length,1);
  assert.equal(staff.body.notificationTo,'chris@prescottsbestconstruction.com');
  assert.equal(staff.body.leads[0].notification.status,'failed');
  assert.equal(added.body.notificationStatus,'failed');
  assert.equal(staff.body.leads[0].notification.attempts,1);
  assert.equal((await call('/')).status,200);
  assert.match((await call('/')).body,/Private Proposal/);
  // Domain-aware routing: branded PBC site at the new hostname while legacy
  // Render hostname continues to serve the original private proposal entry.
  const custom=await hostCall('/','prescottsbestremodeling.com');
  const customHtml=custom.body;
  assert.equal(custom.status,200);
  assert.match(customHtml,/Bring your remodeling ideas into focus/);
  assert.match(customHtml,/href="\/estimate"/);
  assert.match(customHtml,/href="\/"/);
  assert.doesNotMatch(customHtml,/href="\/remodeling-preview/);
  assert.match(custom.headers['x-robots-tag'],/noindex/);
  const customEstimate=await hostCall('/estimate','www.prescottsbestremodeling.com');
  assert.equal(customEstimate.status,200);
  assert.match(customEstimate.body,/Useful starting numbers/i);
  const customPrivate=await hostCall('/proposal','prescottsbestremodeling.com');
  assert.equal(customPrivate.status,200);
  assert.match(customPrivate.body,/Private Proposal/);
  const blog=await hostCall('/blog','prescottsbestremodeling.com');
  assert.equal(blog.status,200);
  assert.match(blog.body,/Know more before you remodel/);
  const article=await hostCall('/blog/compare-fixed-price-and-cost-plus','prescottsbestremodeling.com');
  assert.equal(article.status,200);
  assert.match(article.body,/BlogPosting/);
  assert.match(article.body,/datePublished/);
  assert.match(article.body,/not an approved estimate|scope, not just the number/i);
  assert.match(article.headers['x-robots-tag'],/noindex/);
  for(const path of ['/blog/bathroom-remodel-planning-checklist','/blog/kitchen-budget-decisions','/blog/prescott-permit-questions-homeowners']){
   const p=await hostCall(path,'prescottsbestremodeling.com');
   assert.equal(p.status,200,path);
   assert.match(p.body,/BlogPosting/,path);
  }
  const llms=await hostCall('/llms.txt','prescottsbestremodeling.com');
  assert.equal(llms.status,200);
  assert.match(llms.body,/Prescott.s Best Construction/);
  assert.match(llms.body,/Knowledge center/);
  assert.match(llms.body,/private proposal portal is access-controlled/);
  assert.match(llms.headers['content-type'],/text\/plain/);
  assert.match(llms.body,/\n## Main pages\n/);
  const full=await hostCall('/llms-full.txt','prescottsbestremodeling.com');
  assert.equal(full.status,200);
  assert.match(full.body,/Bathroom Remodel Planning Checklist/);
  const feed=await hostCall('/feed.xml','prescottsbestremodeling.com');
  assert.equal(feed.status,200);
  assert.match(feed.headers['content-type'],/rss\+xml/);
  assert.match(feed.body,/<rss version="2.0">/);
  assert.match(feed.body,/prescott-permit-questions-homeowners/);
  const sitemap=await hostCall('/sitemap.xml','prescottsbestremodeling.com');
  assert.equal(sitemap.status,404);
  const customRobots=await hostCall('/robots.txt','prescottsbestremodeling.com');
  assert.match(customRobots.body,/Disallow: \/\n/);
  assert.equal((await call('/robots.txt')).body,'User-agent: *\nDisallow: /\n');
  console.log('PASS: noindex marketing preview + logo, deterministic budget, fixed-vs-costplus, consent, dedupe, staff-only lead storage and Chris destination');
 }finally{proc.kill();await pause(130);await rm(tmp,{force:true,recursive:true});}
});
