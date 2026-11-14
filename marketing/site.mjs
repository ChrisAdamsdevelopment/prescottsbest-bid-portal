import {extraPages} from './extra-pages.mjs';
import {guidePage} from './guide-page.mjs';
import {articlePages,articles} from './articles.mjs';
import {holidayPages} from './holiday-pages.mjs';
import {holidayImages} from './holiday-assets.mjs';
import {visualExplorerSection,visualExplorersForService,visualImageObjectsForPage,visualQuickLinks} from './visual-catalog.mjs';
import {previewCopy,previewPromo,previewSteps,previewHubPage} from './visual-preview-copy.mjs';
import {inspirationPanel,inspirationSummary} from './inspiration-view.mjs';
import {designCenterNav} from './design-center-nav.mjs';
import {brandFilm,brandFilmForPath,brandFilmJsonLd} from './brand-films.mjs';
import {voiceGuideForPath} from './voice-guides.mjs';
import {wildfirePages} from './wildfire-page.mjs';
import {stormPages} from './storm-page.mjs';
import {conceptCardImage,conceptServiceImage,conceptHero,conceptEditorialImage} from './imagery.mjs';
// Search-friendly server-rendered preview pages. All pages stay noindex until owner approves canonical domain.
const base='/remodeling-preview';
const root='Prescott’s Best Construction';
const contact='chris@prescottsbestconstruction.com';
const maps='https://www.google.com/maps/search/?api=1&query=Prescotts+Best+Construction&query_place_id=ChIJuVpyA3ojLYcRZ4nEjfpJBIU';
const link=(p)=>base+(p==='/'?'':p);
const services=[
 {path:'/bathroom-remodeling',name:'Bathroom remodeling',desc:'Refresh finishes or plan a complete bathroom renovation, with practical options for layout, surfaces, showers and accessibility.',icon:'BATH',title:'Bathroom Remodeling in Prescott & Prescott Valley',detail:'Bathroom projects often begin with a problem: damaged surfaces, awkward storage, a dated shower or a layout that no longer works. We help homeowners define what should stay, what should change and where the major cost and scheduling questions are. A site visit can confirm whether plumbing, ventilation, waterproofing or electrical work changes the plan.'},
 {path:'/kitchen-remodeling',name:'Kitchen remodeling',desc:'Cabinetry, counters, flooring, fixtures and carefully scoped kitchen improvements.',icon:'KITCHEN',title:'Kitchen Remodeling for Prescott-Area Homes',detail:'A kitchen project may be a refresh of cabinets and surfaces or a larger coordinated remodel. The difference has a significant effect on trade work, temporary kitchen use, lead times and contingency. Our first step is to understand your goals, evaluate the current layout and explain the decisions that affect the budget.'},
 {path:'/shower-conversions',name:'Showers & bath conversions',desc:'Plan walk-in showers, tub replacements and bathing-space upgrades with everyday ease of use in mind.',icon:'SHOWER',title:'Walk-In Shower and Tub Conversion Planning',detail:'Replacing a tub with a shower changes more than appearance. Accessibility, drainage, waterproofing, tile, wall conditions, ventilation and fixture selection all matter. We can discuss thresholds, grab-bar backing and practical maintenance preferences, with final construction details confirmed during a visit.'},
 {path:'/room-conversions',name:'Room & garage conversions',desc:'Explore turning existing square footage into usable finished interior space, subject to local requirements.',icon:'SPACE',title:'Room and Garage Conversion Projects',detail:'Converting space often raises questions about permits, insulation, egress, electrical work and the use that is legally allowed. We start with the proposed use and site conditions before discussing finishes or pricing. We do not promise an existing garage can become living space without local review.'},
 {path:'/finish-carpentry',name:'Finish carpentry',desc:'Doors, trim, baseboards and detailed interior finishes done with attention to the surrounding home.',icon:'DETAIL',title:'Finish Carpentry and Interior Details',detail:'Well-executed trim, doors and finish details can make an entire room feel complete. We discuss material choices, transitions, surface condition, protection and the desired finish. Smaller work is considered by fit and availability; the scope and minimum-service criteria are determined before scheduling.'}
];
// Focused local service inquiries, with project-specific licensing and permit review.
services.push(
 {path:'/custom-cabinetry',name:'Custom cabinetry & built-ins',desc:'Purpose-designed cabinets, concealed workstations, shelving and storage tailored to your room.',icon:'BUILT-IN',title:'Custom Cabinetry and Built-In Storage in Prescott',detail:'Plan cabinets around the way you actually use your space: real equipment dimensions, working height, corner turns, existing furniture, opening doors, knee room, lighting and pull-out storage. We compare material and hardware options and develop measured drawings before final fabrication. Reach out about offices, hobby rooms, kitchens, room-specific built-ins and trim coordination.'},
 {path:'/deck-building-outdoor-carpentry',name:'Decks & outdoor carpentry',desc:'Discuss deck planning, stairs, exterior trim, material choices and outdoor living improvements.',icon:'DECK',title:'Deck Planning and Outdoor Carpentry Near Prescott Valley',detail:'A deck starts with a usable layout, but footings, framing, attachments, stairs, railings, drainage, material selection and approvals determine whether the design is practical. We can discuss your outdoor project and assess whether its construction is within our license classification and current scope before offering a proposal. Permits, HOA review and structural design are confirmed for the actual site.'}
);
const guides=[
 {path:'/guides/how-to-plan-a-bathroom-remodel',name:'How to plan your bathroom remodel',desc:'A homeowner-friendly checklist covering goals, measurements, finish selections and trade questions.',body:'Start with what must change and what should stay. Take photographs of the room, note whether a single bathroom must remain available during construction, and list the fixtures you use every day. Decide if your main priority is durability, accessibility, storage or appearance. Keep a contingency for concealed damage. Before purchasing fixtures, verify dimensions and compatibility with the existing plumbing and structure. A contractor’s site assessment is needed before the final scope and price can be confirmed.'},
 {path:'/guides/fixed-price-vs-cost-plus',name:'Fixed price versus cost plus',desc:'Understand defined-scope pricing, open-book actual costs, allowances and change orders.',body:'A fixed-price agreement normally defines work and a price for that defined work. Changes, hidden conditions and exclusions can still affect the final contract. Cost-plus generally uses agreed allowable actual costs plus a disclosed fee, so the customer can see documented spending but does not automatically have a guaranteed maximum. Ask what costs are included, how the fee is calculated, whether tax and permits are separate, how allowances work and whether a contingency is a reserve or a charge. Always review the exact written agreement rather than choosing based on a website example.'},
 {path:'/guides/prescott-remodeling-permits',name:'Remodeling permits in Prescott and Prescott Valley',desc:'How to identify the correct jurisdiction and prepare permit questions before work.',body:'Permit rules depend on the property’s jurisdiction and the actual scope, not simply the mailing address. Plumbing, electrical, structural, egress and occupancy changes can require different reviews. Before construction, confirm the municipal or county authority, the project description and who is responsible for submitting applications. Ask for a documented permit determination where the scope is uncertain. Visit the official City of Prescott, Town of Prescott Valley or Yavapai County permitting resources for current requirements; a blog post is not a permit decision.'}
];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const button=(text,target,cls='primary')=>'<a class="site-button '+cls+'" href="'+link(target)+'">'+esc(text)+'</a>';
const priceLink=button('Explore a budget range','/estimate');
const consultLink=button('Request a consultation','/schedule','outline');
const aiLink=button('Ask the optional AI Project Guide','/project-guide','outline');
const reviewLink='<a href="'+maps+'" target="_blank" rel="noopener noreferrer">Read customer reviews directly on Google Maps</a>';
const logo='<img class="site-logo" src="/site-assets/pbc-logo.webp" alt="Prescott’s Best Construction badge — remodel and finish carpentry" width="120" height="85"/>';
const trust='<div class="trust-line"><span>Prescott Valley & the greater Prescott area</span><span>Arizona ROC #343141</span><span>Direct, hands-on residential remodeling</span></div>';
const navLinks=[['/bathroom-remodeling','Bathrooms'],['/kitchen-remodeling','Kitchens'],['/storm-flood-damage-prescott','Storm help'],['/visual-design-preview','Design Center'],['/holiday-lighting','Holiday Lights'],['/process','Our process'],['/blog','Homeowner guides'],['/schedule','Contact']];
const navEntries=navLinks.map(([href,label])=>'<a href="'+link(href)+'">'+label+'</a>').join('');
function cards(rows,key='service'){
 return '<div class="site-card-grid">'+rows.map(s=>'<article class="site-card">'+(key==='service'?(conceptCardImage(s.path)||'<div class="site-card-icon">'+esc(s.icon||'STEP')+'</div>'):'<div class="site-card-icon">GUIDE</div>')+'<div class="site-card-body"><h3>'+esc(s.name)+'</h3><p>'+esc(s.desc)+'</p><a href="'+link(s.path)+'">Learn more <span aria-hidden="true">→</span></a></div></article>').join('')+'</div>';
}
function faq(rows){return '<div class="faqs">'+rows.map(([q,a])=>'<details><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join('')+'</div>'}
const call='<a href="tel:+19283500940" class="text-link">Call (928) 350-0940</a>';
function home(){
 return {title:'Bathroom & Kitchen Remodeling | Prescott’s Best Construction',description:'Explore residential remodeling in Prescott and Prescott Valley. View services, understand preliminary budgets, and request a personal consultation.',body:
 '<section class="site-hero concept-hero commercial-hero cinema-hero cinema-home" aria-labelledby="home-hero-heading">'+
 '<div class="cinema-scene">'+brandFilm('home',{hero:true})+'<div class="cinema-vignette" aria-hidden="true"></div>'+
 '<div class="cinema-message" aria-hidden="true"><span>LOCAL CRAFTSMANSHIP · PRESCOTT AREA</span><strong>Made for the way you live.</strong></div></div>'+
 '<div class="hero-copy cinema-copy"><div class="cinema-editorial"><span class="kicker">YOUR HOME. THOUGHTFULLY REMODELED.</span>'+
 '<h1 id="home-hero-heading">Bring your remodeling ideas into focus.</h1>'+
 '<p>Bathrooms, kitchens, custom cabinetry and thoughtful details for homes across Prescott and Prescott Valley. Explore the possibilities, then plan the right next step.</p></div>'+
 '<div class="cinema-actions"><div class="site-actions">'+priceLink+consultLink+'</div>'+
 '<p class="cinema-secondary">Need some direction? <a href="'+link('/project-guide')+'">Ask our optional Project Guide</a> or '+call+'.</p></div></div></section>'+
 trust+
 '<section class="holiday-home-feature" aria-label="Holiday lighting installation and house photo previews">'+
 '<div class="holiday-home-feature-copy"><span class="kicker">HOLIDAY LIGHTING · PRESCOTT AREA</span>'+
 '<h2>Bring your house to life for the holidays.</h2>'+
 '<p>Rooflines, entryways, wrapped trees and backyard patios. Explore design inspiration and test colors on a photo of your own home before asking our team for an installation quote.</p>'+
 '<p class="holiday-home-feature-price">Roofline lighting packages start at $599 for qualifying single-story installations.</p>'+
 '<div class="site-actions"><a class="site-button primary" href="'+link('/holiday-lighting/design')+'">Design lights on my home</a>'+
 '<a class="site-button outline" href="'+link('/holiday-lighting')+'">View lighting packages & gallery</a></div></div>'+
 '<a class="holiday-home-feature-photo" href="'+link('/holiday-lighting')+'" aria-label="Explore holiday lighting designs inspired by this illuminated woodland concept">'+
 '<img src="/site-assets/homepage/holiday-gnarled-tree-twilight-960.webp" srcset="/site-assets/homepage/holiday-gnarled-tree-twilight-960.webp 960w, /site-assets/homepage/holiday-gnarled-tree-twilight-1672.webp 1672w" sizes="(max-width:800px) calc(100vw - 44px), 44vw" width="1672" height="941" loading="lazy" decoding="async" alt="Concept rendering of a gnarled vine-covered tree wrapped in glowing warm-white holiday lights beside a creek at twilight">'+
 '<span class="holiday-home-photo-note">Holiday lighting concept illustration</span></a></section>'+
 '<section class="storm-home-banner"  aria-label="November 2026 flood recovery help"><div><span class="kicker">TO OUR NEIGHBORS AFFECTED BY THE STORMS</span><h2>Flood and storm damage? Start with a clear plan.</h2><p>We are thinking of everyone navigating the November flooding. Our free guide covers safety, insurance questions, damage photos and how to begin a repair plan—without pressure to hire anyone.</p></div><a class="site-button outline" href="'+link('/storm-flood-damage-prescott')+'">Read the recovery guide</a></section><section class="site-section site-quick-start" aria-label="Start your project"><div><span class="kicker">NOT SURE WHERE TO BEGIN?</span><h2>A clearer way to plan your remodel</h2><p>Answer four simple questions for a practical checklist. Nothing is sent unless you choose to contact us.</p></div><a class="site-button primary" href="'+link('/start-here')+'">Help me plan my project</a></section>'+
 '<section class="site-section process-home-teaser"><div><span class="kicker">WHAT HAPPENS AT AN ESTIMATE?</span><h2>We measure, listen, design and explain the numbers.</h2><p>See how an in-home consultation becomes a practical plan: room dimensions, clearances, material samples, supplier quotes, transparent cost-plus proposals and protection for your home during construction.</p><a class="site-button outline" href="'+link('/process')+'">See our full remodeling process</a></div><figure class="process-home-preview"><img src="/site-assets/process/consultation-measurements.webp" width="1672" height="941" loading="lazy" alt="Design illustration of a contractor measuring a custom sewing room while homeowners discuss the design"><figcaption>Design illustration • A closer look at the consultation process.</figcaption></figure></section>'+
 previewPromo(link,{heading:previewCopy.homeHeading,copy:previewCopy.homeBody})+
 '<section class="site-section"><div class="section-heading"><span class="kicker">HOW CAN WE HELP?</span><h2>Remodeling services tailored to your home</h2><p>Choose a starting point. We help clarify scope, timing and what may affect the cost.</p></div>'+cards(services)+'</section>'+
 '<section class="site-band"><div><span class="kicker">PLAN WITH CONFIDENCE</span><h2>Have a project in mind but no idea what it could cost?</h2><p>Explore a practical budget range and see how fixed-price and cost-plus projects differ. We’ll refine your numbers after discussing the space, materials and scope.</p></div>'+priceLink+'</section>'+
 '<section class="site-section"><div class="section-heading"><span class="kicker">LEARN BEFORE YOU START</span><h2>Helpful answers for local homeowners</h2><p>Useful preparation is more important than pushing for a quick commitment.</p></div>'+cards(guides,'guide')+'<p class="resource-more"><a class="site-button outline" href="'+link('/blog')+'">Browse the Knowledge Center</a></p></section>'+
 '<section class="site-section proof"><div><span class="kicker">PROJECT EXPERIENCE & CUSTOMER REVIEWS</span><h2>Real experience. Direct reviews.</h2><p>Explore our existing project videos and read customer feedback on Google. See the quality of the work and get to know our approach before inviting us into your home.</p><div class="site-actions"><a class="site-button outline" href="https://www.prescottsbestconstruction.com/projects" target="_blank" rel="noopener">View existing project videos</a><a class="site-button outline" href="'+maps+'" target="_blank" rel="noopener">Reviews on Google Maps</a></div></div><div class="proof-panel">Explore project videos and homeowner reviews, or contact us to see relevant examples for your renovation.</div></section>'+
 '<section class="site-band"><div><span class="kicker">SEASONAL CONCIERGE</span><h2>Holiday lighting without climbing ladders.</h2><p>Holiday lighting packages start at $599. Choose a classic roofline, add entry and landscape accents, and preview the look on your own home before requesting a quote.</p><p>'+linkText('Explore holiday lighting','/holiday-lighting')+' · '+linkText('Design lights on a house photo','/holiday-lighting/design')+'</p></div><a class="site-button outline" href="'+link('/holiday-lighting')+'">Explore holiday lights</a></section>'+
 '<section class="site-band"><div><span class="kicker">A PERSONAL APPROACH</span><h2>Experienced hands for projects big and small.</h2><p>Learn how we work, and ask about selected smaller improvements through our project concierge.</p><p>'+linkText('Meet Prescott’s Best','/about')+' · '+linkText('Smaller project concierge','/concierge')+'</p></div><a class="site-button outline" href="'+link('/projects')+'">See project media</a></section>'+
 '<section class="site-cta"><h2>Let us talk about your home.</h2><p>A simple conversation can help turn ideas into a clear next step.</p><div class="site-actions">'+consultLink+'</div></section>'};
}
const relatedServiceGuides={
 '/custom-cabinetry':['custom-cabinets-built-ins-prescott','cabinet-refacing-vs-replacement-vs-custom','concealed-home-office-workstation'],
 '/deck-building-outdoor-carpentry':['deck-building-prescott-valley','wood-vs-composite-decking-prescott','seasonal-exterior-carpentry-maintenance'],
 '/bathroom-remodeling':['aging-in-place-bathroom-remodel','walk-in-shower-conversion-guide','bathroom-remodel-planning-checklist'],
 '/kitchen-remodeling':['kitchen-layout-and-storage-questions','cabinet-refacing-vs-replacement-vs-custom','kitchen-budget-decisions'],
 '/shower-conversions':['walk-in-shower-conversion-guide','aging-in-place-bathroom-remodel'],
 '/room-conversions':['garage-room-conversion-arizona','concealed-home-office-workstation'],
 '/finish-carpentry':['interior-door-trim-finish-carpentry','custom-cabinets-built-ins-prescott']
};
function serviceGuideList(path){
 const wanted=relatedServiceGuides[path]||[];
 const matches=wanted.map(slug=>articles.find(a=>a.slug===slug)).filter(Boolean);
 return '<section class="site-section"><h2>Plan this kind of project</h2><p>Detailed homeowner guides can help you ask better questions before requesting an estimate.</p><ul class="service-related-guides">'+matches.map(a=>'<li><a href="'+link('/blog/'+a.slug)+'">'+esc(a.title)+'</a></li>').join('')+'</ul></section>';
}
function service(s){
 const heroImage=conceptServiceImage(s.path)||'<aside class="service-concept-text"><span class="kicker">YOUR PROJECT, YOUR SPACE</span><strong>Made for how you live.</strong><p>Discuss the dimensions, materials, function and approvals with a local contractor before settling on a design.</p></aside>';
 return {title:s.title+' | Prescott’s Best Construction',description:s.desc+' Serving Prescott Valley and the greater Prescott area.',body:
 '<div class="site-pagehead service-pagehead"><div class="service-pagehead-copy"><span class="kicker">LOCAL RESIDENTIAL REMODELING</span><h1>'+esc(s.title)+'</h1><p class="lede">'+esc(s.desc)+'</p><p class="micro">Review a design concept for inspiration; the final project scope is confirmed on site.</p></div>'+heroImage+'</div>'+
 '<section class="site-section site-detail"><div><h2>Start with the right plan</h2><p>'+esc(s.detail)+'</p><p>We focus on clearly defined homeowner priorities, practical project sequencing and communication about what is included. Final recommendations require evaluating the home itself.</p></div><aside class="site-callout"><h3>Useful first steps</h3><ol><li>Describe what needs to change.</li><li>List what needs to stay.</li><li>Choose a finish and budget preference.</li><li>Request a site conversation.</li></ol>'+(s.path==='/custom-cabinetry'||s.path==='/deck-building-outdoor-carpentry'?button('Discuss this project scope','/schedule','outline'):priceLink)+'</aside></section>'+
 visualQuickLinks(s.path)+visualExplorersForService(s.path).map(config=>visualExplorerSection(config,link)).join('')+
 previewPromo(link,{compact:true,project:({ '/bathroom-remodeling':'Bathroom remodeling','/kitchen-remodeling':'Kitchen remodeling', '/shower-conversions':'Shower or bath conversion','/room-conversions':'Room or garage conversion', '/finish-carpentry':'Finish carpentry','/custom-cabinetry':'Custom cabinetry and built-ins', '/deck-building-outdoor-carpentry':'Deck or outdoor carpentry'})[s.path]})+
 serviceGuideList(s.path)+'<section class="site-section"><h2>Questions homeowners often ask</h2>'+faq([
 ['Can I see a project budget before an appointment?',s.path==='/custom-cabinetry'||s.path==='/deck-building-outdoor-carpentry'?'These projects depend heavily on measurements, materials and structural requirements. Contact us for a scope review before relying on a price range.':'Yes. Our budget explorer offers a useful starting range. After reviewing your space, materials and preferences, we prepare a written proposal tailored to your project.'],
 ['Can we keep the existing layout?','Often a practical starting point, but actual plumbing, structure, electrical and permit conditions must be checked on site.'],
 ['How do I choose between fixed price and cost plus?','A fixed price defines a price for a defined scope. Cost plus uses documented allowable costs plus a separately agreed fee. The right contract depends on scope and risk.']
 ])+'</section><section class="site-cta"><h2>Tell us what you want to change.</h2><p>We can help identify the next step for your home.</p>'+consultLink+'</section>'};
}
function guide(g){
 return {title:g.name+' | Prescott Remodeling Resource Center',description:g.desc,body:
 '<div class="site-pagehead"><span class="kicker">PRESCOTT REMODELING RESOURCE CENTER</span><h1>'+esc(g.name)+'</h1><p class="lede">'+esc(g.desc)+'</p><p class="micro">Last reviewed November 2026 · General information, not project-specific permit or pricing advice.</p></div>'+
 '<article class="site-section site-article"><h2>A practical starting point</h2><p>'+esc(g.body)+'</p><p>If you have questions about a particular property, start with the current official jurisdiction requirements and an on-site evaluation.</p><div class="resource-links"><a href="https://roc.az.gov/" target="_blank" rel="noopener">Arizona Registrar of Contractors</a><a href="https://www.prescott-az.gov/" target="_blank" rel="noopener">City of Prescott</a><a href="https://prescottvalley-az.gov/" target="_blank" rel="noopener">Town of Prescott Valley</a></div></article>'+
 '<section class="site-cta"><h2>Need help with your own project?</h2>'+priceLink+aiLink+consultLink+'</section>'};
}
function estimator(){
 return {title:'Remodeling Budget Explorer | Prescott Valley & Prescott',description:'Explore remodeling budget ranges for kitchens, bathrooms and room conversions. No email or account is needed to get started.',body:
 '<div class="site-pagehead"><span class="kicker">PLAN YOUR PROJECT</span><h1>Understand a possible remodeling budget.</h1><p class="lede">Choose a few simple details. See an example range and compare what fixed-price and cost-plus agreements mean. No sign-in or phone number required.</p></div>'+
 '<div class="preview-warning"><strong>Useful starting numbers:</strong> Get an initial budget range based on your project type, size and finishes. We refine the estimate after discussing measurements, material choices and site conditions.</div>'+
 '<section class="site-section estimator-wrap"><form id="budget-form" class="budget-form"><h2>Four easy questions</h2>'+
 '<label for="project">1. What would you like to remodel?</label><select id="project" name="project" required><option value="bath-full" selected>Full bathroom remodel (sample)</option>'+
 services.filter(s=>['/bathroom-remodeling','/kitchen-remodeling','/shower-conversions','/room-conversions'].includes(s.path)).map(s=>'<option value="'+(s.path==='/bathroom-remodeling'?'bath-full':s.path==='/kitchen-remodeling'?'kitchen-full':s.path==='/shower-conversions'?'shower':'conversion')+'">'+esc(s.name)+'</option>').join('')+
 '<option value="bath-refresh">Bathroom refresh</option><option value="kitchen-refresh">Kitchen refresh</option><option value="carpentry">Finish carpentry</option></select>'+
 '<label for="size">2. How big is the project area?</label><select id="size" name="size"><option value="small">Small</option><option value="medium" selected>Average</option><option value="large">Large</option></select>'+
 '<label for="finish">3. What level of finishes do you prefer?</label><select id="finish" name="finish"><option value="practical">Practical / budget-conscious</option><option value="standard" selected>Everyday midrange</option><option value="premium">Premium finishes</option></select>'+
 '<label for="condition">4. Will walls, plumbing or layouts change?</label><select id="condition" name="condition"><option value="straightforward">Mostly keep existing layout</option><option value="complex">Significant changes / uncertain conditions</option></select>'+
 '<button class="site-button primary" type="submit">Show example budget range</button></form>'+
 '<div class="budget-result" id="budget-result" aria-live="polite"><span class="kicker">SAMPLE BEFORE YOU START</span><h2>Full bathroom remodel — average size, standard finishes</h2><strong class="budget-sample-range">$16,100 – $43,800</strong><p>A model-based total project range for a typical starting configuration. Change the four questions to see your own ballpark and compare the pricing approaches. Actual contractor bids may differ.</p></div></section>'+
 previewPromo(link,{compact:true,heading:previewCopy.estimateHeading,copy:previewCopy.estimateBody})+
 '<section class="site-section"><h2>What is the difference?</h2><div class="two-cards"><div class="site-card"><h3>Fixed price</h3><p>A defined amount for a defined scope. Clarify exclusions, hidden conditions, and written change orders.</p></div><div class="site-card"><h3>Cost plus</h3><p>Actual allowable costs plus an agreed fee. The final amount varies; ask how costs, contingency and approvals are documented.</p></div></div></section>'+
 '<section class="site-cta"><h2>Want a number based on your actual home?</h2><p>We can discuss the scope, timing and site conditions.</p>'+consultLink+'</section>'};
}
const inquiryForm='<div id="lead-unavailable" class="site-callout" role="status"><h3>Email your project details</h3><p>Complete the form and choose <strong>Open email draft</strong>. Your email app will open with the details addressed to Chris; press <strong>Send</strong> there. Prefer to talk? Call (928) 350-0940.</p></div><form id="inquiry-form" class="inquiry-form"><label for="lead-name">Your name</label><input id="lead-name" name="name" required autocomplete="name" maxlength="120"/>'+
 '<label for="lead-email">Email address</label><input type="email" id="lead-email" name="email" required autocomplete="email" maxlength="180"/>'+
 '<label for="lead-phone">Phone number (optional)</label><input type="tel" id="lead-phone" name="phone" autocomplete="tel" maxlength="35"/>'+
 '<label for="lead-project">What would you like to work on?</label><select name="project" id="lead-project" required><option value="">Choose a type of work</option><option>Bathroom remodeling</option><option>Kitchen remodeling</option><option>Shower or bath conversion</option><option>Room or garage conversion</option><option>Finish carpentry</option><option>Custom cabinetry and built-ins</option><option>Deck or outdoor carpentry</option><option>Other residential remodeling</option><option>Holiday lighting design and installation</option><option>Storm or flood damage reconstruction</option></select>'+
 '<label for="lead-area">Where is the project? (optional)</label><select name="area" id="lead-area"><option value="">Prefer not to say / unsure</option><option>Prescott</option><option>Prescott Valley</option><option>Chino Valley</option><option>Dewey-Humboldt</option><option>Mayer or Cordes Lakes</option><option>Other Yavapai County</option><option>Elsewhere in Arizona</option></select>'+
 '<label class="visual-preview-request" for="lead-visual-preview"><input type="checkbox" id="lead-visual-preview" name="visualPreview" value="requested"/><span><strong>Ask about a visual design preview</strong> — I would like to see whether a home-specific concept could help me compare layouts or finishes during planning. I understand that availability and scope are confirmed by the team.</span></label>'+
 '<label for="lead-notes">Tell us a little about the project</label><textarea id="lead-notes" name="notes" rows="4" maxlength="1600" placeholder="Location, current space, your goal, and a good time to contact you"></textarea>'+inspirationSummary(link)+
 '<div id="lead-photo-section" class="lead-photo-section" hidden><label for="lead-photos">Optional: add up to 3 photos of your space or damage</label><p class="micro">Take a picture or choose one from your phone. Photos are resized and location metadata removed. Images are reviewed privately and can help us understand your project before a visit.</p><input type="file" id="lead-photos" name="photos" accept="image/*" multiple aria-describedby="lead-photo-status"/><ul id="lead-photo-list" class="lead-photo-list" aria-label="Selected images"></ul><p id="lead-photo-status" class="micro" role="status" aria-live="polite">Up to three photographs; no account required.</p><button class="site-button outline" id="lead-photos-clear" type="button" hidden>Remove selected photos</button><p class="micro">Uploaded images are stored privately and periodically removed after approximately 30 days. Copies delivered to the company mailbox may remain as business correspondence. Only share photos you have permission to provide; avoid IDs, policy numbers or other sensitive details.</p></div>'+
 '<label class="site-consent"><input type="checkbox" id="lead-consent" required/><span>I agree that Prescott’s Best may contact me about this project. I have read the <a href="'+link('/privacy')+'">privacy information</a>. Do not include financial or sensitive personal information.</span></label>'+
 '<input class="honeypot" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"/>'+
 '<div class="site-actions"><button class="site-button primary" type="submit">Open email draft to Chris</button><button class="site-button outline" id="lead-copy" type="button">Copy project details</button></div><p id="lead-message" role="status" aria-live="polite" class="micro"></p></form>';
function contactPage(){
 return {title:'Request a Remodeling Consultation | Prescott’s Best',description:'Contact Prescott’s Best Construction about a kitchen, bathroom, conversion or finish carpentry project in the greater Prescott area.',body:
 '<div class="site-pagehead"><span class="kicker">TALK WITH A REAL PERSON</span><h1>Tell us what you have in mind.</h1><p class="lede">Describe your project and we will follow up about the next step. You can also call us directly—no online form is required.</p></div>'+
 '<section class="site-section visual-preview-inline"><h2>'+previewCopy.contactHeading+'</h2><p>'+previewCopy.contactBody+'</p><p class="micro">'+previewCopy.disclaimer+'</p></section>'+
 '<section class="site-section site-detail"><div><h2>Request a conversation</h2><p class="micro">Online form availability is shown below. Until your request is confirmed, please call or email us directly.</p>'+inquiryForm+'</div><aside class="site-callout consultation-aside">'+conceptEditorialImage('consultation')+'<h3>Contact information</h3><p>Serving Prescott Valley, Prescott and nearby communities.</p><p>'+call+'</p><p><a href="mailto:'+contact+'">'+contact+'</a></p><p>AZ ROC #343141</p><p>Prefer a preliminary price range before contacting us? '+linkText('Try our budget explorer','/estimate')+'</p></aside></section>'};
}
function linkText(t,p){return '<a href="'+link(p)+'">'+esc(t)+'</a>'}
function processPage(){
 const processImages=[
  ['consultation-measurements.webp','A contractor measures a proposed built-in sewing and office workspace while homeowners discuss door clearance and reach heights'],
  ['design-review-materials.webp','Homeowners and a contractor review a design concept, wood samples, paint choices and a project folder'],
  ['finished-sewing-hidden-office.webp','Illustrative built-in sewing desk and concealable computer workspace with cabinets and storage'],
  ['protected-custom-installation.webp','Two workers install cabinetry over floor coverings with protected furnishings and organized tools']
 ];
 const photo=i=>'<figure class="process-visual"><img src="/site-assets/process/'+processImages[i][0]+'" width="1672" height="941" loading="lazy" decoding="async" alt="'+esc(processImages[i][1])+'"><figcaption>Design illustration, not a photograph of a completed customer project or a guaranteed final design.</figcaption></figure>';
 const step=(n,title,body,image,reverse=false)=>'<section class="process-step'+(reverse?' process-step-reverse':'')+'"><div class="process-step-copy"><span class="kicker">STEP '+n+'</span><h2>'+title+'</h2>'+body+'</div>'+photo(image)+'</section>';
 return {title:'Our In-Home Remodeling Process | Prescott’s Best Construction',description:'How Prescott’s Best assesses your home, measures usable space, develops material options, explains cost-plus proposals and protects your home during installation.',body:
 '<div class="site-pagehead"><span class="kicker">BUILT AROUND THE WAY YOU ACTUALLY LIVE</span><h1>From your ideas to a plan that fits your home.</h1><p class="lede">An estimate is more than a quick look and a number. We listen, measure the space, work through practical options and help you understand what goes into the proposal before work begins.</p><p class="micro">The sewing-room scenario below illustrates the process. Images are design concepts, not photographs or approved plans for a customer’s home.</p></div>'+
 '<div class="site-section process-story">'+
 step('01','We listen, walk the space, and measure what is possible.',
 '<p>We start with your goals and how you will actually use the room. During an on-site visit we look at the conditions, take measurements, note door swings and clearances, and discuss storage, accessibility and existing furniture or equipment you want to keep.</p><p>For example, a built-in sewing desk needs to work with the owner’s actual machine, comfortable working height and reachable upper cabinets. A second computer desk might need to fit into a concealed workstation without blocking access or interfering with another door. We consider the real dimensions, relevant code and permit questions, and the work required to turn the idea into something buildable.</p>',0)+
 step('02','We develop options and get real material information.',
 '<p>We refine the layout and check the materials with suppliers, specialty shops and manufacturers as needed. Wood species, cabinet hardware, storage mechanisms, finish choices and lead times affect what is practical and what it will cost.</p><p>When stain versus paint matters, we can discuss physical wood and finish samples as part of the design and selection process. Digital images can help explore a look, but screen colors never replace real samples or a final written specification.</p>',1,true)+
 step('03','You can picture the result before making decisions.',
 '<p>Where appropriate, we prepare drawings, reference images and AI-assisted concept renderings so you can compare possible layouts and finishes—including how your existing furnishings and equipment might fit. A rendering helps you visualize the direction, while final measurements, approved materials, technical details and written scope control what gets built.</p><p>Changes are discussed before they become part of the approved project. We want you to understand both the appearance and the everyday function.</p>',2)+
 '<section class="process-copy-section"><span class="kicker">STEP 04</span><h2>An itemized proposal makes the costs understandable.</h2><p>After checking labor and supplier pricing, we put the scope and pricing approach in writing. For a cost-plus proposal, that means explaining which project costs are included, how the contractor fee is calculated, what is an allowance, how supplier changes are handled, and how additional work must be approved. The written agreement—not a website example—defines the charges, supporting documentation and customer approvals.</p><p>Where a private proposal link is used, you can review available design options, selections and revisions. We are also developing organized Google Drive sharing for plans, material references and project documents. Project-specific access is provided only when configured and authorized; it is not yet a general self-service account for every visitor.</p><div class="site-callout"><h3>What you can expect to review</h3><ul><li>Scope, measurements and what is excluded</li><li>Material choices, supplier quotes and applicable allowances</li><li>Labor and other allowable costs, plus the agreed contractor fee</li><li>Visual concepts labeled separately from approved construction details</li><li>Changes, schedule assumptions and written approval steps</li></ul></div></section>'+
 step('05','We protect your home before work begins.',
 '<p>Once the work is approved and scheduled, the installation plan includes protecting nearby floors, walls and furnishings, preparing clean work zones, containing dust where appropriate, and keeping tools and materials organized. We discuss household access, disruption, cleanup, and any discoveries that could change the scope before proceeding under an agreed change process.</p><p>At completion, the work should be reviewed against the approved scope and remaining questions addressed during a walkthrough.</p>',3,true)+
 '</div>'+previewPromo(link,{compact:true,heading:'Ask whether a personalized concept would help your project',copy:'If a visual would help you compare the finished appearance, ask about a tailored design concept during planning. We review measurements, materials and feasibility before making a construction commitment.'})+
 '<section class="site-cta"><h2>Tell us about your space.</h2><p>We will discuss what you want, what you already have and what an on-site review needs to confirm.</p>'+consultLink+'</section>'};
}
function resources(){return {title:'Remodeling Guides for Prescott Homeowners | PBC',description:'Plain-English guides to remodeling costs, permits, bathrooms and choosing a construction contract in Prescott and Prescott Valley.',body:
 '<div class="site-pagehead"><span class="kicker">LOCAL HOMEOWNER LEARNING CENTER</span><h1>Better questions lead to better remodels.</h1><p class="lede">Helpful guidance for planning projects, permits, materials and budgets. Articles are reviewed before publishing; recommendations are not substitutes for a site visit or the applicable permitting authority.</p></div><section class="site-section">'+cards(guides,'guide')+'</section>'};}
const routes={'/':home,'/visual-design-preview':()=>{const hub=previewHubPage(link);return {...hub,body:hub.body+inspirationPanel(link)}},'/project-guide':()=>guidePage(link),'/estimate':estimator,'/schedule':contactPage,'/contact':contactPage,'/process':processPage,'/resources':resources};
Object.assign(routes,extraPages(link),articlePages(link),holidayPages(link),wildfirePages(link),stormPages(link));
for(const s of services)routes[s.path]=()=>service(s);
for(const g of guides)routes[g.path]=()=>guide(g);
const routenames=Object.keys(routes);
export function marketingPage(path,options={}){
 if(!path.startsWith(base))return null;
 const suffix=path.slice(base.length)||'/';
 const page=routes[suffix];
 if(!page)return null;
 const {title,description,body,kind,published:datePublished,modified:dateModified,headline}=page();
 const published=options.indexable===true&&typeof options.origin==='string'&&options.origin.startsWith('https://');
 const scottyWidget='<aside id="scotty-widget" class="scotty-widget" aria-label="Optional AI project help">'+
 '<button type="button" id="scotty-open" class="scotty-launch" aria-controls="scotty-panel" aria-expanded="false">Ask Scotty <span aria-hidden="true">✦</span><small>AI project assistant</small></button>'+
 '<section id="scotty-panel" class="scotty-panel" role="dialog" aria-modal="true" aria-label="Scotty AI conversation" hidden>'+
 '<header class="scotty-head"><div><strong>Scotty · AI virtual assistant</strong><span>Prescott’s Best Construction</span></div><button type="button" id="scotty-close" aria-label="Close Scotty chat">×</button></header>'+
 '<div class="scotty-response-announcement" id="scotty-response-announcement" role="status" aria-live="polite" hidden><span id="scotty-announce-text"></span><button type="button" id="scotty-jump" hidden>Read latest answer</button></div>'+
 '<div id="scotty-chat-log" class="scotty-chat-log" role="log" aria-live="polite"><p>Hi! I’m Scotty, the AI virtual assistant. Need help planning a remodel or holiday lighting? You can always speak with our real team.</p></div>'+
 '<div class="scotty-shortcuts"><a href="'+link('/holiday-lighting/design')+'">Try lighting preview</a><a href="'+link('/estimate')+'">Explore budgets</a><a href="'+link('/schedule')+'">Contact our team</a></div>'+
 '<form id="scotty-form"><label for="scotty-question">Ask a home project question</label><textarea id="scotty-question" maxlength="600" rows="2" placeholder="What would you like to improve?"></textarea>'+
 '<label class="scotty-permission"><input id="scotty-consent" type="checkbox"><span>I agree to send my question and recent chat to Google Gemini. No names, addresses or private details. <a href="'+link('/privacy')+'">Privacy</a>.</span></label>'+
 '<button id="scotty-send" type="submit" disabled>Ask Scotty</button><p id="scotty-status" role="status">Optional AI help. Or call (928) 350-0940.</p></form></section></aside>';

 const canonical=published?options.origin.replace(/\/$/,'')+(options.cleanPaths===true?(suffix==='/'?'/':suffix):link(suffix)):null;
 const shareOrigin='https://prescottsbestconstruction.com';
 const shareUrl=shareOrigin+(suffix==='/'?'/':suffix);
 const articleSchema=kind==='blog'?{"@context":"https://schema.org","@type":"BlogPosting",
  headline,description,datePublished,dateModified,mainEntityOfPage:shareUrl,
  author:{"@type":"Organization",name:"Prescott’s Best Construction",url:"https://prescottsbestconstruction.com/about"},
  publisher:{"@type":"Organization",name:"Prescott’s Best Construction",url:"https://prescottsbestconstruction.com/"}}:null;
 const schema={"@context":"https://schema.org","@type":"GeneralContractor",name:"Prescotts Best Construction",
 telephone:"+1-928-350-0940",email:contact,areaServed:[{ "@type":"City",name:"Prescott Valley"},{ "@type":"City",name:"Prescott"}],
 url:options.cleanPaths===true?shareUrl:'https://www.prescottsbestconstruction.com/',image:shareOrigin+'/site-assets/pbc-logo.webp',
 hasCredential:{"@type":"EducationalOccupationalCredential",credentialCategory:"Arizona Registrar of Contractors License #343141"}};
 const gallerySchema=suffix==='/holiday-lighting'?{
  "@context":"https://schema.org","@type":"ImageGallery","@id":shareUrl+"#lighting-gallery",
  name:"Holiday Lighting, Patio and Backyard Design Inspiration",
  description:"Illustrative holiday-lighting styles for front and backyard rooflines, covered patios, outdoor gatherings, windows and soffits; not photographs of completed installations.",
  url:shareUrl,
  image:holidayImages.map(image=>({
   "@type":"ImageObject",
   name:image.title,
   contentUrl:shareOrigin+'/site-assets/holiday-concepts/'+image.file,
   url:shareOrigin+'/site-assets/holiday-concepts/'+image.file,
   description:image.alt,
   caption:image.caption,
   width:image.width,height:image.height
  }))
 }:null;
  const featuredFilm=brandFilmForPath(suffix);
  const videoSchema=brandFilmJsonLd(suffix,shareOrigin);
 const visualImages=visualImageObjectsForPage(suffix,shareOrigin);
 const visualGallerySchema=visualImages.length?{
  '@context':'https://schema.org','@type':'ImageGallery',
  '@id':shareUrl+'#visual-explorer',name:'Remodeling Design Inspiration',
  description:'Illustrative kitchen, cabinetry, cabinet hardware, wood stain and outdoor living design choices; not documented completed projects or product specifications.',
  url:shareUrl,image:visualImages
 }:null;
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'">'+
 (published?'<link rel="canonical" href="'+esc(canonical)+'">':'<meta name="robots" content="noindex,nofollow">')+
 '<meta name="theme-color" content="#17231c"><meta name="color-scheme" content="light">'+
 '<link rel="icon" href="/site-assets/favicon.ico" sizes="any">'+
 '<link rel="icon" type="image/png" sizes="32x32" href="/site-assets/favicon-32x32.png">'+
 '<link rel="icon" type="image/png" sizes="16x16" href="/site-assets/favicon-16x16.png">'+
 '<link rel="apple-touch-icon" sizes="180x180" href="/site-assets/apple-touch-icon.png">'+
 '<link rel="manifest" href="/site-assets/site.webmanifest"><link rel="alternate" type="application/rss+xml" title="Prescott’s Best homeowner guides" href="/feed.xml">'+
 '<meta property="og:type" content="website"><meta property="og:site_name" content="Prescott’s Best Construction">'+
 '<meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(description)+'">'+
 '<meta property="og:url" content="'+esc(shareUrl)+'"><meta property="og:image" content="'+shareOrigin+(featuredFilm?'/site-assets/brand-films/'+featuredFilm.slug+'-poster.webp':'/site-assets/pbc-social-card.jpg')+'">'+
 '<meta property="og:image:width" content="'+(featuredFilm?'1280':'1200')+'"><meta property="og:image:height" content="'+(featuredFilm?'720':'630')+'"><meta property="og:image:secure_url" content="'+shareOrigin+(featuredFilm?'/site-assets/brand-films/'+featuredFilm.slug+'-poster.webp':'/site-assets/pbc-social-card.jpg')+'"><meta property="og:image:type" content="'+(featuredFilm?'image/webp':'image/jpeg')+'">'+
 '<meta property="og:image:alt" content="'+esc(featuredFilm?featuredFilm.posterAlt:'Prescott’s Best Construction official gold badge and remodeling message')+'">'+
 '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+esc(title)+'">'+
 '<meta name="twitter:description" content="'+esc(description)+'"><meta name="twitter:image" content="'+shareOrigin+(featuredFilm?'/site-assets/brand-films/'+featuredFilm.slug+'-poster.webp':'/site-assets/pbc-social-card.jpg')+'">'+
 '<link rel="stylesheet" href="/marketing.css?v=voice-guides-20261109"><script defer src="/analytics-client.js"></script><script defer src="/photo-upload.js"></script><script defer src="/marketing.js"></script><script defer src="/guide.js"></script><script defer src="/scotty.js"></script><script defer src="/holiday.js"></script><script defer src="/storm.js"></script><script defer src="/inspiration-list.js"></script><script defer src="/visual-explorer.js"></script><script defer src="/brand-films.js"></script><script defer src="/voice-guides.js?v=recorded-guides-20261109"></script>'+
 '<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>'+
 (articleSchema?'<script type="application/ld+json">'+JSON.stringify(articleSchema).replace(/</g,'\\u003c')+'</script>':'')+
 (gallerySchema?'<script type="application/ld+json">'+JSON.stringify(gallerySchema).replace(/</g,'\\u003c')+'</script>':'')+
 (visualGallerySchema?'<script type="application/ld+json">'+JSON.stringify(visualGallerySchema).replace(/</g,'\\u003c')+'</script>':'')+(videoSchema?'<script type="application/ld+json">'+JSON.stringify(videoSchema)+'</script>':'')+'</head><body><a href="#site-main" class="skip-link">Skip to main content</a>'+
 '<header class="site-header"><a class="site-brand" href="'+link('/')+'">'+logo+'<span>Prescott’s Best<small>CONSTRUCTION · REMODELING</small></span></a>'+
 '<nav class="desktop-nav" aria-label="Main navigation">'+navEntries+'</nav>'+
 '<details class="mobile-menu"><summary aria-label="Open navigation menu">Menu</summary><nav aria-label="Mobile navigation">'+navEntries+
 '<a href="'+link('/about')+'">About us</a><a href="'+link('/concierge')+'">Project concierge</a></nav></details>'+
 '<a class="header-phone" href="tel:+19283500940">Call (928) 350-0940</a></header>'+
 '<main id="site-main">'+insertVoiceGuide(placeDesignNavigation(body,suffix),suffix)+'</main>'+scottyWidget+'<div class="mobile-actions" aria-label="Quick actions"><a href="tel:+19283500940">Call us</a><a href="'+link('/estimate')+'">Budget example</a><a href="'+link('/schedule')+'">Contact</a></div><footer class="site-footer"><div class="footer-grid"><div>'+logo+'<h2>Prescott’s Best Construction</h2><p>Practical planning, thoughtful craftsmanship and clear communication.</p></div><div><h3>Homeowner tools</h3>'+linkText('Project budget explorer','/estimate')+linkText('AI Project Guide','/project-guide')+linkText('Holiday Lighting Concierge','/holiday-lighting')+linkText('See it before we build it','/visual-design-preview')+'<a data-inspiration-link href="'+link('/visual-design-preview')+'#my-inspiration-list">My Inspiration List (<span data-inspiration-count>0</span>)</a>'+linkText('Request a conversation','/schedule')+linkText('Remodeling guides','/resources')+linkText('Custom cabinetry','/custom-cabinetry')+linkText('Deck and outdoor carpentry','/deck-building-outdoor-carpentry')+linkText('Knowledge center','/blog')+linkText('Storm and flood recovery','/storm-flood-damage-prescott')+linkText('Wildfire home readiness','/wildfire-home-readiness')+linkText('Our process','/process')+linkText('About us','/about')+linkText('Smaller projects','/concierge')+linkText('Privacy','/privacy')+linkText('Accessibility','/accessibility')+'<button class="footer-analytics-settings" type="button" id="analytics-settings">Analytics choices</button></div><div><h3>Reach us</h3><a href="tel:+19283500940">(928) 350-0940</a><a href="mailto:andrew@prescottsbestconstruction.com">andrew@prescottsbestconstruction.com</a><span>Prescott Valley, Arizona</span><span>AZ ROC #343141</span><a href="'+maps+'" target="_blank" rel="noopener">Verified Google reviews</a></div></div><p class="footer-disclosure">Online prices are starting points. Your written quote will confirm the scope, materials, installation and any selected options.</p></footer></body></html>';
}
function insertVoiceGuide(body,suffix){
 const guide=voiceGuideForPath(suffix);
 if(!guide)return body;
 const anchor={
  '/holiday-lighting/design':'<section class="site-section holiday-workspace">',
  '/visual-design-preview':'<section class="site-section" id="preview-examples">',
  '/estimate':'<section class="site-section estimator-wrap">'
 }[suffix];
 if(!anchor||!body.includes(anchor))throw new Error('Voice guide insertion anchor missing: '+suffix);
 return body.replace(anchor,guide+anchor);
}
function placeDesignNavigation(body,suffix){
 const nav=designCenterNav(link,suffix);
 if(!nav)return body;
 const before={
  '/visual-design-preview':'<section class="site-section" id="preview-examples">',
  '/kitchen-remodeling':'<section class="site-section site-detail">',
  '/custom-cabinetry':'<section class="site-section site-detail">',
  '/deck-building-outdoor-carpentry':'<section class="site-section site-detail">',
  '/holiday-lighting':'<section class="site-section"><div class="section-heading">',
  '/holiday-lighting/design':'<section class="site-section holiday-workspace">'
 }[suffix];
 if(!before||!body.includes(before))throw new Error('Design navigation insertion anchor missing: '+suffix);
 return body.replace(before,nav+before);
}
export function sitemapPaths(){return routenames.filter(k=>k!=='/contact').map(k=>link(k))}
export const publicSiteBase=base;
