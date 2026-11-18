// Source-led real project content. The media stays on Prescott's Best Construction's
// original public Instagram account; no customer photographs are copied into this app.
// An embed is instantiated only after the visitor chooses to load it.
const posts = Object.freeze({
  casings: Object.freeze({kind:'reel',id:'C1VllESr9tH',label:'Window casing craftsmanship reel'}),
  crystalPhotos: Object.freeze({kind:'p',id:'DV162KsgUxP',label:'Crystal Creek bathroom project photographs'}),
  crystalProgress: Object.freeze({kind:'reel',id:'DVR_JdVAWff',label:'Crystal Creek bathroom construction reel'})
});
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const linkFor = ({kind,id}) => 'https://www.instagram.com/'+kind+'/'+id+'/';

export function instagramProjectMedia(key,heading,description){
  const post=posts[key];
  if(!post)throw new Error('Unknown original project post');
  const url=linkFor(post);
  return '<article class="real-media-card"><div class="real-media-card-copy">'+
    '<span class="kicker">ORIGINAL PROJECT MEDIA · INSTAGRAM</span><h3>'+esc(heading)+'</h3>'+
    '<p>'+esc(description)+'</p>'+
    '<button class="site-button outline instagram-embed-load" type="button" data-instagram-post="'+esc(key)+'" aria-expanded="false">View original post here</button>'+
    '<p class="micro">The video or photographs load from Instagram only after you choose to open them. Instagram may set cookies.</p>'+
    '<div class="instagram-embed-target" data-instagram-target="'+esc(key)+'" aria-live="polite"></div>'+
    '<a class="real-media-original" href="'+url+'" rel="noopener noreferrer" target="_blank">Open original post on Instagram</a>'+
    '</div></article>';
}

export function windowCasingCaseStudyPage(link){
  return {
    title:'Precision Window Casing & Finish Carpentry | Prescott’s Best Construction',
    description:'Watch real shop footage of measured, preassembled window casing and joinery work by Prescott’s Best Construction serving the Prescott Valley area.',
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
