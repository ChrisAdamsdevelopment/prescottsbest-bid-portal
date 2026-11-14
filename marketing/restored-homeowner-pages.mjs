// New homeowner pages and verified legacy content restorations.
// Project story grounded in the original Wix publication and screenshots (2026-10-31).
// Never present concept illustrations as completed Prescott’s Best projects.
import {conceptMediaFigure} from './remodeling-concept-media.mjs';
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const header=(label,title,lead)=>'<header class="site-pagehead new-pagehead"><span class="kicker">'+esc(label)+'</span><h1>'+esc(title)+'</h1><p class="lede">'+esc(lead)+'</p></header>';
const cta=(link,title,copy)=>'<section class="site-cta"><h2>'+esc(title)+'</h2><p>'+esc(copy)+'</p><div class="site-actions"><a class="site-button primary" href="'+link('/schedule')+'">Talk with Andrew about your project</a><a class="site-button outline" href="tel:+19283500940">Call (928) 350-0940</a></div></section>';
const section=(heading,copy)=>'<section class="new-info-card"><h3>'+esc(heading)+'</h3><p>'+esc(copy)+'</p></section>';
const accessibleIntro='A bathroom that works for you should still feel like home. Maybe the tub is hard to step over. Maybe the vanity is too crowded or the lights are hard to reach. We can talk through changes that make everyday life more comfortable without sacrificing the look you love.';
export function accessibleRemodelingPage(link){
 const lead=header('ACCESSIBLE & AGING-IN-PLACE REMODELING','A home that works better for the people living in it.',accessibleIntro);
 return {title:'Accessible & Aging-in-Place Remodeling in Prescott | Prescott’s Best',description:'Explore walk-in showers, safer bathroom entry, thoughtful storage and home-access improvements with Prescott’s Best Construction near Prescott Valley.',body:
  lead+'<section class="site-section new-concept-hero"><div class="new-concept-hero-copy"><span class="kicker">PLANNED FOR DAILY LIFE</span>'+
  '<h2>Less struggle. More comfort.</h2><p>There is no single bathroom layout that works for everyone. Tell us what is difficult in the space today, and which changes would make the biggest difference.</p>'+
  '<p>We’ll look at how the door opens, how someone moves around the room, where the plumbing runs, and what the floor can accommodate.</p>'+
  '<a class="site-button primary" href="'+link('/schedule')+'">Tell us what needs to change</a></div>'+
  conceptMediaFigure('access-shower-wide',{hero:true,extraClass:'new-hero-picture'})+'</section>'+
  '<section class="site-section"><div class="section-heading"><span class="kicker">START WITH WHAT MATTERS</span>'+
  '<h2>Simple choices can change how a room feels</h2><p>These are possibilities to discuss—not a checklist every homeowner has to follow.</p></div>'+
  '<div class="new-card-grid">'+
  section('A more comfortable shower','Consider a lower entry, bench or seat, handheld shower and reachable controls. For some homes, a flush entry is possible; for others, floor height and drainage make a different threshold more practical.')+
  section('Support where it counts','Grab bars need solid backing and correct placement. We can plan for that while walls are open, rather than trying to improvise after tile is finished.')+
  section('Space that feels easy to use','Clear paths, a door that opens fully, comfortable lighting and storage you can reach are just as important as the shower itself.')+'</div></section>'+
  '<section class="site-section new-split"><div><span class="kicker">DESIGN INSPIRATION</span><h2>A walk-in shower can look like part of your home.</h2>'+
  '<p>Warm tile, good lighting, a comfortable seat and practical fixtures can work together. We use visual concepts like these to compare possibilities before materials are ordered.</p>'+
  '<p><a href="'+link('/shower-conversions')+'">Explore tub-to-shower conversions</a> or <a href="'+link('/bathroom-remodeling')+'">see bathroom remodeling options</a>.</p></div>'+
  conceptMediaFigure('access-shower-close')+'</section>'+
  '<section class="site-section"><div class="section-heading"><span class="kicker">WHAT YOU CANNOT SEE</span><h2>Good shower work starts behind the tile.</h2>'+
  '<p>Before the finishes go on, the floor, drain, waterproofing and support locations need to work as one assembly. These illustrations show the kinds of questions we look at—not a construction specification for your home.</p></div>'+
  '<div class="concept-feature-grid">'+conceptMediaFigure('shower-blocking')+conceptMediaFigure('shower-cutaway')+'</div>'+
  '<p class="micro">The right waterproofing system, support anchors and installation method depend on the actual structure and applicable requirements.</p></section>'+
 '<section class="site-section accessible-video"><div class="section-heading"><span class="kicker">A QUICK LOOK AT THE POSSIBILITIES</span><h2>Twenty seconds of ideas for a more comfortable home.</h2><p>This short, silent visual shows planning concepts from the bathroom to the entryway. Turn on captions for a description of each scene.</p></div>'+
 '<figure class="accessible-reel"><video controls playsinline preload="metadata" width="1280" height="720" poster="/site-assets/remodeling-concepts/accessibility-design-reel-poster.webp" aria-label="Accessible remodeling design concepts, a 20-second silent visual overview">'+
 '<source src="/site-assets/remodeling-concepts/accessibility-design-reel.mp4" type="video/mp4">'+
 '<track kind="captions" src="/site-assets/remodeling-concepts/accessibility-design-reel.vtt" srclang="en" label="Visual descriptions" default>'+ 'Your browser does not support video. Explore the concept images below.</video><figcaption>Short design-concept video · Illustrative ideas, not construction footage.</figcaption></figure></section>'+
  '<section class="site-section new-split reverse"><div><span class="kicker">BEYOND THE BATHROOM</span><h2>Look at the whole route through the home.</h2>'+
  '<p>A level walkway, a good handrail, well-lit entry and wide-enough door can make coming home easier. We can discuss practical improvements to the parts of the house you use most often.</p>'+
  '<p>Any structural, electrical or accessibility-specific work is planned for the property and the people who will use it.</p></div>'+
  conceptMediaFigure('access-entry')+'</section>'+
  '<section class="site-section new-split"><div><span class="kicker">EVERYDAY KITCHENS</span><h2>Make the kitchen easier to move around in.</h2>'+
  '<p>Thoughtful storage, comfortable work surfaces, clear circulation and lighting can make a big difference. Bring photos of what feels awkward in your kitchen and the things you want to keep.</p>'+
  '<p><a href="'+link('/kitchen-remodeling')+'">Explore kitchen remodeling</a>.</p></div>'+conceptMediaFigure('access-kitchen')+'</section>'+
  '<section class="site-section homeowner-project-story"><div><span class="kicker">A REAL PRESCOTT-AREA PROJECT</span><h2>Crystal Creek: a home the owners wanted to stay in.</h2>'+
  '<p>That project’s original story describes a level-entry shower, wheelchair-accessible closet and difficult work under the existing floor. The goal was not just a prettier bathroom—it was helping the homeowners stay in familiar surroundings.</p>'+
  '<a class="site-button outline" href="'+link('/projects/crystal-creek-accessible-remodel')+'">Read the Crystal Creek story</a></div></section>'+
  '<section class="site-section new-checklist"><h2>What helps us prepare for a conversation?</h2>'+
  '<p>A few photos and simple notes are enough to start. Think about the doorway, the current tub or shower, what feels difficult to reach, and whether you want to keep any existing fixtures. You never need to share private medical details through the website.</p>'+
  '<p>We’ll talk about the options, take measurements and put the agreed work in writing. Our visuals are starting points; the site visit determines what is practical in your home.</p></section>'+
  cta(link,'Make the space work for you.','Tell us what daily tasks you would like to make easier.')};
}
const city='https://prescott-az.gov';
export function prescottPermitGuidePage(link){
 return {title:'Prescott Fast Track Permits & Remodeling Guide (2026) | Prescott’s Best',description:'Prescott’s July 2026 Fast Track program, eligible improvements, same-day application conditions, and why Prescott Valley follows its own permit process.',kind:'blog',headline:'Prescott Fast Track Permits: What Homeowners Should Know',published:'2026-10-30',modified:'2026-11-14',body:
 header('LOCAL HOMEOWNER GUIDE · UPDATED NOVEMBER 2026','Prescott remodeling permits: start with the right office.','A bathroom refresh, new shower or replacement door can raise different permit questions. The first step is finding out whether your home falls under the City of Prescott, Town of Prescott Valley or unincorporated Yavapai County.')+
 '<article class="site-section site-article new-article"><h2>What changed in Prescott in 2026?</h2>'+
 '<p>On July 6, 2026, the City of Prescott announced its Fast Track Permit Program for certain residential improvements. It is an expedited review process for eligible work—not a way to skip required permits or inspections.</p>'+
 '<p>The City says qualifying, complete applications submitted <strong>in person before 3 p.m.</strong> may receive same-day issuance. The City has official checklists, and it determines whether a particular project qualifies.</p>'+
 '<h2>What types of projects are on the City’s list?</h2><ul>'+
 '<li>Heating and cooling system replacements.</li><li>Water heater replacements.</li>'+
 '<li>Some accessory structure demolition and nonstructural reroofing.</li>'+
 '<li>Window and door replacements.</li><li>Interior plumbing repair or replacement.</li>'+
 '<li>Electrical panel replacements up to 200 amps.</li></ul>'+
 '<p>Those are categories the City has identified, not a guarantee that a specific application will be accepted through Fast Track. Ask about site-specific or historic-district/floodplain exclusions and the current checklist before making plans.</p>'+
 '<h2>Does a complete kitchen or bathroom remodel qualify?</h2>'+
 '<p>Not automatically. A permitted plumbing replacement is not the same thing as relocating fixtures, changing framing or rebuilding a whole kitchen. Once a project involves several trades, a new layout or structural questions, an ordinary review may be needed. The permit office makes that decision for the actual scope.</p>'+
 '<h2>Prescott Valley and Yavapai County are different jurisdictions.</h2>'+
 '<p>The City’s Fast Track announcement does not govern homes in the Town of Prescott Valley. The Town has its own permit information and GoPost application portal. Properties outside municipal boundaries may be handled by Yavapai County. A Prescott mailing address does not settle the jurisdiction.</p>'+
 '<h2>Five questions to ask before signing</h2><ol>'+
 '<li>Which jurisdiction is the home in?</li>'+
 '<li>Which parts of the planned work require permits or inspections?</li>'+
 '<li>Who will apply, pay the fees and coordinate inspections?</li>'+
 '<li>Will licensed plumbing, electrical or mechanical trades need to be involved?</li>'+
 '<li>Are there HOA, historic-area, floodplain or site restrictions?</li></ol>'+
 '<h2>Official resources</h2><div class="new-resource-links">'+
 '<a href="https://prescott-az.gov/fast-track-permits-program/" target="_blank" rel="noopener noreferrer">City of Prescott: 2026 Fast Track announcement</a>'+
 '<a href="https://prescott-az.gov/permit-center/permit-categories/building-permits/" target="_blank" rel="noopener noreferrer">City of Prescott: Building permit checklists</a>'+
 '<a href="https://gopost-prescottvalley.eplansoftreview.com/" target="_blank" rel="noopener noreferrer">Prescott Valley: GoPost permitting portal</a>'+
 '<a href="https://www.yavapaiaz.gov/Development-and-Permits/Development-Services" target="_blank" rel="noopener noreferrer">Yavapai County: Development Services</a>'+
 '<a href="https://roc.az.gov/" target="_blank" rel="noopener noreferrer">Arizona ROC: Check contractor license status</a></div>'+
 '<p class="micro">Information reviewed November 2026. Requirements, eligibility and application procedures can change. Confirm the current details with the issuing authority for your property.</p>'+
 '</article>'+cta(link,'Planning work on your home?','We can help you identify the questions to ask and explain the next steps for your project.')};
}
export function crystalCreekCaseStudyPage(link){
 return {title:'Crystal Creek Accessible Bathroom & Closet | Prescott’s Best',description:'A Home Designed to Stay In: how a Crystal Creek remodeling project addressed an accessible closet, flush-entry shower and difficult underfloor conditions.',kind:'blog',headline:'A Home Designed to Stay In — Crystal Creek Accessible Bathroom',published:'2026-10-31',modified:'2026-11-14',body:
 header('REAL PROJECT STORY · CRYSTAL CREEK','A Home Designed to Stay In.','The owners loved their home. They needed it to work differently so they could stay there. That meant looking beyond the visible tile and fixtures—and solving a difficult problem beneath the floor.')+
 '<article class="site-section site-article new-article"><h2>Start with the homeowner’s goal.</h2>'+
 '<p>In the original Prescott’s Best Construction project story, the homeowners were considering moving because changing mobility needs had made parts of their house harder to use. Andrew worked with them on a more practical layout for wheelchair use.</p>'+
 '<p>The project included a wheelchair-accessible closet, a spacious shower with a level entry, and a specialized toilet. Each choice was part of making the house more comfortable to live in—not just giving it a new look.</p>'+
 '<h2>The hardest work was under the shower.</h2>'+
 '<p>To make the shower entry flush, the existing floor and supports needed attention. The original account describes a crawlspace of roughly two feet, heating equipment between joists, and the challenge of cutting back the floor without leaving the new shower unsupported.</p>'+
 '<p>In that cramped space, Andrew dug by hand with a garden trowel and installed two concrete support posts. It is the kind of demanding work a finished photograph might never show, but it made the planned shower possible.</p>'+
 '<h2>What made the result matter.</h2>'+
 '<p>Tile, fixtures and finishing details completed the room. The most important change, though, was what the homeowners could do afterward: remain in the home they wanted to keep, with spaces better suited to how they lived.</p>'+
 '<p>Every accessibility remodel is different. This project shows why careful measurements, floor structure, plumbing and the homeowner’s daily routine all belong in the conversation from the start.</p>'+
 '<div class="project-media-note"><h3>See original project media</h3>'+
 '<p>The original project post is available on the company’s Instagram. We are preserving the original photos rather than substituting generated images and calling them completed work.</p>'+
 '<a class="site-button outline" href="https://www.instagram.com/p/DV162KsgUxP/" target="_blank" rel="noopener noreferrer">Open the original project post</a></div>'+
 '<p class="micro">This story is restored from the company’s previously published October 2026 Wix project page and archived publication record. Project details refer to this specific home; they are not a promise that the same design will work in every home.</p>'+
 '</article>'+
 '<section class="site-section homeowner-project-story"><div><span class="kicker">EXPLORE A SIMILAR IDEA</span><h2>Could your bathroom work better for you?</h2>'+
 '<p>See how low-entry showers, useful storage, support locations and comfortable circulation can be planned around your own home.</p>'+
 '<a href="'+link('/accessible-aging-in-place-remodeling')+'" class="site-button primary">Explore accessible remodeling</a></div></section>'+
 cta(link,'Let’s talk about what would help at home.','We will listen to what needs to change, then look at what the home can accommodate.')};
}
export function projectsIndexPage(link){
 return {title:'Real Remodeling Work & Project Stories | Prescott’s Best',description:'Read the Crystal Creek accessible remodel story and explore remodeling ideas from Prescott’s Best Construction, with a clear distinction between real projects and design concepts.',body:
 header('THE WORK AND THE STORIES BEHIND IT','Built for how people really live.','We want you to see what thoughtful remodeling looks like. Here is a real project story from our original site, along with clearly labeled design concepts to help you plan a project of your own.')+
 '<section class="site-section new-project-card"><div><span class="kicker">FEATURED PROJECT · CRYSTAL CREEK</span>'+
 '<h2>Helping homeowners stay in the place they love.</h2>'+
 '<p>A wheelchair-accessible closet and level-entry shower called for careful work under the floor, including hand-excavated concrete support posts in a tight crawlspace. The challenge was worth solving because it helped the homeowners remain in their familiar home.</p>'+
 '<div class="site-actions"><a class="site-button primary" href="'+link('/projects/crystal-creek-accessible-remodel')+'">Read the project story</a>'+
 '<a class="site-button outline" href="https://www.instagram.com/p/DV162KsgUxP/" rel="noopener noreferrer" target="_blank">Original project media</a></div></div></section>'+
 '<section class="site-section"><div class="section-heading"><span class="kicker">EXPLORE MATERIALS AND LAYOUTS</span>'+
 '<h2>Design ideas you can make your own.</h2><p>These images are planning concepts—not photographs of our completed jobs. They can help you compare the kind of layout and finishes you would enjoy at home.</p></div>'+
 '<div class="concept-feature-grid">'+conceptMediaFigure('access-shower-wide')+conceptMediaFigure('builtins-living')+conceptMediaFigure('access-kitchen')+'</div></section>'+
 cta(link,'Have a project in mind?','Tell us what you are trying to achieve and ask about work similar to yours.')};
}
