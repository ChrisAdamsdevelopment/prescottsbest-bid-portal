// Holiday Lighting Concierge — concept experience, not approved seasonal pricebook.
import {holidayImage} from './holiday-assets.mjs';
// Photo preview is local Canvas only. Never send homeowner photos to the server automatically.
const escapeHtml=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function conceptPicture(id, extraClass=''){
 const item=holidayImage(id);
 if(!item)return '';
 const src='/site-assets/holiday-concepts/'+item.file;
 return '<figure class="holiday-concept-figure '+escapeHtml(extraClass)+'">'+
  '<img src="'+src+'" alt="'+escapeHtml(item.alt)+'" width="'+item.width+'" height="'+item.height+'" loading="lazy" decoding="async">'+
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
   '<div class="holiday-why-grid">'+sections.map(([h,t])=>'<article><h3>'+escapeHtml(h)+'</h3><p>'+escapeHtml(t)+'</p></article>').join('')+'</div></section>'+gallery+
   '<section class="site-section"><h2>Questions people ask</h2><div class="faqs">'+[
    ['Do I need to buy lights first?','No need to shop for lights first. Tell us the look you want and we’ll help select outdoor-rated products. Your written quote will specify the materials, ownership and any seasonal service options.'],
    ['Can I see my actual home decorated?','Absolutely. Upload a photo, outline the areas you’d like decorated and explore colors in our interactive Design Studio. We then confirm the actual layout and measurements for your installation.'],
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
  description:'Free in-browser holiday lighting preview: choose your photo, trace a roofline, explore packages and export a concept and material worksheet. Photos stay on your device.',
  body:'<div class="site-pagehead holiday-design-heading"><span class="kicker">PRIVATE DESIGN STUDIO · NO ACCOUNT NEEDED</span><h1>See the holiday lights on your own home.</h1>'+
   '<p class="lede">Choose a photo, trace where lights could go, and compare styles. Your photo stays on your device. You choose whether to share the finished concept with us.</p>'+
   '<p class="micro">Explore the look you love, then send us your ideas. We’ll confirm measurements, outdoor-rated products and installation requirements before preparing your quote.</p></div>'+
   '<section class="site-section holiday-workspace"><div class="holiday-controls">'+
   '<h2>1. Choose your starting package</h2><label for="holiday-package">Lighting package</label><select id="holiday-package">'+
   packages.map(p=>'<option value="'+p.id+'">'+escapeHtml(p.name)+'</option>').join('')+'</select>'+
   '<label for="holiday-tone">Lighting colors</label><select id="holiday-tone"><option value="warm">Warm white</option><option value="cool">Bright white</option><option value="candy">Red & white</option><option value="festive">Multicolor</option><option value="smart">Color-changing smart style</option></select>'+
   '<label for="holiday-product">Preferred light product</label><select id="holiday-product"><option value="c9">C9-style outdoor LED roofline lights</option><option value="rope">Outdoor-rated LED rope lighting</option><option value="icicle">Outdoor-rated icicle strands</option><option value="rgbic">Smart RGBIC / neon-flex (compatible controller required)</option><option value="permanent">Permanent track / puck lighting</option></select><p class="micro">Light type is a design preference; exact outdoor product, connection lengths and electrical requirements must be reviewed.</p>'+
   '<h2>2. Add a photo</h2><label for="holiday-photo">Photo of the front of your home (JPG, PNG, or WebP; 10 MB max)</label>'+
   '<input id="holiday-photo" type="file" accept="image/jpeg,image/png,image/webp"/>'+
   '<p class="micro">For privacy, choose a photo without visible house numbers, license plates or people. Your original image stays in your browser.</p>'+
   '<button type="button" id="holiday-demo" class="site-button outline">Use a sample home instead</button>'+
   '<h2>3. Mark the lighting area</h2><p>Tap points along the roofline in the image. Two or more points make a connected light path. Use Undo to fix a point.</p>'+
   '<div class="holiday-actions"><button type="button" class="site-button outline" id="holiday-undo">Undo point</button>'+
   '<button type="button" class="site-button outline" id="holiday-reset">Clear lights</button></div>'+
   '<h2>4. Plan the installation</h2><label for="holiday-feet">Your approximate light-run length, in feet (optional)</label>'+
   '<input id="holiday-feet" type="number" min="10" max="1200" step="1" placeholder="Example: 120"/>'+
   '<label for="holiday-access">Access to mounting area</label><select id="holiday-access"><option value="unknown">Not sure</option><option value="single">Single-story accessible areas</option><option value="complex">Two-story or complex access</option></select>'+
   '<fieldset class="holiday-addons"><legend>Optional design accents</legend><label><input type="checkbox" value="entry"/> Doorway or porch accent</label>'+
   '<label><input type="checkbox" value="garage"/> Garage outline</label><label><input type="checkbox" value="bush"/> Shrub or small tree lights</label>'+
   '<label><input type="checkbox" value="path"/> Walkway lights</label><label><input type="checkbox" value="smart"/> App scene / timer setup</label></fieldset>'+
   '<button type="button" id="holiday-build" class="site-button primary">Build my project worksheet</button></div>'+
   '<div class="holiday-preview"><h2>Your home, illuminated</h2><div class="holiday-canvas-wrap"><canvas id="holiday-canvas" width="1152" height="720" tabindex="0" aria-label="Holiday light preview; tap or click along the roofline to place path points"></canvas></div>'+
   '<p id="holiday-preview-status" class="micro" role="status">Select a home photo or sample house, then tap the roofline.</p>'+
   '<div class="holiday-actions"><button type="button" id="holiday-download" class="site-button outline" disabled>Save preview image</button>'+
   '<button type="button" id="holiday-print" class="site-button outline" disabled>Print crew concept</button>'+
   '<button type="button" id="holiday-json" class="site-button outline" disabled>Save material worksheet</button><button type="button" id="holiday-email" class="site-button outline" disabled>Email my plan summary</button></div>'+
   '<div class="holiday-worksheet" id="holiday-worksheet" aria-live="polite"><h3>Your design summary</h3><p>Choose a package and add points to begin. Exact materials, power and ladder access require an on-site check.</p></div>'+
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
