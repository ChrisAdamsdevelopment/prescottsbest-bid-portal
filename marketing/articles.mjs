// Homeowner education library: factual, carefully scoped planning guidance, not bids or permit decisions.
// Content is first-party editorial and must be reviewed whenever local requirements change.
const escapeHtml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const articles=[
 {slug:'compare-fixed-price-and-cost-plus',title:'Fixed Price vs. Cost-Plus Remodeling: What Homeowners Should Compare',
 excerpt:'Learn how scope, allowances, allowable costs, contractor fees and changes affect a remodeling agreement.',
 category:'Budgeting and contracts',date:'2026-11-03',sections:[
 ['Start with the scope, not just the number','A fixed-price proposal normally identifies a price for specified work, assumptions and exclusions. A cost-plus agreement generally ties payment to eligible actual costs and an agreed contractor fee. Neither structure replaces clear written scope, change procedures and a realistic understanding of hidden conditions.'],
 ['Questions for a fixed-price proposal','Ask whether demolition, hauling, drywall, waterproofing, fixture allowances, permits, taxes and subcontractors are included. Ask how concealed damage and owner-requested upgrades are documented, priced and approved.'],
 ['Questions for a cost-plus agreement','Request a written definition of allowable costs: labor, burden, supervision, materials, freight, subcontractors, disposal, permit costs and sales or transaction taxes, where applicable. Confirm whether the contractor fee is fixed or percentage-based and which costs it applies to. Ask what records and receipts you may review.'],
 ['Contingency and allowances','A planning reserve is not automatically money spent. An allowance is a budget placeholder for a selection, not a guaranteed supplier quote. Make sure the agreement explains how unused allowances, overruns and contractor fees are reconciled.'],
 ['A practical next step','List three must-have outcomes and three optional upgrades. Ask each contractor to price the same scope and identify assumptions before comparing totals.'],
 ],links:[['Arizona Registrar of Contractors','https://roc.az.gov/']]},
 {slug:'bathroom-remodel-planning-checklist',title:'Bathroom Remodel Planning Checklist: Before You Request a Quote',
 excerpt:'Prepare measurements, shower goals, fixture choices and questions that can change a bathroom remodel scope.',
 category:'Bathroom remodeling',date:'2026-11-03',sections:[
 ['How the room works today','List the problems you want solved: storage, accessibility, ventilation, water damage, cramped clearances or dated fixtures. Photos and approximate dimensions make an initial discussion more useful; precise measurements are verified on site.'],
 ['Wet-area decisions','Decide whether to keep the tub, add a shower, alter the enclosure or move a drain. Ask which waterproofing system is proposed and whether wall or floor conditions must be evaluated before selecting tile.'],
 ['Materials and choices','Prepare ideas for vanity size, sinks, faucets, fixtures, flooring, grout, lighting and storage. Identify items the homeowner plans to purchase, because procurement, warranty and compatibility responsibilities should be clear.'],
 ['Work that changes scope','Electrical work, plumbing relocation, changes to framing and concealed moisture can affect trades, cost, scheduling and permitting. Do not assume a project is permit-exempt solely because the room is small.'],
 ['During construction','Ask about household access, protection of adjacent rooms, water shutoffs, debris disposal, inspections and how change decisions will be recorded.'],
 ],links:[['Arizona Registrar of Contractors','https://roc.az.gov/']]},
 {slug:'kitchen-budget-decisions',title:'Kitchen Remodeling Budget: Decisions That Usually Affect Scope',
 excerpt:'Understand why cabinetry, layout changes, surfaces and temporary kitchen needs make a difference when planning.',
 category:'Kitchen remodeling',date:'2026-11-03',sections:[
 ['Keep the layout or change it?','Keeping sinks and major appliances near their existing locations may reduce trade coordination, but the condition of wiring, plumbing and framing still needs evaluation. A new wall, moved sink or expanded opening can change scope materially.'],
 ['Cabinets and storage','Compare refacing, replacement and custom cabinetry by condition, function and lead time. A cabinet allowance should identify what quality, finish, hardware and installation it assumes.'],
 ['Counters, backsplash and floors','Countertop material, edge treatment, fabrication, substrate and backsplash design can affect installed cost. Account for demolition, dust protection, transitions and floor leveling where needed.'],
 ['Appliances and electrical','List appliance models and dimensions as early as possible. New circuits, exhaust arrangements, lighting or outlet placement can require qualified trades and approvals.'],
 ['Plan for daily life','Discuss where cooking, cleanup and storage will happen during construction and which work needs inspections before finishes can be installed.'],
 ],links:[['Arizona Registrar of Contractors','https://roc.az.gov/']]},
 {slug:'prescott-permit-questions-homeowners',title:'Prescott-Area Remodeling Permits: Questions to Ask Before Starting',
 excerpt:'A homeowner guide to verifying the correct jurisdiction, permit type and responsibility for residential remodels.',
 category:'Permits and approvals',date:'2026-11-03',sections:[
 ['First confirm who has jurisdiction','A Prescott mailing address does not always mean the home is within the City of Prescott. Verify whether the property is in Prescott, Prescott Valley, an unincorporated Yavapai County area, or another jurisdiction. Rules and submittal processes differ.'],
 ['Describe the actual work','Tell the building department whether the project includes structural changes, electrical circuits, plumbing relocation, heating or ventilation, window or door openings, or changes of use. A broad label like “bathroom refresh” is not enough to determine permit requirements.'],
 ['Ask about the current procedure','Permit forms, review paths and online portals can change. Confirm the current process, whether a contractor or homeowner may apply, which drawings or trade permits are needed, applicable fees and when inspections must occur. Do not rely on an old blog post as a permit authorization.'],
 ['Clarify contractor responsibilities','Discuss which party submits plans, schedules inspections and keeps approved documentation. Verify the contractor license and classification independently through Arizona ROC.'],
 ['Before work begins','Get project-specific instructions from the relevant authority and a written agreement covering permit responsibility and changes discovered after opening walls.'],
 ],links:[
 ['City of Prescott','https://www.prescott-az.gov/'],
 ['Town of Prescott Valley','https://prescottvalley-az.gov/'],
 ['Yavapai County','https://www.yavapaiaz.gov/'],
 ['Arizona Registrar of Contractors','https://roc.az.gov/']
 ]},
];
const cta=link=>'<section class="site-cta"><h2>Have a project in mind?</h2><p>Use the planning worksheet or talk with us before committing to a scope.</p><div class="site-actions"><a class="site-button primary" href="'+link('/start-here')+'">Plan my project</a><a class="site-button outline" href="'+link('/schedule')+'">Contact Prescott’s Best</a></div></section>';
export function articlePages(link){
 const entries=Object.fromEntries(articles.map(a=>{
  const path='/blog/'+a.slug;
  const page=()=>({title:a.title+' | Prescott’s Best Construction',description:a.excerpt,
   kind:'blog',published:a.date,modified:a.date,headline:a.title,
   body:'<header class="site-pagehead article-header"><span class="kicker">'+escapeHtml(a.category)+'</span><h1>'+escapeHtml(a.title)+'</h1><p class="lede">'+escapeHtml(a.excerpt)+'</p><p class="micro">Published '+a.date+' · Homeowner information only. Check current local requirements and obtain a property-specific assessment.</p></header>'+
   '<article class="site-section site-article blog-article">'+a.sections.map(([h,text])=>'<section><h2>'+escapeHtml(h)+'</h2><p>'+escapeHtml(text)+'</p></section>').join('')+
   '<section class="resource-links"><h2>Sources and places to check</h2><ul>'+a.links.map(([label,url])=>'<li><a rel="noopener noreferrer" target="_blank" href="'+escapeHtml(url)+'">'+escapeHtml(label)+'</a></li>').join('')+'</ul></section></article>'+cta(link)});
  return [path,page];
 }));
 entries['/blog']=()=>({title:'Remodeling Knowledge Center | Prescott’s Best Construction',
  description:'Practical homeowner articles about bathrooms, kitchens, permits, pricing and planning in the greater Prescott area.',
  body:'<div class="site-pagehead"><span class="kicker">HOMEOWNER KNOWLEDGE CENTER</span><h1>Know more before you remodel.</h1><p class="lede">Read practical guides about budgets, permits, materials and how to compare proposals. These are educational articles, not prices or permit decisions.</p></div>'+
  '<section class="site-section"><article class="site-callout storm-blog-feature"><span class="kicker">NOVEMBER 2026 • STORM RECOVERY</span><h2>Flood damage in Prescott? A free place to start.</h2><p>Safety, documenting damage, insurance questions, and a no-account planning checklist for homeowners affected by the recent storms.</p><a href="'+link('/storm-flood-damage-prescott')+'">Read the flood recovery guide</a></article></section><section class="site-section"><article class="site-callout wildfire-blog-feature"><span class="kicker">ARIZONA HOME RESILIENCE</span><h2>Wildfire home readiness: what to check before exterior remodeling</h2><p>Practical homeowner information grounded in Arizona Forestry and wildfire research, with field perspective from Tucson 1 Wildland Fire Crew veteran Christopher Adams.</p><a href="'+link('/wildfire-home-readiness')+'">Explore wildfire home readiness</a></article></section>'+
  '<section class="site-section"><div class="blog-card-grid">'+articles.map(a=>
   '<article class="site-card blog-card"><span class="kicker">'+escapeHtml(a.category)+'</span><h2>'+escapeHtml(a.title)+'</h2><p>'+escapeHtml(a.excerpt)+'</p><a href="'+link('/blog/'+a.slug)+'">Read guide →</a><p class="micro">'+a.date+'</p></article>').join('')+'</div></section>'+cta(link)});
 return entries;
}
