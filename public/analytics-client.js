// Privacy-conscious first-party analytics, disabled until an explicit visitor opt-in.
// Never captures form values, photo contents, email addresses, IPs, precise location or URL queries.
(()=>{
 const KEY='pbc_analytics_choice_v1',SESSION='pbc_analytics_session_v1';
 const gpc=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1';
 const clean=s=>String(s||'').slice(0,90).replace(/[^a-zA-Z0-9._:/-]/g,'');
 const path=()=>location.pathname.startsWith('/remodeling-preview')?location.pathname.replace(/^\/remodeling-preview/,'')||'/':location.pathname;
 let allowed=!gpc&&localStorage.getItem(KEY)==='yes',started=false,lastTick=0,scrolls=new Set(),formStarted=false;
 const session=()=>{
  let value=sessionStorage.getItem(SESSION);
  if(!value){value=crypto.randomUUID();sessionStorage.setItem(SESSION,value);}
  return value;
 };
 const channel=()=>{
  const saved=JSON.parse(sessionStorage.getItem('pbc_entry')||'null');
  return clean(saved?.source||new URLSearchParams(location.search).get('utm_source')||'');
 };
 const referral=()=>{
  if(!document.referrer)return '';
  try{
   const u=new URL(document.referrer);
   return u.hostname===location.hostname?'internal':clean(u.hostname);
  }catch{return '';}
 };
 const device=()=>innerWidth<640?'mobile':innerWidth<1050?'tablet':'desktop';
 const payload=(type,extra={})=>({
  type,session:session(),path:path(),source:channel(),ref:referral(),
  device:device(),tz:clean(Intl.DateTimeFormat().resolvedOptions().timeZone||'',65),
  locale:clean(navigator.language||'',12),...extra
 });
 const send=(events,beacon=false)=>{
  if(!allowed||!events.length)return;
  const data=JSON.stringify({consent:true,events});
  try{
   if(beacon&&navigator.sendBeacon){
    navigator.sendBeacon('/api/public/analytics',new Blob([data],{type:'application/json'}));return;
   }
   void fetch('/api/public/analytics',{method:'POST',headers:{'Content-Type':'application/json'},
    body:data,keepalive:true,credentials:'same-origin'}).catch(()=>{});
  }catch{}
 };
 const track=(type,extra={})=>send([payload(type,extra)]);
 const endEngagement=(beacon=false)=>{
  if(!lastTick||!allowed)return;
  const now=performance.now(),ms=Math.min(60000,Math.round(now-lastTick));
  lastTick=document.hidden?0:now;
  if(ms>1000)send([payload('engagement',{ms})],beacon);
 };
 const beginEngagement=()=>{if(!document.hidden&&document.hasFocus())lastTick=performance.now();};
 const start=()=>{
  if(started||!allowed)return;
  started=true;
  track('page_view');beginEngagement();
  setInterval(()=>{if(document.visibilityState==='visible'&&document.hasFocus())endEngagement();},15000);
  document.addEventListener('visibilitychange',()=>{
   if(document.hidden)endEngagement(true);
   else beginEngagement();
  });
  window.addEventListener('pagehide',()=>endEngagement(true));
  window.addEventListener('focus',beginEngagement);
  window.addEventListener('blur',()=>endEngagement(true));
  window.addEventListener('scroll',()=>{
   const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);
   const percent=100*Math.max(0,scrollY)/total;
   for(const depth of [25,50,75,90])if(percent>=depth&&!scrolls.has(depth)){scrolls.add(depth);track('scroll',{depth});}
  },{passive:true});
  document.addEventListener('click',event=>{
   const a=event.target.closest('a[href]');
   if(!a)return;
   const url=new URL(a.href,location.href);
   const action=url.protocol==='tel:'?'phone':url.protocol==='mailto:'?'email':
    url.origin!==location.origin?'external':url.pathname.endsWith('/schedule')?'contact':
    url.pathname.endsWith('/estimate')?'budget':'other';
   if(action!=='other')track('cta_click',{action});
  });
  for(const f of document.querySelectorAll('form')){
   f.addEventListener('focusin',()=>{
    if(formStarted)return;formStarted=true;track('form_start');
   },{once:true});
  }
 };
 function choice(value){
  allowed=value==='yes'&&!gpc;
  try{localStorage.setItem(KEY,allowed?'yes':'no');}catch{}
  document.getElementById('pbc-analytics-consent')?.remove();
  if(allowed)start();
 }
 const prompt=()=>{
  if(document.getElementById('pbc-analytics-consent'))return;
  const panel=document.createElement('aside');panel.id='pbc-analytics-consent';panel.className='analytics-consent';
  panel.setAttribute('aria-label','Optional website analytics');
  const message=document.createElement('div');
  const heading=document.createElement('strong');heading.textContent='Help us improve this website?';
  const description=document.createElement('p');
  description.textContent='With your permission, we measure page views, reading time, navigation and interactions to understand which homeowner resources help. We do not record your name, email, form answers or precise location in browsing analytics.';
  const link=document.createElement('a');link.href='/privacy';link.textContent='Privacy details';
  message.append(heading,description,link);
  const actions=document.createElement('div');actions.className='analytics-consent-actions';
  const accept=document.createElement('button');accept.type='button';accept.textContent='Allow analytics';accept.addEventListener('click',()=>choice('yes'));
  const decline=document.createElement('button');decline.type='button';decline.textContent='No thanks';decline.addEventListener('click',()=>choice('no'));
  actions.append(accept,decline);panel.append(message,actions);document.body.append(panel);
 };
 document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('analytics-settings')?.addEventListener('click',()=>{
   if(gpc)return;
   prompt();
  });
  if(gpc)return;
  const selection=localStorage.getItem(KEY);
  if(selection===null)prompt();
  else if(selection==='yes')start();
 });
 window.pbcAnalytics={track:(type,extra)=>{if(allowed)track(type,extra);},isEnabled:()=>allowed};
})();
