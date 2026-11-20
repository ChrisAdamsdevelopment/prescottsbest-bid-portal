import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {marketingPage} from '../marketing/site.mjs';

test('homepage keeps seasonal lighting accessible without placing concept art above remodeling proof',async()=>{
 const html=marketingPage('/remodeling-preview',{indexable:false,origin:'https://prescottsbestremodeling.com'});
 assert.match(html,/ALSO AVAILABLE · SEASONAL/);
 assert.match(html,/Explore holiday lighting/);
 assert.doesNotMatch(html,/22-backyard-warm-roofline-long-view\.webp/);
 assert.doesNotMatch(html,/class="holiday-home-feature"/);
 assert.ok(html.indexOf("id=\"services\"")<html.indexOf("ALSO AVAILABLE · SEASONAL"));
 assert.match(html,/holiday-lighting\/design/);
 assert.match(html,/marketing\.css\?v=real-project-media-20261118/);
 const css=await readFile(new URL('../public/marketing.css',import.meta.url),'utf8');
 assert.match(css,/\.holiday-home-feature-photo img\{display:block;width:100%;height:auto;max-width:100%;aspect-ratio:auto;object-fit:contain;/);
 assert.doesNotMatch(css,/\.holiday-home-feature-photo img\{width:100%;aspect-ratio:4\/3;object-fit:cover;/);
 for(const width of ['960','1672']){
  const name='holiday-gnarled-tree-twilight-'+width+'.webp';
  const content=await readFile(new URL('../public/site-assets/homepage/'+name,import.meta.url));
  assert.equal(content.toString('ascii',0,4),'RIFF');
  assert.equal(content.toString('ascii',8,12),'WEBP');
  assert.ok((await stat(new URL('../public/site-assets/homepage/'+name,import.meta.url))).size>50_000);
 }
});
