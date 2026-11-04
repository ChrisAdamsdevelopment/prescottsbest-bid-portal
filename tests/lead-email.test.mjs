import test from 'node:test';
import assert from 'node:assert/strict';
import {sendLeadEmail,emailConfigured} from '../marketing/email.mjs';

const LEAD={id:'PBC-SYNTHETIC',name:'Test Homeowner',email:'customer@example.org',phone:'555-0100',
 project:'Bathroom remodeling',notes:'Synthetic QA — no real customer information',
 createdAt:'2026-11-04T18:00:00.000Z'};
const KEYS=['RESEND_API_KEY','LEAD_FROM_EMAIL','SMTP_HOST','SMTP_USER','SMTP_PASS','SMTP_FROM','SMTP_PORT'];
const original=Object.fromEntries(KEYS.map(key=>[key,process.env[key]]));
function clear(){for(const key of KEYS)delete process.env[key];}
function restore(){for(const key of KEYS){
 if(original[key]===undefined)delete process.env[key];else process.env[key]=original[key];
}}
test('unconfigured sender fails closed and never invents success',async()=>{
 clear();
 try{
  assert.equal(emailConfigured(),false);
  const result=await sendLeadEmail(LEAD);
  assert.equal(result.sent,false);
  assert.equal(result.category,'configuration');
 }finally{restore();}
});
test('Resend sends a scoped synthetic notification to Chris and preserves reply-to',async()=>{
 clear();process.env.RESEND_API_KEY='re_fake_test_not_valid';
 process.env.LEAD_FROM_EMAIL='website@updates.prescottsbestremodeling.com';
 let received;
 try{
  assert.equal(emailConfigured(),true);
  const result=await sendLeadEmail(LEAD,{sendWithResend:async msg=>{
   received=msg;return {id:'synthetic-provider-id'};
  }});
  assert.equal(result.sent,true);
  assert.equal(result.providerId,'synthetic-provider-id');
  assert.equal(received.to,'chris@prescottsbestconstruction.com');
  assert.equal(received.replyTo,LEAD.email);
  assert.match(received.text,/Synthetic QA/);
  assert.match(received.subject,/Bathroom remodeling/);
 }finally{restore();}
});
test('Resend missing provider acceptance ID is a failure',async()=>{
 clear();process.env.RESEND_API_KEY='re_fake_test_not_valid';
 process.env.LEAD_FROM_EMAIL='website@updates.prescottsbestremodeling.com';
 try{
  const result=await sendLeadEmail(LEAD,{sendWithResend:async()=>({})});
  assert.equal(result.sent,false);
  assert.equal(result.category,'provider');
 }finally{restore();}
});
test('Resend HTTP rejection is reported without leaking secrets',async()=>{
 clear();process.env.RESEND_API_KEY='re_fake_secret_literal';
 process.env.LEAD_FROM_EMAIL='website@updates.prescottsbestremodeling.com';
 const prior=globalThis.fetch;
 globalThis.fetch=async()=>({ok:false,status:403});
 try{
  const result=await sendLeadEmail(LEAD);
  assert.equal(result.sent,false);
  assert.match(result.reason,/HTTP 403/);
  assert.doesNotMatch(JSON.stringify(result),/re_fake_secret_literal/);
 }finally{globalThis.fetch=prior;restore();}
});
test('SMTP fallback requires an accepted Chris recipient',async()=>{
 clear();
 Object.assign(process.env,{SMTP_HOST:'smtp.example.invalid',SMTP_USER:'test@example.invalid',
 SMTP_PASS:'synthetic',SMTP_FROM:'test@example.invalid',SMTP_PORT:'587'});
 let observed;
 try{
  const ok=await sendLeadEmail(LEAD,{sendWithSmtp:async p=>{
   observed=p;return {messageId:'synthetic-message',accepted:['chris@prescottsbestconstruction.com'],rejected:[]};
  }});
  assert.equal(ok.sent,true);
  assert.equal(observed.replyTo,LEAD.email);
  const rejected=await sendLeadEmail(LEAD,{sendWithSmtp:async()=>({messageId:'synthetic',accepted:[],rejected:['chris@prescottsbestconstruction.com']})});
  assert.equal(rejected.sent,false);
 }finally{restore();}
});

test('approved site photos reach the email-notification attachment list',async()=>{
 clear();process.env.RESEND_API_KEY='re_fake_test_not_valid';
 process.env.LEAD_FROM_EMAIL='website@updates.prescottsbestremodeling.com';
 let received;
 try{
  const photo={filename:'project-photo-1.jpg',content:Buffer.from('synthetic')};
  const result=await sendLeadEmail({...LEAD,photos:[{filename:photo.filename}],referral:{source:'sms',path:'/storm-flood-damage-prescott'}},{
   attachments:[photo],sendWithResend:async message=>{received=message;return{id:'fake-photo-message'};}
  });
  assert.equal(result.sent,true);
  assert.equal(received.attachments.length,1);
  assert.equal(received.attachments[0].filename,photo.filename);
  assert.match(received.text,/Customer site photos: 1 JPEG attachments/);
  assert.match(received.text,/Campaign source: sms/);
 }finally{restore();}
});
