import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage,sitemapPaths} from '../marketing/site.mjs';
import {cityPaths} from '../marketing/city-pages.mjs';
test('four distinct city pages, indexable canonicals, directory and conversion links',()=>{
 const opts={indexable:true,origin:'https://prescottsbestconstruction.com',cleanPaths:true};
 const home=marketingPage('/remodeling-preview',opts);
 const hub=marketingPage('/remodeling-preview/service-areas',opts);
 const titles=new Set();
 for(const path of cityPaths){
  const html=marketingPage('/remodeling-preview'+path,opts);
  assert.ok(html);
  assert.ok(html.includes('rel="canonical" href="https://prescottsbestconstruction.com'+path+'"'));
  assert.ok(html.includes('Get a free on-site estimate'));
  assert.ok(html.includes('LOCAL PLANNING RESOURCES'));
  assert.ok(html.includes('andrew@prescottsbestconstruction.com'));
  assert.ok(home.includes(path)&&hub.includes(path));
  assert.ok(sitemapPaths().some(p=>p.endsWith(path)));
  titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
 }
 assert.equal(titles.size,4);
});
