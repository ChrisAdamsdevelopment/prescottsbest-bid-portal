import {randomUUID} from 'node:crypto';
import {budget} from './budget.mjs';
import {recordAnalytics,analyticsSummary} from './analytics.mjs';
import {prepareLeadPhotos,saveLeadPhotos,readLeadPhoto,photoUploadReady} from './lead-images.mjs';
import {sendLeadEmail,emailConfigured} from './email.mjs';
import {validateInspirationSelections} from './inspiration-selections.mjs';
const contact='chris@prescottsbestconstruction.com';
const validEmail=s=>typeof s==='string'&&s.length<=180&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
const clean=(s,n)=>typeof s==='string'&&s.length<=n?s.trim():null;
export async function publicApi(req,res,path,utils){
 const {input,read,change,reply,bad}=utils;
 if(req.method==='GET'&&path==='/api/public/site-status')return reply(res,200,{inquiryEnabled:process.env.LEAD_FORM_ENABLED==='true',notificationConfigured:emailConfigured(),appointments:'consultation_request',budget:'planning_estimate',photoUploadEnabled:photoUploadReady()});
 if(req.method==='POST'&&path==='/api/public/analytics'){
  if(req.headers['sec-gpc']==='1'||req.headers.dnt==='1')return reply(res,202,{accepted:0});
  const body=await input(req,12000);
  const result=await recordAnalytics(body);
  return reply(res,202,result);
 }
 if(req.method==='GET'&&path==='/api/admin/analytics'){
  utils.admin(req);
  const u=new URL(req.url,'http://localhost');
  const days=Math.max(1,Math.min(30,Number(u.searchParams.get('days'))||7));
  const data=await read();
  return reply(res,200,await analyticsSummary({days,leads:data.leads||[]}));
 }
 if(req.method==='POST'&&path==='/api/public/budget'){
  const v=await input(req,2500);
  const b=budget(v);
  return reply(res,200,b);
 }
 if(req.method==='GET'&&path.startsWith('/api/admin/lead-photo/')){
  utils.admin(req);
  const parts=path.split('/');
  const ref=parts[4],photoId=parts[5];
  if(parts.length!==6||!/^PBC-[A-F0-9]{8}$/.test(ref)||!photoId)throw bad('Photo not found',404);
  const s=await read(),lead=(s.leads||[]).find(l=>l.id===ref),photo=lead?.photos?.find(p=>p.id===photoId);
  if(!photo)throw bad('Photo not found',404);
  const bytes=await readLeadPhoto(ref,photoId);
  res.writeHead(200,{'Content-Type':'image/jpeg','Content-Length':bytes.length,'Content-Disposition':'attachment; filename="'+photo.filename+'"','Cache-Control':'private,no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex,nofollow'});
  res.end(bytes);return;
 }
 if(req.method==='POST'&&path==='/api/public/inquiry'){
  if(process.env.LEAD_FORM_ENABLED!=='true')throw bad('Online inquiry submissions are not enabled yet. Please email '+contact+' or call (928) 350-0940.',503);
  const v=await input(req,6_500_000);
  if(typeof v.website==='string'&&v.website.trim())return reply(res,200,{reference:'FILTERED',recorded:false});
  const name=clean(v.name,120),email=clean(v.email,180),phone=clean(v.phone||'',35);
  const project=clean(v.project,100),notes=clean(v.notes||'',1600),area=clean(v.area||'',80);
  const visualPreviewRequested=v.visualPreview==='requested';
  let inspirations;
  try{inspirations=validateInspirationSelections(v.inspirations)}
  catch(error){throw bad(error.message||'Invalid inspiration list',400)}
  if(!name||!validEmail(email)||!project||v.consent!==true||notes===null||phone===null||area===null)throw bad('Name, valid email, project and contact consent are required.');
  if(!['Bathroom remodeling','Kitchen remodeling','Shower or bath conversion','Room or garage conversion','Finish carpentry','Custom cabinetry and built-ins','Deck or outdoor carpentry','Other residential remodeling','Holiday lighting design and installation','Storm or flood damage reconstruction'].includes(project))throw bad('Invalid project category');
  const photos=await prepareLeadPhotos(v.photos);
  const entrySource=clean(v.utmSource||'',80)||'';
  const entryPath=clean(v.entryPath||'',180)||'';
  const reqId=typeof v.requestId==='string'&&/^[\w-]{20,80}$/.test(v.requestId)?v.requestId:randomUUID();
  const row=await change(async s=>{
   s.leads??=[];
   const found=s.leads.find(x=>x.requestId===reqId);
   if(found)return {id:found.id,already:true,notification:found.notification?.status||'pending'};
   if(s.leads.length>2500)throw bad('Request system temporarily at capacity',503);
   const id='PBC-'+randomUUID().slice(0,8).toUpperCase();
   const imageRecords=await saveLeadPhotos(id,photos);
   const record={id,requestId:reqId,name,email,phone,project,notes,area,visualPreviewRequested,inspirations,photos:imageRecords,
    referral:{source:entrySource,path:entryPath},
    createdAt:new Date().toISOString(),consent:true,source:'remodeling-preview',
    notification:{status:'pending',to:contact}};
   s.leads.push(record);s.audit.push({type:'public_lead_recorded',id,at:record.createdAt});
   return {id,already:false,record};
  });
  if(!row.already){
   const outcome=await sendLeadEmail(row.record,{attachments:photos});
   await change(s=>{
    const saved=s.leads.find(l=>l.id===row.id);
    if(saved&&saved.notification.status==='pending'){
     saved.notification={status:outcome.sent?'sent':'failed',to:contact,attempts:1,
      ...(outcome.sent?{providerId:outcome.providerId,sentAt:new Date().toISOString()}:{reason:outcome.reason})};
    }
   });
  }
  const latest=await read();
  const notificationStatus=latest.leads.find(x=>x.id===row.id)?.notification?.status||'pending';
  return reply(res,202,{reference:row.id,recorded:true,notificationStatus,
   photosReceived:(latest.leads.find(x=>x.id===row.id)?.photos||[]).length,
   inspirationCount:(latest.leads.find(x=>x.id===row.id)?.inspirations||[]).length,
   note:'A human must review the request; this does not constitute a confirmed appointment.'});
 }
 if(req.method==='GET'&&path==='/api/admin/leads'){
  utils.admin(req);
  const s=await read();
  const leads=(s.leads||[]).map(({requestId,...l})=>l);
  return reply(res,200,{leads,notificationTo:contact});
 }
 throw bad('Not found',404);
}
