import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {marketingPage} from '../marketing/site.mjs';
const page=path=>marketingPage('/remodeling-preview'+(path==='/'?'':path),{
 indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});
test('remodeling homepage has editorial film and real, reachable next steps',()=>{
 const html=page('/');
 assert.match(html,/class="site-hero concept-hero commercial-hero cinema-hero cinema-home"/);
 assert.match(html,/class="cinema-scene"/);
 assert.match(html,/class="cinema-message"/);
 assert.match(html,/Made for the way you live/);
 assert.match(html,/id="home-hero-heading"/);
 assert.ok(html.indexOf('class="cinema-scene"')<html.indexOf('class="hero-copy cinema-copy"'));
 assert.match(html,/href="\/remodeling-preview\/estimate"/);
 assert.match(html,/href="\/remodeling-preview\/schedule"/);
 assert.match(html,/href="\/remodeling-preview\/project-guide"/);
 assert.equal((html.match(/data-brand-film="home"/g)||[]).length,1);
});
test('Design Center begins with cinematic film before contextual category navigation',()=>{
 const html=page('/visual-design-preview');
 assert.match(html,/class="site-pagehead visual-preview-hero cinema-hero cinema-design"/);
 assert.match(html,/Picture what comes next/);
 assert.match(html,/id="design-hero-heading"/);
 assert.ok(html.indexOf('class="cinema-scene"')<html.indexOf('class="design-center-nav"'));
 assert.match(html,/id="preview-examples"/);
 assert.match(html,/Saved looks/);
 const nav=html.match(/<nav class="design-center-nav"[\s\S]*?<\/nav>/)?.[0];
 assert.ok(nav);
 assert.doesNotMatch(nav,/My Ideas|data-inspiration-count|>0<\/span>/);
 assert.ok(nav.includes('kitchen-remodeling#wood-stain-boards'));
 assert.ok(nav.includes('custom-cabinetry#hardware-exterior'));
 assert.ok(nav.includes('visual-design-preview#my-inspiration-list'));
 assert.equal((html.match(/data-brand-film="design"/g)||[]).length,1);
});
test('Holiday spacing and shared cinematic behavior preserve the approved film',async()=>{
 const html=page('/holiday-lighting');
 assert.match(html,/A brighter home for the holidays/);
 assert.ok(html.indexOf('class="holiday-cinema-scene"')<html.indexOf('class="design-center-nav"'));
 const css=await readFile(new URL('../public/marketing.css',import.meta.url),'utf8');
 const js=await readFile(new URL('../public/brand-films.js',import.meta.url),'utf8');
 assert.match(css,/\.holiday-cinema-message span\{margin-bottom:20px\}/);
 assert.match(css,/\.cinema-hero\.holiday-intro-complete \.cinema-message/);
 assert.match(css,/\.cinema-hero \.cinema-scene \.brand-film\[data-frames-ready="true"\]/);
 assert.match(js,/closest\('\.holiday-cinematic-head, \.cinema-hero'\)/);
 assert.match(js,/video\.currentTime>=4\.8/);
});
