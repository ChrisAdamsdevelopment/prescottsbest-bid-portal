from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
project=Path(r"D:\PrescottsBestConstruction")
source=project/"ASSWTS_FOR_ESTIMATOR"/"LOGO"/"Prescotts Best Construction Badge.png"
assets=project/"05_WEBSITE_AND_TECH"/"PBC_BID_PORTAL"/"public"/"site-assets"
assets.mkdir(parents=True,exist_ok=True)
logo=Image.open(source).convert("RGBA")
logo=logo.crop(logo.getchannel("A").getbbox())
def centered(size,padding=.045):
    w,h=size
    symbol=logo.copy()
    symbol.thumbnail((int(w*(1-2*padding)),int(h*(1-2*padding))),Image.Resampling.LANCZOS)
    im=Image.new("RGBA",(w,h))
    im.alpha_composite(symbol,((w-symbol.width)//2,(h-symbol.height)//2))
    return im
centered((960,720),.02).save(assets/"pbc-logo.webp",quality=89,method=6)
def app_icon(n):
    im=Image.new("RGBA",(n,n),(23,26,22,255))
    im.alpha_composite(centered((n,n)))
    return im
for n,name in [(16,"favicon-16x16.png"),(32,"favicon-32x32.png"),(48,"favicon-48x48.png"),(180,"apple-touch-icon.png"),(192,"icon-192.png"),(512,"icon-512.png")]:
    app_icon(n).save(assets/name,optimize=True)
app_icon(256).save(assets/"favicon.ico",sizes=[(16,16),(32,32),(48,48)],format="ICO")
print("LOGO_AND_ICONS_CREATED",[(p.name,p.stat().st_size) for p in assets.glob("*.png")])
# Social sharing card uses the supplied logo, not fabricated construction photography.
card=Image.new("RGB",(1200,630),(22,30,26))
draw=ImageDraw.Draw(card)
draw.rounded_rectangle((35,35,1165,595),radius=30,fill=(31,41,35),outline=(100,88,61),width=2)
draw.rectangle((75,535,1125,539),fill=(242,174,54))
symbol=centered((560,460),.03)
card.paste(symbol,(60,83),symbol)
def font(name,size):
    try:return ImageFont.truetype("C:/Windows/Fonts/"+name,size)
    except:return ImageFont.load_default()
bold=font("segoeuib.ttf",63)
regular=font("segoeui.ttf",31)
small=font("segoeuib.ttf",23)
draw.text((640,155),"Remodel your",font=bold,fill=(255,248,225))
draw.text((640,238),"home with",font=bold,fill=(255,248,225))
draw.text((640,321),"confidence.",font=bold,fill=(251,189,74))
draw.text((643,437),"Prescott & Prescott Valley",font=regular,fill=(226,225,207))
draw.text((643,482),"AZ ROC #343141",font=small,fill=(207,212,197))
card.save(assets/"pbc-social-card.jpg",quality=88,optimize=True)
manifest={
 "name":"Prescott's Best Construction - Remodeling",
 "short_name":"Prescott's Best",
 "description":"Remodeling planning and homeowner resources in Prescott and Prescott Valley.",
 "id":"/","start_url":"/","scope":"/","display":"standalone",
 "background_color":"#17231c","theme_color":"#17231c",
 "icons":[
   {"src":"/site-assets/icon-192.png","sizes":"192x192","type":"image/png"},
   {"src":"/site-assets/icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}]
}
(assets/"site.webmanifest").write_text(json.dumps(manifest,indent=2)+"\n",encoding="utf-8")
print("BRAND_ASSETS_DONE",[(p.name,p.stat().st_size) for p in assets.iterdir()])
