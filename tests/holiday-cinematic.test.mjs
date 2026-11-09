import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {marketingPage} from '../marketing/site.mjs';

const make=path=>marketingPage('/remodeling-preview'+(path==='/'?'':path),{indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});

test('holiday hero blends commercial into text only on holiday landing page',()=>{
 const holiday=make('/holiday-lighting');
 assert.match(holiday,/class="site-pagehead holiday-head holiday-cinematic-head" aria-labelledby="holiday-hero-heading"/);
 assert.match(holiday,/class="holiday-head-copy"><div class="holiday-copy-intro"/);
 assert.match(holiday,/class="brand-film" data-brand-film="holiday"/);
 assert.match(holiday,/A brighter home for the holidays./);
 assert.match(holiday,/Preview lights on my house/);
 assert.match(holiday,/Plan my holiday lighting/);
 assert.match(holiday,/prescotts-best-holiday-lighting-custom-audio-480\.mp4/);
 assert.match(holiday,/prescotts-best-holiday-lighting-custom-audio-720\.mp4/);
 const home=make('/');
 const design=make('/visual-design-preview');
 for(const [path,html] of [['/',home],['/visual-design-preview',design]]){
  assert.doesNotMatch(html,/holiday-cinematic-head/,path);
  assert.doesNotMatch(html,/holiday-copy-intro/,path);
  assert.match(html,/data-brand-film="/);
 }
});
test('holiday blending is responsive, uncropped on mobile and reduces motion',async()=>{
 const css=await readFile(new URL('../public/marketing.css',import.meta.url),'utf8');
 const js=await readFile(new URL('../public/brand-films.js',import.meta.url),'utf8');
 assert.match(css,/\.holiday-head\.holiday-cinematic-head/);
 assert.match(css,/holiday-cinema-vignette/);
 assert.match(css,/@media\(max-width:620px\)/);
 assert.match(css,/object-fit:contain;object-position:center center/);
 assert.match(css,/Original 16:9 film stays centered on phones/);
 assert.match(css,/object-position:center top/);
 assert.match(css,/data-player-pending/);
 assert.match(css,/\.holiday-cinematic-head\.holiday-intro-complete \.holiday-cinema-message/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(js,/video\.addEventListener\('playing'/);
 assert.match(js,/figure\.dataset\.framesReady='true'/);
 assert.match(js,/video\.currentTime>=4\.8/);
 assert.match(js,/holidayHero\.classList\.add\('holiday-intro-complete'\)/);
 assert.doesNotMatch(js,/holidayHero\.classList\.remove\('holiday-intro-complete'\)/);
 assert.match(js,/video\.muted/);
});
