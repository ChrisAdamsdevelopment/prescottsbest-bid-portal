import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {marketingPage} from '../marketing/site.mjs';

test('homepage seasonal block uses requested tree, not old cropped house',async()=>{
 const html=marketingPage('/remodeling-preview',{indexable:false,origin:'https://prescottsbestremodeling.com'});
 assert.match(html,/holiday-gnarled-tree-twilight-960\.webp/);
 assert.match(html,/holiday-gnarled-tree-twilight-1672\.webp/);
 assert.doesNotMatch(html,/22-backyard-warm-roofline-long-view\.webp/);
 assert.match(html,/width="1672" height="941"/);
 assert.match(html,/loading="lazy" decoding="async"/);
 assert.match(html,/Holiday lighting concept illustration/);
 assert.match(html,/marketing\.css\?v=voice-guides-20261109/);
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
