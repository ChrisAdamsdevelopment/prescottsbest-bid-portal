// Holiday Lighting Concierge — concept experience, not approved seasonal pricebook.
import {holidayImage,holidayCloseups,holidayBackyards} from './holiday-assets.mjs';
import {previewCopy} from './visual-preview-copy.mjs';
// Photo preview is local Canvas only. Never send homeowner photos to the server automatically.
const escapeHtml=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function conceptPicture(id, extraClass=''){
 const item=holidayImage(id);
 if(!item)return '';
 const src='/site-assets/holiday-concepts/'+item.file;
 const responsive=item.thumbFile?' srcset="/site-assets/holiday-concepts/'+item.thumbFile+' 600w, '+src+' 1200w" sizes="(max-width: 760px) 100vw, 44vw"':'';
 return '<figure class="holiday-concept-figure '+escapeHtml(extraClass)+'">'+
  '<img src="'+src+'"'+responsive+' alt="'+escapeHtml(item.alt)+'" width="'+item.width+'" height="'+item.height+'" loading="lazy" decoding="async">'+
  '<figcaption>'+escapeHtml(item.caption)+'</figcaption></figure>';
}
const detailImageCards=[
 {id:'beforeafter',label:'Compare a concept before and after'},
 {id:'lighttypes',label:'Explore different lighting styles'},
 {id:'addons',label:'Add trees, pathways and landscape accents'},
 {id:'phone',label:'Imagine simple phone-based scenes'},
 {id:'scenes',label:'Choose a smart-lighting scene'},
 {id:'crew',label:'See how a design might become a crew plan'},
 {id:'process',label:'Understand the service journey'}
];
const gallery='<section class="site-section holiday-concept-gallery" aria-label="Holiday lighting inspiration references">'+
 '<div class="section-heading"><span class="kicker">DESIGN INSPIRATION</span><h2>See more ways to light up your home.</h2>'+
 '<p>Browse different lighting looks for your home. Gallery images are design concepts; we’ll tailor the layout, materials and installation plan to your property.</p></div>'+
 '<div class="holiday-reference-grid">'+detailImageCards.map(item=>
  '<article class="holiday-reference-card holiday-reference-'+escapeHtml(item.id)+'"><h3>'+escapeHtml(item.label)+'</h3>'+conceptPicture(item.id)+'</article>').join('')+
 '</div></section>';

const closeupGallery='<section class="site-section holiday-closeup-gallery" aria-labelledby="holiday-closeup-title">'+
 '<div class="section-heading"><span class="kicker">GET A CLOSER LOOK</span><h2 id="holiday-closeup-title">What different holiday lights look like on a house</h2>'+
 '<p>Compare six close-up lighting styles on sample homes: roofline bulbs, white icicles, entry garland, color accents and window outlines. These are design examples, not photographs of completed Prescott’s Best installations. Actual products, spacing, colors and mounting details are confirmed for your home.</p></div>'+
 '<div class="holiday-closeup-grid">'+holidayCloseups.map(item=>
  '<article class="holiday-closeup-card"><h3>'+escapeHtml(item.title)+'</h3>'+conceptPicture(item.id,'holiday-closeup-picture')+'</article>').join('')+
 '</div><p class="micro">Lighting style inspiration only. Outdoor-rated products, access and installation details are determined after a site review.</p></section>';


const backyardGallery=(link)=>'<section class="site-section holiday-backyard-gallery" id="backyard-holiday-lighting" aria-labelledby="backyard-holiday-heading">'+
 '<div class="section-heading"><span class="kicker">THE WHOLE HOME, FRONT AND BACK</span><h2 id="backyard-holiday-heading">Backyard holiday lighting, up close and from a distance</h2>'+
 '<p>Don’t stop at the front entrance. Picture warm patio lighting while you entertain, garland on covered outdoor spaces, and roofline lights you can enjoy from across the yard. Explore six Arizona-style backyard concepts at three different viewing distances.</p></div>'+
 '<div class="holiday-backyard-grid">'+holidayBackyards.map((item)=>
  '<article class="holiday-backyard-card" data-backyard-view="'+escapeHtml(item.view)+'">'+
  '<div class="holiday-backyard-card-head"><span class="holiday-backyard-view">'+(item.view==='close'?'PATIO VIEW':item.view==='medium'?'WHOLE-YARD VIEW':'DISTANCE VIEW')+'</span><h3>'+escapeHtml(item.title)+'</h3></div>'+
  '<a href="/site-assets/holiday-concepts/'+item.file+'" class="holiday-backyard-enlarge" aria-label="View full-size design example: '+escapeHtml(item.title)+'">'+
  conceptPicture(item.id,'holiday-backyard-picture')+'</a></article>').join('')+
 '</div><p class="micro">Examples show different sample homes, not a before-and-after sequence or completed Prescott’s Best installations. Lighting equipment, mounting locations and power requirements are confirmed for the actual property.</p>'+
 '<div class="site-actions"><a class="site-button primary" href="'+link('/holiday-lighting/design')+'">Try a preview on my own backyard</a>'+
 '<a class="site-button outline" href="'+link('/schedule')+'">Discuss a backyard lighting design</a></div></section>';

