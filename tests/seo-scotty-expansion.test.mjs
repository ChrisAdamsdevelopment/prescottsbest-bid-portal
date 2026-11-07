import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {articles} from '../marketing/articles.mjs';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';

test('expanded homeowner guides have unique canonical public paths and meaningful sections',()=>{
 assert.equal(articles.length,18);
 assert.equal(new Set(articles.map(a=>a.slug)).size,articles.length);
 for(const a of articles){
  assert.ok(a.sections.length>=5,a.slug+' sections');
  assert.ok(a.links.length>=1,a.slug+' sources');
  const page=marketingPage('/remodeling-preview/blog/'+a.slug,{
   indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});
  assert.ok(page,a.slug+' route');
  assert.match(page,/<h1>[^<]+<\/h1>/,a.slug);
  assert.match(page,/<link rel="canonical" href="https:\/\/prescottsbestremodeling\.com\/blog\//,a.slug);
  assert.match(page,/"@type":"BlogPosting"/,a.slug);
  assert.match(page,/Related local service:/,a.slug);
  assert.ok(!page.includes('remodeling-preview/blog/'+a.slug),a.slug+' public canonical paths');
 }
});
test('two focused service landings have related guide links and sitemap routes',()=>{
 const paths=sitemapPaths();
 for(const p of ['/custom-cabinetry','/deck-building-outdoor-carpentry']){
  assert.ok(paths.includes('/remodeling-preview'+p),p+' in sitemap');
  const html=marketingPage('/remodeling-preview'+p);
  assert.ok(html,p+' page');
  assert.match(html,/Plan this kind of project/,p);
  assert.match(html,/service-related-guides/,p);
 }
 const home=marketingPage('/remodeling-preview');
 assert.match(home,/custom-cabinetry/);
 assert.match(home,/deck-building-outdoor-carpentry/);
});
test('Scotty has immediate loading message, read-latest affordance and accessible mobile panel rules',async()=>{
 const [js,css]=await Promise.all([
  readFile(new URL('../public/scotty.js',import.meta.url),'utf8'),
  readFile(new URL('../public/marketing.css',import.meta.url),'utf8')]);
 const home=marketingPage('/remodeling-preview');
 for(const id of ['scotty-response-announcement','scotty-announce-text','scotty-jump']){
  assert.match(home,new RegExp(id));
 }
 assert.match(js,/Preparing your answer/);
 assert.match(js,/moveToReply\(reply\)/);
 assert.match(js,/latestReply/);
 assert.match(css,/height:100dvh;max-height:100dvh/);
 assert.match(css,/\.scotty-chat-log\{[\s\S]*flex:1 1 auto/);
});
