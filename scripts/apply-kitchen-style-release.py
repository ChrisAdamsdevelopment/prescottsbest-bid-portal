from pathlib import Path
repo=Path(r'D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\PBC_BID_PORTAL')
modifications={}
def get(name):
 if name not in modifications: modifications[name]=(repo/name).read_text('utf8')
 return modifications[name]
def replace(name,old,new,count=1):
 text=get(name)
 n=text.count(old)
 if n!=count:raise RuntimeError(f'{name}: {n} matches for {old[:120]!r}; expected {count}')
 modifications[name]=text.replace(old,new)
catalog='marketing/visual-catalog.mjs'
replace(catalog,"// Approved visual-inspiration comparisons sourced from the project's local generated-concepts inbox.",
"import {kitchenVisualConfigs} from './kitchen-visual-config.mjs';\n// Approved visual-inspiration comparisons sourced from the project's local generated-concepts inbox.")
replace(catalog,"export const visualExplorers={","export const visualExplorers={\n ...kitchenVisualConfigs,")
replace(catalog," path==='/deck-building-outdoor-carpentry'?[visualExplorers['deck-inspiration']]:[];",
" path==='/deck-building-outdoor-carpentry'?[visualExplorers['deck-inspiration']]:\n path==='/kitchen-remodeling'?[visualExplorers['kitchen-inspiration'],visualExplorers['wood-stain-boards']]:[];")
replace(catalog,
 " const first=config.variants[0];\n const data=JSON.stringify",
 " const first=config.variants[0];\n const iw=first.width||1280,ih=first.height||960,tw=first.thumbWidth||480;\n const data=JSON.stringify")
replace(catalog,
 """ srcset="'+first.thumb+' 480w, '+first.file+' 1280w" sizes="(max-width:700px) 100vw, 800px" width="1280" height="960" loading="lazy" """,
 """ srcset="'+first.thumb+' '+tw+'w, '+first.file+' '+iw+'w" sizes="(max-width:700px) 100vw, 800px" width="'+iw+'" height="'+ih+'" loading="lazy" """)
replace(catalog,
 "  description:v.alt,caption:v.caption,width:1280,height:960",
 "  description:v.alt,caption:v.caption,width:v.width||1280,height:v.height||960")
client='public/visual-explorer.js'
replace(client,
 "   const srcset=v.thumb+' 480w, '+v.file+' 1280w';",
 "   const srcset=v.thumb+' '+(v.thumbWidth||480)+'w, '+v.file+' '+(v.width||1280)+'w';")
replace(client,
 "   image.srcset=srcset;\n   image.alt=v.alt;",
 "   image.srcset=srcset;\n   image.width=v.width||1280;image.height=v.height||960;\n   image.alt=v.alt;")
routes='marketing/routes.mjs'
replace(routes,"   '- [Compare built-in cabinetry finishes]('+site+'/custom-cabinetry): Select wood-tone families and hardware styles; illustrative options only.',",
"   '- [Compare built-in cabinetry finishes]('+site+'/custom-cabinetry): Select wood-tone families and hardware styles; illustrative options only.',\n   '- [Kitchen design inspiration]('+site+'/kitchen-remodeling): Light, medium and dark kitchen styles with room views and finish details.',\n   '- [Wood grain and stain reference gallery]('+site+'/kitchen-remodeling): Six wood-type boards showing six illustrative stain appearances each; real samples are required.',")
css='public/marketing.css'
modifications[css]=get(css)+"""
/* Kitchen finish studio: landscape design concepts and portrait wood-species reference boards. */
.visual-explorer[data-visual-explorer="kitchen-inspiration"] .visual-main-figure img{
 aspect-ratio:43/29;object-fit:contain;background:#ecebe4;
}
.visual-explorer[data-visual-explorer="wood-stain-boards"] .visual-main-figure img{
 aspect-ratio:4/5;object-fit:contain;background:#fff;max-height:740px;
}
.visual-explorer[data-visual-explorer="wood-stain-boards"] .visual-main-figure{
 max-width:650px;margin-inline:auto;
}
.visual-explorer[data-visual-explorer="wood-stain-boards"] .visual-workspace{
 grid-template-columns:minmax(0,1.1fr) minmax(280px,.9fr);
}
@media(max-width:920px){
 .visual-explorer[data-visual-explorer="wood-stain-boards"] .visual-workspace{grid-template-columns:1fr}
}
"""
package='package.json'
replace(package,"node --check marketing/visual-preview-copy.mjs\"",
"node --check marketing/visual-preview-copy.mjs && node --check marketing/kitchen-visual-config.mjs\"")
tests='tests/visual-explorer.test.mjs'
replace(tests,"has 18 unique image variants","has 30 unique image variants")
replace(tests,"assert.equal(all.length,18);","assert.equal(all.length,30);")
replace(tests,"assert.equal(visualGroups().length,3);","assert.equal(visualGroups().length,5);")
replace(tests,"assert.equal(new Set(all.map(v=>v.file)).size,18);","assert.equal(new Set(all.map(v=>v.file)).size,30);")
replace(tests,
 "const cases=[['/custom-cabinetry',2,12],['/deck-building-outdoor-carpentry',1,6]];",
 "const cases=[['/custom-cabinetry',2,12],['/deck-building-outdoor-carpentry',1,6],['/kitchen-remodeling',2,12]];")
# Preserve other tests relying on width 1280 for existing images.
modifications[tests]=get(tests)+"""
test('kitchen inspiration separates whole-room views from finish details without a false fixed-room comparison',()=>{
 const html=marketingPage('/remodeling-preview/kitchen-remodeling',
  {indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});
 assert.match(html,/KITCHEN STYLE EXPLORER/);
 assert.match(html,/Light & bright/);
 assert.match(html,/Warm medium wood/);
 assert.match(html,/Deep dark wood/);
 assert.match(html,/Whole kitchen/);
 assert.match(html,/Finish close-up/);
 assert.match(html,/different design idea/);
 assert.match(html,/six visual-reference boards/);
 assert.equal(visualExplorersForService('/kitchen-remodeling').length,2);
 const data=visualExplorersForService('/kitchen-remodeling');
 const scene=data[0],wood=data[1];
 assert.equal(scene.variants.length,6);
 assert.equal(wood.variants.length,6);
 assert.ok(scene.variants.every(v=>v.width===860&&v.height===580));
 assert.ok(wood.variants.every(v=>v.width===900&&v.height===1125));
 const parsed=[...html.matchAll(/<script type="application\\/ld\\+json">([\\s\\S]*?)<\\/script>/g)]
  .map(x=>JSON.parse(x[1])).find(x=>x['@type']==='ImageGallery');
 assert.equal(parsed.image.length,12);
 assert.equal(parsed.image.filter(x=>x.width===860&&x.height===580).length,6);
 assert.equal(parsed.image.filter(x=>x.width===900&&x.height===1125).length,6);
});
"""
for name,value in modifications.items():
 if not value.strip():raise ValueError('Blank '+name)
for name,value in modifications.items():
 (repo/name).write_text(value,'utf8')
print('PATCHED',len(modifications),sorted(modifications))
