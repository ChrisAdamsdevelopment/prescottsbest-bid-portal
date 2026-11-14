import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {holidayPackages} from '../marketing/holiday-pages.mjs';
import {holidayImages,holidayCloseups,holidayBackyards} from '../marketing/holiday-assets.mjs';
test('holiday lighting publishes three agreed starting prices plus a custom smart-light quote',()=>{
 assert.equal(holidayPackages.length,4);
 assert.equal(new Set(holidayPackages.map(p=>p.id)).size,4);
 assert.equal(holidayPackages.some(p=>p.id==='permanent'),true);
 for(const p of holidayPackages){
  assert.ok(p.features.length>=3);
  assert.match(p.range,/^From \$[0-9,]+$|^Custom quote$/);
 }
});
test('holiday lighting and design studio render in protected preview without promises',()=>{
 for(const slug of ['/holiday-lighting','/holiday-lighting/design']){
  const html=marketingPage('/remodeling-preview'+slug,{indexable:false,origin:'https://prescottsbestconstruction.com'});
  assert.ok(html);
  assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
  assert.match(html,/Holiday Lighting/);
  assert.match(html,/\/holiday.js/);
  assert.match(html,/quote|installation/i);
  assert.ok(sitemapPaths().includes('/remodeling-preview'+slug));
 }
 const studio=marketingPage('/remodeling-preview/holiday-lighting/design');
 assert.match(studio,/holiday-canvas/);
 assert.match(studio,/holiday-photo/);
 assert.match(studio,/holiday-product/);
 assert.match(studio,/LED rope lighting/);
 assert.match(studio,/holiday-ai-consent/);
 assert.match(studio,/holiday-ai-ask/);
 assert.match(studio,/holiday-email/);
 assert.match(studio,/photos? stay.*device|photo stays on your device/i);
 assert.match(studio,/not.*quote/i);
});
test('all 23 holiday design images have descriptive alt text and appear in the concept gallery',()=>{
 const page=marketingPage('/remodeling-preview/holiday-lighting');
 assert.equal(holidayImages.length,23);
 assert.match(page,/small ornamental tree lighting starts at \$149/i);
 assert.equal(new Set(holidayImages.map(x=>x.file)).size,23);
 for(const img of holidayImages){
  assert.ok(img.file.endsWith('.webp'));
  assert.ok(img.alt.length>45);
  assert.ok(img.caption.length>30);
  assert.ok(page.includes('/site-assets/holiday-concepts/'+img.file),img.file);
  assert.ok(page.includes(img.alt),img.alt);
 }
 assert.match(page,/design concept|illustrative/i);
 assert.match(page,/from \$599/i);
 const studio=marketingPage('/remodeling-preview/holiday-lighting/design');
 assert.ok(studio.includes('holiday-canvas'));
});
test('holiday plan separates product purchase and future crew review',()=>{
 const page=marketingPage('/remodeling-preview/holiday-lighting');
 assert.match(page,/buy suitable outdoor-rated lights through us|materials/i);
 assert.match(page,/takedown/i);
 assert.match(page,/site review/i);
 assert.match(page,/Alexa/);
 assert.match(page,/written quote|confirm final pricing/i);
});

test('six holiday close-ups have honest descriptions and valid image gallery structured data',()=>{
 const page=marketingPage('/remodeling-preview/holiday-lighting',{indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true});
 assert.equal(holidayCloseups.length,6);
 assert.match(page,/"@type":"ImageGallery"/);
 assert.match(page,/What different holiday lights look like on a house/);
 assert.match(page,/not photographs of completed Prescott/);
 for(const img of holidayCloseups){
  assert.ok(img.alt.length>=75);
  assert.ok(img.caption.length>=45);
  assert.equal(img.width,1200);
  assert.equal(img.height,900);
  assert.ok(page.includes(img.file));
  assert.ok(page.includes(img.thumbFile));
  assert.ok(page.includes(img.alt));
  assert.ok(page.includes('"contentUrl":"https://prescottsbestconstruction.com/site-assets/holiday-concepts/'+img.file+'"'));
 }
});

test('six approved backyard views span close, medium and long-distance, with structured data',()=>{
 const html=marketingPage('/remodeling-preview/holiday-lighting',
  {indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true});
 assert.equal(holidayBackyards.length,6);
 assert.deepEqual(holidayBackyards.reduce((m,v)=>({...m,[v.view]:(m[v.view]||0)+1}),{}),
  {close:2,medium:2,distant:2});
 assert.match(html,/id="backyard-holiday-lighting"/);
 assert.match(html,/Backyard holiday lighting, up close and from a distance/);
 assert.equal((html.match(/class="holiday-backyard-card"/g)||[]).length,6);
 assert.match(html,/Try a preview on my own backyard/);
 assert.match(html,/different sample homes, not a before-and-after sequence/);
 assert.match(html,/Do you design lighting for the backyard too/);
 const schema=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map(m=>JSON.parse(m[1])).find(x=>x['@type']==='ImageGallery');
 assert.equal(schema.image.length,23);
 for(const asset of holidayBackyards){
  assert.equal(asset.width,1200);assert.equal(asset.height,900);
  assert.ok(asset.alt.length>75);assert.ok(asset.caption.length>50);
  assert.ok(html.includes(asset.file));
  assert.ok(html.includes(asset.thumbFile));
  assert.ok(html.includes(asset.alt));
  assert.ok(schema.image.some(i=>i.contentUrl.endsWith('/'+asset.file)&&i.description===asset.alt));
 }
 const studio=marketingPage('/remodeling-preview/holiday-lighting/design');
 assert.match(studio,/front, backyard or patio photo of your home/);
 assert.match(studio,/holiday-image-consent/);
});
