import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {recordAnalytics,analyticsSummary} from '../marketing/analytics.mjs';
const id='aaaa1111-bbbb-4444-cccc-abcdef123456';
test('analytics require permission, strip personal details and aggregate page engagement',async()=>{
 const previous=process.env.DATA_DIR;
 const directory=await mkdtemp(join(tmpdir(),'pbc-usage-'));
 process.env.DATA_DIR=directory;
 try{
  assert.deepEqual(await recordAnalytics({consent:false,events:[{type:'page_view',session:id,path:'/'}]}),{accepted:0});
  const row={session:id,path:'/storm-flood-damage-prescott?email=secret@example.com',source:'sms',ref:'example.com',device:'mobile',tz:'America/Phoenix',locale:'en-US',email:'test@example.com',formData:{name:'Hidden'},ip:'203.0.113.9'};
  const report=await recordAnalytics({consent:true,events:[
   {...row,type:'page_view'}, {...row,type:'scroll',depth:75},{...row,type:'engagement',ms:5500},
   {...row,type:'cta_click',action:'contact'}, {...row,type:'storm_checklist'}
  ]});
  assert.equal(report.accepted,5);
  const summary=await analyticsSummary({days:1,leads:[{createdAt:new Date().toISOString(),project:'Storm or flood damage reconstruction',referral:{source:'sms'},email:'example@example.com'}]});
  assert.equal(summary.totals.pageViews,1);
  assert.equal(summary.totals.observedSessions,1);
  assert.equal(summary.totals.leadRequests,1);
  assert.equal(summary.totals.stormChecklists,1);
  assert.equal(summary.totals.contactClicks,1);
  assert.equal(summary.totals.engagedSeconds,6);
  assert.equal(summary.pages[0].scroll75,1);
  assert.equal(summary.sources[0].name,'sms');
  assert.equal(summary.browserTimezones[0].name,'America/Phoenix');
  assert.ok(!JSON.stringify(summary).includes('example@example.com'));
  const f=join(directory,'analytics','events-'+new Date().toISOString().slice(0,10)+'.jsonl');
  const bytes=await readFile(f,'utf8');
  for(const secret of ['secret@example.com','test@example.com','203.0.113.9','Hidden','formData'])assert.ok(!bytes.includes(secret),secret);
 }finally{
  if(previous===undefined)delete process.env.DATA_DIR;else process.env.DATA_DIR=previous;
  await rm(directory,{recursive:true,force:true});
 }
});

test('customer opportunity metrics exclude known synthetic production QA submissions',async()=>{
 const rows=[
  {id:'PBC-5689C544',createdAt:new Date().toISOString(),project:'Storm or flood damage reconstruction'},
  {id:'PBC-33DADD91',createdAt:new Date().toISOString(),project:'Storm or flood damage reconstruction'},
  {id:'PBC-5EC92476',createdAt:new Date().toISOString(),project:'Storm or flood damage reconstruction'},
  {id:'PBC-88888888',createdAt:new Date().toISOString(),project:'Bathroom remodeling',area:'Prescott Valley'}
 ];
 const report=await analyticsSummary({days:1,leads:rows});
 assert.equal(report.totals.leadRequests,1);
 assert.equal(report.totals.testRequestsExcluded,3);
 assert.deepEqual(report.leadAreas,[{name:'Prescott Valley',count:1}]);
});
