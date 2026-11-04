// Prescott's Best Holiday Lighting Design Studio.
// All uploaded images stay on device. No upload, persistent browser storage, or paid image API call.
(()=>{
 const canvas=document.getElementById('holiday-canvas');
 if(!canvas)return;
 const $=id=>document.getElementById(id),ctx=canvas.getContext('2d',{alpha:false});
 const packageSelect=$('holiday-package'),toneSelect=$('holiday-tone'),productSelect=$('holiday-product'),photo=$('holiday-photo'),
  feet=$('holiday-feet'),access=$('holiday-access'),status=$('holiday-preview-status'),
  worksheet=$('holiday-worksheet'),save=$('holiday-download'),json=$('holiday-json'),
  print=$('holiday-print'),email=$('holiday-email'),aiConsent=$('holiday-ai-consent'),aiAsk=$('holiday-ai-ask'),aiStatus=$('holiday-ai-status'),aiAnswer=$('holiday-ai-answer');
 const packages={
  classic:{name:'Classic Roofline',tone:'warm',base:599,rate:7.5},
  welcome:{name:'Warm Welcome',tone:'candy',base:899,rate:9.5},
  showcase:{name:'Neighborhood Showcase',tone:'festive',base:1399,rate:11.5},
  permanent:{name:'Year-Round Smart Lights',tone:'smart',base:0,rate:27}
 };
 const accentLabels={entry:'Doorway or porch accent',garage:'Garage outline',bush:'Shrub or small tree lights',path:'Walkway lighting',smart:'App scene / timer setup'};
 const accentExamples={entry:125,garage:150,bush:149,path:175,smart:150}; // Planning assumptions, not supplier quotes.
 const productFactors={c9:1,rope:1.1,icicle:1.2,rgbic:1.65,permanent:1};
 const colorSets={
  warm:['#ffe4a3'],cool:['#f4f9ff'],candy:['#f2f7ff','#ff354e'],
  festive:['#f22849','#14ca8c','#f6dc60','#4378ff'],smart:['#3ff1dd','#ca7afd','#ffbf6a','#4cb4fb']
 };
 let image=null,points=[],generated=null;
 const setStatus=s=>{status.textContent=s};
 const fit=()=>{
  if(!image)return {x:0,y:0,w:canvas.width,h:canvas.height};
  const scale=Math.min(canvas.width/image.width,canvas.height/image.height);
  const w=image.width*scale,h=image.height*scale;
  return {x:(canvas.width-w)/2,y:(canvas.height-h)/2,w,h};
 };
 function baseImage(){
  ctx.fillStyle='#13231f';ctx.fillRect(0,0,canvas.width,canvas.height);
  if(image){
   const box=fit();ctx.drawImage(image,box.x,box.y,box.w,box.h);
   // Soft night treatment preserves the original house for meaningful roof placement.
   ctx.fillStyle='rgba(8,21,39,.34)';ctx.fillRect(box.x,box.y,box.w,box.h);
  }else{
   ctx.fillStyle='#f4f0e4';ctx.fillRect(0,0,canvas.width,canvas.height);
   ctx.textAlign='center';ctx.fillStyle='#2e4a3b';ctx.font='bold 31px system-ui';
   ctx.fillText('Add your home photo or use the sample home',canvas.width/2,canvas.height/2-10);
   ctx.font='20px system-ui';ctx.fillText('Then tap along your roofline to map the lights',canvas.width/2,canvas.height/2+32);
   ctx.textAlign='start';
  }
 }
 const projectPoint=p=>{
  const b=fit();return {x:b.x+b.w*p[0],y:b.y+b.h*p[1]};
 };
 function segmentNotes(totalFeet){
  const xy=points.map(projectPoint),parts=[];
  for(let i=1;i<xy.length;i++){
   const pixels=Math.hypot(xy[i].x-xy[i-1].x,xy[i].y-xy[i-1].y);
   if(pixels<1)continue;
   parts.push({id:'L'+i,pixelDistance:pixels,start:points[i-1].slice(),end:points[i].slice()});
  }
  const pixels=parts.reduce((sum,x)=>sum+x.pixelDistance,0);
  return parts.map(p=>({id:p.id,from:p.start,to:p.end,
    imageFraction:Math.round(p.pixelDistance/pixels*1000)/1000,
    provisionalFeet:totalFeet?Math.round(p.pixelDistance/pixels*totalFeet*10)/10:null,
    caveat:'Visual proportional allocation only. Perspective distorts length; measure on site.'}));
 }
 function lights(){
  if(!image||points.length===0)return;
  const xy=points.map(projectPoint),palette=colorSets[toneSelect.value]||colorSets.warm;
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  ctx.beginPath();xy.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
  ctx.lineWidth=7;ctx.strokeStyle='rgba(11,21,23,.85)';ctx.stroke();
  let distance=0,index=0;
  for(let i=1;i<xy.length;i++){
   const from=xy[i-1],to=xy[i],len=Math.hypot(to.x-from.x,to.y-from.y);
   if(len<1)continue; // repeated taps should not produce invalid Canvas coordinates
   for(let t=distance?24-distance:0;t<=len;t+=24){
    const x=from.x+(to.x-from.x)*t/len,y=from.y+(to.y-from.y)*t/len;
    ctx.shadowColor=palette[index%palette.length];ctx.shadowBlur=19;
    ctx.fillStyle=palette[index%palette.length];ctx.beginPath();ctx.arc(x,y,7,0,2*Math.PI);ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle='#ffffffcc';ctx.beginPath();ctx.arc(x-2,y-2,1.9,0,Math.PI*2);ctx.fill();
    index++;
   }
   distance=(distance+len)%24;
  }
  xy.forEach((p,i)=>{ctx.fillStyle='#0d3528';ctx.strokeStyle='#fff';ctx.lineWidth=3;
   ctx.beginPath();ctx.arc(p.x,p.y,9,0,2*Math.PI);ctx.fill();ctx.stroke();
   ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.fillText(String(i+1),p.x-3,p.y+4);
  });
  ctx.restore();
 }
 function render(){
  baseImage();lights();
  save.disabled=!image||points.length<2;
  worksheet.replaceChildren();
  const summary=document.createElement('h3');summary.textContent='Your design summary';worksheet.append(summary);
  const list=document.createElement('ul');
  const add=t=>{const el=document.createElement('li');el.textContent=t;list.append(el);};
  const pkg=packages[packageSelect.value]||packages.classic;
  const selected=[...document.querySelectorAll('.holiday-addons input:checked')].map(x=>x.value);
  add('Package concept: '+pkg.name);
  const isPermanent=pkg.id==='permanent'||productSelect.value==='permanent';
  const productFactor=productFactors[productSelect.value]||1;
  const sampleBase=isPermanent?120*27:pkg.base*productFactor;
  add('Starting design example: '+USD(sampleBase)+' for '+(isPermanent?'120 feet of permanent lighting (assumed $27/ft)':'an accessible one-story front roofline up to 60 feet')+'. Selected accents and verified materials can change it.');
  add('Light colors: '+toneSelect.selectedOptions[0].textContent);
  add('Preferred light type: '+productSelect.selectedOptions[0].textContent);
  add('Roofline guide points: '+points.length+' (not measured)');
  if(selected.length)add('Optional accents: '+selected.map(s=>accentLabels[s]).join(', '));
  const length=Number(feet.value),valid=Number.isFinite(length)&&length>=10&&length<=1200;
  if(valid){
   // Budget ranges are research examples derived from a tentative model and never submitted as bids.
   const core=(isPermanent?27*length:(pkg.base+Math.max(0,length-60)*pkg.rate)*productFactor);
   const extras=selected.reduce((sum,k)=>sum+(accentExamples[k]||0),0);
   const total=core+extras;
   add('Illustrative project budget: '+USD(Math.max(sampleBase,total*.9))+'–'+USD(total*1.3)+' (includes model-based adjustments for your chosen light type, not an approved retail quote).');
   const extraLength=length*1.1;
   add('Provisional ordering worksheet: '+Math.ceil(extraLength)+' feet of appropriate product including 10% allowance; site measurement required');
   if(productSelect.value==='c9')add('Provisional C9-style spacing reference: about '+Math.ceil(extraLength)+' attachment points at approximately 12 inches (verify supplier installation guide)');
   else add('Specialty lights require manufacturer-approved segment lengths, controllers, connectors and attachment methods. This is not a product order.');
  }else add('Add an approximate roofline length to adjust the visible starting-price example. A site measurement is still required.');
  const routeSegments=segmentNotes(valid?length:null);
  if(valid&&routeSegments.length)add('Visual segment allocation (NOT measured): '+routeSegments.slice(0,7).map(s=>s.id+' ~'+s.provisionalFeet+' ft').join('; ')+(routeSegments.length>7?' and '+(routeSegments.length-7)+' more':'')+'.');
  add('Never treat this preview as an installation/safety plan. Lead must confirm attachment method, heights, ladders, outlets/GFCI, power budget, weather, scope and licensing.');
  worksheet.append(list);
  const note=document.createElement('p');note.className='micro';note.textContent='Only the saved image and worksheet you choose to download leave this page. No contact details or photos are submitted automatically.';
  worksheet.append(note);
  generated={package:packageSelect.value,packageName:pkg.name,tone:toneSelect.value,
   preferredProduct:productSelect.value,preferredProductName:productSelect.selectedOptions[0].textContent,
   selectedAccents:selected,approximateRunFt:valid?length:null,points:points.map(p=>p.slice()),
   annotatedSegments:routeSegments,
   access:access.value,customerPhotoIncluded:false,previewType:'local annotated concept, not AI render',
   materialOrderStatus:'NOT APPROVED: confirm measurement, attachment, outdoor rating, breaker capacity and labor on site',
   seasonalTakedownIncluded:false,contractPrice:null,hasPhoto:!!image,
   notes:'No live price quote; owner must approve product selection, worker instructions and service agreement.'};
  json.disabled=points.length<2;print.disabled=points.length<2;email.disabled=false;
 }
 const USD=x=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Math.round(x));
 async function load(src,sample=false){
  if(src instanceof File){
   if(src.size>10*1024*1024||!['image/jpeg','image/png','image/webp'].includes(src.type))throw Error('Choose JPG, PNG or WebP under 10 MB.');
   const bmp=await createImageBitmap(src);
   if(bmp.width>9000||bmp.height>9000){bmp.close();throw Error('This photo is too large. Please resize it.')}
   image=bmp;points=[];setStatus('Photo loaded only on this device. Tap roofline points on the image to add lights.');
  }else{
   const pic=new Image();pic.decoding='async';
   pic.src=src;await pic.decode();
   image=pic;points=sample?[[.17,.50],[.31,.32],[.46,.43],[.65,.29],[.83,.51]]:[];
   setStatus('Sample concept home loaded. The starter light trace is illustrative. Move to your own photo for a meaningful preview.');
  }
  render();
 }
 photo.addEventListener('change',async()=>{
  if(!photo.files?.[0])return;
  try{await load(photo.files[0]);}
  catch(err){setStatus(err.message||'Unable to read photo.');}
 });
 $('holiday-demo').addEventListener('click',()=>load('/site-assets/concepts/local-home-detail.webp',true).catch(()=>setStatus('Sample home is unavailable. Please use a photo.')));
 canvas.addEventListener('pointerdown',e=>{
  if(!image)return;
  const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*canvas.width/r.width,y=(e.clientY-r.top)*canvas.height/r.height,b=fit();
  if(x<b.x||x>b.x+b.w||y<b.y||y>b.y+b.h)return;
  if(points.length>=35){setStatus('Maximum 35 guide points. Use Undo to adjust your tracing.');return;}
  points.push([(x-b.x)/b.w,(y-b.y)/b.h]);setStatus(points.length+' roofline points placed. Choose a color style or save your concept.');
  render();
 });
 canvas.addEventListener('keydown',e=>{
  if(!['Enter',' '].includes(e.key)||!image)return;
  e.preventDefault();setStatus('To add points on the image, tap or click it. You can also use a touch screen. For keyboard-only planning, select a sample home and choose a package.');
 });
 $('holiday-undo').addEventListener('click',()=>{points.pop();render();setStatus('Last guide point removed.')});
 $('holiday-reset').addEventListener('click',()=>{points=[];render();setStatus('Light path cleared. Tap new points on the image.')});
 packageSelect.addEventListener('change',()=>{toneSelect.value=packages[packageSelect.value].tone;productSelect.value=packageSelect.value==='permanent'?'permanent':'c9';render()});
 [toneSelect,productSelect,feet,access].forEach(el=>el.addEventListener('change',render));
 document.querySelectorAll('.holiday-addons input').forEach(el=>el.addEventListener('change',render));
 function download(blob,name){
  const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;
  link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 save.addEventListener('click',()=>canvas.toBlob(blob=>blob?download(blob,'prescottsbest-holiday-preview.png'):setStatus('Image export failed.'),'image/png'));
 json.addEventListener('click',()=>{
  if(!generated)return;
  download(new Blob([JSON.stringify(generated,null,2)],{type:'application/json'}),'prescottsbest-holiday-crew-concept.json');
 });
 email.addEventListener('click',()=>{
  if(!generated)return;
  const subject='Holiday Lighting Concept — request for an owner-reviewed estimate';
  const summary=[
   'Hello Prescott’s Best, I would like to discuss a holiday lighting project.',
   'Selected package: '+generated.packageName,
   'Color style: '+toneSelect.selectedOptions[0].textContent,
   'Preferred light type: '+generated.preferredProductName,
   'Approximate run: '+(generated.approximateRunFt?generated.approximateRunFt+' feet':'not measured'),
   'Accent options: '+(generated.selectedAccents.map(k=>accentLabels[k]).join(', ')||'none selected'),
   'Access: '+access.selectedOptions[0].textContent,
   'This is a design concept, not a quote. Please contact me to arrange a site review.',
   'I can attach a saved preview image separately if I choose.'
  ].join('\n');
  location.href='mailto:chris@prescottsbestconstruction.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(summary);
 });
 aiConsent.addEventListener('change',()=>{aiAsk.disabled=!aiConsent.checked});
 aiAsk.addEventListener('click',async()=>{
  if(!aiConsent.checked||aiAsk.disabled)return;
  aiAsk.disabled=true;aiStatus.textContent='Generating a few ideas based on your choices…';aiAnswer.textContent='';
  const selected=[...document.querySelectorAll('.holiday-addons input:checked')].map(x=>accentLabels[x.value]);
  const info=['I am exploring outdoor holiday lighting for a home in the Prescott area.',
   'Selected package: '+packages[packageSelect.value].name+'.',
   'Colors: '+toneSelect.selectedOptions[0].textContent+'.',
   'Product preference: '+productSelect.selectedOptions[0].textContent+'.',
   'Additional accents: '+(selected.join(', ')||'none')+'.',
   'Estimated roofline length: '+(feet.value.trim()||'unknown')+' feet.',
   'Please suggest three simple decorative improvements and two questions for the contractor.',
   'No prices, no electrical instructions, no claims that specific smart products are compatible.'].join(' ').slice(0,640);
  try{
   const r=await fetch('/api/public/ai-guide',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({consent:true,question:info,history:[]}),cache:'no-store'});
   const data=await r.json();
   if(!r.ok)throw Error(data.error||'AI ideas unavailable.');
   aiAnswer.textContent=data.answer||'No ideas were returned.';
   aiStatus.textContent='Suggestions are for inspiration only. Andrew must approve the real design and materials.';
  }catch(e){
   aiStatus.textContent='AI ideas are unavailable right now. You can still save your design and call us.';
  }finally{aiAsk.disabled=!aiConsent.checked}
 });
 print.addEventListener('click',()=>window.print());
 // URL selects package only, never accepts arbitrary executable markup.
 const selected=new URLSearchParams(location.search).get('package');
 if(selected&&Object.hasOwn(packages,selected))packageSelect.value=selected;
 toneSelect.value=packages[packageSelect.value].tone;
 productSelect.value=packageSelect.value==='permanent'?'permanent':'c9';
 render();
 load('/site-assets/concepts/local-home-detail.webp',true).catch(()=>render());
})();
