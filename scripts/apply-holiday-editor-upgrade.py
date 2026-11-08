from pathlib import Path
repo=Path(r'D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\PBC_BID_PORTAL')
path=repo/'public/holiday.js'
text=path.read_text('utf8')
def swap(old,new,n=1):
 global text
 count=text.count(old)
 if count!=n:raise RuntimeError(f'Expected {n} replacements, got {count}: {old[:100]!r}')
 text=text.replace(old,new)
swap('let image=null,points=[],generated=null;',
"""let image=null,strokes=[],selectedId=null,drawingId=null,mode='select',nextId=1;
 let undoStack=[],redoStack=[],generated=null,showBefore=false,dragging=null,exporting=false;
 const selectedRun=()=>strokes.find(s=>s.id===selectedId)||null;
 const editHistory=()=>{undoStack.push(JSON.stringify({strokes,selectedId,drawingId,nextId}));if(undoStack.length>35)undoStack.shift();redoStack=[];};
 const restore=(snapshot)=>{const obj=JSON.parse(snapshot);strokes=obj.strokes;selectedId=obj.selectedId;drawingId=obj.drawingId;nextId=obj.nextId;render();};
 const undoChange=()=>{if(!undoStack.length)return;redoStack.push(JSON.stringify({strokes,selectedId,drawingId,nextId}));restore(undoStack.pop());setStatus('Last edit undone.');};
 const redoChange=()=>{if(!redoStack.length)return;undoStack.push(JSON.stringify({strokes,selectedId,drawingId,nextId}));restore(redoStack.pop());setStatus('Edit restored.');};""")
swap("ctx.fillStyle='rgba(8,21,39,.34)';ctx.fillRect(box.x,box.y,box.w,box.h);",
 "if(!showBefore){ctx.fillStyle='rgba(8,21,39,.24)';ctx.fillRect(box.x,box.y,box.w,box.h);}")
swap("ctx.fillText('Then tap along your roofline to map the lights',canvas.width/2,canvas.height/2+32);",
 "ctx.fillText('Choose Draw lights to add your own lighting runs',canvas.width/2,canvas.height/2+32);")
start=text.index(' function segmentNotes(totalFeet){')
end=text.index(' const USD=x=>',start)
core=(repo/'scripts/holiday_editor_core.txt').read_text('utf8')
text=text[:start]+core+'\n'+text[end:]
start=text.index(' async function load(src,sample=false){')
end=text.index(' function choosePackage(){',start)
interactions=(repo/'scripts/holiday_editor_interactions.txt').read_text('utf8')
text=text[:start]+interactions+'\n'+text[end:]
swap("""  toneSelect.value=packages[packageSelect.value].tone;
  productSelect.value=packageSelect.value==='permanent'?'permanent':'c9';
  document.querySelectorAll('.holiday-style-pick')""",
"""  toneSelect.value=packages[packageSelect.value].tone;
  productSelect.value=packageSelect.value==='permanent'?'permanent':'c9';
  if(mode==='select'&&selectedRun()){
   editHistory();selectedRun().tone=toneSelect.value;selectedRun().product=productSelect.value;
  }
  document.querySelectorAll('.holiday-style-pick')""")
swap(""" [toneSelect,productSelect,feet,access].forEach(el=>el.addEventListener('change',()=>{clearReal();render()}));""",
""" [toneSelect,productSelect].forEach(el=>el.addEventListener('change',()=>{
  const run=mode==='draw'?strokes.find(s=>s.id===drawingId):selectedRun();
  if(run){editHistory();run.tone=toneSelect.value;run.product=productSelect.value;
   setStatus('Color or product updated for the selected run. Other runs keep their settings.');}
  else setStatus('New light runs will use these colors and this light type.');
  clearReal();render();
 }));
 [feet,access].forEach(el=>el.addEventListener('change',()=>{clearReal();render()}));""")
swap(""" save.addEventListener('click',()=>canvas.toBlob(blob=>blob?download(blob,'prescottsbest-holiday-preview.png'):setStatus('Image export failed.'),'image/png'));""",
""" save.addEventListener('click',()=>{
  const original=showBefore;showBefore=false;exporting=true;render();
  canvas.toBlob(blob=>{
   exporting=false;showBefore=original;render();
   if(blob)download(blob,'prescottsbest-holiday-preview.png');
   else setStatus('Could not export this preview image.');
  },'image/png');
 });""")
swap("hasLocalPreview:!!image,hasDrawnLights:points.length>=2",
 "hasLocalPreview:!!image,hasDrawnLights:strokes.some(s=>s.points.length>=2),lightRunCount:strokes.filter(s=>s.points.length>=2).length")
# All original photo / Gemini actions remain opt-in and independent of manual markup.
if 'points.length' in text:
 print('POINTS_REFERENCES',[line.strip() for line in text.splitlines() if 'points.length' in line])
path.write_text(text,'utf8')
print('UPDATED_HOLIDAY_EDITOR',len(text))
