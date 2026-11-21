import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage} from '../marketing/site.mjs';
const page=(path)=>marketingPage('/remodeling-preview'+(path==='/'?'':path),{
 indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true
});

test('home explains installation-specific warranty eligibility without selling a new blanket warranty',()=>{
 const html=page('/');
 assert.match(html,/The part you don’t see can matter the most/);
 assert.match(html,/manufacturer warranties/);
 assert.match(html,/right materials, the right conditions/);
 assert.match(html,/id="pbc-quality-home-heading"/);
 assert.match(html,/href="\/remodeling-preview\/process#installation-details"/);
 assert.doesNotMatch(html,/we guarantee your warranty|lifetime workmanship warranty|free guaranteed warranty/i);
});

test('process tells real deck coating/window/shower stories without inventing warranty terms',()=>{
 const html=page('/process');
 assert.match(html,/id="installation-details"/);
 for(const copy of ['Deck surfaces: conditions matter','Windows: the opening matters','Showers: what is behind the tile?','preparing the surface','flashing','product documentation']){
  assert.ok(html.includes(copy),copy);
 }
 assert.match(html,/Every product has its own written terms/);
 assert.doesNotMatch(html,/2-year workmanship warranty|guaranteed manufacturer's coverage|lifetime guarantee/i);
});

test('all seven relevant services have distinct practical proof and a direct process link',()=>{
 const servicePaths=[
 '/deck-building-outdoor-carpentry','/finish-carpentry','/bathroom-remodeling',
 '/shower-conversions','/kitchen-remodeling','/custom-cabinetry','/room-conversions'
 ];
 const intros=new Set();
 for(const route of servicePaths){
  const html=page(route);
  assert.match(html,/class="site-section pbc-quality-service"/,route);
  assert.match(html,/How we approach installation details/,route);
  assert.match(html,/href="\/remodeling-preview\/process#installation-details"/,route);
  const h2=html.match(/<section class="site-section pbc-quality-service"[^>]*>[\s\S]*?<h2[^>]*>([^<]+)/);
  assert.ok(h2,route);
  intros.add(h2[1]);
 }
 assert.equal(intros.size,servicePaths.length);
});

test('premium concept scenes stay, but noisy concept photo labels are gone',()=>{
 const home=page('/');
 assert.match(home,/site-assets\/concepts\/bathroom-remodel-card.webp/);
 assert.match(home,/site-assets\/concepts\/kitchen-remodel-card.webp/);
 assert.match(home,/site-assets\/real-gallery\/deck-stone-fireplace.webp/);
 assert.doesNotMatch(home,/<span class="concept-badge">|<figcaption>Design illustration|<figcaption>Design inspiration/);
 for(const service of ['/bathroom-remodeling','/kitchen-remodeling','/shower-conversions']){
  const html=page(service);
  assert.match(html,/class="service-concept"/);
  assert.doesNotMatch(html,/<figcaption>Design inspiration|class="concept-kind"/);
 }
 const process=page('/process');
 assert.doesNotMatch(process,/<figcaption>[^<]*Design concept/);
 assert.match(process,/consultation-measurements.webp/);
});

test('schedule keeps the real native intake form and common contact mailbox',()=>{
 const schedule=page('/schedule');
 assert.match(schedule,/id="inquiry-form"/);
 assert.match(schedule,/Send my project request/);
 assert.match(schedule,/chris@prescottsbestconstruction.com/);
 assert.doesNotMatch(schedule,/Open email draft to Chris/);
});
