// Three approved, optimized brand films. The originals remain private in the D: inbox.
// Each film is a design/commercial illustration, not documentation of a completed job.
const base='/site-assets/brand-films/';
export const brandFilmData=Object.freeze({
 home:{
  slug:'prescotts-best-home-remodeling',path:'/',
  title:'Prescott’s Best Construction — Your Vision, Beautifully Built',
  description:'Ten-second brand film showing a Northern Arizona style residence, a warm wood kitchen remodel concept, custom cabinetry details, and the Prescott’s Best Construction logo.',
  posterAlt:'Prescott-style residence and warm remodeling inspiration featuring Northern Arizona scenery.',
  accessibleSummary:'The commercial opens on a Prescott-style home with natural landscaping, moves through a kitchen with custom wood cabinets and stone countertops, highlights finish carpentry, and ends with the Prescott’s Best Construction brand mark and “Your Vision. Beautifully Built.”',
  caption:'A home, a beautiful kitchen, and thoughtful finish details.',
  width:1280,height:720,duration:10,
 },
 holiday:{
  slug:'prescotts-best-holiday-lighting',path:'/holiday-lighting',
  title:'Custom Holiday Lighting in Prescott — Prescott’s Best Construction',
  description:'Ten-second seasonal lighting commercial showing a Northern Arizona home at dusk illuminated with warm roofline and entryway lights, an inviting patio, and the Prescott’s Best Construction brand mark.',
  posterAlt:'Prescott-style home at twilight with warm white holiday lights along its roofline and entryway.',
  accessibleSummary:'A Prescott-area inspired house at twilight transforms as warm holiday roofline, doorway, and landscaping lights turn on. A warmly lit patio appears before the final branded “Custom Holiday Lighting” message.',
  caption:'Roofline, entryway, patio and landscaping holiday-lighting inspiration.',
  width:1280,height:720,duration:10,
 },
 design:{
  slug:'prescotts-best-design-center',path:'/visual-design-preview',
  title:'See It Before We Build It — Prescott’s Best Design Center',
  description:'Ten-second visual remodeling design commercial showing a homeowner reviewing kitchen finishes on a tablet, a warm wood cabinetry and countertop transformation, and a finished kitchen inspiration scene.',
  posterAlt:'Warm kitchen with wood cabinetry, pale stone island and a tablet showing material and finish selections.',
  accessibleSummary:'A homeowner views finishes on a tablet in a kitchen. Cabinetry and countertops change to demonstrate options; the video ends on a coordinated wood kitchen design with the Prescott’s Best Construction logo and “See It Before We Build It.”',
  caption:'Choose cabinet, countertop and hardware ideas before you start a remodeling conversation.',
  width:1280,height:720,duration:10,
 }
});
export const brandFilmForPath=path=>Object.values(brandFilmData).find(f=>f.path===path)||null;
export const brandFilmAssets=Object.freeze(Object.values(brandFilmData).flatMap(f=>[
 {path:base+f.slug+'-720.mp4',name:f.slug+'-720.mp4',type:'video/mp4'},
 {path:base+f.slug+'-480.mp4',name:f.slug+'-480.mp4',type:'video/mp4'},
 {path:base+f.slug+'-poster.webp',name:f.slug+'-poster.webp',type:'image/webp'}
]));
const enc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function brandFilm(id,options={}){
 const film=brandFilmData[id];if(!film)throw new Error('Unknown film: '+id);
 const captionId='brand-film-description-'+id;
 const poster=base+film.slug+'-poster.webp';
 const mode=options.hero?' hero-visual brand-film-hero':'';
 const priority=options.hero?' loading="eager" fetchpriority="high"':' loading="lazy"';
 return '<figure class="brand-film'+mode+'" data-brand-film="'+id+'" aria-label="'+enc(film.title)+'">'+
  '<img class="brand-film-poster" src="'+poster+'" width="1280" height="720"'+priority+
   ' decoding="async" alt="'+enc(film.posterAlt)+'">'+
  '<video class="brand-film-video" data-brand-video controls muted playsinline loop preload="none" poster="'+poster+'"'+
  ' aria-label="'+enc(film.title)+'" aria-describedby="'+captionId+'">'+
  '<source src="'+base+film.slug+'-480.mp4" media="(max-width: 700px)" type="video/mp4">'+
  '<source src="'+base+film.slug+'-720.mp4" type="video/mp4">'+
  '<p>Your browser cannot play this video. <a href="'+base+film.slug+'-720.mp4">View the commercial directly</a>.</p>'+
  '</video>'+
  '<div class="brand-film-controls" data-film-controls hidden>'+
  '<button type="button" data-film-toggle aria-label="Play '+enc(film.title)+'" aria-pressed="false">Play video</button>'+
  '<button type="button" data-film-sound aria-label="Turn on sound for '+enc(film.title)+'" aria-pressed="false">Sound on</button>'+
  '</div>'+
  '<figcaption id="'+captionId+'" class="brand-film-description">'+enc(film.accessibleSummary)+'</figcaption>'+
  '</figure>';
}
export function brandFilmJsonLd(path,origin='https://prescottsbestremodeling.com'){
 const film=brandFilmForPath(path);
 if(!film)return null;
 const root=origin.replace(/\/$/,'');
 return {
  '@context':'https://schema.org','@type':'VideoObject',
  '@id':root+film.path+'#brand-film',name:film.title,description:film.description,
  uploadDate:'2026-11-08',duration:'PT10S',isFamilyFriendly:true,inLanguage:'en-US',
  thumbnailUrl:[root+base+film.slug+'-poster.webp'],
  contentUrl:root+base+film.slug+'-720.mp4',
  url:root+(film.path==='/'?'/':film.path),
  publisher:{'@type':'Organization',name:'Prescott’s Best Construction',url:root+'/'}
 };
}
