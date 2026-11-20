import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {windowCasingCaseStudyPage,instagramProjectMedia} from '../marketing/instagram-project-proof.mjs';
import {crystalCreekCaseStudyPage,projectsIndexPage} from '../marketing/restored-homeowner-pages.mjs';

const link=path=>'/remodeling-preview'+path;
const source=readFileSync(new URL('../server.mjs',import.meta.url),'utf8');

test('two actual company reels play natively and 20 public project photos stay on PBC',()=>{
 const gallery=[instagramProjectMedia('casings','Casing preparation','From the workbench'),
   instagramProjectMedia('crystalPhotos','Crystal Creek photos','Large-format tile'),
   instagramProjectMedia('crystalProgress','Crystal Creek progress','Waterproofing work')].join('');
 for(const path of ['/reel/C1VllESr9tH/','/p/DV162KsgUxP/','/reel/DVR_JdVAWff/']){
   assert.ok(gallery.includes('https://www.instagram.com'+path),path);
 }
 for(const stem of ['window-casing-workbench','crystal-creek-shower-construction']){
   for(const width of ['480','720'])assert.match(gallery,new RegExp(stem+'-'+width+'\.mp4'));
   assert.match(gallery,new RegExp(stem+'-poster\.webp'));
 }
 assert.equal((gallery.match(/<video\b/g)||[]).length,2);
 assert.equal((gallery.match(/playsinline/g)||[]).length,2);
 assert.equal((gallery.match(/preload="none"/g)||[]).length,2);
 assert.match(gallery,/data-project-video="casings"/);
 assert.match(gallery,/data-project-video="crystalProgress"/);
 assert.match(gallery,/data-project-gallery="crystalPhotos"/);
 assert.equal((gallery.match(/class="real-gallery-slide"/g)||[]).length,20);
 assert.equal((gallery.match(/loading="lazy"/g)||[]).length,20);
 assert.match(gallery,/data-gallery-prev/);
 assert.match(gallery,/data-gallery-next/);
 assert.match(gallery,/aria-live="polite"/);
 assert.match(gallery,/Instagram source \(optional\)/);
 assert.match(gallery,/without the Instagram soundtrack/);
 assert.doesNotMatch(gallery,/<iframe\b|instagram-embed-load|Watch on Instagram/);
 assert.match(source,/script-src 'self'/);
 assert.doesNotMatch(source,/script-src[^;]*unsafe-inline/);
});

test('all 26 optimized original project media assets are present for production',()=>{
 for(const stem of ['window-casing-workbench','crystal-creek-shower-construction']){
   for(const width of [480,720]){
     const stats=statSync(new URL('../public/site-assets/real-projects/'+stem+'-'+width+'.mp4',import.meta.url));
     assert.ok(stats.size>100_000&&stats.size<8_000_000,stem+' '+width);
   }
   assert.ok(statSync(new URL('../public/site-assets/real-projects/'+stem+'-poster.webp',import.meta.url)).size>1000);
 }
 for(let i=1;i<=20;i++){
   const filename='crystal-creek-project-'+String(i).padStart(2,'0')+'.webp';
   const stats=statSync(new URL('../public/site-assets/real-projects/'+filename,import.meta.url));
   assert.ok(stats.size>1000&&stats.size<400_000,filename);
 }
});

test('precision casing proof remains a canonical project story linked to finish carpentry',()=>{
 const page=windowCasingCaseStudyPage(link);
 assert.match(page.title,/Precision Window Casing/);
 assert.match(page.body,/preassembled window casing/i);
 assert.match(page.body,/real process shots/i);
 assert.match(page.body,/href="\/remodeling-preview\/finish-carpentry"/);
 assert.match(page.body,/data-project-video="casings"/);
 const html=marketingPage('/remodeling-preview/projects/precision-window-casings');
 assert.match(html,/Precision starts before the trim reaches the wall/);
 assert.match(html,/window-casing-workbench-480\.mp4/);
 assert.doesNotMatch(html,/\/instagram-projects\.js|\/project-gallery\.js/);
 assert.match(html,/meta name="robots" content="noindex,nofollow"/);
 assert.ok(sitemapPaths().includes('/remodeling-preview/projects/precision-window-casings'));
});

test('Crystal Creek story distinguishes original progress footage and finished-work photos',()=>{
 const article=crystalCreekCaseStudyPage(link);
 assert.match(article.body,/two concrete support posts/);
 assert.match(article.body,/data-project-gallery="crystalPhotos"/);
 assert.match(article.body,/data-project-video="crystalProgress"/);
 assert.match(article.body,/they do not document the crawlspace structural work/);
 assert.match(article.body,/fixtures and glass still being scheduled at that stage/);
 assert.match(article.body,/href="\/remodeling-preview\/accessible-aging-in-place-remodeling"/);
 const html=marketingPage('/remodeling-preview/projects/crystal-creek-accessible-remodel');
 assert.match(html,/\/project-gallery\.js/);
 assert.match(html,/crystal-creek-project-20\.webp/);
 const projects=projectsIndexPage(link);
 assert.match(projects.body,/\/projects\/precision-window-casings/);
 assert.match(projects.body,/\/projects\/crystal-creek-accessible-remodel/);
 assert.match(projects.body,/Planning concepts are labeled separately/);
 assert.doesNotMatch(projects.body,/href="https:\/\/www\.instagram\.com/);
});

test('high-intent service page and homepage link internally to real project evidence',()=>{
 const carpentry=marketingPage('/remodeling-preview/finish-carpentry');
 const bathroom=marketingPage('/remodeling-preview/bathroom-remodeling');
 const shower=marketingPage('/remodeling-preview/shower-conversions');
 const home=marketingPage('/remodeling-preview');
 assert.match(bathroom,/\/projects\/crystal-creek-accessible-remodel/);
 assert.match(shower,/\/projects\/crystal-creek-accessible-remodel/);
 assert.match(home,/Prescott Valley Kitchen &amp; Bathroom Remodeling/);
 assert.match(home,/instagram\.com\/prescottsbestconstruction/);
 assert.match(carpentry,/\/projects\/precision-window-casings/);
 assert.match(home,/\/projects\/precision-window-casings/);
 assert.match(home,/\/projects\/crystal-creek-accessible-remodel/);
 assert.doesNotMatch(home,/\/instagram-projects\.js/);
});
