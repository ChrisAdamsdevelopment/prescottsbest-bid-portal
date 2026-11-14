// Normalize public inspiration selections using only approved, server-side design catalogs.
// Never trust customer-supplied captions, titles, links or HTML.
import {visualExplorers} from './visual-catalog.mjs';
import {holidayImages} from './holiday-assets.mjs';
const MAX=20;
export const validateInspirationSelections=(raw)=>{
 if(raw===undefined||raw===null)return [];
 if(!Array.isArray(raw)||raw.length>MAX)throw Error('Choose at most 20 design ideas.');
 const results=[];
 const seen=new Set();
 for(const row of raw){
  if(!row||typeof row!=='object'||typeof row.explorerId!=='string'||typeof row.file!=='string')
   throw Error('One of the saved inspiration choices is invalid.');
  const holiday=row.explorerId==='holiday-lighting'?holidayImages.find(v=>'/site-assets/holiday-concepts/'+v.file===row.file):null;
  const explorer=holiday?{id:'holiday-lighting',heading:'Holiday lighting design inspiration'}:visualExplorers[row.explorerId];
  const item=holiday?{name:holiday.title,caption:holiday.caption,file:row.file}:explorer?.variants.find(v=>v.file===row.file);
  if(!item)throw Error('An inspiration option is no longer available. Please review your list.');
  const id=row.explorerId+'|'+row.file;
  if(seen.has(id))continue;
  seen.add(id);
  const note=row.note===undefined||row.note===null?'':row.note;
  if(typeof note!=='string'||note.length>180)throw Error('Please shorten a design preference note.');
  results.push({
   explorerId:explorer.id,
   name:item.name,
   category:explorer.heading,
   caption:item.caption,
   note:note.trim(),
   file:item.file,
   url:'https://prescottsbestconstruction.com'+item.file
  });
 }
 return results;
};
