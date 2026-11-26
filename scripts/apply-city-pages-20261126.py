from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'marketing/site.mjs'
s=p.read_text(encoding='utf-8')
pairs=[
("import {jandjPath", "import {cityPaths,cityLinks,cityPage,cityDirectory} from './city-pages.mjs';\nimport {jandjPath"),
("const routenames=Object.keys(routes);","routes['/service-areas']=()=>cityDirectory(link);\nfor(const path of cityPaths)routes[path]=()=>cityPage(path.split('/').at(-1),link);\nconst routenames=Object.keys(routes);"),
("jandjTeaser(link)+realProjectsHomeSection(link)+","jandjTeaser(link)+realProjectsHomeSection(link)+cityLinks(link)+"),
("linkText('Project stories','/projects')","linkText('Project stories','/projects')+linkText('Service areas','/service-areas')"),
]
for a,b in pairs:
 assert s.count(a)==1,(a,s.count(a))
 s=s.replace(a,b)
p.write_text(s,encoding='utf-8')
p=r/'public/marketing.css'
with p.open('a',encoding='utf-8') as f:
 f.write("""
/* Quad Cities service areas */
.city-hero{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,60px);align-items:center;padding:clamp(24px,5vw,76px);background:#edece5;color:#17231c}.city-hero h1{font-family:Georgia,serif;font-weight:400;font-size:clamp(2rem,4vw,4rem);line-height:1.1;margin:.45em 0}.city-hero p{line-height:1.7}.city-hero .kicker{display:block;margin-top:20px}.city-hero figure,.city-proof figure{margin:0}.city-hero img,.city-proof img{display:block;width:100%;height:auto;border-radius:8px}.city-hero figcaption{font-size:.8rem;color:#45544a;padding:8px 0}.city-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-top:24px}.city-tile{display:block;background:#fff;border:1px solid #c9cec3;border-radius:8px;overflow:hidden;text-decoration:none;color:#17231c}.city-tile img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}.city-tile div{padding:16px}.city-tile h3{margin:0 0 8px}.city-tile span{font-size:.9rem}.city-focus{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.city-focus article,.city-local aside{padding:24px;border:1px solid #ccd2c8;background:#f4f3ee;border-radius:8px;color:#17231c}.city-local,.city-proof{display:grid;grid-template-columns:1.3fr 1fr;align-items:center;gap:30px}.city-page p{overflow-wrap:anywhere}.city-page h2,.city-directory h2{font-family:Georgia,serif;font-weight:400}.city-page a:focus-visible,.city-tile:focus-visible{outline:3px solid #967038;outline-offset:3px}@media(max-width:800px){.city-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.city-hero,.city-local,.city-proof{grid-template-columns:1fr}.city-focus{grid-template-columns:1fr}}@media(max-width:420px){.city-grid{grid-template-columns:1fr}.city-hero{padding:22px}}
""")
p=r/'marketing/site.mjs'
s=p.read_text(encoding='utf-8').replace('gallery-20261121-installation','gallery-20261121-installation-city-20261126')
p.write_text(s,encoding='utf-8')
