import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {maybeServeMarketing} from '../marketing/routes.mjs';
import {realGalleryAssetNames} from '../marketing/real-project-gallery.mjs';

const page=path=>marketingPage('/remodeling-preview'+(path==='/'?'':path),{
 indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true
});
const root=new URL('../public/site-assets/real-gallery/',import.meta.url);

test('new real project pages render server-side with canonical clean paths',()=>{
 for(const path of ['/projects/gallery','/projects/andrew-at-work']){
  const html=page(path);
  assert.ok(html, path);
  assert.match(html,new RegExp('<link rel="canonical" href="https://prescottsbestconstruction\\.com'+path+'">'));
  assert.ok(sitemapPaths().includes('/remodeling-preview'+path));
  assert.match(html,/Real|Andrew|real/i);
 }
});
test('owner original reel plays with sound inline on homepage and project page',()=>{
 for(const path of ['/','/projects/gallery','/projects/andrew-at-work']){
  const html=page(path);
  assert.match(html,/\<video[^>]*controls[^>]*playsinline/);
  assert.match(html,/andrew-craftsmanship-with-sound\.mp4/);
  assert.match(html,/andrew-craftsmanship-poster\.webp/);
  assert.doesNotMatch(html,/iframe[^>]+instagram\.com/);
 }
});
test('all owner-supplied photo evidence has a reachable gallery route and comparison labels',()=>{
 const html=page('/projects/gallery');
 assert.equal((html.match(/data-pbc-compare/g)||[]).length,6);
 assert.equal((html.match(/data-pbc-photo=/g)||[]).length,10);
 assert.match(html,/Drag to see where it started/);
 assert.match(html,/type="range" min="5" max="95"/);
 assert.match(html,/real-gallery\.js/);
 assert.match(html,/Close enlarged photo/);
 assert.equal(realGalleryAssetNames.length,29);
});
test('real project routes surface the work from homepage, project index and services',()=>{
 assert.match(page('/'),/Browse real projects and before\/after photos/);
 assert.match(page('/projects'),/NEW · REAL PROJECT GALLERY/);
 for(const service of ['/bathroom-remodeling','/kitchen-remodeling','/room-conversions','/deck-building-outdoor-carpentry','/shower-conversions']){
  assert.match(page(service),/See real project photos/,service);
 }
});
test('every approved real photo derivative is a compressed local WebP, not the raw inbox',async()=>{
 for(const name of realGalleryAssetNames){
  assert.match(name,/^[a-z0-9-]+\.webp$/);
  const info=await stat(new URL(name,root));
  assert.ok(info.size>5000&&info.size<600000, name+' size='+info.size);
 }
 const video=await stat(new URL('andrew-craftsmanship-with-sound.mp4',root));
 assert.ok(video.size>100000&&video.size<4_000_000);
});
test('real work gets accurate search and social media metadata',()=>{
 const gallery=page('/projects/gallery');
 const video=page('/projects/andrew-at-work');
 const schemas=h=>h.split('<script type="application/ld+json">').slice(1).map(part=>JSON.parse(part.split('</script>')[0]));
 const galleryData=schemas(gallery).find(s=>s['@type']==='ImageGallery');
 const videoData=schemas(video).find(s=>s['@type']==='VideoObject');
 assert.ok(galleryData?.image?.length>=10);
 assert.ok(gallery.includes('site-assets/real-gallery/deck-stone-fireplace.webp'));
 assert.equal(videoData?.duration,'PT33S');
 assert.ok((videoData?.contentUrl||'').endsWith('andrew-craftsmanship-with-sound.mp4'));
 assert.ok(video.includes('property="og:image" content="https://prescottsbestconstruction.com/site-assets/real-gallery/andrew-craftsmanship-poster.webp"'));
});
test('owner reel permits real browser media byte ranges with strict pathname allowlist',async()=>{
 const path='/site-assets/real-gallery/andrew-craftsmanship-with-sound.mp4';
 const req={method:'HEAD',headers:{host:'prescottsbestconstruction.com',range:'bytes=0-127'},url:path};
 let code,headers,end=false;
 const res={writeHead(s,h){code=s;headers=h;},end(){end=true;}};
 const handled=await maybeServeMarketing(req,res,path,{root:'',readFile,bad(){}});
 assert.equal(handled,true);
 assert.equal(code,206);
 assert.equal(headers['Content-Length'],128);
 assert.match(headers['Content-Range'],/^bytes 0-127\//);
 assert.equal(headers['Content-Type'],'video/mp4');
 assert.equal(end,true);
});
