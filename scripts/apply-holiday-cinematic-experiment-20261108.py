from pathlib import Path
root=Path(r'D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\PBC_BID_PORTAL')
holiday=root/'marketing/holiday-pages.mjs'
src=holiday.read_text(encoding='utf-8')
changes=[
 ("body:'<section class=\"site-pagehead holiday-head\"><div class=\"holiday-head-copy\"><span class=\"kicker\">SEASONAL CONCIERGE · PRESCOTT AREA</span>'+",
  "body:'<section class=\"site-pagehead holiday-head holiday-cinematic-head\"><div class=\"holiday-head-copy\"><div class=\"holiday-copy-intro\"><span class=\"kicker\">SEASONAL CONCIERGE · PRESCOTT AREA</span>'+"),
 ("'<p class=\"lede\">Explore your Christmas lighting style from the comfort of home. Start with a package or create your own design, then speak directly with Prescott’s Best about materials, installation and service.</p>'+",
  "'<p class=\"lede\">Explore your Christmas lighting style from the comfort of home. Start with a package or create your own design, then speak directly with Prescott’s Best about materials, installation and service.</p></div>'+")
]
for old,new in changes:
 assert src.count(old)==1,('MARKUP',src.count(old),old[:80])
 src=src.replace(old,new,1)
holiday.write_text(src,encoding='utf-8')

js=root/'public/brand-films.js'
txt=js.read_text(encoding='utf-8')
old="""  const video=figure.querySelector('[data-brand-video]');
  const toolbar=figure.querySelector('[data-film-controls]');"""
new="""  const video=figure.querySelector('[data-brand-video]');
  // The holiday commercial is a one-off cinematic hero: crossfade only when frames play
  // and let the opening copy clear the brand logo near the end of the 10-second film.
  const holidayHero=figure.closest('.holiday-cinematic-head');
  const toolbar=figure.querySelector('[data-film-controls]');"""
assert txt.count(old)==1
txt=txt.replace(old,new,1)
old="""  video.addEventListener('play',refresh);
  video.addEventListener('pause',refresh);"""
new="""  video.addEventListener('play',refresh);
  video.addEventListener('playing',()=>{
   if(holidayHero)figure.dataset.framesReady='true';
  });
  video.addEventListener('timeupdate',()=>{
   if(holidayHero&&!reduced.matches&&!video.paused&&video.currentTime>=5.8){
    holidayHero.classList.add('holiday-intro-complete');
   }
  });
  video.addEventListener('pause',()=>{
   if(holidayHero)holidayHero.classList.remove('holiday-intro-complete');
   refresh();
  });"""
assert txt.count(old)==1
txt=txt.replace(old,new,1)
js.write_text(txt,encoding='utf-8')

