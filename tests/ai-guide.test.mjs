import test from 'node:test';
import assert from 'node:assert/strict';
import {aiGuideApi} from '../marketing/ai-guide.mjs';
const oldKey=process.env.GEMINI_API_KEY,oldFlag=process.env.PUBLIC_AI_ENABLED,oldFetch=globalThis.fetch;
const context=(body,method='POST')=>{
 let result=null;
 const req={method,headers:{},socket:{remoteAddress:'test-visitor-'+Math.random()},url:'/api/public/ai-guide'};
 const utils={input:async()=>body,reply:(_,status,data)=>{result={status,data};return result;},
  bad:(message,status=400)=>Object.assign(new Error(message),{status})};
 return {req,utils,result:()=>result};
};
test('optional guide disabled without Gemini key and does not expose key',async()=>{
 delete process.env.GEMINI_API_KEY;
 process.env.PUBLIC_AI_ENABLED='false';
 let c=context(null,'GET');
 let out=await aiGuideApi(c.req,{},'/api/public/ai-guide/status',c.utils);
 assert.equal(out.status,200);
 assert.equal(out.data.available,false);
 assert.equal(JSON.stringify(out).includes('secret'),false);
 const off=context({consent:true,question:'Can I plan my bathroom?',history:[]});
 await assert.rejects(()=>aiGuideApi(off.req,{},'/api/public/ai-guide',off.utils),e=>e.status===503);
});
test('guide consent, server-only key, provider response and input redaction',async()=>{
 process.env.GEMINI_API_KEY='synthetic-local-only-gemini-test-key';
 process.env.PUBLIC_AI_ENABLED='true';
 const c=context({consent:true,question:'My shower is hard to enter. What options should I consider?',history:[]});
 let request=null;
 globalThis.fetch=async(url,options)=>{
  request={url,options};
  return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:'Consider a low threshold and non-slip surfaces. Confirm details with a contractor.'}]}}]})};
 };
 try{
  let out=await aiGuideApi(c.req,{},'/api/public/ai-guide',c.utils);
  assert.equal(out.status,200);
  assert.match(out.data.answer,/low threshold/);
  assert.equal(request.options.headers['x-goog-api-key'],process.env.GEMINI_API_KEY);
  assert.equal(request.url.includes(process.env.GEMINI_API_KEY),false);
  assert.match(JSON.stringify(JSON.parse(request.options.body).contents),/My shower/);
  assert.equal(out.data.actions.some(a=>a.href==='/estimate'),true);
  const c2=context({consent:false,question:'Does it help to add a handrail?',history:[]});
  await assert.rejects(()=>aiGuideApi(c2.req,{},'/api/public/ai-guide',c2.utils),e=>e.status===400);
  const c3=context({consent:true,question:'My email is fake@example.com, can I contact you?',history:[]});
  await assert.rejects(()=>aiGuideApi(c3.req,{},'/api/public/ai-guide',c3.utils),e=>e.status===400);
 }finally{
  globalThis.fetch=oldFetch;
  if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;
  if(oldFlag===undefined)delete process.env.PUBLIC_AI_ENABLED;else process.env.PUBLIC_AI_ENABLED=oldFlag;
 }
});
test('provider errors do not reveal internal provider response',async()=>{
 process.env.GEMINI_API_KEY='synthetic';
 process.env.PUBLIC_AI_ENABLED='true';
 const c=context({consent:true,question:'What should I check before a kitchen update?',history:[]});
 globalThis.fetch=async()=>({ok:false,status:401,text:async()=>'PRIVATE PROVIDER DETAILS'});
 try{
  await assert.rejects(()=>aiGuideApi(c.req,{},'/api/public/ai-guide',c.utils),e=>e.status===503&&!String(e.message).includes('PRIVATE'));
 }finally{
  globalThis.fetch=oldFetch;
  if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;
  if(oldFlag===undefined)delete process.env.PUBLIC_AI_ENABLED;else process.env.PUBLIC_AI_ENABLED=oldFlag;
 }
});
