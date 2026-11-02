// Each visual is AI-generated design inspiration; none is evidence of contractor work.
// Provenance: D:/PrescottsBestConstruction/ASSETS/APPROVED_WEBSITE_IMAGES/CONCEPT_IMAGE_PROVENANCE_2026-11-02.json
const base='/site-assets/concepts/';
const scenes={
 '/bathroom-remodeling':{slug:'bathroom-remodel',alt:'Concept rendering of a remodeled bathroom with pale vanity, framed mirror and glass walk-in shower'},
 '/kitchen-remodeling':{slug:'kitchen-remodel',alt:'Concept rendering of a warm white kitchen with stone island and Northern Arizona landscape visible through window'},
 '/shower-conversions':{slug:'shower-conversion',alt:'Concept rendering of a glass enclosed shower with warm stone-look tile and handheld fixture'},
 '/room-conversions':{slug:'room-conversion',alt:'Concept rendering of a converted garage used as a comfortable office and hobby workspace'},
 '/finish-carpentry':{slug:'finish-carpentry',alt:'Concept detail showing clean white-painted door casing, baseboard and warm wooden flooring'}
};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;');
export function conceptCardImage(path){
 const scene=scenes[path];if(!scene)return '';
 const src=base+scene.slug+'-card.webp';
 return '<div class="concept-card-media"><img loading="lazy" decoding="async" src="'+src+'" width="680" height="510" alt="'+esc(scene.alt)+'"><span class="concept-badge">Design inspiration</span></div>';
}
export function conceptServiceImage(path){
 const scene=scenes[path];if(!scene)return '';
 const detail=base+scene.slug+'-detail.webp',small=base+scene.slug+'-card.webp';
 return '<figure class="service-concept"><img loading="eager" decoding="async" src="'+detail+'" srcset="'+small+' 680w, '+detail+' 1440w" sizes="(max-width: 850px) 100vw, 48vw" width="1440" height="1080" alt="'+esc(scene.alt)+'"><figcaption>Design inspiration · AI-generated concept, not a completed Prescott’s Best project</figcaption></figure>';
}
export function conceptHero(){
 return '<figure class="hero-visual"><img src="'+base+'kitchen-hero-detail.webp" srcset="'+base+'kitchen-hero-card.webp 680w, '+base+'kitchen-hero-detail.webp 1440w" sizes="100vw" width="1440" height="810" fetchpriority="high" decoding="async" alt="Design inspiration: light remodeled kitchen with white cabinets, wood island, natural daylight and distant mountain views"><figcaption>Design inspiration · AI-generated concept</figcaption></figure>';
}
export const conceptPaths=Object.freeze(Object.keys(scenes));
