import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
const folder=()=>process.env.DATA_DIR||join(process.cwd(),'.local-data');
const file=()=>join(folder(),'ai-guide-usage.json');
const types=['request','success','upstream429','upstreamError','networkError','localLimit'];
let queue=Promise.resolve();
async function read(){
 try{const d=JSON.parse(await readFile(file(),'utf8'));return Array.isArray(d)?d:[];}
 catch(e){if(e.code==='ENOENT')return [];throw e;}
}
export async function recordAiGuideUsage(type){
 if(!types.includes(type))throw Error('Invalid aggregate AI usage event');
 const task=async()=>{
  const date=new Date().toISOString().slice(0,10);
  const data=await read();let day=data.find(x=>x.date===date);
  if(!day){day={date,request:0,success:0,upstream429:0,upstreamError:0,networkError:0,localLimit:0};data.push(day);}
  day[type]++;
  const kept=data.sort((a,b)=>a.date.localeCompare(b.date)).slice(-90);
  await mkdir(folder(),{recursive:true});
  const tmp=join(folder(),'aiusage-'+randomUUID()+'.tmp');
  await writeFile(tmp,JSON.stringify(kept,null,2),{mode:0o600});
  await rename(tmp,file());
 };
 const p=queue.then(task,task);queue=p.catch(()=>{});await p;
}
export async function aiGuideUsage(days=30){
 await queue;
 days=[7,30,90].includes(Number(days))?Number(days):30;
 const start=new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);
 const daily=(await read()).filter(x=>x.date>=start);
 const totals=Object.fromEntries(types.map(k=>[k,daily.reduce((n,x)=>n+(x[k]||0),0)]));
 return {windowDays:days,totals,daily,source:'Persistent aggregate AI guide request telemetry since monitoring was enabled. No prompts, visitor identifiers, API keys, IP addresses or message bodies stored.',
  historicalBeforeInstrumentation:false};
}
