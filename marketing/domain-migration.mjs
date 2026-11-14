// Prescott's Best domain consolidation. Keep secondary domains attached to
// the SAME Render service for their TLS certificates; redirect public GET/HEAD
// traffic at the Node server instead of creating a cross-domain proxy.
export const primaryOrigin='https://prescottsbestconstruction.com';
export const secondaryMarketingHosts=Object.freeze([
 'prescottsbestremodeling.com','www.prescottsbestremodeling.com'
]);
const privatePaths=new Set(['/healthz','/proposal','/app.js','/style.css','/room1-proposal.js']);
export function canonicalMarketingRedirect(req,path){
 if(req.method!=='GET'&&req.method!=='HEAD')return null;
 const host=String(req.headers?.host||'').split(':')[0].toLowerCase().replace(/\.$/,'');
 if(!secondaryMarketingHosts.includes(host))return null;
 if(path.startsWith('/api/')||privatePaths.has(path))return null;
 // Preserve real, corresponding public pages instead of redirecting every URL
 // to the homepage (which would damage indexed long-tail service URLs).
 let targetPath=path;
 if(path==='/contact')targetPath='/schedule';
 else if(path==='/remodeling-preview')targetPath='/';
 else if(path.startsWith('/remodeling-preview/'))targetPath=path.slice('/remodeling-preview'.length);
 const query=new URL(req.url||'/',primaryOrigin).search;
 return primaryOrigin+targetPath+query;
}
