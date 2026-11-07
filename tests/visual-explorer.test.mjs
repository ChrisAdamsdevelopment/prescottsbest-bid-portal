import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {allVisualImages,visualExplorersForService,visualGroups} from '../marketing/visual-catalog.mjs';

test('visual design studio has 30 unique image variants and matching thumbnails',async()=>{
 const all=allVisualImages();
 assert.equal(all.length,30);
 assert.equal(visualGroups().length,5);
 assert.equal(new Set(all.map(v=>v.file)).size,30);
 for(const v of all){
  assert.ok(v.alt.length>55,v.file);
  assert.ok(v.caption.length>30,v.file);
  for(const p of [v.file,v.thumb]){
   const file=new URL('../public'+p,import.meta.url);
   assert.ok((await stat(file)).size>5000,p);
   const data=await readFile(file);
   assert.equal(data.toString('ascii',0,4),'RIFF',p);
  }
 }
});
test('cabinetry and decks have interactive visual choices, no customer-data upload, and JSON-LD images',()=>{
 const cases=[['/custom-cabinetry',2,12],['/deck-building-outdoor-carpentry',1,6],['/kitchen-remodeling',2,12]];
 for(const [path,modules,count] of cases){
  const page=marketingPage('/remodeling-preview'+path,{indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});
  assert.ok(page,'page rendered '+path);
  assert.equal((page.match(/class="site-section visual-explorer"/g)||[]).length,modules,path);
  assert.equal((page.match(/data-visual-catalog/g)||[]).length,modules,path);
  assert.match(page,/visual-explorer\.js/);
  assert.match(page,/aria-pressed="true"/);
  assert.match(page,/Save this look/);
  assert.match(page,/Copy design details/);
  const gallery=[...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
   .map(x=>JSON.parse(x[1])).find(x=>x['@type']==='ImageGallery');
  assert.ok(gallery,path+' ImageGallery');
  assert.equal(gallery.image.length,count);
  assert.ok(gallery.image.every(x=>x['@type']==='ImageObject'&&x.contentUrl.includes('/site-assets/visual-explorer/')&&x.description.length>40));
  assert.ok(sitemapPaths().includes('/remodeling-preview'+path));
 }
 assert.equal(visualExplorersForService('/bathroom-remodeling').length,0);
});
test('visual studio JavaScript has scoped local look state and never autosends customer data',async()=>{
 const code=await readFile(new URL('../public/visual-explorer.js',import.meta.url),'utf8');
 assert.match(code,/data-visual-explorer/);
 assert.match(code,/aria-pressed/);
 assert.match(code,/localStorage/);
 assert.match(code,/navigator.clipboard/);
 assert.doesNotMatch(code,/fetch\(/);
 assert.doesNotMatch(code,/XMLHttpRequest/);
});

test('kitchen inspiration separates whole-room views from finish details without a false fixed-room comparison',()=>{
 const html=marketingPage('/remodeling-preview/kitchen-remodeling',
  {indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});
 assert.match(html,/KITCHEN STYLE EXPLORER/);
 assert.match(html,/Light & bright/);
 assert.match(html,/Warm medium wood/);
 assert.match(html,/Deep dark wood/);
 assert.match(html,/Whole kitchen/);
 assert.match(html,/Finish close-up/);
 assert.match(html,/different design idea/);
 assert.match(html,/six visual-reference boards/i);
 assert.equal(visualExplorersForService('/kitchen-remodeling').length,2);
 const data=visualExplorersForService('/kitchen-remodeling');
 const scene=data[0],wood=data[1];
 assert.equal(scene.variants.length,6);
 assert.equal(wood.variants.length,6);
 assert.ok(scene.variants.every(v=>v.width===860&&v.height===580));
 assert.ok(wood.variants.every(v=>v.width===900&&v.height===1125));
 const parsed=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map(x=>JSON.parse(x[1])).find(x=>x['@type']==='ImageGallery');
 assert.equal(parsed.image.length,12);
 assert.equal(parsed.image.filter(x=>x.width===860&&x.height===580).length,6);
 assert.equal(parsed.image.filter(x=>x.width===900&&x.height===1125).length,6);
});
