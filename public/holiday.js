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
 let image=null,strokes=[],selectedId=null,drawingId=null,mode='select',nextId=1;
 let undoStack=[],redoStack=[],generated=null,showBefore=false,dragging=null,exporting=false;
 const selectedRun=()=>strokes.find(s=>s.id===selectedId)||null;
 const editHistory=()=>{undoStack.push(JSON.stringify({strokes,selectedId,drawingId,nextId}));if(undoStack.length>35)undoStack.shift();redoStack=[];};
 const restore=(snapshot)=>{const obj=JSON.parse(snapshot);strokes=obj.strokes;selectedId=obj.selectedId;drawingId=obj.drawingId;nextId=obj.nextId;render();};
 const undoChange=()=>{if(!undoStack.length)return;redoStack.push(JSON.stringify({strokes,selectedId,drawingId,nextId}));restore(undoStack.pop());setStatus('Last edit undone.');};
 const redoChange=()=>{if(!redoStack.length)return;undoStack.push(JSON.stringify({strokes,selectedId,drawingId,nextId}));restore(redoStack.pop());setStatus('Edit restored.');};
 const realConsent=$('holiday-image-consent'),realButton=$('holiday-realistic'),realStatus=$('holiday-image-status');
 const realArea=$('holiday-real-result'),realBefore=$('holiday-real-before'),realAfter=$('holiday-real-after'),realSave=$('holiday-real-save');
 let realReady=false,realBusy=false,realData='',realUrls=[];
 const updateReal=()=>{realButton.disabled=!realReady||!image||!realConsent.checked||realBusy;realSave.disabled=!realData;};
 function imageObjectURL(data){
  const binary=atob(data.slice(data.indexOf(',')+1)),bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  const url=URL.createObjectURL(new Blob([bytes],{type:'image/jpeg'}));
  realUrls.push(url);return url;
 }
 const clearReal=()=>{for(const url of realUrls)URL.revokeObjectURL(url);realUrls=[];realData='';realArea.hidden=true;realBefore.removeAttribute('src');realAfter.removeAttribute('src');updateReal();};
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
   if(!showBefore){ctx.fillStyle='rgba(8,21,39,.24)';ctx.fillRect(box.x,box.y,box.w,box.h);}
  }else{
   ctx.fillStyle='#f4f0e4';ctx.fillRect(0,0,canvas.width,canvas.height);
   ctx.textAlign='center';ctx.fillStyle='#2e4a3b';ctx.font='bold 31px system-ui';
   ctx.fillText('Add your home photo or use the sample home',canvas.width/2,canvas.height/2-10);
   ctx.font='20px system-ui';ctx.fillText('Choose Draw lights to add your own lighting runs',canvas.width/2,canvas.height/2+32);
   ctx.textAlign='start';
  }
 }
 const projectPoint=p=>{
  const b=fit();return {x:b.x+b.w*p[0],y:b.y+b.h*p[1]};
 };
 function segmentNotes(totalFeet){
  const parts=[];
  strokes.forEach((run,i)=>{
   const xy=run.points.map(projectPoint);
   for(let j=1;j<xy.length;j++){
    const dist=Math.hypot(xy[j].x-xy[j-1].x,xy[j].y-xy[j-1].y);
    if(dist<1)continue;
    parts.push({id:'R'+(i+1)+'-L'+j,pixelDistance:dist,from:run.points[j-1].slice(),to:run.points[j].slice(),tone:run.tone});
   }
  });
  const total=parts.reduce((sum,p)=>sum+p.pixelDistance,0);
  return parts.map(p=>({id:p.id,from:p.from,to:p.to,tone:p.tone,
   imageFraction:total?Math.round(p.pixelDistance/total*1000)/1000:0,
   provisionalFeet:totalFeet&&total?Math.round(p.pixelDistance/total*totalFeet*10)/10:null,
   caveat:'Visual proportional allocation only. Perspective distorts length; measure on site.'}));
 }
 const pointToPixel=p=>{const box=fit();return {x:box.x+p[0]*box.w,y:box.y+p[1]*box.h}};
 function lightRun(run){
  const xy=run.points.map(pointToPixel);
  if(!xy.length)return;
  const palette=colorSets[run.tone]||colorSets.warm;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  if(xy.length>=2){
   ctx.beginPath();xy.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
   ctx.lineWidth=run.product==='rope'||run.product==='rgbic'?6:4;
   ctx.strokeStyle='rgba(10,22,18,.82)';ctx.stroke();
   if(run.product==='rope'||run.product==='rgbic'){
    ctx.shadowBlur=17;ctx.shadowColor=palette[0];ctx.strokeStyle=palette[0];
    ctx.lineWidth=run.product==='rgbic'?7:5;ctx.stroke();ctx.shadowBlur=0;
   }else{
    const step=run.product==='icicle'?18:run.product==='permanent'?31:23;
    let distance=0,index=0;
    for(let i=1;i<xy.length;i++){
     const from=xy[i-1],to=xy[i],len=Math.hypot(to.x-from.x,to.y-from.y);
     if(len<1)continue;
     for(let t=distance?step-distance:0;t<=len;t+=step){
      const x=from.x+(to.x-from.x)*t/len,y=from.y+(to.y-from.y)*t/len;
      const hue=palette[index%palette.length];
      if(run.product==='icicle'){
       ctx.strokeStyle=hue;ctx.shadowColor=hue;ctx.shadowBlur=12;ctx.lineWidth=2.6;
       ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+13+index%3*5);ctx.stroke();ctx.shadowBlur=0;
      }
      ctx.shadowColor=hue;ctx.shadowBlur=17;ctx.fillStyle=hue;
      ctx.beginPath();ctx.arc(x,y,run.product==='permanent'?4.7:5.2,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;index++;
     }
     distance=(distance+len)%step;
    }
   }
  }
  const highlighted=run.id===selectedId;
  if(!exporting&&mode==='select'&&highlighted&&!showBefore){
   xy.forEach((p,i)=>{
    ctx.fillStyle='#073f38';ctx.strokeStyle='#fff';ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(p.x,p.y,9,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='bold 11px system-ui';ctx.fillText(String(i+1),p.x-3,p.y+4);
   });
  }else if(!exporting&&mode==='draw'&&run.id===drawingId&&!showBefore){
   xy.forEach(p=>{
    ctx.fillStyle='#f6d67c';ctx.strokeStyle='#173c2a';ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(p.x,p.y,8,0,Math.PI*2);ctx.fill();ctx.stroke();
   });
  }
  ctx.restore();
 }
 function lights(){
  if(!image||showBefore)return;
  for(const run of strokes)lightRun(run);
 }
 function renderRunList(){
  const root=$('holiday-strand-list');if(!root)return;
  root.replaceChildren();
  if(!strokes.length){const empty=document.createElement('li');empty.textContent='No light runs yet. Choose Draw lights to add one.';root.append(empty);return}
  strokes.forEach((run,i)=>{
   const li=document.createElement('li');
   if(run.id===selectedId)li.className='holiday-run-selected';
   const title=document.createElement('span');
   title.textContent='Run '+(i+1)+' · '+run.points.length+' points · '+run.tone.replaceAll('-',' ');
   const select=document.createElement('button');select.type='button';
   select.textContent=run.id===selectedId?'Selected':'Select';
   select.dataset.runSelect=String(run.id);select.setAttribute('aria-pressed',String(run.id===selectedId));
   const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';
   remove.dataset.runDelete=String(run.id);
   li.append(title,select,remove);root.append(li);
  });
 }
 function updateTools(){
  document.querySelectorAll('[data-holiday-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.holidayTool===mode)));
  const usable=strokes.some(s=>s.points.length>=2);
  $('holiday-finish').disabled=drawingId===null||!strokes.some(s=>s.id===drawingId&&s.points.length>=2);
  $('holiday-undo').disabled=undoStack.length===0;
  $('holiday-redo').disabled=redoStack.length===0;
  $('holiday-delete').disabled=!selectedRun();
  $('holiday-reset').disabled=strokes.length===0;
  const before=$('holiday-before');
  before.setAttribute('aria-pressed',String(showBefore));
  before.textContent=showBefore?'Show my lighting design':'View original photo';
  save.disabled=!image||!usable;json.disabled=!usable;print.disabled=!usable;email.disabled=false;
 }
 function render(){
  baseImage();lights();updateTools();renderRunList();
  worksheet.replaceChildren();
  const summary=document.createElement('h3');summary.textContent='Your lighting design summary';worksheet.append(summary);
  const list=document.createElement('ul'),add=s=>{const li=document.createElement('li');li.textContent=s;list.append(li)};
  const pkg=packages[packageSelect.value]||packages.classic;
  const extras=[...document.querySelectorAll('.holiday-addons input:checked')].map(el=>el.value);
  add('Selected package: '+pkg.name);
  const isPermanent=packageSelect.value==='permanent'||productSelect.value==='permanent';
  add(isPermanent?'Permanent lighting needs a custom quote.':'Package starts at '+USD(pkg.base)+' for a qualifying single-story front roofline up to 60 feet.');
  add('New-run color choice: '+toneSelect.selectedOptions[0].textContent);
  add('Preferred light type: '+productSelect.selectedOptions[0].textContent);
  add('Individual lighting runs: '+strokes.filter(s=>s.points.length>=2).length);
  if(strokes.length)add('Run colors: '+strokes.filter(s=>s.points.length>=2).map((s,i)=>'Run '+(i+1)+' '+s.tone).join('; '));
  if(extras.length)add('Optional accents: '+extras.map(x=>accentLabels[x]).join(', '));
  const length=Number(feet.value),valid=feet.value.trim()!==''&&Number.isFinite(length)&&length>=10&&length<=1200;
  if(valid){
   add('Approximate planning length: '+Math.round(length)+' feet (not measured from the photo).');
   add('Materials allowance discussion: approximately '+Math.ceil(length*1.1)+' feet, subject to actual product lengths and measurements.');
  }else add('Roofline length not entered. We measure the real installation on site.');
  add('Outdoor power, attachments, product availability and installation access require contractor review.');
  worksheet.append(list);
  const note=document.createElement('p');note.className='micro';
  note.textContent='Your manual lighting drawing stays in your browser. If you choose optional photo editing or submit a quote request, separate consent rules apply.';
  worksheet.append(note);
  const routeSegments=segmentNotes(valid?length:null);
  generated={
   package:packageSelect.value,packageName:pkg.name,tone:toneSelect.value,
   preferredProduct:productSelect.value,preferredProductName:productSelect.selectedOptions[0].textContent,
   selectedAccents:extras,approximateRunFt:valid?length:null,
   points:strokes.flatMap(s=>s.points.map(p=>p.slice())),
   lightRuns:strokes.filter(s=>s.points.length>=2).map(s=>({id:s.id,tone:s.tone,product:s.product,points:s.points.map(p=>p.slice())})),
   annotatedSegments:routeSegments,
   access:access.value,customerPhotoIncluded:false,previewType:'on-device lighting markup, not a measured installation plan',
   materialOrderStatus:'NOT APPROVED: confirm measurement, outdoor ratings, attachments, power and labor on site',
   seasonalTakedownIncluded:false,contractPrice:null,hasPhoto:!!image,
   notes:'Manual preview does not constitute a quote. A contractor must approve materials and installation details.'
  };
 }
 function selectMode(next){
  if(!['draw','select','erase'].includes(next))return;
  mode=next;
  if(next==='draw'){drawingId=null;selectedId=null;showBefore=false;
   setStatus('Draw lights: click two or more points for ONE run, then choose Finish this run. Use a new run for another roof edge.');}
  if(next==='select')setStatus('Select / move: tap an existing light run. Drag a dot or the line to reposition it. Change colors above for the selected run.');
  if(next==='erase')setStatus('Erase run: tap any lighting run to remove it. Use Undo if you change your mind.');
  render();
 }
 const posFromEvent=e=>{
  const rect=canvas.getBoundingClientRect();
  const x=(e.clientX-rect.left)*canvas.width/rect.width,y=(e.clientY-rect.top)*canvas.height/rect.height;
  const box=fit();
  if(x<box.x||x>box.x+box.w||y<box.y||y>box.y+box.h)return null;
  return {x,y,n:[(x-box.x)/box.w,(y-box.y)/box.h]};
 };
 const pointSegment=(p,a,b)=>{
  const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
  const t=den?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/den)):0;
  return Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy));
 };
 function hitRun(point){
  let closest=null;
  for(const run of strokes){
   const xy=run.points.map(pointToPixel);
   xy.forEach((p,index)=>{
    const dist=Math.hypot(point.x-p.x,point.y-p.y);
    if(dist<23&&(!closest||dist<closest.distance))closest={run,index,distance:dist};
   });
   for(let i=1;i<xy.length;i++){
    const dist=pointSegment(point,xy[i-1],xy[i]);
    if(dist<22&&(!closest||dist<closest.distance))closest={run,index:null,distance:dist};
   }
  }
  return closest;
 }
 function deleteRun(id){
  if(!strokes.some(s=>s.id===id))return;
  editHistory();strokes=strokes.filter(s=>s.id!==id);
  if(selectedId===id)selectedId=null;
  if(drawingId===id)drawingId=null;
  clearReal();render();setStatus('Light run removed. Undo restores it.');
 }

 const USD=x=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Math.round(x));
 async function load(src,sample=false){
  clearReal();
  if(src instanceof File){
   if(src.size>10*1024*1024||!['image/jpeg','image/png','image/webp'].includes(src.type))throw Error('Choose JPG, PNG or WebP under 10 MB.');
   const bitmap=await createImageBitmap(src);
   if(bitmap.width>9000||bitmap.height>9000){bitmap.close();throw Error('Please resize this unusually large photo.')}
   image=bitmap;setStatus('Your photo is ready. Choose Draw lights, then trace a roofline or patio edge with two or more points.');
  }else{
   const picture=new Image();picture.decoding='async';picture.src=src;await picture.decode();
   image=picture;setStatus('Clean sample house ready — no default lights. Choose Draw lights to create a run wherever you want.');
  }
  strokes=[];selectedId=null;drawingId=null;nextId=1;mode='select';undoStack=[];redoStack=[];dragging=null;showBefore=false;
  render();updateReal();
 }
 photo.addEventListener('change',async()=>{
  if(!photo.files?.[0])return;
  try{await load(photo.files[0]);}catch(err){setStatus(err.message||'Unable to load photo.')}
 });
 $('holiday-demo').addEventListener('click',()=>load('/site-assets/concepts/local-home-detail.webp',true).catch(()=>setStatus('Sample is unavailable. Please choose a house photo.')));
 document.querySelectorAll('[data-holiday-tool]').forEach(button=>button.addEventListener('click',()=>selectMode(button.dataset.holidayTool)));
 canvas.style.touchAction='none';
 canvas.addEventListener('pointerdown',e=>{
  if(!image||showBefore)return;
  const loc=posFromEvent(e);if(!loc)return;
  if(mode==='draw'){
   let run=strokes.find(s=>s.id===drawingId);
   if(!run){
    editHistory();
    run={id:nextId++,tone:toneSelect.value,product:productSelect.value,points:[]};
    strokes.push(run);drawingId=run.id;selectedId=run.id;
   }else editHistory();
   if(run.points.length>=35){setStatus('Maximum 35 points per run. Choose Finish this run, then begin another.');return;}
   run.points.push(loc.n);clearReal();render();
   setStatus(run.points.length<2?'First point placed. Tap the next edge to show lights.':'Run has '+run.points.length+' points. Tap to extend, or Finish this run.');
   e.preventDefault();return;
  }
  const hit=hitRun(loc);
  if(mode==='erase'){if(hit)deleteRun(hit.run.id);else setStatus('Tap directly on a lighting run to erase it.');return;}
  selectedId=hit?.run.id||null;drawingId=null;
  if(hit){
   toneSelect.value=hit.run.tone;productSelect.value=hit.run.product;
   editHistory();dragging={id:hit.run.id,index:hit.index,last:loc.n};
   try{canvas.setPointerCapture(e.pointerId)}catch{}
   setStatus('Run selected. Drag to reposition, change its colors above, or delete it.');
  }else setStatus('No run selected. Use Draw lights to create one, or tap a visible run to adjust it.');
  render();
 });
 canvas.addEventListener('pointermove',e=>{
  if(!dragging||mode!=='select')return;
  const loc=posFromEvent(e);if(!loc)return;
  const run=strokes.find(s=>s.id===dragging.id);if(!run)return;
  if(dragging.index!==null){
   run.points[dragging.index]=loc.n;
  }else{
   const dx=loc.n[0]-dragging.last[0],dy=loc.n[1]-dragging.last[1];
   run.points=run.points.map(p=>[Math.max(0,Math.min(1,p[0]+dx)),Math.max(0,Math.min(1,p[1]+dy))]);
   dragging.last=loc.n;
  }
  clearReal();render();e.preventDefault();
 });
 const stopDrag=()=>{if(dragging){dragging=null;render();setStatus('Light run position updated. Select another run or save your design.')}};
 canvas.addEventListener('pointerup',stopDrag);
 canvas.addEventListener('pointercancel',stopDrag);
 canvas.addEventListener('keydown',e=>{
  if(!['Enter',' '].includes(e.key))return;
  e.preventDefault();setStatus('Use the labeled run list for keyboard-friendly selection and removal, or use your mouse/touchscreen to place dots.');
 });
 $('holiday-finish').addEventListener('click',()=>{
  const run=strokes.find(s=>s.id===drawingId);if(!run||run.points.length<2)return;
  drawingId=null;mode='select';selectedId=run.id;render();
  setStatus('Run finished. Select Draw lights to add another independent section, or select and move this run.');
 });
 $('holiday-strand-list')?.addEventListener('click',e=>{
  const select=e.target.closest('[data-run-select]');
  const remove=e.target.closest('[data-run-delete]');
  if(remove){deleteRun(Number(remove.dataset.runDelete));return;}
  if(select){selectedId=Number(select.dataset.runSelect);drawingId=null;mode='select';
   const run=selectedRun();if(run){toneSelect.value=run.tone;productSelect.value=run.product;}
   render();setStatus('Run selected. Change its color or product, or choose Delete selected.');}
 });
 $('holiday-delete').addEventListener('click',()=>{if(selectedRun())deleteRun(selectedId)});
 $('holiday-undo').addEventListener('click',undoChange);
 $('holiday-redo').addEventListener('click',redoChange);
 $('holiday-reset').addEventListener('click',()=>{
  if(!strokes.length)return;
  editHistory();strokes=[];selectedId=null;drawingId=null;mode='select';clearReal();render();
  setStatus('All light runs cleared. Undo restores the previous design.');
 });
 $('holiday-before').addEventListener('click',()=>{
  showBefore=!showBefore;render();setStatus(showBefore?'Original house photo — tap Show my lighting design to return.':'Lighting concept shown. You can continue editing.');
 });

 function choosePackage(){
  clearReal();
  toneSelect.value=packages[packageSelect.value].tone;
  productSelect.value=packageSelect.value==='permanent'?'permanent':'c9';
  if(mode==='select'&&selectedRun()){
   editHistory();selectedRun().tone=toneSelect.value;selectedRun().product=productSelect.value;
  }
  document.querySelectorAll('.holiday-style-pick').forEach(button=>{
   button.setAttribute('aria-pressed',String(button.dataset.package===packageSelect.value));
  });
  render();
 }
 packageSelect.addEventListener('change',choosePackage);
 document.querySelectorAll('.holiday-style-pick').forEach(button=>button.addEventListener('click',()=>{
  if(!Object.hasOwn(packages,button.dataset.package))return;
  packageSelect.value=button.dataset.package;choosePackage();
  setStatus(packages[packageSelect.value].name+' selected. Look at your preview, or choose a photo of your home.');
 }));
 [toneSelect,productSelect].forEach(el=>el.addEventListener('change',()=>{
  const run=mode==='draw'?strokes.find(s=>s.id===drawingId):selectedRun();
  if(run){editHistory();run.tone=toneSelect.value;run.product=productSelect.value;
   setStatus('Color or product updated for the selected run. Other runs keep their settings.');}
  else setStatus('New light runs will use these colors and this light type.');
  clearReal();render();
 }));
 [feet,access].forEach(el=>el.addEventListener('change',()=>{clearReal();render()}));
 document.querySelectorAll('.holiday-addons input').forEach(el=>el.addEventListener('change',()=>{clearReal();render()}));
 function download(blob,name){
  const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;
  link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 save.addEventListener('click',()=>{
  const original=showBefore;showBefore=false;exporting=true;render();
  canvas.toBlob(blob=>{
   exporting=false;showBefore=original;render();
   if(blob)download(blob,'prescottsbest-holiday-preview.png');
   else setStatus('Could not export this preview image.');
  },'image/png');
 });
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
 const holidayIdeaFile={
  classic:'01_classic_roofline_warm_white.webp',
  welcome:'02_warm_welcome_red_and_white.webp',
  showcase:'03_showcase_multicolor_landscape.webp',
  permanent:'04_permanent_smart_color_scenes.webp'
 };
 $('holiday-add-idea')?.addEventListener('click',()=>{
  const bag=window.pbcInspirationList;
  if(!bag){setStatus('Inspiration list is unavailable. Try saving or copying your plan instead.');return;}
  const pkg=packages[packageSelect.value];
  const file='/site-assets/holiday-concepts/'+holidayIdeaFile[packageSelect.value];
  const note='Color: '+toneSelect.selectedOptions[0].textContent+'; product: '+productSelect.selectedOptions[0].textContent+
   '; '+strokes.filter(s=>s.points.length>=2).length+' traced runs';
  const result=bag.add({explorerId:'holiday-lighting',file,thumb:file,
   name:pkg.name+' lighting idea',caption:'Holiday roofline lighting concept — '+toneSelect.selectedOptions[0].textContent,
   category:'Holiday lighting',page:'/holiday-lighting/design',note:note.slice(0,180)});
  setStatus(result.ok?(result.already?'That lighting package is already in My Ideas. You can review it there.':
   'Lighting look added to My Ideas. You can explore more designs, then send the list with your consultation request.'):
   result.reason==='limit'?'Your inspiration list already has 20 ideas. Remove one before adding another.':
   'Unable to save this idea in your browser.');
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
 $('holiday-build').addEventListener('click',()=>{
  render();
  $('holiday-preview').scrollIntoView({behavior:'smooth',block:'start'});
  setStatus('Your lighting concept is ready. Save it if you like, or request a quote. You do not need to measure the roofline.');
 });
 $('holiday-contact').addEventListener('click',()=>{
  const pkg=packages[packageSelect.value]||packages.classic;
  const extras=[...document.querySelectorAll('.holiday-addons input:checked')].map(el=>accentLabels[el.value]);
  const feetValue=Number(feet.value);
  const summary={
   package:pkg.name,colors:toneSelect.selectedOptions[0].textContent,
   product:productSelect.selectedOptions[0].textContent,
   feet:Number.isFinite(feetValue)&&feetValue>=10&&feetValue<=1200?feetValue:null,
   access:access.selectedOptions[0].textContent,accents:extras,
   hasLocalPreview:!!image,hasDrawnLights:strokes.some(s=>s.points.length>=2),lightRunCount:strokes.filter(s=>s.points.length>=2).length
  };
  try{sessionStorage.setItem('pbc_holiday_draft',JSON.stringify(summary));}
  catch{setStatus('Saved choices are unavailable in this browser. You can still explain your design on the contact page.');}
  location.href='/schedule?from=holiday';
 });
 realConsent.addEventListener('change',updateReal);
 fetch('/api/public/holiday-image/status',{cache:'no-store'}).then(async response=>{
  if(!response.ok)throw Error('unavailable');
  const data=await response.json();realReady=data.available===true;
  document.querySelector('.holiday-photoreal').hidden=!realReady;
  realStatus.textContent=realReady?'Realistic AI photo editing is available. Nothing is sent until you agree and press Generate.':'Photorealistic image editing is unavailable right now. The instant design and quote tools still work.';
  updateReal();
 }).catch(()=>{realReady=false;document.querySelector('.holiday-photoreal').hidden=true;realStatus.textContent='AI image editing is temporarily unavailable. Continue with the instant local preview.';updateReal();});
 async function createPhotoForEdit(){
  const inputCanvas=document.createElement('canvas');
  const ratio=Math.min(1,1600/image.width,1100/image.height);
  inputCanvas.width=Math.round(image.width*ratio);inputCanvas.height=Math.round(image.height*ratio);
  const cx=inputCanvas.getContext('2d');
  if(!cx)throw Error('Photo conversion unavailable on this device.');
  cx.drawImage(image,0,0,inputCanvas.width,inputCanvas.height);
  return inputCanvas.toDataURL('image/jpeg',.86);
 }
 async function generateRealistic(){
  if(!realReady||realBusy||!realConsent.checked||!image)return;
  realBusy=true;updateReal();realStatus.textContent='Editing the photo with Gemini. Please keep this tab open…';
  clearReal();
  let original;
  try{
   original=await createPhotoForEdit();
   const selected=[...document.querySelectorAll('.holiday-addons input:checked')].map(e=>e.value);
   const req={consent:true,image:original,package:packageSelect.value,tone:toneSelect.value,
    product:productSelect.value,accents:selected};
   const response=await fetch('/api/public/holiday-image/preview',{method:'POST',
    headers:{'Content-Type':'application/json'},body:JSON.stringify(req),cache:'no-store',
    signal:AbortSignal.timeout(95000)});
   const result=await response.json();
   if(!response.ok)throw Error(result.error||'Image editing did not complete.');
   if(typeof result.image!=='string'||!result.image.startsWith('data:image/jpeg;base64,'))throw Error('Unexpected image format from provider.');
   realData=result.image;realBefore.src=imageObjectURL(original);realAfter.src=imageObjectURL(realData);realArea.hidden=false;
   realStatus.textContent='Your lighting design preview is ready. Compare it to the original, then save the image. Exact roofline geometry and materials still require an on-site review.';
   realArea.scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(err){realStatus.textContent=(err instanceof Error?err.message:'AI editing unavailable')+' Your instant local design is still usable.';}
  finally{realBusy=false;updateReal();}
 }
 realButton.addEventListener('click',()=>void generateRealistic());
 realSave.addEventListener('click',()=>{if(!realData)return;const a=document.createElement('a');a.href=realAfter.src;a.download='prescottsbest-holiday-ai-concept.jpg';a.click();});
 print.addEventListener('click',()=>window.print());
 // URL selects package only, never accepts arbitrary executable markup.
 const selected=new URLSearchParams(location.search).get('package');
 if(selected&&Object.hasOwn(packages,selected))packageSelect.value=selected;
 toneSelect.value=packages[packageSelect.value].tone;
 productSelect.value=packageSelect.value==='permanent'?'permanent':'c9';
 choosePackage();
 load('/site-assets/concepts/local-home-detail.webp',true).catch(()=>render());
})();
