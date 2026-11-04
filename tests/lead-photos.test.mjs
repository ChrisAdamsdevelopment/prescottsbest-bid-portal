import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {mkdtemp,rm,utimes,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareLeadPhotos,saveLeadPhotos,readLeadPhoto,pruneOldLeadPhotos} from '../marketing/lead-images.mjs';

test('inquiry photos are validated, rewritten and kept private',async()=>{
 const prior=process.env.DATA_DIR;
 const dir=await mkdtemp(join(tmpdir(),'pbc-photo-check-'));
 process.env.DATA_DIR=dir;
 try{
  const source=await sharp({create:{width:48,height:48,channels:3,background:'navy'}}).png().toBuffer();
  const photo={mimeType:'image/png',base64:source.toString('base64')};
  const cleaned=await prepareLeadPhotos([photo]);
  assert.equal((await sharp(cleaned[0].content).metadata()).format,'jpeg');
  assert.equal(cleaned[0].content[0],255);
  const list=await saveLeadPhotos('PBC-ABCDEF10',cleaned);
  assert.equal(list.length,1);
  assert.equal(list[0].content,undefined);
  assert.deepEqual(await readLeadPhoto('PBC-ABCDEF10',cleaned[0].id),cleaned[0].content);
  await assert.rejects(prepareLeadPhotos([{mimeType:'image/jpeg',base64:photo.base64}]));
  await assert.rejects(prepareLeadPhotos([photo,photo,photo,photo]));
  const old=new Date(Date.now()-40*24*60*60*1000);
  await utimes(join(dir,'lead-photos','PBC-ABCDEF10'),old,old);
  assert.equal((await pruneOldLeadPhotos()).removed,1);
  await assert.rejects(stat(join(dir,'lead-photos','PBC-ABCDEF10')));
 }finally{
  if(prior===undefined)delete process.env.DATA_DIR;else process.env.DATA_DIR=prior;
  await rm(dir,{force:true,recursive:true});
 }
});
