// Import six approved close-up design-inspiration visuals as optimized WebP.
// Source images remain untouched in the user's local concept inbox.
import sharp from 'sharp';
import {access,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=resolve(fileURLToPath(new URL('..',import.meta.url)));
const sourceDir=process.argv[2];
if(!sourceDir)throw Error('Usage: node scripts/import-holiday-closeups.mjs SOURCE_DIRECTORY');
const dst=join(repo,'public','site-assets','holiday-concepts');
await mkdir(dst,{recursive:true});
const items=[
 ['big_white_bulbs.png','12-warm-white-c9-roofline-closeup'],
 ['big_colored_bulbs.png','13-multicolor-c9-roofline-closeup'],
 ['small_non-permenent_white_bulbs.png','14-warm-white-garland-entry-closeup'],
 ['icicles_ganging_from_eve_white.png','15-white-icicle-eaves-closeup'],
 ['permenent_installed_colored_bulbs_under_eve.png','16-color-changing-soffit-closeup'],
 ['white_led_strip_around_window.png','17-warm-white-window-outline-closeup']
];
for(const [filename,slug] of items){
 const src=join(sourceDir,filename);await access(src);
 const meta=await sharp(src).metadata();
 if(meta.format!=='png'||meta.width!==1448||meta.height!==1086)throw Error('Source image mismatch: '+filename);
 for(const [suffix,width,quality] of [['',1200,82],['-thumb',600,76]]){
  const file=slug+suffix+'.webp';
  const info=await sharp(src).resize({width,withoutEnlargement:true}).webp({quality,effort:5}).toFile(join(dst,file));
  console.log(JSON.stringify({source:filename,file,width:info.width,height:info.height,bytes:info.size}));
 }
}
