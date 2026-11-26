import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {maybeServeMarketing} from '../marketing/routes.mjs';
import {realGalleryAssetNames} from '../marketing/real-project-gallery.mjs';

async function publicResource(path){
 const prior=process.env.SITE_INDEXABLE;
 process.env.SITE_INDEXABLE='true';
 let status,headers,body='';
 const res={writeHead(c,h){status=c;headers=Object.fromEntries(Object.entries(h).map(([k,v])=>[k.toLowerCase(),v]));},end(chunk){body=chunk?.toString()||'';}};
 const req={method:'GET',url:path,headers:{host:'prescottsbestconstruction.com'}};
 try{
  const handled=await maybeServeMarketing(req,res,path,{
   root:'',readFile,bad(message,code){const e=new Error(message);e.status=code;return e;}
  });
  assert.equal(handled,true,path+' handled');
  assert.equal(status,200,path+' HTTP 200');
  return {body,headers};
 }finally{
  if(prior===undefined)delete process.env.SITE_INDEXABLE;
  else process.env.SITE_INDEXABLE=prior;
 }
}
const inSitemap=(xml,path)=>{
 const loc='<loc>https://prescottsbestconstruction.com'+path+'</loc>';
 const entry=xml.split('<url>').find(x=>x.includes(loc));
 assert.ok(entry,'missing '+path);
 return entry.split('</url>')[0];
};
test('llms.txt prioritizes real local work, video and new owner installation knowledge',async()=>{
 const {body,headers}=await publicResource('/llms.txt');
 for(const path of ['/projects/gallery','/projects/andrew-at-work','/process#installation-details',
                    '/projects/crystal-creek-accessible-remodel','/projects/precision-window-casings']){
  assert.ok(body.includes('https://prescottsbestconstruction.com'+path),path);
 }
 assert.match(body,/manufacturer/i);
 assert.match(body,/Native on-site project inquiry form/);
 assert.match(body,/Visual design examples are illustrative/);
 assert.match(headers['content-type'],/text\/plain/);
 assert.ok(body.indexOf('Actual completed projects')<body.indexOf('Holiday lighting design studio'),
    'real construction should be prioritized over seasonal concepts');
});
test('llms-full has real finished photos and real installation requirements, not just old articles',async()=>{
 const {body}=await publicResource('/llms-full.txt');
 assert.match(body,/## Real Prescott.s Best projects/);
 assert.match(body,/## Manufacturer instructions and careful installation/);
 assert.match(body,/deck coating/);
 assert.match(body,/window framing\/flashing/);
 assert.match(body,/shower.s compatible waterproofing system/);
 assert.match(body,/not a blanket workmanship-warranty offer/);
 assert.match(body,/https:\/\/prescottsbestconstruction.com\/projects\/gallery/);
 assert.match(body,/https:\/\/prescottsbestconstruction.com\/projects\/andrew-at-work/);
 assert.match(body,/Bathroom Remodel Planning Checklist/);
});
test('real photos and Andrew native video are discoverable in XML sitemap',async()=>{
 const {body:xml,headers}=await publicResource('/sitemap.xml');
 assert.match(headers['content-type'],/application\/xml/);
 const gallery=inSitemap(xml,'/projects/gallery');
 const video=inSitemap(xml,'/projects/andrew-at-work');
 assert.match(gallery,/<lastmod>2026-11-21<\/lastmod>/);
 assert.match(video,/<lastmod>2026-11-21<\/lastmod>/);
 const originalImages=realGalleryAssetNames.filter(name=>
    !/-before-after-(?:before|after)\.webp$/.test(name)&&!name.includes('poster'));
 assert.equal(originalImages.length,16);
 assert.equal((gallery.match(/<image:image>/g)||[]).length,16);
 for(const name of originalImages)
  assert.ok(gallery.includes('/site-assets/real-gallery/'+name),name);
 assert.match(video,/<video:thumbnail_loc>https:\/\/prescottsbestconstruction.com\/site-assets\/real-gallery\/andrew-craftsmanship-poster.webp<\/video:thumbnail_loc>/);
 assert.match(video,/<video:content_loc>https:\/\/prescottsbestconstruction.com\/site-assets\/real-gallery\/andrew-craftsmanship-with-sound.mp4<\/video:content_loc>/);
 assert.match(video,/<video:duration>33<\/video:duration>/);
 assert.equal((video.match(/<video:video>/g)||[]).length,1);
 assert.match(inSitemap(xml,'/process'),/<lastmod>2026-11-21<\/lastmod>/);
 for(const path of ['/bathroom-remodeling','/kitchen-remodeling','/shower-conversions','/service-areas','/service-areas/prescott','/service-areas/prescott-valley','/service-areas/chino-valley','/service-areas/dewey-humboldt']) assert.match(inSitemap(xml,path),/<lastmod>2026-11-26<\/lastmod>/);
 assert.doesNotMatch(inSitemap(xml,'/blog/compare-fixed-price-and-cost-plus'),/<lastmod>2026-11-21<\/lastmod>/);
 assert.doesNotMatch(xml,/prescottsbestremodeling\.com/);
});
test('robots.txt exposes approved public media but continues to protect private API and proposals',async()=>{
 const {body}=await publicResource('/robots.txt');
 for(const asset of ['/site-assets/real-gallery/','/site-assets/real-projects/'])
  assert.ok(body.includes('Allow: '+asset+'\n'),asset);
 assert.match(body,/Disallow: \/api\//);
 assert.match(body,/Disallow: \/proposal/);
 assert.match(body,/Sitemap: https:\/\/prescottsbestconstruction.com\/sitemap.xml/);
});
