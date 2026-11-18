import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {windowCasingCaseStudyPage,instagramProjectMedia} from '../marketing/instagram-project-proof.mjs';
import {crystalCreekCaseStudyPage,projectsIndexPage} from '../marketing/restored-homeowner-pages.mjs';

const link=path=>'/remodeling-preview'+path;
const frame=readFileSync(new URL('../public/instagram-projects.js',import.meta.url),'utf8');
const source=readFileSync(new URL('../server.mjs',import.meta.url),'utf8');

test('all three original Instagram posts are linked, attributed and only loaded on user action',()=>{
 const gallery=[instagramProjectMedia('casings','Casing preparation','From the workbench'),
   instagramProjectMedia('crystalPhotos','Crystal Creek photos','Large-format tile'),
   instagramProjectMedia('crystalProgress','Crystal Creek progress','Waterproofing work')].join('');
 for(const path of ['/reel/C1VllESr9tH/','/p/DV162KsgUxP/','/reel/DVR_JdVAWff/']){
   assert.ok(gallery.includes('https://www.instagram.com'+path),path);
 }
 assert.match(gallery,/data-instagram-post="casings"/);
 assert.match(gallery,/data-instagram-post="crystalPhotos"/);
 assert.match(gallery,/data-instagram-post="crystalProgress"/);
 assert.match(gallery,/Instagram may set cookies/);
 assert.doesNotMatch(gallery,/<iframe|<img\b/);
 assert.match(frame,/document\.addEventListener\('click'/);
 assert.match(frame,/Object\.hasOwn\(originals,key\)/);
 assert.match(frame,/instagram\.com\/'.*embed\//);
 assert.match(source,/frame-src https:\/\/www\.instagram\.com/);
 assert.match(source,/script-src 'self'/);
 assert.doesNotMatch(source,/script-src[^;]*unsafe-inline/);
});

test('precision casing proof is a canonical project story linked to finish carpentry',()=>{
 const page=windowCasingCaseStudyPage(link);
 assert.match(page.title,/Precision Window Casing/);
 assert.match(page.body,/preassembled window casing/i);
 assert.match(page.body,/real process shots/i);
 assert.match(page.body,/href="\/remodeling-preview\/finish-carpentry"/);
 assert.match(page.body,/data-instagram-post="casings"/);
 const html=marketingPage('/remodeling-preview/projects/precision-window-casings');
 assert.match(html,/Precision starts before the trim reaches the wall/);
 assert.match(html,/\/instagram-projects\.js/);
 assert.match(html,/meta name="robots" content="noindex,nofollow"/);
 assert.ok(sitemapPaths().includes('/remodeling-preview/projects/precision-window-casings'));
});

test('existing Crystal Creek story retains evidence distinctions while showing original media',()=>{
 const article=crystalCreekCaseStudyPage(link);
 assert.match(article.body,/two concrete support posts/);
 assert.match(article.body,/data-instagram-post="crystalPhotos"/);
 assert.match(article.body,/data-instagram-post="crystalProgress"/);
 assert.match(article.body,/does not itself document the crawlspace structural work/);
 assert.match(article.body,/glass and some fixtures were still being scheduled/);
 assert.match(article.body,/href="\/remodeling-preview\/accessible-aging-in-place-remodeling"/);
 const projects=projectsIndexPage(link);
 assert.match(projects.body,/\/projects\/precision-window-casings/);
 assert.match(projects.body,/\/projects\/crystal-creek-accessible-remodel/);
 assert.match(projects.body,/Planning concepts are labeled separately/);
});

test('high-intent service page and homepage link to real project evidence',()=>{
 const carpentry=marketingPage('/remodeling-preview/finish-carpentry');
 const home=marketingPage('/remodeling-preview');
 assert.match(carpentry,/\/projects\/precision-window-casings/);
 assert.match(home,/\/projects\/precision-window-casings/);
 assert.match(home,/\/projects\/crystal-creek-accessible-remodel/);
 assert.doesNotMatch(home,/\/instagram-projects\.js/);
});
