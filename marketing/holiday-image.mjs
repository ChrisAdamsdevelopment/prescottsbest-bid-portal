// Real homeowner photo editing through Gemini. No server-side image persistence.
import sharp from 'sharp';
const apiKey=()=>process.env.GEMINI_API_KEY||process.env.GOOGLE_GEMINI_API_KEY||'';
const model=()=>process.env.GEMINI_HOLIDAY_IMAGE_MODEL||'gemini-3.1-flash-image';
const enabled=()=>process.env.HOLIDAY_AI_IMAGES_ENABLED==='true'&&Boolean(apiKey());
const allowed={
 package:['classic','welcome','showcase','permanent'],
 tone:['warm','cool','candy','festive','smart'],
 product:['c9','rope','icicle','rgbic','permanent'],
 accents:['entry','garage','bush','path','smart']
};
const styles={
 classic:'Tasteful classic roofline with warm-white C9-style outdoor holiday bulbs.',
 welcome:'Coordinated red and warm-white roofline with a modest porch/entrance accent.',
 showcase:'Carefully composed multi-color roofline and restrained landscape accents.',
 permanent:'Discreet permanent track lighting with a modern softly color-changing holiday scene.'
};
const shades={
 warm:'warm golden white',cool:'bright cool white',candy:'red and warm white',
 festive:'red, green, gold and blue',smart:'controlled coordinated smart RGB colors'
};
const counts=new Map();
const maxDaily=()=>Math.max(1,Math.min(100,Number(process.env.HOLIDAY_AI_IMAGE_MAX_DAILY)||24));
let daily={date:'',count:0};
function limit(req,bad){
 const now=Date.now(),date=new Date(now).toISOString().slice(0,10);
 if(daily.date!==date)daily={date,count:0};
 if(daily.count>=maxDaily())throw bad('Realistic image previews have reached today\'s quota. You can still use the instant local preview.',429);
 const address=req.socket.remoteAddress||'unknown',row=counts.get(address)||{at:now,count:0};
 if(now-row.at>600000){row.at=now;row.count=0}
 if(row.count>=6)throw bad('Please try another preview later. The instant preview remains available.',429);
 row.count++;daily.count++;counts.set(address,row);
 if(counts.size>1000)for(const [k,v] of counts)if(now-v.at>900000)counts.delete(k);
}
function choices(body,bad){
 if(!body||body.consent!==true)throw bad('Please explicitly approve sending the selected photo to Google Gemini.',400);
 const values={};
 for(const field of ['package','tone','product']){
  if(!allowed[field].includes(body[field]))throw bad('Choose a valid holiday lighting style.',400);
  values[field]=body[field];
 }
 if(!Array.isArray(body.accents)||body.accents.length>5||body.accents.some(x=>!allowed.accents.includes(x)))throw bad('Invalid lighting accents.',400);
 values.accents=[...new Set(body.accents)];
 const match=/^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(body.image||'');
 if(!match||match[1].length<1200||match[1].length>4_500_000)throw bad('Take or choose a photo and try again. Maximum resized photo size is 3.3MB.',400);
 return {...values,bytes:Buffer.from(match[1],'base64')};
}
export function holidayEditPrompt(options){
 const accentText=options.accents.length?'Selected additional accents: '+options.accents.map(x=>({
  entry:'porch and doorway',garage:'garage outline',bush:'small tree or shrubs',
  path:'walkway edge',smart:'a coordinated controller scene'
 })[x]).join(', ')+'.':'No extra accents beyond the chosen package.';
 return 'Edit the supplied photograph of the EXISTING home into an exquisite, realistic holiday lighting proposal for professional installation. '+
 'Preserve the exact building architecture, windows, roof shape, color, driveway, garden, viewpoint and property layout. Do not invent new extensions, change siding, replace doors, remove trees or alter landscaping. '+
 'Make the scene early evening/blue hour, with natural exposure and warm depth, not cartoonish or overexposed. '+
 styles[options.package]+' Preferred lighting hues: '+shades[options.tone]+'. '+
 accentText+' Preferred outdoor product aesthetic: '+options.product+'. '+
 'Lights should look physically plausible, mounted cleanly along selected visible roofline or accents, with no visible dangling wires, impossible spans, floating fixtures or excessive effects. '+
 'Produce ONE high-quality editorial-grade residential design mockup, same camera view and aspect ratio as input. '+
 'No humans, signs, logos, added vehicles, labels or text. This is an inspirational visual concept only, not a construction plan.';
}
function sanitizeModel(bad){
 const m=model();
 if(!/^gemini-[a-z0-9.-]{5,50}$/.test(m))throw bad('Holiday image provider model is incorrectly configured.',503);
 return m;
}
async function normalizeInput(raw,bad){
 try{
  const image=sharp(raw,{limitInputPixels:12_000_000,failOn:'error'});
  const meta=await image.metadata();
  if(!['jpeg','png','webp'].includes(meta.format)||meta.width<350||meta.height<240)throw Error('Invalid size or format');
  return await image.rotate().resize({width:1600,height:1100,fit:'inside',withoutEnlargement:true}).jpeg({quality:86,mozjpeg:true}).toBuffer();
 }catch{throw bad('Could not safely process this image. Try a clearer JPG or PNG.',400)}
}
async function normalizeOutput(raw,bad){
 try{
  const image=sharp(raw,{limitInputPixels:15_000_000,failOn:'error'});
  const meta=await image.metadata();
  if(!['jpeg','png','webp'].includes(meta.format)||meta.width<350||meta.height<240)throw Error('Invalid output image');
  const resized=await image.rotate().resize({width:2400,height:1800,fit:'inside',withoutEnlargement:true}).toBuffer();
  const info=await sharp(resized).metadata();
  const markWidth=Math.max(250,Math.min(610,info.width-22));
  const markHeight=Math.min(74,Math.max(45,Math.round(markWidth*.125)));
  const fontSize=Math.max(12,Math.floor(markWidth*.044));
  const mark=Buffer.from('<svg width="'+markWidth+'" height="'+markHeight+'"><rect width="'+markWidth+'" height="'+markHeight+'" rx="9" fill="#142a21" opacity=".83"/><text x="12" y="'+Math.round(markHeight*.68)+'" fill="#fff" font-size="'+fontSize+'" font-weight="700" font-family="Arial,sans-serif">AI DESIGN CONCEPT · NOT A QUOTE</text></svg>');
  return sharp(resized).composite([{input:mark,left:Math.max(0,info.width-markWidth-12),top:Math.max(0,info.height-markHeight-12)}]).jpeg({quality:88,mozjpeg:true}).toBuffer();
 }catch{throw bad('The image provider did not return a usable photo preview. Try another image.',503)}
}
export async function holidayImageApi(req,res,path,{input,reply,bad,fetchImpl=fetch}){
 if(req.method==='GET'&&path==='/api/public/holiday-image/status')return reply(res,200,{
  available:enabled(),requiresConsent:true,usesImageGenerationCredits:true,
  model:enabled()?model():null,
  privacy:'Photo is sent to Google Gemini only after the visitor explicitly agrees and taps Generate. The website does not store this preview.'
 });
 if(path!=='/api/public/holiday-image/preview'||req.method!=='POST')throw bad('Not found',404);
 if(!enabled())throw bad('Photorealistic previews are not enabled. The instant design tool still works.',503);
 const choice=choices(await input(req,6_500_000),bad);
 const photo=await normalizeInput(choice.bytes,bad);
 limit(req,bad);
 const selected=Object.fromEntries(['package','tone','product','accents'].map(k=>[k,choice[k]]));
 let provider;
 try{
  provider=await fetchImpl('https://generativelanguage.googleapis.com/v1/models/'+encodeURIComponent(sanitizeModel(bad))+':generateContent',{
   method:'POST',
   headers:{'Content-Type':'application/json','x-goog-api-key':apiKey()},
   body:JSON.stringify({
    contents:[{role:'user',parts:[{text:holidayEditPrompt(choice)},{inlineData:{mimeType:'image/jpeg',data:photo.toString('base64')}}]}],
    generationConfig:{responseModalities:['TEXT','IMAGE'],responseFormat:{image:{imageSize:'2K'}}}
   }),
   signal:AbortSignal.timeout(85000)
  });
 }catch{throw bad('Photorealistic preview service is temporarily unreachable. Your local design is unaffected.',503)}
 if(!provider.ok){
  if(provider.status===429)return reply(res,503,{error:'The image provider has reached its quota. The instant preview still works.'});
  throw bad('The image provider could not complete the preview. Please try again later.',503);
 }
 let parsed;
 try{parsed=await provider.json()}catch{throw bad('Could not read the generated preview.',503)}
 const parts=parsed?.candidates?.[0]?.content?.parts||[];
 const image=parts.map(p=>p.inlineData||p.inline_data).find(i=>i&&['image/jpeg','image/png','image/webp'].includes(i.mimeType||i.mime_type)&&typeof i.data==='string');
 if(!image)throw bad('The image provider did not return an edited photo. The instant preview still works.',503);
 const buffer=Buffer.from(image.data,'base64');
 if(buffer.length>14_000_000||buffer.length<5000)throw bad('The photo preview was not usable.',503);
 const output=await normalizeOutput(buffer,bad);
 return reply(res,200,{
  image:'data:image/jpeg;base64,'+output.toString('base64'),selected,
  generatedBy:model(),type:'AI-edited homeowner design concept',
  disclaimer:'Design inspiration only. Renderings may differ from installed products. Contractor must confirm materials, measurements, access and written price. The website does not store this photo.'
 });
}
