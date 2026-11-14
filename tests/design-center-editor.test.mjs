import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {marketingPage} from '../marketing/site.mjs';
import {validateInspirationSelections} from '../marketing/inspiration-selections.mjs';
import {holidayImages} from '../marketing/holiday-assets.mjs';
const page=(path)=>marketingPage('/remodeling-preview'+(path==='/'?'':path),
 {indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true});

test('home page elevates holiday lights with a dedicated first-screen offer and direct studio link',()=>{
 const home=page('/');
 const holiday=home.indexOf('class="holiday-home-feature"');
 const storm=home.indexOf('class="storm-home-banner"');
 const general=home.indexOf('See it before we build it.');
 assert.ok(holiday>0&&holiday<storm&&holiday<general,'seasonal feature should be easy to find');
 assert.match(home,/Design lights on my home/);
 assert.match(home,/View lighting packages &amp; gallery|View lighting packages & gallery/);
 assert.match(home,/HOLIDAY LIGHTING/);
 assert.match(home,/href="\/remodeling-preview\/holiday-lighting"/);
 assert.match(home,/href="\/remodeling-preview\/holiday-lighting\/design"/);
 assert.match(home,/aria-label="Main navigation"/);
});
test('Design Center offers six categories, saved ideas and cross-navigation on every design page',()=>{
 const paths=['/visual-design-preview','/kitchen-remodeling','/custom-cabinetry','/deck-building-outdoor-carpentry','/holiday-lighting','/holiday-lighting/design'];
 for(const route of paths){
  const html=page(route);
  assert.equal((html.match(/class="design-center-nav"/g)||[]).length,1,route);
  assert.match(html,/aria-label="Design Center — switch design categories"/);
  for(const path of ['/kitchen-remodeling#wood-stain-boards','/custom-cabinetry#hardware-exterior',
                     '/deck-building-outdoor-carpentry#deck-inspiration','/holiday-lighting/design',
                     '/visual-design-preview#my-inspiration-list']){
   assert.ok(html.includes('/remodeling-preview'+path),route+' -> '+path);
  }
  assert.match(html,/data-inspiration-count/);
 }
 const hub=page('/visual-design-preview');
 assert.equal((hub.match(/class="visual-preview-card"/g)||[]).length,6);
 assert.match(hub,/Compare six full-room finish combinations/);
 assert.match(hub,/Knobs, handles &amp; hinges/);
});
test('holiday editor starts clean and supports drawing, selecting, erasing, undo, redo and before-after',async()=>{
 const studio=page('/holiday-lighting/design');
 for(const name of ['holiday-tool-draw','holiday-tool-select','holiday-tool-erase','holiday-finish',
   'holiday-undo','holiday-redo','holiday-delete','holiday-reset','holiday-before','holiday-strand-list',
   'holiday-add-idea']){
  assert.ok(studio.includes('id="'+name+'"'),name);
 }
 assert.match(studio,/sample starts without lights/i);
 assert.match(studio,/light runs/i);
 const code=await readFile(new URL('../public/holiday.js',import.meta.url),'utf8');
 assert.match(code,/strokes=\[\]/);
 assert.match(code,/drawingId=null/);
 assert.match(code,/hitRun\(point\)/);
 assert.match(code,/run\.tone=toneSelect\.value/);
 assert.match(code,/deleteRun\(id\)/);
 assert.match(code,/undoChange=/);
 assert.match(code,/redoChange=/);
 assert.match(code,/View original photo/);
 assert.doesNotMatch(code,/points=sample\?/);
});
test('holiday inspiration choices use approved public images and reject arbitrary customer paths',()=>{
 const item=holidayImages.find(x=>x.id==='classic');
 const file='/site-assets/holiday-concepts/'+item.file;
 const picks=validateInspirationSelections([
  {explorerId:'holiday-lighting',file,note:'Warm white on the backyard roof'},
  {explorerId:'holiday-lighting',file,note:'Duplicate choice'}
 ]);
 assert.equal(picks.length,1);
 assert.equal(picks[0].name,item.title);
 assert.equal(picks[0].note,'Warm white on the backyard roof');
 assert.equal(picks[0].url,'https://prescottsbestconstruction.com'+file);
 assert.throws(()=>validateInspirationSelections([{explorerId:'holiday-lighting',file:'/proposal/secret'}]));
 assert.throws(()=>validateInspirationSelections([{explorerId:'holiday-lighting',file:'/site-assets/holiday-concepts/not-listed.webp'}]));
});
