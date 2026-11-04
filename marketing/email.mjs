// Prescott's Best customer lead notification. All credentials stay server-side on Render.
// Resend is preferred when verified. Existing SMTP configuration is a fallback.
// No customer lead details or secrets are ever logged here.
import nodemailer from 'nodemailer';

const destination='chris@prescottsbestconstruction.com';
export const emailConfigured=()=>Boolean(
 (process.env.RESEND_API_KEY&&process.env.LEAD_FROM_EMAIL)||
 (process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS&&process.env.SMTP_FROM)
);
const subject=(lead)=>'Prescott’s Best website project request — '+lead.project;
const text=(lead)=>[
 'New Prescott’s Best Construction website inquiry',
 'Reference: '+lead.id,
 'Name: '+lead.name,
 'Reply email: '+lead.email,
 'Phone: '+(lead.phone||'Not provided'),
 'Project: '+lead.project,
 'Project area (voluntary): '+(lead.area||'Not provided'),
 'Details: '+lead.notes,
 'Created: '+lead.createdAt,
 'Source: Prescott’s Best Remodeling website',
 'Landing path: '+(lead.referral?.path||'Not recorded'),
 'Campaign source: '+(lead.referral?.source||'Direct / unknown'),
 'Customer site photos: '+((lead.photos||[]).length)+' JPEG attachments',
 'Please follow up with the customer using the contact information supplied.'
].join('\n');

export async function sendLeadEmail(lead,{sendWithSmtp,sendWithResend,attachments=[]}={}){
 const message={to:destination,replyTo:lead.email,subject:subject(lead),text:text(lead),
  attachments:attachments.map(p=>({filename:p.filename,content:p.content,contentType:'image/jpeg'}))};
 if(process.env.RESEND_API_KEY&&process.env.LEAD_FROM_EMAIL){
  try{
   let result;
   if(sendWithResend)result=await sendWithResend(message);
   else{
    const response=await fetch('https://api.resend.com/emails',{
     method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
     body:JSON.stringify({from:process.env.LEAD_FROM_EMAIL,to:[message.to],reply_to:message.replyTo,subject:message.subject,text:message.text,
      ...(message.attachments.length?{attachments:message.attachments.map(p=>({filename:p.filename,content:p.content.toString('base64')}))}:{})}),
     signal:AbortSignal.timeout(16000)
    });
    if(!response.ok)return {sent:false,reason:'Resend provider returned HTTP '+response.status,category:'provider'};
    const data=await response.json();
    result={id:data.id};
   }
   if(typeof result?.id!=='string'||!result.id.trim())return {sent:false,reason:'Resend did not return a delivery identifier',category:'provider'};
   return {sent:true,provider:'resend',providerId:result.id};
  }catch{return {sent:false,reason:'Resend delivery unavailable',category:'provider'};}
 }
 if(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS&&process.env.SMTP_FROM){
  const port=Number(process.env.SMTP_PORT||587);
  if(!Number.isInteger(port)||port<1||port>65535)
   return {sent:false,reason:'SMTP port misconfigured',category:'configuration'};
  let transport;
  try{
   // Google presents 16-character app passwords in groups of four; old Render values
   // can contain presentation spaces. Only remove those spaces for Gmail hosts.
   const password=/^(?:smtp|smtp-relay)\.gmail\.com$/i.test(process.env.SMTP_HOST)?
    process.env.SMTP_PASS.replace(/\s/g,''):process.env.SMTP_PASS;
   const payload={from:{name:'Prescott’s Best Construction',address:process.env.SMTP_FROM},
    to:message.to,replyTo:message.replyTo,subject:message.subject,text:message.text,attachments:message.attachments};
   let result;
   if(sendWithSmtp)result=await sendWithSmtp(payload);
   else{
    transport=nodemailer.createTransport({
     host:process.env.SMTP_HOST,port,secure:port===465,requireTLS:port!==465,
     auth:{user:process.env.SMTP_USER,pass:password},
     tls:{minVersion:'TLSv1.2'},connectionTimeout:15000,greetingTimeout:15000,
     socketTimeout:18000
    });
    result=await transport.sendMail(payload);
   }
   if(!Array.isArray(result?.accepted) || result.rejected?.length || !result.accepted.some(x=>x.toLowerCase()===destination))
    return {sent:false,reason:'SMTP recipient not accepted',category:'provider'};
   return {sent:true,provider:'smtp',providerId:result?.messageId||null};
  }catch(error){
   const auth=['EAUTH','EENVELOPE'].includes(error?.code)||[534,535].includes(error?.responseCode);
   return {sent:false,reason:auth?'SMTP authentication or sender failure':'SMTP provider unavailable',
    category:auth?'configuration':'provider'};
  }finally{try{transport?.close()}catch{}}
 }
 return {sent:false,reason:'No delivery provider configured',category:'configuration'};
}
