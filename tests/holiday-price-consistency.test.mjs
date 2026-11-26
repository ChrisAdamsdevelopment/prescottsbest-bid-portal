import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {holidayPackages,holidayPages} from '../marketing/holiday-pages.mjs';
import {marketingPage} from '../marketing/site.mjs';
test('owner authorized 899 base scales every seasonal package and accent',async()=>{
 const factor=899/599;
 const amounts=[599,899,1399].map(n=>Math.round(n*factor));
 const prices=amounts.map(n=>'From $'+n.toLocaleString('en-US'));
 assert.deepEqual(holidayPackages.map(p=>p.range),[...prices,'Custom quote']);
 const pages=holidayPages(p=>p);
 const landing=pages['/holiday-lighting']().body,studio=pages['/holiday-lighting/design']().body;
 for(const price of prices){assert.ok(landing.includes(price));assert.ok(studio.includes(price));}
 const tree=Math.round(149*factor);
 assert.ok(landing.includes('starts at $'+tree));
 assert.ok(landing.includes('up to 60 feet'));
 assert.ok(landing.includes('whether takedown, in-season maintenance or storage are included'));
 const source=await readFile(new URL('../public/holiday.js',import.meta.url),'utf8');
 for(const n of amounts)assert.ok(source.includes('base:'+n+','));
 assert.ok(source.includes('bush:'+tree));
 assert.ok(source.includes('base:0,'));
 for(const path of ['','/concierge']){
  const html=marketingPage('/remodeling-preview'+path,{indexable:false});
  assert.ok(html.includes('start at $899')||html.includes('starting at $899'));
  assert.ok(!html.includes('$599'));
 }
});
