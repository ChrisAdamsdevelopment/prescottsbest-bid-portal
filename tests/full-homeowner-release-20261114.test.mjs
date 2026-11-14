import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat,mkdtemp,rm} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {request as httpRequest} from 'node:http';
import {setTimeout as pause} from 'node:timers/promises';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {approvedConceptAssetPaths,conceptMedia} from '../marketing/remodeling-concept-media.mjs';
import {serviceDepthPaths} from '../marketing/service-depth.mjs';

const root=resolve(import.meta.dirname,'..');
const render=path=>marketingPage('/remodeling-preview'+(path==='/'?'':path),{
 indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true
});

test('nine approved generated concepts are optimized, valid and never include the rejected door asset',async()=>{
 const slugs=Object.keys(conceptMedia);
 assert.equal(slugs.length,9);assert.equal(approvedConceptAssetPaths.length,18);
 assert.equal(new Set(approvedConceptAssetPaths).size,18);
 assert.ok(!slugs.some(x=>/door|bad image/i.test(x)));
 for(const file of approvedConceptAssetPaths){
  assert.ok(!/bad image of door/i.test(file));
  const bytes=await readFile(root+'/public'+file);
  assert.equal(bytes.toString('ascii',0,4),'RIFF',file);
  assert.equal(bytes.toString('ascii',8,12),'WEBP',file);
  assert.ok(bytes.length>15000&&bytes.length<390000,file);
 }
});

