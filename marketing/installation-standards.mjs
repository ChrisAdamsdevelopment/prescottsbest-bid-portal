// PBC owner-described workmanship: protect the product through the installation.
// This is not a PBC blanket warranty offer or a representation of a particular
// manufacturer / product's written terms.
const photo='/site-assets/real-gallery/deck-stone-fireplace.webp';
export function installationHomeSection(link){
 return '<section class="pbc-quality-proof site-section" aria-labelledby="pbc-quality-home-heading">'+
 '<div class="pbc-quality-copy"><span class="kicker">THE DETAILS THAT PROTECT YOUR INVESTMENT</span>'+
 '<h2 id="pbc-quality-home-heading">The part you don’t see can matter the most.</h2>'+
 '<p>A good-looking finish is only half the job. The framing beneath a window, the waterproofing behind a shower, and the preparation under a deck coating all have to work together.</p>'+
 '<p>Some products come with substantial manufacturer warranties. But those warranties have installation requirements: the right materials, the right conditions, and the right sequence. We pay attention to those details because what happens before the finish goes on matters just as much as the finished look.</p>'+
 '<a class="site-button outline" href="'+link('/process')+'#installation-details">See how we handle the details</a></div>'+
 '<div class="pbc-quality-visual"><img src="'+photo+'" loading="lazy" decoding="async" width="1200" height="900" alt="Finished covered outdoor living space with timber ceiling and stone fireplace"></div></section>';
}
export function installationProcessSection(link){
 return '<section class="process-copy-section pbc-quality-process" id="installation-details" aria-labelledby="quality-process-heading">'+
 '<span class="kicker">MORE THAN A GOOD FINISH</span>'+
 '<h2 id="quality-process-heading">We build to the product, not just the picture.</h2>'+
 '<p>Materials are not all installed the same way. Before they go in, we look at the manufacturer’s requirements for the actual product and how they apply to the existing structure and our Northern Arizona conditions. That can mean checking the substrate, framing, fasteners, waterproofing, flashing, temperature, moisture, cure times or approved components.</p>'+
 '<div class="pbc-quality-example-grid">'+
 '<article><h3>Deck surfaces: conditions matter</h3><p>On a recent deck project, the protective coating had detailed instructions for preparing the surface and applying the system within the right temperature range. If the preparation or application is off, the product’s warranty may not apply. That is why we take the time to follow the specified steps instead of rushing to the last coat.</p></article>'+
 '<article><h3>Windows: the opening matters</h3><p>A long product warranty cannot fix bad framing or water that gets behind the installation. We’ve seen how a leaking window can leave a homeowner caught between the product maker and the installer. Correct openings, flashing, drainage and sealing are details worth getting right from the start.</p></article>'+
 '<article><h3>Showers: what is behind the tile?</h3><p>The tile is the part everyone sees. The pan, corners, seams, drain and waterproofing system do the quiet work. We look at how those pieces fit together and follow the approved installation method for the materials being used.</p></article></div>'+
 '<p class="pbc-quality-note">Every product has its own written terms. We can talk through the installation instructions, product documentation and what information you should keep for any manufacturer warranty that applies to your project.</p>'+
 '<a class="site-button outline" href="'+link('/projects/gallery')+'">See real finished work</a></section>';
}
const proofByService={
 '/deck-building-outdoor-carpentry':{
  label:'DECK BUILDING & SURFACE SYSTEMS',
  title:'A deck coating is only as good as the work beneath it.',
  body:'On a recent deck, the surface coating came with a precise installation process. Preparation, approved layers, temperature and curing all mattered. We follow the instructions for the actual product instead of treating every coating like it goes on the same way.',
  close:'When a manufacturer offers a warranty on a surface system, the installation details can decide whether that coverage applies. Those are the details we take seriously.'
 },
 '/finish-carpentry':{
  label:'WINDOWS, TRIM & WEATHER DETAILS',
  title:'A neat window frame should keep doing its job long after we leave.',
  body:'We have seen what happens when a window leaks and a homeowner discovers the product maker does not cover a problem caused by the installation. Proper framing, a sound opening, flashing, drainage and sealing matter as much as the window itself.',
  close:'When finish work meets an exterior opening, we consider what is happening behind the trim—not just whether the trim looks straight.'
 },
 '/bathroom-remodeling':{
  label:'WATERPROOFING THAT WORKS AS A SYSTEM',
  title:'Behind the tile is where the important work happens.',
  body:'A beautiful shower still needs a properly prepared base, the right drain connection, compatible waterproofing and careful treatment of every corner and penetration. Mixing products or skipping installation steps can create problems no amount of attractive tile can hide.',
  close:'We check the requirements for the waterproofing and finish systems being installed, including any conditions that affect their manufacturer coverage.'
 },
 '/shower-conversions':{
  label:'SHOWER SYSTEM INSTALLATION',
  title:'The shower you see depends on the one you don’t.',
  body:'A shower conversion comes together in layers: the base, drainage, waterproofing, walls and finished surfaces. Manufacturer instructions can specify compatible materials, seam details, approved application and cure times.',
  close:'Getting those hidden details right helps protect the investment in the finished shower and any applicable product warranty.'
 },
 '/kitchen-remodeling':{
  label:'MATERIALS INSTALLED AS INTENDED',
  title:'Good finishes start with the right preparation.',
  body:'Countertop systems, fixtures, backsplashes and cabinetry each have their own requirements. We plan for support, movement, moisture, clearances and compatible fastening or sealing methods instead of assuming one detail works for every product.',
  close:'Where a manufacturer warranty applies, we look at the actual product instructions and the conditions for proper installation.'
 },
 '/custom-cabinetry':{
  label:'THE DETAILS BEHIND THE CABINETS',
  title:'Built-ins should work as well as they look.',
  body:'Cabinet hardware, slides, hinges and specialty storage systems are designed around specified loads, clearances and mounting methods. We check those details while planning and fitting the cabinetry, not after the doors go on.',
  close:'Good installation helps components perform as intended and supports the manufacturer requirements attached to the products selected.'
 },
 '/room-conversions':{
  label:'BUILDING FROM THE INSIDE OUT',
  title:'A finished room needs more than a finished wall.',
  body:'Framing, insulation, moisture control, doors and windows all affect how the new space performs. We look at what the existing structure needs and how the selected materials are supposed to be installed before covering everything with fresh finishes.',
  close:'The goal is a conversion that works for daily life—not just one that photographs well.'
 }
};
export function installationServiceSection(path,link){
 const p=proofByService[path];if(!p)return '';
 const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 return '<section class="site-section pbc-quality-service" aria-labelledby="pbc-quality-service-heading">'+
 '<span class="kicker">'+esc(p.label)+'</span><h2 id="pbc-quality-service-heading">'+esc(p.title)+'</h2>'+
 '<p>'+esc(p.body)+'</p><p>'+esc(p.close)+'</p>'+
 '<a class="site-button outline" href="'+link('/process')+'#installation-details">How we approach installation details</a></section>';
}
