import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage} from '../marketing/site.mjs';

const page=path=>marketingPage('/remodeling-preview'+path,{indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true});

test('free on-site estimates are clear on homepage and consultation page',()=>{
 const home=page('/');
 const contact=page('/schedule');
 assert.match(home,/Get a free on-site estimate/);
 assert.match(home,/Free on-site estimates include visiting your property/);
 assert.match(home,/FREE ON-SITE ESTIMATES/);
 assert.match(contact,/<h1>Request your free on-site estimate\.<\/h1>/);
 assert.match(contact,/consultation and estimate are free, with no obligation/);
 assert.match(contact,/id="inquiry-form"/);
 assert.match(contact,/Send my project request/);
 assert.match(contact,/tel:\+19283500940/);
 assert.doesNotMatch(contact,/reply within one business day/i);
});

test('service pages and process carry the verified free estimate promise without invented warranty',()=>{
 for(const path of ['/bathroom-remodeling','/kitchen-remodeling','/shower-conversions','/custom-cabinetry','/finish-carpentry']){
  const html=page(path);
  assert.match(html,/Free on-site estimates are available for remodeling projects/);
  assert.match(html,/Get a free on-site estimate/);
  assert.match(html,/rel="canonical"/);
 }
 const process=page('/process');
 assert.match(process,/Your on-site estimate is free/);
 assert.match(process,/During your free on-site visit/);
 assert.doesNotMatch(process,/lifetime workmanship warranty/i);
});
