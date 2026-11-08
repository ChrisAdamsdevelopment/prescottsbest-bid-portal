from pathlib import Path
repo=Path(r'D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\PBC_BID_PORTAL')
edits={}
def get(file):
 if file not in edits:edits[file]=(repo/file).read_text('utf8')
 return edits[file]
def change(file,old,new,n=1):
 s=get(file);actual=s.count(old)
 if actual!=n:raise RuntimeError(f'{file}: expected {n}, found {actual} for {old[:105]!r}')
 edits[file]=s.replace(old,new)
site='marketing/site.mjs'
change(site,"import {inspirationPanel,inspirationSummary} from './inspiration-view.mjs';",
 "import {inspirationPanel,inspirationSummary} from './inspiration-view.mjs';\nimport {designCenterNav} from './design-center-nav.mjs';")
change(site,"['/visual-design-preview','Design previews']", "['/visual-design-preview','Design Center']")
change(site,"['/visual-design-preview#my-inspiration-list','My ideas']", "['/holiday-lighting','Holiday Lights'],['/visual-design-preview#my-inspiration-list','My Ideas']")
change(site,
 " trust+\n '<section class=\"storm-home-banner\"",
 """ trust+
 '<section class="holiday-home-feature" aria-label="Holiday lighting installation and house photo previews">'+
 '<div class="holiday-home-feature-copy"><span class="kicker">HOLIDAY LIGHTING · PRESCOTT AREA</span>'+
 '<h2>Bring your house to life for the holidays.</h2>'+
 '<p>Rooflines, entryways and backyard patios. Explore real-looking design inspiration and test colors on a photo of your own home before asking our team for an installation quote.</p>'+
 '<p class="holiday-home-feature-price">Roofline lighting packages start at $599 for qualifying single-story installations.</p>'+
 '<div class="site-actions"><a class="site-button primary" href="'+link('/holiday-lighting/design')+'">Design lights on my home</a>'+
 '<a class="site-button outline" href="'+link('/holiday-lighting')+'">View lighting packages & gallery</a></div></div>'+
 '<a class="holiday-home-feature-photo" href="'+link('/holiday-lighting')+'" aria-label="See holiday lighting designs">'+
 '<img src="/site-assets/holiday-concepts/22-backyard-warm-roofline-long-view.webp" width="1200" height="900" loading="lazy" decoding="async" alt="Wide backyard view of a warmly lit Arizona home with holiday roofline and patio lighting"></a></section>'+
 '<section class="storm-home-banner" """)
change(site,"'<main id=\"site-main\">'+body+'</main>'+scottyWidget+",
 "'<main id=\"site-main\">'+designCenterNav(link,suffix)+body+'</main>'+scottyWidget+")
pkg='package.json'
change(pkg,"node --check marketing/inspiration-view.mjs && node --check public/inspiration-list.js\"",
 "node --check marketing/inspiration-view.mjs && node --check public/inspiration-list.js && node --check marketing/design-center-nav.mjs\"")
preview='marketing/visual-preview-copy.mjs'
begin=get(preview).index('const sampleScenes=[')
end=get(preview).index('];',begin)+2
cards="""const sampleScenes=[
 {title:'Kitchen cabinets & countertops',url:'/kitchen-remodeling#kitchen-finish-comparison',
  src:'/site-assets/visual-explorer/B03-matched-kitchen/matched-kitchen-medium-pale.webp',
  alt:'Full room kitchen inspiration with warm medium wood cabinets, pale stone-look island and pendant lights.',
  copy:'Compare six full-room finish combinations in the same general kitchen layout.'},
 {title:'Built-ins & custom cabinetry',url:'/custom-cabinetry#cabinet-finishes',
  src:'/site-assets/visual-explorer/B01-cabinet-finish/cabinet-medium-brass.webp',
  alt:'Medium-tone built-in cabinetry with brass hardware, shelving and a central workspace.',
  copy:'Try practical storage and custom office cabinetry options.'},
 {title:'Wood species & stain looks',url:'/kitchen-remodeling#wood-stain-boards',
  src:'/site-assets/visual-explorer/wood-stain-boards/white-oak-stain-reference.webp',
  alt:'White oak cabinet door reference board displaying six stain color families.',
  copy:'Browse oak, alder, maple, hickory and walnut-style stain references.'},
 {title:'Knobs, handles & hinges',url:'/custom-cabinetry#hardware-exterior',
  src:'/site-assets/visual-explorer/cabinet-hardware/exterior-satin-brass-bar.webp',
  alt:'Satin brass-color straight cabinet pull example for kitchen hardware ideas.',
  copy:'Compare handle types and concealed or decorative hinges.'},
 {title:'Decks & outdoor living',url:'/deck-building-outdoor-carpentry#deck-inspiration',
  src:'/site-assets/visual-explorer/B06-deck-inspiration/deck-pine-home-wood-stairs.webp',
  alt:'Wood deck with steps and railing beside a pine-country home.',
  copy:'Browse six outdoor settings, then explore matching wood references.'},
 {title:'Holiday lighting — front & backyard',url:'/holiday-lighting/design',
  src:'/site-assets/holiday-concepts/22-backyard-warm-roofline-long-view.webp',
  alt:'Distant Arizona backyard with warm white holiday roofline lights and soft landscape lighting.',
  copy:'Try our lighting editor on a home photo, or browse seasonal packages.'}
];"""
s=get(preview);edits[preview]=s[:begin]+cards+s[end:]
change(preview,"<h1>Picture your project before construction begins.</h1>",
 "<h1>Explore your home ideas in one Design Center.</h1>")
