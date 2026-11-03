// For local browser QA ONLY. Never import in production.
const original=globalThis.fetch;
globalThis.fetch=async(input,init)=>{
 if(String(input).startsWith('https://generativelanguage.googleapis.com/')){
  const data=JSON.parse(init?.body||'{}');
  const question=data?.contents?.at(-1)?.parts?.[0]?.text||'';
  const safeAnswer='For your project, first list what is difficult to use and what you want to change. Next, measure the room approximately and save a few inspiration photos. Then use our project planner and arrange a site review. What is your top priority?';
  if(!question)throw Error('no prompt');
  return new Response(JSON.stringify({candidates:[{content:{parts:[{text:safeAnswer}]}}]}),{
   status:200,headers:{'Content-Type':'application/json'}});
 }
 return original(input,init);
};
