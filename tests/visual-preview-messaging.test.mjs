import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {previewCopy,previewHubPage} from '../marketing/visual-preview-copy.mjs';
import {readFile} from 'node:fs/promises';
import {sendLeadEmail} from '../marketing/email.mjs';

const page=path=>marketingPage('/remodeling-preview'+(path==='/'?'':path),
 {indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});

test('See it before we build it hub is a genuine indexable route with practical examples',()=>{
 const html=page('/visual-design-preview');
 assert.match(html,/<h1>Picture your project before construction begins\.<\/h1>/);
 assert.match(html,/rel="canonical" href="https:\/\/prescottsbestremodeling.com\/visual-design-preview"/);
 assert.match(html,/site-assets\/visual-explorer\/B01-cabinet-finish/);
 assert.match(html,/site-assets\/visual-explorer\/B06-deck-inspiration/);
 assert.match(html,/site-assets\/holiday-concepts/);
 assert.match(html,/Personalized previews are available for suitable projects/);
 assert.match(html,/not automatically included with every estimate/);
 assert.ok(sitemapPaths().includes('/remodeling-preview/visual-design-preview'));
 assert.match(page('/'),/See it before we build it\./);
});
test('all seven service pages carry visual-preview request with category',()=>{
 const projects=[
 ['/bathroom-remodeling','Bathroom%20remodeling'],
 ['/kitchen-remodeling','Kitchen%20remodeling'],
 ['/shower-conversions','Shower%20or%20bath%20conversion'],
 ['/room-conversions','Room%20or%20garage%20conversion'],
 ['/finish-carpentry','Finish%20carpentry'],
 ['/custom-cabinetry','Custom%20cabinetry%20and%20built-ins'],
 ['/deck-building-outdoor-carpentry','Deck%20or%20outdoor%20carpentry']
 ];
 for(const [path,query] of projects){
  const html=page(path);
  assert.match(html,/See what your remodeling idea could look like\./,path);
  assert.ok(html.includes('/schedule?preview=1&amp;project='+query)||html.includes('/schedule?preview=1&project='+query),path);
  assert.match(html,/scope of custom previews are confirmed/,path);
 }
});
test('estimate, process, holiday and consultation link to real tools instead of overclaiming',()=>{
 const estimate=page('/estimate');
 assert.match(estimate,/Understand the numbers—and picture the possibilities/);
 const budgetSelect=estimate.match(/<select id="project" name="project"[^>]*>([\s\S]*?)<\/select>/)?.[1]||'';
 assert.ok(budgetSelect);
 assert.doesNotMatch(budgetSelect,/Custom cabinetry|Decks & outdoor carpentry/);
 const process=page('/process');
 assert.match(process,/Ask whether a personalized concept would help/);
 const holiday=page('/holiday-lighting');
 assert.match(holiday,/Preview the display on your own home/);
 assert.match(holiday,/holiday-lighting\/design/);
 const studio=page('/holiday-lighting/design');
 assert.match(studio,/Previews are illustrative planning concepts/);
 assert.match(studio,/holiday-ai-consent/);
 const contact=page('/schedule');
 assert.match(contact,/id="lead-visual-preview" name="visualPreview" value="requested"/);
 assert.match(contact,/Custom cabinetry and built-ins/);
 assert.match(contact,/Deck or outdoor carpentry/);
 assert.match(contact,/No preview or appointment is automatically promised/);
});
test('inquiry request remains a choice not automatic; email notification flags interested homeowner',async()=>{
 const js=await readFile(new URL('../public/marketing.js',import.meta.url),'utf8');
 assert.match(js,/qs.get\('preview'\)==='1'/);
 assert.match(js,/data.visualPreview=previewBox\?\.checked/);
 const backend=await readFile(new URL('../marketing/api.mjs',import.meta.url),'utf8');
 assert.match(backend,/visualPreviewRequested=v.visualPreview==='requested'/);
 assert.match(backend,/visualPreviewRequested,inspirations,photos:imageRecords/);
 const saved={RESEND_API_KEY:process.env.RESEND_API_KEY,LEAD_FROM_EMAIL:process.env.LEAD_FROM_EMAIL};
 process.env.RESEND_API_KEY='test-prompt-scoped';
 process.env.LEAD_FROM_EMAIL='synthetic@example.invalid';
 try{
  let msg;
  const lead={id:'PBC-SYNTHETIC',name:'Sample Homeowner',email:'sample@example.org',project:'Custom cabinetry and built-ins',
   notes:'Test inquiry without real customer data',createdAt:'2026-11-07T00:00:00Z',visualPreviewRequested:true};
  const result=await sendLeadEmail(lead,{sendWithResend:async p=>{msg=p;return {id:'synthetic-id'};}});
  assert.equal(result.sent,true);
  assert.match(msg.text,/Ask about visual design preview: Yes/);
  assert.equal(msg.to,'chris@prescottsbestconstruction.com');
 }finally{
  for(const [k,val] of Object.entries(saved))if(val===undefined)delete process.env[k];else process.env[k]=val;
 }
});
