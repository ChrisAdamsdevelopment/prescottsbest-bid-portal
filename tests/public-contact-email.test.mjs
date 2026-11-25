import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {readFileSync} from 'node:fs';
const email='andrew@prescottsbestconstruction.com';
const old='chris@prescottsbestconstruction.com';
test('all public sitemap pages expose Andrew only as the public contact',()=>{
 for(const path of sitemapPaths()){
  const route=path.startsWith('/remodeling-preview')?path:'/remodeling-preview'+(path==='/'?'':path);
  const html=marketingPage(route,{indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true});
  assert.ok(html,path);
  assert.ok(html.includes('mailto:'+email),path);
  assert.ok(!html.toLowerCase().includes(old),path);
 }
});
test('public email fallback scripts do not expose internal mailbox',()=>{
 for(const path of ['public/marketing.js','public/holiday.js']){
  const js=readFileSync(new URL('../'+path,import.meta.url),'utf8');
  assert.ok(js.includes(email),path);
  assert.ok(!js.toLowerCase().includes(old),path);
 }
});
