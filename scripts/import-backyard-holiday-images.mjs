// Publish only approved backyard-lighting inspiration supplied in the project's local generated inbox.
// Existing originals are never moved, renamed, altered or made public.
import sharp from 'sharp';
import {access,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=resolve(fileURLToPath(new URL('..',import.meta.url)));
const input=process.argv[2];
if(!input)throw Error('Usage: node scripts/import-backyard-holiday-images.mjs SOURCE_DIR');
const output=join(repo,'public','site-assets','holiday-concepts');
await mkdir(output,{recursive:true});
const assets=[
 ['closesmallbackyardwithfurniture.png','18-backyard-patio-lounge-closeup'],
 ['closewithmediumsizebackyard.png','19-backyard-covered-patio-garland-closeup'],
 ['mediumdistancebackyard.png','20-backyard-patio-roofline-medium-view'],
 ['distantmediumbackyard.png','21-backyard-landscape-medium-view'],
 ['distantbackyard.png','22-backyard-warm-roofline-long-view'],
 ['distantbackyardwithlongpatio.png','23-backyard-multicolor-roofline-long-view']
];
for(const [name,slug] of assets){
 const source=join(input,name);
 await access(source);
 const metadata=await sharp(source).metadata();
 if(metadata.width!==1448||metadata.height!==1086||metadata.format!=='png'){
  throw Error('Unexpected source format or geometry for '+name);
 }
 for(const [suffix,width,quality] of [['',1200,83],['-thumb',600,76]]){
  const filename=slug+suffix+'.webp';
  const meta=await sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality,effort:5}).toFile(join(output,filename));
  if(meta.width!==width||meta.height!==Math.round(width*3/4))throw Error('Wrong derivative dimensions '+filename);
  console.log(JSON.stringify({source:name,output:filename,width:meta.width,height:meta.height,bytes:meta.size}));
 }
}
