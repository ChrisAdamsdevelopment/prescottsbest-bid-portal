// Central messaging for the optional visual design preview experience.
// A concept helps homeowners evaluate possibilities; it never substitutes for a signed scope or physical samples.
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const image=(file,alt)=>'<img src="'+file+'" width="1280" height="960" loading="lazy" decoding="async" alt="'+escape(alt)+'">';
const sampleScenes=[
 {title:'Cabinetry you can compare',url:'/custom-cabinetry',src:'/site-assets/visual-explorer/B01-cabinet-finish/cabinet-medium-brass.webp',
  alt:'Medium wood-tone built-in cabinetry with brass-color hardware, a central desk and shelving.',
  copy:'Try light, medium and dark wood-tone looks, then switch cabinet hardware.'},
 {title:'Outdoor spaces that feel like home',url:'/deck-building-outdoor-carpentry',src:'/site-assets/visual-explorer/B06-deck-inspiration/deck-pine-home-wood-stairs.webp',
  alt:'Illustrative wooden deck with stairs and seating beside a pine-country home.',
  copy:'Explore deck styles for different house settings and outdoor activities.'},
 {title:'Holiday lighting on your own house',url:'/holiday-lighting/design',src:'/site-assets/holiday-concepts/12-warm-white-c9-roofline-closeup.webp',
  alt:'Warm-white holiday roofline lighting style on a house at dusk.',
  copy:'Choose lights, add a house photo if you wish, and preview the effect before discussing installation.'}
];
export const previewCopy={
 homeHeading:'See it before we build it.',
 homeBody:'Plans and measurements help, but seeing an idea can make decisions much easier. Explore design inspiration now; for suitable remodeling projects, ask whether we can prepare a personalized visual concept as part of your estimate and planning conversation.',
 serviceHeading:'See what your remodeling idea could look like.',
 serviceBody:'Comparing finishes, layout ideas and materials is easier when you can see them. Explore our example designs, then ask about a visual concept based on your own space during project planning. Availability and scope of custom previews are confirmed with our team.',
 estimateHeading:'Understand the numbers—and picture the possibilities.',
 estimateBody:'An online budget range is only a starting point. During a project review, ask whether a tailored visual design preview could help you compare options before the written scope and price are finalized.',
 contactHeading:'Want help picturing the finished project?',
 contactBody:'Tell us what you are considering and check “Ask about a visual design preview.” For qualifying projects, we can discuss creating a concept using your photos, measurements and design preferences. No preview or appointment is automatically promised by sending this request.',
 holidayHeading:'Preview the display on your own home.',
 holidayBody:'Rather than guessing where holiday lights will go, try a house-photo lighting preview and choose roofline colors, entry accents and other looks. The team then checks the actual fixtures, mounting access and power details for your quote.',
 disclaimer:'Previews are illustrative planning concepts, not final construction drawings or a guarantee of exact appearance. Product samples, measurements, installation feasibility and written scope determine the finished result.'
};
export function previewPromo(link,options={}){
 const compact=options.compact===true;
 const area=options.area||'remodeling';
 const heading=options.heading||previewCopy.serviceHeading;
 const copy=options.copy||previewCopy.serviceBody;
 const path=link('/schedule')+'?preview=1'+(options.project?'&project='+encodeURIComponent(options.project):'');
 return '<section class="site-section visual-preview-promo'+(compact?' visual-preview-compact':'')+'" aria-label="Visual design preview planning">'+
  '<div><span class="kicker">SEE IT BEFORE WE BUILD IT</span><h2>'+escape(heading)+'</h2><p>'+escape(copy)+'</p>'+
  '<div class="site-actions"><a class="site-button primary" href="'+path+'">Ask about a visual preview</a>'+
  '<a class="site-button outline" href="'+link('/visual-design-preview')+'">How visual planning works</a></div>'+
  '<p class="micro">'+escape(previewCopy.disclaimer)+'</p></div></section>';
}
export function previewSteps(){
 const rows=[
  ['01','Tell us the vision','Share the space, the problem you want solved and a few favorite styles.'],
  ['02','Review the real space','Measurements, existing conditions, use of the room and likely permits shape what is possible.'],
  ['03','Explore a visual concept','For suitable projects, we can discuss a tailored preview and compare materials, finishes or layouts.'],
  ['04','Confirm before building','Review physical samples, technical details, exclusions, timing and the written scope before approving work.']
 ];
 return '<section class="site-section visual-preview-steps"><div class="section-heading"><span class="kicker">YOUR VISUAL PLANNING JOURNEY</span>'+
 '<h2>From “I can picture it” to a practical project plan</h2><p>Design choices are easier to discuss when everyone can see a similar idea.</p></div>'+
 '<ol>'+rows.map(([num,title,desc])=>'<li><span class="step-number">'+num+'</span><h3>'+escape(title)+'</h3><p>'+escape(desc)+'</p></li>').join('')+'</ol></section>';
}
export function previewHubPage(link){
 const cards=sampleScenes.map(s=>'<article class="visual-preview-card"><a href="'+link(s.url)+'">'+image(s.src,s.alt)+'</a>'+
  '<div><h3>'+escape(s.title)+'</h3><p>'+escape(s.copy)+'</p><a class="site-button outline" href="'+link(s.url)+'">Explore this look</a></div></article>').join('');
 return {
  title:'See It Before We Build It | Visual Remodeling Previews | Prescott’s Best',
  description:'See design ideas for built-in cabinets, decks and holiday lights, then ask about a personalized visual preview during your Prescott-area remodeling consultation.',
  body:'<section class="site-pagehead visual-preview-hero"><span class="kicker">SEE IT BEFORE WE BUILD IT</span>'+
   '<h1>Picture your project before construction begins.</h1>'+
   '<p class="lede">It can be hard to imagine new cabinets, a deck or a completely different room from samples and measurements alone. We make visual design exploration part of the conversation—so you can compare possibilities and explain what feels right for your home.</p>'+
   '<div class="site-actions"><a class="site-button primary" href="'+link('/schedule')+'?preview=1">Ask about a custom design preview</a>'+
   '<a class="site-button outline" href="#preview-examples">Explore design examples</a></div>'+
   '<p class="micro">Personalized previews are available for suitable projects after an initial scope review; they are not automatically included with every estimate.</p></section>'+
   '<section class="site-section" id="preview-examples"><div class="section-heading"><span class="kicker">TRY THE IDEAS YOURSELF</span>'+
   '<h2>Explore the looks, then imagine them in your home.</h2><p>Start with existing examples, choose what you like and bring those preferences into your conversation with us.</p></div>'+
   '<div class="visual-preview-cards">'+cards+'</div></section>'+
   previewSteps()+
   '<section class="site-section visual-preview-differences"><h2>Inspiration now. A home-specific concept when appropriate.</h2>'+
   '<div class="two-cards"><article class="site-card"><h3>Explore online</h3><p>Compare example designs without an appointment: cabinetry finishes and hardware, concealed storage, deck settings and holiday lighting.</p></article>'+
   '<article class="site-card"><h3>Discuss a personalized preview</h3><p>For an appropriate project, we can talk through a concept based on your own photographs, actual measurements and desired materials during the estimate process. We confirm whether that service fits your project before work is prepared.</p></article></div>'+
   '<p class="micro">'+escape(previewCopy.disclaimer)+'</p></section>'+
   '<section class="site-cta"><h2>Have a room or outdoor space in mind?</h2><p>Tell us the project and ask whether a custom visual preview could help you decide.</p>'+
   '<div class="site-actions"><a class="site-button primary" href="'+link('/schedule')+'?preview=1">Ask about a visual preview</a>'+
   '<a class="site-button outline" href="'+link('/process')+'">See our estimating process</a></div></section>'
 };
}
