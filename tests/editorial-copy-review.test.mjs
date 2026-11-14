import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage} from '../marketing/site.mjs';
import {serviceEditorial,editorialPaths} from '../marketing/editorial-voice.mjs';
import {readFile} from 'node:fs/promises';

const env={indexable:false};
const page=path=>marketingPage('/remodeling-preview'+path,env);

test('home leads with a useful human introduction and clear contact choice',()=>{
 const html=page('/');
 assert.match(html,/Good remodeling starts with listening/);
 assert.match(html,/tell us what you have in mind/i);
 assert.ok(html.indexOf('HOW CAN WE HELP?')<html.indexOf('HOLIDAY LIGHTING · PRESCOTT AREA'),'main services lead seasonal offers');
 const actions=html.indexOf('class="cinema-actions"');
 const section=html.slice(actions,actions+900);
 assert.ok(section.indexOf('Request a consultation')>=0);
 assert.ok(section.indexOf('Explore a budget range')>=0);
 assert.ok(section.indexOf('Request a consultation')<section.indexOf('Explore a budget range'));
});

test('About replaces defensive compliance heading with a genuine local-contractor introduction',()=>{
 const html=page('/about');
 assert.match(html,/A local builder who cares about the details/);
 assert.match(html,/What you can expect from the first conversation/);
 assert.doesNotMatch(html,/What we will not do/);
 assert.match(html,/343141/);
 assert.match(html,/roc\.az\.gov/);
});

test('seven service pages have specific homeowner language and relevant FAQs',()=>{
 assert.equal(editorialPaths.length,7);
 const expected=new Map([
  ['/bathroom-remodeling','replace my tub'],
  ['/kitchen-remodeling','keep our kitchen layout'],
  ['/shower-conversions','zero-threshold shower'],
  ['/room-conversions','garage become living space'],
  ['/finish-carpentry','match trim in an older Prescott home'],
  ['/custom-cabinetry','existing desk or sewing machine'],
  ['/deck-building-outdoor-carpentry','before choosing decking']
 ]);
 for(const [path,question] of expected){
  const html=page(path);
  assert.match(html,new RegExp(question,'i'),path);
  assert.match(html,/Design inspiration.*Remodeling visualization|Design concept|concept/i,path);
  assert.doesNotMatch(html,/practical project sequencing/i,path);
  assert.doesNotMatch(html,/Can we keep the existing layout\?/i,path);
  const e=serviceEditorial(path);
  assert.equal(e.faqs.length,3,path);
 }
});

test('Process explains work and proposal without exposing software roadmap or repeating warnings',()=>{
 const html=page('/process');
 assert.match(html,/We put the plan and the numbers in writing/);
 assert.match(html,/we walk through the space with you/);
 assert.doesNotMatch(html,/developing organized Google Drive sharing/);
 assert.doesNotMatch(html,/general self-service account/);
 assert.doesNotMatch(html,/not a photograph of a completed customer project or a guaranteed final design/);
 assert.equal((html.match(/Design concept/g)||[]).length>=4,true);
 assert.match(html,/STEP 01/);
 assert.match(html,/STEP 05/);
});

test('budget retry is warm but preserves the real API route and privacy-safe calculations',async()=>{
 const js=await readFile(new URL('../public/marketing.js',import.meta.url),'utf8');
 assert.match(js,/fetch\('\/api\/public\/budget'/);
 assert.match(js,/The budget range did not load this time/);
 assert.match(js,/Try again/);
 assert.doesNotMatch(js,/Could not calculate this example:/);
});

test('rejected generated door illustration is nowhere in public code',async()=>{
 const [site,imagery,extra]=await Promise.all(['site.mjs','imagery.mjs','extra-pages.mjs'].map(n=>readFile(new URL('../marketing/'+n,import.meta.url),'utf8')));
 assert.ok(![site,imagery,extra].some(s=>/bad image of door\.png/i.test(s)));
});
