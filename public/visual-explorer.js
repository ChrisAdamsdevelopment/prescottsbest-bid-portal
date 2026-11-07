// Visual Design Studio: client-only controls, no customer upload, no tracking or auto-send.
(()=>{
 const roots=document.querySelectorAll('[data-visual-explorer]');
 for(const root of roots){
  const json=root.querySelector('[data-visual-catalog]');
  const image=root.querySelector('[data-visual-main]');
  const caption=root.querySelector('[data-visual-caption]');
  const summary=root.querySelector('[data-visual-selection]');
  const feedback=root.querySelector('[data-visual-feedback]');
  const tag=root.querySelector('[data-inspiration-tag]');
  if(!json||!image||!caption||!summary||!feedback)continue;
  let data;
  try{data=JSON.parse(json.textContent)}catch{continue}
  if(!data||!Array.isArray(data.axes)||!Array.isArray(data.variants))continue;
  const key='pbc-visual-look:'+data.id;
  const choices=Object.fromEntries(data.axes.map(axis=>[axis.id,axis.options[0]?.value]));
  try{
   const saved=JSON.parse(localStorage.getItem(key)||'null');
   if(saved&&typeof saved==='object')
    for(const axis of data.axes){
     if(axis.options.some(x=>x.value===saved[axis.id]))choices[axis.id]=saved[axis.id];
    }
  }catch{}
  const current=()=>data.variants.find(v=>Object.entries(choices).every(([k,val])=>v.choice?.[k]===val))||data.variants[0];
  const describe=()=>{
   const v=current();
   const details=data.axes.map(axis=>{
    const option=axis.options.find(x=>x.value===choices[axis.id]);
    return axis.title+': '+(option?.label||choices[axis.id]);
   });
   return 'Prescott\'s Best Construction — '+root.querySelector('h2')?.textContent+'\n'+details.join('\n')+'\n'+v.caption+'\nDesign inspiration only; confirm materials and scope on site.\nhttps://prescottsbestremodeling.com'+location.pathname;
  };
  const syncTag=()=>{
   if(!tag)return;
   const variant=current();
   const saved=window.pbcInspirationList?.has(data.id,variant.file)===true;
   tag.setAttribute('aria-pressed',String(saved));
   tag.textContent=saved?'Added to My Inspiration List':'Add to My Inspiration List';
  };
  const repaint=()=>{
   const v=current();
   image.src=v.file;
   const srcset=v.thumb+' '+(v.thumbWidth||480)+'w, '+v.file+' '+(v.width||1280)+'w';
   image.srcset=srcset;
   image.width=v.width||1280;image.height=v.height||960;
   image.alt=v.alt;
   caption.textContent=v.caption;
   summary.textContent=v.name;
   for(const b of root.querySelectorAll('[data-visual-axis]')){
    b.setAttribute('aria-pressed',String(choices[b.dataset.visualAxis]===b.dataset.visualValue));
   }
   feedback.textContent='';
   syncTag();
  };
  root.addEventListener('click',async e=>{
   const request=e.target.closest('[data-visual-request]');
   if(request&&root.contains(request)){
    try{sessionStorage.setItem('pbc_visual_preview_draft',describe().slice(0,500))}catch{}
    return;
   }
   const b=e.target.closest('button');if(!b||!root.contains(b))return;
   if(b.hasAttribute('data-inspiration-tag')){
    const bag=window.pbcInspirationList;
    if(!bag){feedback.textContent='The list is temporarily unavailable. Please try again.';return}
    const item=current();
    if(bag.has(data.id,item.file)){
     bag.remove(data.id,item.file);repaint();
     feedback.textContent='Removed this design from your inspiration list.';
    }else{
     const page=location.pathname.replace(/^\/remodeling-preview/,'')||'/';
     const result=bag.add({explorerId:data.id,file:item.file,thumb:item.thumb,
      name:item.name,caption:item.caption,category:root.querySelector('h2')?.textContent||data.id,page});
     repaint();
     feedback.textContent=result.ok?(result.persisted===false?
      'Added for this session; browser storage is unavailable. Copy your ideas before leaving.':
      'Added to your Inspiration List. You can keep exploring, or review your saved ideas.'):
      result.reason==='limit'?'Your list is full (20 ideas). Remove one before adding another.':
      'Could not add this choice.';
    }
    return;
   }
   if(b.hasAttribute('data-visual-axis')){
    const axis=b.dataset.visualAxis;
    if(!Object.hasOwn(choices,axis))return;
    const value=b.dataset.visualValue;
    if(!(data.axes.find(x=>x.id===axis)?.options||[]).some(x=>x.value===value))return;
    choices[axis]=value;repaint();return;
   }
   if(b.hasAttribute('data-visual-save')){
    try{
     localStorage.setItem(key,JSON.stringify(choices));
     feedback.textContent='Saved on this device. You can return to this page to see your choices.';
    }catch{feedback.textContent='Browser storage is unavailable. Use Copy design details instead.'}
   }
   if(b.hasAttribute('data-visual-copy')){
    const content=describe();
    try{
     if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
     await navigator.clipboard.writeText(content);
     feedback.textContent='Design details copied. You can paste them into an email or consultation request.';
    }catch{
     const box=document.createElement('textarea');box.value=content;box.className='visual-copy-fallback';
     box.setAttribute('aria-label','Copy these design details');
     feedback.replaceChildren(document.createTextNode('Select and copy these design details: '),box);
     box.focus();box.select();
    }
   }
  });
  window.addEventListener('pbc:inspiration-change',syncTag);
  repaint();
 }
})();
