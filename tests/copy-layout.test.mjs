import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {marketingPage} from '../marketing/site.mjs';
import {holidayPackages} from '../marketing/holiday-pages.mjs';

const html=path=>marketingPage('/remodeling-preview'+path,{indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});
test('home advertises available holiday service with clear entry price',()=>{
 const page=html('');
 assert.match(page,/Holiday lighting packages start at \$599/i);
 assert.doesNotMatch(page,/prices are still being finalized|if this service launches|company-specific pricing is still being validated/i);
});
test('holiday packages show published starting prices, not internal hypotheses',()=>{
 assert.deepEqual(holidayPackages.map(p=>p.range),['From $599','From $899','From $1,399','Custom quote']);
 const page=html('/holiday-lighting');
 assert.match(page,/Small ornamental tree lighting starts at \$149/i);
 assert.match(page,/Classic Roofline starts at \$599/i);
 assert.match(page,/written quote/i);
 assert.doesNotMatch(page,/starting planning price|research scenario|if this service launches|initial research baseline|not a confirmed quote/i);
});
test('image and gallery layout uses content-width caps, including browser zoom breakpoints',async()=>{
 const css=await readFile(new URL('../public/marketing.css',import.meta.url),'utf8');
 assert.match(css,/\.holiday-reference-card img,\.holiday-package-photo img/);
 assert.match(css,/max-inline-size:100%/);
 assert.match(css,/\.holiday-head-media\{overflow:hidden/);
 assert.match(html('/holiday-lighting'),/class="holiday-reference-grid"/);
});
