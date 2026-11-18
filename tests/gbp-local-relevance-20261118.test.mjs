import test from 'node:test';
import assert from 'node:assert/strict';
import {marketingPage} from '../marketing/site.mjs';

const origin='https://prescottsbestconstruction.com';
const render=(path)=>marketingPage('/remodeling-preview'+(path==='/'?'':path),
  {indexable:true,origin,cleanPaths:true});
const business=(html)=>{
  const scripts=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const models=scripts.map(([,data])=>JSON.parse(data));
  return models.find(obj=>obj['@type']==='GeneralContractor');
};

test('live canonical business identity is consistent across PBC service pages',()=>{
  for(const route of ['/','/bathroom-remodeling','/kitchen-remodeling','/custom-cabinetry','/finish-carpentry']){
    const page=render(route);assert.ok(page);
    const entity=business(page);assert.ok(entity,route);
    assert.equal(entity['@id'],origin+'/#business');
    assert.equal(entity.url,origin+'/');
    assert.equal(entity.name,'Prescotts Best Construction');
    assert.equal(entity.telephone,'+1-928-350-0940');
    assert.deepEqual(entity.sameAs,['https://www.google.com/maps/place/?q=place_id:ChIJuVpyA3ojLYcRZ4nEjfpJBIU']);
    const served=entity.areaServed.map(city=>city.name);
    assert.deepEqual(served,['Prescott Valley','Prescott','Chino Valley','Dewey-Humboldt']);
    for(const city of entity.areaServed) {
      assert.equal(city.address.addressRegion,'AZ');
      assert.equal(city.address.addressCountry,'US');
      assert.equal(city.address.streetAddress,undefined);
    }
    assert.equal(entity.address,undefined,'Do not expose residential address');
    assert.equal(entity.geo,undefined,'Do not expose home coordinates');
    assert.ok(entity.hasCredential.credentialCategory.includes('343141'));
    assert.equal(entity.hasOfferCatalog.itemListElement.length,7);
    for(const offer of entity.hasOfferCatalog.itemListElement){
      assert.equal(offer['@type'],'Offer');
      assert.equal(offer.itemOffered['@type'],'Service');
      assert.ok(offer.itemOffered.url.startsWith(origin+'/'));
      assert.ok(offer.itemOffered.description.length>25);
    }
    assert.ok(page.includes('Verify AZ ROC license #343141'));
    assert.ok(page.includes('https://roc.az.gov/contractor-search'));
    assert.ok(page.includes('Dewey-Humboldt'));
    assert.ok(page.includes('no walk-in storefront'));
    assert.ok(page.includes('tel:+19283500940'));
  }
});
