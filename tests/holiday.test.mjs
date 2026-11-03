import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {holidayPackages} from '../marketing/holiday-pages.mjs';
import {holidayImages} from '../marketing/holiday-assets.mjs';
test('holiday lighting provides 4 distinct priced-as-concepts packages',()=>{
 assert.equal(holidayPackages.length,4);
 assert.equal(new Set(holidayPackages.map(p=>p.id)).size,4);
 assert.equal(holidayPackages.some(p=>p.id==='permanent'),true);
 for(const p of holidayPackages){
  assert.ok(p.features.length>=3);
  assert.ok(p.range.includes('Planning example')||p.range.includes('Research scenario'));
 }
});
test('holiday lighting and design studio render in protected preview without promises',()=>{
 for(const slug of ['/holiday-lighting','/holiday-lighting/design']){
  const html=marketingPage('/remodeling-preview'+slug,{indexable:false,origin:'https://prescottsbestremodeling.com'});
  assert.ok(html);
  assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
  assert.match(html,/Holiday Lighting/);
  assert.match(html,/\/holiday.js/);
  assert.match(html,/not (?:current offers|AI image generation)|not actual installation/i);
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
test('all 11 generated images have descriptive alt text and appear in the concept gallery',()=>{
 const page=marketingPage('/remodeling-preview/holiday-lighting');
 assert.equal(holidayImages.length,11);
 assert.equal(new Set(holidayImages.map(x=>x.file)).size,11);
 for(const img of holidayImages){
  assert.ok(img.file.endsWith('.webp'));
  assert.ok(img.alt.length>45);
  assert.ok(img.caption.length>30);
  assert.ok(page.includes('/site-assets/holiday-concepts/'+img.file),img.file);
  assert.ok(page.includes(img.alt),img.alt);
 }
 assert.match(page,/AI-generated|AI concept|AI design/i);
 assert.match(page,/not actual Prescott/i);
 const studio=marketingPage('/remodeling-preview/holiday-lighting/design');
 assert.ok(studio.includes('holiday-canvas'));
});
test('holiday plan separates product purchase and future crew review',()=>{
 const page=marketingPage('/remodeling-preview/holiday-lighting');
 assert.match(page,/buy suitable outdoor-rated lights through us|materials/i);
 assert.match(page,/takedown/i);
 assert.match(page,/site review/i);
 assert.match(page,/Alexa/);
 assert.match(page,/not current offers/);
});
