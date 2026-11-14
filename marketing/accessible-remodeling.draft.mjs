// PRODUCTION GATE: This draft is deliberately NOT imported into site.mjs,
// extraPages(), navLinks, or the sitemap. It MUST remain unpublished until
// project photos/video, consent and license/scope review are approved.
export const accessibleRemodelingDraft=Object.freeze({
 path:'/accessible-aging-in-place-remodeling',
 title:'Accessible & Aging-in-Place Bathroom Remodeling in Prescott | Prescott’s Best',
 description:'Plan safer, easier-to-use bathrooms and everyday home improvements around the people who live there, with site-specific feasibility and permitting review.',
 intro:'A bathroom should fit the people using it today and the way their needs may change. We can help compare practical changes—from shower access and supports to lighting, storage and circulation—before a layout is finalized.',
 sections:[
  ['Begin with the person, not the product','Ask which movements are difficult, whether a tub is still useful, how much space is needed around the toilet and vanity, and what should stay familiar. A future-ready design does not need to look institutional.'],
  ['Tub-to-shower and zero-threshold options','A lower shower entry can reduce a barrier, but the floor assembly, drain location, waterproofing and slope must work together. A truly curbless shower cannot be promised without checking elevations and structure.'],
  ['Supports and everyday usability','Discuss reinforcement for grab bars, stable seating, hand-held shower controls, lever hardware, practical reach heights, lighting and slip-resistant materials. Confirm load, installation and applicable accessibility details for the actual users and structure.'],
  ['The work behind the finished surfaces','After selective demolition, a qualified team can evaluate framing, moisture, subfloors, electrical/plumbing changes and ventilation. Document hidden-condition discoveries and obtain scope approval before extra work.'],
  ['What a realistic planning visit should establish','Gather actual door and aisle widths, existing photos, fixture preferences, mobility and caregiver considerations when voluntarily shared, and whether specialized advice is needed. Project-specific layout, permitting and pricing follow an on-site evaluation.']
 ],
 proofPolicy:'Only identify Crystal Creek or another job as a completed Prescott’s Best project when supplied project photos, factual work notes, customer media consent, and owner approval establish provenance. Do not present generated concepts as real past construction.',
 mediaNeeded:[
  {id:'accessible-hero',kind:'verified-job-photo-or-approved-concept',ratio:'16:9',alt:'Walk-in shower with a low threshold, stable support details and usable floor space',notes:'If generated, label clearly as design concept; preferably a real completed project photo with permission'},
  {id:'accessible-transition',kind:'before-after-comparison',ratio:'3:2',alt:'Bathroom entry before and after a carefully designed tub-to-shower change',notes:'Same real project and camera orientation, owner permission; avoid synthetic before/after claimed as real'},
  {id:'accessible-detail',kind:'technical-photo-series',ratio:'4:3',alt:'Example of shower waterproofing and planned grab-bar support before wall finishes',notes:'Show only verifiable assemblies installed on authorized projects, or clearly label educational diagram'},
  {id:'accessible-walkthrough',kind:'short-captioned-video',ratio:'16:9',alt:'Contractor explains accessible shower entry, reach, floor space and material options',notes:'Owner-voiced footage or properly captioned original explainer, clear construction-versus-concept disclosure'}
 ]
});

const escapeHtml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
// Complete page copy, intentionally not wired into the public route table.
// Media components will be added after the owner approves provenance, footage and alt text.
export function renderAccessibleRemodelingDraft(link=p=>p){
 const d=accessibleRemodelingDraft;
 const sections=d.sections.map(([heading,copy])=>'<section><h2>'+escapeHtml(heading)+'</h2><p>'+escapeHtml(copy)+'</p></section>').join('');
 return {title:d.title,description:d.description,body:
  '<header class="site-pagehead"><span class="kicker">ACCESSIBLE AND AGING-IN-PLACE REMODELING</span>'+
  '<h1>Make everyday spaces easier to use—without losing the feeling of home.</h1>'+
  '<p class="lede">'+escapeHtml(d.intro)+'</p></header>'+
  '<article class="site-section site-article blog-article accessible-remodeling-draft">'+sections+
  '<section><h2>A conversation before a contract</h2><p>A walkthrough helps determine real clearance, drain and floor constraints, materials, permits and qualified trade responsibilities. We develop scope and pricing for the actual home rather than promising that every pictured option will work.</p></section>'+
  '</article><section class="site-cta"><h2>Have a bathroom or home-access problem to solve?</h2>'+
  '<p>Tell us what is difficult now and what would make daily life easier.</p>'+
  '<a class="site-button primary" href="'+escapeHtml(link('/schedule'))+'">Discuss an accessible remodel</a></section>'};
}
