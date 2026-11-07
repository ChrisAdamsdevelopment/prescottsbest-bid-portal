import test from 'node:test';
import assert from 'node:assert/strict';
import {stat,readFile} from 'node:fs/promises';
import {marketingPage} from '../marketing/site.mjs';
import {visualExplorersForService,allVisualImages,visualGroups} from '../marketing/visual-catalog.mjs';
import {validateInspirationSelections} from '../marketing/inspiration-selections.mjs';
import {sendLeadEmail} from '../marketing/email.mjs';

const page=path=>marketingPage('/remodeling-preview'+path,{indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});

test('six matched full-room kitchens and six existing material boards appear as real image assets',async()=>{
 const chosen=visualExplorersForService('/kitchen-remodeling');
 assert.equal(chosen.length,6);
 assert.equal(chosen[0].id,'kitchen-finish-comparison');
 assert.equal(chosen[0].variants.length,6);
 assert.equal(chosen[0].variants.filter(x=>x.width===1440&&x.height===810).length,6);
 assert.equal(new Set(chosen[0].variants.map(x=>JSON.stringify(x.choice))).size,6);
 assert.equal(chosen[3].id,'kitchen-material-boards');
 assert.equal(chosen[3].variants.length,6);
 assert.equal(visualGroups().length,9);
 assert.equal(allVisualImages().length,78);
 for(const config of [chosen[0],chosen[3]])for(const item of config.variants){
  assert.ok(item.alt.length>70,item.file);
  for(const file of [item.file,item.thumb]){
   const path=new URL('../public'+file,import.meta.url);
   const data=await readFile(path);
   assert.equal(data.toString('ascii',0,4),'RIFF',file);
   assert.ok((await stat(path)).size>9000,file);
  }
 }
 const html=page('/kitchen-remodeling');
 assert.match(html,/Compare the finished kitchen/i);
 assert.match(html,/id="kitchen-finish-comparison"/);
 assert.match(html,/id="kitchen-material-boards"/);
 assert.match(html,/Light natural wood/);
 assert.match(html,/Gray stone/);
 assert.equal((html.match(/class="site-section visual-explorer"/g)||[]).length,6);
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const gallery=schemas.find(x=>x['@type']==='ImageGallery');
 assert.equal(gallery?.image?.length,60);
 assert.equal(gallery.image.filter(x=>x.width===1440&&x.height===810).length,6);
 assert.equal(gallery.image.filter(x=>x.width===1200&&x.height===800).length,6);
});
test('inspiration tagging, review panel and explicit contact submission appear on rendered pages',()=>{
 for(const path of ['/kitchen-remodeling','/custom-cabinetry','/deck-building-outdoor-carpentry']){
  const html=page(path);
  assert.match(html,/data-inspiration-tag aria-pressed="false"/);
  assert.match(html,/Add to My Inspiration List/);
  assert.match(html,/data-inspiration-link/);
  assert.match(html,/inspiration-list\.js/);
 }
 const hub=page('/visual-design-preview');
 assert.match(hub,/id="my-inspiration-list"/);
 assert.match(hub,/data-inspiration-items/);
 assert.match(hub,/Clear my list/);
 const contact=page('/schedule');
 assert.match(contact,/My saved inspiration ideas/);
 assert.match(contact,/data-inspiration-items/);
 assert.match(contact,/Open email draft to Chris/);
});
test('server accepts only curated, available image IDs and sanitizes homeowner notes',()=>{
 const kitchen=visualExplorersForService('/kitchen-remodeling');
 const first=kitchen[0].variants[0];
 const hardware=kitchen[4].variants[0];
 const entries=[
  {explorerId:'kitchen-finish-comparison',file:first.file,note:'Like the brighter countertops'},
  {explorerId:'hardware-exterior',file:hardware.file,note:'Consider for drawers'},
  {explorerId:'kitchen-finish-comparison',file:first.file,note:'duplicate'}
 ];
 const normalized=validateInspirationSelections(entries);
 assert.equal(normalized.length,2);
 assert.equal(normalized[0].note,'Like the brighter countertops');
 assert.equal(normalized[0].name,first.name);
 assert.equal(normalized[0].url,'https://prescottsbestremodeling.com'+first.file);
 assert.throws(()=>validateInspirationSelections([{explorerId:'kitchen-finish-comparison',file:'/secret/private.jpg'}]));
 assert.throws(()=>validateInspirationSelections([{explorerId:'kitchen-finish-comparison',file:first.file,note:'x'.repeat(181)}]));
 assert.throws(()=>validateInspirationSelections(Array.from({length:21},()=>entries[0])));
 assert.deepEqual(validateInspirationSelections(undefined),[]);
});
test('contractor email receives structured item titles, true image links and homeowner notes',async()=>{
 const variant=visualExplorersForService('/kitchen-remodeling')[0].variants[1];
 const inspirations=validateInspirationSelections([{explorerId:'kitchen-finish-comparison',file:variant.file,note:'We prefer the cooler top'}]);
 const saved={RESEND_API_KEY:process.env.RESEND_API_KEY,LEAD_FROM_EMAIL:process.env.LEAD_FROM_EMAIL};
 process.env.RESEND_API_KEY='synthetic-test-token';
 process.env.LEAD_FROM_EMAIL='synthetic@example.invalid';
 try{
  let sent;
  const lead={id:'PBC-INSPIRATION-TEST',name:'Sample Homeowner',email:'sample@example.org',
   phone:'',project:'Kitchen remodeling',notes:'Interested in kitchen options',area:'Prescott Valley',
   visualPreviewRequested:true,inspirations,photos:[],createdAt:'2026-11-07T12:00:00Z',referral:{}};
  const outcome=await sendLeadEmail(lead,{sendWithResend:async msg=>{sent=msg;return {id:'synthetic-message-id'};}});
  assert.equal(outcome.sent,true);
  assert.match(sent.text,/Inspiration list: 1 chosen designs/);
  assert.match(sent.text,/My note:|Homeowner note:/);
  assert.ok(sent.text.includes(inspirations[0].url));
  assert.ok(sent.text.includes('We prefer the cooler top'));
  assert.equal(sent.to,'chris@prescottsbestconstruction.com');
 }finally{
  for(const [k,v] of Object.entries(saved))if(v===undefined)delete process.env[k];else process.env[k]=v;
 }
});
test('saved ideas remain client-side until explicit form submission',async()=>{
 const source=await readFile(new URL('../public/inspiration-list.js',import.meta.url),'utf8');
 assert.match(source,/pbc-inspiration-list-v1/);
 assert.match(source,/localStorage/);
 assert.match(source,/MAX=20/);
 assert.doesNotMatch(source,/fetch\(/);
 assert.doesNotMatch(source,/XMLHttpRequest/);
 const leadJs=await readFile(new URL('../public/marketing.js',import.meta.url),'utf8');
 assert.match(leadJs,/data.inspirations=window.pbcInspirationList/);
 assert.match(leadJs,/window.pbcInspirationList\?\.plainText/);
});
