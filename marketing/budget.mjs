// Publicly safe research illustration. NOT Andrew's approved labor rates or a company quote.
export const PRICEBOOK_VERSION='research-baseline-2026-11-04-v1';
export const types={
  'bath-refresh':{label:'Bathroom refresh',low:4000,high:12000,detail:'Surface finishes and fixtures; existing layout stays.'},
  'bath-full':{label:'Full bathroom remodel',low:14000,high:35000,detail:'Removal, replacement finishes and trade allowances.'},
  'shower':{label:'Bathtub / shower conversion',low:7000,high:20000,detail:'Shower-area update with wet-area waterproofing assumptions.'},
  'kitchen-refresh':{label:'Kitchen refresh',low:12000,high:30000,detail:'Selective cabinets, counters, fixtures and finishes.'},
  'kitchen-full':{label:'Full kitchen remodel',low:30000,high:75000,detail:'Major replacement of cabinets, surfaces and trade allowances.'},
  'conversion':{label:'Room / garage conversion',low:18000,high:65000,detail:'Conditional on zoning, permits, insulation and systems.'},
  'carpentry':{label:'Finish carpentry project',low:1800,high:9000,detail:'Trim, doors and detail work; minimum job policy unconfirmed.'}
};
export const sizes={small:0.78,medium:1,large:1.28};
export const finishes={practical:0.88,standard:1,premium:1.36};
export const conditions={straightforward:1,complex:1.32};
export function budget(v){
 if(!v||!Object.hasOwn(types,v.project)||!Object.hasOwn(sizes,v.size)||!Object.hasOwn(finishes,v.finish)||!Object.hasOwn(conditions,v.condition))
   throw Object.assign(new Error('Please choose a project, size, finish level and complexity.'),{status:400});
 const row=types[v.project],factor=sizes[v.size]*finishes[v.finish]*conditions[v.condition];
 const round=x=>Math.max(100,Math.round(x/100)*100);
 const low=round(row.low*factor),high=round(row.high*factor);
 return {
 version:PRICEBOOK_VERSION,project:row.label,
 inputs:{project:v.project,size:v.size,finish:v.finish,condition:v.condition},
 planningDirectCosts:{low,high},
 homeownerRange:{low:round(low*1.15),high:round(high*1.25),midpoint:round((low*1.15+high*1.25)/2)},
 calibrationStatus:'Budget guidance; final pricing follows a project review',
 costPlus:{low:round(low*1.15),high:round(high*1.15)},
 fixed:{low:round(low*1.15),high:round(high*1.25)},
 disclaimer:"This is an initial budget range, not a project quote. We’ll provide a written price after reviewing measurements, materials, access and the work involved.",
 explanation:'Fixed-price work is based on an agreed scope. Cost-plus pricing shows documented project costs and an agreed contractor fee. We’ll explain the terms and options in your written proposal.'};
}