const packages=[
 {id:'classic',name:'Classic Roofline',style:'Warm white',copy:'A welcoming single-color roofline with a clean finish.',features:['C9-style outdoor LED lighting','Front-facing roofline','Simple timer setup'],range:'From $599',tone:'warm'},
 {id:'welcome',name:'Warm Welcome',style:'Red & warm white',copy:'Roofline plus a welcoming porch, garage, or entry accent.',features:['Roofline and one entry accent','Two-color style','Options for garland or doorway trim'],range:'From $899',tone:'candy'},
 {id:'showcase',name:'Neighborhood Showcase',style:'Classic multicolor',copy:'A richer design with roofline, landscape accents and more zones.',features:['Roofline plus two accents','Tree or shrub lighting options','Custom color choice'],range:'From $1,399',tone:'festive'},
 {id:'permanent',name:'Year-Round Smart Lights',style:'Color-changing',copy:'Permanent outdoor-rated lighting with app scenes for more than just Christmas.',features:['Product-specific app setup','Schedule and scene presets','Smart-home compatibility review'],range:'Custom quote',tone:'smart'}
];
const sections=[
 ['A design that starts with your home','Use a photo of your home in our Design Studio. Trace the roofline, compare warm white or multicolor options and save your favorite look to share with us when you’re ready.'],
 ['Practical installation and service','We help select lighting, review installation access and tailor seasonal services to your project. Your written quote details exactly what is included.'],
 ['Smart technology without the complexity','For compatible products, we can discuss schedules, phone-app setup, scene presets and certain Alexa, Google Home or Apple Home options. Not every system supports every feature or music mode.'],
 ['Plans a crew can understand','Your preview helps us prepare an installation plan. We confirm dimensions, outdoor power, mounting locations and materials at your property.']
];
const safeContact='<a href="tel:+19283500940">(928) 350-0940</a>';
export function holidayPages(link){
 const card=(p)=>'<article class="site-card holiday-package">'+conceptPicture(p.id,'holiday-package-photo')+'<span class="holiday-package-tag">'+escapeHtml(p.style)+'</span>'+
  '<h3>'+escapeHtml(p.name)+'</h3><p>'+escapeHtml(p.copy)+'</p><ul>'+p.features.map(f=>'<li>'+escapeHtml(f)+'</li>').join('')+'</ul>'+
  '<strong class="holiday-starting">'+escapeHtml(p.range)+'</strong><a class="site-button outline" href="'+link('/holiday-lighting/design')+'?package='+p.id+'">Preview this look</a></article>';
 const page={
  title:'Holiday Lighting Concierge | Prescott & Prescott Valley | Prescott’s Best Construction',
  description:'Explore holiday lighting designs and outdoor light installation options in Prescott and Prescott Valley. Try a private photo-based preview and request a contractor review.',
  body:'<section class="site-pagehead holiday-head"><div class="holiday-head-copy"><span class="kicker">SEASONAL CONCIERGE · PRESCOTT AREA</span>'+
   '<h1>Holiday lights, thoughtfully designed. We handle the hard part.</h1>'+
   '<p class="lede">Explore your Christmas lighting style from the comfort of home. Start with a package or create your own design, then speak directly with Prescott’s Best about materials, installation and service.</p>'+
   '<p class="micro">Classic Roofline starts at $599 for up to 60 feet of accessible front roofline on a one-story home. Your written quote will confirm the lighting selection, installation details and any optional takedown or storage services.</p>'+
   '<div class="site-actions"><a class="site-button primary" href="'+link('/holiday-lighting/design')+'">Try the home lighting preview</a>'+
   '<a class="site-button outline" href="'+link('/schedule')+'">Discuss your holiday project</a></div></div>'+conceptPicture('classic','holiday-head-media')+'</section>'+
   '<section class="site-section"><div class="section-heading"><span class="kicker">START WITH A LOOK</span><h2>Choose a style, then make it yours.</h2><p>Four starting points. Everything is adjustable after a site review.</p></div>'+
   '<div class="holiday-packages">'+packages.map(card).join('')+'</div></section>'+
   '<section class="site-section holiday-tree-price"><div><span class="kicker">TREE & LANDSCAPE LIGHTING</span><h2>Light up a small tree, shrub or pathway.</h2><p><strong>Small ornamental tree lighting starts at $149.</strong> Larger trees, specialty lighting and additional access or equipment are quoted according to your property and the design.</p><p>'+safeContact+' · <a href="'+link('/holiday-lighting/design')+'">Customize a home lighting concept</a></p></div>'+conceptPicture('addons','holiday-tree-image')+'</section>'+
   '<section class="site-section holiday-why"><h2>A simpler way to plan seasonal decorating</h2>'+
   '<div class="holiday-why-grid">'+sections.map(([h,t])=>'<article><h3>'+escapeHtml(h)+'</h3><p>'+escapeHtml(t)+'</p></article>').join('')+ '</div></section>'+gallery+closeupGallery+backyardGallery(link)+
 '<section class="site-section visual-preview-promo"><div><span class="kicker">SEE THE LIGHTS ON YOUR HOME</span><h2>'+previewCopy.holidayHeading+'</h2><p>'+previewCopy.holidayBody+'</p><div class="site-actions"><a class="site-button primary" href="'+link('/holiday-lighting/design')+'">Preview lighting on a house photo</a><a class="site-button outline" href="'+link('/visual-design-preview')+'">Our visual planning approach</a></div><p class="micro">'+previewCopy.disclaimer+'</p></div></section>'+
   '<section class="site-section"><h2>Questions people ask</h2><div class="faqs">'+[
    ['Do I need to buy lights first?','No need to shop for lights first. Tell us the look you want and we’ll help select outdoor-rated products. Your written quote will specify the materials, ownership and any seasonal service options.'],
    ['Can I see my actual home decorated?','Yes. You can upload a front, backyard or patio photo, outline the areas you’d like decorated and explore colors in our interactive Design Studio. We then confirm the actual layout and measurements for your installation.'],
    ['Do you design lighting for the backyard too?','Yes. The examples on this page include covered patios, rear rooflines and the whole backyard as seen from a distance. Share a photo of the area you want to light, and we can discuss suitable outdoor products, power and installation access for that space.'],
    ['Can the lights work with Alexa, Google or Apple Home?','Some lights and controllers work with compatible assistants and Matter hubs. This depends on the exact manufacturer and model. Product setup, permissions and networking are verified before quoting.'],
    ['What about takedown after Christmas?','We can discuss takedown, maintenance and storage when planning your display. Your quote will clearly list which seasonal services are included.'],
    ['Can you provide a firm price on the website?','Our Classic Roofline package starts at $599 for up to 60 feet of accessible, single-story front roofline. We confirm final pricing after reviewing the length, lighting selection, mounting access and any optional services.']
   ].map(([q,a])=>'<details><summary>'+escapeHtml(q)+'</summary><p>'+escapeHtml(a)+'</p></details>').join('')+'</div></section>'+
   '<section class="site-cta"><h2>Want a holiday display that fits your home?</h2><p>See a concept first, then discuss what is feasible. Call '+safeContact+'.</p>'+
   '<div class="site-actions"><a class="site-button primary" href="'+link('/holiday-lighting/design')+'">Create my preview</a>'+
   '<a class="site-button outline" href="'+link('/schedule')+'">Contact us</a></div></section>'
 };
 const studio={
  title:'Holiday Lighting Design Studio | Preview Lights on Your House | Prescott’s Best',
  description:'Preview holiday lighting on your home with private on-device drawing or optional consent-based photorealistic AI editing, then request a contractor-reviewed quote.',
  body:'<div class="site-pagehead holiday-design-heading"><span class="kicker">PRIVATE DESIGN STUDIO · NO ACCOUNT NEEDED</span><h1>See the holiday lights on your own home.</h1>'+
   '<p class="lede">Choose a lighting style, use our sample home or add a photo of your own, and draw lights exactly where you want them. Adjust each run, compare the look, and save your idea.</p>'+
   '<div class="site-actions"><a class="site-button primary" href="#holiday-editor-tools">Start designing lights</a><a class="site-button outline" href="'+link('/holiday-lighting')+'">View lighting packages</a></div>'+
   '<p class="micro">Your original photo stays on your device unless you separately agree to AI editing or attach it to your quote request. We’ll confirm measurements, outdoor-rated products and installation requirements before preparing your quote.</p><p class="micro">'+previewCopy.disclaimer+'</p><p class="micro">Planning the back of your house? Use a photo of your rear elevation or covered patio, and <a href="'+link('/holiday-lighting')+'#backyard-holiday-lighting">explore backyard lighting examples</a>.</p></div>'+
   '<section class="site-section holiday-workspace"><div class="holiday-controls">'+
   '<div class="holiday-simple-steps" aria-label="Three simple steps"><span><b>1</b> Pick your lights</span><span><b>2</b> Preview your home</span><span><b>3</b> Request a quote</span></div>'+
   '<h2>Step 1 · Pick the look you like</h2><p class="micro">You can change colors anytime. Start with one of our popular styles—there is no commitment.</p>'+
   '<div class="holiday-style-picks" role="group" aria-label="Popular light looks"><button type="button" class="holiday-style-pick" data-package="classic">Warm & classic <small>From $599</small></button><button type="button" class="holiday-style-pick" data-package="welcome">Red & white <small>From $899</small></button><button type="button" class="holiday-style-pick" data-package="showcase">Multicolor <small>From $1,399</small></button><button type="button" class="holiday-style-pick" data-package="permanent">Year-round smart <small>Custom quote</small></button></div>'+
   '<label for="holiday-package">Lighting package</label><select id="holiday-package">'+
   packages.map(p=>'<option value="'+p.id+'">'+escapeHtml(p.name)+'</option>').join('')+'</select>'+
   '<label for="holiday-tone">Lighting colors</label><select id="holiday-tone"><option value="warm">Warm white</option><option value="cool">Bright white</option><option value="candy">Red & white</option><option value="festive">Multicolor</option><option value="smart">Color-changing smart style</option></select>'+
   '<details class="holiday-advanced"><summary>Optional · Choose a different light type</summary><div class="holiday-advanced-fields"><label for="holiday-product">Preferred light product</label><select id="holiday-product"><option value="c9">C9-style outdoor LED roofline lights</option><option value="rope">Outdoor-rated LED rope lighting</option><option value="icicle">Outdoor-rated icicle strands</option><option value="rgbic">Smart RGBIC / neon-flex (compatible controller required)</option><option value="permanent">Permanent track / puck lighting</option></select><p class="micro">Light type is a design preference; exact outdoor product, connection lengths and electrical requirements must be reviewed.</p></div></details>'+
   '<h2>Step 2 · Preview on a home</h2><p class="micro">The sample home is ready below. Or choose your own front-of-house, backyard or patio photo for a personal preview.</p>'+
   '<label for="holiday-photo">Optional: front, backyard or patio photo of your home (JPG, PNG, or WebP; 10 MB max)</label>'+
   '<input id="holiday-photo" type="file" accept="image/jpeg,image/png,image/webp"/>'+
   '<p class="micro">For privacy, choose a photo without visible house numbers, license plates or people. Your original image stays in your browser.</p>'+
   '<button type="button" id="holiday-demo" class="site-button outline">Use a sample home instead</button>'+
   '<div class="holiday-edit-intro" id="holiday-editor-tools"><h2>Step 3 · Draw and adjust your lights</h2>'+
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
   '<a class="site-button outline" href="#holiday-preview">View my house preview</a>'+
   '<details class="holiday-advanced" id="holiday-options"><summary>Optional · Add length, access and accents</summary><div class="holiday-advanced-fields"><label for="holiday-feet">Approximate light-run length, in feet (optional)</label>'+
   '<input id="holiday-feet" type="number" min="10" max="1200" step="1" placeholder="Example: 120"/>'+
   '<label for="holiday-access">Access to mounting area</label><select id="holiday-access"><option value="unknown">Not sure</option><option value="single">Single-story accessible areas</option><option value="complex">Two-story or complex access</option></select>'+
   '<fieldset class="holiday-addons"><legend>Optional design accents</legend><label><input type="checkbox" value="entry"/> Doorway or porch accent</label>'+
   '<label><input type="checkbox" value="garage"/> Garage outline</label><label><input type="checkbox" value="bush"/> Shrub or small tree lights</label>'+
   '<label><input type="checkbox" value="path"/> Walkway lights</label><label><input type="checkbox" value="smart"/> App scene / timer setup</label></fieldset></div></details>'+
   '<button type="button" id="holiday-build" class="site-button primary">Review my lighting design</button></div>'+
   '<div class="holiday-preview" id="holiday-preview"><div class="holiday-preview-heading"><h2>My house lighting preview</h2><button type="button" id="holiday-before" class="site-button outline" aria-pressed="false">View original photo</button></div>'+
   '<p class="micro">The sample starts without lights. Pick a tool to draw or adjust individual runs; toggle the original photo whenever you like.</p>'+
   '<div class="holiday-canvas-wrap"><canvas id="holiday-canvas" width="1152" height="720" tabindex="0" aria-label="Lighting design canvas; use Draw lights to add points, Select / move to adjust a run, or Erase run to remove it"></canvas></div>'+
   '<p id="holiday-preview-status" class="micro" role="status">Sample home ready without lights. Choose Draw lights to start a run.</p>'+
   '<a class="holiday-edit-return" href="#holiday-editor-tools">Back to light editing tools</a>'+
   '<div class="holiday-actions"><button type="button" id="holiday-download" class="site-button outline" disabled>Save preview image</button>'+
   '<button type="button" id="holiday-print" class="site-button outline" disabled>Print crew concept</button>'+
   '<button type="button" id="holiday-json" class="site-button outline" disabled>Save material worksheet</button><button type="button" id="holiday-email" class="site-button outline" disabled>Email my plan summary</button></div>'+
   '<div class="holiday-idea-actions"><button type="button" id="holiday-add-idea" class="site-button primary">Add this lighting idea to My List</button>'+'<a class="site-button outline" href="'+link('/visual-design-preview')+'#my-inspiration-list">View saved ideas</a></div>'+
   '<button type="button" id="holiday-contact" class="site-button primary holiday-request-quote">Request a quote with this design</button>'+
   '<p class="micro">Review your choices and enter contact details before sending anything. You can save the lighting package as an idea; your house photo itself stays on your device unless you explicitly share it.</p>'+
   '<div class="holiday-worksheet" id="holiday-worksheet" aria-live="polite"><h3>Your design summary</h3><p>Choose a package and add points to begin. Exact materials, power and ladder access require an on-site check.</p></div>'+
   '<section class="holiday-photoreal" aria-labelledby="holiday-real-heading"><div class="holiday-feature-head"><span class="kicker">OPTIONAL · REAL PHOTO EDITING</span><h3 id="holiday-real-heading">See a realistic evening lighting design</h3></div>'+
   '<p>Our instant tool above draws lights over a photo. This optional AI feature uses your house photo to generate a more photorealistic concept with the chosen roofline, colors and accents. It may change small visual details and does not precisely follow manual light-run tracing; it is not an exact installation drawing.</p>'+
   '<label class="holiday-image-consent"><input type="checkbox" id="holiday-image-consent"/><span>I agree to send one resized image of my house and selected lighting options to Google Gemini to create this optional AI concept. The website does not save the photo. <a href="'+link('/privacy')+'">Privacy details</a>.</span></label>'+
   '<button type="button" id="holiday-realistic" class="site-button primary" disabled>Generate realistic lighting design</button>'+
   '<p class="micro" id="holiday-image-status" role="status">Checking image editing availability. Your instant preview and quote form work without this feature.</p>'+
   '<div class="holiday-real-result" id="holiday-real-result" hidden><figure><img id="holiday-real-before" alt="Original home photo selected for the lighting design"/><figcaption>Original house</figcaption></figure>'+
   '<figure><img id="holiday-real-after" alt="Illustrative holiday lighting concept on the uploaded house photo"/><figcaption>Lighting design preview — not a quoted installation</figcaption></figure></div>'+
   '<button type="button" id="holiday-real-save" class="site-button outline" disabled>Save realistic concept image</button></section>'+
   '<div class="holiday-ai-helper"><h3>Want help choosing a lighting style?</h3><p>Our optional design assistant can suggest colors, accent ideas and questions to discuss with our team. It uses your selected options and approximate length, <strong>not your house photo</strong>.</p>'+
   '<label class="holiday-ai-consent"><input type="checkbox" id="holiday-ai-consent"/> I agree to send these design choices (no image) to Google Gemini. <a href="'+link('/privacy')+'">Privacy details</a></label>'+
   '<button type="button" id="holiday-ai-ask" class="site-button outline" disabled>Suggest a lighting style</button>'+
   '<p id="holiday-ai-status" role="status" class="micro">Get personalized design ideas, or continue with the preview tools above.</p><div id="holiday-ai-answer" role="region" aria-label="AI design suggestions" aria-live="polite"></div></div></div></section>'+
   '<section class="site-cta"><h2>Ready to bring your lighting design to life?</h2><p>Save your favorite design and request a quote. We’ll help you choose materials and plan the installation around your home.</p>'+
   '<div class="site-actions"><a class="site-button primary" href="'+link('/schedule')+'">Contact Prescott’s Best</a>'+
   '<a class="site-button outline" href="'+link('/holiday-lighting')+'">See package descriptions</a></div></section>'
 };
 return {'/holiday-lighting':()=>page,'/holiday-lighting/design':()=>studio};
}
export const holidayPackages=packages;
