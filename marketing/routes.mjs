import {marketingPage,sitemapPaths} from './site.mjs';
import {articles} from './articles.mjs';
import {holidayImages} from './holiday-assets.mjs';
export async function maybeServeMarketing(req,res,path,{root,readFile,bad}){
 if(req.method!=='GET')return false;
 // The new PBC domain serves the marketing homepage; the Render host keeps the
 // existing private proposal landing page, preserving current invite links.
 const hostname=(req.headers.host||'').split(':')[0].toLowerCase();
 const marketingHost=['prescottsbestremodeling.com','www.prescottsbestremodeling.com'].includes(hostname);
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
 '/guide.js':['public/guide.js','text/javascript; charset=utf-8'],
 '/holiday.js':['public/holiday.js','text/javascript; charset=utf-8'],
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
 // Only the 11 approved generated holiday concepts are served; never expose arbitrary local uploads.
 for(const asset of holidayImages){
  const publicPath='/site-assets/holiday-concepts/'+asset.file;
  staticPaths[publicPath]=['public/site-assets/holiday-concepts/'+asset.file,'image/webp'];
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
   '- [Home]('+site+'/): Residential remodeling and service overview',
   '- [About]('+site+'/about): Company and local service-area introduction',
   '- [Services]('+site+'/bathroom-remodeling): Bathroom remodeling',
   '- [Kitchens]('+site+'/kitchen-remodeling): Kitchen remodeling',
   '- [Project planner]('+site+'/start-here): Browser-only preparation worksheet',
   '- [Optional AI Project Guide]('+site+'/project-guide): Consent-based plain-language homeowner planning help using Google Gemini; no bidding or booking',
   '- [Budget explorer]('+site+'/estimate): Illustrative research budget, NOT a business quote',
   '- [Knowledge center]('+site+'/blog): Homeowner educational articles',
   '- [Holiday lighting concierge]('+site+'/holiday-lighting): Seasonal concept packages and service scope',
   '- [Holiday lighting design studio]('+site+'/holiday-lighting/design): Local-only house photo preview and a crew worksheet concept',
   '- [Contact]('+site+'/schedule): Phone and email contact',
   '',
   '## Homeowner articles',
   ...articles.map(a=>'- ['+a.title+']('+site+'/blog/'+a.slug+'): '+a.excerpt),
   '',
   '## Important limitations',
   '- The private proposal portal is access-controlled. Do not crawl /proposal or /api.',
   '- AI-generated pictures are clearly labeled design inspiration, not completed jobs.',
   '- Online pricing is preliminary demonstration data, not approved estimates.',
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
    '\nOriginal article: https://prescottsbestremodeling.com/blog/'+a.slug+'\n').join('\n---\n');
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
  res.end(indexed?'User-agent: *\nDisallow: /api/\nDisallow: /proposal\nSitemap: '+origin+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n');return true;
 }
 if(path==='/sitemap.xml'){
  if(!indexed)throw bad('Sitemap not published yet',404);
  const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+
   sitemapPaths().map(p=>'<url><loc>'+origin.replace(/\/$/,'')+((marketingHost?p.replace('/remodeling-preview',''):p)||'/')+'</loc></url>').join('')+'</urlset>';
  res.writeHead(200,{'Content-Type':'application/xml; charset=utf-8'});
  res.end(xml);return true;
 }
 return false;
}
