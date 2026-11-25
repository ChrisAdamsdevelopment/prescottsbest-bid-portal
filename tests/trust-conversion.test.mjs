import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage} from '../marketing/site.mjs';
import {readFile} from 'node:fs/promises';

const page=p=>marketingPage('/remodeling-preview'+p,{indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true});
test('server HTML shows native submission first, not mail-client handoff',()=>{
 const contact=page('/schedule');
 assert.match(contact,/<button class="site-button primary" type="submit">Send my project request<\/button>/);
 assert.match(contact,/<div id="lead-unavailable"[^>]*hidden>/);
 assert.doesNotMatch(contact,/Open email draft to Chris|No preview or appointment is automatically promised/);
 assert.match(contact,/No account or commitment needed/);
 assert.match(contact,/mailto:andrew@prescottsbestconstruction\.com/);
 assert.doesNotMatch(contact,/concepts\/consultation/);
});
test('high-trust homepage prioritizes direct inquiry and authentic evidence',()=>{
 const home=page('/');
 assert.match(home,/4\.8\/5 on Google · 17 reviews/);
 assert.match(home,/Verify license/);
 assert.match(home,/See a real remodeling project/);
 assert.match(home,/href="\/remodeling-preview\/schedule"/);
 assert.ok(home.indexOf('home-trust-proof')<home.indexOf('id="services"'));
 assert.ok(home.indexOf('id="services"')<home.indexOf('ALSO AVAILABLE · SEASONAL'));
 assert.doesNotMatch(home,/minimum two-year warranty|free guaranteed estimate|financing approved/i);
});
test('form client code submits to API with explicit success and meaningful fallback',async()=>{
 const js=await readFile(new URL('../public/marketing.js',import.meta.url),'utf8');
 assert.match(js,/fetch\('\/api\/public\/inquiry'/);
 assert.match(js,/Thank you — your project request is in/);
 assert.match(js,/sendButton\.textContent=liveDelivery\?'Send my project request'/);
 assert.match(js,/if\(!liveDelivery\)/);
});
