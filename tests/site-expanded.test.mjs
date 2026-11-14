import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';

const paths=['/','/about','/projects','/concierge','/privacy','/accessibility',
 '/start-here','/resources/hiring-a-remodeling-contractor','/contact','/estimate'];

test('homeowner routes have complete pages, real owner scope and safe drafts',()=>{
 for(const p of paths){
  const html=marketingPage('/remodeling-preview'+(p==='/'?'':p),{indexable:false});
  assert.ok(html,p+' must be available');
  assert.match(html,/<h1(?:\s+[^>]*)?>/,p);
  assert.match(html,/<meta name="robots" content="noindex,nofollow">/,p);
  assert.match(html,/(?:AZ ROC #343141|Arizona Registrar of Contractors license #343141)/,p);
  assert.match(html,/href="\/remodeling-preview\/privacy"/,p);
  assert.doesNotMatch(html,/\b(?:sign guaranteed|auto.booked)\b/i,p);
 }
 const home=marketingPage('/remodeling-preview');
 assert.match(home,/Help me plan my project/);
 assert.match(home,/mobile-actions/);
 assert.match(marketingPage('/remodeling-preview/concierge'),/minimum job size/i);
 assert.match(marketingPage('/remodeling-preview/privacy'),/applicable business recordkeeping/i);
 assert.match(marketingPage('/remodeling-preview/projects'),/Read the project story/i);
 assert.match(marketingPage('/remodeling-preview/projects'),/FEATURED PROJECT · CRYSTAL CREEK/);
 assert.match(marketingPage('/remodeling-preview/projects'),/instagram.com\/p\/DV162KsgUxP/);
 assert.match(marketingPage('/remodeling-preview/start-here'),/planning-form/);
 assert.match(marketingPage('/remodeling-preview/contact'),/lead-unavailable/);
 assert.match(marketingPage('/remodeling-preview/contact'),/<form id="inquiry-form" class="inquiry-form">/);
 assert.match(marketingPage('/remodeling-preview/contact'),/Open email draft to Chris/);
 assert.match(marketingPage('/remodeling-preview/estimate'),/Useful starting numbers/i);
});

test('indexable canonical for custom domain uses clean path, never preview prefix',()=>{
 const origin='https://prescottsbestremodeling.com';
 const html=marketingPage('/remodeling-preview/privacy',{indexable:true,origin,cleanPaths:true});
 assert.match(html,/<link rel="canonical" href="https:\/\/prescottsbestremodeling.com\/privacy">/);
 assert.doesNotMatch(html,/<meta name="robots" content="noindex/);
 const home=marketingPage('/remodeling-preview',{indexable:true,origin,cleanPaths:true});
 assert.match(home,/<link rel="canonical" href="https:\/\/prescottsbestremodeling.com\/">/);
 assert.ok(sitemapPaths().includes('/remodeling-preview/privacy'));
 assert.ok(sitemapPaths().includes('/remodeling-preview/start-here'));
 assert.ok(!sitemapPaths().includes('/proposal'));
 assert.ok(!sitemapPaths().includes('/remodeling-preview/contact'));
});
