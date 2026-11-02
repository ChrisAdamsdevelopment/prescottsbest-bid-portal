import {marketingPage,sitemapPaths} from './site.mjs';
export async function maybeServeMarketing(req,res,path,{root,readFile,bad}){
 if(req.method!=='GET')return false;
 const origin=process.env.PUBLIC_SITE_ORIGIN;
 const indexed=process.env.SITE_INDEXABLE==='true'&&!!origin?.startsWith('https://');
 const preview=marketingPage(path,{indexable:indexed,origin});
 if(preview){
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8',
   'X-Robots-Tag':indexed?'index,follow':'noindex,nofollow',
   'Cache-Control':'no-store'});
  res.end(preview);return true;
 }
 const staticPaths={
 '/marketing.css':['public/marketing.css','text/css; charset=utf-8'],
 '/marketing.js':['public/marketing.js','text/javascript; charset=utf-8'],
 '/site-assets/pbc-logo.webp':['public/site-assets/pbc-logo.webp','image/webp']
 };
 if(staticPaths[path]){
  const [file,type]=staticPaths[path];
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'public,max-age=86400'});
  res.end(await readFile(new URL('../'+file,import.meta.url)));return true;
 }
 if(path==='/robots.txt'){
  res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});
  res.end(indexed?'User-agent: *\nDisallow: /api/\nDisallow: /proposal\nSitemap: '+origin+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n');return true;
 }
 if(path==='/sitemap.xml'){
  if(!indexed)throw bad('Sitemap not published yet',404);
  const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+
   sitemapPaths().map(p=>'<url><loc>'+origin.replace(/\/$/,'')+p+'</loc></url>').join('')+'</urlset>';
  res.writeHead(200,{'Content-Type':'application/xml; charset=utf-8'});
  res.end(xml);return true;
 }
 return false;
}
