"""Create optimized web derivatives of user-provided AI concepts, preserving raw originals."""
from pathlib import Path
from PIL import Image,ImageOps
import json,shutil,hashlib
root=Path(r"D:\PrescottsBestConstruction")
src=root/"ASSETS"/"GENERATED_CONCEPTS_INBOX"
approved=root/"ASSETS"/"APPROVED_WEBSITE_IMAGES"
web=root/"05_WEBSITE_AND_TECH"/"PBC_BID_PORTAL"/"public"/"site-assets"/"concepts"
approved.mkdir(parents=True,exist_ok=True);web.mkdir(parents=True,exist_ok=True)
mapping={
 "kitchen_with_blank_wall.png":("kitchen-hero","Homepage hero","Illustrative Northern Arizona kitchen with warm white cabinets, wood island and window views"),
 "bathroom_showing_sink.png":("bathroom-remodel","Bathroom remodeling","Illustrative bathroom with pale vanity, large mirror and glass walk-in shower"),
 "kitchen.png":("kitchen-remodel","Kitchen remodeling","Illustrative remodeled kitchen with cream cabinets, stone island and mountain views"),
 "bathroom_facing_shower.png":("shower-conversion","Shower conversions","Illustrative walk-in shower with warm tile, glass doors and a handheld fixture"),
 "room_with_desk_office.png":("room-conversion","Garage or room conversion","Illustrative home-office garage conversion with workbench and wood flooring"),
 "looking_through_doorway.png":("finish-carpentry","Finish carpentry","Illustrative clean white interior door casing, baseboard and wood flooring"),
 "two_people_talking.png":("consultation","Homeowner project planning and first conversation","Illustrative scene of two fictional people discussing remodeling plans and material samples at a table"),
 "front_of_home.png":("local-home","About and local service-area introduction","Illustrative modest high-desert house exterior with natural rock landscaping at golden hour")
}
found={p.name for p in src.glob("*.png")}
assert found==set(mapping),f"Unexpected files: {found.symmetric_difference(set(mapping))}"
records=[]
for original,(slug,placement,alt) in mapping.items():
 p=src/original
 with Image.open(p) as im:
  im=ImageOps.exif_transpose(im).convert("RGB")
  if im.width<1000 or im.height<700:raise ValueError(f"Unexpectedly small: {original}")
  source=approved/original
  if not source.exists():shutil.copy2(p,source)
  assert hashlib.sha256(source.read_bytes()).digest()==hashlib.sha256(p.read_bytes()).digest()
  variants=[]
  for kind,maxwidth,quality in [('detail',1440,83),('card',680,80)]:
   copy=im.copy()
   if copy.width>maxwidth:copy.resize((maxwidth,round(copy.height*maxwidth/copy.width)),Image.Resampling.LANCZOS)
   copy.thumbnail((maxwidth,1800),Image.Resampling.LANCZOS)
   target=web/(slug+'-'+kind+'.webp')
   copy.save(target,format='WEBP',quality=quality,method=6)
   assert target.stat().st_size<400_000,(target,target.stat().st_size)
   variants.append({'filename':target.name,'width':copy.width,'height':copy.height,'bytes':target.stat().st_size})
  records.append({'source':original,'slug':slug,'placement':placement,'alt':alt,'kind':'AI-generated illustrative concept, not completed PBC work','sourceSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'variants':variants,'reviewStatus':'usable as labeled design inspiration; not verified construction proof'})
manifest=approved/'CONCEPT_IMAGE_PROVENANCE_2026-11-02.json'
manifest.write_text(json.dumps({'usePolicy':'Must visibly label design inspiration; do not represent as PBC real projects; never use for testimonials or before/after claims.','images':records},indent=2),encoding='utf-8')
print('INTEGRATED',len(records),'CONCEPTS',sum(len(x['variants']) for x in records),'WEBP_VARIANTS',sum(v['bytes'] for x in records for v in x['variants']),'BYTES',flush=True)
print('MANIFEST',manifest,flush=True)
