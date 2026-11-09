import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {marketingPage} from '../marketing/site.mjs';
import {voiceGuideConfig,voiceGuideForPath,voiceGuideAudioAssets} from '../marketing/voice-guides.mjs';

const pages=[
 ['/holiday-lighting/design','holiday-designer','holiday-workspace','holiday-lighting-designer-instructions-v1.m4a'],
 ['/visual-design-preview','design-center','id="preview-examples"','design-center-instructions-v1.m4a'],
 ['/estimate','budget-explorer','id="budget-form"','budget-explorer-instructions-v1.m4a']
];
const render=path=>marketingPage('/remodeling-preview'+path,{indexable:false});

test('three advanced tools have a visible, one-tap read-aloud control and a full transcript',()=>{
 for(const [route,id,marker,file] of pages){
  const html=render(route);
  assert.ok(html,route);
  assert.ok(html.includes('data-voice-guide="'+id+'"'),route);
  assert.ok(html.includes('data-guide-audio="/site-assets/audio-guides/'+file+'"'),route);
  assert.equal(voiceGuideConfig[route].audioFile,file);
  assert.equal((html.match(/data-voice-guide="/g)||[]).length,1,route);
  assert.match(html,/<button[^>]+data-guide-open[^>]+aria-expanded="false"/);
  assert.match(html,/<button[^>]+data-guide-pause disabled/);
  assert.match(html,/<button[^>]+data-guide-restart/);
  assert.match(html,/<button[^>]+data-guide-close/);
  assert.match(html,/<details class="voice-guide-transcript">/);
  assert.match(html,/role="status" aria-live="polite"/);
  assert.ok(html.indexOf('data-voice-guide=')<html.indexOf(marker),route);
  assert.match(html,/<script defer src="\/voice-guides.js\?v=recorded-guides-20261109"/);
  assert.match(html,/marketing.css\?v=voice-guides-20261109/);
  assert.equal(voiceGuideConfig[route].steps.length,4,route);
  assert.ok(voiceGuideConfig[route].steps.every(x=>x.length>65));
  assert.match(voiceGuideForPath(route),/data-guide-speech="/);
 }
});

test('guides are scoped, visible instructions not marketing autoplay',async()=>{
 for(const route of ['/', '/holiday-lighting','/kitchen-remodeling','/schedule']){
  assert.equal(voiceGuideForPath(route),'');
  assert.doesNotMatch(render(route),/data-voice-guide="/,route);
 }
 const code=await readFile(new URL('../public/voice-guides.js',import.meta.url),'utf8');
 assert.match(code,/speechSynthesis/);
 assert.match(code,/SpeechSynthesisUtterance/);
 assert.match(code,/data-guide-open/);
 assert.match(code,/\.pause\(\)/);
 assert.match(code,/\.resume\(\)/);
 assert.match(code,/\.cancel\(\)/);
 assert.match(code,/pagehide/);
 assert.match(code,/new Audio\(path\)/);
 assert.doesNotMatch(code,/fetch\(|getUserMedia\(|XMLHttpRequest/);
 assert.equal(voiceGuideAudioAssets.length,3);
 for(const [, , , file] of pages){
  const expected='/site-assets/audio-guides/'+file;
  assert.ok(voiceGuideAudioAssets.some(x=>x.path===expected&&x.type==='audio/mp4'));
  const data=await readFile(new URL('../public'+expected,import.meta.url));
  assert.ok(data.length>100_000);
  assert.equal(data.toString('ascii',4,8),'ftyp');
 }
 const routes=await readFile(new URL('../marketing/routes.mjs',import.meta.url),'utf8');
 assert.match(routes,/\'\/voice-guides\.js\':\['public\/voice-guides\.js\'/);
 assert.match(routes,/voiceGuideAudioAssets\.find\(x=>x\.path===path\)/);
});
