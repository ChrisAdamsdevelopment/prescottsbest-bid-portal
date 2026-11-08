from pathlib import Path
repo=Path(r'D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\PBC_BID_PORTAL')
updated={}
def read(file):
 if file not in updated:updated[file]=(repo/file).read_text('utf8')
 return updated[file]
def swap(file,old,new,n=1):
 s=read(file)
 actual=s.count(old)
 if actual!=n:raise RuntimeError(f'{file}: found {actual}, expected {n} for {old[:110]!r}')
 updated[file]=s.replace(old,new)
html='marketing/holiday-pages.mjs'
swap(html,"'<button type=\"button\" id=\"holiday-json\" class=\"site-button outline\" disabled>Save material worksheet</button><button type=\"button\" id=\"holiday-email\" class=\"site-button outline\" disabled>Email my plan summary</button></div>'+",
 "'<button type=\"button\" id=\"holiday-json\" class=\"site-button outline\" disabled>Save material worksheet</button><button type=\"button\" id=\"holiday-email\" class=\"site-button outline\" disabled>Email my plan summary</button></div>'+"
 "\n   '<div class=\"holiday-idea-actions\"><button type=\"button\" id=\"holiday-add-idea\" class=\"site-button primary\">Add this lighting idea to My List</button>'+"
 "'<a class=\"site-button outline\" href=\"'+link('/visual-design-preview')+'#my-inspiration-list\">View saved ideas</a></div>'+")
swap(html,
 "'<p class=\"micro\">Review your choices and enter contact details before sending anything. The preview photo stays here unless you separately choose to share one.</p>'+",
 "'<p class=\"micro\">Review your choices and enter contact details before sending anything. You can save the lighting package as an idea; your house photo itself stays on your device unless you explicitly share it.</p>'+")
# Text documentation for optional AI rendering: manual strokes are not transmitted to Gemini.
swap(html,
 "It may change small visual details, and it is not an exact installation drawing.",
 "It may change small visual details and does not precisely follow manual light-run tracing; it is not an exact installation drawing.")
listjs='public/inspiration-list.js'
swap(listjs,
 "const filePattern=/^\\/site-assets\\/visual-explorer\\/[a-zA-Z0-9-]+\\/[a-zA-Z0-9-]+\\.webp$/;",
 "const filePattern=/^\\/site-assets\\/(?:visual-explorer\\/[a-zA-Z0-9-]+\\/|holiday-concepts\\/)[a-zA-Z0-9_-]+\\.webp$/;")
swap(listjs,
 "page:/^\\/(kitchen-remodeling|custom-cabinetry|deck-building-outdoor-carpentry)$/.test(x.page||'')?x.page:'',",
 "page:/^\\/(kitchen-remodeling|custom-cabinetry|deck-building-outdoor-carpentry|holiday-lighting\\/design)$/.test(x.page||'')?x.page:'',")
select='marketing/inspiration-selections.mjs'
swap(select,"import {visualExplorers} from './visual-catalog.mjs';",
 "import {visualExplorers} from './visual-catalog.mjs';\nimport {holidayImages} from './holiday-assets.mjs';")
swap(select,
 "  const explorer=visualExplorers[row.explorerId];\n  const item=explorer?.variants.find(v=>v.file===row.file);",
 """  const holiday=row.explorerId==='holiday-lighting'?holidayImages.find(v=>'/site-assets/holiday-concepts/'+v.file===row.file):null;
  const explorer=holiday?{id:'holiday-lighting',heading:'Holiday lighting design inspiration'}:visualExplorers[row.explorerId];
  const item=holiday?{name:holiday.title,caption:holiday.caption,file:row.file}:explorer?.variants.find(v=>v.file===row.file);""")
view='marketing/inspiration-view.mjs'
swap(view,
 "on any kitchen, cabinet, wood, deck or hardware design.",
 "on any kitchen, cabinet, wood, deck, hardware or holiday-lighting design.")
swap(view,
 "or <a href=\"'+link('/deck-building-outdoor-carpentry')+'\">decks</a> and tag the ideas you like.",
 "or <a href=\"'+link('/deck-building-outdoor-carpentry')+'\">decks</a> and <a href=\"'+link('/holiday-lighting/design')+'\">holiday lights</a> and tag the ideas you like.")
