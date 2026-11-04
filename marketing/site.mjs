import {extraPages} from './extra-pages.mjs';
import {guidePage} from './guide-page.mjs';
import {articlePages,articles} from './articles.mjs';
import {holidayPages} from './holiday-pages.mjs';
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
const navLinks=[['/bathroom-remodeling','Bathrooms'],['/kitchen-remodeling','Kitchens'],['/start-here','Plan a project'],['/project-guide','AI Guide'],['/estimate','Budget tool'],['/projects','Our work'],['/blog','Blog'],['/holiday-lighting','Holiday lights'],['/schedule','Contact']];
const navEntries=navLinks.map(([href,label])=>'<a href="'+link(href)+'">'+label+'</a>').join('');
function cards(rows,key='service'){
 return '<div class="site-card-grid">'+rows.map(s=>'<article class="site-card">'+(key==='service'?(conceptCardImage(s.path)||'<div class="site-card-icon">'+esc(s.icon||'STEP')+'</div>'):'<div class="site-card-icon">GUIDE</div>')+'<div class="site-card-body"><h3>'+esc(s.name)+'</h3><p>'+esc(s.desc)+'</p><a href="'+link(s.path)+'">Learn more <span aria-hidden="true">→</span></a></div></article>').join('')+'</div>';
}
function faq(rows){return '<div class="faqs">'+rows.map(([q,a])=>'<details><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join('')+'</div>'}
const call='<a href="tel:+19283500940" class="text-link">Call (928) 350-0940</a>';
function home(){
 return {title:'Bathroom & Kitchen Remodeling | Prescott’s Best Construction',description:'Explore residential remodeling in Prescott and Prescott Valley. View services, understand preliminary budgets, and request a personal consultation.',body:
 '<section class="site-hero concept-hero">'+conceptHero()+'<div class="hero-copy"><span class="kicker">YOUR HOME. THOUGHTFULLY REMODELED.</span><h1>Bring your remodeling ideas into focus.</h1><p>Bathrooms, kitchens, room conversions and finish carpentry across the greater Prescott area. Understand the options, explore an early budget and talk directly with someone who does the work.</p><div class="site-actions">'+priceLink+aiLink+consultLink+'</div><p class="micro">You can also '+call+'. No chatbot or account is required.</p></div><div class="hero-mark"><div class="hero-mark-image">'+logo+'</div><div class="hero-mark-caption">THE DETAILS MATTER</div><p>Careful planning. Clear expectations. Respect for the home you live in.</p></div></section>'+
 trust+
 '<section class="site-section site-quick-start" aria-label="Start your project"><div><span class="kicker">NOT SURE WHERE TO BEGIN?</span><h2>A clearer way to plan your remodel</h2><p>Answer four simple questions for a practical checklist. Nothing is sent unless you choose to contact us.</p></div><a class="site-button primary" href="'+link('/start-here')+'">Help me plan my project</a></section>'+
 '<section class="site-section"><div class="section-heading"><span class="kicker">HOW CAN WE HELP?</span><h2>Remodeling services tailored to your home</h2><p>Choose a starting point. We help clarify scope, timing and what may affect the cost.</p></div>'+cards(services)+'</section>'+
 '<section class="site-band"><div><span class="kicker">PLAN WITH CONFIDENCE</span><h2>Have a project in mind but no idea what it could cost?</h2><p>Try the preliminary budget explorer. It compares illustrative fixed-price and cost-plus approaches and explains what changes the range. Company-specific pricing is still being validated.</p></div>'+priceLink+'</section>'+
 '<section class="site-section"><div class="section-heading"><span class="kicker">LEARN BEFORE YOU START</span><h2>Helpful answers for local homeowners</h2><p>Useful preparation is more important than pushing for a quick commitment.</p></div>'+cards(guides,'guide')+'<p class="resource-more"><a class="site-button outline" href="'+link('/blog')+'">Browse the Knowledge Center</a></p></section>'+
 '<section class="site-section proof"><div><span class="kicker">SEE THE WORK, NOT MADE-UP TESTIMONIALS</span><h2>Real experience. Direct reviews.</h2><p>We’re building a case-study gallery with owner-approved project photos. In the meantime you can see existing project videos and check customer feedback at its original source on Google.</p><div class="site-actions"><a class="site-button outline" href="https://www.prescottsbestconstruction.com/projects" target="_blank" rel="noopener">View existing project videos</a><a class="site-button outline" href="'+maps+'" target="_blank" rel="noopener">Reviews on Google Maps</a></div></div><div class="proof-panel">Authentic project photographs and customer-approved before/after stories will be added here. AI design renderings will be labeled as concepts—not completed work.</div></section>'+
 '<section class="site-band"><div><span class="kicker">SEASONAL CONCIERGE</span><h2>Holiday lighting without climbing ladders.</h2><p>Try our new holiday-lighting concept packages and interactive, private photo preview. Installation availability and prices are still being finalized.</p><p>'+linkText('Explore holiday lighting','/holiday-lighting')+' · '+linkText('Design lights on a house photo','/holiday-lighting/design')+'</p></div><a class="site-button outline" href="'+link('/holiday-lighting')+'">Explore holiday lights</a></section>'+
 '<section class="site-band"><div><span class="kicker">A PERSONAL APPROACH</span><h2>Experienced hands for projects big and small.</h2><p>Learn how we work, and ask about selected smaller improvements through our project concierge.</p><p>'+linkText('Meet Prescott’s Best','/about')+' · '+linkText('Smaller project concierge','/concierge')+'</p></div><a class="site-button outline" href="'+link('/projects')+'">See project media</a></section>'+
 '<section class="site-cta"><h2>Let us talk about your home.</h2><p>A simple conversation can help turn ideas into a clear next step.</p><div class="site-actions">'+consultLink+'</div></section>'};
}
function service(s){
 return {title:s.title+' | Prescott’s Best Construction',description:s.desc+' Serving Prescott Valley and the greater Prescott area.',body:
 '<div class="site-pagehead service-pagehead"><div class="service-pagehead-copy"><span class="kicker">LOCAL RESIDENTIAL REMODELING</span><h1>'+esc(s.title)+'</h1><p class="lede">'+esc(s.desc)+'</p><p class="micro">Review a design concept for inspiration; the final project scope is confirmed on site.</p></div>'+conceptServiceImage(s.path)+'</div>'+
 '<section class="site-section site-detail"><div><h2>Start with the right plan</h2><p>'+esc(s.detail)+'</p><p>We focus on clearly defined homeowner priorities, practical project sequencing and communication about what is included. Final recommendations require evaluating the home itself.</p></div><aside class="site-callout"><h3>Useful first steps</h3><ol><li>Describe what needs to change.</li><li>List what needs to stay.</li><li>Choose a finish and budget preference.</li><li>Request a site conversation.</li></ol>'+priceLink+'</aside></section>'+
 '<section class="site-section"><h2>Questions homeowners often ask</h2>'+faq([
 ['Can I see a project budget before an appointment?','Yes. Our early budget explorer is a research demonstration, not a contractor quote. A site visit and approved pricebook are required for company pricing.'],
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
 return {title:'Remodeling Budget Explorer | Prescott Valley & Prescott',description:'Explore illustrative remodeling budget ranges for kitchens, bathrooms and room conversions. No email required to see a research example. Not a contractor quote.',body:
 '<div class="site-pagehead"><span class="kicker">PLAN YOUR PROJECT</span><h1>Understand a possible remodeling budget.</h1><p class="lede">Choose a few simple details. See an example range and compare what fixed-price and cost-plus agreements mean. No sign-in or phone number required.</p></div>'+
 '<div class="preview-warning"><strong>Useful starting numbers:</strong> This budget explorer gives approximate total costs from a baseline research model, so you can plan and see what changes the price. Actual job prices will be calibrated against Andrew’s written bids. Nothing here is a binding offer.</div>'+
 '<section class="site-section estimator-wrap"><form id="budget-form" class="budget-form"><h2>Four easy questions</h2>'+
 '<label for="project">1. What would you like to remodel?</label><select id="project" name="project" required><option value="bath-full" selected>Full bathroom remodel (sample)</option>'+
 services.filter(s=>s.path!='/finish-carpentry').map(s=>'<option value="'+(s.path==='/bathroom-remodeling'?'bath-full':s.path==='/kitchen-remodeling'?'kitchen-full':s.path==='/shower-conversions'?'shower':'conversion')+'">'+esc(s.name)+'</option>').join('')+
 '<option value="bath-refresh">Bathroom refresh</option><option value="kitchen-refresh">Kitchen refresh</option><option value="carpentry">Finish carpentry</option></select>'+
 '<label for="size">2. How big is the project area?</label><select id="size" name="size"><option value="small">Small</option><option value="medium" selected>Average</option><option value="large">Large</option></select>'+
 '<label for="finish">3. What level of finishes do you prefer?</label><select id="finish" name="finish"><option value="practical">Practical / budget-conscious</option><option value="standard" selected>Everyday midrange</option><option value="premium">Premium finishes</option></select>'+
 '<label for="condition">4. Will walls, plumbing or layouts change?</label><select id="condition" name="condition"><option value="straightforward">Mostly keep existing layout</option><option value="complex">Significant changes / uncertain conditions</option></select>'+
 '<button class="site-button primary" type="submit">Show example budget range</button></form>'+
 '<div class="budget-result" id="budget-result" aria-live="polite"><span class="kicker">SAMPLE BEFORE YOU START</span><h2>Full bathroom remodel — average size, standard finishes</h2><strong class="budget-sample-range">$16,100 – $43,800</strong><p>A model-based total project range for a typical starting configuration. Change the four questions to see your own ballpark and compare the pricing approaches. Actual contractor bids may differ.</p></div></section>'+
 '<section class="site-section"><h2>What is the difference?</h2><div class="two-cards"><div class="site-card"><h3>Fixed price</h3><p>A defined amount for a defined scope. Clarify exclusions, hidden conditions, and written change orders.</p></div><div class="site-card"><h3>Cost plus</h3><p>Actual allowable costs plus an agreed fee. The final amount varies; ask how costs, contingency and approvals are documented.</p></div></div></section>'+
 '<section class="site-cta"><h2>Want a number based on your actual home?</h2><p>We can discuss the scope, timing and site conditions.</p>'+consultLink+'</section>'};
}
const inquiryForm='<div id="lead-unavailable" class="site-callout" role="status"><h3>Email your project details</h3><p>Complete the form and choose <strong>Open email draft</strong>. Your email app will open with the details addressed to Chris; press <strong>Send</strong> there. Prefer to talk? Call (928) 350-0940.</p></div><form id="inquiry-form" class="inquiry-form"><label for="lead-name">Your name</label><input id="lead-name" name="name" required autocomplete="name" maxlength="120"/>'+
 '<label for="lead-email">Email address</label><input type="email" id="lead-email" name="email" required autocomplete="email" maxlength="180"/>'+
 '<label for="lead-phone">Phone number (optional)</label><input type="tel" id="lead-phone" name="phone" autocomplete="tel" maxlength="35"/>'+
 '<label for="lead-project">What would you like to work on?</label><select name="project" id="lead-project" required><option value="">Choose a type of work</option><option>Bathroom remodeling</option><option>Kitchen remodeling</option><option>Shower or bath conversion</option><option>Room or garage conversion</option><option>Finish carpentry</option><option>Other residential remodeling</option></select>'+
 '<label for="lead-notes">Tell us a little about the project</label><textarea id="lead-notes" name="notes" rows="4" maxlength="1600" placeholder="Location, current space, your goal, and a good time to contact you"></textarea>'+
 '<label class="site-consent"><input type="checkbox" id="lead-consent" required/> I agree that Prescott’s Best may contact me about this project. I have read the <a href="'+link('/privacy')+'">privacy information</a>. Do not include financial or sensitive personal information.</label>'+
 '<input class="honeypot" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"/>'+
 '<div class="site-actions"><button class="site-button primary" type="submit">Open email draft to Chris</button><button class="site-button outline" id="lead-copy" type="button">Copy project details</button></div><p id="lead-message" role="status" aria-live="polite" class="micro"></p></form>';
function contactPage(){
 return {title:'Request a Remodeling Consultation | Prescott’s Best',description:'Contact Prescott’s Best Construction about a kitchen, bathroom, conversion or finish carpentry project in the greater Prescott area.',body:
 '<div class="site-pagehead"><span class="kicker">TALK WITH A REAL PERSON</span><h1>Tell us what you have in mind.</h1><p class="lede">Describe your project and we will follow up about the next step. You can also call us directly—no online form is required.</p></div><section class="site-section site-detail"><div><h2>Request a conversation</h2><p class="micro">Online form availability is shown below. Until your request is confirmed, please call or email us directly.</p>'+inquiryForm+'</div><aside class="site-callout consultation-aside">'+conceptEditorialImage('consultation')+'<h3>Contact information</h3><p>Serving Prescott Valley, Prescott and nearby communities.</p><p>'+call+'</p><p><a href="mailto:'+contact+'">'+contact+'</a></p><p>AZ ROC #343141</p><p>Prefer a preliminary price range before contacting us? '+linkText('Try our budget explorer','/estimate')+'</p></aside></section>'};
}
function linkText(t,p){return '<a href="'+link(p)+'">'+esc(t)+'</a>'}
function processPage(){
 return {title:'Our Remodeling Process | Prescott’s Best Construction',description:'Understand how we plan residential remodeling projects, discuss preliminary budgets and move toward an owner-reviewed proposal.',body:
 '<div class="site-pagehead"><span class="kicker">A STRAIGHTFORWARD PROCESS</span><h1>From your first idea to a clear proposal.</h1><p class="lede">Good communication starts before the first piece of trim is removed.</p></div><section class="site-section">'+cards([
 {icon:'01',name:'Explore',desc:'Look at services and an illustrative budget range, or just call us.',path:'/estimate'},
 {icon:'02',name:'Discuss',desc:'Share what needs to change, existing conditions and your priorities.',path:'/schedule'},
 {icon:'03',name:'Site review',desc:'Confirm measurements, materials, trade needs and applicable permits.',path:'/schedule'},
 {icon:'04',name:'Proposal',desc:'Review a written scope, agreed pricing method, exclusions and selected visuals.',path:'/schedule'}
 ])+'</section><section class="site-cta"><h2>Ready to discuss your project?</h2>'+consultLink+'</section>'};
}
function resources(){return {title:'Remodeling Guides for Prescott Homeowners | PBC',description:'Plain-English guides to remodeling costs, permits, bathrooms and choosing a construction contract in Prescott and Prescott Valley.',body:
 '<div class="site-pagehead"><span class="kicker">LOCAL HOMEOWNER LEARNING CENTER</span><h1>Better questions lead to better remodels.</h1><p class="lede">Helpful guidance for planning projects, permits, materials and budgets. Articles are reviewed before publishing; recommendations are not substitutes for a site visit or the applicable permitting authority.</p></div><section class="site-section">'+cards(guides,'guide')+'</section>'};}
const routes={'/':home,'/project-guide':()=>guidePage(link),'/estimate':estimator,'/schedule':contactPage,'/contact':contactPage,'/process':processPage,'/resources':resources};
Object.assign(routes,extraPages(link),articlePages(link),holidayPages(link));
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
 const canonical=published?options.origin.replace(/\/$/,'')+(options.cleanPaths===true?(suffix==='/'?'/':suffix):link(suffix)):null;
 const shareOrigin='https://prescottsbestremodeling.com';
 const shareUrl=shareOrigin+(suffix==='/'?'/':suffix);
 const articleSchema=kind==='blog'?{"@context":"https://schema.org","@type":"BlogPosting",
  headline,description,datePublished,dateModified,mainEntityOfPage:shareUrl,
  author:{"@type":"Organization",name:"Prescott’s Best Construction",url:"https://prescottsbestremodeling.com/about"},
  publisher:{"@type":"Organization",name:"Prescott’s Best Construction",url:"https://prescottsbestremodeling.com/"}}:null;
 const schema={"@context":"https://schema.org","@type":"GeneralContractor",name:"Prescotts Best Construction",
 telephone:"+1-928-350-0940",email:contact,areaServed:[{ "@type":"City",name:"Prescott Valley"},{ "@type":"City",name:"Prescott"}],
 url:options.cleanPaths===true?shareUrl:'https://www.prescottsbestconstruction.com/',image:shareOrigin+'/site-assets/pbc-logo.webp',
 hasCredential:{"@type":"EducationalOccupationalCredential",credentialCategory:"Arizona Registrar of Contractors License #343141"}};
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
 '<meta property="og:url" content="'+esc(shareUrl)+'"><meta property="og:image" content="'+shareOrigin+'/site-assets/pbc-social-card.jpg">'+
 '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'+
 '<meta property="og:image:alt" content="Prescott’s Best Construction official gold badge and remodeling message">'+
 '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+esc(title)+'">'+
 '<meta name="twitter:description" content="'+esc(description)+'"><meta name="twitter:image" content="'+shareOrigin+'/site-assets/pbc-social-card.jpg">'+
 '<link rel="stylesheet" href="/marketing.css"><script defer src="/marketing.js"></script><script defer src="/guide.js"></script><script defer src="/holiday.js"></script>'+
 '<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>'+
 (articleSchema?'<script type="application/ld+json">'+JSON.stringify(articleSchema).replace(/</g,'\\u003c')+'</script>':'')+'</head><body><a href="#site-main" class="skip-link">Skip to main content</a>'+
 '<header class="site-header"><a class="site-brand" href="'+link('/')+'">'+logo+'<span>Prescott’s Best<small>CONSTRUCTION · REMODELING</small></span></a>'+
 '<nav class="desktop-nav" aria-label="Main navigation">'+navEntries+'</nav>'+
 '<details class="mobile-menu"><summary aria-label="Open navigation menu">Menu</summary><nav aria-label="Mobile navigation">'+navEntries+
 '<a href="'+link('/about')+'">About us</a><a href="'+link('/concierge')+'">Project concierge</a></nav></details>'+
 '<a class="header-phone" href="tel:+19283500940">Call (928) 350-0940</a></header>'+
 '<main id="site-main">'+body+'</main><div class="mobile-actions" aria-label="Quick actions"><a href="tel:+19283500940">Call us</a><a href="'+link('/estimate')+'">Budget example</a><a href="'+link('/schedule')+'">Contact</a></div><footer class="site-footer"><div class="footer-grid"><div>'+logo+'<h2>Prescott’s Best Construction</h2><p>Practical planning, thoughtful craftsmanship and clear communication.</p></div><div><h3>Homeowner tools</h3>'+linkText('Project budget explorer','/estimate')+linkText('AI Project Guide','/project-guide')+linkText('Holiday Lighting Concierge','/holiday-lighting')+linkText('Request a conversation','/schedule')+linkText('Remodeling guides','/resources')+linkText('Knowledge center','/blog')+linkText('Our process','/process')+linkText('About us','/about')+linkText('Smaller projects','/concierge')+linkText('Privacy','/privacy')+linkText('Accessibility','/accessibility')+'</div><div><h3>Reach us</h3><a href="tel:+19283500940">(928) 350-0940</a><a href="mailto:'+contact+'">'+contact+'</a><span>Prescott Valley, Arizona</span><span>AZ ROC #343141</span><a href="'+maps+'" target="_blank" rel="noopener">Verified Google reviews</a></div></div><p class="footer-disclosure">Website preview. Preliminary calculator numbers are unapproved research illustrations, not company quotes. Project-specific pricing and work require site evaluation and an appropriate written agreement.</p></footer></body></html>';
}
export function sitemapPaths(){return routenames.filter(k=>k!=='/contact').map(k=>link(k))}
export const publicSiteBase=base;
