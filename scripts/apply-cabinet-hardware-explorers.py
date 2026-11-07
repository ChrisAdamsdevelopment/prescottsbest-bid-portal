from pathlib import Path
repo=Path(r'D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\PBC_BID_PORTAL')
parts={}
def read(file):
 if file not in parts: parts[file]=(repo/file).read_text('utf8')
 return parts[file]
def change(file,old,new,n=1):
 s=read(file);found=s.count(old)
 if found!=n:raise ValueError(f'{file}: got {found} for {old[:125]!r}, expected {n}')
 parts[file]=s.replace(old,new)
catalog='marketing/visual-catalog.mjs'
change(catalog,"import {kitchenVisualConfigs} from './kitchen-visual-config.mjs';",
"import {kitchenVisualConfigs} from './kitchen-visual-config.mjs';\nimport {hardwareVisualConfigs} from './hardware-visual-config.mjs';")
change(catalog," ...kitchenVisualConfigs,"," ...kitchenVisualConfigs,\n ...hardwareVisualConfigs,")
change(catalog,
 "return path==='/custom-cabinetry'?[visualExplorers['cabinet-finishes'],visualExplorers['sewing-storage']]:",
 "return path==='/custom-cabinetry'?[visualExplorers['cabinet-finishes'],visualExplorers['sewing-storage'],visualExplorers['hardware-exterior'],visualExplorers['hardware-hinges']]:")
change(catalog,
 "path==='/kitchen-remodeling'?[visualExplorers['kitchen-inspiration'],visualExplorers['wood-stain-boards']]:[];",
 "path==='/kitchen-remodeling'?[visualExplorers['kitchen-inspiration'],visualExplorers['wood-stain-boards'],visualExplorers['hardware-exterior'],visualExplorers['hardware-hinges']]:[];")
change(catalog,
 " return '<section class=\"site-section visual-explorer\" data-visual-explorer=\"'+escaped(config.id)+'\"",
 " return '<section class=\"site-section visual-explorer\" id=\"'+escaped(config.id)+'\" data-visual-explorer=\"'+escaped(config.id)+'\"")
change(catalog,
 "export function visualExplorerSection(config,link){",
 """export function visualQuickLinks(path){
 const configs=visualExplorersForService(path);
 if(configs.length<3)return '';
 return '<nav class="visual-quicklinks" aria-label="Jump to a design selector"><strong>Explore your options</strong>'+
 configs.map(c=>'<a href="#'+escaped(c.id)+'">'+escaped(c.kicker==='INSIDE THE CABINET DOOR'?'Hinges':c.kicker==='KNOBS • CUP PULLS • BAR HANDLES'?'Knobs & pulls':c.heading)+'</a>').join('')+'</nav>';
}
export function visualExplorerSection(config,link){""")
site='marketing/site.mjs'
change(site,
 "import {visualExplorerSection,visualExplorersForService,visualImageObjectsForPage} from './visual-catalog.mjs';",
 "import {visualExplorerSection,visualExplorersForService,visualImageObjectsForPage,visualQuickLinks} from './visual-catalog.mjs';")
change(site,
 " visualExplorersForService(s.path).map(config=>visualExplorerSection(config,link)).join('')+",
 " visualQuickLinks(s.path)+visualExplorersForService(s.path).map(config=>visualExplorerSection(config,link)).join('')+")
change(site,
 "description:'Illustrative cabinetry and outdoor living design choices; not documented completed projects.',",
 "description:'Illustrative kitchen, cabinetry, cabinet hardware, wood stain and outdoor living design choices; not documented completed projects or product specifications.',")
routes='marketing/routes.mjs'
change(routes,
 "   '- [Wood grain and stain reference gallery]('+site+'/kitchen-remodeling): Six wood-type boards showing six illustrative stain appearances each; real samples are required.',",
 "   '- [Wood grain and stain reference gallery]('+site+'/kitchen-remodeling): Six wood-type boards showing six illustrative stain appearances each; real samples are required.',\n   '- [Cabinet knob and pull choices]('+site+'/kitchen-remodeling#hardware-exterior): Six hardware finish families and three outside handle styles, illustrative close-ups.',\n   '- [Inside cabinet hinge styles]('+site+'/custom-cabinetry#hardware-hinges): Compare concealed, butt and decorative hinge shapes in different finishes; compatibility must be verified.',")
package='package.json'
change(package,
 "node --check marketing/kitchen-visual-config.mjs\"",
 "node --check marketing/kitchen-visual-config.mjs && node --check marketing/hardware-visual-config.mjs\"")
