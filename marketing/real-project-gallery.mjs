// Original owner-supplied GBP project photos and Andrew's company reel, published with permission.
// Captions describe only what the photographs visibly establish. No concepts in this gallery.
const dir='/site-assets/real-gallery/';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const comparisons=[
 {id:'bathroom',slug:'bathroom-before-after',title:'The bathroom, completely rethought',intro:'A dated vanity and tile give way to a lighter finish and a fresh layout. The difference is easy to see.',before:'Bathroom before remodeling, with dark wood vanity and older finishes',after:'Bathroom after remodeling, with a white vanity, light countertop and updated finishes'},
 {id:'bedroom',slug:'bedroom-before-after',title:'From unfinished room to a place to unwind',intro:'The work begins with an open, unfinished space. The finished room brings it all together.',before:'Bedroom area before completion, showing unfinished floor and cabinetry',after:'Finished bedroom with bed, lighting, flooring and wall finishes'},
 {id:'living',slug:'living-room-before-after',title:'A living space with a new feel',intro:'An empty interior becomes a finished room with flooring, furnishings and details that make it feel lived in.',before:'Living room before finishing, with bare space and exposed floor',after:'Finished living area with flooring, furniture and fireplace'},
 {id:'flex',slug:'flex-room-before-after',title:'Making an extra room useful',intro:'Work in progress on one side, a clean finished space on the other. Sometimes the best remodel gives square footage a purpose.',before:'Interior room during remodeling with tools and unfinished flooring',after:'Finished interior room with painted walls, new flooring and fixtures'},
 {id:'conversion',slug:'room-conversion-before-after',title:'A conversion you can actually see',intro:'A utility-like room changes into a more comfortable finished space.',before:'Utility or garage-like interior before conversion with exposed equipment',after:'Converted finished room with clean walls, flooring and storage'},
 {id:'utility',slug:'water-heater-before-after',title:'Small-space details count, too',intro:'An exposed water-heater area is enclosed with finished doors and trim—a practical detail that tidies the room.',before:'Exposed utility and water-heater equipment before enclosure',after:'Finished wall and doors concealing the utility area'}
];
const finished=[
 {slug:'kitchen-white-cabinets',title:'A kitchen that feels open',detail:'Light cabinets, stone-look surfaces and a big working island.',alt:'Finished kitchen with white cabinetry, light counters, tile backsplash and island',group:'kitchen'},
 {slug:'kitchen-two-angles',title:'The kitchen from another angle',detail:'Counter space, cabinetry and sightlines that work together.',alt:'Two finished views of a renovated kitchen with an island and pendant lights',group:'kitchen'},
 {slug:'deck-stone-fireplace',title:'A fireplace worth gathering around',detail:'Covered outdoor seating, warm wood above, and a stone fireplace in the middle of it all.',alt:'Covered outdoor deck with stone fireplace, wood ceiling and patio seating',group:'deck'},
 {slug:'deck-fireplace-detail',title:'Built for evenings outside',detail:'An up-close look at the covered deck and fireplace.',alt:'Closer view of stone fireplace and cushioned seating on a timber covered deck',group:'deck'},
 {slug:'deck-outdoor-dining',title:'Room for the whole table',detail:'A dining spot with the pines as the backdrop.',alt:'Covered outdoor dining area on a wooden deck overlooking pine trees',group:'deck'},
 {slug:'outdoor-deck',title:'The deck connects to the home',detail:'A wide deck wrapping the house and connecting the outdoor living areas.',alt:'Finished wood deck with railing and covered porch adjoining the home',group:'deck'},
 {slug:'deck-from-home',title:'Another look at the finished deck',detail:'Doors, windows, covered seating and a continuous outdoor floor.',alt:'Wood deck across house exterior with wide windows and covered patio',group:'deck'},
 {slug:'lodge-deck',title:'The setting matters',detail:'A view of the house and outdoor structure among mature pines.',alt:'Exterior of a timber home and deck surrounded by pine trees',group:'deck'},
 {slug:'laundry-storage',title:'The utility room works harder',detail:'Compact storage and laundry details in a small footprint.',alt:'Laundry room remodeling views with cabinetry and washer-dryer',group:'interior'},
 {slug:'crystal-creek-shower',title:'A shower with everyday ease in mind',detail:'A real tiled shower from the Crystal Creek project.',alt:'Completed Crystal Creek tiled shower with level entry and wall fixtures',group:'interior'}
];
export const realGalleryAssetNames=Object.freeze([
 ...comparisons.flatMap(c=>[c.slug+'.webp',c.slug+'-before.webp',c.slug+'-after.webp']),
 ...finished.map(f=>f.slug+'.webp'),
 'andrew-craftsmanship-poster.webp'
]);
const img=(slug,alt,cls='')=>'<img src="'+dir+slug+'.webp" alt="'+esc(alt)+'" loading="lazy" decoding="async" class="'+cls+'" width="1200" height="900">';
const viewLink=(link,path,label)=>'<a href="'+link(path)+'">'+esc(label)+'</a>';
function compareCard(c){
 return '<article class="pbc-real-compare-card" id="project-'+c.id+'"><div class="pbc-real-compare" data-pbc-compare style="--compare:50%">'+
 '<div class="pbc-real-before">'+img(c.slug+'-before',c.before)+'</div>'+
 '<div class="pbc-real-after">'+img(c.slug+'-after',c.after)+'</div>'+
 '<span class="pbc-real-photo-label pbc-before-label">Before</span><span class="pbc-real-photo-label pbc-after-label">After</span>'+
 '<span class="pbc-real-divider" aria-hidden="true"><span>↔</span></span>'+
 '<input class="pbc-real-compare-range" type="range" min="5" max="95" value="50" step="1" aria-label="Slide to compare before and after: '+esc(c.title)+'"></div>'+
 '<div class="pbc-real-compare-copy"><h3>'+esc(c.title)+'</h3><p>'+esc(c.intro)+'</p></div></article>';
}
function photoCard(f){
 return '<article class="pbc-real-photo-card pbc-real-photo-'+esc(f.group)+'">'+
 '<button class="pbc-real-photo-open" type="button" data-pbc-photo="'+esc(f.slug)+'" aria-label="Expand photo: '+esc(f.title)+'">'+
 img(f.slug,f.alt)+'</button><div><h3>'+esc(f.title)+'</h3><p>'+esc(f.detail)+'</p></div></article>';
}
export function andrewReel(link,compact=false){
 return '<section class="pbc-reel-feature'+(compact?' pbc-reel-home':'')+'" id="andrew-at-work">'+
 '<div class="pbc-reel-copy"><span class="kicker">THE HANDS BEHIND THE WORK</span>'+
 '<h2>Watch Andrew at work.</h2>'+
 '<p>It is the measuring, the fit, the little adjustments, and the extra look before a piece goes into place. Here is a real glimpse of how Andrew approaches the job.</p>'+
 '<p>Thirty-two seconds. Real work. Hear the original company reel, right here on our site.</p>'+
 '<div class="site-actions"><a class="site-button primary" href="'+link('/projects/gallery')+'">Explore the finished projects</a>'+
 '<a class="site-button outline" href="'+link('/schedule')+'">Talk about your project</a></div></div>'+
 '<figure class="pbc-reel-player"><video controls playsinline preload="none" poster="'+dir+'andrew-craftsmanship-poster.webp" width="638" height="360" aria-label="Andrew at work, original Prescott\'s Best Construction reel with sound">'+
 '<source src="'+dir+'andrew-craftsmanship-with-sound.mp4" type="video/mp4">Your browser cannot play this video.</video>'+
 '<figcaption>Original Prescott’s Best Construction reel · Sound available · Plays here, without leaving the site</figcaption></figure></section>';
}
export function realProjectsHomeSection(link){
 return '<section class="pbc-real-home-section" aria-labelledby="pbc-real-home-title"><div class="pbc-real-home-head"><span class="kicker">REAL PROJECTS · NOT RENDERINGS</span>'+
 '<h2 id="pbc-real-home-title">See what the work looks like when it’s real.</h2><p>A brighter kitchen. A room made useful. A deck built for time outside. These are photographs from actual Prescott’s Best projects.</p></div>'+
 '<div class="pbc-real-home-pictures"><a href="'+link('/projects/gallery')+'#project-bathroom">'+img('bathroom-before-after-after','Completed updated bathroom with bright white vanity')+'<strong>Bathroom transformations</strong></a>'+
 '<a href="'+link('/projects/gallery')+'#finished-work">'+img('deck-stone-fireplace','Covered outdoor fireplace and seating')+'<strong>Decks & outdoor living</strong></a>'+
 '<a href="'+link('/projects/gallery')+'#finished-work">'+img('kitchen-white-cabinets','White kitchen cabinetry and working island')+'<strong>Kitchen craftsmanship</strong></a></div>'+
 '<div class="site-actions"><a class="site-button primary" href="'+link('/projects/gallery')+'">Browse real projects and before/after photos</a></div></section>'+andrewReel(link,true);
}
export function realProjectsDirectorySection(link){
 return '<section class="pbc-real-directory-callout" aria-label="Real project photo collection">'+
 '<div><span class="kicker">NEW · REAL PROJECT GALLERY</span><h2>Before, after, and everything that makes a space yours.</h2>'+
 '<p>Browse authentic project photographs from the company’s Google Business Profile gallery, see real room transformations, and watch Andrew work without leaving this website.</p>'+
 '<a class="site-button primary" href="'+link('/projects/gallery')+'">See the real project gallery</a></div>'+
 '<a class="pbc-real-directory-image" href="'+link('/projects/gallery')+'#finished-work">'+img('deck-stone-fireplace','A real covered deck and stone fireplace')+'</a></section>';
}
export function realProjectServiceSection(path,link){
 const rows={
 '/bathroom-remodeling':['bathroom-before-after-after','A bathroom that feels completely different','See the before and after of a real bathroom remodel.','bathroom'],
 '/shower-conversions':['crystal-creek-shower','Real shower work, not a concept image','See the tiled shower at Crystal Creek.','interior'],
 '/kitchen-remodeling':['kitchen-white-cabinets','A kitchen made for living in','Explore real finished cabinetry, counters and kitchen details.','kitchen'],
 '/deck-building-outdoor-carpentry':['deck-stone-fireplace','Outdoor living, done for real','See a covered deck with a fireplace and room to gather.','deck'],
 '/room-conversions':['room-conversion-before-after-after','A room with a new purpose','See the difference in an actual room conversion.','conversion']
 };
 const item=rows[path];if(!item)return '';
 return '<section class="pbc-real-service-proof"><div><span class="kicker">FROM OUR REAL PROJECT GALLERY</span>'+
 '<h2>'+esc(item[1])+'</h2><p>'+esc(item[2])+'</p>'+
 '<a class="site-button outline" href="'+link('/projects/gallery')+'#'+(item[3]==='bathroom'?'project-bathroom':'finished-work')+'">See real project photos</a></div>'+
 img(item[0],item[1])+'</section>';
}
export function realProjectGalleryPage(link){
 return {title:'Real Remodeling Photos, Before & After | Prescott’s Best Construction',
 description:'See real Prescott’s Best Construction bathroom, kitchen, room conversion and outdoor deck projects. Browse before-and-after comparisons and watch Andrew at work.',
 body:'<header class="pbc-real-gallery-hero"><div><span class="kicker">PRESCOTT’S BEST · REAL LOCAL WORK</span>'+
 '<h1>Real spaces. Real transformations.</h1>'+
 '<p>We would rather show you the work than give you a long sales pitch. Explore the details, compare the before and after, and get a feel for what Andrew and the crew put into a job.</p>'+
 '<div class="site-actions"><a class="site-button primary" href="#before-after">See the before & after</a><a class="site-button outline" href="#andrew-at-work">Watch Andrew work</a></div></div>'+
 '<div class="pbc-real-hero-image">'+img('deck-stone-fireplace','Real finished covered deck with stone fireplace and patio furniture')+'</div></header>'+
 '<section class="site-section pbc-real-gallery-section" id="before-after"><div class="section-heading"><span class="kicker">SEE THE DIFFERENCE</span>'+
 '<h2>Drag to see where it started.</h2><p>These are genuine before-and-after photos supplied from our project gallery. Move the handle on each image, or use the arrow keys when it is selected.</p></div>'+
 '<div class="pbc-real-compare-grid">'+comparisons.map(compareCard).join('')+'</div></section>'+
 '<section class="site-section pbc-real-gallery-section" id="finished-work"><div class="section-heading"><span class="kicker">THE FINISHED DETAILS</span>'+
 '<h2>The little things are the whole point.</h2><p>Take a closer look at real kitchens, decks, outdoor gathering spaces and interior details. Tap a photo to enlarge it.</p></div>'+
 '<div class="pbc-real-photo-grid">'+finished.map(photoCard).join('')+'</div></section>'+
 andrewReel(link)+
 '<section class="site-section pbc-real-gallery-next"><div><span class="kicker">WHAT WOULD YOU CHANGE AT HOME?</span><h2>Bring us your idea. We’ll bring the experience.</h2>'+
 '<p>Tell Andrew what is working, what is not, and what you want your space to become. The best place to start is a conversation.</p>'+
 '<div class="site-actions"><a class="site-button primary" href="'+link('/schedule')+'">Talk about my project</a>'+
 '<a class="site-button outline" href="tel:+19283500940">Call (928) 350-0940</a></div></div></section>'+
 '<dialog class="pbc-real-lightbox" data-pbc-lightbox aria-label="Expanded real project photograph"><button type="button" class="pbc-real-lightbox-close" data-pbc-close aria-label="Close enlarged photo">× Close</button><img alt="" loading="lazy"></dialog>'
 };
}
export function realProjectVideoPage(link){
 return {title:'Watch Andrew’s Real Construction Work | Prescott’s Best',
 description:'Watch original footage of Andrew’s hands-on remodeling and carpentry work, with sound, on the Prescott’s Best Construction website.',
 kind:'blog',headline:'Watch Andrew at work — an honest look at the craft',published:'2026-11-21',modified:'2026-11-21',
 body:'<header class="site-pagehead"><span class="kicker">A LOOK INSIDE THE WORK</span><h1>There’s a reason the details matter.</h1>'+
 '<p class="lede">You can tell a lot about a builder by how they handle the parts of a job most people never see. Here’s Andrew doing the work.</p></header>'+
 andrewReel(link)+
 '<section class="site-section pbc-real-gallery-next"><h2>See how the work turns out.</h2><p>From useful room conversions to kitchens and outdoor spaces, real project photos say more than another slogan.</p>'+
 '<a class="site-button primary" href="'+link('/projects/gallery')+'">See before & after photos</a></section>'
 };
}
