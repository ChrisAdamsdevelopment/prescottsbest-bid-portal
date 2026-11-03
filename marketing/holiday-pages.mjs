// Holiday Lighting Concierge — concept experience, not approved seasonal pricebook.
// Photo preview is local Canvas only. Never send homeowner photos to the server automatically.
const escapeHtml=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const packages=[
 {id:'classic',name:'Classic Roofline',style:'Warm white',copy:'A welcoming single-color roofline with a clean finish.',features:['Commercial-grade C9-style LED concept','Front-facing roofline','Simple timer setup'],range:'Planning example from $699',tone:'warm'},
 {id:'welcome',name:'Warm Welcome',style:'Red & warm white',copy:'Roofline plus a welcoming porch, garage, or entry accent.',features:['Roofline and one entry accent','Two-color style','Options for garland or doorway trim'],range:'Planning example from $999',tone:'candy'},
 {id:'showcase',name:'Neighborhood Showcase',style:'Classic multicolor',copy:'A richer design with roofline, landscape accents and more zones.',features:['Roofline plus two accents','Tree or shrub lighting concept','Custom color choice'],range:'Planning example from $1,499',tone:'festive'},
 {id:'permanent',name:'Year-Round Smart Lights',style:'Color-changing',copy:'Permanent outdoor-rated lighting with app scenes for more than just Christmas.',features:['Product-specific app setup','Schedule and scene presets','Smart-home compatibility review'],range:'Research scenario $22–$32 per foot',tone:'smart'}
];
const sections=[
 ['A design that starts with your home','Upload a photo in the private, local-only Design Studio. Trace the roofline and compare warm white, red-and-white, or multicolor lighting. Save an illustrative image without sharing the photo with the website.'],
 ['Practical installation and service','We can discuss installation, customer-owned light purchases, optional takedown, in-season support, and storage arrangements. These inclusions and pricing require Andrew’s review before booking.'],
 ['Smart technology without the complexity','For compatible products, we can discuss schedules, phone-app setup, scene presets and certain Alexa, Google Home or Apple Home options. Not every system supports every feature or music mode.'],
 ['Plans a crew can understand','Your preview becomes an annotated concept and material worksheet. Actual dimensions, circuits, mounting and access must be verified on site by a qualified lead before anyone installs lights.']
];
const safeContact='<a href="tel:+19283500940">(928) 350-0940</a>';
export function holidayPages(link){
 const card=(p)=>'<article class="site-card holiday-package"><span class="holiday-package-tag">'+escapeHtml(p.style)+'</span>'+
  '<h3>'+escapeHtml(p.name)+'</h3><p>'+escapeHtml(p.copy)+'</p><ul>'+p.features.map(f=>'<li>'+escapeHtml(f)+'</li>').join('')+'</ul>'+
  '<strong class="holiday-starting">'+escapeHtml(p.range)+'</strong><a class="site-button outline" href="'+link('/holiday-lighting/design')+'?package='+p.id+'">Preview this look</a></article>';
 const page={
  title:'Holiday Lighting Concierge | Prescott & Prescott Valley | Prescott’s Best Construction',
  description:'Explore holiday lighting designs and outdoor light installation options in Prescott and Prescott Valley. Try a private photo-based preview and request a contractor review.',
  body:'<section class="site-pagehead holiday-head"><span class="kicker">SEASONAL CONCIERGE · PRESCOTT AREA</span>'+
   '<h1>Holiday lights, thoughtfully designed. We handle the hard part.</h1>'+
   '<p class="lede">Explore your Christmas lighting style from the comfort of home. Start with a package or create your own design, then speak directly with Prescott’s Best about materials, installation and service.</p>'+
   '<p class="micro">Package descriptions and price examples are concepts being evaluated for launch, not current offers or contractor-approved bids. Availability is not yet confirmed.</p>'+
   '<div class="site-actions"><a class="site-button primary" href="'+link('/holiday-lighting/design')+'">Try the home lighting preview</a>'+
   '<a class="site-button outline" href="'+link('/schedule')+'">Discuss your holiday project</a></div></section>'+
   '<section class="site-section"><div class="section-heading"><span class="kicker">START WITH A LOOK</span><h2>Choose a style, then make it yours.</h2><p>Four starting points. Everything is adjustable after a site review.</p></div>'+
   '<div class="holiday-packages">'+packages.map(card).join('')+'</div></section>'+
   '<section class="site-section holiday-why"><h2>A simpler way to plan seasonal decorating</h2>'+
   '<div class="holiday-why-grid">'+sections.map(([h,t])=>'<article><h3>'+escapeHtml(h)+'</h3><p>'+escapeHtml(t)+'</p></article>').join('')+'</div></section>'+
   '<section class="site-section"><h2>Questions people ask</h2><div class="faqs">'+[
    ['Do I need to buy lights first?','No. Tell us which look you like. If this service launches, we can scope a package where you buy suitable outdoor-rated lights through us. Ownership, manufacturer warranties, storage and seasonal service terms must be agreed in writing.'],
    ['Can I see my actual home decorated?','Yes. The Design Studio lets you choose a house photo from your device, trace the roofline and preview light colors locally. It is an illustration, not a photorealistic AI promise or measured installation drawing.'],
    ['Can the lights work with Alexa, Google or Apple Home?','Some lights and controllers work with compatible assistants and Matter hubs. This depends on the exact manufacturer and model. Product setup, permissions and networking are verified before quoting.'],
    ['What about takedown after Christmas?','Optional takedown, maintenance and storage can be discussed during an estimate. The online examples do not guarantee these services are included.'],
    ['Can you provide a firm price on the website?','Not yet. Roofline length, access height, power availability, product selection and schedule must be checked. The online numbers are planning examples only, not offers to contract.']
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
   '<p class="micro">Preview only: not AI image generation, measured construction drawings, an electrical design, or a contractor-approved quote. Outdoor installation needs a qualified site assessment.</p></div>'+
   '<section class="site-section holiday-workspace"><div class="holiday-controls">'+
   '<h2>1. Choose your starting package</h2><label for="holiday-package">Lighting package</label><select id="holiday-package">'+
   packages.map(p=>'<option value="'+p.id+'">'+escapeHtml(p.name)+'</option>').join('')+'</select>'+
   '<label for="holiday-tone">Lighting colors</label><select id="holiday-tone"><option value="warm">Warm white</option><option value="cool">Bright white</option><option value="candy">Red & white</option><option value="festive">Multicolor</option><option value="smart">Color-changing smart style</option></select>'+
   '<h2>2. Add a photo</h2><label for="holiday-photo">Photo of the front of your home (JPG, PNG, or WebP; 10 MB max)</label>'+
   '<input id="holiday-photo" type="file" accept="image/jpeg,image/png,image/webp"/>'+
   '<p class="micro">Do not upload photos showing people, license plates, security codes or house-number details. Photos are handled only in this browser; no server upload takes place.</p>'+
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
   '<div class="holiday-worksheet" id="holiday-worksheet" aria-live="polite"><h3>Your design summary</h3><p>Choose a package and add points to begin. Exact materials, power and ladder access require an on-site check.</p></div></div></section>'+
   '<section class="site-cta"><h2>Like what you designed?</h2><p>Save your preview and bring it to a conversation with Andrew. The website does not send your house photo or automatically schedule a job.</p>'+
   '<div class="site-actions"><a class="site-button primary" href="'+link('/schedule')+'">Contact Prescott’s Best</a>'+
   '<a class="site-button outline" href="'+link('/holiday-lighting')+'">See package descriptions</a></div></section>'
 };
 return {'/holiday-lighting':()=>page,'/holiday-lighting/design':()=>studio};
}
export const holidayPackages=packages;