css='public/marketing.css'
parts[css]=read(css)+"""
/* Hardware design options: photographs separated into inside hinges and outside handles. */
.visual-quicklinks{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:15px 19px;margin:20px auto;
 max-width:1140px;background:#eef3e9;border:1px solid #c4d5c6;border-radius:14px}
.visual-quicklinks strong{margin-right:8px;color:#244b34}
.visual-quicklinks a{padding:8px 11px;border:1px solid #abc7b1;border-radius:999px;color:#1e5635;
 background:#fff;text-decoration:none;font-weight:700;line-height:1.4}
.visual-quicklinks a:focus-visible,.visual-quicklinks a:hover{outline:2px solid #347c4b;outline-offset:2px}
.visual-explorer[id]{scroll-margin-top:90px}
.visual-explorer[data-visual-explorer="hardware-exterior"] .visual-main-figure img,
.visual-explorer[data-visual-explorer="hardware-hinges"] .visual-main-figure img{
 aspect-ratio:4/3;object-fit:contain;background:#faf9f6}
@media(max-width:640px){.visual-quicklinks{padding:12px;gap:7px}
 .visual-quicklinks strong{width:100%}.visual-quicklinks a{font-size:13px;padding:7px 9px}}
"""
tests='tests/visual-explorer.test.mjs'
change(tests,"has 30 unique image variants","has 66 unique image variants")
change(tests,"assert.equal(all.length,30);","assert.equal(all.length,66);")
change(tests,"assert.equal(visualGroups().length,5);","assert.equal(visualGroups().length,7);")
change(tests,"assert.equal(new Set(all.map(v=>v.file)).size,30);",
 "assert.equal(new Set(all.map(v=>v.file)).size,66);")
change(tests,"assert.ok((await stat(file)).size>5000,p);",
 "assert.ok((await stat(file)).size>(p.includes('/cabinet-hardware/')?250:5000),p);")
change(tests,
 "const cases=[['/custom-cabinetry',2,12],['/deck-building-outdoor-carpentry',1,6],['/kitchen-remodeling',2,12]];",
 "const cases=[['/custom-cabinetry',4,48],['/deck-building-outdoor-carpentry',1,6],['/kitchen-remodeling',4,48]];")
change(tests,
 "assert.equal(visualExplorersForService('/kitchen-remodeling').length,2);",
 "assert.equal(visualExplorersForService('/kitchen-remodeling').length,4);")
change(tests,
 "assert.equal(parsed.image.length,12);",
 "assert.equal(parsed.image.length,48);")
parts[tests]=read(tests)+"""
test('hardware exterior and hinge selectors provide 6 finishes by 3 styles on kitchen and cabinetry pages',async()=>{
 const exterior=visualExplorersForService('/kitchen-remodeling').find(c=>c.id==='hardware-exterior');
 const hinges=visualExplorersForService('/custom-cabinetry').find(c=>c.id==='hardware-hinges');
 assert.equal(exterior.variants.length,18);
 assert.equal(hinges.variants.length,18);
 assert.equal(new Set(exterior.variants.map(v=>v.file)).size,18);
 assert.equal(new Set(hinges.variants.map(v=>v.file)).size,18);
 assert.equal(exterior.axes[0].options.length,3);
 assert.equal(exterior.axes[1].options.length,6);
 assert.equal(hinges.axes[0].options.length,3);
 assert.equal(hinges.axes[1].options.length,6);
 assert.ok(hinges.note.includes('not interchangeable'));
 for(const path of ['/kitchen-remodeling','/custom-cabinetry']){
  const html=marketingPage('/remodeling-preview'+path,{indexable:true,origin:'https://prescottsbestremodeling.com',cleanPaths:true});
  assert.match(html,/id="hardware-exterior"/);
  assert.match(html,/id="hardware-hinges"/);
  assert.match(html,/href="#hardware-exterior"/);
  assert.match(html,/href="#hardware-hinges"/);
  assert.match(html,/hinge.*construction/);
  const imageGallery=[...html.matchAll(/<script type="application\\/ld\\+json">([\\s\\S]*?)<\\/script>/g)]
   .map(m=>JSON.parse(m[1])).find(x=>x['@type']==='ImageGallery');
  assert.equal(imageGallery.image.length,48,path);
  assert.equal(imageGallery.image.filter(x=>x.width===640&&x.height===480).length,36,path);
 }
});
"""
for file,body in parts.items():
 if not body.strip():raise ValueError('Empty target: '+file)
for file,body in parts.items():(repo/file).write_text(body,'utf8')
print('PATCHED',len(parts),sorted(parts))