js='public/holiday.js'
# Add package-specific visual reference to existing inspiration list.
target=" aiConsent.addEventListener('change',()=>{aiAsk.disabled=!aiConsent.checked});"
insert=""" const holidayIdeaFile={
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
"""
swap(js,target,insert+target)
css='public/marketing.css'
updated[css]=read(css)+"""
/* Design Center cross-category navigation: consistent place to jump between design tools. */
.design-center-nav{position:sticky;top:0;z-index:48;display:flex;align-items:center;gap:12px;
 padding:10px clamp(15px,4vw,40px);background:#f8f7ef;border-bottom:1px solid #bdcfbb;
 box-shadow:0 4px 18px #1e392321}
.design-center-nav-title{white-space:nowrap;font-weight:900;font-size:12px;letter-spacing:.11em;color:#2a563c}
.design-center-nav-scroll{display:flex;align-items:center;gap:8px;overflow-x:auto;scrollbar-width:thin;
 scroll-snap-type:x proximity;min-width:0;padding-bottom:3px}
.design-center-nav-item{white-space:nowrap;scroll-snap-align:center;display:inline-flex;align-items:center;gap:6px;
 padding:9px 13px;border:1px solid #b7c9b5;background:white;border-radius:999px;
 text-decoration:none;font-size:14px;font-weight:800;color:#245136}
.design-center-nav-item:hover,.design-center-nav-item:focus-visible{background:#e7f1e5;border-color:#41664a}
.design-center-nav-item.is-current{background:#254d36;color:#fff;border-color:#254d36}
.design-center-nav-item [data-inspiration-count]{background:#d8e9cf;color:#22412c;border-radius:999px;padding:0 5px}
@media(max-width:640px){.design-center-nav{display:block;padding:7px 10px}
 .design-center-nav-title{font-size:10px;display:block;margin:0 0 4px 4px}
 .design-center-nav-item{min-height:40px;padding:7px 11px;font-size:13px}
 .design-center-nav-scroll{gap:7px}}
/* Seasonal program appears as a full-sized homepage feature rather than a small secondary link. */
.holiday-home-feature{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(16px,3vw,38px);
 padding:clamp(24px,5vw,64px) max(4vw,22px);background:linear-gradient(115deg,#15382b,#31563d);
 color:#fff;align-items:center}
.holiday-home-feature-copy{max-width:720px}.holiday-home-feature .kicker{color:#f8d89e}
.holiday-home-feature h2{font-size:clamp(31px,4vw,54px);line-height:1.07;letter-spacing:-.035em;
 color:#fff;margin:12px 0 16px}
.holiday-home-feature p{color:#f0f3e6;font-size:clamp(16px,1.7vw,20px);line-height:1.55}
.holiday-home-feature .holiday-home-feature-price{font-weight:800;color:#f9e6b8;font-size:17px}
.holiday-home-feature .site-button.primary{background:#fff;color:#1d4831;border-color:#fff}
.holiday-home-feature .site-button.outline{background:transparent;color:#fff;border-color:#d7e3cc}
.holiday-home-feature-photo{display:block;overflow:hidden;border-radius:16px;box-shadow:0 17px 40px #00180d77}
.holiday-home-feature-photo img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}
@media(max-width:800px){.holiday-home-feature{grid-template-columns:1fr}.holiday-home-feature-photo img{aspect-ratio:16/9}}
/* Holiday editor: explicit tools, clearly selectable individual runs, non-destructive corrections. */
.holiday-edit-intro{padding:12px 16px;background:#f3f7ee;border:1px solid #b8d0b5;border-radius:13px;
 scroll-margin-top:75px}
.holiday-edit-intro h2{margin:0 0 8px}.holiday-edit-intro p{font-size:15px;line-height:1.5;margin:0}
.holiday-editor-toolbar{display:flex;flex-wrap:wrap;gap:8px}
.holiday-editor-toolbar button{flex:1 1 110px;min-height:52px;border:2px solid #aac1a9;border-radius:11px;
 background:#fff;color:#244935;cursor:pointer;font-weight:800;font-size:15px;padding:8px}
.holiday-editor-toolbar button[aria-pressed=true]{background:#224c37;color:#fff;border-color:#224c37}
.holiday-editor-buttons{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.holiday-editor-buttons button{min-height:47px;padding:8px 10px;font-size:14px}
.holiday-editor-buttons button:disabled,.holiday-editor-toolbar button:disabled{opacity:.47;cursor:not-allowed}
.holiday-run-panel{border:1px solid #d4dccd;border-radius:12px;padding:13px;background:#f9faf5}
.holiday-run-panel h3{margin:0;font-size:19px}.holiday-run-panel p{margin:4px 0;font-size:13px!important}
.holiday-strand-list{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:7px}
.holiday-strand-list li{display:flex;gap:7px;align-items:center;flex-wrap:wrap;padding:8px;
 background:#fff;border:1px solid #dae1d7;border-radius:8px;font-size:13px}
.holiday-strand-list li.holiday-run-selected{border-color:#3b704c;background:#eef5eb}
.holiday-strand-list li span{flex:1 1 100%;font-weight:700}
.holiday-strand-list li button{flex:1;background:#fff;min-height:38px;border:1px solid #8cae95;
 color:#205137;border-radius:7px;padding:7px;font-weight:800;cursor:pointer}
.holiday-strand-list li button[aria-pressed=true]{background:#e1efdb}
.holiday-preview-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.holiday-preview-heading h2{margin:0}.holiday-preview-heading button{min-height:43px;font-size:14px}
.holiday-preview-heading button[aria-pressed=true]{background:#214936;color:white}
.holiday-edit-return{display:inline-block;margin-bottom:17px;font-size:15px;font-weight:800}
.holiday-idea-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
.holiday-idea-actions .site-button{flex:1;min-width:180px}
#holiday-canvas{touch-action:none}
@media(max-width:640px){.holiday-editor-toolbar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
 .holiday-editor-toolbar button{min-height:52px;font-size:13px;min-width:0;padding:7px 3px}
 .holiday-editor-buttons button{min-height:45px;font-size:13px}
 .holiday-preview-heading h2{font-size:23px}.holiday-idea-actions{display:grid;grid-template-columns:1fr}
 .holiday-idea-actions .site-button{min-width:0}}
"""
for file,body in updated.items():
 if not body.strip():raise ValueError(file+' empty')
for file,body in updated.items():(repo/file).write_text(body,'utf8')
print('PATCHED',len(updated),sorted(updated))
