// Visual Design Studio: client-only controls, no customer upload, no tracking or auto-send.
(()=>{
 const roots=document.querySelectorAll('[data-visual-explorer]');
 for(const root of roots){
  const json=root.querySelector('[data-visual-catalog]');
  const image=root.querySelector('[data-visual-main]');
  const caption=root.querySelector('[data-visual-caption]');
  const summary=root.querySelector('[data-visual-selection]');
  const feedback=root.querySelector('[data-visual-feedback]');
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
  const repaint=()=>{
   const v=current();
   image.src=v.file;
   const srcset=v.thumb+' 480w, '+v.file+' 1280w';
   image.srcset=srcset;
   image.alt=v.alt;
   caption.textContent=v.caption;
   summary.textContent=v.name;
   for(const b of root.querySelectorAll('[data-visual-axis]')){
    b.setAttribute('aria-pressed',String(choices[b.dataset.visualAxis]===b.dataset.visualValue));
   }
   feedback.textContent='';
  };
  root.addEventListener('click',async e=>{
   const b=e.target.closest('button');if(!b||!root.contains(b))return;
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
  repaint();
 }
})();