change(preview,"<h2>Explore the looks, then imagine them in your home.</h2>",
 "<h2>Choose a category, compare options, and collect your favorite ideas.</h2>")
# replace holiday editor controls
holiday='marketing/holiday-pages.mjs'
old="""'<h2>Try your own roofline or patio edge (optional)</h2><p>Tap two or more points on the preview to customize the lights. You can skip drawing and still request a quote for your chosen style.</p>'+
   '<div class="holiday-actions"><button type="button" class="site-button outline" id="holiday-undo">Undo point</button>'+
   '<button type="button" class="site-button outline" id="holiday-reset">Clear lights</button></div>'+"""
new="""'<div class="holiday-edit-intro" id="holiday-editor-tools"><h2>Step 3 · Draw and adjust your lights</h2>'+
   '<p>Start with a clean house photo. Choose <strong>Draw lights</strong>, then tap along one roofline or patio edge. Finish that run before drawing another. Select any run later to move, recolor or remove it.</p></div>'+
   '<div class="holiday-editor-toolbar" role="toolbar" aria-label="Lighting editing tools">'+
   '<button type="button" id="holiday-tool-draw" data-holiday-tool="draw" aria-pressed="false">✎ Draw lights</button>'+
   '<button type="button" id="holiday-tool-select" data-holiday-tool="select" aria-pressed="true">↔ Select / move</button>'+
   '<button type="button" id="holiday-tool-erase" data-holiday-tool="erase" aria-pressed="false">⌫ Erase run</button></div>'+
   '<div class="holiday-editor-buttons">'+
   '<button type="button" id="holiday-finish" class="site-button primary" disabled>Finish this run</button>'+
   '<button type="button" id="holiday-undo" class="site-button outline" disabled>Undo</button>'+
   '<button type="button" id="holiday-redo" class="site-button outline" disabled>Redo</button>'+
   '<button type="button" id="holiday-delete" class="site-button outline" disabled>Delete selected</button>'+
   '<button type="button" id="holiday-reset" class="site-button outline" disabled>Clear all</button></div>'+
   '<div class="holiday-run-panel"><h3>Your light runs</h3><p class="micro">Each run can have its own colors. Select a run and change the color above.</p>'+
   '<ul id="holiday-strand-list" class="holiday-strand-list"><li>No light runs added yet.</li></ul></div>'+
   '<a class="site-button outline" href="#holiday-preview">View my house preview</a>'+"""
change(holiday,old,new)
change(holiday,
 "'<div class=\"holiday-preview\" id=\"holiday-preview\"><h2>Your lighting preview</h2><div class=\"holiday-canvas-wrap\"><canvas id=\"holiday-canvas\" width=\"1152\" height=\"720\" tabindex=\"0\" aria-label=\"Holiday light preview; tap or click along the roofline to place path points\"></canvas></div>'+",
 """'<div class="holiday-preview" id="holiday-preview"><div class="holiday-preview-heading"><h2>My house lighting preview</h2><button type="button" id="holiday-before" class="site-button outline" aria-pressed="false">View original photo</button></div>'+
   '<p class="micro">The sample starts without lights. Pick a tool to draw or adjust individual runs; toggle the original photo whenever you like.</p>'+
   '<div class="holiday-canvas-wrap"><canvas id="holiday-canvas" width="1152" height="720" tabindex="0" aria-label="Lighting design canvas; use Draw lights to add points, Select / move to adjust a run, or Erase run to remove it"></canvas></div>'+""")
change(holiday,
 "'<p id=\"holiday-preview-status\" class=\"micro\" role=\"status\">Select a home photo or sample house, then tap the roofline.</p>'+",
 """'<p id="holiday-preview-status" class="micro" role="status">Sample home ready without lights. Choose Draw lights to start a run.</p>'+
   '<a class="holiday-edit-return" href="#holiday-editor-tools">Back to light editing tools</a>'+""")
change(holiday,"<button type=\"button\" id=\"holiday-build\" class=\"site-button primary\">Step 3 · Review my design</button>",
 "<button type=\"button\" id=\"holiday-build\" class=\"site-button primary\">Review my lighting design</button>")
for file,val in edits.items():
 if not val.strip():raise ValueError('empty '+file)
for file,val in edits.items():(repo/file).write_text(val,'utf8')
print('PATCHED',len(edits),sorted(edits))
