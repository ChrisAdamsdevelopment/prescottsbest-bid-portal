// Browser-only inspiration basket. No tracking, API calls or automatic sharing.
// A visitor must submit the consultation form before the contractor receives chosen ideas.
(()=>{
 const KEY='pbc-inspiration-list-v1';
 const MAX=20;
 const filePattern=/^\/site-assets\/(?:visual-explorer\/[a-zA-Z0-9-]+\/|holiday-concepts\/)[a-zA-Z0-9_-]+\.webp$/;
 const clean=(value,n)=>typeof value==='string'?value.slice(0,n):'';
 let fallback=[];
 const valid=(x)=>x&&typeof x==='object'&&
  /^[a-z][a-z0-9-]{1,65}$/.test(x.explorerId)&&filePattern.test(x.file);
 const normalize=(x)=>({
  explorerId:x.explorerId,file:x.file,
  name:clean(x.name,130),caption:clean(x.caption,300),
  thumb:filePattern.test(x.thumb||'')?x.thumb:x.file,
  category:clean(x.category,110),
  page:/^\/(kitchen-remodeling|custom-cabinetry|deck-building-outdoor-carpentry|holiday-lighting\/design)$/.test(x.page||'')?x.page:'',
  note:clean(x.note,180)
 });
 const read=()=>{
  try{
   const raw=localStorage.getItem(KEY);
   if(!raw)return fallback.slice();
   const data=JSON.parse(raw);
   return Array.isArray(data)?data.filter(valid).slice(0,MAX).map(normalize):[];
  }catch{return fallback.slice()}
 };
 const notify=()=>{
  refresh();
  window.dispatchEvent(new Event('pbc:inspiration-change'));
 };
 const write=(items)=>{
  const cleanItems=items.filter(valid).slice(0,MAX).map(normalize);
  try{
   localStorage.setItem(KEY,JSON.stringify(cleanItems));
   fallback=cleanItems;
   notify();return true;
  }catch{
   fallback=cleanItems;notify();return false;
  }
 };
 const identity=x=>x.explorerId+'|'+x.file;
 const has=(explorerId,file)=>read().some(x=>x.explorerId===explorerId&&x.file===file);
 const add=(x)=>{
  if(!valid(x))return {ok:false,reason:'invalid'};
  const items=read();
  if(items.some(i=>identity(i)===identity(x)))return {ok:true,already:true,count:items.length};
  if(items.length>=MAX)return {ok:false,reason:'limit',count:items.length};
  const persisted=write([...items,normalize(x)]);
  return {ok:true,persisted,count:items.length+1};
 };
 const remove=(explorerId,file)=>{
  const items=read().filter(x=>!(x.explorerId===explorerId&&x.file===file));
  write(items);
 };
 const setNote=(explorerId,file,value)=>{
  const items=read().map(x=>x.explorerId===explorerId&&x.file===file?
   {...x,note:clean(value,180)}:x);
  write(items);
 };
 const payload=()=>read().map(x=>({explorerId:x.explorerId,file:x.file,note:x.note||''}));
 const plainText=()=>{
  const items=read();
  return items.length?
   'My Design Inspiration List ('+items.length+' choices):\n'+items.map((x,i)=>
    (i+1)+'. '+x.category+' — '+x.name+'\n   '+x.caption+
    (x.note?'\n   My note: '+x.note:'')+
    '\n   https://prescottsbestconstruction.com'+x.file).join('\n'):
   'My Design Inspiration List: no ideas selected.';
 };
 const make=(tag,cls,content)=>{
  const elem=document.createElement(tag);
  if(cls)elem.className=cls;
  if(content!==undefined)elem.textContent=content;
  return elem;
 };
 const button=(label,attr)=>{
  const b=make('button','inspiration-remove',label);
  b.type='button';b.setAttribute('data-action',attr);return b;
 };
 const render=(root)=>{
  const items=read();
  const list=root.querySelector('[data-inspiration-items]');
  const empty=root.querySelector('[data-inspiration-empty]');
  const status=root.querySelector('[data-inspiration-status]');
  if(!list)return;
  list.replaceChildren();
  if(empty)empty.hidden=items.length>0;
  for(const x of items){
   const li=make('li','inspiration-item');
   const pic=make('img','inspiration-thumb');
   pic.src=x.thumb;pic.alt=x.name;pic.width=160;pic.height=108;pic.loading='lazy';
   const content=make('div','inspiration-item-body');
   const title=make('strong','',x.name);
   const group=make('p','inspiration-category',x.category);
   const caption=make('p','inspiration-caption',x.caption);
   const noteLabel=make('label','inspiration-note-label','Optional note for our team');
   const note=make('input','inspiration-note');
   note.type='text';note.maxLength=180;note.value=x.note;
   note.placeholder='What caught your eye?';
   note.setAttribute('aria-label','Your note about '+x.name);
   note.addEventListener('change',()=>setNote(x.explorerId,x.file,note.value));
   noteLabel.append(note);
   const removeButton=button('Remove idea','remove');
   removeButton.addEventListener('click',()=>remove(x.explorerId,x.file));
   content.append(group,title,caption,noteLabel,removeButton);
   li.append(pic,content);list.append(li);
  }
  const clear=root.querySelector('[data-inspiration-clear]');
  if(clear)clear.hidden=items.length===0;
  const counter=root.querySelector('[data-inspiration-total]');
  if(counter)counter.textContent=String(items.length);
  if(status)status.textContent=items.length?items.length+' saved idea'+(items.length===1?'':'s')+' ready to include with a request.':'No ideas saved yet.';
 };
 const refresh=()=>{
  const items=read();
  document.querySelectorAll('[data-inspiration-count]').forEach(el=>el.textContent=String(items.length));
  document.querySelectorAll('[data-inspiration-list]').forEach(render);
  const float=document.querySelector('[data-inspiration-floating]');
  if(float)float.hidden=items.length===0;
 };
 document.querySelectorAll('[data-inspiration-list]').forEach(root=>{
  const clear=root.querySelector('[data-inspiration-clear]');
  clear?.addEventListener('click',()=>{
   if(window.confirm('Clear all saved design ideas from this device?'))write([]);
  });
 });
 window.addEventListener('storage',(e)=>{if(e.key===KEY)refresh()});
 window.pbcInspirationList={read,has,add,remove,setNote,payload,plainText,refresh,max:MAX};
 const link=document.querySelector('[data-inspiration-link]');
 if(link){
  const floating=make('a','inspiration-floating');
  floating.href=link.href;
  floating.setAttribute('data-inspiration-floating','');
  floating.textContent='My Ideas · ';
  const number=make('span','');
  number.setAttribute('data-inspiration-count','');floating.append(number);
  document.body.append(floating);
 }
 refresh();
})();
