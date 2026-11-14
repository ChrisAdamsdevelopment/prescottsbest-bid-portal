// Generated, approved concept media. None of these images shows documented completed construction.
export const conceptMedia=Object.freeze({
  "access-shower-wide": {
    "alt": "Wide concept view of a bright bathroom with a walk-in shower, glass enclosure, bench and warm stone tile.",
    "caption": "A welcoming shower with room to move, a bench and easy-to-reach fixtures.",
    "kind": "design",
    "source": "samebathroomfromfartheraway.png",
    "ratio": 1.77683,
    "width1440": 1440,
    "height1440": 810,
    "width760": 760,
    "height760": 428
  },
  "access-shower-close": {
    "alt": "Close concept view of a glass walk-in shower with built-in bench, handheld shower and warm neutral tile.",
    "caption": "Walk-in shower layout with bench, handheld fixture and low-entry concept.",
    "kind": "design",
    "source": "bathroomshortview.png",
    "ratio": 1.77683,
    "width1440": 1440,
    "height1440": 810,
    "width760": 760,
    "height760": 428
  },
  "access-kitchen": {
    "alt": "Warm wood kitchen concept with a spacious island, seated work area, and broad circulation path.",
    "caption": "A comfortable kitchen layout with open floor space and useful work surfaces.",
    "kind": "design",
    "source": "kitchenfornewaccesabilitypages.png",
    "ratio": 1.77683,
    "width1440": 1440,
    "height1440": 810,
    "width760": 760,
    "height760": 428
  },
  "access-entry": {
    "alt": "Residential entry design concept with a wide level walkway, handrails and welcoming double doors.",
    "caption": "The way into a home matters, too: clear paths, good lighting and practical railings.",
    "kind": "design",
    "source": "largebackentryway.png",
    "ratio": 1.77683,
    "width1440": 1440,
    "height1440": 810,
    "width760": 760,
    "height760": 428
  },
  "builtins-living": {
    "alt": "Living room concept featuring built-in wood shelves beside a fireplace, ceiling trim and natural light.",
    "caption": "Built-ins and trim designed to feel like they have always belonged in the room.",
    "kind": "design",
    "source": "roomwithfireplace.png",
    "ratio": 1.77683,
    "width1440": 1440,
    "height1440": 810,
    "width760": 760,
    "height760": 428
  },
  "conversion-guest": {
    "alt": "Concept of a comfortable guest suite with a work area, storage cabinetry and warm sunlight.",
    "caption": "An example of how a finished room can accommodate guests and everyday work.",
    "kind": "design",
    "source": "bedroomwithfan.png",
    "ratio": 1.77683,
    "width1440": 1440,
    "height1440": 810,
    "width760": 760,
    "height760": 428
  },
  "shower-blocking": {
    "alt": "Educational concept illustration of an unfinished shower wall, timber blocking between studs and rough plumbing.",
    "caption": "What is behind the tile matters: framing and backing locations are planned before finishes.",
    "kind": "educational",
    "source": "insideofshower.png",
    "ratio": 1.33333,
    "width1440": 1440,
    "height1440": 1080,
    "width760": 760,
    "height760": 570
  },
  "shower-cutaway": {
    "alt": "Educational illustration showing layers of a shower wall and floor, membrane, drain and finished tile.",
    "caption": "A cutaway concept of the waterproofing and drain areas hidden below the finished surfaces.",
    "kind": "educational",
    "source": "insideshowerwall.png",
    "ratio": 1.33333,
    "width1440": 1440,
    "height1440": 1080,
    "width760": 760,
    "height760": 570
  },
  "cabinet-hardware": {
    "alt": "Close concept view of cabinet dovetail drawers, pull-out storage shelves and metal drawer hardware.",
    "caption": "Hardware, drawer construction and storage details make cabinets easier to live with.",
    "kind": "design",
    "source": "cabinets.png",
    "ratio": 1.33333,
    "width1440": 1440,
    "height1440": 1080,
    "width760": 760,
    "height760": 570
  }
});
const base='/site-assets/remodeling-concepts/';
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function conceptMediaFigure(slug,{hero=false,extraClass=''}={}){
 const m=conceptMedia[slug];if(!m)throw new Error('Unknown approved concept slug '+slug);
 const source=base+slug+'-1440.webp',small=base+slug+'-760.webp';
 const label=m.kind==='educational'?'Educational illustration':'Design concept';
 return '<figure class="new-concept '+esc(extraClass)+'">'+
  '<img src="'+source+'" srcset="'+small+' 760w, '+source+' 1440w" sizes="'+(hero?'(max-width:800px) 100vw, 56vw':'(max-width:800px) 100vw, 46vw')+'"'+
  ' width="'+m.width1440+'" height="'+m.height1440+'" loading="'+(hero?'eager':'lazy')+'" decoding="async"'+(hero?' fetchpriority="high"':'')+
  ' alt="'+esc(m.alt)+'">'+
  '<figcaption><span class="concept-kind">'+label+'</span> '+esc(m.caption)+'</figcaption></figure>';
}
const servicePlacement=Object.freeze({
 '/bathroom-remodeling':['access-shower-close','shower-cutaway'],
 '/kitchen-remodeling':['access-kitchen','cabinet-hardware'],
 '/shower-conversions':['access-shower-close','shower-blocking'],
 '/room-conversions':['conversion-guest'],
 '/finish-carpentry':['builtins-living'],
 '/custom-cabinetry':['builtins-living','cabinet-hardware']
});
export function conceptSectionForService(path){
 const chosen=servicePlacement[path];
 if(!chosen)return '';
 return '<section class="site-section concept-feature-section"><div class="section-heading"><span class="kicker">SEE THE POSSIBILITIES</span>'+
  '<h2>Picture what could work in your home</h2><p>These examples are design concepts to help compare layouts, finishes and details—not photos of completed jobs.</p></div>'+
  '<div class="concept-feature-grid">'+chosen.map(s=>conceptMediaFigure(s)).join('')+'</div></section>';
}
export function conceptImageObjectsForPage(path,origin='https://prescottsbestconstruction.com'){
 const featured={
 '/accessible-aging-in-place-remodeling':['access-shower-wide','access-shower-close','access-kitchen','access-entry','shower-blocking','shower-cutaway'],
 ...servicePlacement
 }[path]||[];
 return featured.map(slug=>{
  const m=conceptMedia[slug];
  return {'@type':'ImageObject',contentUrl:origin+base+slug+'-1440.webp',name:m.caption,description:m.alt,
          caption:(m.kind==='educational'?'Educational illustration: ':'Design concept: ')+m.caption,
          width:m.width1440,height:m.height1440};
 });
}
export const approvedConceptAssetPaths=Object.keys(conceptMedia).flatMap(s=>[base+s+'-1440.webp',base+s+'-760.webp']);
