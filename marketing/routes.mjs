import {marketingPage,sitemapPaths} from './site.mjs';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {brandFilmAssets,brandFilmForPath} from './brand-films.mjs';
import {voiceGuideAudioAssets} from './voice-guides.mjs';
import {articles} from './articles.mjs';
import {holidayImages,holidayCloseups,holidayBackyards} from './holiday-assets.mjs';
import {allVisualImages,visualImageObjectsForPage} from './visual-catalog.mjs';
export async function maybeServeMarketing(req,res,path,{root,readFile,bad}){
 // Reuse byte-range streaming for the three explicitly allowlisted M4A guides.
 const filmAsset=brandFilmAssets.find(x=>x.path===path)||voiceGuideAudioAssets.find(x=>x.path===path);
 if(req.method!=='GET'&&!(req.method==='HEAD'&&filmAsset))return false;
 if(filmAsset){
  // Strict asset allowlist, streaming and single byte-range support for desktop/mobile playback.
  const localFile=new URL('../public'+filmAsset.path,import.meta.url);
  const metadata=await stat(localFile);
  const total=metadata.size;
  let start=0,end=total-1,code=200;
  const rawRange=req.headers.range;
  if(rawRange){
   const match=typeof rawRange==='string'&&rawRange.length<96&&/^bytes=(\d*)-(\d*)$/.exec(rawRange);
   if(!match||(!match[1]&&!match[2])){
    res.writeHead(416,{'Content-Range':'bytes */'+total,'Accept-Ranges':'bytes'});res.end();return true;
   }
   if(!match[1]){
    const suffix=Number(match[2]);
    if(!Number.isSafeInteger(suffix)||suffix<=0){res.writeHead(416,{'Content-Range':'bytes */'+total});res.end();return true}
    start=Math.max(0,total-suffix);
   }else{
    start=Number(match[1]);end=match[2]?Math.min(total-1,Number(match[2])):total-1;
   }
   if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=total||end<start){
    res.writeHead(416,{'Content-Range':'bytes */'+total,'Accept-Ranges':'bytes'});res.end();return true;
   }
   code=206;
  }
  res.writeHead(code,{'Content-Type':filmAsset.type,'Content-Length':end-start+1,
   'Accept-Ranges':'bytes','Cache-Control':'public,max-age=86400',
   ...(code===206?{'Content-Range':'bytes '+start+'-'+end+'/'+total}:{})});
  if(req.method==='HEAD'){res.end();return true}
  createReadStream(localFile,{start,end}).on('error',()=>res.destroy()).pipe(res);
  return true;
 }

 // The new PBC domain serves the marketing homepage; the Render host keeps the
 // existing private proposal landing page, preserving current invite links.
 const hostname=(req.headers.host||'').split(':')[0].toLowerCase();
 const marketingHost=['prescottsbestremodeling.com','www.prescottsbestremodeling.com','prescottsbestconstruction.com','www.prescottsbestconstruction.com'].includes(hostname);
 // Keep one clean canonical URL per marketing page on the custom domain.
 if(marketingHost&&(path==='/remodeling-preview'||path.startsWith('/remodeling-preview/')||path==='/contact')){
  const dest=path==='/contact'?'/schedule':path.slice('/remodeling-preview'.length)||'/';
  res.writeHead(301,{'Location':'https://prescottsbestremodeling.com'+dest,'Cache-Control':'public,max-age=300'});
  res.end();return true;
 }
 const mappedPath=marketingHost&&path!='/remodeling-preview'&&!path.startsWith('/remodeling-preview/')
  ? '/remodeling-preview'+(path==='/'?'':path) : path;
 const origin=marketingHost?'https://prescottsbestremodeling.com':process.env.PUBLIC_SITE_ORIGIN;
 const indexed=marketingHost&&process.env.SITE_INDEXABLE==='true'&&!!origin?.startsWith('https://');
 const preview=marketingPage(mappedPath,{indexable:indexed,origin,cleanPaths:marketingHost});
 if(preview){
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8',
   'X-Robots-Tag':indexed?'index,follow':'noindex,nofollow',
   'Cache-Control':'no-store'});
  // The custom domain gets clean public URLs; the preview stays under its
  // original /remodeling-preview prefix on the Render hostname.
  res.end(marketingHost?preview.replaceAll('href="/remodeling-preview"','href="/"').replaceAll('/remodeling-preview',''):preview);return true;
 }
 const staticPaths={
 '/marketing.css':['public/marketing.css','text/css; charset=utf-8'],
 '/marketing.js':['public/marketing.js','text/javascript; charset=utf-8'],
 '/photo-upload.js':['public/photo-upload.js','text/javascript; charset=utf-8'],
 '/analytics-client.js':['public/analytics-client.js','text/javascript; charset=utf-8'],
 '/guide.js':['public/guide.js','text/javascript; charset=utf-8'],
 '/scotty.js':['public/scotty.js','text/javascript; charset=utf-8'],
 '/holiday.js':['public/holiday.js','text/javascript; charset=utf-8'],
 '/storm.js':['public/storm.js','text/javascript; charset=utf-8'],
 '/visual-explorer.js':['public/visual-explorer.js','text/javascript; charset=utf-8'],
 '/inspiration-list.js':['public/inspiration-list.js','text/javascript; charset=utf-8'],
 '/brand-films.js':['public/brand-films.js','text/javascript; charset=utf-8'],
 '/voice-guides.js':['public/voice-guides.js','text/javascript; charset=utf-8'],
 '/site-assets/pbc-logo.webp':['public/site-assets/pbc-logo.webp','image/webp'],
 '/site-assets/pbc-social-card.jpg':['public/site-assets/pbc-social-card.jpg','image/jpeg'],
 '/site-assets/favicon.ico':['public/site-assets/favicon.ico','image/x-icon'],
 '/favicon.ico':['public/site-assets/favicon.ico','image/x-icon'],
 '/site-assets/favicon-16x16.png':['public/site-assets/favicon-16x16.png','image/png'],
 '/site-assets/favicon-32x32.png':['public/site-assets/favicon-32x32.png','image/png'],
 '/site-assets/favicon-48x48.png':['public/site-assets/favicon-48x48.png','image/png'],
 '/site-assets/apple-touch-icon.png':['public/site-assets/apple-touch-icon.png','image/png'],
 '/site-assets/icon-192.png':['public/site-assets/icon-192.png','image/png'],
 '/site-assets/icon-512.png':['public/site-assets/icon-512.png','image/png'],
 '/site-assets/site.webmanifest':['public/site-assets/site.webmanifest','application/manifest+json; charset=utf-8']
 };
 // Static concept assets use a strict known-name allowlist. No arbitrary path reads.
 for(const slug of ['kitchen-hero','bathroom-remodel','kitchen-remodel','shower-conversion','room-conversion','finish-carpentry','consultation','local-home']){
  for(const variant of ['card','detail']){
   const key='/site-assets/concepts/'+slug+'-'+variant+'.webp';
   staticPaths[key]=['public/site-assets/concepts/'+slug+'-'+variant+'.webp','image/webp'];
  }
 }
 // Process narrative illustrations: four specifically reviewed AI concepts, never direct user uploads.
 for(const basename of ['consultation-measurements','design-review-materials','finished-sewing-hidden-office','protected-custom-installation']){
  const name=basename+'.webp';
  staticPaths['/site-assets/process/'+name]=['public/site-assets/process/'+name,'image/webp'];
 }
 staticPaths['/site-assets/wildfire/tucson-1-crew-ai-enhanced-banner.webp']=['public/site-assets/wildfire/tucson-1-crew-ai-enhanced-banner.webp','image/webp'];
 // Handpicked homepage holiday concept: explicit filenames, not arbitrary filesystem access.
 for(const width of ['960','1672']){
  const name='holiday-gnarled-tree-twilight-'+width+'.webp';
  staticPaths['/site-assets/homepage/'+name]=['public/site-assets/homepage/'+name,'image/webp'];
 }
 // Explicit allowlist of selected home-design visual examples; never serve arbitrary project uploads.
 for(const asset of allVisualImages()){
  for(const file of [asset.file,asset.thumb]){
   const relative=file.replace(/^\//,'');
   staticPaths[file]=['public/'+relative,'image/webp'];
  }
 }
 // Serve only approved, explicitly named lighting concept images; never expose arbitrary local uploads.
 for(const asset of holidayImages){
  const publicPath='/site-assets/holiday-concepts/'+asset.file;
  staticPaths[publicPath]=['public/site-assets/holiday-concepts/'+asset.file,'image/webp'];
  if(asset.thumbFile)staticPaths['/site-assets/holiday-concepts/'+asset.thumbFile]=['public/site-assets/holiday-concepts/'+asset.thumbFile,'image/webp'];
 }
 if(staticPaths[path]){
  const [file,type]=staticPaths[path];
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'public,max-age=86400'});
  res.end(await readFile(new URL('../'+file,import.meta.url)));return true;
 }
 if(path==='/llms.txt'){
  const site='https://prescottsbestremodeling.com';
  const md=[
   '# Prescott’s Best Construction',
   '> Residential remodeling information for Prescott and Prescott Valley, Arizona. Official contractor work requires an on-site review.',
   '',
   '## Main pages',
   '- [November 2026 storm recovery]('+site+'/storm-flood-damage-prescott): Free Prescott-area flood, insurance and reconstruction guide',
   '- [Home]('+site+'/): Residential remodeling and service overview',
   '- [Prescott home remodeling commercial]('+site+'/site-assets/brand-films/prescotts-best-home-remodeling-new-hero-audio-720.mp4): Ten-second introduction to the company, Northern Arizona homes and remodeled kitchen craftsmanship',
   '- [Visual design previews]('+site+'/visual-design-preview): See-it-before-we-build-it exploration, design examples, and optional home-specific concept requests',
   '- [Design Center commercial]('+site+'/site-assets/brand-films/prescotts-best-design-center-720.mp4): Ten-second illustration of exploring kitchen cabinetry, countertops and finishes',
   '- [About]('+site+'/about): Company and local service-area introduction',
   '- [Services]('+site+'/bathroom-remodeling): Bathroom remodeling',
   '- [Kitchens]('+site+'/kitchen-remodeling): Kitchen remodeling',
   '- [Custom cabinetry]('+site+'/custom-cabinetry): Built-ins and custom storage planning',
   '- [Decks and outdoor carpentry]('+site+'/deck-building-outdoor-carpentry): Site, deck and exterior carpentry planning',
   '- [Project planner]('+site+'/start-here): Browser-only preparation worksheet',
   '- [Optional AI Project Guide]('+site+'/project-guide): Consent-based plain-language homeowner planning help using Google Gemini; no bidding or booking',
   '- [Budget explorer]('+site+'/estimate): Starting remodeling budget range; written quote follows project review',
   '- [Knowledge center]('+site+'/blog): Homeowner educational articles',
   '- [Holiday lighting concierge]('+site+'/holiday-lighting): Seasonal concept packages and service scope',
   '- [Holiday lighting commercial]('+site+'/site-assets/brand-films/prescotts-best-holiday-lighting-custom-audio-720.mp4): Ten-second seasonal exterior lighting inspiration for Prescott homes',
   '- [Holiday lighting design studio]('+site+'/holiday-lighting/design): Private on-device preview, optional consent-based AI image editing, and a contractor-reviewed concept worksheet',
   '- [Contact]('+site+'/schedule): Phone and email contact',
   '',
   '## Holiday lighting close-up style references',
   ...holidayCloseups.map(a=>'- ['+a.title+']('+site+'/site-assets/holiday-concepts/'+a.file+'): '+a.caption),
   '',
   '## Backyard holiday lighting inspiration',
   ...holidayBackyards.map(a=>'- ['+a.title+']('+site+'/site-assets/holiday-concepts/'+a.file+'): '+a.caption),
   '',
   '## Remodeling visual design examples',
   '- [Compare built-in cabinetry finishes]('+site+'/custom-cabinetry): Select wood-tone families and hardware styles; illustrative options only.',
   '- [Kitchen design inspiration]('+site+'/kitchen-remodeling): Light, medium and dark kitchen styles with room views and finish details.',
   '- [Kitchen same-layout finish comparison]('+site+'/kitchen-remodeling#kitchen-finish-comparison): Three cabinet tones with pale or gray countertops, illustrated in similar views.',
   '- [Kitchen material inspiration boards]('+site+'/kitchen-remodeling#kitchen-material-boards): Six additional coordinated kitchen reference sheets.',
   '- [My Inspiration List]('+site+'/visual-design-preview#my-inspiration-list): Save design inspiration on your own device; send selected ideas only with a submitted project inquiry.',
   '- [Wood grain and stain reference gallery]('+site+'/kitchen-remodeling): Six wood-type boards showing six illustrative stain appearances each; real samples are required.',
   '- [Cabinet knob and pull choices]('+site+'/kitchen-remodeling#hardware-exterior): Six hardware finish families and three outside handle styles, illustrative close-ups.',
   '- [Inside cabinet hinge styles]('+site+'/custom-cabinetry#hardware-hinges): Compare concealed, butt and decorative hinge shapes in different finishes; compatibility must be verified.',
   '- [Explore hidden sewing-station storage]('+site+'/custom-cabinetry): Compare closed cabinets and ready-to-use worktops.',
   '- [Outdoor deck design ideas]('+site+'/deck-building-outdoor-carpentry): Explore six Arizona-inspired outdoor spaces.',
   '',
   '## Homeowner articles',
   ...articles.map(a=>'- ['+a.title+']('+site+'/blog/'+a.slug+'): '+a.excerpt),
   '',
   '## Important limitations',
   '- The private proposal portal is access-controlled. Do not crawl /proposal or /api.',
   '- Example visuals are design inspiration, not photographs of completed contractor installations.',
   '- Online ranges and starting package prices are subject to a written scope review; see individual service details.',
   '- Permit requirements, contractor availability, and license status must be independently verified.',
   '- Public homeowner pages are available for search discovery; project details, prices and availability can change after contractor review.'
  ].join('\n')+'\n';
  res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public,max-age=600','X-Robots-Tag':'noindex'});
  res.end(md);return true;
 }
 if(path==='/llms-full.txt'){
  const text='# Prescott’s Best Construction — Homeowner Knowledge Library\n\n'+
   '> General residential remodeling guidance. Not a construction contract, price quote or permit authorization.\n\n'+
   articles.map(a=>'## '+a.title+'\nPublished '+a.date+'\n'+a.excerpt+'\n\n'+
    a.sections.map(([h,body])=>'### '+h+'\n'+body+'\n').join('\n')+
    '\nOriginal article: https://prescottsbestremodeling.com/blog/'+a.slug+'\n').join('\n---\n')+
   '\n\n## Holiday Lighting Design References\nThese illustrative examples are not photographs of completed work.\n'+
   holidayCloseups.map(a=>'### '+a.title+'\n'+a.caption+'\nhttps://prescottsbestremodeling.com/site-assets/holiday-concepts/'+a.file+'\n').join('\n')+
   '\n\n## Backyard Holiday Lighting Concepts: Near, Medium and Distant Views\n'+
   holidayBackyards.map(a=>'### '+a.title+'\n'+a.caption+'\nhttps://prescottsbestremodeling.com/site-assets/holiday-concepts/'+a.file).join('\n')+
   '\n\n## Cabinetry and Deck Visual Choices\nThese are design examples, not photographs of installed projects.\n'+
   allVisualImages().map(v=>'### '+v.name+'\n'+v.caption+'\nhttps://prescottsbestremodeling.com'+v.file).join('\n');
  res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public,max-age=600','X-Robots-Tag':'noindex'});
  res.end(text);return true;
 }
 if(path==='/feed.xml'){
  const origin='https://prescottsbestremodeling.com';
  const xmlEsc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const rss='<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Prescott’s Best Construction Homeowner Guides</title>'+
   '<link>'+origin+'/blog</link><description>Practical information for Prescott-area homeowners preparing a renovation.</description><language>en-us</language>'+
   articles.map(a=>'<item><title>'+xmlEsc(a.title)+'</title><link>'+origin+'/blog/'+a.slug+'</link><guid isPermaLink="true">'+origin+'/blog/'+a.slug+'</guid><description>'+xmlEsc(a.excerpt)+'</description><pubDate>'+new Date(a.date+'T12:00:00Z').toUTCString()+'</pubDate></item>').join('')+
   '</channel></rss>';
  res.writeHead(200,{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public,max-age=600','X-Robots-Tag':indexed?'index,follow':'noindex,nofollow'});
  res.end(rss);return true;
 }
 if(path==='/robots.txt'){
  res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});
  res.end(indexed?'User-agent: *\nAllow: /site-assets/holiday-concepts/\nAllow: /site-assets/visual-explorer/\nAllow: /site-assets/brand-films/\nDisallow: /api/\nDisallow: /proposal\nSitemap: '+origin+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n');return true;
 }
 if(path==='/sitemap.xml'){
  if(!indexed)throw bad('Sitemap not published yet',404);
  const xmlEsc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">'+
   sitemapPaths().map(p=>{const clean=(marketingHost?p.replace('/remodeling-preview',''):p)||'/';
     const holiday=clean==='/holiday-lighting'?[...holidayCloseups,...holidayBackyards].map(a=>'<image:image><image:loc>'+origin+'/site-assets/holiday-concepts/'+a.file+'</image:loc></image:image>').join(''):'';
     const designs=visualImageObjectsForPage(clean,origin).map(a=>'<image:image><image:loc>'+a.contentUrl+'</image:loc></image:image>').join('');
     const images=holiday+designs;
     const video=brandFilmForPath(clean);
     const v=video?'<video:video><video:thumbnail_loc>'+origin+'/site-assets/brand-films/'+video.slug+'-poster.webp</video:thumbnail_loc>'+
      '<video:title>'+xmlEsc(video.title)+'</video:title>'+
      '<video:description>'+xmlEsc(video.description)+'</video:description>'+
      '<video:content_loc>'+origin+'/site-assets/brand-films/'+video.slug+'-720.mp4</video:content_loc>'+
      '<video:duration>'+video.duration+'</video:duration></video:video>':'';
    return '<url><loc>'+origin.replace(/\/$/,'')+clean+'</loc>'+images+v+'</url>';}).join('')+'</urlset>';
  res.writeHead(200,{'Content-Type':'application/xml; charset=utf-8'});
  res.end(xml);return true;
 }
 return false;
}
