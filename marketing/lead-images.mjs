// Private, bounded image intake for homeowner inquiries.
// Untrusted uploads are decoded and rewritten with Sharp before storage or mail.
import sharp from 'sharp';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {mkdir,readFile,writeFile,readdir,stat,rm} from 'node:fs/promises';

const MAX_PHOTOS=3;
const MAX_IN_BYTES=1_800_000;
const MAX_OUT_BYTES=1_200_000;
const MAX_STORAGE_BYTES=180_000_000;
const RETENTION_MS=30*24*60*60*1000;
const refPattern=/^PBC-[A-F0-9]{8}$/;
const filePattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const storage=()=>process.env.DATA_DIR?join(process.env.DATA_DIR,'lead-photos'):null;
export const photoUploadReady=()=>Boolean(storage());
function fileSignature(buffer,mime){
 if(mime==='image/jpeg')return buffer.length>16&&buffer[0]===0xff&&buffer[1]===0xd8&&buffer[2]===0xff;
 if(mime==='image/png')return buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 if(mime==='image/webp')return buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP';
 return false;
}
export async function prepareLeadPhotos(items){
 if(items===undefined||items===null)return [];
 if(!Array.isArray(items)||items.length>MAX_PHOTOS)throw new Error('Please attach no more than three photographs.');
 if(items.length&&!photoUploadReady())throw new Error('Direct photo upload is not configured. Please send your request without pictures and we will explain how to share them.');
 const results=[];
 for(const item of items){
  const mime=item?.mimeType,base64=item?.base64;
  if(!['image/jpeg','image/png','image/webp'].includes(mime))throw new Error('Photos must be JPG, PNG or WebP images.');
  if(typeof base64!=='string'||base64.length<64||base64.length>Math.ceil(MAX_IN_BYTES*4/3)+16||! /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64))throw new Error('One of the selected photos is too large or invalid.');
  const original=Buffer.from(base64,'base64');
  if(original.length>MAX_IN_BYTES||original.length<32||!fileSignature(original,mime))throw new Error('Photo format or size could not be verified.');
  let image,metadata;
  try{
   image=sharp(original,{failOn:'error',limitInputPixels:24_000_000,animated:false});
   metadata=await image.metadata();
   if(!['jpeg','png','webp'].includes(metadata.format)||!metadata.width||!metadata.height||metadata.width>9000||metadata.height>9000||metadata.pages>1)throw Error('Unsupported image');
  }catch{throw new Error('One photo could not be decoded. Please try a normal JPG image.');}
  let jpeg;
  try{jpeg=await image.rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).jpeg({quality:76,mozjpeg:true}).toBuffer();}
  catch{throw new Error('One photo could not be processed. Please choose a smaller image.');}
  if(jpeg.length>MAX_OUT_BYTES)throw new Error('One photo is too large after optimization. Please choose a different image.');
  const id=randomUUID();
  results.push({id,filename:'project-photo-'+(results.length+1)+'.jpg',mimeType:'image/jpeg',bytes:jpeg.length,content:jpeg});
 }
 return results;
}
export async function pruneOldLeadPhotos(){
 const root=storage();if(!root)return {removed:0,usedBytes:0};
 await mkdir(root,{recursive:true,mode:0o700});
 let usedBytes=0,removed=0;
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(!entry.isDirectory()||!refPattern.test(entry.name))continue;
  const full=join(root,entry.name),info=await stat(full);
  if(Date.now()-info.mtimeMs>RETENTION_MS){await rm(full,{recursive:true,force:true});removed++;continue;}
  for(const file of await readdir(full,{withFileTypes:true})){
   if(file.isFile()&&/^[0-9a-f-]{36}\.jpg$/.test(file.name))usedBytes+=(await stat(join(full,file.name))).size;
  }
 }
 return {removed,usedBytes};
}
export async function saveLeadPhotos(ref,items){
 if(!items.length)return [];
 if(!refPattern.test(ref)||!photoUploadReady())throw new Error('Photo storage unavailable.');
 const root=storage();
 const {usedBytes}=await pruneOldLeadPhotos();
 if(usedBytes+items.reduce((sum,item)=>sum+item.bytes,0)>MAX_STORAGE_BYTES)throw new Error('Photo intake temporarily full. Please send a request without photos.');
 const dest=join(root,ref);
 await mkdir(dest,{recursive:false,mode:0o700});
 try{
  for(const photo of items)await writeFile(join(dest,photo.id+'.jpg'),photo.content,{flag:'wx',mode:0o600});
 }catch(error){await rm(dest,{recursive:true,force:true});throw error;}
 return items.map(({id,filename,bytes,mimeType})=>({id,filename,bytes,mimeType}));
}
export async function readLeadPhoto(ref,id){
 if(!photoUploadReady()||!refPattern.test(ref)||!filePattern.test(id))throw new Error('Photo unavailable.');
 return readFile(join(storage(),ref,id+'.jpg'));
}
