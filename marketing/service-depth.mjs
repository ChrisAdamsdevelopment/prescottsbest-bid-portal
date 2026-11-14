// Material and sequence detail for existing service landings.
// Educational descriptions, not a claim that a specific proprietary system is installed.
// Work, trade involvement, license scope, and site conditions are confirmed before quoting.
const details={
 '/bathroom-remodeling':{
  title:'What goes into a lasting bathroom remodel',
  intro:'The visible tile and fixtures are only part of the project. A careful plan considers what lies behind and beneath the finish surfaces.',
  areas:[
   ['Water and wet-area assemblies','Ask about the shower pan, drain connection, waterproofing method, wall and floor transitions, flood testing when appropriate, and compatibility with selected finishes. Tile and grout alone are not a waterproofing system.'],
   ['Floors, framing and hidden conditions','Inspection after demolition can reveal moisture damage, uneven subfloors or changes needed around plumbing. Document any concealed-condition work and obtain approval before changing the scope.'],
   ['Comfort and accessible options','Compare tub-to-shower changes, grab-bar backing, slip-resistant surfaces, reachable controls and practical entry thresholds. A truly curbless shower depends on floor elevations, drainage and structural feasibility.'],
   ['Jobsite protection and sequencing','Discuss dust containment, water shutoffs, household bathroom access, inspections, ventilation, fixture lead times and how the finished room will be checked.']
  ],
  next:'Bring a photo of your existing shower and tell us whether easy entry, storage or a complete visual refresh is your priority.'
 },
 '/kitchen-remodeling':{
  title:'The practical anatomy of a kitchen remodel',
  intro:'Cabinet layout, work surfaces, utilities and the way your household uses the kitchen should guide material selections—not just a showroom image.',
  areas:[
   ['Cabinet construction and storage','Compare cabinet-box materials, door construction, hinges, drawer slides, pull-out storage and the difference between refacing, replacement and custom built-ins. Discuss serviceability and lead times.'],
   ['Counters, backsplash and floor transitions','Quartz, granite and other surfaces have different fabrication and maintenance considerations. Confirm templating, seam placement, edge details, support, backsplash transitions and appliance clearances.'],
   ['Plumbing, lighting and ventilation','Sink or appliance moves can change electrical circuits, venting, water lines and permit requirements. Qualified trades and local approvals are determined for the actual project.'],
   ['Household access and dust control','Plan temporary cooking, protection for adjacent rooms, demolition and debris pathways, finish sequencing, delivery staging and documented decisions when hidden conditions are found.']
  ],
  next:'Bring your existing kitchen dimensions and the appliance models you expect to keep or replace.'
 },
 '/shower-conversions':{
  title:'Planning a practical tub-to-shower conversion',
  intro:'A comfortable walk-in shower requires more than removing the tub. Start with drainage, the floor assembly, everyday movement and the needs of the people using it.',
  areas:[
   ['Entry and floor geometry','A low threshold may be possible without rebuilding the whole floor; a true zero-threshold design can require structural or drainage work. Verify elevations before promising a curbless result.'],
   ['Waterproofing and drain details','Review approved materials and compatible assemblies, corners, niches, penetrations and slope to drain. Ask what will be inspected or tested before surfaces are covered.'],
   ['Controls and future adaptability','Discuss hand showers, shower seats, reinforcement for future grab bars, accessible reach and appropriate non-slip surfaces for the occupants.'],
   ['Work behind the walls','Check existing plumbing, moisture conditions and ventilation before finalizing dimensions and product selections.']
  ],
  next:'Tell us who uses the space today and whether easier entry is the main reason for the change.'
 },
 '/room-conversions':{
  title:'Before turning an existing room or garage into new living space',
  intro:'A conversion depends on what the space is legally permitted to become and whether it can be made comfortable, durable and safe.',
  areas:[
   ['Permitted use and jurisdiction','Confirm the property jurisdiction, existing permitted use, zoning, occupancy rules, egress and whether drawings or inspections are required.'],
   ['Envelope and comfort','Evaluate insulation, moisture management, heating/cooling, ventilation and floor elevation; garages often differ from interior rooms in all of these.'],
   ['Structure and services','Assess wall changes, foundation/floor details, electrical loads and existing plumbing before creating a layout or budget.'],
   ['Finish and circulation','Door swings, storage, trim, lighting and routes through the home should work after the conversion—not just in the rendering.']
  ],
  next:'Bring a sketch with door locations, ceiling heights and the intended everyday use of the space.'
 },
 '/finish-carpentry':{
  title:'The details behind clean, consistent finish carpentry',
  intro:'Trim and doors look simple until the walls, floors and openings are not perfectly straight. The goal is a coherent finish throughout the room.',
  areas:[
   ['Interior doors and casing','Discuss clearances, hinge and latch alignment, casing profiles, reveals, transitions and the condition of the existing jambs.'],
   ['Baseboards and crown details','Compare profiles, outside-corner joints, returns, scarf joints and how trim meets cabinets, flooring and uneven existing surfaces.'],
   ['Materials and finishes','Paint-grade and stain-grade materials require different preparation, fastening, filling and finishing decisions. Confirm which surfaces are included.'],
   ['Protection and punch list','Plan surface protection, dust management, final caulking and finish touch-ups, and how remaining adjustments will be documented.']
  ],
  next:'Share photos of the existing trim and a reference showing the style you want to match.'
 },
 '/custom-cabinetry':{
  title:'Built-ins designed around the real room',
  intro:'A useful cabinet starts with equipment dimensions, movement clearances and the precise wall conditions—not a generic modular drawing.',
  areas:[
   ['Measurements and ergonomics','Confirm desk and sewing heights, knee space, door swings, reach zones, outlets, monitor position and printer access.'],
   ['Cabinet materials and joinery','Compare box and door materials, finishes, edge details, hinges, drawer slides and fastener/anchoring choices suitable for the wall.'],
   ['Lighting and concealed services','Plan lighting, cable pathways, ventilation for equipment and when qualified electrical work is required.'],
   ['Install and adjustment','Verify site measurements, wall flatness, scribing, trim transitions, hardware tuning and final functional testing.']
  ],
  next:'Bring the exact dimensions of the equipment you need to store or operate in the built-in.'
 },
 '/deck-building-outdoor-carpentry':{
  title:'Outdoor details that matter beyond the finish boards',
  intro:'Deck and exterior carpentry planning should reflect site exposure, attachments, local permitting and the way water moves around the structure.',
  areas:[
   ['Structure and attachments','Confirm framing, footing requirements, deck-to-house connection details and whether drawings, engineering or permits are needed.'],
   ['Water management and material choices','Compare wood and composite performance, flashing, drainage, board movement and the maintenance plan for local exposure.'],
   ['Stairs, railings and access','Discuss usable circulation, landings, transitions, handrails and guard requirements applicable to the finished design.'],
   ['Installation and long-term care','Ask how fastening details, exposed cuts, finish edges, existing site conditions and final walkthrough will be handled.']
  ],
  next:'Bring a rough footprint and photos showing how the deck connects to the home and yard.'
 }
};
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function serviceDepth(path){
 const data=details[path];
 if(!data)return '';
 return '<section class="site-section service-depth" aria-label="Project details"><div class="section-heading">'+
  '<span class="kicker">HOW TO PLAN IT WELL</span><h2>'+esc(data.title)+'</h2><p>'+esc(data.intro)+'</p></div>'+
  '<div class="service-depth-list">'+data.areas.map(([heading,body],i)=>'<details class="service-depth-item"'+(i===0?' open':'')+'><summary>'+esc(heading)+'</summary><p>'+esc(body)+'</p></details>').join('')+
  '</div><p class="micro"><strong>To help us get started:</strong> '+esc(data.next)+'</p></section>';
}
export const serviceDepthPaths=Object.freeze(Object.keys(details));
