import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import sharp from 'sharp';
import {holidayImageApi,holidayEditPrompt} from '../marketing/holiday-image.mjs';
const bad=(msg,status=400)=>Object.assign(new Error(msg),{status});
const photo=await sharp(randomBytes(800*550*3),{raw:{width:800,height:550,channels:3}})
 .jpeg({quality:77}).toBuffer();
const image='data:image/jpeg;base64,'+photo.toString('base64');
const input={consent:true,package:'welcome',tone:'candy',product:'c9',accents:['entry'],image};
test('photorealistic prompt preserves the real home geometry and does not invent site measurements',()=>{
 const prompt=holidayEditPrompt(input);
 assert.match(prompt,/Preserve the exact building architecture/);
 assert.match(prompt,/red and warm.white/i);
 assert.match(prompt,/not a construction plan/i);
});
test('image endpoint is disabled unless explicitly configured',async()=>{
 const oldFlag=process.env.HOLIDAY_AI_IMAGES_ENABLED;
 process.env.HOLIDAY_AI_IMAGES_ENABLED='false';
 let result;
 await holidayImageApi({method:'GET'},null,'/api/public/holiday-image/status',{
  input:async()=>input,reply:(_res,status,value)=>{result={status,value}},bad
 });
 assert.equal(result.status,200);assert.equal(result.value.available,false);
 if(oldFlag===undefined)delete process.env.HOLIDAY_AI_IMAGES_ENABLED;else process.env.HOLIDAY_AI_IMAGES_ENABLED=oldFlag;
});
test('consent gate rejects sending a homeowner photo before provider call',async()=>{
 const oldFlag=process.env.HOLIDAY_AI_IMAGES_ENABLED,oldKey=process.env.GEMINI_API_KEY;
 process.env.HOLIDAY_AI_IMAGES_ENABLED='true';process.env.GEMINI_API_KEY='synthetic-test-only';
 let called=false;
 try{
  await assert.rejects(()=>holidayImageApi({method:'POST',socket:{remoteAddress:'127.0.0.51'}},null,
   '/api/public/holiday-image/preview',{
    input:async()=>({...input,consent:false}),
    reply:()=>{},bad,fetchImpl:async()=>{called=true;throw Error('Never call')}
   }),/explicitly approve/);
  assert.equal(called,false);
 }finally{
  if(oldFlag===undefined)delete process.env.HOLIDAY_AI_IMAGES_ENABLED;else process.env.HOLIDAY_AI_IMAGES_ENABLED=oldFlag;
  if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;
 }
});
test('real image-editing pipeline returns edited JPEG without storing photo',async()=>{
 const oldFlag=process.env.HOLIDAY_AI_IMAGES_ENABLED,oldKey=process.env.GEMINI_API_KEY;
 process.env.HOLIDAY_AI_IMAGES_ENABLED='true';process.env.GEMINI_API_KEY='synthetic-test-only';
 let request,returned;
 try{
  await holidayImageApi({method:'POST',socket:{remoteAddress:'127.0.0.52'}},null,'/api/public/holiday-image/preview',{
   input:async()=>input,bad,
   reply:(_res,status,data)=>{returned={status,data}},
   fetchImpl:async (url,opts)=>{
    request={url,body:JSON.parse(opts.body),headers:opts.headers};
    return {ok:true,status:200,json:async()=>({candidates:[{content:{parts:[
      {text:'Generated with consent.'},
      {inlineData:{mimeType:'image/jpeg',data:photo.toString('base64')}}
    ]}}]})};
   }
  });
  assert.equal(returned.status,200);
  assert.ok(returned.data.image.startsWith('data:image/jpeg;base64,'));
  assert.equal(returned.data.selected.package,'welcome');
  assert.match(request.url,/gemini-3.1-flash-image/);
  assert.equal(request.body.generationConfig.responseFormat.image.imageSize,'2K');
  assert.ok(request.body.contents[0].parts[1].inlineData.data.length>15000);
  const rendered=Buffer.from(returned.data.image.slice('data:image/jpeg;base64,'.length),'base64');
  const meta=await sharp(rendered).metadata();
  assert.ok(meta.width>=800&&meta.height>=550);
  assert.match(returned.data.disclaimer,/Contractor must confirm/);
 }finally{
  if(oldFlag===undefined)delete process.env.HOLIDAY_AI_IMAGES_ENABLED;else process.env.HOLIDAY_AI_IMAGES_ENABLED=oldFlag;
  if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;
 }
});
