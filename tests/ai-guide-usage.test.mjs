import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {recordAiGuideUsage,aiGuideUsage} from '../marketing/ai-usage.mjs';
test('aggregate Gemini guide usage is recorded without visitor or prompt data',async()=>{
 const old=process.env.DATA_DIR;
 const folder=await mkdtemp(join(tmpdir(),'pbc-ai-usage-'));process.env.DATA_DIR=folder;
 try{
  await Promise.all([recordAiGuideUsage('request'),recordAiGuideUsage('request'),recordAiGuideUsage('success'),recordAiGuideUsage('upstream429')]);
  const usage=await aiGuideUsage(30);
  assert.equal(usage.totals.request,2);
  assert.equal(usage.totals.success,1);
  assert.equal(usage.totals.upstream429,1);
  const file=await readFile(join(folder,'ai-guide-usage.json'),'utf8');
  assert.ok(!file.includes('example@'));
  assert.ok(!file.includes('question'));
  assert.ok(!file.includes('apiKey'));
  assert.equal(usage.daily.length,1);
 }finally{
  if(old===undefined)delete process.env.DATA_DIR;else process.env.DATA_DIR=old;
  await rm(folder,{recursive:true,force:true});
 }
});
