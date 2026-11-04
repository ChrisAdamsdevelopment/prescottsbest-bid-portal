// Client-side photo preparation. The browser removes EXIF/GPS metadata by drawing to canvas.
// The server independently decodes, validates and re-encodes every accepted image.
const photoInput=document.querySelector('#lead-photos');
const photoStatus=document.querySelector('#lead-photo-status');
const photoList=document.querySelector('#lead-photo-list');
const photoClear=document.querySelector('#lead-photos-clear');
const photoWrap=document.querySelector('#lead-photo-section');
if(photoInput){
 let previews=[];
 function resetPreviews(){
  for(const url of previews)URL.revokeObjectURL(url);
  previews=[];photoList?.replaceChildren();
  if(photoClear)photoClear.hidden=true;
 }
 photoInput.addEventListener('change',()=>{
  resetPreviews();
  const files=Array.from(photoInput.files||[]);
  if(files.length>3){photoStatus.textContent='Please choose no more than three photos.';photoInput.value='';return;}
  if(files.some(f=>f.size>12_000_000)){photoStatus.textContent='One of these photos is over 12 MB. Please pick a smaller picture.';photoInput.value='';return;}
  if(!files.length){photoStatus.textContent='You can submit the project request without photos.';return;}
  for(const file of files){
   const item=document.createElement('li');
   const src=URL.createObjectURL(file);previews.push(src);
   const thumb=document.createElement('img');thumb.src=src;thumb.alt='Selected photo preview';thumb.loading='lazy';
   const label=document.createElement('span');label.textContent=file.name.length>40?file.name.slice(0,37)+'…':file.name;
   item.append(thumb,label);photoList?.append(item);
  }
  photoStatus.textContent=files.length+' photo'+(files.length===1?'':'s')+' selected. We will shrink them and remove photo location metadata before sending.';
  if(photoClear)photoClear.hidden=false;
 });
 photoClear?.addEventListener('click',()=>{photoInput.value='';resetPreviews();photoStatus.textContent='Selected photos removed.';});
 window.pbcResetPhotoSelection=()=>{photoInput.value='';resetPreviews();photoStatus.textContent='You can add up to three photos (optional).';};
 window.pbcPreparePhotos=async()=>{
  const files=Array.from(photoInput.files||[]);
  if(!files.length)return [];
  if(photoWrap?.hidden)throw Error('Direct photo upload is currently unavailable.');
  if(files.length>3)throw Error('Please select no more than three photos.');
  const output=[];
  for(const file of files){
   if(file.size>12_000_000||!file.type.startsWith('image/'))throw Error('Please select a photo smaller than 12 MB.');
   let bitmap,imageObject,objectUrl;
   try{
    if(typeof createImageBitmap==='function')bitmap=await createImageBitmap(file);
    else throw Error('Fallback');
   }catch{
    objectUrl=URL.createObjectURL(file);
    imageObject=new Image();
    await new Promise((resolve,reject)=>{imageObject.onload=resolve;imageObject.onerror=reject;imageObject.src=objectUrl;});
   }
   try{
    const width=bitmap?.width||imageObject?.naturalWidth;
    const height=bitmap?.height||imageObject?.naturalHeight;
    if(!width||!height||width*height>36_000_000)throw Error('Photo dimensions are too large.');
    const scale=Math.min(1,1600/Math.max(width,height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx)throw Error('Photo editing is not available in this browser.');
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(bitmap||imageObject,0,0,canvas.width,canvas.height);
    let blob;
    for(const quality of [.82,.7,.58]){
     blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
     if(blob&&blob.size<=1_750_000)break;
    }
    if(!blob||blob.size>1_750_000)throw Error('Photo could not be reduced enough. Try a smaller image.');
    const encoded=await new Promise((resolve,reject)=>{
     const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||'').split(',')[1]||'');
     reader.onerror=()=>reject(new Error('Photo could not be read.'));reader.readAsDataURL(blob);
    });
    output.push({mimeType:'image/jpeg',base64:encoded});
   }finally{
    try{bitmap?.close()}catch{}
    if(objectUrl)URL.revokeObjectURL(objectUrl);
   }
  }
  return output;
 };
}
