import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {marketingPage} from '../marketing/site.mjs';
import {brandFilmData,brandFilmForPath,brandFilmJsonLd,brandFilmAssets} from '../marketing/brand-films.mjs';

const origin='https://prescottsbestremodeling.com';
const cases=[
 ['/', 'home','prescotts-best-home-remodeling-new-hero-audio'],
 ['/holiday-lighting','holiday','prescotts-best-holiday-lighting-custom-audio'],
 ['/visual-design-preview','design','prescotts-best-design-center']
];
function render(path){
 return marketingPage('/remodeling-preview'+(path==='/'?'':path),
  {indexable:true,origin,cleanPaths:true});
}
function schema(html){
 return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x=>JSON.parse(x[1]));
}
test('each commercial is on its correct page with poster, controls, a text description and accessible fallback',()=>{
 for(const [path,id,slug] of cases){
  const page=render(path);
  assert.equal((page.match(/data-brand-film="/g)||[]).length,1,path);
  assert.match(page,new RegExp('data-brand-film="'+id+'"'));
  assert.ok(page.includes('/site-assets/brand-films/'+(id==='home'?'prescotts-best-home-remodeling':id==='holiday'?'prescotts-best-holiday-lighting':slug)+'-poster.webp'));
  assert.ok(page.includes('/site-assets/brand-films/'+slug+'-720.mp4'));
  assert.ok(page.includes('/site-assets/brand-films/'+slug+'-480.mp4'));
  assert.match(page,/<video[^>]+data-brand-video controls muted playsinline loop preload="none"/);
  assert.match(page,/data-film-controls hidden/);
  assert.match(page,/data-film-toggle aria-label=/);
  assert.match(page,/data-film-sound aria-label=/);
  assert.match(page,/alt="[^"]{35,}"/);
  assert.match(page,/class="brand-film-description"/);
  assert.match(page,/href="\/remodeling-preview\/schedule/);
  assert.ok(brandFilmForPath(path));
  if(id==='home')assert.doesNotMatch(page,/src="[^"]*prescotts-best-home-remodeling-(?:480|720)\.mp4"/);
  if(id==='holiday')assert.doesNotMatch(page,/src="[^"]*prescotts-best-holiday-lighting-(?:480|720)\.mp4"/);
  const metadata=schema(page).filter(x=>x['@type']==='VideoObject');
  assert.equal(metadata.length,1,path+' VideoObject');
  const v=metadata[0];
  assert.equal(v.contentUrl,origin+'/site-assets/brand-films/'+slug+'-720.mp4');
  assert.equal(v.thumbnailUrl[0],origin+'/site-assets/brand-films/'+(id==='home'?'prescotts-best-home-remodeling':id==='holiday'?'prescotts-best-holiday-lighting':slug)+'-poster.webp');
  assert.equal(v.duration,'PT10S');
  assert.equal(v.uploadDate,'2026-11-08T00:00:00-07:00');
  assert.match(v.uploadDate,/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/);
  assert.ok(Number.isFinite(Date.parse(v.uploadDate)));
  assert.equal(v.name,brandFilmData[id].title);
  assert.ok(v.description.length>100);
  assert.ok(page.includes('og:image:alt'));
  assert.ok(page.includes((id==='home'?'prescotts-best-home-remodeling':id==='holiday'?'prescotts-best-holiday-lighting':slug)+'-poster.webp'));
 }
 assert.ok(render('/').includes('commercial-hero'));
 assert.ok(render('/holiday-lighting').includes('A brighter home for the holidays.'));
 assert.ok(render('/visual-design-preview').includes('visual-preview-hero-copy'));
 assert.ok(!render('/bathroom-remodeling').includes('data-brand-film='));
 assert.equal(brandFilmJsonLd('/bathroom-remodeling'),null);
});
test('all nine optimized commercial assets exist, have expected magic bytes and sensible dimensions',async()=>{
 assert.equal(brandFilmAssets.length,9);
 const unique=new Set(brandFilmAssets.map(a=>a.path));assert.equal(unique.size,9);
 const list=[];
 for(const asset of brandFilmAssets){
  assert.match(asset.path,/^\/site-assets\/brand-films\/[a-z0-9-]+\.(mp4|webp)$/);
  const file=new URL('../public'+asset.path,import.meta.url);
  const info=await stat(file),buffer=await readFile(file);
  assert.ok(info.size>=20000);
  assert.ok(info.size<(asset.type==='video/mp4'?3000000:220000));
  assert.equal(info.size,buffer.length);
  if(asset.type==='video/mp4'){
   assert.equal(buffer.toString('ascii',4,8),'ftyp',asset.name);
   assert.ok(buffer.includes(Buffer.from('moov')),'faststart metadata in '+asset.name);
  }else assert.equal(buffer.toString('ascii',0,4),'RIFF',asset.name);
  list.push(asset.name);
 }
 assert.equal(list.filter(n=>n.endsWith('720.mp4')).length,3);
 assert.equal(list.filter(n=>n.endsWith('480.mp4')).length,3);
 assert.equal(list.filter(n=>n.endsWith('poster.webp')).length,3);
});
test('playback scripts respect reduced motion and offscreen playback, without user-data analytics',async()=>{
 const js=await readFile(new URL('../public/brand-films.js',import.meta.url),'utf8');
 assert.match(js,/prefers-reduced-motion: reduce/);
 assert.match(js,/navigator\.connection\?\.saveData/);
 assert.match(js,/IntersectionObserver/);
 assert.match(js,/video\.muted/);
 assert.match(js,/chosenPause/);
 assert.match(js,/video\.play\(\)/);
 assert.match(js,/video\.controls=false/);
 assert.doesNotMatch(js,/fetch\(/);
 const home=render('/');
 assert.match(home,/src="\/brand-films\.js"/);
 assert.match(home,/class="brand-film hero-visual brand-film-hero"/);
});
