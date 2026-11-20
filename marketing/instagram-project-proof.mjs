// Original public company posts, presented as PBC-hosted, mobile-optimized video and photos.
// Native project assets were reviewed and prepared from the business's original public posts.
// Instagram-hosted soundtrack was removed from the local video editions.
const posts = Object.freeze({
  casings: Object.freeze({kind:'reel',id:'C1VllESr9tH',label:'Window casing craftsmanship reel'}),
  crystalPhotos: Object.freeze({kind:'p',id:'DV162KsgUxP',label:'Crystal Creek bathroom project photographs'}),
  crystalProgress: Object.freeze({kind:'reel',id:'DVR_JdVAWff',label:'Crystal Creek bathroom construction reel'})
});
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const linkFor = ({kind,id}) => 'https://www.instagram.com/'+kind+'/'+id+'/';

const photoDetails=Object.freeze([
 'Level-entry tiled shower with a window and showerhead',
 'Patterned shower floor and built-in seat',
 'Installed shower controls and wall-tile detail',
 'Shower fixtures and wall tile above the seating area',
 'Hand shower and recessed storage niche',
 'Recessed niche finished with matching tile',
 'Overhead shower fixture near the window',
 'Entry to the tiled shower from the main floor',
 'Bathroom-to-shower transition and finished tile',
 'Shower bench, fixtures and floor-tile overview',
 'Full-height custom closet shelving and drawers',
 'Closet shelving, drawers and storage layout',
 'Built-in closet cabinetry seen from the entry',
 'Closet storage cabinets with drawers and shelves',
 'Finished closet cabinetry and tiled floor',
 'Closet entry with mirrored sliding doors',
 'Sliding doors opening to the closet storage',
 'Slide-out wire baskets inside a closet cabinet',
 'Pull-out closet drawer and storage fittings',
 'Installed bathroom toilet and finished floor'
]);

function realPhotoGallery(heading,description,originalUrl){
  const images=photoDetails.map((label,i)=>{
    const n=String(i+1).padStart(2,'0');
    return '<figure class="real-gallery-slide" data-gallery-index="'+i+'"><img src="/site-assets/real-projects/crystal-creek-project-'+n+'.webp"'+
      ' width="960" height="1200" loading="lazy" decoding="async" alt="Crystal Creek remodeling, photo '+(i+1)+': '+esc(label)+'">'+
      '<figcaption><span class="gallery-caption-index">Photo '+(i+1)+' of '+photoDetails.length+'</span>'+esc(label)+'</figcaption></figure>';
  }).join('');
  return '<article class="real-media-card real-photo-collection"><div class="real-media-card-copy">'+
    '<span class="kicker">REAL PBC PROJECT PHOTOGRAPHS</span><h3>'+esc(heading)+'</h3><p>'+esc(description)+'</p>'+
    '<div class="real-gallery" data-project-gallery="crystalPhotos">'+
    '<div class="real-gallery-controls"><button class="site-button outline" type="button" data-gallery-prev aria-label="Previous project photograph">Previous</button>'+
    '<output data-gallery-status aria-live="polite">Photo 1 of '+photoDetails.length+'</output>'+
    '<button class="site-button outline" type="button" data-gallery-next aria-label="Next project photograph">Next</button></div>'+
    '<p class="micro real-gallery-hint">Swipe left or right through the photos on your phone, or use Previous and Next. These are real company project photos, not renderings.</p>'+
    '<div class="real-gallery-track" tabindex="0" role="region" aria-label="Twenty original Crystal Creek bathroom and closet project photos">'+images+'</div>'+
    '</div>'+
    '<details class="real-media-source"><summary>Original Instagram source (optional)</summary>'+
    '<a class="real-media-original" target="_blank" rel="noopener noreferrer" href="'+originalUrl+'">View the original company photo post in a separate tab</a></details>'+
    '</div></article>';
}

