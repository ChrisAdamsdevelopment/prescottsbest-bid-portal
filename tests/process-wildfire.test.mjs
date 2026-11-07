import test from 'node:test';
import assert from 'node:assert/strict';
import {stat} from 'node:fs/promises';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
const env={indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true};
test('five-step customer process and design concept disclosure',()=>{
 const homepage=marketingPage('/remodeling-preview/',env);
 assert.match(homepage,/See our full remodeling process/);
 assert.match(homepage,/process-home-teaser/);
 const html=marketingPage('/remodeling-preview/process',env);
 assert.match(html,/STEP 01/);
 assert.match(html,/STEP 05/);
 for(const f of ['consultation-measurements','design-review-materials','finished-sewing-hidden-office','protected-custom-installation'])assert.match(html,new RegExp('/site-assets/process/'+f+'[.]webp'));
 for(const phrase of ['cost-plus','physical wood and finish samples','Google Drive sharing','protecting nearby floors'])assert.ok(html.includes(phrase),phrase);
 assert.match(html,/Design illustration, not a photograph/);
});
test('wildfire readiness shows crew-background bio and qualified guidance',async()=>{
 const html=marketingPage('/remodeling-preview/wildfire-home-readiness',env);
 assert.match(html,/Christopher Adams/);
 assert.match(html,/Tucson 1 Wildland Fire Crew/);
 assert.match(html,/Type 1 firefighter/);
 assert.match(html,/Illustrative banner/);
 assert.match(html,/not presented as Prescott’s Best Construction employees/);
 assert.match(html,/no retrofit makes a home fireproof/);
 assert.match(html,/Arizona Department of Forestry/);
 assert.match(html,/rel="canonical" href="https:\/\/prescottsbestremodeling.com\/wildfire-home-readiness"/);
 assert.ok(sitemapPaths().some(p=>p.endsWith('/wildfire-home-readiness')));
 const root=new URL('../public/site-assets/',import.meta.url);
 for(const file of ['wildfire/tucson-1-crew-ai-enhanced-banner.webp','process/consultation-measurements.webp','process/design-review-materials.webp','process/finished-sewing-hidden-office.webp','process/protected-custom-installation.webp']){
  const s=await stat(new URL(file,root));
  assert.ok(s.size>1000,file);
 }
});
