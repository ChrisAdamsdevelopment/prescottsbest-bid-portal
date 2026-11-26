import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {existsSync} from 'node:fs';
import {jandjReels,jandjPath} from '../marketing/jandj-project.mjs';
test('signature page renders five real native clips, explicit illustration disclosure, credits and canonical',()=>{
 const html=marketingPage('/remodeling-preview'+jandjPath,{indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true});
 assert.equal((html.match(/<video controls playsinline/g)||[]).length,5);
 assert.ok(html.includes('AI-assisted architectural reconstructions'));
 assert.ok(html.includes('James &amp; James Construction'));
 assert.ok(html.includes('Niche Design Co.'));
 assert.ok(html.includes('https://prescottsbestconstruction.com'+jandjPath));
 assert.ok(sitemapPaths().some(p=>p.endsWith(jandjPath)));
 for(const [id,title,stem] of jandjReels){
  assert.ok(html.includes(id));
  for(const ext of ['-720.mp4','-poster.webp'])assert.ok(existsSync(new URL('../public/site-assets/real-projects/'+stem+ext,import.meta.url)));
 }
 for(const path of ['/','/projects']){
  const html=marketingPage('/remodeling-preview'+(path==='/'?'':path));
  assert.ok(html.includes(jandjPath));
 }
});
