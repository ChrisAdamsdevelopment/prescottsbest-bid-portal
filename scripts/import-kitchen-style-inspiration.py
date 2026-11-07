"""Crop user-saved kitchen reference contact sheet and optimize user-saved stain boards.

All source images stay in D:\PrescottsBestConstruction\ASSETS\GENERATED_CONCEPTS_INBOX.
The kitchen views are from a modest-resolution contact sheet (not the original full-size boards):
they are useful inspiration thumbnails, NOT exact matched before/after or finish comparisons.
"""
from pathlib import Path
from PIL import Image,ImageFilter
import json,sys
repo=Path(__file__).resolve().parents[1]
folder=Path(sys.argv[1]) if len(sys.argv)>1 else Path(r"D:\PrescottsBestConstruction\ASSETS\GENERATED_CONCEPTS_INBOX")
sheet=folder/'contact_sheet_12_inspiration_cards.jpg'
original=Image.open(sheet).convert('RGB')
if original.size!=(1400,1520):raise SystemExit(f'Unexpected sheet dimensions {original.size}')
kitchen_root=repo/'public'/'site-assets'/'visual-explorer'/'B03-kitchen-style'
wood_root=repo/'public'/'site-assets'/'visual-explorer'/'wood-stain-boards'
kitchen_root.mkdir(parents=True,exist_ok=True);wood_root.mkdir(parents=True,exist_ok=True)
kitchen=[
 ('kitchen-light-room',30,85),
 ('kitchen-medium-room',485,85),
 ('kitchen-dark-room',940,85),
 ('kitchen-light-detail',30,442),
 ('kitchen-medium-detail',485,442),
 ('kitchen-dark-detail',940,442)]
log=[]
for slug,x,y in kitchen:
 crop=original.crop((x,y,x+430,y+290))
 assert crop.size==(430,290)
 # Optically upsample for browser display, but note original only contained 430px of detail.
 main=crop.resize((860,580),Image.Resampling.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.1,percent=60,threshold=3))
 for name,img,q in [(slug+'.webp',main,86),(slug+'-thumb.webp',crop,80)]:
  out=kitchen_root/name;img.save(out,'WEBP',quality=q,method=6)
  log.append({'file':str(out.relative_to(repo)).replace('\\','/'),'width':img.width,'height':img.height,'bytes':out.stat().st_size,'source':'contact_sheet_12_inspiration_cards.jpg'})
for filename,slug in [
 ('white_oak.png','white-oak-stain-reference'),
 ('maple.png','maple-stain-reference'),
 ('walnut.png','walnut-stain-reference'),
 ('alder.png','alder-stain-reference'),
 ('hickory.png','hickory-stain-reference'),
 ('red_oak.png','red-oak-stain-reference')]:
 original_board=Image.open(folder/filename).convert('RGB')
 if original_board.size!=(1122,1402):raise SystemExit(f'Unexpected board dimensions {filename} {original_board.size}')
 for suffix,width,q in [('',900,85),('-thumb',320,78)]:
  pic=original_board.resize((width,round(width*1402/1122)),Image.Resampling.LANCZOS)
  out=wood_root/(slug+suffix+'.webp')
  pic.save(out,'WEBP',quality=q,method=6)
  log.append({'file':str(out.relative_to(repo)).replace('\\','/'),'width':pic.width,'height':pic.height,'bytes':out.stat().st_size,'source':filename})
print(json.dumps({'imported':len(log),'primary_images':12,'files':log},indent=2))
