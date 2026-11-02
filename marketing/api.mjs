import {randomUUID} from 'node:crypto';
import {budget} from './budget.mjs';
const contact='chris@prescottsbestconstruction.com';
const validEmail=s=>typeof s==='string'&&s.length<=180&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
const clean=(s,n)=>typeof s==='string'&&s.length<=n?s.trim():null;
async function sendNotification(lead){
 const apiKey=process.env.RESEND_API_KEY,from=process.env.LEAD_FROM_EMAIL;
 if(!apiKey||!from)return {sent:false,reason:'Mail provider not configured'};
 const subject='PBC website remodeling request — '+lead.project;
 const body=['New remodeling website request','Reference: '+lead.id,'Name: '+lead.name,
  'Reply email: '+lead.email,'Phone: '+(lead.phone||'not supplied'),
  'Project: '+lead.project,'Notes: '+lead.notes,'Created: '+lead.createdAt,
  'Source: preview remodeling site','Please review the request in the protected PBC staff system.'].join('\n');
 try{
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{
    Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
   body:JSON.stringify({from,to:[contact],reply_to:lead.email,subject,text:body}),
   signal:AbortSignal.timeout(15000)});
  if(!r.ok)return {sent:false,reason:'Email provider rejected notification (HTTP '+r.status+')'};
  const j=await r.json();
  return {sent:true,providerId:j.id||null};
 }catch{return {sent:false,reason:'Email delivery unavailable'};}
}
export async function publicApi(req,res,path,utils){
 const {input,read,change,reply,bad}=utils;
 if(req.method==='POST'&&path==='/api/public/budget'){
  const v=await input(req,2500);
  const b=budget(v);
  return reply(res,200,b);
 }
 if(req.method==='POST'&&path==='/api/public/inquiry'){
  if(process.env.LEAD_FORM_ENABLED!=='true')throw bad('Online inquiry submissions are not enabled yet. Please email '+contact+' or call (928) 350-0940.',503);
  const v=await input(req,6500);
  if(typeof v.website==='string'&&v.website.trim())return reply(res,200,{reference:'FILTERED',recorded:false});
  const name=clean(v.name,120),email=clean(v.email,180),phone=clean(v.phone||'',35);
  const project=clean(v.project,100),notes=clean(v.notes||'',1600);
  if(!name||!validEmail(email)||!project||v.consent!==true||notes===null||phone===null)throw bad('Name, valid email, project and contact consent are required.');
  if(!['Bathroom remodeling','Kitchen remodeling','Shower or bath conversion','Room or garage conversion','Finish carpentry','Other residential remodeling'].includes(project))throw bad('Invalid project category');
  const reqId=typeof v.requestId==='string'&&/^[\w-]{20,80}$/.test(v.requestId)?v.requestId:randomUUID();
  const row=await change(s=>{
   s.leads??=[];
   const found=s.leads.find(x=>x.requestId===reqId);
   if(found)return {id:found.id,already:true,notification:found.notification?.status||'pending'};
   if(s.leads.length>2500)throw bad('Request system temporarily at capacity',503);
   const id='PBC-'+randomUUID().slice(0,8).toUpperCase();
   const record={id,requestId:reqId,name,email,phone,project,notes,
    createdAt:new Date().toISOString(),consent:true,source:'remodeling-preview',
    notification:{status:'pending',to:contact}};
   s.leads.push(record);s.audit.push({type:'public_lead_recorded',id,at:record.createdAt});
   return {id,already:false,record};
  });
  if(!row.already){
   const outcome=await sendNotification(row.record);
   await change(s=>{
    const saved=s.leads.find(l=>l.id===row.id);
    if(saved&&saved.notification.status==='pending'){
     saved.notification={status:outcome.sent?'sent':'pending',to:contact,
      ...(outcome.sent?{providerId:outcome.providerId,sentAt:new Date().toISOString()}:{reason:outcome.reason})};
    }
   });
  }
  return reply(res,202,{reference:row.id,recorded:true,
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
