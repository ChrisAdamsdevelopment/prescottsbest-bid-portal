from pathlib import Path
from PIL import Image
import subprocess
from concurrent.futures import ThreadPoolExecutor
root=Path(__file__).resolve().parents[1]
source=Path('D:/PrescottsBestConstruction/ASSETS/GENERATED_CONCEPTS_INBOX/jandj')
out=root/'public/site-assets/jandj'
out.mkdir(exist_ok=True)
for name in ('front','back'):
    with Image.open(source/(name+'.png')) as im:
        im.convert('RGB').save(out/(name+'.webp'),quality=88,method=5)
        print(name, im.size, (out/(name+'.webp')).stat().st_size,flush=True)
raw=Path('D:/PrescottsBestConstruction/ASSETS/original-instagram-captures-20261120')
media=root/'public/site-assets/real-projects'
def encode(pair):
    i,id=pair
    src=raw/(id+'.mp4')
    stem=f'jandj-film-{i:02}'
    assert src.exists(), str(src)
    for width in (720,):
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-nostdin','-y','-i',str(src),'-map','0:v:0','-an','-vf',f'scale={width}:-2','-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(media/(stem+f'-{width}.mp4'))],check=True)
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-nostdin','-y','-ss','1','-i',str(src),'-frames:v','1','-vf','scale=480:-2',str(media/(stem+'-poster.webp'))],check=True)
    print('Encoded',id,flush=True)
with ThreadPoolExecutor(max_workers=2) as pool:
    list(pool.map(encode,enumerate(['C0m116iAv9A','C1NiPDAr26B','C1F9_TXL1pT','C0klsd6LBL0'],2)))
def change(path, pairs):
    p=root/path
    s=p.read_text(encoding='utf-8')
    for a,b in pairs:
        assert s.count(a)==1,(path,a,s.count(a))
        s=s.replace(a,b)
    p.write_text(s,encoding='utf-8')
change('marketing/site.mjs',[
 ("import {accessibleRemodelingPage", "import {jandjPath,jandjProjectPage,jandjTeaser} from './jandj-project.mjs';\nimport {accessibleRemodelingPage"),
 ("routes['/projects/gallery']=", "routes[jandjPath]=()=>jandjProjectPage(link);\nroutes['/projects/gallery']="),
 ("realProjectsDirectorySection(link)+'<section", "jandjTeaser(link)+realProjectsDirectorySection(link)+'<section"),
 ("  realProjectsHomeSection(link)+", "  jandjTeaser(link)+realProjectsHomeSection(link)+"),
 ("const socialPoster=suffix===", "const socialPoster=suffix===jandjPath?'/site-assets/jandj/back.webp':suffix==="),
 ("const socialWidth=hasRealPhotoShare", "const socialWidth=suffix===jandjPath?'1648':hasRealPhotoShare"),
 ("const socialHeight=hasRealPhotoShare", "const socialHeight=suffix===jandjPath?'928':hasRealPhotoShare"),
 ("const socialType=hasRealPhotoShare", "const socialType=suffix===jandjPath?'image/webp':hasRealPhotoShare"),
 ("const socialAlt=suffix===", "const socialAlt=suffix===jandjPath?'AI-assisted architectural reconstruction of a Prescott luxury residence':suffix==="),
 ("'<link rel=\"stylesheet\" href=\"/marketing.css", "'<link rel=\"stylesheet\" href=\"/jandj-project.css?v=20261126\"><link rel=\"stylesheet\" href=\"/marketing.css"),
])
change('marketing/routes.mjs',[
 ("const ownerReel=path===", "const jandjVideo=['02','03','04','05'].map(n=>({path:'/site-assets/real-projects/jandj-film-'+n+'-720.mp4',type:'video/mp4'})).find(x=>x.path===path);\n const ownerReel=path==="),
 ("||projectReel||ownerReel;", "||projectReel||ownerReel||jandjVideo;"),
 (" '/marketing.css':", " '/jandj-project.css':['public/jandj-project.css','text/css; charset=utf-8'],\n '/site-assets/jandj/front.webp':['public/site-assets/jandj/front.webp','image/webp'],\n '/site-assets/jandj/back.webp':['public/site-assets/jandj/back.webp','image/webp'],\n '/marketing.css':"),
 (" for(let i=1;i<=20;i++){", " for(const n of ['02','03','04','05']){const asset='/site-assets/real-projects/jandj-film-'+n+'-poster.webp';staticPaths[asset]=['public'+asset,'image/webp'];}\n for(let i=1;i<=20;i++){"),
 ("const lastmod=changedOnNov21.has(clean)?", "const lastmod=['/','/projects','/projects/prescott-luxury-custom-home'].includes(clean)?'<lastmod>2026-11-26</lastmod>':changedOnNov21.has(clean)?")
])
print('Wired route, assets, homepage and project directory',flush=True)
