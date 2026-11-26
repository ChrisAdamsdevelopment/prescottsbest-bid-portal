import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage} from '../marketing/site.mjs';
import {budget} from '../marketing/budget.mjs';
import {serviceBudgetContent} from '../marketing/service-budget-content.mjs';
const format=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
test('budget content uses exact shared model and links to actual service areas',()=>{
 for(const [path,keys] of [['/bathroom-remodeling',['bath-refresh','bath-full']],['/kitchen-remodeling',['kitchen-refresh','kitchen-full']],['/shower-conversions',['shower']]]){
 const html=serviceBudgetContent(path,p=>p);
 for(const key of keys){const r=budget({project:key,size:'medium',finish:'standard',condition:'straightforward'}).homeownerRange;assert.ok(html.includes(format(r.low)+' – '+format(r.high)));}
 assert.match(html,/not measured local averages or bids/);
 assert.match(html,/href="\/estimate"/);
 for(const city of ['prescott','prescott-valley','chino-valley','dewey-humboldt']) assert.ok(html.includes('/service-areas/'+city));
 assert.ok(marketingPage('/remodeling-preview'+path,{indexable:false}).includes('service-budget-content'));
 }
 assert.equal(serviceBudgetContent('/finish-carpentry',p=>p),'');
});
test('city pages link to cost guidance and Budget Explorer',()=>{
 for(const city of ['prescott','prescott-valley','chino-valley','dewey-humboldt']){
 const html=marketingPage('/remodeling-preview/service-areas/'+city,{indexable:false});
 assert.match(html,/Bathroom remodeling costs and options/);
 assert.match(html,/Kitchen remodeling costs and options/);
 assert.match(html,/Explore your budget/);
 }
});
