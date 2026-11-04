import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';

const options={indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true};
test('storm recovery guide contains local incident facts, actionable resources and cautious insurance guidance',()=>{
 const html=marketingPage('/remodeling-preview/storm-flood-damage-prescott',options);
 assert.ok(html,'storm page exists');
 for(const phrase of [
  'After the storm, you do not have to figure out every repair at once',
  'October 31–November 2 flooding',
  'do not have to',
  'water damage',
  'Community Development',
  '(928) 777-1405',
  '(928) 442-5103',
  'Separate flood insurance',
  'SB 1206',
  'cannot negotiate an insurance claim',
  'does not yet upload photos',
  'storm-planner',
  'storm-plan-result'
 ])assert.ok(html.includes(phrase),phrase);
 for(const source of ['prescott-az.gov/prescott-flooding-emergency-information','difi.az.gov/consumers/homeowners-insurance','floodsmart.gov/recover/document-damage','azleg.gov/legtext/57leg/2R/laws/0157.htm','roc.az.gov/before-hire'])assert.ok(html.includes(source),source);
 assert.match(html,/rel="canonical" href="https:\/\/prescottsbestremodeling.com\/storm-flood-damage-prescott"/);
 assert.match(html,/\"@type\":\"BlogPosting\"/);
 assert.ok(sitemapPaths().some(p=>p.endsWith('/storm-flood-damage-prescott')));
 assert.match(html,/href="#storm-planner"/);
 assert.ok(html.indexOf('storm-planner-section')<html.indexOf('storm-steps'), 'guided worksheet should be near the top');
 assert.match(html,/id="storm-photos"/);
});
test('homepage, blog and contact path link to storm assistance without automatic file uploads',async()=>{
 const home=marketingPage('/remodeling-preview/',options);
 const blog=marketingPage('/remodeling-preview/blog',options);
 const contact=marketingPage('/remodeling-preview/schedule',options);
 assert.match(home,/storm-home-banner/);
 assert.match(home,/storm-flood-damage-prescott/);
 assert.match(blog,/storm-blog-feature/);
 assert.match(contact,/Storm or flood damage reconstruction/);
 const script=await readFile(new URL('../public/storm.js',import.meta.url),'utf8');
 const lead=await readFile(new URL('../public/marketing.js',import.meta.url),'utf8');
 assert.match(script,/sessionStorage.setItem\('pbc_storm_draft'/);
 assert.match(script,/navigator.clipboard.writeText/);
 assert.match(script,/window.print/);
 assert.doesNotMatch(script,/fetch\(/);
 assert.match(lead,/pbc_storm_draft/);
});
test('storm guide remains noindex on preview host',()=>{
 const html=marketingPage('/remodeling-preview/storm-flood-damage-prescott',{});
 assert.match(html,/name="robots" content="noindex,nofollow"/);
 assert.doesNotMatch(html,/rel="canonical"/);
});