export function instagramProjectMedia(key,heading,description){
  const post=posts[key];
  if(!post)throw new Error('Unknown original project post');
  const url=linkFor(post);
  if(key==='crystalPhotos')return realPhotoGallery(heading,description,url);
  const filename=key==='casings'?'window-casing-workbench':'crystal-creek-shower-construction';
  return '<article class="real-media-card"><div class="real-media-card-copy">'+
    '<span class="kicker">ORIGINAL PBC WORK FOOTAGE</span><h3>'+esc(heading)+'</h3>'+
    '<p>'+esc(description)+'</p>'+
    '<figure id="pbc-project-reel-'+key+'" class="real-project-figure"><video class="real-project-video" data-project-video="'+key+'" controls playsinline preload="none"'+
    ' poster="/site-assets/real-projects/'+filename+'-poster.webp" width="720" height="1280"'+
    ' aria-label="'+esc(post.label)+'">'+
    '<source media="(max-width: 650px)" src="/site-assets/real-projects/'+filename+'-480.mp4" type="video/mp4">'+
    '<source src="/site-assets/real-projects/'+filename+'-720.mp4" type="video/mp4">'+
    'Your browser cannot play the video. The project story and photographs are available on this page.</video>'+
    '<figcaption>Real Prescott’s Best Construction footage. This on-site version plays without the Instagram soundtrack. Press play to watch here, without opening another app.</figcaption></figure>'+
    '<details class="real-media-source"><summary>Original Instagram source (optional)</summary>'+
    '<a class="real-media-original" href="'+url+'" rel="noopener noreferrer" target="_blank">Open original company reel in a separate tab</a></details>'+
    '</div></article>';
}

export function windowCasingCaseStudyPage(link){
  return {
    title:'Precision Window Casing & Finish Carpentry | Prescott’s Best Construction',
    description:'Watch real shop footage of measured, preassembled window casing and joinery work by Prescott’s Best Construction serving the Prescott Valley area.',
    kind:'blog',headline:'Precision Window Casing and Finish Carpentry — Prescott’s Best Construction',
    published:'2026-11-18',modified:'2026-11-18',
    body:
      '<header class="site-pagehead new-pagehead"><span class="kicker">REAL CRAFTSMANSHIP · FINISH CARPENTRY</span>'+
      '<h1>Precision starts before the trim reaches the wall.</h1>'+
      '<p class="lede">Measured, cut and preassembled window casing is one example of the hands-on preparation behind a clean finished interior.</p></header>'+
      '<article class="site-section site-article new-article">'+
      '<h2>Plan the fit before the install.</h2>'+
      '<p>Good finish carpentry is about more than a piece of trim that looks right from across the room. Window and door casings bring together measurements, repeatable cuts, carefully joined corners, material preparation and consistency with the surrounding walls.</p>'+
      '<p>In this original workshop reel, Andrew lays out and prepares casing components before they are installed. You can see pieces measured and assembled ahead of time rather than treating every joint as an improvisation at the wall. The goal is a coordinated assembly with consistent reveals and neatly aligned transitions.</p>'+
      '<h2>See the actual preparation.</h2>'+
      '<p>These are real process shots shared by the company—not AI-generated design concepts or stock photography. The clip documents preparation and assembly; the exact installation method, wood species and finishes depend on the job.</p>'+
      '<div class="real-proof-grid">'+instagramProjectMedia('casings','Preassembled casing and joined corners','See how trim parts are laid out, cut and joined on the work surface ahead of installation.')+'</div>'+
      '<h2>Why it matters in your home.</h2>'+
      '<p>Thoughtful preparation can help control fit, appearance and handling during installation. On an existing house, wall conditions and openings still need to be checked on site, and no two rooms are exactly alike.</p>'+
      '<p>If you are planning window casings, interior doors, trim, built-ins or a larger finish-carpentry project, talk with us about the look and the practical details you want.</p>'+
      '<p><a href="'+link('/finish-carpentry')+'">Explore our finish carpentry service</a> or <a href="'+link('/projects')+'">see more original project stories</a>.</p>'+
      '</article>'+
      '<section class="site-cta"><h2>Bring the same care to your space.</h2>'+
      '<p>Tell us which openings or rooms need attention, and we can discuss measurements, materials and next steps.</p>'+
      '<div class="site-actions"><a class="site-button primary" href="'+link('/schedule')+'">Talk with Andrew about trim work</a>'+
      '<a class="site-button outline" href="tel:+19283500940">Call (928) 350-0940</a></div></section>'
  };
}