css=root/'public/marketing.css'
text=css.read_text(encoding='utf-8')
addon="""

/* Holiday-only cinematic hero experiment (2026-11-08).
   Full-bleed video + readable gradient on desktop; an uncropped, centered
   16:9 frame on mobile so the supplied video logo remains visible. */
.holiday-head.holiday-cinematic-head{
 position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(0,1fr);
 align-items:center;min-height:clamp(570px,49vw,730px);box-sizing:border-box;
 overflow:hidden;padding:clamp(44px,5vw,76px) clamp(24px,5vw,80px);
 background:#153327;color:#fff;
}
.holiday-cinematic-head>.brand-film{
 position:absolute;inset:0;z-index:0;display:block;justify-self:stretch;
 width:100%;max-width:none;height:100%;min-height:0;box-sizing:border-box;
 margin:0;border:0;border-radius:0;box-shadow:none;aspect-ratio:auto;
}
.holiday-cinematic-head>.brand-film .brand-film-poster,
.holiday-cinematic-head>.brand-film .brand-film-video{
 object-position:center center;object-fit:cover;
}
.holiday-cinematic-head>.brand-film .brand-film-video{opacity:0;transition:opacity 950ms ease}
.holiday-cinematic-head>.brand-film[data-frames-ready="true"] .brand-film-video{opacity:1}
.holiday-cinematic-head::after{
 content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
 background:linear-gradient(90deg,rgba(11,35,28,.96) 0%,rgba(11,35,28,.86) 27%,
 rgba(12,35,28,.48) 49%,rgba(11,35,28,.12) 73%,rgba(11,35,28,.03) 100%);
 transition:background 900ms ease;
}
.holiday-cinematic-head .holiday-head-copy{
 position:relative;z-index:2;max-width:min(710px,57vw);width:100%;
 min-width:0;padding:0;margin:0;box-sizing:border-box;
}
.holiday-cinematic-head .holiday-head-copy h1{
 font-size:clamp(40px,4.6vw,70px);line-height:1.08;max-width:660px;
 text-shadow:0 2px 20px rgba(0,0,0,.20);
}
.holiday-cinematic-head .holiday-head-copy .lede{font-size:clamp(16px,1.55vw,21px);max-width:620px}
.holiday-cinematic-head .holiday-head-copy .micro{max-width:570px;font-size:14px;line-height:1.46}
.holiday-cinematic-head .holiday-head-copy .site-actions{position:relative;z-index:4;gap:10px}
.holiday-cinematic-head .holiday-copy-intro{opacity:1;transform:translateY(0);
 transition:opacity 1.2s ease,transform 1.2s ease}
.holiday-cinematic-head>.brand-film .brand-film-controls{
 position:absolute;z-index:6;right:14px;top:14px;bottom:auto;left:auto;
 opacity:.65;transition:opacity .35s ease;
}
.holiday-cinematic-head>.brand-film .brand-film-controls:hover,
.holiday-cinematic-head>.brand-film .brand-film-controls:focus-within,
.holiday-cinematic-head>.brand-film[data-playing="false"] .brand-film-controls{opacity:1}
.holiday-cinematic-head>.brand-film .brand-film-controls button{
 min-height:36px;font-size:12px;font-weight:750;padding:6px 10px;
 background:rgba(12,30,24,.72);border-color:rgba(255,255,255,.55);
}
@media(min-width:951px){
 .holiday-cinematic-head.holiday-intro-complete .holiday-copy-intro{
  opacity:0;transform:translateY(-12px);pointer-events:none;
 }
 .holiday-cinematic-head.holiday-intro-complete::after{
  background:linear-gradient(90deg,rgba(10,34,26,.60),rgba(11,35,28,.15) 45%,transparent 86%);
 }
}
@media(max-width:950px){
 .holiday-head.holiday-cinematic-head{
  display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;
  min-height:0;gap:0;padding:0 0 24px;overflow:hidden;background:#183b2d;
 }
 .holiday-head.holiday-cinematic-head::before{
  content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:url('/site-assets/brand-films/prescotts-best-holiday-lighting-poster.webp')
   center center/cover no-repeat;filter:blur(18px) brightness(.55);transform:scale(1.08);
 }
 .holiday-cinematic-head>.brand-film{
  position:relative;inset:auto;order:0;flex:none;
  margin:0!important;padding:0;width:100%;height:auto;
  min-height:0;max-width:none;aspect-ratio:16/9;border-radius:0;
 }
 .holiday-cinematic-head>.brand-film .brand-film-poster,
 .holiday-cinematic-head>.brand-film .brand-film-video{
  width:100%;height:100%;object-fit:contain;object-position:center center;
 }
 .holiday-cinematic-head::after{
  background:linear-gradient(180deg,transparent 0%,rgba(11,33,26,.08) 90px,
  rgba(11,33,26,.82) 255px,#183b2d 440px);
 }
 .holiday-cinematic-head .holiday-head-copy{
  order:1;z-index:3;width:100%;max-width:none;
  padding:0 clamp(18px,5vw,36px) 14px;margin:-28px 0 0;
 }
 .holiday-cinematic-head .holiday-head-copy h1{
  font-size:clamp(32px,6.3vw,49px);line-height:1.11;
 }
 .holiday-cinematic-head .holiday-head-copy .lede{font-size:clamp(16px,2.8vw,19px)}
 .holiday-cinematic-head>.brand-film .brand-film-controls{
  top:8px;right:8px;bottom:auto;opacity:.83;gap:5px;
 }
 .holiday-cinematic-head>.brand-film .brand-film-controls button{
  min-height:34px;font-size:11px;padding:5px 8px;
 }
}
@media(max-width:560px){
 .holiday-head.holiday-cinematic-head{padding:0 0 12px}
 .holiday-cinematic-head .holiday-head-copy{margin:-23px 0 0;padding:0 18px 10px}
 .holiday-cinematic-head .holiday-head-copy h1{
  font-size:clamp(32px,8.6vw,41px);letter-spacing:-.035em;margin:8px 0 12px;
 }
 .holiday-cinematic-head .holiday-head-copy .lede{font-size:16px;line-height:1.45}
 .holiday-cinematic-head .holiday-head-copy .micro{font-size:12px!important;line-height:1.45}
 .holiday-cinematic-head .holiday-head-copy .site-actions{display:grid;grid-template-columns:1fr}
 .holiday-cinematic-head .holiday-head-copy .site-button{min-height:44px;padding:8px 12px}
}
@media(prefers-reduced-motion:reduce){
 .holiday-cinematic-head>.brand-film .brand-film-video,
 .holiday-cinematic-head .holiday-copy-intro{transition:none!important}
 .holiday-cinematic-head .holiday-copy-intro{opacity:1!important;transform:none!important}
}
@media print{
 .holiday-head.holiday-cinematic-head{min-height:0;background:#fff;color:#142c20}
 .holiday-cinematic-head .holiday-head-copy{color:#143524}
 .holiday-cinematic-head .holiday-copy-intro{opacity:1!important}
 .holiday-cinematic-head>.brand-film{display:none!important}
 .holiday-cinematic-head::after{display:none!important}
}
"""
if 'Holiday-only cinematic hero experiment' in text:raise RuntimeError('Already implemented')
css.write_text(text+addon,encoding='utf-8')
print('Holiday cinematic experiment patched: markup + scoped CSS + time-aware intro fade')
