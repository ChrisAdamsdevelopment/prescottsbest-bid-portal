import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {serviceDepthPaths} from '../marketing/service-depth.mjs';
import {accessibleRemodelingDraft} from '../marketing/accessible-remodeling.draft.mjs';

test('every existing service page offers technical material and build-sequence depth',()=>{
 assert.equal(serviceDepthPaths.length,7);
 for(const path of serviceDepthPaths){
  const page=marketingPage('/remodeling-preview'+path,{indexable:false});
  assert.ok(page,'existing route '+path);
  assert.match(page,/HOW TO PLAN IT WELL/);
  assert.match(page,/class="service-depth-item"/);
  assert.equal((page.match(/class="service-depth-item"/g)||[]).length,4);
  assert.match(page,/scope|requirements|approval|structure|conditions/i);
 }
});

test('wet-area and kitchen descriptions address physical materials without fake product endorsements',()=>{
 const bath=marketingPage('/remodeling-preview/bathroom-remodeling',{indexable:false});
 const kitchen=marketingPage('/remodeling-preview/kitchen-remodeling',{indexable:false});
 const shower=marketingPage('/remodeling-preview/shower-conversions',{indexable:false});
 assert.match(bath,/waterproofing method/);
 assert.match(bath,/curbless shower/);
 assert.match(kitchen,/drawer slides/);
 assert.match(kitchen,/Quartz, granite/);
 assert.match(shower,/floor assembly/);
});

test('accessible aging-in-place draft is asset-gated and absent from routes and sitemap',()=>{
 assert.equal(accessibleRemodelingDraft.path,'/accessible-aging-in-place-remodeling');
 assert.ok(accessibleRemodelingDraft.sections.length>=5);
 assert.equal(accessibleRemodelingDraft.mediaNeeded.length,4);
 assert.match(accessibleRemodelingDraft.proofPolicy,/Do not present generated concepts as real/);
 assert.equal(marketingPage('/remodeling-preview'+accessibleRemodelingDraft.path,{indexable:false}),null);
 assert.ok(!sitemapPaths().includes('/remodeling-preview'+accessibleRemodelingDraft.path));
});
