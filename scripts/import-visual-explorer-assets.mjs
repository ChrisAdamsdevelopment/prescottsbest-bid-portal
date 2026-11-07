import sharp from 'sharp';
import {join,resolve} from 'node:path';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const repo=resolve(fileURLToPath(new URL('..',import.meta.url)));
const from=process.argv[2];
if(!from)throw Error('Usage: node scripts/import-visual-explorer-assets.mjs SOURCE_DIR');
const groups={
 'B01-cabinet-finish':[
 ['light_cab.png','cabinet-light-brass'],
 ['darkkest_light_cab.png','cabinet-light-black'],
 ['lightest_medium_cab.png','cabinet-medium-brass'],
 ['darkest_medium_cab.png','cabinet-medium-black'],
 ['dark_cab.png','cabinet-dark-brass'],
 ['lightest_dark_cab.png','cabinet-dark-black']
 ],
 'B02-sewing-storage':[
 ['lightbrownwood_closed.png','sewing-warm-closed'],
 ['lightbrownwood_open.png','sewing-warm-open'],
 ['medium_maybe_oakwood_closed.png','sewing-weathered-closed'],
 ['medium_maybe_oakwood_open.png','sewing-weathered-open'],
 ['darkwood_closed.png','sewing-espresso-closed'],
 ['darkwood_open.png','sewing-espresso-open']
 ],
 'B06-deck-inspiration':[
 ['bigdeckwithfirepit.png','deck-stone-lodge-firepit'],
 ['smalldeckwithstairsnocover.png','deck-stucco-entry-stairs'],
 ['deckwithpatiofurniture.png','deck-covered-patio-kitchen'],
 ['moderndeckwithrailing.png','deck-hillside-view-rail'],
 ['whitedeckwithstairs_withwhitepatiocover.png','deck-white-pergola-shade'],
 ['deckwithstairs_woodfinish.png','deck-pine-home-wood-stairs']
 ]
};
for(const [group,entries] of Object.entries(groups)){
 const dir=join(repo,'public','site-assets','visual-explorer',group);await mkdir(dir,{recursive:true});
 for(const [source,name] of entries){
  const s=join(from,source);const meta=await sharp(s).metadata();
  if(!['png','jpeg','webp'].includes(meta.format)||meta.width<1024||meta.height<700)throw Error('Unexpected size/format '+source+' '+JSON.stringify(meta));
  const outputs=[];
  for(const [suffix,width,quality] of [['',1280,83],['-thumb',480,76]]){
   const file=name+suffix+'.webp';
   const info=await sharp(s).rotate().resize({width,withoutEnlargement:true}).webp({quality,effort:5}).toFile(join(dir,file));
   outputs.push({file,width:info.width,height:info.height,bytes:info.size});
  }
  console.log(JSON.stringify({group,source,outputs}));
 }
}