test('accessible aging-in-place landing is indexable, linked and displays correct approved concept images',()=>{
 const page=render('/accessible-aging-in-place-remodeling');
 assert.ok(page);
 assert.match(page,/<h1>A home that works better/);
 assert.match(page,/grab bars|Grab bars/);
 assert.match(page,/Crystal Creek/);
 assert.match(page,/shower.*cutaway|waterproofing and drain areas/s);
 assert.match(page,/<link rel="canonical" href="https:\/\/prescottsbestconstruction\.com\/accessible-aging-in-place-remodeling">/);
 const imgs=(page.match(/src="\/site-assets\/remodeling-concepts\//g)||[]).length;
 assert.ok(imgs>=6);
 assert.match(page,/Design concept/);
 assert.match(page,/Educational illustration/);
 assert.match(page,/accessibility-design-reel\.mp4/);
 assert.match(page,/accessibility-design-reel\.vtt/);
 assert.match(page,/<video controls playsinline preload="metadata"/);
 assert.doesNotMatch(page,/<video[^>]+autoplay/);
 assert.match(page,/Short design-concept video/);
 assert.doesNotMatch(page,/bad image of door\.png/);
 const home=render('/');
 assert.match(home,/Explore accessible remodeling/);
 assert.match(home,/accessible-aging-in-place-remodeling/);
 assert.match(home,/Accessible living/);
 assert.equal((home.match(/class="site-section accessible-home-feature"/g)||[]).length,1);
 assert.ok(sitemapPaths().includes('/remodeling-preview/accessible-aging-in-place-remodeling'));
});

test('seven service pages include practical detail topics with accessible disclosure controls',()=>{
 assert.equal(serviceDepthPaths.length,7);
 for(const path of serviceDepthPaths){
  const html=render(path);
  assert.ok(html);
  assert.match(html,/HOW TO PLAN IT WELL/);
  assert.equal((html.match(/<details class="service-depth-item"/g)||[]).length,4,path);
  assert.match(html,/<summary>/);
  assert.match(html,/What could change in your home/);
  assert.match(html,/href="\/remodeling-preview\/schedule"/);
 }
 const shower=render('/shower-conversions');
 assert.match(shower,/shower-blocking-1440\.webp/);
 const kitchen=render('/kitchen-remodeling');
 assert.match(kitchen,/cabinet-hardware-1440\.webp/);
 const custom=render('/custom-cabinetry');
 assert.match(custom,/builtins-living-1440\.webp/);
 const room=render('/room-conversions');
 assert.match(room,/conversion-guest-1440\.webp/);
});

test('Crystal Creek story is restored from the original published Wix record, not a fabricated case study',()=>{
 const page=render('/projects/crystal-creek-accessible-remodel');
 assert.match(page,/A Home Designed to Stay In/);
 assert.match(page,/garden trowel/);
 assert.match(page,/two concrete support posts/);
 assert.match(page,/wheelchair-accessible closet/);
 assert.match(page,/instagram.com\/p\/DV162KsgUxP/);
 assert.doesNotMatch(page,/site-assets\/remodeling-concepts/);
 assert.ok(sitemapPaths().includes('/remodeling-preview/projects/crystal-creek-accessible-remodel'));
 const gallery=render('/projects');
 assert.match(gallery,/FEATURED PROJECT · CRYSTAL CREEK/);
 assert.match(gallery,/Read the project story/);
 assert.match(gallery,/Design concept/);
 assert.doesNotMatch(gallery,/View original project videos/);
});

test('permitting guide accurately separates Prescott Fast Track and Prescott Valley jurisdictions',()=>{
 const guide=render('/guides/prescott-remodeling-permits');
 assert.match(guide,/July 6, 2026/);
 assert.match(guide,/before 3 p\.m\./);
 assert.match(guide,/up to 200 amps/);
 assert.match(guide,/Not automatically/);
 assert.match(guide,/GoPost/);
 assert.match(guide,/prescott-az\.gov\/fast-track-permits-program/);
 assert.match(guide,/gopost-prescottvalley\.eplansoftreview\.com/);
 assert.ok(sitemapPaths().includes('/remodeling-preview/guides/prescott-remodeling-permits'));
 assert.ok(!sitemapPaths().includes('/remodeling-preview/prescott-fast-track-permits-2026'));
});

test('new image gallery JSON-LD names concept source without representing it as a completed job',()=>{
 for(const path of ['/accessible-aging-in-place-remodeling','/bathroom-remodeling','/custom-cabinetry']){
  const html=render(path);
  const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x=>JSON.parse(x[1]));
  const gallery=blocks.find(o=>o['@type']==='ImageGallery'&&o['@id']?.endsWith('#remodeling-concepts'));
  assert.ok(gallery,'expected image gallery schema '+path);
  assert.ok(gallery.image.every(i=>i['@type']==='ImageObject'&&i.width>700&&i.height>350));
  assert.match(gallery.description,/not completed construction photographs/);
  if(path==='/accessible-aging-in-place-remodeling'){
   const reel=blocks.find(o=>o['@type']==='VideoObject'&&o.name?.includes('Accessible Remodeling Design Concepts'));
   assert.ok(reel,'accessible design reel schema');
   assert.equal(reel.duration,'PT20S');
   assert.match(reel.description,/Not footage of completed construction/);
  }
 }
});

test('HTTP regression: indexed legacy permit URL 301s to current guide; optimized asset is accessible',async()=>{
 const data=await mkdtemp(join(tmpdir(),'pbc-pages-media-'));
 const port=22000+Math.floor(Math.random()*1200);
 const child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{
  ...process.env,NODE_ENV:'development',PORT:String(port),DATA_DIR:data,
  PORTAL_ADMIN_KEY:'TESTONLYlocaltoken-12345678901234567890',SITE_INDEXABLE:'true',
  RESEND_API_KEY:'',LEAD_FORM_ENABLED:'false'
 },stdio:'ignore'});
 const req=(host,path,method='GET')=>new Promise((resolve,reject)=>{
  const r=httpRequest({hostname:'127.0.0.1',port,headers:{host},path,method},res=>{
   const parts=[];res.on('data',x=>parts.push(x));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(parts)}));
  });r.on('error',reject);r.end();
 });
 try{
  let ready=false;
  for(let i=0;i<65;i++){
   try{if((await req('127.0.0.1','/healthz')).status===200){ready=true;break}}catch{}
   await pause(90);
  }
  assert.ok(ready,'local server started');
  for(const host of ['prescottsbestconstruction.com','www.prescottsbestconstruction.com']){
   const old=await req(host,'/prescott-fast-track-permits-2026?source=legacy');
   assert.equal(old.status,301);
   assert.equal(old.headers.location,'https://prescottsbestconstruction.com/guides/prescott-remodeling-permits?source=legacy');
   const next=await req(host,'/guides/prescott-remodeling-permits');
   assert.equal(next.status,200);
  }
  const caseStudy=await req('prescottsbestconstruction.com','/projects/crystal-creek-accessible-remodel');
  assert.equal(caseStudy.status,200);
  assert.match(caseStudy.body.toString('utf8'),/A Home Designed to Stay In/);
  const img=await req('prescottsbestconstruction.com',approvedConceptAssetPaths[0]);
  assert.equal(img.status,200);
  assert.match(img.headers['content-type'],/image\/webp/);
  assert.equal(img.body.toString('ascii',0,4),'RIFF');
  const video=await req('prescottsbestconstruction.com','/site-assets/remodeling-concepts/accessibility-design-reel.mp4');
  assert.equal(video.status,200);
  assert.match(video.headers['content-type'],/video\/mp4/);
  assert.match(video.body.toString('ascii',4,8),/ftyp/);
  const captions=await req('prescottsbestconstruction.com','/site-assets/remodeling-concepts/accessibility-design-reel.vtt');
  assert.equal(captions.status,200);
  assert.match(captions.headers['content-type'],/text\/vtt/);
  assert.match(captions.body.toString('utf8'),/^WEBVTT/);
  const poster=await req('prescottsbestconstruction.com','/site-assets/remodeling-concepts/accessibility-design-reel-poster.webp');
  assert.equal(poster.status,200);
  assert.equal(poster.body.toString('ascii',0,4),'RIFF');
  const privatePortal=await req('spectracleanse-ai.onrender.com','/proposal');
  assert.equal(privatePortal.status,200);
  const oldRemodel=await req('prescottsbestremodeling.com','/accessible-aging-in-place-remodeling');
  assert.equal(oldRemodel.status,301);
  assert.equal(oldRemodel.headers.location,'https://prescottsbestconstruction.com/accessible-aging-in-place-remodeling');
 }finally{
  child.kill();await rm(data,{recursive:true,force:true});
 }
});
